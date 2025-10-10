# Managing Preferences

When you provide feedback to WebSmith, for example, during the `update` process, it learns from your instructions. To make future generations smarter and more aligned with your style, WebSmith can save this feedback as a "preference." These preferences are reusable rules that are automatically applied in the future.

The `prefs` command is your tool for managing these saved instructions. You can view all your saved preferences, temporarily disable them, or permanently remove them. This ensures you have full control over how WebSmith customizes its behavior for you.

## Understanding a Preference

Each preference rule has several parts that define what it does and when it applies. When you list your preferences, you'll see them displayed in a structured format.

Here’s a breakdown of what each part means:

| Component | Description |
| :--- | :--- |
| **Status** | Indicates if the rule is active. 🟢 means it's active and will be used. ⚪ means it's inactive and will be ignored. |
| **Scope** | Determines when the rule should be applied. There are four scopes: `global`, `structure`, `page`, and `translation`. For example, a `page` scope rule is only used when refining page content. |
| **ID** | A unique identifier for the preference (e.g., `pref_a1b2c3d4`). You use this ID to toggle or remove a specific rule. |
| **Paths** | If a rule is limited to specific files, the relevant paths will be listed here. If it's a general rule, this will be blank. |
| **Rule** | The actual instruction that WebSmith will follow. This is a concise summary of the feedback you provided. |

## Listing All Preferences

To see all the preferences WebSmith has saved for you, use the `--list` flag. This command provides a complete overview of every rule, including its status, scope, ID, and the instruction itself.

```bash Command icon=lucide:terminal
websmith prefs --list
```

**Example Output:**

```text Example Output
# User Preferences

**Format explanation:**
- 🟢 = Active preference, ⚪ = Inactive preference
- [scope] = Preference scope (global, structure, page, translation)
- ID = Unique preference identifier
- Paths = Specific file paths (if applicable)

🟢 [page] pref_1a2b3c4d
   Code comments must be written in English.

⚪ [structure] pref_5e6f7g8h | Paths: /overview, /tutorials
   Add a 'Next Steps' section at the end of overview and tutorial pages.
```

## Toggling a Preference's Status

If you want to temporarily disable a preference without deleting it permanently, you can use the `--toggle` flag. Toggling a preference switches its status between active (🟢) and inactive (⚪).

You can specify which preferences to toggle by providing their IDs with the `--id` option.

```bash Command icon=lucide:terminal
websmith prefs --toggle --id pref_1a2b3c4d
```

If you run the command without any IDs, WebSmith will enter an interactive mode, allowing you to select the preferences you wish to toggle from a list.

```bash Command icon=lucide:terminal
websmith prefs --toggle
```

This will display a checklist of your current preferences for you to select.

## Removing Preferences

When you no longer need a preference, you can permanently delete it using the `--remove` flag.

To remove one or more specific preferences, provide their IDs using the `--id` option.

```bash Command icon=lucide:terminal
websmith prefs --remove --id pref_1a2b3c4d pref_5e6f7g8h
```

Similar to toggling, if you run the `remove` command without specifying any IDs, WebSmith will launch an interactive checklist where you can select the preferences you want to delete.

```bash Command icon=lucide:terminal
websmith prefs --remove
```

---

By managing your preferences, you can refine and guide the AI's behavior over time, ensuring the generated content consistently meets your standards. For more information on how preferences are created, see the [Updating Website Content](./core-tasks-updating-website-content.md) section.