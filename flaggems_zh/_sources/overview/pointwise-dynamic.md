
# 关于逐点动态算子

## 1. 逐点操作 {#pointwise-operations}

逐点算子（Pointwise operators）比较容易并行化执行。
大多数并行计算编程指南的开篇都会使用计算两个连续向量的单点加和操作作为示例。
对于 [Triton 语言中的 `vector_add`](https://triton-lang.org/main/getting-started/tutorials/01-vector-add.html#sphx-glr-getting-started-tutorials-01-vector-add-py)
而言，很容易实现一种任务切分模式，让每个**块集群（Cooperative Thread Array，CTA）**
从每个输入向量中读入一个连续的范围，向输出向量中的一个连续范围写出结果。

但是，逐点算子的实际使用场景可能比这复杂得多。例如：

- 输入的张量可能是连续的；它们可能在内存中是连续的，但逐行遍历时并不连续；
  或者这些张量可能不是稠密张量（dense tensor）；
  又或者这些张量可能具有内部重叠。
- 输入的张量可能具有任意的维数（dimension）且/或不同张量之间的维数互不相同。
  我们并不总能将它们视为形状（shape）相同的连续向量。

*FlagGems* 给出的解决方案是基于代码生成来解决这类问题。方案设计的原理包括：

- 逐点运算通常是访存密集类型的计算，因此应该避免通过复制张量来使之成为连续向量。
- 逐点算子要支持任意秩（rank）、大小（size）、步长（stride）的张量，
  支持广播输入（broadcasting input）、混合张量甚至非张量的输入。
- 不同的逐点算子要使用相同的内部设施来减少样板文件代码，无论所指的设施是一个库，
  还是基于模板的代码生成机制，
- 上述共享的内部设施应该是可配置的，方便适配不同类型的后端（设备）。

团队最终给出的解决方案是 `@pointwise_dynamic` 修饰符。
这一修饰符可以为逐点算子提供一个公共的封装层，并提供生成 Triton 内核（kernel）的机制，
基于操作和输入的配置来构造不同的封装层。

## 2. 代码生成  {#code-generation}

`@pointwise_dynamic` 的基本用法是用来修饰一个带有返回值的 `triton.jit` 函数，
修饰符的作用是在输入与输出之间建立映射关系。
JIT 函数与带有 `__device__` 声明说明符的函数类似，这类函数可以从设备上调用。
我们会生成一个 Triton JIT 函数来调用它，将它视为 CUDA 核（带有 `__global__` 声明说明符的函数）
一样的实体，从全局内存中读取数据或者将数据写回全局内存。

为了支持不同秩（rank）、形状（shape）与/或步长（stride）的输入张量，我们提供输出张量的形状，
也就是逐点运算的任务空间（task-space），以及在不同维（dimension）上每个张量的步长信息。
形状与步长信息会被解析后以整数的形式传递给 Triton 内核。
由于 Triton 内核不支持元组（tuple）类型的参数，我们必须为形状与步长中的不同整数个数生成不同的内核。
尽管 Triton 从 3.3 版本开始支持元组类型的参数，它仍不支持对元组进行索引或者遍历这类操作。

在 Triton 内核中，我们基于任务矿建的形状将任务空间中的索引映射到张量的多索引（multi-index）之上。
接下来，我们基于张量在不同维上的步长，将张量的多索引映射成每个张量上的内存偏移。
例如，对于一个二元加（add）操作，假定张量的形状分别为 `(2, 3)` 和 `(2, 3)`，
任务空间维 `(2, 3)`，则 task-id 为 4 的任务会映射到任务空间中的 `(1, 1)`。
如果 `lhs` 的步长为 `(3, 1)`，则张量上的内存偏移为 `4`；
如果 `rhs` 的步长为 `(1, 2)`，则张量上的内存偏移为 `3`。

对于可广播但形状不同的多个张量，我们会首先广播形状信息以获得任务空间的形状，
将每个张量视为任务的形状，进而得到共享相同存储的新张量，但就新的形状而言，步长也会不同。

在大多数情况下，你可以将修饰过的 Triton JIT 函数视为一个代表该操作的标量函数。
不过，需要注意的是，生成的内核会使用 `tl.tensor` 作为输入来调用修饰后的函数。
因此，需要避免在函数的控制流语句（如 `if` 或 `while`）中使用 `tl.tensor` 进行条件判断，
因为 Triton 不支持在条件中使用非标量的张量数据。

在上面的描述中，我们将任务索引（整数）映射为每个张量的的内存偏移，
因为我们将逐点操作中的任务视为一维张量，并在各个 CTA 之间对其进行切分。
我们也提供一些其他任务空间视图和划分模式，不过出于文字简洁考虑，在此不一一赘述。

除内核本身之外，我们还为其生成封装层。
封装层会期望算子输出具有正确的形状、步长、数据类型（dtype）和设备元数据，
这样的输出可以继续参与计算。

## 3. 元数据计算  {#metadata-computation}

由于逐点算子在元数据计算方面执行类似的逻辑，因此我们将它实现为一个可被所有
`PointwiseDynamicFunction` 调用的公共函数。这一函数的主要任务是：

- **形状推测**：通过广播输入张量的形状推测输出的形状；
- **输出布局推理**：在必要时为输出张量推算一种合适的布局（步长顺序）；
- **类型提升**：根据预先设定的规则推测输出的数据类型（dtype）；
- **设备推测**：推测输出设备和要启动该内核的设备；
- **输出分配**：为输出分配内存；
- **推到任务空间的秩**：这是影响代码生成的一个方面，要依据输入参数来确定。
  在所有预先分配的张量都是稠密张量、彼此不重叠，并且在各维上尺寸与步长均相同时，
  此过程还会尝试将任务空间的维度缩减为 `1`。

`PointwiseDynamicFunction` 也可以接受预先分配的输出张量作为参数。
如果输出张量中包含预分配张量，系统会注意到其形状、布局、数据类型和设备信息，
并执行相应的检查。

元数据计算这一步骤可被略过，不过如果忽略元数据计算，你需要确保输出参数包含正确的元数据，
并且已经预分配，并且你必须提供任务空间的秩。

## 4. 缓存和派发 {#caching-and-dispatching}

修饰符 `@pointwise_dynamic` 会返回一个 `PointwiseDynamicFunction` 对象，
这一对象会为所有被修饰的函数扮演代理中介的角色。
该对象会缓存所生成的 Python 模块，并完成对这些模块的派发。

派发的结果仅仅取决于任务空间的秩，而不是任务空间的形状。

## 5. `pointwise_dynamic` 修饰符的使用

### 5.1 基础用法

使用 `@pointwise_dynamic` 来修饰逐点算子函数可以避免手动执行张量寻址、张量读写、
并行平铺、算子广播、动态维度、非连续存储、类型提升等动作。

例如，在下面的代码中，你只需要提供描述计算逻辑（负载）的 Triton JIT 函数，
被修饰的函数会将 Torch 张量作为输入和输出，并且满足广播、类型提升需求。

```python
@pointwise_dynamic(promotion_methods=[(0, "COMPLEX_TO_FLOAT")])
@triton.jit
def abs_func(x):
    return tl.abs(x)
```

由于被修饰的函数无法为代码生成提供足够的信息，我们会通过为 `pointwise_dynamic`
传递参数来提供必要的信息。

### 5.2 张量与非张量

默认情况下，`@pointwise_dynamic` 会将每个参数都视为一个张量，并生成读写操作的代码。
不过你也可以通过为参数 `is_tensor` 传递一个布尔值列表来进行配置，
标示是否对应的参数是一个张量。

对于非张量参数，其类型可以通过向修饰符传递 `dtypes` 来指定，尽管这一动作不是必需的。
对于张量参数，`dtypes` 参数中对应的值会被忽略，因为其具体类型是动态确定的，
Triton 会根据具体类型来完成派发。

例如，在下面的代码中，参数 `alpha` 被指定为一个非张量的浮点数，而参数 `x` 和 `y`
被指定为张量参数。

```python
@pointwise_dynamic(
    is_tensor=[True, True, False],
    dtypes=[None, None, float],
    promotion_methods=[(0,"DEFAULT")]
)
@triton.jit
def add_func(x, y, alpha):
    return x + y * alpha

a = torch.randn(128, 256, device="cuda")
b = torch.randn(256, device="cuda")
add_func(a, b, 0.2)
```

### 5.3 输出数据类型  {#output-dtypes}

为了让逐点算子能够正确地根据数据类型来为输出参数分配空间，需要指定 `promotion_methods` 参数。
由于算子可能会依据某种规则来基于输入数据类型来决定输出的数据类型，
与直接指定输出的数据类型相比，指定判定规则的表达能力会更强一些。

`promotion_methods` 是一个列表，其中每个元素是一个元组，对应一个输出。
元组中进一步包含若干参数索引和一个类型提升方法枚举值。
参数索引是一个整数，用来给出参数的位置，其含义取决于类型提升方法。

类型提升方法（字符串或枚举值）用来标记类型提升方法。

- `DEFAULT` 是类型提升的默认规则，对于大多数数值操作而言都是适用的；
- `NO_OPMATH` 意味着直接复制数据类型，适用于非数值操作（如数据拷贝）；
- `INT_TO_FLOAT` 显式要求将整数提升为浮点数；
- `ALWAYS_BOOL` 显式要求将类型提升为布尔值；
- `COMPLEX_TO_FLOAT` 显式要求将复数值转换为浮点值；
- `BOOL_TO_LONG` 显式要求将布尔值提升为长整数值。

```python
class ELEMENTWISE_TYPE_PROMOTION_KIND(Enum):
    DEFAULT = (0,)
    NO_OPMATH = (1,)
    INT_TO_FLOAT = (2,)
    ALWAYS_BOOL = (3,)
    COMPLEX_TO_FLOAT = (4,)
    BOOL_TO_LONG = (5,)
```

类型提升示例：

| 提升方法           | 算子示例                      |
| ------------------ | ----------------------------- |
| `DEFAULT`          | `add`                         |
| `NO_OPMATH`        | ` where`、`nextafter`、`cat`  |
| `INT_TO_FLOAT`     | `sin`                         |
| `ALWAYS_BOOL`      | `eq`                          |
| `COMPLEX_TO_FLOAT` | `abs`                         |
| `BOOL_TO_LONG`     | `pow`                         |

### 5.4 输出参数个数  {#number-of-outputs}

对于需要输出多个张量的逐点运算而言，我们需要通知 `pointwise_dynamic` 输出参数个数，
这样修饰符逻辑才能生成用来保存输出张量的代码。
注意，对于输入参数的个数，修饰符逻辑能够根据 `dtypes` 的 `is_tensor` 数组长度进行推算。

```python
@pointwise_dynamic(
    promotion_methods=[
        ((0, 1), "DEFAULT"),
        ((0, 1), "DEFAULT"),
    ],
    num_outputs=2,
)
@triton.jit
def polar_kernel(abs, angle):
    real = abs * tl.cos(angle)
    imag = abs * tl.sin(angle)
    return real, imag
```

## 6 使用 `PointwiseDynamicFunction`

### 6.1 基本用法

用户可以使用与被修饰函数相同的函数签名格式来调用 `PointwiseDynamicFunction`，
正如前面的示例所展示的那样。

### 6.2 原地操作与输出参数

由于 `@pointwise_dynamic` 修饰符会生成封装逻辑，将算子的输出作为参数，
我们可以用它来实现原地（in-place）计算操作。
对于所有的 `PointwiseDynamicFunction` 对象，你都可以使用关键字参数（keyword aruments）
将输出参数传递给它。为了区分输入参数和输出参数，我们遵循一个基本的原则：
所有输入参数都要使用位置参数（positional arguments）来传递，
而所有输出参数都要使用关键字参数来传递。

输出参数的命名约定为 `out{output_index}`。
由于被修饰的函数没有为返回值（输出参数）命名，这里的规则只是用 `out`
加上输出参数的索引。

我们可以使用这一机制来实现原地操作。例如：

```python
@pointwise_dynamic(is_tensor=[True, True, False], promotion_methods=[(0, 1, "DEFAULT")])
@triton.jit
def add_func(x, y, alpha):
    return x + y * alpha

def add_(A, B, *, alpha=1):
    return add_func(A, B, alpha, out0=A)
```

我们也可以为算子传递预分配的输出张量，这些张量不在输入张量之内。
例如：

```python
@pointwise_dynamic(is_tensor=[True, True, False], promotion_methods=[(0, 1, "DEFAULT")])
@triton.jit
def add_func(x, y, alpha):
    return x + y * alpha

def add_(A, B, *, alpha=1, out=None):
    return add_func(A, B, alpha, out=out)
```

注意，在这里，你必须确保输出参数具有正确的元数据。

### 6.3 手动实例化 {#manual-instantiation}

对于某些操作，你可能想要跳过元数据计算这一步，尤其是处理过程会缩减任务空间的秩时。
这时你希望手动准备所有输入和输出。
你可以使用特定的任务秩来调用 `PointwiseDynamicFunction` 的 `instantiate()` 方法，
得到一个特定的、被缓存的函数，并直接调用这一函数。

例如，算子 `flip` 不能算是一个逐点算子，原因是其输出中的每个元素仅仅依赖于输入中对应位置的元素。
不过，如果我们可以使用负的步长加上移位后的数据指针为输入张量创建一个视图，
这一操作也可以利用逐点复制逻辑来实现。
这就是我们使用 `pointwise_dynamic` 来实现它的方式。

```python
@pointwise_dynamic(is_tensor=[True], promotion_methods=[(0, "DEFAULT")])
@triton.jit
def copy_func(x):
    return x

def flip(A: torch.Tensor, dims) -> torch.Tensor:
    strides = list(A.stride())
    flip_dims_b = [False for _ in A.stride()]
    for dim in dims:
        assert (
            dim >= -A.dim() and dim < A.dim()
        ), "Dimension out of range (expected to be in range of [{}, {}], but got {})".format(
            -A.dim(), A.dim() - 1, dim
        )
        assert not flip_dims_b[
            dim
        ], "dim {} appears multiple times in the list of dims".format(dim)
        flip_dims_b[dim] = True
    n = 0
    offset = 0
    for i in range(len(flip_dims_b)):
        if flip_dims_b[i] and A.size(i) > 1 and A.stride(i) != 0:
            offset += strides[i] * (A.shape[i] - 1)
            strides[i] = -strides[i]
            n += 1
    if n == 0 or A.numel() <= 1:
        return A.clone()
    out = torch.empty_like(A)
    # a flipped view of A
    flipped_A = StridedBuffer(A, strides=strides, offset=offset)

    overload = copy_func.instantiate(A.ndim)
    overload(flipped_A, out0=out)
    return out
```
