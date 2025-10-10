# Generating a Website

The `aigne web generate` command is the core function for creating a new website. It uses an AI-powered process to interpret your requirements, plan the website structure, and generate all the necessary content and template files. The entire process is guided by a configuration file where you define the goals and specifications for your site.

This guide will provide a systematic overview of the `generate` command and a detailed breakdown of the configuration file parameters. For a hands-on tutorial, please refer to [Your First Website](./getting-started-your-first-website.md).

## The `generate` Command

The generation process is initiated using the `generate` command. Its primary purpose is to read your configuration, interact with the AI agents, and build the website files in your local workspace.

**Usage**

```bash Command Line icon=lucide:terminal
aigne web generate
```

**Aliases**

For convenience, you can also use the shorter aliases `gen` or `g`.

```bash Command Line icon=lucide:terminal
# These commands are equivalent to 'aigne web generate'
aigne web gen
aigne web g
```

Typically, you will pass your requirements to the command using an input file. This is done with the `--input` flag, followed by an `@` symbol and the path to your configuration file.

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-website.yaml
```

## Website Configuration File

To generate a website, you must provide a configuration file in YAML format. This file serves as the blueprint, defining the website's purpose, target audience, style, and content requirements. The AI uses this information to make informed decisions about the site's structure, tone, and features.

The following parameters are available for your configuration file:

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>A detailed description of the website you want to create. This is the most critical parameter. You should provide a clear, structured set of instructions, including the types of pages needed (e.g., homepage, pricing, about us), key features to highlight, and any specific requirements for style or content. The more precise the rules, the better the AI can tailor the website to your needs.</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>A description of the intended audience for the website. For example, `small business owners`, `software developers`, or `potential investors`. This helps the AI adjust the language, tone, and complexity of the content appropriately.</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>The primary language for the website content. Currently, supported values are `en` for English and `zh` for Chinese. The default is `zh`.</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>Defines the overall aesthetic and tone of the website. For example, `business`, `creative`, `minimalist`, or `tech-focused`. This influences the AI's choice of layout, imagery, and writing style.</x-field-desc>
  </x-field>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>A list of specific terms, product names, or jargon that should be used consistently throughout the website. This ensures terminological accuracy. You can provide this as a string or load it from a file using the `@<file-path>` syntax.</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>If set to `true`, the command will regenerate all pages from scratch, ignoring any existing files from a previous generation. This is useful when you want a completely fresh start.</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>The Project ID from your Pages Kit instance. While not required for generation, providing it here can streamline the subsequent publishing process. See [Publishing Your Website](./core-tasks-publishing-your-website.md) for more details.</x-field-desc>
  </x-field>
</x-field-group>

## Step-by-Step Example

Here is a practical, step-by-step process for generating a website.

### Step 1: Create the Configuration File

First, create a new YAML file to define your website. For this example, we will name it `my-saas-website.yaml`.

```yaml my-saas-website.yaml icon=lucide:file-text
rules: |
  Create a modern SaaS product website that includes:
  1. A homepage with product introduction and core features.
  2. A pricing page with a comparison table for different plans.
  3. A page for customer success stories and testimonials.
  4. A dedicated portal for technical documentation.
  5. A contact page with a support form and contact details.

  Requirements:
  - The style should be professional and business-oriented.
  - The content must highlight the product's advantages and unique selling points.
  - Include clear Call-to-Action (CTA) buttons to guide users toward a free trial.

targetAudience: Small to medium-sized business (SMB) owners and technical decision-makers.
locale: en
websiteStyle: business
```

### Step 2: Run the `generate` Command

With the configuration file saved, open your terminal and run the `generate` command, pointing to your file using the `--input` flag.

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-saas-website.yaml
```

The AI will now begin the generation process. It will analyze your rules, plan the site structure, and then create the content for each page. You will see progress updates in your terminal. This process may take several minutes, depending on the number of pages and the complexity of the requirements.

### Step 3: Review the Generated Files

Once the command completes, the generated website files will be saved in your project's workspace. You can now inspect the files to see the structure and content created by the AI.

## Summary

The `generate` command is a powerful tool that transforms a simple set of text-based requirements into a fully-formed website. The key to a successful outcome is a clear and detailed `rules` definition in your YAML configuration file.

After generating your website, the next logical step is to publish it. To learn how, proceed to the next section.

- **Next**: [Publishing Your Website](./core-tasks-publishing-your-website.md)