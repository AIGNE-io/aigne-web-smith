# Command Line Reference

This document provides a comprehensive, factual reference for all commands available in the AIGNE WebSmith Command Line Interface (CLI). Each entry includes a description of the command's function, its available aliases, and a detailed list of its parameters and subcommands.

The standard syntax for CLI operations is as follows:
```bash
aigne web <command> [subcommand] [parameters]
```

Executing `aigne web` without a command initiates an interactive chat session.

## Main Commands

The following table summarizes the primary commands. Each command is detailed further in the sections below.

| Command | Aliases | Description |
| :--- | :--- | :--- |
| [generate](#generate) | `gen`, `g` | Generates a complete website based on a configuration file. |
| [publish](#publish) | `pub`, `p` | Publishes the generated website to a Pages Kit instance. |
| [update](#update) | `up` | Modifies existing website content based on user feedback. |
| [translate](#translate) | | Translates website pages into different languages. |
| [theme](#theme) | | Manages website visual themes, including generation and application. |
| [component](#component) | `comp` | Manages the component library used to build the website. |
| [chat](#chat) | | Starts an interactive chat session for website management (default). |
| [prefs](#prefs) | | Manages saved user preferences learned from feedback. |
| [history](#history) | | Displays a log of previous updates made to the website. |
| [clear](#clear) | | Removes generated files, workspace data, or configuration settings. |

---

### generate
The `generate` command orchestrates the creation of a complete website, from planning the site structure to generating page content and templates based on a specified configuration file.

**Aliases:** `gen`, `g`

**Usage:**
```bash
aigne web generate
```

**Parameters:**

<x-field-group>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="Specifies the file path for the website configuration. This is typically provided automatically."></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="Path to a glossary file to ensure consistent terminology. Use the format @<file>."></x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false" data-desc="Forces the regeneration of all pages, overwriting any existing generated content."></x-field>
</x-field-group>

### publish
The `publish` command uploads the generated website files to a Pages Kit instance. It manages the batch upload process and provides status monitoring.

**Aliases:** `pub`, `p`

**Usage:**
```bash
aigne web publish --appUrl "https://example.com"
```

**Parameters:**

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="The target base URL of the Pages Kit website where the pages will be published."></x-field>
  <x-field data-name="with-navigations" data-type="string" data-required="false" data-default="menu" data-desc="Publishes navigation data. Accepted values are 'flat' or 'menu'."></x-field>
  <x-field data-name="with-locales" data-type="boolean" data-required="false" data-desc="Publishes website locale and language settings when set to true."></x-field>
</x-field-group>

### update
The `update` command modifies the content of an existing website based on user-provided feedback. It can be used to refine text, add or remove sections, or alter page structures.

**Alias:** `up`

**Usage:**
```bash
aigne web update --pages "/about" --feedback "Add a mission statement."
```

**Parameters:**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="An array of page paths to be updated (e.g., [\"/about-us\", \"/contact\"])."></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="A description of the required changes or improvements for the specified pages."></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="Path to a glossary file for consistent terminology. Use the format @<file>."></x-field>
</x-field-group>

### translate
The `translate` command translates the content of existing website pages into one or more specified languages.

**Usage:**
```bash
aigne web translate --pages "/home" --langs "fr,de,es"
```

**Parameters:**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="An array of page paths to be translated."></x-field>
  <x-field data-name="langs" data-type="array" data-required="false" data-desc="An array of language codes. Available languages: en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar."></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="Specific instructions to guide and improve the quality of the translation."></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="Path to a glossary file for consistent translation. Use the format @<file>."></x-field>
</x-field-group>

### theme
The `theme` command manages website visual themes, including their generation and application.

#### Subcommands

**`generate`**
Generates a new theme based on the website's design and user suggestions.

**Alias:** `gen`

**Usage:**
```bash
aigne web theme generate --name "CustomTheme"
```

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="false" data-desc="A name for the new theme."></x-field>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="The file path of the website configuration to use as a basis for the theme."></x-field>
</x-field-group>

**`apply`**
Applies a previously generated theme to the website.

**Alias:** `a`

**Usage:**
```bash
aigne web theme apply
```
This subcommand does not have any specific parameters. It applies the currently configured theme.

### component
The `component` command manages the component library for the website.

**Alias:** `comp`

#### Subcommands

**`pull`**
Pulls components from a specified URL to update the local component library.

**Usage:**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```
<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true" data-desc="The full URL from which to pull the component library."></x-field>
</x-field-group>

**`list`**
Lists the components available in the current library.

**Aliases:** `ls`, `l`

**Usage:**
```bash
aigne web component list
```
This subcommand does not take any parameters.

### chat
The `chat` command starts an interactive session for generating, updating, and managing the website conversationally. This is the default command executed when `aigne web` is run without specifying another command.

**Usage:**
```bash
aigne web
```
This command does not take any parameters.

### prefs
The `prefs` command manages user preferences that WebSmith learns from feedback to customize AI behavior.

#### Subcommands
**`list`**
Lists all saved user preferences.

**Alias:** `ls`

**Usage:**
```bash
aigne web prefs list
```
This subcommand does not take any parameters.

**`remove`**
Removes one or more specified preferences.

**Alias:** `rm`

**Usage:**
```bash
aigne web prefs remove --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="An array of preference IDs to be removed."></x-field>
</x-field-group>

**`toggle`**
Toggles the active status of one or more preferences.

**Alias:** `t`

**Usage:**
```bash
aigne web prefs toggle --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="An array of preference IDs whose status will be toggled."></x-field>
</x-field-group>

### history
The `history` command is used to view the update history of the website content and structure.

#### Subcommands

**`view`**
Displays the update history in a compact, log-style format. Each entry includes a hash, date, operation, and the associated feedback.

**Aliases:** `log`, `list`

**Usage:**
```bash
aigne web history view
```
This subcommand does not take any parameters.

### clear
The `clear` command removes generated files, workspace data, or configuration settings from the project directory.

**Usage:**
```bash
aigne web clear --targets "generatedPages" "websiteConfig"
```

**Parameters:**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false" data-desc="An array of items to clear without prompting. Valid items are: websiteStructure, generatedPages, websiteConfig, deploymentConfig, authTokens, mediaDescription, translationCaches."></x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="false" data-desc="Overrides the default directory path for source pages."></x-field>
  <x-field data-name="tmpDir" data-type="string" data-required="false" data-desc="Overrides the default directory path for the temporary workspace."></x-field>
  <x-field data-name="outputDir" data-type="string" data-required="false" data-desc="Overrides the default directory path for generated pages."></x-field>
  <x-field data-name="configPath" data-type="string" data-required="false" data-desc="Overrides the default path for the configuration file."></x-field>
</x-field-group>

---

## Summary

This reference guide has detailed the primary commands and parameters for the AIGNE WebSmith CLI. For task-oriented instructions, refer to the guides in the [Core Tasks](./core-tasks.md) section of the documentation.
