# WebSmith Config

This guide explains the purpose and usage of the `config.yaml` file, the core configuration for any WebSmith project. You can find this file in your project's root directory at `.aigne/web-smith/config.yaml`.

---

## What is the Configuration File?

### Basic Information

The `config.yaml` file is the **core configuration file** for WebSmith. It uses the YAML format to store all the parameters that WebSmith needs to generate your website.

**File Details**:
- **File Name**: `config.yaml` (fixed name)
- **Location**: `.aigne/web-smith/config.yaml` (relative to the project root)
- **Format**: YAML (UTF-8 encoding)

### Core Purpose

The configuration file serves as the **central parameter carrier** for WebSmith's operations. Each time the `generate` command is executed, the AI agent reads this file and generates the website structure and content based on its settings.

**Primary Functions**:
- Define the website type and target audience.
- Control the content generation strategy and writing style.
- Determine the website scale and page structure.
- Configure multilingual support.
- Set deployment parameters.

---

## What is the Configuration File For?

### Core Function

The `config.yaml` file is the **instruction manual** used when running the `aigne web generate` command. It tells the system how to generate the website. Through this file, you can specify the website's style and type, the AI's writing style, the scale of the site (single-page or multi-page), language versions, and all other key parameters that guide the AI agent in generating a website structure and content that meets your needs.

**In summary**: The configuration file is the sole basis and source of parameters for WebSmith's website generation. The entire process is based on the settings in this file.

### Functional Groups

The fields in the configuration file are divided into the following functional groups:

#### Project Foundation

This group contains the basic identification and display information for the project, used for website branding and SEO optimization.

**Fields**: `projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

**Purpose**: Defines the website's name, description, logo, identifier, and other basic information, affecting page titles, navigation menus, SEO meta tags, and social media sharing.

#### Website Strategy

This group defines the website's type, style, scale, and generation strategy, and is the core configuration for controlling AI-generated content.

**Fields**: `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

**Purpose**:
- `pagePurpose`: Defines the website type (e.g., marketing landing page, e-commerce site, SaaS product website), which influences the generated page components and content organization.
- `targetAudienceTypes`: Defines the target audience (e.g., end-users, developers, business owners), which affects the AI's writing style, language complexity, and choice of examples.
- `websiteScale`: Defines the website scale (single-page or multi-page), controlling the number of pages to be generated.
- `rules`: Provides detailed guidance for page generation, including structure, content, and style requirements.

#### Internationalization

This group configures the language versions of the website, supporting multilingual website generation.

**Fields**: `locale`, `translateLanguages`

**Purpose**: Defines the website's primary language and a list of languages for translation, controlling which language versions of the website are generated (a complete website structure is generated for each language).

#### Content Sources

This group specifies the content sources for the AI to analyze, which are used as material and reference information for generating website pages.

**Fields**: `sourcesPath`, `defaultDatasources`

**Purpose**:
- `sourcesPath`: Specifies the document directories, Markdown files, YAML files, image resources, etc., for the AI to analyze. **This field determines the quality and effectiveness of the generated website content, directly affecting the accuracy, relevance, and professionalism of the AI-generated content.**
- `defaultDatasources`: Specifies common data sources to be injected into every page, which are added to the context each time a command is run (e.g., `media.md`, which contains the location and descriptions of images in the project).

#### Output and Deployment

This group configures the output location for generated files and website deployment parameters.

