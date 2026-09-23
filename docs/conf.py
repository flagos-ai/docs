"""
Shared Sphinx configuration using sphinx-multiproject.

To build each project, the ``PROJECT`` environment variable is used.

.. code:: console

   $ make html  # build default project
   $ PROJECT=flagos_homepage make html  # build the FlagOS homepage
   $ PROJECT=flagcx_en make html  # build the flagcx English project
   $ PROJECT=flaggems_en make html  # build the flaggems English project
   $ PROJECT=flaggems_vllm_en make html  # build the flaggems-vllm English project
   $ PROJECT=flagtree_en make html  # build the flagtree English project
   $ PROJECT=flagscale_en make html  # build the flagscale English project
   $ PROJECT=flagrelease_en make html  # build the flagrelease English project
   $ PROJECT=flagperf_en make html  # build the flagperf English project
   $ PROJECT=megatron_lm_fl_en make html  # build the megatron_lm_fl English project   
   $ PROJECT=vllm_plugin_fl_en make html  # build the vllm_plugin_fl English project
   $ PROJECT=transformer_engine_fl_en make html  # build the transformer_engine_fl English project
   $ PROJECT=verl_fl_en make html  # build the verl_fl English project
   $ PROJECT=flagos_robo_en make html  # build the flagos_robo English project
   $ PROJECT=onlinelaboratory_en make html  # build the onlinelaboratory English project
   $ PROJECT=flagcicd_en make html  # build the flagcicd English project
   $ PROJECT=flagdnn_en make html  # build the flagdnn English project
   $ PROJECT=flagblas_en make html  # build the flagblas English project
   $ PROJECT=flagfft_en make html  # build the flagfft English project
   $ PROJECT=flagsparse_en make html  # build the flagsparse English project
   $ PROJECT=flagtensor_en make html  # build the flagtensor English project
   $ PROJECT=flagaudio_en make html  # build the flagaudio English project
   $ PROJECT=pytorch_plugin_fl_en make html  # build the pytorch_plugin_fl English project
   $ PROJECT=sglang_plugin_fl_en make html  # build the sglang_plugin_fl English project
   $ PROJECT=flagquantum_en make html  # build the flagquantum English project
   $ PROJECT=kernelgenbench_en make html  # build the kernelgenbench English project

   $ PROJECT=flagos_zh make html  # build the Chinese project
   $ PROJECT=flagcx_zh make html  # build the flagcx Chinese project
   $ PROJECT=flaggems_zh make html  # build the flaggems Chinese project
   $ PROJECT=flaggems_vllm_zh make html  # build the flaggems-vllm Chinese project
   $ PROJECT=flagtree_zh make html  # build the flagtree Chinese project
   $ PROJECT=flagscale_zh make html  # build the flagscale Chinese project
   $ PROJECT=flagrelease_zh make html  # build the flagrelease Chinese project
   $ PROJECT=flagperf_zh make html  # build the flagperf Chinese project
   $ PROJECT=megatron_lm_fl_zh make html  # build the megatron_lm_fl Chinese project   
   $ PROJECT=vllm_plugin_fl_zh make html  # build the vllm_plugin_fl Chinese project
   $ PROJECT=transformer_engine_fl_zh make html  # build the transformer_engine_fl Chinese project
   $ PROJECT=verl_fl_zh make html  # build the transformer_engine_fl Chinese project
   $ PROJECT=flagos_robo_zh make html  # build the flagos_robo Chinese project
   $ PROJECT=onlinelaboratory_zh make html  # build the onlinelaboratory Chinese project
   $ PROJECT=flagcicd_zh make html  # build the flagcicd Chinese project
   $ PROJECT=flagdnn_zh make html  # build the flagdnn Chinese project
   $ PROJECT=flagblas_zh make html  # build the flagblas Chinese project
   $ PROJECT=flagfft_zh make html  # build the flagfft Chinese project
   $ PROJECT=flagsparse_zh make html  # build the flagsparse Chinese project
   $ PROJECT=flagtensor_zh make html  # build the flagtensor Chinese project
   $ PROJECT=flagaudio_zh make html  # build the flagaudio Chinese project
   $ PROJECT=pytorch_plugin_fl_zh make html  # build the pytorch_plugin_fl Chinese project
   $ PROJECT=sglang_plugin_fl_zh make html  # build the sglang_plugin_fl Chinese project
   $ PROJECT=flagquantum_zh make html  # build the flagquantum Chinese project
   $ PROJECT=kernelgenbench_zh make html  # build the kernelgenbench Chinese project

For more information read https://sphinx-multiproject.readthedocs.io/.
"""

