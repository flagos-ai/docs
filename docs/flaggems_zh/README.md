# FlagGems Sphinx Documentation

本目录包含 FlagGems 的 Sphinx/MyST 文档。

## 目录结构

```
docs-sphinx/
├── source/              # 文档源文件
│   ├── conf.py          # Sphinx 配置
│   ├── index.md         # 入口文件
│   ├── _static/         # 静态文件（CSS、图片）
│   ├── _templates/      # 自定义模板
│   ├── _ext/            # 自定义 Sphinx 扩展
│   ├── getting-started/ # 文档章节
│   ├── overview/
│   ├── usage/
│   ├── performance/
│   ├── references/
│   └── contribution/
└── build/               # 构建产物（自动生成）
```

## 快速开始

```bash
# 安装依赖
pip install -r requirements.txt

# 构建文档
make html
# 或
./build_docs.sh

# 查看文档
# 在浏览器中打开 build/html/index.html
```

## 实时预览

```bash
pip install sphinx-autobuild
sphinx-autobuild source build/html --watch ../conf
```

## 自定义指令

### operator-list

从 `conf/operators.yaml` 生成算子表格：

```markdown
```{operator-list}
:stage: stable
```
```

### benchmark-table

展示性能测试结果：

```markdown
```{benchmark-table}
```
```

### coverage-data

列出覆盖率报告：

```markdown
```{coverage-data}
```
```

## 国际化（sphinx-intl）

```bash
# 提取可翻译字符串
sphinx-build -b gettext source build/gettext

# 创建中文翻译
sphinx-intl update -p build/gettext -l zh-cn

# 在 source/locales/zh-cn/LC_MESSAGES/*.po 中编辑翻译

# 构建中文版本
sphinx-build -b html -D language=zh-cn source build/html/zh-cn
```

## ReadTheDocs 配置

将示例配置复制到仓库根目录：

```bash
cp readthedocs.yaml.example ../../.readthedocs.yaml
```

编辑 `.readthedocs.yaml` 以自定义你的项目配置。
