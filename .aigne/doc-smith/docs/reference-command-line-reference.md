# Command Line Reference

This document provides a comprehensive reference to all commands available in the AIGNE WebSmith Command Line Interface (CLI). Each command is detailed with its purpose, available parameters, and practical usage examples.

This guide is intended for users who require detailed information for advanced operations or automation scripts.

## Command Summary

The following table provides a quick overview of all available `aigne web` subcommands.

| Command | Aliases | Description |
| :--- | :--- | :--- |
| `generate` | `gen`, `g` | Generates a complete website from a set of requirements. |
| `publish` | - | Publishes the generated website content to Pages Kit. |
| `update` | - | Updates existing website content based on new feedback or requirements. |
| `translate` | - | Translates existing website pages into different languages. |
| `chat` | - | Starts an interactive chat session to build and modify your website. |
| `theme` | - | Manages website visual themes, including generation and application. |
| `component` | `comp` | Manages the component library used to build the website. |
| `prefs` | - | Manages user preferences learned from feedback during updates. |
| `history` | - | Displays a log of all previous updates made to the website. |
| `clear` | - | Removes generated files, workspace data, or the configuration. |

---

## Main Commands

These commands form the core workflow for creating and managing a website with WebSmith.

### generate

The `generate` command is the primary tool for creating a new website. It orchestrates a series of AI agents to plan the site structure, write content for each page, and compose the final data files.

**Usage**

```bash
aigne web generate [options]
```

**Parameters**

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>A detailed description of the website's requirements, structure, and content. This can be provided as a string or via an input file (e.g., `--input @my-website.yaml`).</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>A description of the intended audience for the website. This helps the AI tailor the content's tone and focus.</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>The target language for the website content (e.g., `en` for English, `zh` for Chinese).</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>The desired visual and textual style for the website (e.g., `business`, `creative`, `minimalist`).</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>The Pages Kit project ID. Providing this helps tailor the generated components and prepares for publishing.</x-field-desc>
  </x-field>
</x-field-group>

**Example**

This example uses an external YAML file to provide the generation rules.

```bash title="Generate a website using an input file"
aigne web generate --input @my-website.yaml
```

```yaml title="my-website.yaml"
rules: |
  Create a modern SaaS product website that includes:
  1. A homepage with a clear value proposition.
  2. A features page detailing the product's capabilities.
  3. A pricing page with multiple subscription tiers.
  4. A contact page with a form.
targetAudience: "Small to medium-sized business owners"
locale: en
websiteStyle: business
```

### publish

The `publish` command uploads the generated website pages to your Pages Kit project, making them live.

**Usage**

```bash
aigne web publish [options]
```

**Parameters**

<x-field-group>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>The unique identifier for your Pages Kit project where the website will be published.</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>Specifies the language version of the site to publish. If not provided, the default locale will be used.</x-field-desc>
  </x-field>
  <x-field data-name="dryRun" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>If set to `true`, the command will simulate the publishing process without making any actual changes, showing what would be uploaded.</x-field-desc>
  </x-field>
  <x-field data-name="overwrite" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>If set to `true`, any existing pages on Pages Kit with the same path will be overwritten. Use with caution.</x-field-desc>
  </x-field>
</x-field-group>

**Example**

```bash title="Publish the English version of a site"
aigne web publish --projectId "your-project-id" --locale en --overwrite
```

### update

The `update` command allows you to refine existing website content. You can provide feedback or new instructions to modify the structure or details of specific pages.

**Usage**

```bash
aigne web update
```

This command runs in an interactive mode, guiding you through the process of selecting pages and providing feedback for updates.

### translate

The `translate` command generates new language versions of your existing website pages. It reads the content from a source locale and creates corresponding pages in the target language.

**Usage**

```bash
aigne web translate
```

This command runs in an interactive mode, prompting you to choose the source pages and the target language for translation.

### chat

The `chat` command initiates an interactive, conversational session to build or modify your website. This mode allows you to give instructions in natural language, and the AI will perform the corresponding actions, such as creating new pages, modifying content, or planning the site structure.

**Usage**

```bash
aigne web chat
```

## Management Commands

These commands are used for managing assets, configuration, and history related to your website project.

### theme

The `theme` command group is used to manage the visual styling of your website.

#### theme generate

Creates a new theme configuration based on your design requirements.

**Usage**

```bash
aigne web theme generate --name "My Custom Theme"
```

**Parameters**

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="true">
    <x-field-desc markdown>A unique name for the new theme you are creating.</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>The path to a configuration file if you need to override default settings.</x-field-desc>
  </x-field>
</x-field-group>

#### theme apply

Applies a previously generated theme to your website.

**Usage**

```bash
aigne web theme apply
```

This command runs interactively, allowing you to select which theme to apply.

### component

The `component` command group manages the library of visual components (e.g., Hero, FAQ, CTA) used to construct your website pages.

#### component pull

Pulls the component library from a specified Pages Kit project URL. This ensures your local project has the latest available components for page generation.

**Usage**

```bash
aigne web component pull --url "your-pages-kit-url"
```

**Parameters**

<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true">
    <x-field-desc markdown>The full URL to the component pull endpoint of your Pages Kit project. This URL contains the necessary project ID and authentication secrets.</x-field-desc>
  </x-field>
</x-field-group>

### prefs

The `prefs` command allows you to view and manage user preferences that WebSmith has learned from your feedback during content updates. These preferences help the AI better align with your style in future operations.

**Usage**

```bash
aigne web prefs [action] [options]
```

**Actions & Parameters**

<x-field-group>
  <x-field data-name="--list" data-type="boolean" data-required="false">
    <x-field-desc markdown>Displays all saved preferences, indicating their status (active/inactive), scope, and content.</x-field-desc>
  </x-field>
  <x-field data-name="--remove" data-type="boolean" data-required="false">
    <x-field-desc markdown>Removes one or more preferences. Can be used with `--id` or interactively if no IDs are provided.</x-field-desc>
  </x-field>
  <x-field data-name="--toggle" data-type="boolean" data-required="false">
    <x-field-desc markdown>Toggles the active status of one or more preferences. Can be used with `--id` or interactively.</x-field-desc>
  </x-field>
  <x-field data-name="--id" data-type="array" data-required="false">
    <x-field-desc markdown>Specifies the unique IDs of the preferences to act upon for `--remove` or `--toggle` actions.</x-field-desc>
  </x-field>
</x-field-group>

**Examples**

```bash title="List all saved preferences"
aigne web prefs --list
```

```bash title="Remove a specific preference by its ID"
aigne web prefs --remove --id "pref_abc123"
```

### history

The `history` command group provides access to the log of changes made to your website.

#### history view

Displays the update history in a compact, git-log-style format. Each entry includes a unique hash, the date of the change, the operation performed, and the feedback that prompted the update.

**Usage**

```bash
aigne web history view
```

### clear

The `clear` command is used to remove generated content and reset parts of your workspace. This is useful for starting fresh or cleaning up disk space.

**Usage**

```bash
aigne web clear
```

This command runs in an interactive mode by default, allowing you to select which items to clear. You can also specify targets directly.

**Parameters**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false">
    <x-field-desc markdown>An array of items to clear without prompting. Valid values are `workspace`, `generatedPages`, and `websiteConfig`.</x-field-desc>
  </x-field>
</x-field-group>

**Example**

```bash title="Clear the workspace and generated pages non-interactively"
aigne web clear --targets workspace generatedPages
```