# Remove Page

Need to clean up your website's structure? This guide explains how to use the `aigne web remove-page` command to safely delete pages, automatically find any broken links this creates, and regenerate the affected content to maintain site integrity.

## Overview

The `remove-page` command provides an interactive way to remove one or more pages from your website. A key feature of this command is its ability to detect and repair broken internal links that result from page deletion. After you remove pages, WebSmith automatically scans the remaining content for any links that pointed to the deleted pages. It then prompts you to regenerate the affected pages, ensuring your site's navigation remains consistent and error-free.

This process helps maintain a clean and professional website by preventing users from encountering dead links.

## The Process

To start the process, run the following command in your terminal:

```sh aigne web remove-page icon=lucide:terminal
aigne web remove-page
```

You can also use the aliases `remove` or `rm`:

```sh aigne web rm icon=lucide:terminal
aigne web rm
```

### Step 1: Select Pages to Remove

The command will display a list of all pages in your current website structure. You can navigate this list using the arrow keys and select the pages you wish to remove by pressing the spacebar.

```text Select pages to remove
? Select pages to remove (Press Enter with no selection to finish):
❯ ◯ Smart Video Streaming Credit Service [/home]
  ◉ About the Project [/about]
  ◯ Frequently Asked Questions [/about/faq]
```

Once you have selected all the pages you want to delete, press `Enter` to confirm. If you decide not to remove any pages, you can press `Enter` without making a selection to exit the process.
The tool will then ask for confirmation before proceeding with the deletion.

### Step 2: Automatic Link Correction (Optional)

After removing the selected pages, WebSmith scans your remaining pages for any internal links that now point to non-existent content.

If broken links are found, you will be presented with a list of the affected pages. By default, all of these pages are selected to be fixed. You can review the list and press `Enter` to allow WebSmith to regenerate these pages, automatically removing the invalid links. If you prefer to handle the broken links manually, you can unselect all pages to skip this step.

```text Select pages to fix
? Select Pages with Invalid Links to Fix (all selected by default, press Enter to confirm, or unselect all to skip):
❯ ◉ Home (home.md)
    Invalid Links(1): /about
```

### Step 3: Review the Summary

Once the process is complete, a summary will be displayed in the terminal. This summary provides:

*   A list of all pages that were successfully removed.
*   A list of all pages that were regenerated to fix broken links.

```text Summary of remove page operation
---
📊 Summary

🗑️  Removed Pages:
   Total: 1 page(s)

   1. /about

✅ Pages fixed (Removed invalid links):
   Total: 1 page(s)

   1. /home
      Title: Home
      Invalid links fixed: /about
```
This ensures you have a clear record of all changes made to your website structure and content.

## Summary

The `aigne web remove-page` command is a reliable tool for maintaining your website's structure. It not only simplifies the process of deleting pages but also includes an intelligent link-checking feature to preserve the integrity of your site's navigation.

For related tasks, see the following guides:

<x-cards data-columns="2">
  <x-card data-title="Add Page" data-href="/guides/update-website/add-page" data-icon="lucide:file-plus">Learn how to add new pages to your website structure.</x-card>
  <x-card data-title="Update Page" data-href="/guides/update-website/update-page" data-icon="lucide:file-pen-line">Refine the content and details within an individual webpage.</x-card>
</x-cards>

