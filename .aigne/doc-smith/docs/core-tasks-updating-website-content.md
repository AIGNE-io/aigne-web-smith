# Updating Website Content

After generating the initial version of your website, you will likely need to make adjustments or refine the generated content. The `update` command is the primary tool for this iterative process. It allows you to provide feedback in plain English to modify your website's structure and the content of individual pages.

This command streamlines the editing process by leveraging AI to understand your requests and apply them directly to the website files. Whether you need to add a new page, reorganize sections, or simply rephrase a headline, the `update` command provides an interactive way to make these changes without manually editing configuration files.

This section provides an overview of the update process. For detailed, step-by-step instructions, please refer to the specific guides for each type of update:

<x-cards data-columns="2">
  <x-card data-title="Updating Website Structure" data-icon="lucide:layout-list" data-href="/core-tasks/updating-website-content/updating-website-structure">
    Learn how to add, remove, rename, or reorganize the pages of your website.
  </x-card>
  <x-card data-title="Updating Page Content" data-icon="lucide:file-text" data-href="/core-tasks/updating-website-content/updating-page-content">
    Find out how to modify the text, sections, and other elements within a specific page.
  </x-card>
</x-cards>

## The Update Workflow

The update process is designed to be interactive and intuitive. Here is a summary of the typical workflow:

1.  **Initiate the Command**: Run the `aigne web update` command from your terminal in your project directory.
2.  **Select a Page**: The tool will display a list of your existing website pages. You will be prompted to select the specific page you wish to modify.
3.  **Provide Feedback**: After selecting a page, you will be asked to provide your feedback. This is where you describe the changes you want to make in natural language. For example, you could say, "Change the title of the first section to 'Our Core Values'" or "Add a new FAQ section at the end of the page."
4.  **AI Processing**: The AI agents will analyze your feedback and determine the necessary modifications to the page's structure or content.
5.  **Review and Save**: The changes are applied, and the updated page content is saved.

## Basic Command Usage

To begin the update process, navigate to your project's root directory and run the following command:

```bash CLI Command icon=lucide:terminal
aigne web update
```

This command starts an interactive session that will guide you through selecting a page and providing feedback.

### Parameters

While the command is primarily interactive, you can use parameters to streamline the process.

<x-field-group>
  <x-field data-name="feedback" data-type="string" data-required="false">
    <x-field-desc markdown>Provide feedback directly as a command-line argument to bypass the interactive prompt for feedback. For example: `aigne web update --feedback "Change the main title"`.</x-field-desc>
  </x-field>
  <x-field data-name="pages" data-type="array" data-required="false">
    <x-field-desc markdown>Specify one or more page paths to update. This is useful for applying the same feedback to multiple pages or targeting a specific page non-interactively.</x-field-desc>
  </x-field>
</x-field-group>

## Summary

The `update` command is a flexible tool for refining and improving your website after its initial creation. By using natural language feedback, you can efficiently modify both the overall site structure and the detailed content of each page.

For more detailed instructions and examples, please proceed to the relevant sub-sections:

*   **Next**: Learn how to [Update Website Structure](./core-tasks-updating-website-content-updating-website-structure.md) or [Update Page Content](./core-tasks-updating-website-content-updating-page-content.md).
*   **Related Reading**: After making updates, you may want to review your changes by [Viewing the Update History](./core-tasks-viewing-update-history.md).