**Fields**: `pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

**Purpose**:
- `pagesDir`: Specifies the directory where the generated page files are saved (output location).
- `appUrl`: Specifies the deployment URL for the website, affecting generated links and SEO.
- `checkoutId`, `shouldSyncAll`, `navigationType`: These are temporary variables used during development, serving only as placeholder data in the configuration file. Users do not need to be concerned with these values.

#### Media and Display

This group configures parameters related to image quality and display.

**Fields**: `media.minImageWidth`, `lastGitHead`

**Purpose**:
- `media.minImageWidth`: Defines the minimum image width requirement, used to filter out low-quality images.
- `lastGitHead`: Records the Git commit ID from the last generation, used for incremental updates.

---

## How is the Configuration File Generated?

### Generation Method

The configuration file is generated by running the following command:

```bash
aigne web init
```

This command starts an interactive wizard that guides you through the configuration process step-by-step:

1.  **Website Type** (`pagePurpose`): Select the primary purpose of the website (multiple selections allowed).
2.  **Target Audience** (`targetAudienceTypes`): Select the user groups the website is intended for (multiple selections allowed).
3.  **Website Scale** (`websiteScale`): Choose the number of pages for the website.
4.  **Primary Language** (`locale`): Select the main language of the website.
5.  **Translation Languages** (`translateLanguages`): Choose the languages to translate into (multiple selections allowed).
6.  **Page Output Directory** (`pagesDir`): Set the location to save the generated page files.
7.  **Data Source Paths** (`sourcesPath`): Specify the content sources for the AI to analyze (multiple paths can be added).
8.  **Custom Rules** (`rules`): Optionally, provide detailed requirements for page generation.

After completing the wizard, the configuration file is automatically saved to `.aigne/web-smith/config.yaml`.

### Configuration Example

The following is the actual configuration file for the AIGNE WebSmith project itself:

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

### Field Reference

Based on the real configuration above, here is a detailed explanation of each field:

#### Project Foundation

**`projectName`**
- **Purpose**: The display name of the project, shown in the page title (`<title>`), navigation menu, and site branding.
- **Type**: String
- **Impact of Changes**: Changing this value will update the name displayed across the entire website. It is recommended to keep it concise (under 50 characters) for better display and SEO.
- **How to Apply**: Run `aigne web update` or `aigne web generate`.

**`projectDesc`**
- **Purpose**: The project description, used for the SEO meta description tag (`<meta name="description">`) and social media sharing.
- **Type**: String
- **Impact of Changes**: Modifying this updates the meta tags and social sharing descriptions. It is recommended to keep it under 150 characters and include core keywords for SEO.
- **How to Apply**: Run `aigne web update` or `aigne web generate`.

**`projectLogo`**
- **Purpose**: The project logo, used in the page header, browser favicon, and social sharing thumbnails.
- **Type**: String (URL or file path)
- **Impact of Changes**: Updates the logo across the site. Supports HTTPS URLs or relative paths (e.g., `./assets/images/logo.svg`). PNG or SVG formats are recommended.
- **How to Apply**: Run `aigne web update` or `aigne web generate`.

**`projectId`**
- **Purpose**: A unique identifier for the project, used by WebSmith services to associate deployments, history, and data sources.
- **Type**: String (UUID format)
- **Impact of Changes**: ⚠️ **Important**: Do not modify this ID unless you intend to create a new project. Changing it may break associations with existing deployments, history, and data sources.
- **How to Apply**: If modification is necessary, run `aigne web generate` to regenerate.

**`projectSlug`**
- **Purpose**: The URL path prefix, affecting the site's deployment path and internal link generation.
- **Type**: String (URL path format)
- **Impact of Changes**: A value of `/` deploys the site to the root (e.g., `https://example.com/`), while `/docs` deploys it to `https://example.com/docs/`.
- **How to Apply**: Run `aigne web generate` to update all links.

**`projectCover`**
- **Purpose**: The website's cover image, used for previews on social media (e.g., Open Graph, Twitter Cards).
- **Type**: String (file path)
- **Impact of Changes**: Updates the preview image for social sharing. A high-quality image (at least 1200x630px) is recommended.
- **How to Apply**: Run `aigne web update` or `aigne web generate`.

#### Website Strategy