import os
import sys

# Fix imports: Check different import methods
try:
    # First try sphinx_multiproject
    from sphinx_multiproject.utils import get_project
    print("INFO: Using sphinx_multiproject")
except ImportError:
    try:
        # Then try multiproject
        from multiproject.utils import get_project
        print("INFO: Using multiproject")
    except ImportError:
        # If both fail, create a simple get_project function
        print("WARNING: sphinx-multiproject not found. Using simple project selection.")
        def get_project(projects):
            return os.environ.get("PROJECT", "flagos_homepage")

sys.path.append(os.path.abspath("_ext"))

# Base extensions - only include actually installed ones
extensions = [
    "multiproject",  # Sphinx extension name, not Python module name
    "myst_parser",
    "sphinx_copybutton",
    "sphinx_design",
    # Temporarily comment out potentially problematic extensions
    # "sphinx_tabs.tabs",  # Module name might be different
    # "sphinx_prompt",
    "sphinx.ext.autodoc",
    "sphinx.ext.autosectionlabel",
    "sphinx.ext.extlinks",
    "sphinx.ext.intersphinx",
    # Comment out uninstalled extensions
    # "sphinxcontrib.httpdomain",
    # "sphinxcontrib.video",
    # "sphinxemoji.sphinxemoji",
    "sphinxext.opengraph",
    "sphinx_tippy",
    "sphinxcontrib.lightbox2",  # click-to-enlarge / lightbox for images
    "sphinx_tippy",
    "sphinx_togglebutton",
    "flagos_page_tags"
]

# Check and add actually installed extensions
try:
    import sphinx_tabs
    extensions.append("sphinx_tabs.tabs")
    print("INFO: sphinx_tabs extension added")
except ImportError:
    print("INFO: sphinx_tabs not available")

try:
    import sphinx_prompt
    extensions.append("sphinx_prompt")
    print("INFO: sphinx_prompt extension added")
except ImportError:
    print("INFO: sphinx_prompt not available")

