# Repository Guidelines

## Project Structure & Module Organization

This directory contains the FlagOS documentation homepage, built as one project by the shared `docs/conf.py` Sphinx configuration. Edit `index.md` for the landing page and `overview.md` for the English overview. The `chip_adaptation_guide/` tree contains cloud, edge, and shared adaptation guides; keep new pages in the existing numbered sections and update the relevant `index.md` toctree. Put diagrams and other page assets in `images/` or the closest guide-level `assets/` directory. Homepage styles and behavior belong in `_static/`; Chinese translations are maintained in `locale/zh_CN/LC_MESSAGES/*.po`.

## Build, Test, and Development Commands

Run commands from the repository root (`E:\BAAI\github\docs`), after installing `docs/requirements.txt`:

```powershell
$env:PROJECT="flagos_homepage"; sphinx-build -b html docs docs/_build/html
$env:PROJECT="flagos_homepage"; sphinx-build -b html -D language=zh_CN docs docs/_build/html/zh_CN
```

The first command validates the English homepage; the second validates the localized build. For stricter local validation, add `-W --keep-going`. There is no separate unit-test suite for this subtree; a successful Sphinx build and manual browser review are the primary checks. Translation catalogs can be regenerated with `sphinx-build -b gettext` followed by `sphinx-intl update`, and syntax statistics can be checked with `msgfmt --statistics`.

## Coding Style & Naming Conventions

Write MyST Markdown using the existing heading hierarchy, directives, and relative links. Use lowercase `snake_case` for new guide filenames (for example, `progress_overview.md`), descriptive alt text for images, and four-space indentation in directive content when needed. Reuse existing `sphinx-design` classes and `_static` CSS patterns before adding new styles. Keep English and Chinese page structure aligned where translations exist.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects consistent with history, such as `docs: update homepage links` or `Corrected overview`. Pull requests should explain the affected pages and language, link the relevant issue when applicable, include the exact build command used, and attach screenshots for layout or styling changes. Keep unrelated generated files, backups, and build output out of commits.
