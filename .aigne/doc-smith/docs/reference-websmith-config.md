# WebSmith Config

The `config.yaml` file is the central configuration for your WebSmith project. It dictates every aspect of your website, from its core purpose and target audience to its structure, content sources, and deployment settings. This guide provides a detailed breakdown of each configuration option.

While you can edit this file manually, we strongly recommend using the WebSmith command-line interface (CLI) to initialize and modify your configuration. The CLI provides an interactive wizard that ensures all settings are valid and follow best practices.

```bash
# Generate a new configuration file using the interactive wizard
aigne web init

# View all available commands for managing your website
aigne web --help
```

## How Configuration Translates to a Website

The following diagram illustrates the process WebSmith uses to transform your `config.yaml` file into a complete set of website files.

```d2
direction: down

config-yaml: {
  label: ".aigne/web-smith/config.yaml"
  shape: rectangle
}

websmith-engine: {
  label: "WebSmith Engine"
  shape: rectangle

  structure-planning: {
    label: "1. Website Structure Planning"
  }

  page-generation: {
    label: "2. Page Content Generation"
  }

  file-output: {
    label: "3. File Output"
  }

  structure-planning -> page-generation -> file-output: "Processes"
}

website-structure-yaml: {
  label: "website-structure.yaml"
  shape: rectangle
}

generated-page-files: {
  label: "Generated Content"
  shape: rectangle
  style.stroke-dash: 2

  page-yaml: {
    label: "page.yaml"
  }
  navigations-yaml: {
    label: "_navigations.yaml"
  }
}

output-directory: {
  label: ".aigne/web-smith/pages/workspace/"
  shape: cylinder
}

config-yaml -> websmith-engine.structure-planning: "Reads config"
websmith-engine.structure-planning -> website-structure-yaml: "Generates"

website-structure-yaml -> websmith-engine.page-generation: "Uses structure"
config-yaml -> websmith-engine.page-generation: "Uses locale"

websmith-engine.page-generation -> generated-page-files: "Generates"

generated-page-files -> websmith-engine.file-output: "Collects"
website-structure-yaml -> websmith-engine.file-output: "Collects"

websmith-engine.file-output -> output-directory: "Saves files"

```

## Example: AIGNE WebSmith Official Website

To understand how these fields work in practice, let's analyze the actual `config.yaml` file used for the official AIGNE WebSmith project.

**File Path**: `.aigne/web-smith/config.yaml`

This configuration defines a single-page SaaS tool website targeted at developers and entrepreneurs.

### Full Configuration File