# Define all projects with their configurations
multiproject_projects = {
    "flagos_homepage": {
        "use_config_file": False,
        "config": {
            "project": "FlagOS Documentation",
            "html_title": "FlagOS Documentation",
            "locale_dirs": ["locale/"],
        },
    },
    "flagcx_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagCX Documentation",
            "html_title": "FlagCX Documentation",
        },
    },
    "flaggems_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagGems Documentation",
            "html_title": "FlagGems Documentation",
            # Custom config values for extensions (paths relative to docs root)
            "operator_yaml_path": "shared/conf/operators.yaml",
            "benchmark_data_path": "shared/benchmark",
            "coverage_data_path": "shared/coverage",
            # Static files - include shared _static (for logo) and coverage
            "html_static_path": ["_static", "flaggems_en/_static", "shared/coverage"],
            "html_css_files": [
                "custom.css",  # 全局的，包含 logo 设置
                "css/custom.css",  # 项目特有的
                "https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator.min.css",
            ],
            # # Theme options
            # "html_theme": "sphinx_book_theme",
            # "html_theme_options": {
            #     "github_url": "https://github.com/flagos-ai/FlagGems",
            #     "use_edit_page_button": True,
            #     "show_nav_level": 2,
            #     "navigation_with_keys": True,
            #     "show_toc_level": 2,
            # },
            # "html_context": {
            #     "github_user": "flagos-ai",
            #     "github_repo": "FlagGems",
            #     "github_version": "master",
            #     "doc_path": "docs/flaggems_en",
            # },
            # MyST config
            "myst_enable_extensions": [
                "colon_fence",
                "deflist",
                "html_admonition",
                "html_image",
                "replacements",
                "smartquotes",
                "substitution",
                "tasklist",
            ],
            "myst_heading_anchors": 3,
            # Language
            "language": "en",
        },
    },
    "flaggems_vllm_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagGems-vLLM Documentation",
            "html_title": "FlagGems-vLLM Documentation",
        },
    },
    "flaggems_sglang_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagGems-sglang Documentation",
            "html_title": "FlagGems-sglang Documentation",
        },
    },
    "flagdnn_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagDNN Documentation",
            "html_title": "FlagDNN Documentation",
        },
    },
    "flagdnn_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagDNN 文档中心",
            "html_title": "FlagDNN 文档中心",
        },
    },
    "flagblas_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagBLAS Documentation",
            "html_title": "FlagBLAS Documentation",
        },
    },
    "flagblas_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagBLAS 文档中心",
            "html_title": "FlagBLAS 文档中心",
        },
    },
    "flagfft_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagFFT Documentation",
            "html_title": "FlagFFT Documentation",
        },
    },
    "flagfft_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagFFT 文档中心",
            "html_title": "FlagFFT 文档中心",
        },
    },
    "flagsparse_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagSparse Documentation",
            "html_title": "FlagSparse Documentation",
        },
    },
    "flagsparse_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagSparse 文档中心",
            "html_title": "FlagSparse 文档中心",
        },
    },
    "flagtensor_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagTensor Documentation",
            "html_title": "FlagTensor Documentation",
        },
    },
    "flagtensor_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagTensor 文档中心",
            "html_title": "FlagTensor 文档中心",
        },
    },
    "flagaudio_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagAudio Documentation",
            "html_title": "FlagAudio Documentation",
        },
    },
    "flagaudio_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagAudio 文档中心",
            "html_title": "FlagAudio 文档中心",
        },
    },
    "pytorch_plugin_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "PyTorch-Plugin-FL Documentation",
            "html_title": "PyTorch-Plugin-FL Documentation",
        },
    },
    "pytorch_plugin_fl_zh": {
        "use_config_file": False,
        "config": {
            "project": "PyTorch-Plugin-FL 文档中心",
            "html_title": "PyTorch-Plugin-FL 文档中心",
        },
    },
    "sglang_plugin_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "sglang-Plugin-FL Documentation",
            "html_title": "sglang-Plugin-FL Documentation",
        },
    },
    "sglang_plugin_fl_zh": {
        "use_config_file": False,
        "config": {
            "project": "sglang-Plugin-FL 文档中心",
            "html_title": "sglang-Plugin-FL 文档中心",
        },
    },
    "flagquantum_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagQuantum Documentation",
            "html_title": "FlagQuantum Documentation",
        },
    },
    "flagquantum_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagQuantum 文档中心",
            "html_title": "FlagQuantum 文档中心",
        },
    },
    "kernelgenbench_en": {
        "use_config_file": False,
        "config": {
            "project": "KernelGenBench Documentation",
            "html_title": "KernelGenBench Documentation",
        },
    },
    "kernelgenbench_zh": {
        "use_config_file": False,
        "config": {
            "project": "KernelGenBench 文档中心",
            "html_title": "KernelGenBench 文档中心",
        },
    },
    "flagtree_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagTree Documentation",
            "html_title": "FlagTree Documentation",
        },
    },
    "flagscale_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagScale Documentation",
            "html_title": "FlagScale Documentation",
        },
    },
    "flagrelease_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagRelease Documentation",
            "html_title": "FlagRelease Documentation",
        },
    },
    "flagperf_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagPerf Documentation",
            "html_title": "FlagPerf Documentation",
        },
    },
    "megatron_lm_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "Megatron-LM-FL Documentation",
            "html_title": "Megatron-LM-FL Documentation",
        },
    },
    "vllm_plugin_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "VLLM-Plugin-FL Documentation",
            "html_title": "VLLM-Plugin-FL Documentation",
        },
    },
    "transformer_engine_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "Transformer-Engine-FL Documentation",
            "html_title": "Transformer-Engine-FL Documentation",
        },
    },
    "verl_fl_en": {
        "use_config_file": False,
        "config": {
            "project": "verl-FL Documentation",
            "html_title": "verl-FL Documentation",
        },
    },
    "flagos_robo_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagOS-Robo Documentation", 
            "html_title": "FlagOS-Robo Documentation",
        },
    },
    "onlinelaboratory_en": {
        "use_config_file": False,
        "config": {
            "project": "Online Laboratory Documentation",
            "html_title": "Online Laboratory Documentation",
        },
    },
    "flagcicd_en": {
        "use_config_file": False,
        "config": {
            "project": "FlagCICD Documentation",
            "html_title": "FlagCICD Documentation",
        },
    },
    # "flagos_zh": {
    #     "use_config_file": False,
    #     "config": {
    #         "project": "FlagOS 文档中心",
    #         "html_title": "FlagOS 文档中心",
    #     },
    # },
    "flagcx_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagCX 文档中心",
            "html_title": "FlagCX 文档中心",
        },
    },
    "flaggems_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagGems 文档中心",
            "html_title": "FlagGems 文档中心",
            # Custom config values for extensions (paths relative to docs root)
            "operator_yaml_path": "shared/conf/operators.yaml",
            "benchmark_data_path": "shared/benchmark",
            "coverage_data_path": "shared/coverage",
            # Static files - include shared _static (for logo) and coverage
            "html_static_path": ["_static", "flaggems_zh/_static", "shared/coverage"],
            "html_css_files": [
                "custom.css",  # 全局的，包含 logo 设置
                "css/custom.css",  # 项目特有的
                "https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator.min.css",
            ],
            # # Theme options
            # "html_theme": "sphinx_book_theme",
            # "html_theme_options": {
            #     "github_url": "https://github.com/flagos-ai/FlagGems",
            #     "use_edit_page_button": True,
            #     "show_nav_level": 2,
            #     "navigation_with_keys": True,
            #     "show_toc_level": 2,
            # },
            # "html_context": {
            #     "github_user": "flagos-ai",
            #     "github_repo": "FlagGems",
            #     "github_version": "master",
            #     "doc_path": "docs/flaggems_zh",
            # },
            # MyST config
            "myst_enable_extensions": [
                "colon_fence",
                "deflist",
                "html_admonition",
                "html_image",
                "replacements",
                "smartquotes",
                "substitution",
                "tasklist",
            ],
            "myst_heading_anchors": 3,
            # Language
            "language": "zh",
        },
    },
    "flaggems_vllm_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagGems-vLLM 文档中心",
            "html_title": "FlagGems-vLLM 文档中心",
        },
    },
    "flagtree_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagTree 文档中心",
            "html_title": "FlagTree 文档中心",
        },
    },
    "flagscale_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagScale 文档中心",
            "html_title": "FlagScale 文档中心",
        },
    },
    "flagrelease_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagRelease 文档中心",
            "html_title": "FlagRelease 文档中心",
        },
    },
    "flagperf_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagPerf 文档中心",
            "html_title": "FlagPerf 文档中心",
        },
    },
    "megatron_lm_fl_zh": {
        "use_config_file": False, 
        "config": {
            "project": "Megatron-LM-FL 文档中心",
            "html_title": "Megatron-LM-FL 文档中心",
        },
    },
    "vllm_plugin_fl_zh": {
        "use_config_file": False,
        "config": {
            "project": "VLLM-Plugin-FL 文档中心",
            "html_title": "VLLM-Plugin-FL 文档中心", 
        },
    },
    "transformer_engine_fl_zh": {
        "use_config_file": False,
        "config": {
            "project": "Transformer-Engine-FL 文档中心",
            "html_title": "Transformer-Engine-FL 文档中心", 
        },
    },
    "verl_fl_zh": {
        "use_config_file": False,
        "config": {
            "project": "verl-FL 文档中心",
            "html_title": "verl-FL 文档中心", 
        },
    },
    "flagos_robo_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagOS-Robo 文档中心",
            "html_title": "FlagOS-Robo 文档中心",
        },
    },
    "onlinelaboratory_zh": {
        "use_config_file": False,
        "config": {
            "project": "线上实验室文档中心",
            "html_title": "线上实验室文档中心",
        },
    },
    "flagcicd_zh": {
        "use_config_file": False,
        "config": {
            "project": "FlagCICD 文档中心",
            "html_title": "FlagCICD 文档中心",
        },
    },
}

