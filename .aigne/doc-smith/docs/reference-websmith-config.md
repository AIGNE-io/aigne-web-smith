# WebSmith Configuration File

This guide provides a detailed reference for all settings in the `.aigne/web-smith/config.yaml` file. This file is the single source of truth for how WebSmith plans, generates, and deploys your site. It defines your project's messaging, target audiences, data sources, localization, and publishing details, which the AI agents rely on for every `generate` or `update` command.

**Key Principles**

*   **Stable Metadata**: Keep required metadata such as `projectName`, `projectId`, and `projectSlug` consistent. Downstream services rely on these identifiers.
*   **Strategy-Driven Content**: The strategy fields (`pagePurpose`, `targetAudienceTypes`, `rules`) direct the AI's narrative style. Update these first when your product or marketing strategy changes.
*   **Explicit Data Sources**: The `sourcesPath` and `defaultDatasources` lists control what content WebSmith analyzes. New data files must be registered here before generation.
*   **Controlled Deployment**: Deployment settings (`appUrl`, `checkoutId`) influence how the generated website is published.

```d2
direction: down

# Actors
developer: {
  label: "Developer"
  shape: c4-person
}

# Core Components
websmith-engine: {
  label: "AIGNE WebSmith Engine"
  shape: rectangle
  style: {
    fill: "#f0f4ff"
    stroke: "#b3c7f2"
  }
}

# Artifacts & Data
config-file: {
  label: "config.yaml"
  shape: rectangle
  grid-columns: 2
  grid-gap: 40

  metadata: {
    label: "1. Project Metadata"
    shape: rectangle
    projectName
    projectDesc
    projectId
  }

  strategy: {
    label: "2. Website Strategy"
    shape: rectangle
    pagePurpose
    targetAudienceTypes
    rules
  }

  localization: {
    label: "3. Localization"
    shape: rectangle
    locale
    translateLanguages
  }

  sources: {
    label: "4. Content Sources"
    shape: rectangle
    sourcesPath
  }

  media: {
    label: "5. Media & Assets"
    shape: rectangle
    minImageWidth
    projectCover
  }

  deployment: {
    label: "6. Deployment"
    shape: rectangle
    appUrl
    checkoutId
  }
}

content-sources: {
  label: "Content Sources\n(.md, .yaml)"
  shape: cylinder
}

repository: {
  label: "Git Repository"
  shape: cylinder
  
  generated-site: {
    label: "Generated Website\n(Markdown/HTML)"
    shape: cylinder
    style.fill: "#e6ffed"
  }
}

# Workflow Connections
developer -> config-file: "1. Modify Configuration"
developer -> content-sources: "2. Add New Sources"
developer -> websmith-engine: "3. Run `aigne generate`"

config-file -> websmith-engine: "Reads"
content-sources -> websmith-engine: "Analyzes"

websmith-engine -> repository.generated-site: "Generates/Updates"

developer -> repository: "4. Review & Commit"
```

## Configuration Structure

The configuration is organized into several logical sections. Below is a detailed breakdown of each parameter.

### Project Publishing Metadata

This section defines the core identity of your project. This information is used in generated pages, reports, and SEO metadata.

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="The human-readable title of your project. It appears in page titles and reports."></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="A short marketing description used for SEO metadata and internal AI prompts."></x-field>
  <x-field data-name="projectLogo" data-type="URL" data-required="false" data-desc="The absolute URL or a reachable CDN path to your project's logo, used in headers and social media cards."></x-field>
  <x-field data-name="projectId" data-type="UUID" data-required="true" data-desc="A unique identifier for WebSmith services. This is automatically generated and should not be modified or recycled between projects."></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="The default URL segment for your project (e.g., /my-site). Keep this in sync with your deployment target."></x-field>
</x-field-group>

### Website Strategy & Narrative

These fields guide the AI on the narrative, tone, and structure of the website content.

