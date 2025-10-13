# Command Line Reference

This document provides a comprehensive reference for all commands available in the AIGNE WebSmith Command Line Interface (CLI). Each entry includes a description of the command's function, its available aliases, and a detailed list of its parameters and options.

The general syntax for all commands is:
```bash
aigne web <command> [subcommand] [options]
```

## Main Commands

The following table provides a summary of the primary commands available in the AIGNE WebSmith CLI.

| Command | Description |
| :--- | :--- |
| [generate](#generate) | Generates a complete website based on a configuration file. |
| [publish](#publish) | Publishes the generated website content to the Pages Kit platform. |
| [update](#update) | Modifies the content of an existing website based on new feedback or requirements. |
| [translate](#translate) | Translates existing website pages into different languages. |
| [theme](#theme) | Manages the visual themes for the website, including generation and application. |
| [component](#component) | Manages the component library used to build the website. |
| [chat](#chat) | Starts an interactive chat session to build and modify your website conversationally. |
| [prefs](#prefs) | Manages saved user preferences that customize WebSmith's behavior. |
| [history](#history) | Displays a log of all previous updates made to the website. |
| [clear](#clear) | Removes generated files, workspace data, or configuration settings. |

---

### generate
Generates a complete website from a user-provided configuration file. This command orchestrates the entire process, from planning the site structure to generating page content and templates.

**Aliases:** `gen`, `g`

**Usage:**
```bash
aigne web generate --input @path/to/your/config.yaml
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `config` | The path to the website configuration file. This is typically provided via the `--input` flag. | String | Yes |
| `glossary` | A file containing a glossary of terms to ensure consistent terminology throughout the generated content. Use the format `@<file>`. | String | No |
| `forceRegenerate` | If set to `true`, this forces the regeneration of all pages, even if they already exist. | Boolean | No |

### publish
Publishes the generated website files to a Pages Kit instance. This command handles the batch upload and provides status monitoring.

**Aliases:** `pub`, `p`

**Usage:**
```bash
aigne web publish --appUrl "https://your-pages-kit-url.com"
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `appUrl` | The base URL of the target Pages Kit website where the pages will be published. | String | No |
| `with-navigations` | If set to `true`, publishes website navigation data along with the pages. | Boolean | No |
| `with-locales` | If set to `true`, publishes website locale and language settings. | Boolean | No |

### update
Updates the content of an existing website based on user feedback. This command can be used to refine text, add new sections, or modify page structures.

**Alias:** `up`

**Usage:**
```bash
aigne web update --pages "/about-us" --feedback "Add a new section for team members."
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `pages` | An array of page paths to update (e.g., `/about-us`, `/contact`). | Array | No |
| `feedback` | A detailed description of the changes or improvements required for the content. | String | No |
| `glossary` | A file containing a glossary of terms for consistency. Use the format `@<file>`. | String | No |

### translate
Translates the content of existing website pages into one or more specified languages.

**Usage:**
```bash
aigne web translate --pages "/home" --langs "fr,de,es"
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `pages` | An array of page paths to translate. | Array | No |
| `langs` | An array of language codes to translate the content into. Available codes include: `en`, `zh`, `zh-TW`, `ja`, `fr`, `de`, `es`, `it`, `ru`, `ko`, `pt`, `ar`. | Array | No |
| `feedback` | Specific instructions or feedback to improve the quality of the translation. | String | No |
| `glossary` | A file containing a glossary of terms for consistent translation. Use the format `@<file>`. | String | No |

### theme
Manages the visual themes of your website. You can generate new themes based on your design preferences and apply them to your site.

#### Subcommands

**`generate`** (Alias: `gen`)
Generates a new theme configuration based on your website's design.

**Usage:**
```bash
aigne web theme generate --name "MyCustomTheme" --config @path/to/config.yaml
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `name` | A unique name for the new theme. | String | No |
| `config` | The path to the website configuration file to base the theme on. | String | No |

**`apply`**
Applies a previously generated theme to the website.

**Usage:**
```bash
aigne web theme apply
```

### component
Manages the component library for your website.

**Alias:** `comp`

#### Subcommands

**`pull`**
Pulls an updated component library from a specified URL. This ensures your website is built with the latest visual components.

**Usage:**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `url` | The full URL provided by your Pages Kit instance to pull the component library. | String | Yes |

### chat
Starts an interactive chat session that allows you to generate, update, and manage your website in a conversational manner. The chat agent can access all other commands.

**Usage:**
```bash
aigne web chat
```

This command does not take any parameters. It opens an interactive prompt in your terminal.

### prefs
Manages user preferences that WebSmith learns from your feedback over time. These preferences help tailor the AI's output to your specific needs.

**Usage:**
```bash
# List all saved preferences
aigne web prefs --list

# Remove a specific preference by its ID
aigne web prefs --remove --id "pref_abc123"
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `--list` | Displays a formatted list of all saved user preferences. | Flag | No |
| `--remove` | Removes one or more preferences. Requires the `--id` parameter or will prompt for selection. | Flag | No |
| `--toggle` | Toggles the active status of one or more preferences. Requires `--id` or will prompt. | Flag | No |
| `--id` | An array of preference IDs to be managed (removed or toggled). | Array | Only when using `--remove` or `--toggle` non-interactively. |

### history
Provides a view of the update history for your website content and structure.

#### Subcommands

**`view`** (Aliases: `log`, `list`)
Displays the update history in a compact, log-style format, similar to `git log`. Each entry includes a unique hash, the date of the update, the operation performed, and the feedback provided.

**Usage:**
```bash
aigne web history view
```

This command does not take any parameters.

### clear
Safely removes generated files, workspace data, or configuration settings. This is useful for starting fresh or cleaning up your project directory.

**Usage:**
```bash
# Clear the temporary workspace and generated pages without being prompted
aigne web clear --targets workspace generatedPages
```

**Parameters:**

| Parameter | Description | Type | Required |
| :--- | :--- | :--- | :--- |
| `targets` | An array of items to clear without prompting. Possible values: `workspace`, `generatedPages`, `websiteConfig`, `deploymentConfig`, `authTokens`, `mediaDescription`. | Array | No |
| `pagesDir` | Overrides the default directory path for your source pages. | String | No |
| `tmpDir` | Overrides the default directory path for the temporary workspace. | String | No |
| `outputDir` | Overrides the default directory path for the generated pages. | String | No |
| `configPath` | Overrides the default path for the configuration file. | String | No |

## Summary

This reference guide covers the primary commands and their parameters for the AIGNE WebSmith CLI. For more detailed, task-oriented instructions, please refer to the guides in the [Core Tasks](./core-tasks.md) section.