docset = get_project(multiproject_projects)

# Add project-specific _ext directory for custom extensions (FlagGems)
if docset in ["flaggems_en", "flaggems_zh"]:
    project_ext_path = os.path.abspath(os.path.join(docset, "_ext"))
    sys.path.insert(0, project_ext_path)
    print(f"INFO: Added {project_ext_path} to sys.path for {docset}")

    # Add custom extensions for FlagGems (must be in global extensions list)
    try:
        import operator_list
        import benchmark_table
        import coverage_data
        extensions.extend(["operator_list", "benchmark_table", "coverage_data"])
        print(f"INFO: Added FlagGems custom extensions for {docset}")
    except ImportError as e:
        print(f"WARNING: Could not import FlagGems extensions: {e}")

ogp_site_name = "KernelGen Documentation"
ogp_use_first_image = True
ogp_image = "https://docs.readthedocs.io/en/latest/_static/img/logo-opengraph.png"
ogp_custom_meta_tags = (
    '<meta name="twitter:card" content="summary_large_image" />',
)
ogp_enable_meta_description = True
ogp_description_length = 300

# templates_path = ["_templates"]
html_baseurl = os.environ.get("READTHEDOCS_CANONICAL_URL", "/")

master_doc = "index"
copyright = '2026, FlagOS Community'
author = 'FlagOS Community'
release = '1.0.0'
# release = version

