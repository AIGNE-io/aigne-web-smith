# Updating Page Content

This guide provides a systematic process for refining the content and details of an individual webpage. This task focuses on modifying the content *within* a specific, existing page, such as altering text, adding or removing content blocks, and changing the order of sections.

This process is distinct from modifying the overall site map. For instructions on adding, removing, or reorganizing pages, refer to the [Updating Website Structure](./core-tasks-updating-website-content-updating-website-structure.md) guide.

## The Update Process

Content updates are initiated using the `update` command. The process is interactive, allowing you to provide feedback in natural language to an AI agent, which then intelligently modifies the page structure.

```bash Command icon=lucide:terminal
aigne update
```

The command can also be invoked with its alias, `up`.

The standard workflow is as follows:

1.  **Execute the Command**: Run `aigne update` in your terminal.
2.  **Select Page**: The system will present a list of existing pages. Select the single page you wish to modify.
3.  **Provide Feedback**: You will be prompted to enter your feedback. This is a natural language instruction describing the changes you want to make. For example, "Change the title of the hero section" or "Add a new section with a list of our services."
4.  **AI Processing**: An AI agent analyzes your request and uses a set of predefined tools to apply the changes to the page's content structure.
5.  **Review and Save**: The updated page content is saved, and the process is complete. You can run the `generate` command again to see your changes reflected in the live website preview.

## Command Parameters

For non-interactive or scripted use, you can provide feedback and other parameters directly as command-line arguments.

<x-field-group>
  <x-field data-name="--pages" data-type="array">
    <x-field-desc markdown>Specify one or more page paths to update. If not provided, you will be prompted to select a page interactively.</x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string">
    <x-field-desc markdown>Provide the feedback for content improvement directly. This is useful for scripting updates.</x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string">
    <x-field-desc markdown>A glossary of terms to ensure consistent terminology during content generation. You can provide a path to a file using the `@<file>` syntax.</x-field-desc>
  </x-field>
</x-field-group>

## Content Modification Capabilities

The AI agent modifies page content by using a specific set of tools. To achieve predictable and accurate results, your feedback should align with these capabilities. The agent can perform the following actions based on your instructions:

| Action | Description | Example Feedback |
| :--- | :--- | :--- |
| **Add Section** | Adds a new content section to the page. You can specify the content and its desired position. | "Add a new section named 'Our Partners' after the 'About Us' section, and include their logos." |
| **Delete Section** | Removes an existing section by its name. | "Please remove the 'Upcoming Events' section." |
| **Update Section** | Modifies the content or properties of an existing section. | "In the 'Hero' section, update the main heading to 'Innovate and Inspire'." |
| **Move Section** | Changes the order of sections on the page. | "Move the 'FAQ' section so it appears just before the final 'Contact Us' section." |
| **Update Metadata** | Updates the page's primary metadata: its `title` and `description`. | "Change the page title to 'Our Comprehensive Services' and update the description." |

## Example Feedback Prompts

The effectiveness of the update process depends on the clarity of your feedback. Below are examples of well-formed requests for different modification tasks.

```text Example Prompts icon=lucide:clipboard-list
# Example for adding a new section
"Add a new section after the introduction. It should be a three-column feature list. The features are 'Fast Performance', 'Secure by Design', and '24/7 Support'."

# Example for deleting a section
"The section named 'Testimonials' is outdated. Please remove it."

# Example for updating a section's content
"In the 'Contact' section, change the email address from 'contact@example.com' to 'support@example.com'."

# Example for moving a section
"I want the 'Our Team' section to be displayed immediately after the 'About Us' section."
```

## Summary

Updating page content is an iterative process driven by clear, actionable feedback. By understanding the available modification tools—adding, deleting, updating, and moving sections—you can efficiently guide the AI to refine your website's content with precision.

For related tasks, see the following guides:
- [Updating Website Structure](./core-tasks-updating-website-content-updating-website-structure.md)
- [Generating a Website](./core-tasks-generating-a-website.md)