<x-field-group>
  <x-field data-name="pagePurpose" data-type="list" data-required="true">
    <x-field-desc markdown>Declares the primary goal of the site (e.g., `landingPage`, `portfolio`, `documentation`). You can list multiple purposes to blend storytelling approaches.</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="list" data-required="false">
    <x-field-desc markdown>Guides the tone and calls-to-action (CTAs). Valid options include `customers`, `developers`, `investors`, etc. Include all relevant audiences.</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="enum" data-required="false">
    <x-field-desc markdown>Indicates the intended size and complexity of the site (e.g., `singlePage`, `standard`, `aiDecide`).</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>High-priority instructions for the AI regarding structure, narrative flow, and tone. WebSmith parses Markdown formatting (headings, lists) as guidance, not literal copy.</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="path" data-required="false" data-desc="The output directory for generated website pages. This is where WebSmith writes the final files."></x-field>
</x-field-group>

### Localization & Languages

Configure the languages for your website content.

<x-field-group>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>The primary language for content generation, specified using an IETF language code (e.g., `en`, `en-US`, `zh-TW`).</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="list" data-required="false">
    <x-field-desc markdown>A list of additional IETF language codes into which WebSmith should translate the content.</x-field-desc>
  </x-field>
</x-field-group>

### Content Sources & Datasources

Define where WebSmith should find your content.

<x-field-group>
  <x-field data-name="sourcesPath" data-type="list" data-required="false">
    <x-field-desc markdown>A list of directory or file paths that WebSmith analyzes for context. Add new data files (e.g., `.yaml`, `.md`) here before generation.</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="list" data-required="false">
    <x-field-desc markdown>A list of datasource paths that are automatically injected into every page. Useful for globally available data like media catalogs.</x-field-desc>
  </x-field>
</x-field-group>

### Media & Visual Assets

Control the handling of images and other visual elements.

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="The minimum allowed width (in pixels) for images in generated layouts."></x-field>
  </x-field>
  <x-field data-name="projectCover" data-type="path" data-required="false" data-desc="The path to a cover image used for hero sections and social media previews."></x-field>
</x-field-group>

### Deployment & Integration

These fields contain settings related to publishing your website.

<x-field-group>
  <x-field data-name="appUrl" data-type="URL" data-required="false" data-desc="The primary deployment URL for the website. Used for canonical links and other references."></x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false" data-desc="An optional override for the navigation style."></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="The identifier for ArcBlock’s deployment/checkout service."></x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>Controls whether the publish step pushes all artifacts. Set to `"true"` for a full sync.</x-field-desc>
  </x-field>
  <x-field data-name="lastGitHead" data-type="string" data-required="false" data-desc="The Git commit SHA from the last generation. WebSmith updates this automatically."></x-field>
</x-field-group>

## Example Configuration

Here is a sample `config.yaml` file that demonstrates a typical setup.

```yaml config.yaml icon=logos:yaml
# 1. Project Publishing Metadata
projectName: "AIGNE WebSmith Docs"
projectDesc: "The official documentation for AIGNE WebSmith."
projectLogo: "https://example.com/logo.png"
projectId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
projectSlug: "websmith-docs"

# 2. Website Strategy & Narrative
pagePurpose:
  - documentation
  - landingPage
targetAudienceTypes:
  - developers
websiteScale: "standard"
rules: |
  - Focus on clarity and practical examples.
  - Maintain a professional but approachable tone.
  - Ensure all code snippets are accurate and easy to copy.
pagesDir: "src/pages"

# 3. Localization & Languages
locale: "en"
translateLanguages:
  - "zh-TW"

# 4. Content Sources & Datasources
sourcesPath:
  - "src/content"
  - "src/data/features.yaml"
defaultDatasources:
  - "src/data/site-metadata.yaml"

# 5. Media & Visual Assets
media:
  minImageWidth: 600
projectCover: "src/assets/cover-image.png"

# 6. Deployment & Integration
appUrl: "https://docs.aigne.com/websmith"
checkoutId: "chk_12345"
shouldSyncAll: "false"
lastGitHead: ""
```

## Common Update Workflow

To apply changes to your website using the configuration file, follow these steps:

1.  **Modify Configuration**: Adjust the strategy, metadata, or other fields in `config.yaml` as needed.
2.  **Register New Sources**: If you have new data files, register them under `sourcesPath` and, if necessary, `defaultDatasources`.
3.  **Run WebSmith**: Use `aigne run generate` for a completely new build or `aigne run update` to refresh the content on existing pages.
4.  **Review and Commit**: Review the generated content to ensure it reflects your changes, then commit the updated files to your repository.

By keeping this configuration file aligned with your project's goals and content sources, you ensure that WebSmith consistently generates a high-quality, on-brand website.
