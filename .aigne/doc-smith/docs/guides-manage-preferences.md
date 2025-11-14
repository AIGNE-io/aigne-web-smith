# Manage Preferences

Use this guide to configure `aigne web prefs`, including how to list saved rules, toggle them on or off, and remove entries you no longer need.

AIGNE WebSmith learns from your feedback to refine how it generates and updates your website. These learned instructions are stored as user preferences. The `prefs` command provides a way to view, manage, and clear these saved preferences, giving you full control over the AI's behavior.

Managing your preferences ensures that the AI consistently adheres to your specific style guides, content requirements, and structural conventions over time.

## Listing Preferences

To view all your currently saved preferences, use the `list` command. This command displays a table of all preference rules, including their ID, active status, scope, and the rule itself.

```bash List Preferences icon=lucide:terminal
aigne web prefs list
```

You can also use the alias `ls`:

```bash List Preferences icon=lucide:terminal
aigne web prefs ls
```

### Example Output

The output will be a formatted table, making it easy to review your saved rules.

| ID         | Active | Scope     | Rule                                                               |
| :--------- | :----- | :-------- | :----------------------------------------------------------------- |
| pref_a1b2c3d4 | true   | page      | Write in a formal, professional tone.                              |
| pref_e5f6g7h8 | true   | structure | Do not generate pages or sections for outdated 'Legacy API Reference'. |
| pref_i9j0k1l2 | false  | theme     | Healthcare websites must use warm color tones.                     |

## Toggling a Preference

If you want to temporarily disable a preference without permanently deleting it, you can use the `toggle` command. This command switches the `active` status of a rule. To toggle a specific rule, you must provide its unique ID using the `--id` parameter.

```bash Toggle Preference icon=lucide:terminal
aigne web prefs toggle --id <PREFERENCE_ID>
```

You can also use the alias `t`:

```bash Toggle Preference icon=lucide:terminal
aigne web prefs t --id <PREFERENCE_ID>
```

### Example

To deactivate the theme preference from the example above:

```bash Prefs Toggle --id Pref_i9j0k1l2 icon=lucide:terminal
aigne web prefs toggle --id pref_i9j0k1l2
```

Running `aigne web prefs list` again would show `pref_i9j0k1l2` as `false`. Running the toggle command on the same ID again would reactivate it.

## Removing a Preference

To permanently delete a preference that is no longer needed, use the `remove` command. This action is irreversible. You must specify the rule to delete by providing its ID via the `--id` parameter.

```bash Remove Preference icon=lucide:terminal
aigne web prefs remove --id <PREFERENCE_ID>
```

You can also use the alias `rm`:

```bash Remove Preference icon=lucide:terminal
aigne web prefs rm --id <PREFERENCE_ID>
```

### Example

To permanently remove the page preference from the example above:

```bash Prefs Remove --id Pref_a1b2c3d4 icon=lucide:terminal
aigne web prefs remove --id pref_a1b2c3d4
```

The specified preference will be removed from your `preferences.yml` file.

## Understanding Preference Scopes

Preferences are applied based on their assigned `scope`, which determines the context in which a rule is triggered.

| Scope         | Description                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------ |
| **global**    | Applies to all stages of generation and content refinement. Use for universal style or content rules.   |
| **structure** | Applies only when planning or updating the website's structure (e.g., adding, removing pages).          |
| **page**      | Applies when generating or refining the content of individual pages.                                    |
| **translation** | Applies only during the content translation process.                                                    |
| **theme**     | Applies when generating or modifying the website's visual theme, such as colors and fonts.              |

## Summary

The `prefs` command is an essential tool for customizing and controlling the long-term behavior of AIGNE WebSmith. By listing, toggling, and removing preferences, you can maintain a clean and effective set of rules that ensures the AI consistently produces results aligned with your project's specific needs.
