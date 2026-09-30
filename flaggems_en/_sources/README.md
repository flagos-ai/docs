# FlagGems Sphinx Documentation

This directory contains the Sphinx/MyST documentation for FlagGems.

## Directory Structure

```
docs-sphinx/
├── source/              # Documentation source
│   ├── conf.py          # Sphinx configuration
│   ├── index.md         # Entry point
│   ├── _static/         # Static files (CSS, images)
│   ├── _templates/      # Custom templates
│   ├── _ext/            # Custom Sphinx extensions
│   ├── getting-started/ # Documentation sections
│   ├── overview/
│   ├── usage/
│   ├── performance/
│   ├── references/
│   └── contribution/
└── build/               # Build output (generated)
```

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Build documentation
make html
# or
./build_docs.sh

# View documentation
# Open build/html/index.html in browser
```

## Live Preview

```bash
pip install sphinx-autobuild
sphinx-autobuild source build/html --watch ../conf
```

## Custom Directives

### operator-list

Generate operator table from `conf/operators.yaml`:

```markdown
```{operator-list}
:stage: stable
```
```

### benchmark-table

Display benchmark results:

```markdown
```{benchmark-table}
```
```

### coverage-data

List coverage reports:

```markdown
```{coverage-data}
```
```

## Internationalization (sphinx-intl)

```bash
# Extract translatable strings
sphinx-build -b gettext source build/gettext

# Create Chinese translation
sphinx-intl update -p build/gettext -l zh-cn

# Edit translations in source/locales/zh-cn/LC_MESSAGES/*.po

# Build Chinese version
sphinx-build -b html -D language=zh-cn source build/html/zh-cn
```

## ReadTheDocs Configuration

Copy the example config to repository root:

```bash
cp readthedocs.yaml.example ../../.readthedocs.yaml
```

Edit `.readthedocs.yaml` to customize for your project.