# Exclude patterns - exclude all other project directories
exclude_patterns = [
    "_build",
    "shared",
    "_includes",
    "chip_adaptation_guide/_shared",
    "chip_adaptation_guide/TODO.md",
    "chip_adaptation_guide_toctree_backup",
]
all_projects = list(multiproject_projects.keys())
for project in all_projects:
    if project != docset:
        exclude_patterns.append(project)
if docset in ["flagrelease_en", "flagrelease_zh"]:
    exclude_patterns.append("model_readmes")

# flagcicd 项目：排除管理员专用页面（用户管理、模型管理）
if docset in ["flagcicd_en", "flagcicd_zh"]:
    exclude_patterns.extend([
        "function-description/user-management.md",
        "function-description/model-management.md",
        "operation-guide/user-management.md",
        "operation-guide/model-management.md",
    ])

default_role = "obj"
intersphinx_cache_limit = 14
intersphinx_timeout = 3
intersphinx_mapping = {
    "python": ("https://docs.python.org/3.10/", None),
    "sphinx": ("https://www.sphinx-doc.org/en/master/", None),
}

intersphinx_disabled_reftypes = ["*"]

myst_frontmatter_process = "yaml"

myst_enable_extensions = [
    "dollarmath",
    "amsmath",
    "deflist",
    "fieldlist",
    "html_admonition",
    "html_image",
    "colon_fence",
    "smartquotes",
    "replacements",
    # "linkify",
    "strikethrough",
    "substitution",
    "tasklist",
    "attrs_inline",
    "attrs_block",
    # "substitution",
]

