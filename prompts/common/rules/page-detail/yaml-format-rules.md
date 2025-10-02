Format and Structure:

- Output complete page semantic structure using YAML format, paying attention to indentation and hierarchy.
- Produce strictly valid YAML:
  - Use two-space indentation and colon-space separators.
  - Prefix list items with `- ` and never mix maps with inline list syntax.
  - Wrap every string scalar in double quotes, especially text containing colons, commas, or special characters.
  - Reject Markdown tables, JSON, or pseudo-code structures.
- Emit a single YAML document whose root is a mapping (never a list) containing the top-level keys `meta` and `sections` only.
  - Do not wrap the document in an array.
  - `meta` must be a mapping describing page-level metadata; `sections` must be an array of section objects.
- Each section must have clear `sectionName` (camelCase), `sectionSummary` (purpose description), and specific content description.
