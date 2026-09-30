# FlagAudio 发布说明

## v0.3.0

- **增强特性**

  - `gain` 算子将 `0 dB` 视为恒等增益。
  - 导入 `flag_audio` 不再需要安装 torchaudio，torchaudio 仅供测试辅助代码使用。

## v0.2.0

- **新增功能**

  - **音频效果** — add_noise, dcshift, mu_law_encoding。
  - **频谱分析** — amplitude_to_DB, spectral_centroid。
  - 支持多后端的音频信号处理算子。
  - 从原始音频到模型输入的完整处理链路。

- **增强功能**

  - 算子经过深度性能调优。
  - Triton 内核调用优化，减少启动开销。

## v0.1.0

FlagAudio 初始版本。

- **新增功能**

  - Audio 标准接口库，支持多后端。
  - 灵活的多后端支持机制。