htmlhelp_basename = "KernelGendoc"
latex_documents = [
    (
        "index",
        "KernelGen.tex",
        "KernelGen Documentation",
        "KernelGen Team",
        "manual",
    ),
]
man_pages = [
    (
        "index",
        "kernelgen",
        "KernelGen Documentation",
        ["KernelGen Team"],
        1,
    )
]

# Set language based on project suffix or environment variable (sphinx-intl support)
# language = os.environ.get("READTHEDOCS_LANGUAGE", "en") if docset == "flagos_homepage" else ("en" if docset.endswith("_en") else "zh_CN")
language = "en"

# Detect the actual build language from Read the Docs environment variable
# Falls back to the language config variable for local builds
CURRENT_LANGUAGE = os.getenv("READTHEDOCS_LANGUAGE", language)

# if docset == "flagos_homepage":
#     is_zh = CURRENT_LANGUAGE in ["zh_CN", "zh", "zh-cn"]
# else:
#     is_zh = docset.endswith("_zh")
# lang_prefix = "zh-cn" if is_zh else "en"

# # 定义 myst_substitutions
# myst_substitutions = {
#     "lang_prefix": lang_prefix,
# }

# locale_dirs = [
#     f"{docset}/locale/",
# ]
gettext_compact = False

html_short_title = ""

# ============================================================================
# HTML THEME CONFIGURATION - DIFFERENT THEMES FOR DIFFERENT PROJECTS
# ============================================================================

# Only flagos_homepage uses pydata_sphinx_theme, all others use sphinx_book_theme
if docset == "flagos_homepage":
    html_theme = "pydata_sphinx_theme"
else:
    html_theme = "sphinx_book_theme"

# Common static paths
html_static_path = ["_static", f"{docset}/_static"]
html_css_files = ["custom.css", "homepage.css"]
if docset == "flagos_homepage":
    html_css_files.append("guide.css")
html_js_files = []

# html_logo = "img/logo.png"
html_favicon = "_static/favicon.svg"

# Theme-specific configurations
if html_theme == "pydata_sphinx_theme":
    # PyData Sphinx Theme configuration for flagos_homepage

    # Set logo based on language (sphinx-intl support)
    # Read the Docs sets READTHEDOCS_LANGUAGE environment variable during builds
    # ReadTheDocs uses lowercase codes (zh, zh-cn), while Sphinx uses zh_CN

    # Debug output
    print(f"DEBUG: CURRENT_LANGUAGE = '{CURRENT_LANGUAGE}'")
    print(f"DEBUG: language = '{language}'")
    print(f"DEBUG: READTHEDOCS_LANGUAGE env = '{os.getenv('READTHEDOCS_LANGUAGE', 'NOT SET')}'")
    print(f"DEBUG: Is Chinese? {CURRENT_LANGUAGE in ['zh_CN', 'zh', 'zh-cn']}")

    if CURRENT_LANGUAGE in ["zh_CN", "zh", "zh-cn"]:
        logo_config = {
            "text": "文档中心",
            "image_light": "_static/logo-zh-light.svg",
            "image_dark": "_static/logo-zh-dark.svg",
        }
        print("DEBUG: Using CHINESE logo config")
    else:
        # Default to English configuration for all other languages
        logo_config = {
            "text": "Documentation",
            "image_light": "_static/logo-en-light.svg",
            "image_dark": "_static/logo-en-dark.svg",
        }
        print("DEBUG: Using ENGLISH logo config")

    html_theme_options = {
        "logo": logo_config,
        "home_page_in_toc": True,
        "use_download_button": False,
        "repository_url": "https://github.com/flagos-ai/KernelGen",
        "use_repository_button": True,
        "secondary_sidebar_items": {
            "**": ["page-toc"],
            "flagos_homepage/index": [],
        },
        "show_toc_level": 2,
        "footer_start": ["copyright"],
        "footer_end": [],
        "show_sphinx": False,
        "navbar_end": ["navbar-icon-links"]
    }
    
    # Keep the FlagOS homepage clean while enabling page-local TOC elsewhere.
    
    # html_sidebars is only for PyData Sphinx Theme
    html_sidebars = {}
    for project in all_projects:
        html_sidebars[f"{project}/index"] = []
    
    # html_context is only applied to PyData Sphinx Theme
    html_context = {
        "default_mode": "light"
    }

    # No additional JS files needed for portal homepage
    html_js_files = []

