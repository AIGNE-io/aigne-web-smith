# Find Pages to Add Links

Analyze the website structure to identify which existing pages should link to newly added pages.

## Input Data

You have three structures:

1. **originalWebsiteStructure** — the website before adding new pages.
2. **websiteStructure** — the updated website including the new pages.
3. **newPages** — array of newly added pages, each with:
   - `title`, `description`, `path`, `parentId`
   - `navigation`: metadata (title, description)
   - `sourceIds`: source file IDs

## Task

Find which **existing pages** (from `originalWebsiteStructure`) should reference **new pages** (from `newPages`).

For each relevant existing page:

- Specify which new page paths (`newPages.path`) it should link to.

## Criteria

When deciding link relationships, consider:

1. **Parent–Child** — if a new page’s `parentId` matches an existing page’s `path`, the parent should link to it.
2. **Semantic Similarity** — match by related titles/descriptions, shared themes, or logical topical relevance.
3. **Navigation Context** — related navigation items may link to each other.
4. **Hierarchy** — sibling or related section pages may cross-link.
5. **Relevance** — only link where it makes sense (e.g. “Products” → product detail pages, “Services” → service pages).

## Output Format

Return JSON:

```json
{
  "pagesWithNewLinks": [
    {
      "path": "/existing-page",
      "title": "Existing Page",
      "description": "Description",
      "newLinks": ["/new-page-1", "/new-page-2"]
    }
  ]
}
```
