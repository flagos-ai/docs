"""Project-specific Sphinx helpers for the FlagOS homepage."""

import json

from sphinx.addnodes import only, toctree
from sphinx.transforms.post_transforms import SphinxPostTransform


def _frontmatter_tags(app, docname):
    """Return Sphinx tags declared in MyST frontmatter for one document."""
    metadata = app.env.metadata.get(docname, {})
    raw_tags = metadata.get("tags", [])

    if isinstance(raw_tags, str):
        try:
            raw_tags = json.loads(raw_tags)
        except json.JSONDecodeError:
            raw_tags = [raw_tags]

    if isinstance(raw_tags, str):
        raw_tags = [raw_tags]

    return [tag for tag in raw_tags if isinstance(tag, str)]


def _eval_condition_with_page_tags(app, condition, page_tags):
    """Evaluate an ``only`` expression with temporary page-level tags."""
    added_tags = []
    for tag in page_tags:
        if not app.tags.has(tag):
            app.tags.add(tag)
            added_tags.append(tag)

    app.tags._condition_cache.clear()
    try:
        return app.tags.eval_condition(condition)
    finally:
        for tag in added_tags:
            app.tags.remove(tag)
        app.tags._condition_cache.clear()


class PageFrontmatterOnlyTransform(SphinxPostTransform):
    """Apply ``only`` directives using tags from the current MyST page."""

    default_priority = 49

    def run(self, **kwargs):
        docname = self.env.docname
        page_tags = _frontmatter_tags(self.app, docname)
        if not page_tags:
            return

        for node in list(self.document.findall(only)):
            try:
                keep = _eval_condition_with_page_tags(self.app, node.get("expr", ""), page_tags)
            except Exception:
                continue

            if keep:
                node.replace_self(node.children)
            else:
                node.parent.remove(node)


def _prune_inactive_only_toctrees(app, doctree):
    """Keep toctree relations in sync with active ``only`` branches.

    Sphinx records ``toctree`` relationships while parsing a document, before
    the ``only`` transform removes inactive branches. Rebuild the document's
    include list from toctree nodes whose enclosing ``only`` conditions are
    active. Page-level MyST ``tags`` frontmatter is treated as active while
    evaluating the current document.
    """
    docname = app.env.temp_data.get("docname")
    if not docname or docname not in app.env.toctree_includes:
        return

    page_tags = _frontmatter_tags(app, docname)
    active_includes = []
    found_conditional_toctree = False

    for toctree_node in doctree.findall(toctree):
        current = toctree_node.parent
        keep = True
        is_conditional = False

        while current is not None:
            if isinstance(current, only):
                is_conditional = True
                expr = current.get("expr", "")
                try:
                    if not _eval_condition_with_page_tags(app, expr, page_tags):
                        keep = False
                        break
                except Exception:
                    # Let Sphinx's own only transform report malformed expressions.
                    pass
            current = current.parent

        if is_conditional:
            found_conditional_toctree = True

        if keep:
            active_includes.extend(toctree_node.get("includefiles", []))

    if found_conditional_toctree:
        app.env.toctree_includes[docname] = active_includes

        compact_toc = app.env.tocs.get(docname)
        if compact_toc is not None:
            for only_node in list(compact_toc.findall(only)):
                expr = only_node.get("expr", "")
                try:
                    keep = _eval_condition_with_page_tags(app, expr, page_tags)
                except Exception:
                    continue
                if not keep and only_node.parent is not None:
                    only_node.parent.remove(only_node)


def setup(app):
    app.add_post_transform(PageFrontmatterOnlyTransform)
    app.connect("doctree-read", _prune_inactive_only_toctrees)
    return {"version": "0.1", "parallel_read_safe": True, "parallel_write_safe": True}