else:
    # Sphinx Book Theme configuration for all other projects

    # # repo URL per project
    # repository_urls = {
    #     "flagcx_en": "https://github.com/flagos-ai/FlagCX",
    #     "flagcx_zh": "https://github.com/flagos-ai/FlagCX",
    #     "flaggems_en": "https://github.com/flagos-ai/FlagGems",
    #     "flaggems_zh": "https://github.com/flagos-ai/FlagGems",
    #     "flagtree_en": "https://github.com/flagos-ai/FlagTree",
    #     "flagtree_zh": "https://github.com/flagos-ai/FlagTree",
    #     "flagrelease_en": "https://github.com/flagos-ai/FlagRelease",
    #     "flagrelease_zh": "https://github.com/flagos-ai/FlagRelease",
    #     "flagperf_en": "https://github.com/flagos-ai/FlagPerf",
    #     "flagperf_zh": "https://github.com/flagos-ai/FlagPerf",
    # }
    
    # # Obtain the current repo URL, if failed, set the default value
    # current_repo_url = repository_urls.get(docset, "https://github.com/flagos-ai")

    if docset.endswith("_en"):
        main_site_url = "https://docs.flagos.io/en/latest/"
        main_site_text = "Back to FlagOS Documentation"
    else:
        main_site_url = "https://docs.flagos.io/zh-cn/latest/"
        main_site_text = "返回 FlagOS 文档"

    templates_path = ["_templates"]

    # Logo configuration per project
    if docset in ["flagcicd_en", "flagcicd_zh"]:
        logo_config = {
            "image_light": "_static/flagcicd-logo-light.svg",
            "image_dark": "_static/flagcicd-logo-dark.svg",
        }
    else:
        logo_config = {
            "image_light": "_static/logo-en-light.svg",
            "image_dark": "_static/logo-en-dark.svg",
        }

    # Sphinx Book Theme configuration for all other projects
    html_theme_options = {
        "logo": logo_config,
        "home_page_in_toc": True,
        "use_download_button": False,
        "repository_url": "https://github.com/flagos-ai/docs",
        "use_edit_page_button": True,
        "use_repository_button": True,
        "navbar_center": ["back_to_main.html"],
        # "default_mode": "light",
        }

    html_context = {
        "main_site_url": main_site_url,
        "main_site_text": main_site_text,
        "default_mode": "light"
    }

    # No html_sidebars for Sphinx Book Theme
    html_sidebars = {}
    # No html_context for Sphinx Book Theme
    html_last_updated_fmt = '%b %d, %Y'

rst_epilog = """
.. |org_brand| replace:: KernelGen Community
.. |com_brand| replace:: KernelGen for Business
.. |git_providers_and| replace:: GitHub, Bitbucket, and GitLab
.. |git_providers_or| replace:: GitHub, Bitbucket, or GitLab
"""

autosectionlabel_prefix_document = True

linkcheck_retries = 2
linkcheck_timeout = 1
linkcheck_workers = 10
linkcheck_ignore = [
    r"http://127\.0\.0\.1",
    r"http://localhost",
    r"https://github\.com.+?#L\d+",
]

extlinks = {
    "issue": ("https://github.com/armstrongttwalker-alt/test-i18n-KernelGen/issues/%s", "#%s"),
}

suppress_warnings = ["epub.unknown_project_files"]
