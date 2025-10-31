# ⚙️ WebSmith Configuration Guide

## 1. Purpose

The `.aigne/web-smith/config.yaml` file is the single source of truth for how WebSmith plans, generates, and deploys your site. It exposes product messaging, target audiences, data sources, localization, and publishing details that the agents rely on during every `aigne run generate` or `aigne run update`. Note that the file name is `config.yaml`; do not misunderstand it.

**Key takeaways**
- Keep required metadata (`projectName`, `projectId`, `projectSlug`) stable so downstream services continue to identify the project correctly.
- Strategy fields (`pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`) tell the agent what kind of narrative to build—update them first when the product direction changes.
- Data source lists (`sourcesPath`, `defaultDatasources`) control what structured content WebSmith crawls; add new YAML/Markdown files here before generation.
- Localization and media controls (`locale`, `translateLanguages`, `media`) ensure consistent output across languages and assets.
- Deployment hints (`appUrl`, `checkoutId`, `shouldSyncAll`) influence how generated artifacts are published.

---
## 2. Project Publishing Metadata

- `projectName` *(string, required)*: Human-readable project title shown in generated pages and reports.
- `projectDesc` *(string, required)*: Short marketing description used in SEO metadata and internal prompts.
- `projectLogo` *(URL)*: Logo asset used in headers, nav, and social cards. Provide an absolute URL or reachable CDN path.
- `projectId` *(UUID)*: Unique identifier for WebSmith services—do **not** recycle between projects. This is automatically generated and does not need to be modified.
- `projectSlug` *(string path)*: Default URL segment appended to your root domain; keep in sync with your deployment target.

---

## 3. Website Strategy & Narrative

- `pagePurpose` *(list of enums, required)*: Declares the primary goal of the site (`landingPage`, `portfolio`, etc.). You can list multiple purposes to blend storytelling approaches.
- `targetAudienceTypes` *(list of enums)*: Guides tone, proof points, and CTAs (`customers`, `developers`, `investors`, ...). Include every audience you actively support.
- `websiteScale` *(enum)*: Indicates how comprehensive the site should be (`singlePage`, `standard`, `aiDecide`, ...). Adjust when your sitemap expands or contracts.
- `rules` *(multiline Markdown string)*: High-priority instructions for structure, narrative flow, tone, and CTA placement. Update this section when GTM strategy or product messaging shifts. You can use Markdown headings, numbered lists, and callouts—WebSmith parses them as guidance, not literal copy.
- `pagesDir` *(path)*: Output directory for generated site pages. Changing this affects where new Markdown/HTML files are written.

> **Tip:** Keep strategy values synchronized with any briefs or prompts you share with teammates so that generated content remains consistent.

---

## 4. Localization & Languages

- `locale` *(IETF language code)*: Primary language for generation (e.g., `en`, `zh-TW`).
- `translateLanguages` *(list of IETF codes)*: Additional languages WebSmith should produce. Add or remove codes to expand or limit translations. Regenerate content after any change to ensure all localized docs stay in sync.

---

## 5. Content Sources & Datasources

- `sourcesPath` *(list of paths)*: Directories or files that WebSmith analyzes for context. Add new data files (e.g., `src/blog-list-data.yaml`) here before generating so they influence layout and content.
- `defaultDatasources` *(list of paths)*: Datasources automatically injected into every page (e.g., reusable media catalogs). Ideal for assets you want everywhere without manual wiring.

> **Reminder:** Whenever you introduce a new YAML or Markdown datasource, register it in both `sourcesPath` and any existing `sourceIds` sections inside `.aigne/web-smith/pages/...` if the site has already been generated.

---

## 6. Media & Visual Assets

- `media.minImageWidth` *(integer pixels)*: Smallest image width allowed in generated layouts. Increase to avoid low-resolution visuals; decrease if you need narrow imagery.
- `projectCover` *(path to image)*: Cover asset used for hero sections, previews, or shared links. Ensure the path resolves inside the repo.

---

## 7. Deployment & Integration Fields

- `appUrl` *(URL)*: Primary deployment URL. WebSmith uses this for canonical links and cross-environment references.
- `navigationType` *(string)*: Optional override for navigation style (keep empty if the default works). Define a value when you implement a custom nav schema.
- `checkoutId` *(string)*: Identifier for ArcBlock’s deployment/checkout service. Leave blank until you connect to a specific deployment target.
- `shouldSyncAll` *(boolean-like string)*: Controls whether the publish step pushes all artifacts. Leave empty to use defaults; set to `"true"` when you need a full sync.
- `lastGitHead` *(git SHA)*: Tracks the commit used during the last generation. WebSmith updates this automatically—only adjust if you are manually resetting the state.

---

## 8. Common Updates Workflow

1. Adjust strategy or metadata fields as needed (`pagePurpose`, `rules`, `targetAudienceTypes`, etc.).
2. Register any new datasources under `sourcesPath` (and `defaultDatasources` if required).
3. Run `aigne run generate` for fresh builds or `aigne run update` to refresh existing pages.
4. Review generated content, especially if you changed localization or media constraints, and commit the updated files.

By keeping this configuration aligned with your marketing plan and data sources, you guarantee that WebSmith agents generate consistent, on-brand experiences across every release.
