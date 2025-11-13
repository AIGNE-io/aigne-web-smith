# Task: Find Pages to Add Links

Determine which existing pages should link to newly added pages.

## Input

<websiteStructure>
{{originalWebsiteStructure}}
</websiteStructure>

<newPages>
{{newPages}}
</newPages>

<userFeedback>
{{allFeedback}}
</userFeedback>

## Steps

1. **Check <userFeedback> first.**  
   - If users explicitly specify linking (e.g., “link FAQ from About”), follow exactly.
2. **Analyze <websiteStructure>.**  
   Identify existing pages that should link to those in <newPages> using the rules below.
3. For each qualifying page, add a non-empty `newLinks` array containing new page paths.
4. Output only these updated pages (subset of <websiteStructure>) as `pagesWithNewLinks`.

Each item in `pagesWithNewLinks` must:
- Be an existing page from <websiteStructure>
- Retain all original properties (`path`, `title`, `description`, `parentId`, `navigation`, `sourceIds`)
- Include `newLinks: string[]`

## Linking Rules (in priority order)

1. **User Instructions** — Follow explicit <userFeedback>.  
2. **Parent–Child** — If a new page’s `parentId` equals a page’s `path`, the parent links to it.  
3. **Semantic Similarity** — Link thematically related pages (e.g., “About” ↔ “Team”).  
4. **Navigation Context** — Pages in the same navigation group may link.  
5. **Hierarchy** — Sibling or section pages may cross-link.  
6. **Relevance** — Add links only when it improves navigation logically.

## Output Format

```json
{
  "pagesWithNewLinks": [
    {
      "path": "/existing-page",
      "newLinks": ["/new-page-1", "/new-page-2"]
    }
  ]
}
