selector_to_html = {"a[href=\"#performance-datadase-backends\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">Performance Datadase Backends<a class=\"headerlink\" href=\"#performance-datadase-backends\" title=\"Link to this heading\">#</a></h1><p><em>FlagGems</em> implements a <code class=\"docutils literal notranslate\"><span class=\"pre\">LibCache</span></code> class for persisting performance benchmark data\ninto a database. The <code class=\"docutils literal notranslate\"><span class=\"pre\">LibCache</span></code> interacts with the database backend through\n<code class=\"docutils literal notranslate\"><span class=\"pre\">sqlalchemy</span></code>, a generic database abstraction library.</p><p>The connection to the backend database can be specified using the environment variable\n<code class=\"docutils literal notranslate\"><span class=\"pre\">FLAGGEMS_DB_URL</span></code>. This document shows the configurations for <em>SQLite3</em> and <em>PostgreSQL</em>,\nbut you can experiment with other DBMS in a similar way, if needed.</p>", "a[href=\"#postgresql\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">2. PostgreSQL<a class=\"headerlink\" href=\"#postgresql\" title=\"Link to this heading\">#</a></h2><p>As an embedded database, <em>SQLite3</em> doesn\u2019t support multi-writers at the same time.\nHowever, having multiple writers writing performace data is a common use case.\nFor this reason, we also support using <em>PostgreSQL</em> as the backend database.\nDifferent from the embedded database, <em>PostgreSQL</em> requires an additional setup\nstep before being used. You could refer to the\n<a class=\"reference external\" href=\"https://documentation.ubuntu.com/server/how-to/databases/install-postgresql/\">PostgreSQL document</a>\nfor setup instructions. Note that you have to install the <code class=\"docutils literal notranslate\"><span class=\"pre\">psycopg</span></code> Python\npackage before using <em>PostgreSQL</em>.</p><p>With a backend database like <em>PostgreSQL</em> in place, you can use it as a remote database\nto allow several <em>FlagGems</em> instances to connect to it at the same time\nand share benchmark results in this way.</p>", "a[href=\"#sqlite3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">1. SQLite3<a class=\"headerlink\" href=\"#sqlite3\" title=\"Link to this heading\">#</a></h2><p>The default backend is <em>SQLite3</em>, an embedded database.\nPlease make sure the library <code class=\"docutils literal notranslate\"><span class=\"pre\">sqlite3</span></code> has been installed before running any benchmarks.\nIf you want to store the database file in a specific place,\nyou can set the environment variable as shown below:</p>"}
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
