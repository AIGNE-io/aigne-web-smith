# Manage Update History

Use this guide to audit everything WebSmith has changed. The `aigne web history` command records every generate or update action, so you always know what changed, when it happened, and why feedback was applied.

This guide lives inside the broader **Update Website** workflow. Run it whenever you need a paper trail before publishing, reviewing with teammates, or rolling back edits.

## View the history log

Show the entire update log (most recent first) with:

```bash View History Log icon=lucide:history
aigne web history view
```

Aliases `log` and `list` produce the same output:

```bash View History Log (Alias) icon=lucide:history
aigne web history log
```

If no updates exist yet, WebSmith prints `No update history found`.

## Understand each entry

Every line describes one change event and follows the same structure.

| Field | Description |
| :--- | :--- |
| **Short hash** | Deterministic identifier derived from the timestamp. Use it when discussing a specific update with your team. |
| **Date** | Relative timestamp (for example, `5 minutes ago` or `2 days ago`). Entries older than a week show the calendar date. |
| **Operation** | `structure_update` for sitemap changes or `page_update` for individual page edits. |
| **Page path** | Only shown for `page_update` entries and appears in parentheses (such as `(about-us)`). |
| **Feedback** | The summary you provided when running `aigne web update`, captured so future readers understand the intent. |

### Sample output

```text
📜 Update History

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new "Careers" page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

Use the history log before publishing to confirm which edits are about to go live, or after publishing to answer stakeholder questions about when something changed.

## Related workflows

- [Update Structure](./guides-update-website-update-structure.md) – regenerate navigation and site maps.
- [Update Page](./guides-update-website-update-page.md) – refine copy on individual pages.
