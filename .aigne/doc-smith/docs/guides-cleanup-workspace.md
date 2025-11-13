# Cleanup Workspace

Use this guide to run `aigne web clear` safely, whether you want to wipe generated pages, reset cached data, or remove authorization tokens before handing off a project.

The `clear` command is a utility for managing your project's workspace (typically the `./.websmith/tmp` directory). It allows you to selectively remove generated files, cached data, and configuration settings. This is particularly useful when you want to start a fresh build, reset your configuration, or remove sensitive authorization data.

Executing the command can be a destructive action. Please ensure you have backed up any important data before proceeding.

## Interactive Clearing

The simplest way to use the command is to run it without any arguments. This will launch an interactive prompt where you can select the specific items you wish to clear.

```bash Cleanup Workspace icon=lucide:terminal
aigne web clear
```

This will present a list of available items to remove. You can navigate with the arrow keys, select items with the spacebar, and confirm your selection by pressing Enter.

## Clearable Targets

The following table details the specific items that can be cleared, what they contain, and the command to clear them directly.

| Target Name | Command Flag | Description |
| :--- | :--- | :--- |
| Website Structure | `websiteStructure` | Removes the website structure file (`website-structure.yaml`) from the workspace. Your original source content is not affected. |
| Generated Pages | `generatedPages` | Deletes all generated page content from the workspace. This leaves the website structure file intact. |
| Website Configuration | `websiteConfig` | Deletes the main `config.yaml` file. **Caution:** This action is irreversible. You will need to run `aigne web init` to generate a new configuration file. |
| Authorizations | `authTokens` | Deletes the `.env.websmith` file, which stores authentication tokens. After clearing, you will need to re-authorize for operations like publishing. |
| Deployment Config | `deploymentConfig` | Removes only the `appUrl` key from your `config.yaml` file. This is useful for resetting your deployment target without deleting the entire website configuration. |
| Media File Descriptions | `mediaDescription` | Deletes the cached, AI-generated descriptions for your media assets. These will be automatically regenerated on the next run of the `generate` command. |
| Translation Caches | `translationCaches` | Deletes the AI-generated translation caches. These will be regenerated automatically on the next publish. |

## Non-Interactive Clearing

To bypass the interactive prompt, you can use the `--targets` flag followed by one or more target names. This is useful for scripting or automating cleanup tasks.

### Clearing a Single Target
To clear a single item, specify its name with the `--targets` flag.

```bash Clear Website Structure icon=lucide:terminal
aigne web clear --targets websiteStructure
```

### Clearing Multiple Targets

You can provide a space-separated list of targets to clear multiple items at once. The following example clears both the website structure and the generated pages.

```bash Clear --targets Websitestructure Generatedpages icon=lucide:terminal
aigne web clear --targets websiteStructure generatedPages
```

## Summary

The `clear` command provides a safe and controlled way to manage your project's generated assets and configuration. Use the interactive mode for guided cleanup or the `--targets` flag for direct, automated control. Always exercise caution, especially when clearing the `websiteConfig`, to avoid unintended data loss.

After clearing your workspace or generated pages, you may want to proceed with generating the website again. For more details, see [Generate Website](./guides-generate-website.md).