**`pagePurpose`**
- **Purpose**: Defines the primary goal of the website, directly influencing the AI's generation strategy and page structure.
- **Type**: Array (multiple selections allowed)
- **Available Values**:
  - `landingPage`: For marketing and conversion. Generates hero sections, features, CTAs, etc.
  - `ecommerce`: For online sales. Generates product catalogs, shopping carts, etc.
  - `saas`: For SaaS product websites. Generates feature descriptions, pricing, demos, etc.
  - `portfolio`: For showcasing work. Generates visually-driven layouts, galleries, etc.
  - `corporate`: For company information. Generates company overviews, services, team info, etc.
  - `blog`: For content sharing. Generates content organization, SEO optimization, etc.
  - `nonprofit`: For non-profit organizations. Generates mission statements, donation flows, etc.
  - `education`: For educational websites. Generates course lists, learning paths, etc.
  - `mixedPurpose`: For multi-purpose sites. Generates a combination of components.
- **How to Apply**: Changing this alters the entire site's content strategy. Run `aigne web generate` to regenerate completely.

**`targetAudienceTypes`**
- **Purpose**: Defines the target audience, influencing the AI's writing style, language complexity, and choice of examples.
- **Type**: Array (multiple selections allowed)
- **Available Values**:
  - `customers`: For end-users. Uses simple language, emphasizes usability.
  - `businessOwners`: For entrepreneurs. Focuses on ROI and business value.
  - `marketers`: For marketing teams. Focuses on marketing metrics and brand awareness.
  - `designers`: For designers. Emphasizes visual appeal and aesthetics.
  - `developers`: For technical users. Provides technical details, code examples, API docs.
  - `investors`: For stakeholders. Focuses on growth metrics and market opportunities.
  - `jobSeekers`: For recruitment. Focuses on company culture and career growth.
  - `students`: For learners. Uses an educational tone with step-by-step guidance.
  - `generalPublic`: For a broad audience. Uses accessible language and multiple entry points.
- **How to Apply**: Changes the tone and examples. Run `aigne web generate` to regenerate completely.

**`websiteScale`**
- **Purpose**: Defines the scale of the website, controlling the number of pages and the complexity of the navigation structure.
- **Type**: String (single selection)
- **Available Values**:
  - `singlePage`: A one-page website with multiple sections.
  - `minimal`: A small site with 2-6 core pages (e.g., Home, About, Contact).
  - `standard`: A standard site with 7-12 pages (recommended).
  - `comprehensive`: A large site with 12+ pages.
  - `aiDecide`: Lets the AI determine the appropriate scale based on other parameters.
- **How to Apply**: Directly determines the number of generated pages. Run `aigne web generate` to regenerate all pages.

**`rules`**
- **Purpose**: Provides detailed instructions for page generation in Markdown format. This is the most critical field for guiding the AI.
- **Type**: Multiline string (supports Markdown)
- **Impact of Changes**: Directly influences the quality of the generated content, including page structure, content organization, and tone.
- **How to Apply**: `rules` is a primary guide for content generation. Run `aigne web generate` to regenerate completely based on the new rules.

#### Internationalization

**`locale`**
- **Purpose**: Defines the primary language of the website. The AI first generates all content in this language.
- **Type**: String
- **Supported Codes**: Standard IETF language codes (e.g., `en`, `zh`, `ja`, `fr`, `de`).
- **How to Apply**: Changes the primary language for all pages. Run `aigne web generate` to regenerate all content in the new language.

**`translateLanguages`**
- **Purpose**: A list of additional languages to translate the website into. A complete, translated version of the site will be generated for each language.
- **Type**: Array (multiple selections allowed)
- **Supported Codes**: Same as `locale` (cannot include the `locale` value itself).
- **How to Apply**: Adds or removes language versions. Run `aigne web generate` to regenerate all language versions.

#### Content Sources

**`sourcesPath`**
- **Purpose**: Defines the content source directories/files for the AI to analyze. **This field is the determining factor for the quality, accuracy, and relevance of the generated content.**
- **Type**: Array (list of paths)
- **Impact of Changes**: Adding new paths expands the AI's knowledge base, potentially improving content quality. Removing paths may lead to missing information. Supports directories and files (`.md`, `.yaml`, `.json`, `.txt`).
- **How to Apply**: New data sources will be analyzed. Run `aigne web generate`.

