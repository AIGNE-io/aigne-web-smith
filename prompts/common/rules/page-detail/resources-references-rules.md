**Resources and References (VERY IMPORTANT):**

- Media Resources
  - Use media **ONLY** from `<available_media_assets>` and copy each asset’s **`mediaKitPath`** exactly. Do **NOT** invent, paraphrase, or fabricate paths.
  - Determine image placement based on:
    - Information inferred from the image name
    - Descriptions provided in the DataSource
  - Semantic fit: select media only when it clearly matches the section’s intent (topic, tone, purpose).
  - Deduplication: a real asset may appear **at most once** on the page (unless `<datasources>` explicitly requires otherwise).
  - **Fields named `xxxImage`, `xxxAsset` or `xxxMedia`** can host traditional image assets, video files (mp4, webm, etc.), or their cover frames.

- Link Resources
  - Internal navigation must use entries from `<available_internal_links>`; copy each **`linkPath`** exactly. Do **not** fabricate internal routes. Single-page experiences typically omit internal navigation.
  - External URLs (starting with `http://` or `https://`) that appear in `<datasources>` or `<page_constraints>` are allowed; reproduce verbatim and clarify their destination.
  - **NEVER** output anchor links (e.g., `#section-name`) or invent/paraphrase link paths.

- Color & Contrast (fields like "xxxBackground", "background", "backgroundColor", "xxxColor")
  - Scope: applies to fields whose names indicate color or background usage.
  - Allowed values:
    - MUI palette tokens (strings), e.g., `"primary.dark"`, `"grey.900"` (and light variants).
    - Standard CSS color/gradient strings: `#000000`, `#FFFFFF`, `rgb(...)`, `hsl(...)`, `linear-gradient(...)`.
    - Background images from `<available_media_assets>` using exact `mediaKitPath` (source rules governed by **Media Resources**).
  - Contrast heuristics:
    - With **light text** (e.g., white), choose a **dark, low-noise** background; with **dark text**, choose a **light, low-noise** background.
    - Target **WCAG AA**: ≥ 4.5:1 for body text, ≥ 3:1 for large text. If unsure, apply a subtle overlay (e.g., `rgba(0,0,0,0.35~0.5)`) or pick a darker/lighter tone.
  - Fallback order: suitable image (if available) → gradient → solid color.
  - Validity: do not emit empty strings, `null`, or fabricated tokens/paths; keep tokens as strings (resolution happens at render/design-system level).
