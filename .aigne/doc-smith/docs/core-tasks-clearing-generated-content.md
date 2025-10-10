# Clearing Workspace and Data

The `clear` command provides a safe and convenient way to remove generated content, temporary workspace files, or the entire website configuration. This is particularly useful when you want to start a generation process from a clean slate, free up disk space, or reset your project setup.

You can run the command interactively to select specific items for removal or specify the targets directly for automated cleanup.

## Command Usage

To initiate the clearing process, run the following command in your terminal:

```bash
aigne clear
```

When executed without any specific targets, the command enters an interactive mode. It will scan your project for removable items and present you with a checklist. This is the recommended approach for most use cases as it allows you to review what will be deleted.

```text
? Select items to clear:
❯ ◉ workspace
  ◯ generated pages
  ◯ website configuration
```

## Clearable Targets

The `clear` command can remove several types of data, each with a specific purpose.

| Target Name | Description |
| :--- | :--- |
| `workspace` | Removes temporary files and intermediate data, such as the AI-generated website structure. Clearing this is often useful before regenerating your site to ensure no old data is used. |
| `generatedPages` | Deletes the output directory containing the final generated website pages and assets. |
| `websiteConfig` | Removes the main `config.yaml` file. **Use this with caution**, as you will need to run `aigne web init` to create a new configuration before you can generate the site again. |

## Clearing Specific Targets

For scripting or non-interactive use, you can specify which items to clear by passing their names as arguments to the command. You can provide one or more targets.

The command will bypass the interactive prompt and immediately remove the specified items.

### Example: Clearing Workspace and Pages

To remove the temporary workspace and the previously generated pages without being prompted, use the following command:

```bash title="Terminal"
aigne clear workspace generatedPages
```

The output will confirm which items were cleared and which were already empty.

```text
✅ Cleanup successfully!

- 🧹 Cleared workspace (./.tmp)
- 🧹 Cleared generated pages (./dist)
```

### Example: Clearing Everything

To completely reset your project, you can clear all available targets.

```bash title="Terminal"
aigne clear workspace generatedPages websiteConfig
```

After running this command, you will need to re-initialize your project.

```text
✅ Cleanup successfully!

- 🧹 Cleared workspace (./.tmp)
- 🧹 Cleared generated pages (./dist)
- 🧹 Cleared website configuration (./config.yaml)

👉 Run `aigne web init` to generate a fresh configuration file.
```

## Parameters

The `clear` command accepts several optional parameters to override default paths, allowing for more advanced control over the cleanup process.

<x-field-group>
  <x-field data-name="targets" data-type="array">
    <x-field-desc markdown>An array of strings specifying which items to clear without prompting. Valid options are `workspace`, `generatedPages`, and `websiteConfig`.</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string">
    <x-field-desc markdown>Overrides the default directory for your source pages, which helps locate the `config.yaml` file.</x-field-desc>
  </x-field>
  <x-field data-name="tmpDir" data-type="string">
    <x-field-desc markdown>Overrides the default path for the temporary workspace directory (`.tmp`).</x-field-desc>
  </x-field>
  <x-field data-name="outputDir" data-type="string">
    <x-field-desc markdown>Overrides the default path for the generated pages output directory.</x-field-desc>
  </x-field>
  <x-field data-name="configPath" data-type="string">
    <x-field-desc markdown>Provides a direct path to the website configuration file, overriding any inferred locations.</x-field-desc>
  </x-field>
</x-field-group>