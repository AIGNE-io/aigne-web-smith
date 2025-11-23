Expanding your website is straightforward with AIGNE WebSmith. This guide explains how to use the `aigne web add-page` command to seamlessly integrate new pages into your site's structure, automatically updating content and internal links.

# Add Page

The `aigne web add-page` command provides an interactive way to expand your website. It allows you to describe new pages in natural language, and WebSmith handles the process of creating the page, generating its content, and intelligently updating existing pages with relevant links to the new content.

## Command Usage

To start adding pages, navigate to your project's root directory and run the following command:

```sh aigne web add-page icon=lucide:terminal
aigne web add-page
```

Alternatively, you can use the shorter alias `add`:

```sh aigne web add icon=lucide:terminal
aigne web add
```

## Process

When you run the `add-page` command, WebSmith initiates a comprehensive, automated workflow. The process is broken down into the following steps:

### 1. Add New Pages

The command first prints the current sitemap, giving you a clear overview of your existing pages. You are then prompted to describe the page you wish to add, specifying its title and location (e.g., "add a pricing page under the main services page"). You can add multiple pages in a single session. After each addition, the tool displays the updated structure and prompts for the next one. To finish adding pages, simply press Enter at an empty prompt. WebSmith then generates the content for each new page based on your project's source materials. The following is a use case for adding a page:

```text Add 'Team' and 'Careers' pages
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]

You can add a new page.
  • e.g. 'add an FAQ page under the About Us page'

Press Enter to finish: add a 'Team' page under '/about'
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]
    - Team [/about/team]

You can continue adding pages, or press Enter to finish: add a 'Careers' page under '/about'
```

### 2. Review Pages for Link Insertion

After the new pages are created, WebSmith analyzes your existing content to identify relevant places to insert links to your new content. This ensures seamless navigation and helps users discover the new pages. The system will present you with a list of pages where links can be added, allowing you to review and confirm the changes before they are applied. Here is a use case for reviewing pages for link insertion:

```text Reviewing Link Suggestions
? Select pages that need new links added (all selected by default, press Enter to confirm, or unselect all to skip):
  ◉ About Us (/about)
  ◯ My SaaS Platform (/home)

Do you want to proceed with these changes? (Y/n)
```

### 3. Output Summary

Once the structure is finalized and links are inserted, a summary report is displayed. This report lists the new pages created and any existing pages that were updated with new links. If your site uses multiple languages, the new pages and updated links are automatically included in the translation workflow. The following is a use case for the output summary:

```text Final Summary
---
📊 Summary

✨ Newly Generated Pages:
   Total: 2 page(s)

   1. /about/team
      Title: Our Team
      Description: Meet the dedicated team behind our project, driving innovation...

🔗 Pages Updated with New Links:
   Total: 1 page(s)

   1. /about
      Added links to: /about/team 

```

## Next Steps

<x-cards data-columns="2">
  <x-card data-title="Update Page" data-icon="lucide:file-text" data-href="/guides/update-website/update-page">
    Learn how to refine the text and details on individual pages using natural language commands.
  </x-card>
  <x-card data-title="Remove Page" data-icon="lucide:file-minus" data-href="/guides/update-website/remove-page">
    Learn how to remove an existing page from your website structure.
  </x-card>
</x-cards>
