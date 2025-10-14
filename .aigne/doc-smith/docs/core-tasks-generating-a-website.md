# Generating a Website

The core function of AIGNE WebSmith is to generate a complete, professional website from your source content and a set of defined requirements. This process is handled by the `generate` command, which orchestrates a series of AI agents to plan, write, and structure your site.

This guide details the `generate` command and explains how to define your website's requirements in the `config.yaml` file, which acts as the primary blueprint for the AI.

## The `generate` Command

The `aigne web generate` command initiates the entire website creation process. It reads your configuration, analyzes your source materials, plans the website's structure, generates content for each page, and assembles the final files.

### Usage

To run the generation process, execute the following command in your terminal:

```bash
aigne web generate
```

You can also use the aliases `gen` or `g`:

```bash
aigne web gen
```

### The Generation Process

When you run the `generate` command, WebSmith performs the following sequence of operations:

1.  **Load Configuration**: It first looks for and loads the `config.yaml` file to understand your high-level requirements. If this file doesn't exist, it will automatically initiate a guided setup to create one.
2.  **Analyze Sources**: The AI scans the documents, markdown files, and other materials specified in the `sourcesPath` of your configuration to understand the subject matter.
3.  **Plan Website Structure**: Based on the purpose, audience, and source content, the AI proposes a logical sitemap for your website, outlining all the pages and their hierarchy. You will be prompted to review and approve this structure before content generation begins.
4.  **Generate Page Content**: For each page in the approved structure, the AI generates detailed content, including titles, descriptions, and sections composed of professional components like hero banners, feature lists, and FAQs.
5.  **Save Website Files**: The final, structured content for each page is saved as YAML files in the directory specified by `pagesDir` in your configuration. These files are now ready for publishing.

### Parameters

The `generate` command accepts several optional parameters to customize its behavior.

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>Specifies the path to a glossary file (e.g., `@glossary.md`). This ensures that project-specific terms are used consistently throughout the generated content.</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>If set to `true`, the command will regenerate all pages from scratch, overwriting any previously generated files. This is useful after making significant changes to the `config.yaml` file or your source documents.</x-field-desc>
  </x-field>
</x-field-group>

**Example with parameters:**

```bash
# Regenerate the entire website using a glossary file
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## The Configuration File (`config.yaml`)

The `config.yaml` file is the blueprint for your website. It provides the AI with the necessary context and constraints to build a site that meets your specific needs. This file defines the project, the site's purpose and audience, language settings, and file locations.

Below is a detailed breakdown of the key properties within the `config.yaml` file.

### Configuration Options

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>The name of your project or website. This is used for metadata and publishing.</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="false">
    <x-field-desc markdown>A brief description of your project.</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>A URL or local path to your project's logo.</x-field-desc>
  </x-field>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>An array of strings defining the website's primary goals. Examples: `productDocumentation`, `marketingLandingPage`, `blog`, `apiReference`.</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>An array of strings identifying the primary audience. Examples: `developers`, `businessUsers`, `endUsers`, `dataScientists`.</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>Defines the desired size and complexity of the website. Options include `small` (a few key pages), `standard` (a comprehensive site), and `large` (an extensive site with deep content).</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>A field for any custom rules or specific instructions for the AI to follow during generation, such as tone of voice, content to exclude, or specific points to emphasize.</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>The primary language for the website content, specified by a language code (e.g., `en`, `zh`, `es`).</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>A list of language codes to translate the website into. For example, `['zh', 'fr']`.</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>The local directory path where the generated website page files will be saved.</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>An array of file paths or glob patterns that point to your source content. The AI will analyze these files to generate the website.</x-field-desc>
  </x-field>
</x-field-group>

### Example `config.yaml`

Here is an example of a complete `config.yaml` file with comments explaining each section.

```yaml config.yaml
# Project information for page publishing
projectName: AIGNE WebSmith
projectDesc: AI-driven website generation tool
projectLogo: https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg
projectId: aigne-websmith-docs
projectSlug: aigne-websmith

# =============================================================================
# Website Configuration
# =============================================================================

# Purpose: What's the main outcome you want readers to achieve?
# Available options (uncomment and modify as needed):
#   productDocumentation - Product Documentation: In-depth guides, tutorials, and API references.
#   marketingLandingPage - Marketing Landing Page: Showcase products and convert visitors.
#   companyIntroduction - Company Introduction: Present your company's vision and team.
#   blog              - Blog: Articles, updates, and industry insights.
#   caseStudies       - Case Studies: Customer success stories and use cases.
#   knowledgeBase     - Knowledge Base: FAQs and troubleshooting articles.
#   apiReference      - API Reference: Detailed documentation for your API.
#   mixedPurpose      - Mixed Purpose: A combination of multiple goals.
pagePurpose:
  - productDocumentation

# Target Audience: Who will be reading this most often?
# Available options (uncomment and modify as needed):
#   developers        - Developers: Technical users who build with your product.
#   businessUsers     - Business Users: Non-technical users focused on business value.
#   endUsers          - End Users: General audience using the final product.
#   dataScientists    - Data Scientists: Users focused on data and analytics.
#   investors         - Investors: Stakeholders interested in company potential.
#   jobSeekers        - Job Seekers: Potential employees exploring your company.
targetAudienceTypes:
  - developers

# Website Scale: How many pages should your website have?
# Available options (uncomment and modify as needed):
#   small                - Small: A concise website with 3-5 key pages.
#   standard             - Standard: A comprehensive site with 5-10 pages.
#   large                - Large: An extensive site with over 10 pages.
websiteScale: standard

# Custom Rules: Define specific page generation rules and requirements
rules: 'Maintain a formal and technical tone. Avoid marketing jargon. Focus on practical, step-by-step instructions.'

# Glossary: Define project-specific terms and definitions
# glossary: "@glossary.md"  # Path to markdown file containing glossary definitions

locale: en
# translateLanguages:  # List of languages to translate the pages to
#   - zh  # Example: Chinese translation
#   - en  # Example: English translation

pagesDir: ./aigne-web-smith/pages  # Directory to save generated pages
sourcesPath:  # Source code paths to analyze
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # Default datasources included in every page
  - ./media.md
# minImageWidth: Only images wider than this value (in pixels) will be used in page generation
media:
  minImageWidth: 800
```

## Summary

By combining the `generate` command with a well-defined `config.yaml` file, you can efficiently produce a complete website tailored to your exact specifications. This process automates the heavy lifting of site structure and content creation, allowing you to focus on providing high-quality source material.

After generating your website, the next step is to make it available online.

Further reading:
*   [Publishing Your Website](./core-tasks-publishing-your-website.md)