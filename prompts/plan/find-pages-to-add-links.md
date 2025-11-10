# Find Pages to Add Links

Identify which existing pages in the website should link to newly added pages.

## Input

<websiteStructure>
{{originalWebsiteStructure}}
</websiteStructure>

<newPages>
{{newPages}}
</newPages>

## Task

1. Analyze <websiteStructure> (the full site structure).
2. Determine which existing pages should link to pages in <newPages>.
3. For each such page, add a newLinks property — an array of new page paths it should link to.
4. Return only those pages (a subset of <websiteStructure>) as pagesWithNewLinks.

Each item in pagesWithNewLinks must:

1. **Be an existing page** from <websiteStructure>
2. Include all its original properties (path, title, description, parentId, navigation, sourceIds)
3. Add newLinks: string[] (**non-empty**)

## Criteria

When adding links, consider:

1. Parent–Child — If a new page’s parentId matches a page’s path, that parent should link to it.
2. Semantic Similarity — Link related or thematically connected pages.
3. Navigation Context — Pages in related navigation areas may link.
4. Hierarchy — Sibling or section pages may cross-link.
5. Relevance — Add links only where it logically makes sense.

## Output Format

Return JSON:

```json
{
  "pagesWithNewLinks": [
    {
      "path": "/existing-page",
      "title": "Existing Page",
      "description": "Description",
      "parentId": null,
      "navigation": { "title": "Nav Title", "description": "Nav Description" },
      "sourceIds": ["source1", "source2"],
      "newLinks": ["/new-page-1", "/new-page-2"]
    }
  ]
}
```