**`defaultDatasources`**
- **Purpose**: Data sources that are injected into the context for every page generation task (e.g., a `media.md` file describing image assets).
- **Type**: Array (list of file paths)
- **Impact of Changes**: Useful for providing common, reusable information like contact details or brand assets.
- **How to Apply**: Effective when running `aigne web update` or `aigne web generate`.

#### Output and Deployment

**`pagesDir`**
- **Purpose**: The output directory where WebSmith saves the generated page files (e.g., `page.yaml`, `_navigations.yaml`).
- **Type**: String (path)
- **Impact of Changes**: Changes the save location for generated files. If the directory doesn't exist, it will be created automatically.
- **How to Apply**: Changes take effect on the next generation.

**`appUrl`**
- **Purpose**: The final deployment URL for the website.
- **Type**: String (URL format)
- **Impact of Changes**: Determines the platform where the site is published. Must include the protocol (`https://`).
- **How to Apply**: **Only takes effect during the `aigne web publish` command.**

**`checkoutId`**, **`shouldSyncAll`**, **`navigationType`**
- **Purpose**: These are temporary variables used during development. Users should not modify these values as they are managed automatically by the system.

#### Media and Display

**`media.minImageWidth`**
- **Purpose**: The minimum required width in pixels for images to be included. Used to filter out low-quality images.
- **Type**: Integer (pixels)
- **Impact of Changes**: A higher value ensures only high-quality images are used but may reduce the number of available images.
- **How to Apply**: Run `aigne web generate` to re-filter and apply the new image selection.

**`lastGitHead`**
- **Purpose**: Stores the Git commit hash from the last generation, used for incremental updates.
- **Type**: String (Git commit hash)
- **Impact of Changes**: This value is managed automatically by the system and should not be modified manually.

---

## When to Modify the Configuration File

### Adjusting Core Functionality

**Scenario 1: Upgrading from a single-page to a multi-page site**
- **Field to Modify**: `websiteScale` (e.g., from `singlePage` to `standard`)
- **Command**: If documents have already been generated, run `aigne web clear` then `aigne web generate`.

**Scenario 2: Changing the website's purpose**
- **Field to Modify**: `pagePurpose` (e.g., from `saas` to `ecommerce`)
- **Command**: If documents have already been generated, run `aigne web clear` then `aigne web generate`.

**Scenario 3: Adjusting the target audience**
- **Field to Modify**: `targetAudienceTypes` (e.g., from `customers` to `businessOwners`)
- **Command**: If documents have already been generated, run `aigne web clear` then `aigne web generate`.

### Updating Content Sources

**Scenario 4: Adding new content sources**
- **Field to Modify**: `sourcesPath` (add new file or directory paths)
- **Command**: Run `aigne web generate`. The new sources will be available to the AI.

### Refining and Fixing Issues

**Scenario 5: Improving image quality**
- **Field to Modify**: `media.minImageWidth` (e.g., increase from `600` to `1000`)
- **Command**: Run `aigne web update` or `aigne web generate`.

**Scenario 6: Refining AI-generated content**
- **Field to Modify**: `rules` (add more specific instructions for structure, tone, etc.)
- **Command**: Run `aigne web update` or `aigne web generate`.

### Managing Languages

**Scenario 7: Adding a new language**
- **Field to Modify**: `translateLanguages` (add a new language code, e.g., `fr`)
- **Command**: Run `aigne web translate` or `aigne web update`.

**Scenario 8: Changing the primary language**
- **Field to Modify**: `locale` (e.g., from `zh` to `en`)
- **Command**: Run `aigne web clear` then `aigne web generate`.

### Updating Basic Information

**Scenario 9: Updating project branding**
- **Fields to Modify**: `projectName`, `projectDesc`, `projectLogo`, `projectCover`
- **Command**: Run `aigne web publish`.

