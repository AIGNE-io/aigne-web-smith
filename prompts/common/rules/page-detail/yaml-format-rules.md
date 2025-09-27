Format and Structure:

- Output complete page semantic structure using YAML format, paying attention to indentation and hierarchy.
- Produce strictly valid YAML:
  - Use two-space indentation and colon-space separators.
  - Prefix list items with `- ` and never mix maps with inline list syntax.
  - Wrap every string scalar in double quotes, especially text containing colons, commas, or special characters.
  - Reject Markdown tables, JSON, or pseudo-code structures.
- Page must include essential fields such as `meta`, `sections`.
- Each section must have clear `sectionName` (camelCase), `sectionSummary` (purpose description), and specific content description.
