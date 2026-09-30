# FlagAudio Release Notes

## v0.3.0

- **Enhanced Features**

  - The `gain` operator treats `0 dB` as identity gain.
  - `flag_audio` can be imported without installing torchaudio; torchaudio is only required by the test helpers.

## v0.2.0

- **Added Features**

  - **Audio Effects** — add_noise, dcshift, mu_law_encoding.
  - **Spectral Analysis** — amplitude_to_DB, spectral_centroid.
  - Audio signal processing operators with multi-backend support.
  - Complete processing chain from raw audio to model input.

- **Enhanced Features**

  - Operators underwent deep performance tuning.
  - Triton kernel call optimization for reduced launch overhead.

## v0.1.0

Initial release of FlagAudio.

- **Added Features**

  - Audio-standard interface library with multi-backend support.
  - Flexible multi-backend support mechanism.