**Scenario 10: Setting the deployment URL**
- **Field to Modify**: `appUrl`
- **Command**: Run `aigne web publish`.

---

## How to Apply Configuration Changes

### Applying Changes with Commands

Different commands are required to apply changes to different fields:

- **Functionality (`pagePurpose`, `websiteScale`, `targetAudienceTypes`)**:
  - `aigne web clear` then `aigne web generate` if content already exists.
- **Content Sources (`sourcesPath`, `defaultDatasources`)**:
  - `aigne web generate` or `aigne web update`.
- **Issue Fixes (`media.minImageWidth`, `rules`)**:
  - `aigne web update` or `aigne web generate`.
- **Internationalization**:
  - `translateLanguages`: `aigne web translate` or `aigne web update`.
  - `locale`: `aigne web clear` then `aigne web generate`.
- **Basic Information (`projectName`, `appUrl`, etc.)**:
  - `aigne web publish`.

### Summary of Workflow

1.  Modify the `config.yaml` file.
2.  Save the file.
3.  Run the appropriate command based on the field you changed.
4.  Verify that the changes have taken effect by checking the generated files.

---

## Handling Configuration Errors

### Common Errors

- **Incorrect Indentation**: YAML is sensitive to indentation. Use spaces (not tabs) consistently.
- **Special Characters**: Use standard English colons (`:`) for key-value pairs, not other characters.
- **Incorrect Value Types**: Providing a string where an array is expected (e.g., `pagePurpose: landingPage` instead of `pagePurpose: [landingPage]`). The system will fall back to default values.
- **Missing Required Fields**: If a critical field is deleted, generation may proceed but result in a site with missing information (e.g., no title).
- **Unknown Fields**: Adding a field that does not exist in the schema will be ignored by the system and will not cause an error.

### Detection and Recovery

- **Automatic Detection**: Running any `aigne web` command will parse the file. If there is a YAML syntax error, the command will fail and report it.
- **Recovery Plan**:
  1.  **Version Control**: The best practice is to keep your `config.yaml` under version control (e.g., Git). You can revert to a previously working version.
  2.  **Validate and Correct**: Carefully review your file for syntax errors. Compare it against the examples in this guide.
  3.  **Re-initialize**: If the file is severely corrupted, you can back it up, delete it, and run `aigne web init` to generate a new, clean configuration. You can then manually copy your custom settings from the backup.

### System Robustness

- **File Not Found**: The system will guide you to run `aigne web init`.
- **YAML Parsing Fails**: The system will report a user-friendly error.
- **Unknown Fields**: Extra fields are ignored.
- **Incorrect Value Format**: The system will use default values.
- **Missing Fields**: Some fields have defaults (`locale` defaults to "en").

### Preventive Measures

1.  **Use Version Control**: Keep `config.yaml` in Git.
2.  **Back-Up Regularly**: Create backups before making significant changes.
3.  **Use the CLI**: Prefer `aigne web init` for initial setup to avoid manual errors.
4.  **Validate After Changes**: Run a command immediately after editing to check for errors.

---

## Frequently Asked Questions

### Q1: What should I do if my changes to the config file don't take effect?
**A**: First, ensure the file is saved. Second, check for YAML formatting errors. Third, make sure you are running the correct command to apply the specific change (e.g., `aigne web publish` for `projectName`).

### Q2: How do I add a new language?
**A**: Add the language code to the `translateLanguages` array in your `config.yaml` file. Then, run `aigne web translate` or `aigne web update`.

### Q3: What if the generated content doesn't meet my expectations?
**A**: This is often due to insufficient guidance. Try making your `rules` more detailed, adjusting `targetAudienceTypes` to be more specific, or adding more relevant content to your `sourcesPath`.

### Q4: How do I fix a format error in the config file?
**A**: The most common errors are inconsistent indentation, using non-standard characters for colons, and incorrect data types (e.g., string instead of an array). Refer to the "What Happens if the Configuration File is Broken?" section for detailed recovery steps.