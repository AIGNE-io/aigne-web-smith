# WebSmith Configuration

(I have updated assets/documents/special-components/websmith-config.md strictly following
the document content, and do not remove any content, the grouping of fields must also be
maintained. I would like to reiterate, do not make any cuts or exaggerations to the content.
The project file is config.yaml, please note that it should not be expressed as any other
name, and throughout the text config.yaml should not appear as `websmith-config.yaml`. The
content within the brackets should not appear in the final document. The writing style can be
slightly optimized to make it more user-friendly. The content in this bracket should not appear in the final document.)
---

## What Is the Configuration File?

### Basics

`config.yaml` is WebSmith’s core configuration file. It uses YAML format and stores all parameters required for WebSmith to generate a website.

File info:
- File name: `config.yaml` (fixed)
- Location: `.aigne/web-smith/config.yaml` (relative to project root)
- Format: YAML (UTF-8)

---

## What Does the Configuration File Do?

### Core Function

The configuration file is the central parameter carrier for WebSmith. Every time the AI agent runs the `generate` command, it reads this file and generates site structure and content according to its settings.

Primary purposes:
- Define site type and target audience
- Control content generation strategy and writing style
- Decide site scale and page structure
- Configure multilingual support
- Set deployment parameters


---

## Command State Model
(Keep it in style, don't format. The content in this bracket should not appear in the final document.)

WebSmith provides five core commands that work with your configuration file:

- **`update`**: Modifies existing content based on changes to `rules` or `media.minImageWidth` without regenerating the entire site. **Use when**: You've refined content guidance. **Common pitfall**: Not applicable (incremental updates are safe).

- **`generate`**: Creates a complete website from scratch using your `config.yaml`. **Use when**: Initializing or after major changes like `sourcesPath` or `websiteScale`. **Common pitfall**: Forgetting to run `clear` first when switching from `standard` to `singlePage`.

- **`publish`**: Deploys your site using `appUrl` and project metadata. **Use when**: Going live or changing deployment targets. **Common pitfall**: Publishing before verifying content quality.

- **`translate`**: Adds language versions based on `translateLanguages`. **Use when**: Adding new languages. **Common pitfall**: Translating before finalizing base content.

- **`clear`**: Removes generated files to reset state. **Use when**: Before regenerating after structural changes like `websiteScale` or `locale`. **Common pitfall**: Running `generate` without `clear` after changing `pagePurpose`.

---


### Functional Groups

Fields are grouped by function as follows:

#### Group 1: Project Basics

Basic identifiers and presentation info for branding and SEO.

Fields: `projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

Purpose: define name, description, logo, identifiers, etc. Affects page titles, nav menus, SEO meta tags, and social sharing.

#### Group 2: Site Strategy

Defines site type, tone, scale, and generation strategy. This controls how AI produces content.

Fields: `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

Purpose:
- `pagePurpose`: define site type (e.g., landing page, ecommerce, SaaS), affecting components and content organization
- `targetAudienceTypes`: define audience (e.g., end users, developers, business owners), affecting AI tone, complexity, and examples
- `websiteScale`: define site scale (single vs multi‑page), controlling number of pages
- `rules`: detailed guidance for structure, content, and style

#### Group 3: Languages

Configure language versions to support multilingual sites.

Fields: `locale`, `translateLanguages`

Purpose: define primary language and translation targets. Each language produces a full site structure.

#### Group 4: Data Sources

Specify data sources that AI analyzes as material and references for page generation.

Fields: `sourcesPath`, `defaultDatasources`

Purpose:
- `sourcesPath`: directories or files for AI analysis (Markdown, YAML, images, etc.). This directly determines content quality, accuracy, and relevance.
- `defaultDatasources`: common datasources injected into every page when commands run (e.g., `media.md` with image locations and descriptions)

#### Group 5: Output & Deployment

Configure output paths and deployment parameters.

Fields: `pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

Purpose:
- `pagesDir`: where generated page files are written
- `appUrl`: deployed site URL, affecting links and SEO
- `checkoutId`, `shouldSyncAll`, `navigationType`: temporary variables used during development; you generally don’t need to manage them

#### Group 6: Media & Display

Configure image quality and related presentation parameters.

Fields: `media.minImageWidth`, `lastGitHead`

Purpose:
- `media.minImageWidth`: minimum image width to filter low‑quality assets
- `lastGitHead`: last Git commit ID used for incremental updates

---

## How Is the Configuration File Created?

The configuration file is created automatically when you start using WebSmith. There are two ways it can be generated:

**Option 1: During first generation**
```bash
aigne web generate
```
If `config.yaml` doesn't exist, the command automatically launches an interactive wizard to create it, then proceeds with generation.

**Option 2: Create separately**
```bash
aigne web init
```
This creates the configuration file through the same interactive wizard, without immediately starting generation.

Both methods guide you through the same setup process, collecting information about your site type, audience, languages, and source paths.

### Updating Configuration

After the configuration file is created, you can update it in two ways:

**Option 1: Edit directly**
Open `.aigne/web-smith/config.yaml` with any text editor and modify the fields you need.

**Option 2: Use the interactive wizard**
```bash
aigne web init
```
Run this command again to interactively update your configuration. It will load your current settings and let you modify them through the guided wizard.

---

## Configuration File Example

### Real Configuration

Below is the actual configuration from the AIGNE WebSmith project:

```yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. Core Messaging & Strategy: Foundational elements that define *what* you communicate to the user.
  1. Answer Critical Questions "Above the Fold": The very first screen a user sees must clearly and immediately answer:
    * What it is: A concise description of the product.
    * Who it's for: The specific target audience (e.g., solo founders, small teams).
    * Why it's different: Your unique value proposition (e.g., "open, composable, exportable code, agent workflow").
    * Primary Action: A single, clear Call to Action (CTA) that aligns with the user's main goal.
  2. Establish Credibility with Proof: Don't expect users to trust your claims. Show them proof early in the narrative.
    * Show, Don't Just Tell: The most powerful proof is a demo. Include a short (30-45s) silent video loop or a link to a real site built with the tool.
    * Use Social Proof: Before explaining "How it Works," insert tangible evidence like a customer logo, a compelling data point (e.g., "Used by 50+ teams"), or a strong user quote.
  3. Define a Clear Call to Action (CTA):
    * Align CTA with the Audience: The primary CTA should be the main action you want your target user to take (e.g., "Generate My Site").
    * Prioritize CTAs: Relegate secondary actions (like "See it on GitHub") to less prominent positions (tertiary buttons or footer links), especially for non-developer audiences.
    * Maintain a Persistent Mobile CTA: On mobile, a single primary CTA should always be visible.
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
pagesDir: .aigne/web-smith/pages
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 600
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
checkoutId: ""
projectCover: .aigne/web-smith/cover.png
shouldSyncAll: ""
navigationType: ""
appUrl: https://mhevtaeg.user.aigne.io
```

### Field‑by‑Field Explanation

Based on the real config above, here is what each field does:

#### Project Basics

`projectName`
- Purpose: display name shown in page `<title>`, navigation, and site branding
- Current value: `AIGNE WebSmith`
- Type: string
- Impact:
  - Changing the name updates titles and navigation labels across pages
  - Keep concise; under 50 characters for readability and SEO
- How to apply: run `aigne web publish` after changes

`projectDesc`
- Purpose: project description for SEO meta (`<meta name="description">`) and social sharing
- Current value: `"AI-powered website generation tool built on the AIGNE Framework"`
- Type: string
- Impact:
  - Updates meta description on pages and social shares
  - Keep under ~150 characters for search snippets
  - Include key terms for SEO
- How to apply: run `aigne web publish` after changes

`projectLogo`
- Purpose: logo for header navigation, favicon, and social thumbnails
- Current value: `https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- Type: string (URL or path)
- Impact:
  - Switching URL/path updates the logo site‑wide
  - Supported: HTTP/HTTPS URL or relative path (e.g., `./assets/images/logo.svg`)
  - Prefer PNG or SVG for crisp display
- How to apply: run `aigne web publish` after changes

`projectId`
- Purpose: unique project identifier used by WebSmith services to associate deployments, history, and datasources
- Current value: `pg4d0000-0000-4000-a000-000000000000` (UUID)
- Type: string (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- Impact:
  - Changing to a new UUID makes this a new project to the system, which may:
    - Break association with previous deployment links
    - Lose linkage to project history
    - Lose datasource associations
- How to apply: run `aigne web publish` after changes

`projectSlug`
- Purpose: URL path prefix that affects deployment path and internal links
- Current value: `/` (root)
- Type: string (URL path)
- Impact examples:
  - `/`: site at root, e.g., `https://example.com/`
  - `/portfolio`: site at `https://example.com/portfolio/`
  - `/docs`: site at `https://example.com/docs/`
  - Changing updates all internal links and deployment paths
- How to apply: run `aigne web publish` after changes

`projectCover`
- Purpose: site cover image for previews and social sharing (Open Graph, Twitter Card, etc.)
- Current value: `.aigne/web-smith/cover.png`
- Type: string (file path)
- Impact:
  - Changing the path updates preview images on social sharing
  - Use high‑quality images (at least 1200×630)
  - Formats: PNG, JPG/JPEG, WebP, etc.
- How to apply: run `aigne web publish` after changes

#### Site Strategy

`pagePurpose`
- Purpose: defines primary purpose; directly influences AI strategy and page structure
- Current value: `[landingPage]` (array)
- Type: array (multi‑select)
- Options and effects:
  - `landingPage` (current): conversion‑focused landing page; generates hero, features, CTA, FAQ, etc.
  - `ecommerce`: online store; generates catalog, cart, checkout, reviews, etc.
  - `saas`: SaaS product site; generates features, pricing, demo, onboarding, etc.
  - `portfolio`: portfolio site; generates visual layouts, galleries, case studies, etc.
  - `corporate`: company site; generates company overview, services, team, contact, etc.
  - `blog`: blog; generates content structure, SEO, sharing, archives, etc.
  - `nonprofit`: nonprofit; generates mission, donate flow, volunteer signup, etc.
  - `education`: education; generates course lists, learning paths, progress tracking, etc.
- How to apply: run `aigne web clear && aigne web generate` after changes

`targetAudienceTypes`
- Purpose: define target audiences; directly affects tone, complexity, and example choices
- Current value: `[customers]` (array)
- Type: array (multi‑select)
- Options and effects:
  - `customers` (current): end users/customers; simple language, emphasizes ease‑of‑use and outcomes; adds trust signals and user stories
  - `businessOwners`: business owners/founders; ROI and business value focus; professional tone; includes business cases and return analyses
  - `marketers`: marketing teams; KPI‑driven and brand focus; includes marketing tooling and analytics
  - `designers`: designers; visual emphasis and design showcases; aesthetics and inspiration; includes design cases and visual tools
  - `developers`: developers/technical users; technical detail, code examples, API docs; accuracy and implementation focus
  - `investors`: investors/stakeholders; growth metrics, market opportunities, financial outlook; business plans and market data
  - `jobSeekers`: job seekers; culture, growth, benefits focus; job listings and company culture
  - `students`: students/learners; instructional tone, step‑by‑step guidance, progress tracking; tutorials and course materials
  - `generalPublic`: general/mixed audiences; accessible language, multiple entry points, broad appeal
- How to apply: run `aigne web clear && aigne web generate` after changes

`websiteScale`
- Purpose: define site scale, controlling number of pages and nav complexity
- Current value: `singlePage`
- Type: string (single choice)
- Options and effects:
  - `singlePage` (current): one‑page site; all sections on a single scrollable page (hero, features, FAQ, CTA, etc.); good for quick launch/MVP
  - `minimal`: 2–6 pages; home, about, services/products, contact, etc.; small business/simple sites
  - `standard`: 7–12 pages; minimal + portfolio/blog, team, FAQ, pricing, etc.; professional sites, portfolios, small ecommerce (recommended)
  - `comprehensive`: 12+ pages; standard + detailed service pages, case studies, resource center, etc.; large/complex/content‑rich sites
  - `aiDecide`: let AI decide scale based on type, audience, and repo analysis; considers business needs, content volume, and maintenance capacity
- How to apply: run `aigne web clear && aigne web generate` after changes

`rules`
- Purpose: detailed generation guidance for structure, content, and style (Markdown). This is the most important guidance for AI and directly affects quality and UX.
- Current value: a multi‑line block with detailed guidance (see example above), including:
  - Core Messaging & Strategy
  - Answer Critical Questions “Above the Fold”
  - Establish Credibility with Proof
  - Define Clear Call to Action
- Type: multi‑line string (Markdown supported)
- Impact:
  - Empty or sparse rules: AI falls back to defaults and may not fit your needs well
  - Detailed rules: AI follows your guidance for structure, organization, and tone
  - Changes: AI regenerates based on new rules, affecting sections and expression
- How to apply: run `aigne web clear && aigne web generate` or `aigne web update` after changes

#### Languages

`locale`
- Purpose: primary site language used for base content generation
- Current value: `en`
- Type: string
- Supported language codes: standard IETF codes such as `en`, `zh`, `zh-TW`, `ja`, `ko`, `fr`, `de`, `es`, `pt`, `ru`, `it`, `ar`, etc.
- How to apply: run `aigne web clear && aigne web generate` after changes

`translateLanguages`
- Purpose: list of languages to translate into; each becomes a full site structure
- Current value: `[zh, zh-TW, ja]`
- Type: array (multi‑select)
- Supported codes: same set as `locale` (must not include the `locale` itself)
- Per‑language effects:
  - `zh`: generates a full Simplified Chinese site
  - `zh-TW`: generates a full Traditional Chinese site
  - `ja`: generates a full Japanese site
  - Others behave similarly; each generates a separate site structure
- How to apply: run `aigne web translate` after changes

#### Data Sources

`sourcesPath`
- Purpose: directories/files analyzed by the WebSmith AI agent (array). The AI uses these as the only references for generating site content. This directly determines quality, accuracy, and relevance.
- Current value:
  ```yaml
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
  ```
- Type: array (paths)
- Importance:
  - Primary determinant of content quality: only these sources are used as references
  - Recommendations:
    - Include main docs and readme
    - Include important project information sources
    - Keep sources accurate and up‑to‑date
    - Update regularly to match project state
- Impact:
  - Add paths: AI analyzes more material, often improving quality
  - Remove paths: AI stops analyzing them and may miss information
  - Path types:
    - Directories (e.g., `./assets/documents`): recursively analyzed
    - Files (e.g., `./README.md`): analyzed directly
    - Supported types: `.md`, `.yaml`/`.yml`, `.json`, `.txt`, etc.
    - Image directories: images aren’t analyzed but can be referenced
- How to apply: run `aigne web clear && aigne web generate` or `aigne web update` after changes

`defaultDatasources`
- Purpose: datasources automatically injected into every page context (e.g., media, contact info). These are added each time commands run, but not every resource is fully inlined; suitable for resource descriptions like `media.md`.
- Current value: `[./media.md]`
- Type: array (file paths)
- Impact:
  - Add: newly included common content (brand info, shared snippets, etc.)
  - Remove: no longer injected
  - Good for: `media.md` (image locations and descriptions), shared contact/brand info
  - Supported: `.md`, `.yaml`/`.yml`, `.json`
- How to apply: run `aigne web clear && aigne web generate` or `aigne web update` after changes

#### Output & Deployment

`pagesDir`
- Purpose: output directory for generated site files (e.g., `page.yaml`, `_navigations.yaml`)
- Current value: `.aigne/web-smith/pages`
- Type: string (path)
- Impact:
  - Changing (e.g., to `./output/pages`) moves future outputs there
  - Prefer relative paths for portability
  - Directory is auto‑created if missing
- How to apply: future generations write to the new directory

`appUrl`
- Purpose: site deployment URL; determines where the site is published
- Current value: `https://mhevtaeg.user.aigne.io`
- Type: string (URL)
- Impact:
  - Changing to another URL publishes to a new target
  - Must include protocol; `https://` is auto‑added if missing
  - Set after final domain is known to avoid churn
- How to apply: only used by `aigne web publish`; other commands ignore it

`checkoutId`
- Purpose: temporary development variable; stored for convenience only
- Current value: `""`
- Type: string
- Note: managed by the system; you usually don’t need to set it

`shouldSyncAll`
- Purpose: temporary development variable; stored for convenience only
- Current value: `""`
- Type: string (`"true"` or `""`)
- Note: managed by the system; you usually don’t need to set it

`navigationType`
- Purpose: temporary development variable; stored for convenience only
- Current value: `""`
- Type: string
- Note: managed by the system; you usually don’t need to set it

#### Media & Display

`media.minImageWidth`
- Purpose: minimum image width (px) to filter low‑quality images; only images wider than this are used
- Current value: `600`
- Type: integer (pixels)
- Effects:
  - Lower (400–600): more images allowed, lower quality risk; quick launch
  - Medium (600–800): balanced quality/quantity; default recommendation
  - Higher (800–1000): higher quality, fewer images; portfolios/premium brands
  - Very high (1000+): top visual quality, far fewer usable images
- How to apply: run `aigne web clear && aigne web generate` or `aigne web update` after changes

`lastGitHead`
- Purpose: last Git commit ID at generation time (for incremental updates)
- Current value: `c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- Type: string (Git commit hash)
- Effects:
  - Maintained automatically after each generation
  - Used to detect changed files; manual edits may affect incremental behavior
- Note: normally system‑managed; only edit with a valid hash if necessary

#### Other Config

(No additional fields currently.)

---

## Fields at a Glance

| Field | Type | Default | Example | Apply With |
|-------|------|---------|---------|------------|
| `projectName` | string | `""` | `"My Project"` | `publish` |
| `projectDesc` | string | `""` | `"AI-powered website tool"` | `publish` |
| `projectLogo` | string | `""` | `"https://example.com/logo.png"` | `publish` |
| `projectId` | string | UUID | `"pg4d0000-0000-4000-a000-000000000000"` | `publish` |
| `projectSlug` | string | `"/"` | `"/"` | `publish` |
| `projectCover` | string | `""` | `"./assets/cover.png"` | `publish` |
| `pagePurpose` | array | `[]` | `["landingPage"]` | `clear && generate` |
| `targetAudienceTypes` | array | `[]` | `["customers"]` | `clear && generate` |
| `websiteScale` | string | `"standard"` | `"standard"` | `clear && generate` |
| `rules` | string | `""` | `"### Page Structure\n1. Hero section"` | `update` |
| `locale` | string | `"en"` | `"en"` | `clear && generate` |
| `translateLanguages` | array | `[]` | `["zh", "ja"]` | `translate` |
| `pagesDir` | string | `"./aigne/web-smith/pages"` | `"./aigne/web-smith/pages"` | `generate` |
| `sourcesPath` | array | `[]` | `["./README.md", "./docs"]` | `generate` |
| `defaultDatasources` | array | `["./media.md"]` | `["./media.md"]` | `update` |
| `media.minImageWidth` | integer | `800` | `800` | `update` |
| `appUrl` | string | `""` | `"https://example.com"` | `publish` |
| `lastGitHead` | string | `""` | `"c4a4d3db..."` | Auto |
| `checkoutId` | string | `""` | `""` | Internal |
| `shouldSyncAll` | string | `""` | `""` | Internal |
| `navigationType` | string | `""` | `""` | Internal |

**Note:** For detailed allowed values and descriptions, see the [Field-by-Field Explanation](#field-by-field-explanation) section below.

---

## Copy-Paste Examples

### Minimal Example: Single-Page, English-Only

A minimal configuration for a single-page English website:

```yaml
configVersion: 1
projectName: My Project
projectDesc: "A simple landing page"
projectLogo: ""
projectId: pg4d1000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: ""
locale: en
translateLanguages: []
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: ""
```

**Command sequence:**
```bash
aigne web generate
```

---

### Standard Example: Multi-Page, EN + JA

A standard configuration for a multi-page website with English and Japanese:

```yaml
configVersion: 1
projectName: My Project
projectDesc: "AI-powered website generation tool"
projectLogo: https://example.com/logo.png
projectId: pg4d2000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
  - saas
targetAudienceTypes:
  - customers
  - developers
websiteScale: standard
rules: |
  ### Page Structure Requirements
  1. Hero section must include clear value proposition
  2. Use positive, confident tone
  3. Include concrete case data
locale: en
translateLanguages:
  - ja
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
  - ./docs
  - ./CHANGELOG.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: https://example.com
```

**Command sequence:**
```bash
aigne web generate
aigne web translate
aigne web publish
```

**Note:** Version will bump with breaking changes; migration notes provided.

---

## If Things Break

If your website generation fails or produces unexpected results, use these recovery methods:

- **Git revert:** If you're using version control, restore the previous working configuration:
  ```bash
  git revert HEAD
  ```

- **Clean regeneration:** Clear all generated files and regenerate from scratch:
  ```bash
  aigne web clear && aigne web generate
  ```

This restores a clean state and regenerates your website based on the current configuration.

---

## When Should You Change It?

### Feature Adjustments

Scenario: Upgrade from single‑page to multi‑page
- Trigger: need to expand from a single page to a full site
- Field: `websiteScale`
- Example:
```yaml
# Before
websiteScale: singlePage

# After
websiteScale: standard
```
- Apply:
  - If nothing generated yet: run `aigne web generate`
  - If already generated: run `aigne web clear` then `aigne web generate`

Scenario: Change site type
- Trigger: product positioning changes (e.g., SaaS → ecommerce)
- Field: `pagePurpose`
- Example:
```yaml
# Before
pagePurpose:
  - saas

# After
pagePurpose:
  - ecommerce
```
- Apply: same as Scenario 1

Scenario: Adjust target audience
- Trigger: audience shifts (e.g., consumers → businesses)
- Field: `targetAudienceTypes`
- Example:
```yaml
# Before
targetAudienceTypes:
  - customers

# After
targetAudienceTypes:
  - businessOwners
  - developers
```
- Apply: same as Scenario 1

### Adaptation

Scenario: Add new data sources
- Trigger: new docs or content added that AI must analyze. If the path isn’t added, later `aigne web generate` runs cannot read it.
- Field: `sourcesPath`
- Example:
```yaml
# Before
sourcesPath:
  - ./assets/documents

# After: add new sources
sourcesPath:
  - ./assets/documents
  - ./docs/api
  - ./content/blog
```
- Apply: read during `aigne web generate` when prompts are filled

### Fixes

Scenario: Image quality is insufficient
- Trigger: low‑quality images appear in output
- Field: `media.minImageWidth`
- Example:
```yaml
# Before: min 600px
media:
  minImageWidth: 600

# After: min 1000px
media:
  minImageWidth: 1000
```
- Apply: `aigne web update` or `aigne web generate`

Scenario: Generated content misses expectations
- Trigger: tone/structure not as desired
- Field: `rules`
- Example:
```yaml
# Before: empty or too sparse
rules: ""

# After: detailed guidance
rules: |
  ### Page Structure Requirements
  1. Above the fold must include:
     * Clear product headline
     * Concise description (≤ 2 sentences)
     * Primary call‑to‑action

  2. Content organization:
     * Positive, confident tone
     * Include concrete case data
     * Avoid excessive marketing jargon
```
- Apply:
  - Read by `aigne web update`
  - Read during `aigne web generate` when prompts are filled
  - Note: rules are sent with each prompt

### Multilingual

Scenario: Add a new language
- Field: `translateLanguages`
- Recommended method: run `aigne web translate` (it will guide you to select languages and update the config automatically)
- Manual method: edit `translateLanguages` in `config.yaml`, then run `aigne web translate` or `aigne web update`
- Example of manual edit:
```yaml
# Before: only Chinese + English
locale: zh
translateLanguages:
  - en

# After: add French and German
locale: zh
translateLanguages:
  - en
  - fr
  - de
```
- Apply: `aigne web translate` or `aigne web update`

Scenario: Change primary language
- Field: `locale`
- Example:
```yaml
# Before: Chinese primary
locale: zh
translateLanguages:
  - en

# After: English primary
locale: en
translateLanguages:
  - zh
```
- Apply: run `aigne web clear` then `aigne web generate`

### Basic Info Changes

Scenario: Update project basics
- Fields: `projectName`, `projectDesc`, `projectLogo`, `projectCover`
- Example:
```yaml
# Before
projectName: "Old Project Name"
projectDesc: "Old description"
projectLogo: "Old Logo URL"

# After
projectName: "New Project Name"
projectDesc: "New description"
projectLogo: "New Logo URL"
projectCover: "./assets/images/new-cover.png"
```
- Apply: `aigne web publish` (other commands ignore these)

Scenario: Integrate external deployment
- Field: `appUrl`
- Example:
```yaml
# Before
appUrl: ""

# After
appUrl: https://your-app.user.aigne.io
```
- Apply: `aigne web publish` only; `appUrl` determines target platform

---

## How Do Changes Take Effect?

### Commands by Field Type

Feature fields (`pagePurpose`, `websiteScale`, `targetAudienceTypes`)
- If not generated yet: run `aigne web generate`
- If already generated: run `aigne web clear` then `aigne web generate`

Data sources (`sourcesPath`, `defaultDatasources`)
- `sourcesPath`: read during `aigne web generate` when prompts are filled; without adding the path, generate won’t read the file
- `defaultDatasources`: effective on `aigne web update` or `aigne web generate`; injected into context (not all resources are inlined)

Fix fields (`media.minImageWidth`, `rules`)
- Both effective on `aigne web update` or `aigne web generate` (rules are included with prompts)

Language fields (`locale`, `translateLanguages`)
- Add languages (`translateLanguages`): `aigne web translate` or `aigne web update`
- Change primary language (`locale`): `aigne web clear` then `aigne web generate`

Basic info (`projectName`, `projectDesc`, `projectLogo`, `projectCover`, `appUrl`)
- Use `aigne web publish`; other commands ignore these values. `appUrl` determines publish target.

### Process Summary

```
Edit config
    ↓
Save file
    ↓
Run the appropriate command by field type
    ↓
Verify the change
```

### Verify Changes

- Check generated page files to confirm updated values are present. For example, after changing `projectName`, ensure the new name appears where expected.

---

## What If The File Is Broken?

### YAML Format Errors

Scenario: Using full‑width (Chinese) colon
```yaml
projectName： "My Project"  # Wrong: full‑width colon
```
Correct:
```yaml
projectName: "My Project"  # Right: ASCII colon
```
Effects:
- YAML parse failure; `aigne web generate` shows an error
- Command aborts; site won’t be generated
Recovery:
1. Replace all full‑width colons with ASCII `:`
2. Re‑run `aigne web generate`

Scenario: Nonexistent fields
```yaml
projectName: "My Project"
unknownField: "some value"
```
Effects:
- CLI ignores unrecognized fields without error
- File parses; field is ignored; generation unaffected
- You must verify whether output matches expectations
Recovery:
1. Check generated output
2. Consult this guide for valid field names
3. Remove unknown fields

Scenario: Indentation errors
```yaml
pagePurpose:
- landingPage  # Wrong: missing indent
targetAudienceTypes:
  - customers  # Right: two‑space indent
```
Correct:
```yaml
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
```
Effects:
- YAML parse failure; structure misread
- Values may be lost or misinterpreted
Recovery:
1. Use spaces only (no Tabs) and consistent indentation (typically two spaces)
2. Ensure arrays use proper `-` with correct indent

Scenario: Deleting key fields
```yaml
# Accidentally removed projectName
projectDesc: "Description"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
Effects:
- Title may be empty or defaulted
- Some features may not work as intended
- Parsing succeeds but output quality suffers
Recovery:
1. Restore from Git history if available
2. Back up the current config, then run `aigne web init` to regenerate with correct fields

Scenario: Wrong value types
`pagePurpose` must be an array, not a string:
```yaml
# Wrong
pagePurpose: landingPage

# Right
pagePurpose:
  - landingPage
```
`translateLanguages` must be an array, not a string:
```yaml
# Wrong
translateLanguages: en

# Right
translateLanguages:
  - en
```
Effects:
- Defaults may be used when types are wrong
- AI may fail to read values properly
- Output may not match expectations
Recovery:
1. Confirm correct formats in this guide
2. Use proper YAML array syntax with `-`
3. Regenerate to verify

### Detection and Recovery

Method 1: Detect during generation
- After edits, run `aigne web generate`
- The system reports YAML/format errors with helpful messages

Method 2: Restore from backup
- If using Git, restore from history
- If using manual backups:
```bash
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

Method 3: Regenerate the file
- Back up the old `config.yaml` first so you can merge custom values
- Run `aigne web init` to create a new configuration interactively

### Product Robustness

Per WebSmith behavior:
1. YAML parse failure: friendly error without crashing
2. Unknown fields: ignored silently; generation proceeds; verify results manually
3. Wrong value types: defaults may be used; parsing continues
4. Missing optional fields: defaults applied (e.g., `locale` defaults to "en")

### Prevention Tips

1. Use version control for the config
2. Make backups before major edits
3. Validate changes by running `aigne web generate` after edits

---

## Defaults & Precedence

### Explicit Defaults

The following fields have explicit default values:

- `locale`: defaults to `"en"` (English)
- `websiteScale`: defaults to `"standard"` (7-12 pages)
- `pagesDir`: defaults to `"./aigne/web-smith/pages"`
- `translateLanguages`: defaults to `[]` (empty array, no translations)
- `media.minImageWidth`: defaults to `800` (pixels)

### Precedence Rules

Configuration precedence follows this order:

1. **Explicit config values** take highest priority
2. **`rules` override defaults** when specified; if `rules` is empty, AI falls back to defaults
3. **Missing values fall back to defaults**; if a field is not specified or empty, the system uses its default value

### i18n Fallback Behavior

When generating multilingual sites:

- **Primary language (`locale`)**: Always used as the base language for content generation
- **Translation languages (`translateLanguages`)**: Content is translated from the primary language to each target language
- **Fallback on missing translations**: If a translation fails, the system falls back to the primary language content
- **Disabling i18n**: To disable internationalization, set `translateLanguages` to an empty array `[]`

---
## Troubleshooting

This guide helps you diagnose and fix common issues when working with AIGNE WebSmith. If you encounter problems during generation, publishing, or configuration, check the scenarios below for solutions.

---

### Configuration Issues

#### Issue 1: Configuration file format error

**Error message:**
```
Error: Failed to parse config file: Implicit map keys need to be followed by map values at line 112, column 1:

lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
appUrl: https://staging.websmith.aigne.io
```

```
Error: Failed to parse config file: Map keys must be unique at line 116, column 1:

projectCover: .aigne/web-smith/cover.png
appUrl: https://staging.websmith.aigne.io
^
```

**Possible causes:** There's a YAML syntax error in your configuration file. Common issues include:
- Using tabs instead of spaces for indentation
- Using full-width colons (：) instead of ASCII colons (:)
- Missing required quotes
- Duplicate configuration items

**How to fix:**
1. Check the line number mentioned in the error message to locate the issue
2. Verify the indentation on that line (use spaces, not tabs)
3. Make sure the colon is an ASCII colon (:), not a full-width colon (：)
4. Use an online YAML validator to check the syntax
5. Re-run `aigne web publish` after fixing

---

> **Tip:** Except for configuration file format errors that need to be fixed, if some parameters are not configured correctly, the system will automatically use default values, which won't affect basic functionality.

### Generation Issues

#### Issue 2: Generated content doesn't match expectations

**You might encounter:**
- The tone of generated content doesn't match your requirements
- The page structure doesn't match what you expected
- Some important information is missing

**Possible causes:**
1. The `rules` description in your config is insufficient or unclear
2. The `targetAudienceTypes` setting doesn't match your actual target audience
3. There are too few or irrelevant reference documents in `sourcesPath`

**How to fix:**
1. **Enrich `rules`:** Add detailed guidance in your `config.yaml`:
   ```yaml
   rules: |
     ### Page Structure Requirements
     1. Above the fold must include:
        * Clear product headline
        * Concise description
        * Primary call-to-action
     
     ### Content Tone
     - Use positive, confident language
     - Include concrete data and examples
     - Avoid marketing jargon
   ```

2. **Adjust audience:** Ensure `targetAudienceTypes` matches your actual audience:
   ```yaml
   targetAudienceTypes:
     - customers      # For end users
     - developers     # For technical audience
   ```

3. **Add more sources:** Include relevant documentation in `sourcesPath`:
   ```yaml
   sourcesPath:
     - ./README.md
     - ./docs
     - ./CHANGELOG.md
   ```

---

#### Issue 3: Images are low quality or missing

**You might encounter:**
- Low-resolution images in generated pages
- Expected images not appearing

**Cause:** The `media.minImageWidth` setting is too high, filtering out some images.

**How to fix:**
1. Open the `config.yaml` file and find the `media` configuration:
   ```yaml
   media:
     minImageWidth: 800  # Current threshold
   ```

2. Adjust this value based on your needs:
   - **400-600**: Will include more images, but some may be lower quality
   - **600-800**: Balanced quality and quantity (recommended setting)
   - **800-1000**: Only high-quality images are kept, quantity will be reduced

3. Run the update command after saving the file:
   ```bash
   aigne web update
   ```

---

### Publishing Issues

#### Issue 4: URL invalid error when publishing

**Error message:**
```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**Cause:** The `appUrl` in your configuration is empty or points to an invalid website address.

**How to fix:**
Set the correct deployment address in `config.yaml`:
```yaml
# Enter your website address
appUrl: https://your-site.user.aigne.io

# If you don't have a website yet, you can clear this configuration
# appUrl: ""
```

#### Issue 5: Authorization expired error when publishing

**Error message:**
```
❌ Failed to publish pages: bundle: not authorized
```

**Cause:** Your login credentials have expired and need to be re-authorized.

**How to fix:**
Run the following commands in order:
```bash
# First, clear old authorization information
aigne web clear

# Then republish, the system will prompt you to log in again
aigne web publish
```

---

### How to Recover

#### Method 1: Restore using Git

If you're using Git to manage your code, you can quickly restore to a previously working configuration:

```bash
# Stash current changes
git stash
```

Then regenerate the website:
```bash
aigne web generate
```

> **Tip:** If you want to restore the stashed changes later, you can run `git stash pop`

---

#### Method 2: Clean and regenerate

If you encounter issues that are hard to locate, you can clear all generated files and regenerate from scratch:

```bash
# Clear all generated files, then regenerate
aigne web clear && aigne web generate
```

> **Note:** This will delete all generated content, but won't affect your configuration files. After execution, the system will regenerate the website based on the current configuration.

---

### Usage Tips

Here are some practical tips to help you avoid common issues:

1. **Save your change history:** If you're using Git, remember to commit after each configuration file change, so you can easily go back to a previous version if something goes wrong
2. **Back up before making changes:** Before modifying important configurations, copy your configuration file as a backup, just in case
3. **Test immediately after changes:** After each configuration change, run `aigne web generate` right away to test, so you can catch any issues early
4. **Check if the format is correct:** After modifying YAML files, you can use online tools to check if there are any format errors
5. **Start simple:** Begin with the simplest configuration, and after confirming everything works, gradually add more complex features
6. **Keep notes of your changes:** Simply note down what you changed and why, so it's easier to find the cause when problems occur later

---

### Getting More Help

If the methods above don't solve your problem, you can try:

1. **Check configuration documentation:** Review [Config Reference](./reference-config.md) for detailed descriptions of each configuration item

2. **Check command documentation:** Refer to [Command Reference](./reference-command.md) for detailed command usage

3. **Check error logs:** Carefully read the error messages displayed in the terminal, which usually contain specific hints

4. **Use AIGNE Observability:** Use the AIGNE Observability tool described below to get detailed execution records

5. **Seek community help:** Visit the [AIGNE Community](https://community.arcblock.io/discussions/boards/aigne) to ask questions, other users or developers may be able to help

---

### Using AIGNE Observability to Troubleshoot

When you need to investigate complex issues in depth or report problems to the community, you can use **AIGNE Observability**. It records detailed execution processes for each step to help you or technical support staff quickly find issues.

#### Start the Observability Server

Run the following command to start the local observability server:

```bash Start Observability Server icon=lucide:terminal
aigne observe
```

You'll see output showing:
- Database path: where trace data is saved
- Server address: open this address in your browser to view the observability dashboard

![Observability server running](../../../assets/images/web-smith-observe.png)

#### View Execution Records

1. **Open the dashboard:** Click the server address shown in the output or open it in your browser

2. **View operation records:** The dashboard displays all WebSmith operations, including:
   - Input and output data
   - Time taken for each step
   - Operation steps executed and their results
   - Detailed error information

![Observability dashboard showing execution records](../../../assets/images/web-smith-observe-dashboard.png)

#### Report Issues with Observability

When reporting problems to the community:

1. **Capture the trace:** Keep the observability server running during the problematic operation
2. **Export the trace data:** Export the relevant execution records from the dashboard
3. **Report the issue:** Visit the [AIGNE Community](https://community.arcblock.io/discussions/boards/aigne) and attach:
   - Description of the problem
   - Steps to reproduce
   - Exported trace file
   - Your configuration (if relevant)

> **Tip:** Trace records contain complete information about WebSmith's execution, including operations and results for each step. Providing this information to technical support or the community can greatly improve problem-solving efficiency.


## Best Practices

### `sourcesPath` Best Practices

**Good folder layouts:**

```
project/
├── README.md           # ✅ Include
├── docs/               # ✅ Include
│   ├── getting-started.md
│   └── api-reference.md
├── CHANGELOG.md        # ✅ Include
└── assets/
    ├── images/         # ✅ Include (for image references)
    └── recordings/     # ❌ Skip (unless needed)
```

**Bad folder layouts:**

```
project/
├── node_modules/       # ❌ Don't include (too large)
├── dist/               # ❌ Don't include (generated files)
├── .git/               # ❌ Don't include (version control)
└── test/               # ❌ Don't include (test files)
```

**Best practices:**

1. **Include essential documentation:**
   - `README.md` (project overview)
   - `docs` directory (documentation)
   - `CHANGELOG.md` (version history)

2. **Include project configuration:**
   - `aigne.yaml` (project configuration)
   - Configuration files relevant to your project

3. **Include image directories:**
   - `assets/images/` (for image references)
   - Note: Images aren't analyzed but can be referenced

4. **Avoid large directories:**
   - `node_modules/` (too large, unnecessary)
   - `dist/` or `build/` (generated files)
   - `.git/` (version control)

5. **Glob patterns support:**
   - **Glob patterns are NOT currently supported** in `sourcesPath`
   - Use explicit file paths or directory paths
   - Example: `["./README.md", "./docs"]` ✅
   - Example: `["./docs/**/*.md"]` ❌ (not supported)

6. **Ignore files:**
   - **`.aigneignore` is NOT currently supported**
   - Manually exclude unnecessary files/directories from `sourcesPath`

---

### `rules` Best Practices

**6-bullet landing-page skeleton:**

Copy this skeleton to your `rules` field and customize it:

```yaml
rules: |
  ### I. Core Messaging & Strategy
  1. Above the fold must answer: What it is, Who it's for, Why it's different, Primary action
  2. Establish credibility with proof: Show demo, social proof, customer logos
  3. Define clear CTA: Primary action aligned with audience, persistent mobile CTA
  
  ### II. Content Organization
  4. Use positive, confident tone: Avoid marketing jargon, focus on benefits
  5. Include concrete data: Case studies, metrics, real examples
  6. Maintain consistency: Product naming, terminology, structure
```

**Tone guidance:**

- **For customers:** Clear benefits, simple language, trust signals
- **For developers:** Technical accuracy, code examples, API references
- **For business owners:** ROI focus, time-saving benefits, professional tone

**CTA guidance:**

- **Primary CTA:** Main action you want users to take (e.g., "Generate My Site")
- **Secondary CTAs:** Relegate to less prominent positions (e.g., "See it on GitHub")
- **Mobile:** Keep a persistent primary CTA visible

**Best practices:**

1. **Be specific:** Include concrete requirements, not vague suggestions
2. **Use structure:** Organize rules with headings and bullet points
3. **Align with audience:** Match tone to `targetAudienceTypes`
4. **Focus on outcomes:** Describe what you want, not how to achieve it
5. **Keep it focused:** Avoid overly long rules (aim for < 2KB for performance)
6. **Test and iterate:** Refine rules based on generated content quality

---

## FAQ

Q1: Changes didn’t take effect
- Possible causes: unsaved file, YAML errors, or you need to regenerate
- Fixes: save, fix YAML, run `aigne web generate`, and verify output contains updated values

Q2: How to add languages?
- Run the translate command:
  ```bash
  aigne web translate
  ```
- The command will guide you to select which languages to add
- Generated language versions will appear in `.aigne/web-smith/pages/workspace/{lang}/`
- The command automatically updates `translateLanguages` in your `config.yaml`

Q3: Generated content doesn’t match expectations
- Causes: insufficient `rules`, misaligned `targetAudienceTypes`, or sparse `sourcesPath`
- Fixes: enrich `rules`, adjust audience, add more sources

Q4: How to fix format errors?
- Common: full‑width colons, inconsistent indentation, bad arrays
- Fixes: follow the guidance in Section 6, restore from backup if needed, and regenerate to verify
