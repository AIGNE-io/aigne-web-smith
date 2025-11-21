# Config Reference

The `config.yaml` file is the central control panel for your website generation. Understanding its settings allows you to customize every aspect of the AI's output, from page structure to content tone. This guide provides a complete, field-by-field reference to help you modify your site with precision.

## Overview

The `config.yaml` file is the primary configuration source for AIGNE WebSmith. It uses the YAML format to store all the parameters the AI agent needs to generate your website. Every time you run a command like `generate` or `update`, WebSmith reads this file to understand your requirements.

-   **File Name:** `config.yaml`
-   **Location:** `.aigne/web-smith/config.yaml` (relative to your project's root directory)
-   **Format:** YAML (UTF-8)

This file controls the website's purpose, target audience, content generation rules, page structure, multilingual support, and deployment settings.

### Creating and Updating the Configuration

The `config.yaml` file is created automatically when you first use WebSmith.

**Creation:**

You can create the file in two ways:

1.  **During the first generation:** Running `aigne web generate` in a new project will launch an interactive wizard to create the `config.yaml` file before starting the generation process.
2.  **Separately:** Running `aigne web init` launches the same wizard to create the configuration file without immediately generating the site.

```sh aigne web init icon=lucide:terminal
aigne web init
```

![AIGNE WebSmith configuration wizard](../../../assets/images/web-smith-config.png)

**Updating:**

You can update your configuration using one of two methods:

1.  **Directly edit the file:** Open `.aigne/web-smith/config.yaml` in a text editor and modify the fields.
2.  **Use the interactive wizard:** Run `aigne web init` again. The wizard will load your existing settings and guide you through updating them.

## Configuration Parameters

The fields in `config.yaml` are organized into functional groups. The following sections provide a detailed explanation of each parameter.

### Project Basics

This group defines your project's identity, which is used for branding, SEO, and social media sharing.

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>The display name for your project. It appears in page titles (`<title>`), navigation bars, and other branding elements. Keep it under 50 characters for readability.</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true">
    <x-field-desc markdown>A brief description of your project used for the SEO meta description (`<meta name="description">`) and social sharing previews. Aim for under 150 characters.</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>The URL or local path to your project's logo. It is used for the site header, favicon, and social media thumbnails. Supports full URLs or relative paths (e.g., `./assets/logo.png`).</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>A unique UUID that identifies your project within WebSmith services. It is generated automatically and should not be changed, as doing so will disassociate your project from its deployment history.</x-field-desc>
  </x-field>
  <x-field data-name="projectSlug" data-type="string" data-default="/" data-required="false">
    <x-field-desc markdown>A URL path prefix for your site's deployment. For example, a slug of `/docs` would deploy the site to `https://example.com/docs/`.</x-field-desc>
  </x-field>
  <x-field data-name="projectCover" data-type="string" data-required="false">
    <x-field-desc markdown>The path to a cover image used for social media previews (e.g., Open Graph). Use a high-quality image with a recommended size of 1200×630 pixels.</x-field-desc>
  </x-field>
</x-field-group>

### Site Strategy

These fields define the high-level strategy for the AI, influencing the site's purpose, content tone, and overall structure.

<x-field-group>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>Defines the primary goal of the website, which influences the page structure and components used. Possible values include `landingPage`, `ecommerce`, `saas`, `portfolio`, `corporate`, `blog`, `nonprofit`, and `education`.</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>Specifies the target audience, which affects the AI's tone, complexity, and examples. Possible values include `customers`, `businessOwners`, `marketers`, `designers`, `developers`, `investors`, `jobSeekers`, `students`, and `generalPublic`.</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-default="standard" data-required="false">
    <x-field-desc markdown>Controls the number of pages and navigation complexity. Options are: `singlePage` (one scrollable page), `minimal` (2-6 pages), `standard` (7-12 pages, recommended), `comprehensive` (12+ pages), or `aiDecide` (lets the AI choose).</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>Provides detailed, multi-line instructions for the AI on content structure, tone, and style. This is a critical field for guiding the generation process to match your specific requirements. Supports Markdown format.</x-field-desc>
  </x-field>
</x-field-group>

### Languages

Configure the primary language and any additional languages for translation.

<x-field-group>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="false">
    <x-field-desc markdown>The primary language for the website's base content, specified using an IETF language code (e.g., `en`, `zh`, `ja`).</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>A list of additional language codes to translate the site into. Each language code will generate a full, translated version of the site structure.</x-field-desc>
  </x-field>
</x-field-group>

### Data Sources

These fields specify the content and data that the AI agent will use as reference material.

<x-field-group>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>An array of local directory and file paths for the AI to analyze. **This is the most important field for content quality**, as the AI uses only these sources as references. Include documentation, READMEs, and other key project files.</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="array" data-required="false">
    <x-field-desc markdown>An array of file paths that are injected into the context of every page. This is useful for shared data like a `media.md` file that lists image locations and descriptions.</x-field-desc>
  </x-field>
</x-field-group>

### Output & Deployment

Configure output directories and deployment URLs.

<x-field-group>
  <x-field data-name="pagesDir" data-type="string" data-default="./aigne/web-smith/pages" data-required="false">
    <x-field-desc markdown>The output directory where generated site files (e.g., `page.yaml`) are stored.</x-field-desc>
  </x-field>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>The final deployment URL of your website. This is used by the `publish` command to determine the deployment target.</x-field-desc>
  </x-field>
</x-field-group>

### Media & Display

These settings control how media assets like images are handled.

<x-field-group>
  <x-field data-name="media.minImageWidth" data-type="integer" data-default="800" data-required="false">
    <x-field-desc markdown>The minimum width in pixels for an image to be considered for use on the website. This helps filter out low-quality or small images.</x-field-desc>
  </x-field>
</x-field-group>

### System-Managed Fields

These fields are typically managed by WebSmith and do not require manual editing.

<x-field-group>
  <x-field data-name="lastGitHead" data-type="string" data-required="false">
    <x-field-desc markdown>The Git commit hash of the last generation, used for incremental updates.</x-field-desc>
  </x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false">
    <x-field-desc markdown>A temporary variable used during development.</x-field-desc>
  </x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>A temporary variable used during development.</x-field-desc>
  </x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false">
    <x-field-desc markdown>A temporary variable used during development.</x-field-desc>
  </x-field>
</x-field-group>

## Applying Changes

Changes to the `config.yaml` file are not applied automatically. You must run the appropriate command to see your modifications take effect. The command needed depends on which field you changed.

| Field(s)                                                                    | Command to Apply Changes                               | Notes                                                               |
| :-------------------------------------------------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------ |
| `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `locale`              | `aigne web clear && aigne web generate`                | These require a full regeneration to restructure the site correctly. |
| `rules`, `media.minImageWidth`, `defaultDatasources`                        | `aigne web update`                                     | Updates existing content without a full regeneration.               |
| `sourcesPath`                                                               | `aigne web clear && aigne web generate` or `aigne web update` | New sources are analyzed to improve content during updates.         |
| `translateLanguages`                                                        | `aigne web translate`                                  | Adds new language versions based on the updated list.               |
| `projectName`, `projectDesc`, `projectLogo`, `projectCover`, `appUrl` | `aigne web publish`                                    | These fields are primarily used during the publishing process.      |

## Full Configuration Example

The following is a complete `config.yaml` file from the AIGNE WebSmith project itself, demonstrating a real-world configuration.

```yaml config.yaml
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

## Summary

Mastering the `config.yaml` file gives you full control over the website generation process. By carefully defining your project basics, site strategy, and data sources, you can guide the AI to produce a high-quality, relevant, and customized website.

For more hands-on guidance, see the following guides:

<x-cards data-columns="3">
  <x-card data-title="Create Website" data-icon="lucide:rocket" data-href="/guides/create-website">Learn the complete workflow for generating your first site from scratch.</x-card>
  <x-card data-title="Prepare Materials" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">Understand how to prepare your source documents for the best results.</x-card>
  <x-card data-title="Troubleshooting" data-icon="lucide:wrench" data-href="/reference/trouble-shooting">Find solutions to common configuration and generation issues.</x-card>
</x-cards>