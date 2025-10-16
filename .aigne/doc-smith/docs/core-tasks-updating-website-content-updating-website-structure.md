# Updating Website Structure

Modifying the structure of your website—such as adding new pages, removing obsolete ones, or reorganizing the navigation—is a critical task for keeping your content relevant and user-friendly. AIGNE WebSmith facilitates this process through an AI-driven workflow that interprets natural language feedback to perform precise structural changes.

This document explains how to modify your site's structure using the `aigne web generate` command. During this process, an AI agent interprets your feedback in natural language to add, remove, update, or move pages. Understanding the available operations helps you provide clear instructions to achieve your desired site layout.

The primary command for applying structural changes is `aigne web generate`. For more details on the generation process itself, see [Generating a Website](./core-tasks-generating-a-website.md).
## The Structure Update Process

When you run the `aigne web generate` command, the system first analyzes your content sources and proposes a website structure. You are then given an opportunity to review and modify this structure interactively.

## Interactive Update Workflow

The process for updating your website's structure is interactive. Here is a summary of the workflow:

1.  **Initiate Generation**: Run the generate command in your terminal.
    ```bash
    aigne web generate
    ```

2.  **Review Proposed Structure**: After analyzing your sources, the CLI will display the proposed structure and ask for your input.

3.  **Provide Natural Language Feedback**: At the prompt, type your desired changes in natural language. For example:
    > "Add a 'Contact Us' page at the top level with the path `/contact`. Also, remove the page at `/about/old-team`."

4.  **Review and Approve**: The AI processes your feedback, applies the necessary changes, and displays the revised structure. You can then approve the changes to finalize the process or provide more feedback to refine it further.

## Core Structural Operations

The AI agent understands four fundamental operations for modifying the website structure. Providing clear feedback that aligns with these operations will yield the most accurate results.

| Operation | Description | Key Parameters |
| :--- | :--- | :--- |
| **Add** | Creates a new page in the website structure. | `title`, `description`, `path`, `parentId`, `sourceIds` |
| **Delete** | Removes an existing page from the structure. | `path` |
| **Update** | Modifies the metadata of an existing page. | `path`, `title` (optional), `description` (optional), `sourceIds` (optional) |
| **Move** | Relocates a page to a different parent, changing its path. | `path`, `newParentId`, `newPath` |

### Examples of Feedback

Here are some examples of how you can phrase your feedback to perform specific structural changes:

- **Adding a page:**
 > "Add a new page titled 'Our Team' under the '/about' section. The path should be `/about/team`."

- **Deleting a page:**
 > "Please remove the 'Legacy Products' page located at `/products/legacy`."

- **Updating a page:**
 > "Update the title for the page at `/services` to 'Our Professional Services'."

- **Moving a page:**
 > "Move the 'Careers' page, currently at `/careers`, so it becomes a child of the '/about' page. Its new path should be `/about/careers`."

## Summary

This interactive process ensures your website's structure is always organized, up-to-date, and aligned with your goals. The system handles the technical details, allowing you to focus on the logical arrangement of your content.

For more hands-on guidance, please refer to the following sections:
- [Generating a Website](./core-tasks-generating-a-website.md)
- [Using the Interactive Chat](./core-tasks-using-the-interactive-chat.md)
