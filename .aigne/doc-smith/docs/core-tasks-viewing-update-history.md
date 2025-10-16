# Viewing Update History

AIGNE WebSmith automatically maintains a detailed log of every change you make to your website. Whether you're updating the content on a single page or reorganizing the entire site structure, each action is recorded. This history provides a clear, chronological record, allowing you to track your progress and review past modifications.

The `web history` command is the primary tool for accessing this log. It allows you to view a list of all recorded updates in a format similar to version control systems like Git.

## Viewing the History Log

To see the complete list of updates, use the `web history view` command. This command displays all entries from the newest to the oldest.

```bash Terminal icon=lucide:terminal
aigne web history view
```

### Understanding the Output

The command will produce a list where each line represents a single update. The format is designed to be concise and informative.

**Sample Output:**

```bash
📜 Update History

e5c7a91 5 minutes ago   page (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page (services): Added new section for consulting services
1d9c0b2 1 day ago       structure: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page (contact): Updated the main office phone number
```

Each entry in the log contains several key pieces of information. Here is a breakdown of the components:

| Component | Description |
| :--- | :--- |
| **Hash** | A unique 7-character code (`e5c7a91`) that identifies the specific update. |
| **Date** | A relative timestamp indicating when the update was made (e.g., "5 minutes ago"). |
| **Operation** | The type of change that occurred. This will be either `structure` for site-wide changes or `page` for content edits to a specific page. |
| **Page Path** | If the operation was `page`, the path of the modified page is shown in parentheses (e.g., `(about-us)`). |
| **Feedback** | The descriptive message you provided when you ran the `update` command. This text explains the purpose of the change. |

### Command Aliases

For convenience, the `web history` command accepts several aliases for `view`. The following commands are equivalent and will produce the same output:

-   `aigne web history log`
-   `aigne web history list`

Choose the one that is most memorable for you.

## Summary

The `web history` command is an essential tool for tracking the evolution of your website. By reviewing the log, you can easily recall the details of past changes, understand when they were made, and see the reasons behind them.

For more information on the actions that create these history entries, please refer to the following sections:
-   [Updating Website Content](./core-tasks-updating-website-content.md)
-   [Updating Website Structure](./core-tasks-updating-website-content-updating-website-structure.md)