```yaml AIGNE WebSmith config.yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310f5c117d09601811c.png
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

### Configuration Field Analysis

#### Project Information

These fields define the basic identity of your website.

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="The display name of the website, used in page titles (<title>), navigation bars, and logos."></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="A brief description used for SEO meta tags and social media sharing previews."></x-field>
  <x-field data-name="projectCover" data-type="string" data-required="false" data-desc="The path to a cover image for the website, used in previews and social shares."></x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false" data-desc="The URL or path to the website's logo, appearing in the header, browser favicon, and social media thumbnails."></x-field>
  <x-field data-name="projectId" data-type="string" data-required="true" data-desc="A unique identifier (UUID) for the project, crucial for deployment, history tracking, and data source association."></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="A URL path prefix for the entire site, affecting deployment paths and internal links."></x-field>
</x-field-group>

#### Website Strategy

These core fields guide the AI's high-level strategy for content and structure generation.

<x-field-group>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>Defines the primary goal of the website. For `landingPage`, the AI focuses on conversion, generating sections like a hero, feature lists, CTAs, and FAQs.</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>Specifies the intended audience. For `customers`, the AI adopts a clear, benefit-oriented writing style, emphasizing ease of use and results.</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>Determines the size and structure. A `singlePage` site consolidates all content into one scrollable `/home` page.</x-field-desc>
  </x-field>
</x-field-group>

#### Content Strategy (`rules`)

The `rules` field provides detailed, Markdown-formatted instructions for the AI, acting as a creative brief. It ensures the generated content aligns with brand voice, messaging priorities, and structural requirements. This is the most critical field for controlling the quality and direction of the AI-generated content.

#### Internationalization

These fields configure multi-language support.

<x-field-group>
  <x-field data-name="locale" data-type="string" data-required="true" data-desc="The primary language for the website. The AI generates content in this language first."></x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false" data-desc="A list of additional languages to translate the content into. WebSmith will generate a complete version of the site for each language listed."></x-field>
</x-field-group>

#### Content Sources

These paths tell the AI where to find the raw materials for website generation.

<x-field-group>
  <x-field data-name="sourcesPath" data-type="array" data-required="false" data-desc="A list of files and directories that the AI will analyze to understand the project. This can include documents, READMEs, images, and even source code."></x-field>
  <x-field data-name="defaultDatasources" data-type="array" data-required="false" data-desc="A list of data source files (e.g., media.md) that are automatically injected into every page, providing a shared context."></x-field>
</x-field-group>

#### Media and Deployment

These fields control media handling and deployment-related settings.

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false" data-desc="Settings related to media assets.">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="The minimum width in pixels for images to be considered for use, ensuring visual quality."></x-field>
  </x-field>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="The final deployment URL of the website, which influences generated links and SEO settings."></x-field>
  <x-field data-name="lastGitHead" data-type="string" data-required="false" data-desc="Internal field to track the Git commit ID of the last generation."></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="An identifier for the ArcBlock deployment service."></x-field>
</x-field-group>

## Configuration Field Reference

This section provides a comprehensive reference for all available fields in the `config.yaml` file.

### Project Information

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="The display name of your project."></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="A short description of your project, used for SEO meta tags."></x-field>
  <x-field data-name="projectId" data-type="string" data-required="true" data-desc="A unique UUID for your project. Do not change this after initialization."></x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false" data-desc="A URL or local path to your project's logo."></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="A URL prefix for your entire site (e.g., '/blog'). Defaults to '/'."></x-field>
</x-field-group>

### Website Strategy

#### `pagePurpose`
Defines the primary objective of your website, which heavily influences the AI's content strategy and component selection.

*   **Type**: `list of enums`
*   **Required**: Yes

| Value | Description | Best For |
| :--- | :--- | :--- |
| `landingPage` | Focuses on conversion with a clear value proposition, CTAs, and social proof. | Product launches, marketing campaigns |
| `ecommerce` | Optimizes for sales with product catalogs, shopping carts, and customer reviews. | Online stores |
| `portfolio` | Emphasizes visual presentation with project galleries and case studies. | Designers, developers, artists |
| `corporate` | Provides company information, including services, team, and contact details. | Businesses, agencies |
| `blog` | Organizes content for readability, SEO, and social sharing. | Content creators, publications |
| `saas` | Explains software features, pricing, and provides user onboarding guides. | Software as a Service products |
| `nonprofit` | Communicates a mission, facilitates donations, and recruits volunteers. | Charities, foundations |
| `education` | Lists courses, organizes learning paths, and tracks student progress. | Schools, online courses |
| `mixedPurpose` | Balances multiple objectives for a site with diverse user journeys. | Complex projects |

#### `targetAudienceTypes`
Defines the intended audience, which shapes the AI's writing style, tone, and vocabulary.

*   **Type**: `list of enums`
*   **Required**: Yes

| Value | Writing Style |
| :--- | :--- |
| `customers` | Clear, benefit-focused language with trust signals. |
| `businessOwners` | Professional tone, focused on ROI and efficiency. |
| `marketers` | Focus on marketing metrics, branding, and campaigns. |
| `designers` | Visually-driven language, appealing to aesthetics and creativity. |
| `developers` | Technical, precise language with code examples and API references. |
| `investors` | Focus on growth metrics, market opportunity, and financial projections. |
| `jobSeekers` | Emphasizes company culture, career growth, and benefits. |
| `students` | Educational tone with step-by-step guidance and progress tracking. |
| `generalPublic` | Simple, accessible language with broad appeal. |

#### `websiteScale`
Defines the overall size and number of pages for the website.

*   **Type**: `enum`
*   **Required**: Yes

| Value | Page Count | Description |
| :--- | :--- | :--- |
| `singlePage` | 1 | All content is consolidated on a single, scrollable home page. |
| `minimal` | 2-6 | A small site with essential pages like Home, About, Services, Contact. |
| `standard` | 7-12 | A standard business site, adding pages like Portfolio, Blog, Team, FAQ. |
| `comprehensive` | 12+ | A large, content-rich site with detailed service pages and resources. |
| `aiDecide` | Varies | Allows the AI to determine the appropriate scale based on other settings. |

### Content Strategy

<x-field-group>
  <x-field data-name="rules" data-type="multiline string" data-required="false">
    <x-field-desc markdown>Provides detailed, Markdown-formatted instructions for the AI on page structure, content, and style. This is highly recommended for achieving high-quality, targeted results.</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-required="true" data-desc="The primary language of the site, using IETF language codes (e.g., 'en', 'zh-CN')."></x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false" data-desc="A list of IETF language codes to create translated versions of the site."></x-field>
</x-field-group>

### Data Sources

<x-field-group>
  <x-field data-name="sourcesPath" data-type="list of paths" data-required="false" data-desc="A list of files and directories for the AI to analyze as source material."></x-field>
  <x-field data-name="defaultDatasources" data-type="list of paths" data-required="false" data-desc="A list of data files (e.g., company info) to be made available to every page."></x-field>
</x-field-group>

### Media and Display

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="The minimum width in pixels for an image to be used, filtering out low-quality assets."></x-field>
  </x-field>
</x-field-group>

### Deployment

<x-field-group>
  <x-field data-name="appUrl" data-type="URL" data-required="false" data-desc="The final deployment URL for the website."></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="The checkout identifier from the ArcBlock deployment service."></x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false" data-desc="Set to 'true' to sync all files on the initial deployment. Leave empty for subsequent updates."></x-field>
</x-field-group>

## Best Practices

### Configuration Management
*   **Version Control**: Always commit your `config.yaml` to a Git repository to track changes.
*   **Backups**: Before making significant changes, create a backup of your configuration file.
*   **Collaboration**: For teams, establish a clear process for reviewing and approving configuration changes.

### Performance and SEO
*   **Image Sizing**: Set a reasonable `minImageWidth` to balance visual quality and page load speed. An `800px` width is a good starting point for most sites.
*   **URL Structure**: Use a meaningful `projectSlug` for better SEO (e.g., `/portfolio` or `/docs`).
*   **Descriptions**: Write a concise, keyword-rich `projectDesc` (under 150 characters) to improve search engine visibility.

### Multi-Language Support
*   **Language Codes**: Use standard IETF language codes (e.g., `en`, `zh-CN`, `zh-TW`, `ja`) to ensure proper identification.
*   **Localization**: Review translated content to ensure it is culturally appropriate for the target region.

## Frequently Asked Questions

### Q1: How do I handle configuration for a large, complex website?
For sites with 20+ pages, use `websiteScale: comprehensive`. More importantly, structure your content sources logically in separate directories and reference them in `sourcesPath`.
```yaml
websiteScale: comprehensive
sourcesPath:
  - ./content/homepage/
  - ./content/products/
  - ./content/about/
  - ./content/blog/
  - ./assets/common/
```

### Q2: The generated content doesn't match my expectations. What should I do?
This is almost always solved by improving your `rules`. Be more specific in your instructions.
1.  **Refine `rules`**: Provide explicit guidance on page structure, tone of voice, and key messages.
2.  **Check `targetAudienceTypes`**: Ensure your selected audience accurately reflects who you're trying to reach.
3.  **Add More `sourcesPath`**: Give the AI more context by providing brand stories, product feature lists, or customer case studies.

### Q3: Why did my multi-language build fail?
The most common causes are incorrect language codes or source content encoding issues.
1.  **Verify Codes**: Double-check that `locale` and `translateLanguages` use valid IETF codes.
2.  **Check Encoding**: Ensure all your source files are saved with UTF-8 encoding.

### Q4: Why are my images blurry or not appearing?
This usually relates to the `minImageWidth` setting or incorrect file paths.
1.  **Adjust `minImageWidth`**: If you have smaller but acceptable images, lower the value (e.g., from `800` to `600`).
2.  **Verify Paths**: Check that the image paths in your `sourcesPath` are correct and that the files exist.
3.  **Check Format**: Ensure images are in a supported format (JPG, PNG, GIF, WebP, SVG).
