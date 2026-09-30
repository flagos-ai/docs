selector_to_html = {"a[href=\"#create-a-pr-for-your-code\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">4. Create a PR for your code<a class=\"headerlink\" href=\"#create-a-pr-for-your-code\" title=\"Link to this heading\">#</a></h2><p>When everything works as expected, it\u2019s time to submit a pull request (PR).\nIt\u2019s desirable to provide some end-to-end performance data in your PR description,\nin addition to a brief summary about what the operator does.</p>", "a[href=\"../getting-started/install.html\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Installing FlagGems<a class=\"headerlink\" href=\"#installing-flaggems\" title=\"Link to this heading\">#</a></h1><h2>1. Prerequisites<a class=\"headerlink\" href=\"#prerequisites\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#write-test-cases\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. Write test cases<a class=\"headerlink\" href=\"#write-test-cases\" title=\"Link to this heading\">#</a></h2><p>FlagGems uses <code class=\"docutils literal notranslate\"><span class=\"pre\">ctest</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">googletest</span></code> for C++ unit tests.\nAfter having finished the C++ wrapper, a corresponding C++ test case should be added.\nAdd your unit test in <code class=\"docutils literal notranslate\"><span class=\"pre\">ctests/test_triton_xxx.cpp</span></code> and <code class=\"docutils literal notranslate\"><span class=\"pre\">ctests/CMakeLists.txt</span></code>.\nFinally, build your test source and run it with\n<a class=\"reference internal\" href=\"#../testing/ctests\"><span class=\"xref myst\">C++ Tests</span></a>.</p>", "a[href=\"#add-a-c-wrapped-operator\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Add a C++ Wrapped Operator<a class=\"headerlink\" href=\"#add-a-c-wrapped-operator\" title=\"Link to this heading\">#</a></h1><p>To add a C++ wrapped operator, you need to first build FlagGems with C++ extensions enabled.\nPlease refer to <a class=\"reference internal\" href=\"../getting-started/install.html\"><span class=\"doc std std-doc\">installation</span></a> section\nfor detailed instructions on setting up <code class=\"docutils literal notranslate\"><span class=\"pre\">flag_gems</span></code> with C++ extensions enabled.</p>", "a[href=\"#running-the-c-test-cases\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">3. Running the C++ test cases<a class=\"headerlink\" href=\"#running-the-c-test-cases\" title=\"Link to this heading\">#</a></h2><p>If you build FlagGems with C++ extensions with cmake option <code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGGEMS_BUILD_CTESTS</span></code> set to <code class=\"docutils literal notranslate\"><span class=\"pre\">ON</span></code>,\nyou can run the ctest in the dir <code class=\"docutils literal notranslate\"><span class=\"pre\">FlagGems/build/cpython-3xx</span></code> with the following command:</p>", "a[href=\"#write-the-wrapper\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. Write the wrapper<a class=\"headerlink\" href=\"#write-the-wrapper\" title=\"Link to this heading\">#</a></h2><p>Follow the following steps to add a new C++ wrapped operator:</p>"}
skip_classes = ["headerlink", "sd-stretched-link"]

window.onload = function () {
    for (const [select, tip_html] of Object.entries(selector_to_html)) {
        const links = document.querySelectorAll(` ${select}`);
        for (const link of links) {
            if (skip_classes.some(c => link.classList.contains(c))) {
                continue;
            }

            tippy(link, {
                content: tip_html,
                allowHTML: true,
                arrow: true,
                placement: 'auto-start', maxWidth: 500, interactive: false,

            });
        };
    };
    console.log("tippy tips loaded!");
};
