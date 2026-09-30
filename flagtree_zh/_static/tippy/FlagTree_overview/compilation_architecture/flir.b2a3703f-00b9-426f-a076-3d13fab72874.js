selector_to_html = {"a[href=\"#id2\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u5728\u7f16\u8bd1\u7ba1\u7ebf\u4e2d\u7684\u4f4d\u7f6e<a class=\"headerlink\" href=\"#id2\" title=\"Link to this heading\">#</a></h2><p>\u4e0b\u56fe\u5c55\u793a\u4e86 FLIR \u5728\u7f16\u8bd1\u7ba1\u7ebf\u4e2d\u7684\u4f4d\u7f6e\u3002</p><p><a data-lightbox=\"image-set\" href=\"../../_images/flagtree_position.png\">\n<img alt=\"alt text\" src=\"../../_images/flagtree_position.png\"/></a>\n</p>", "a[href=\"#id1\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6982\u8ff0<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FLIR \u662f\u4e00\u4e2a\u591a\u540e\u7aef\u7edf\u4e00\u7684\u4e2d\u95f4\u5c42\uff0c\u4f5c\u4e3a\u5c06 Triton \u6269\u5c55\u4e2d\u95f4\u8868\u793a\uff08\u4f8b\u5982 Hints\u3001Ops \u548c TLE\uff09lowering \u5230\u786c\u4ef6\u7279\u5b9a\u65b9\u8a00\u7684\u4e2d\u5fc3\u67a2\u7ebd\u3002\u5f53\u4f60\u4f7f\u7528 Hints \u548c TLE \u7279\u6027\u65f6\uff0cFLIR \u7279\u6027\u4f1a\u81ea\u52a8\u4f7f\u7528\uff0c\u65e0\u9700\u4efb\u4f55\u7528\u6237\u5e72\u9884\u3002</p>", "a[href=\"#id3\"]": "<h2 class=\"tippy-header\" style=\"margin-top: 0;\">\u6838\u5fc3\u80fd\u529b<a class=\"headerlink\" href=\"#id3\" title=\"Link to this heading\">#</a></h2>", "a[href=\"#flir\"]": "<h1 class=\"tippy-header\" style=\"margin-top: 0;\">FLIR\uff1a\u7edf\u4e00\u4e2d\u95f4\u5c42<a class=\"headerlink\" href=\"#flir\" title=\"Link to this heading\">#</a></h1><h2>\u6982\u8ff0<a class=\"headerlink\" href=\"#id1\" title=\"Link to this heading\">#</a></h2><p>FLIR \u662f\u4e00\u4e2a\u591a\u540e\u7aef\u7edf\u4e00\u7684\u4e2d\u95f4\u5c42\uff0c\u4f5c\u4e3a\u5c06 Triton \u6269\u5c55\u4e2d\u95f4\u8868\u793a\uff08\u4f8b\u5982 Hints\u3001Ops \u548c TLE\uff09lowering \u5230\u786c\u4ef6\u7279\u5b9a\u65b9\u8a00\u7684\u4e2d\u5fc3\u67a2\u7ebd\u3002\u5f53\u4f60\u4f7f\u7528 Hints \u548c TLE \u7279\u6027\u65f6\uff0cFLIR \u7279\u6027\u4f1a\u81ea\u52a8\u4f7f\u7528\uff0c\u65e0\u9700\u4efb\u4f55\u7528\u6237\u5e72\u9884\u3002</p>"}
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
