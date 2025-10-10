# Updating Website Structure

The structure of a website, often referred to as its information architecture, is the arrangement and organization of its pages. A logical structure is essential for user navigation and understanding. AIGNE WebSmith provides a straightforward process for modifying your website's structure by adding, removing, updating, or reorganizing pages.

These structural modifications are not performed with individual commands. Instead, you provide clear, natural language feedback to the `update` command. The AI interprets your instructions and applies the necessary changes to the website plan. This document outlines the specific operations available for structuring your site.

For details on modifying the content within a page, please refer to the [Updating Page Content](./core-tasks-updating-website-content-updating-page-content.md) guide.

## The Update Process

Modifying your website's structure involves an interactive session where you describe the desired changes. The system uses a set of specialized tools to execute these changes based on your input.

The general workflow is as follows:
1.  Run the `aigne update` command in your terminal.
2.  The system will prompt you for feedback.
3.  Clearly describe the structural changes you wish to make (e.g., "Add a new 'Blog' page," "Move the 'Careers' page under 'About Us'").
4.  The AI will analyze your request, perform the necessary operations, and present the updated structure for your review and confirmation.

## Core Structural Operations

The AI can perform four fundamental operations to alter your website's structure. Understanding these operations will help you provide more effective feedback.

### Adding a Page

This operation creates a new page within your website's structure. To add a page, you need to provide its essential properties.

**Example Feedback:** `"Add a new page titled 'Our Services' with the path '/services'. It should be a top-level page."`

The following parameters are used when creating a new page:

<x-field-group>
  <x-field data-name="title" data-type="string" data-required="true">
    <x-field-desc markdown>The title of the new page, which will appear in navigation and headings.</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="true">
    <x-field-desc markdown>A brief description of the page's purpose and content.</x-field-desc>
  </x-field>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>The unique URL path for the page. It must begin with a `/` (e.g., `/about-us`).</x-field-desc>
  </x-field>
  <x-field data-name="parentId" data-type="string" data-required="false">
    <x-field-desc markdown>The path of the parent page. If the new page is a sub-page, provide the parent's path here. For a top-level page, this should be `null`.</x-field-desc>
  </x-field>
</x-field-group>

### Updating a Page

This operation modifies the metadata of an existing page, such as its title or description. You must specify the path of the page you wish to change.

**Example Feedback:** `"Update the page at '/about' to have the title 'About Our Company'."`

The following parameters are used when updating an existing page:

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>The URL path of the page to be updated. This is used to identify the correct page.</x-field-desc>
  </x-field>
  <x-field data-name="title" data-type="string" data-required="false">
    <x-field-desc markdown>The new title for the page.</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="false">
    <x-field-desc markdown>The new description for the page.</x-field-desc>
  </x-field>
</x-field-group>

### Moving a Page

This operation changes a page's position within the website hierarchy. You can move a page to a different parent or change its URL path. This is useful for reorganizing content.

**Example Feedback:** `"Move the page '/team' so it is a child of '/about'. Its new path should be '/about/team'."`

The following parameters are used when moving a page:

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>The current URL path of the page you want to move.</x-field-desc>
  </x-field>
  <x-field data-name="newParentId" data-type="string" data-required="false">
    <x-field-desc markdown>The path of the new parent page. To make it a top-level page, omit this or set it to `null`.</x-field-desc>
  </x-field>
  <x-field data-name="newPath" data-type="string" data-required="true">
    <x-field-desc markdown>The new URL path for the page. It is standard practice to update the path to reflect the new hierarchy (e.g., moving a page under `/about` should result in a path like `/about/newpage`).</x-field-desc>
  </x-field>
</x-field-group>

### Deleting a Page

This operation permanently removes a page from the website structure.

**Important:** A page that has child pages (sub-pages) cannot be deleted directly. You must first move or delete its children.

**Example Feedback:** `"Please remove the page at path '/archive/old-news'."`

The following parameters are used when deleting a page:

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>The URL path of the page you wish to delete.</x-field-desc>
  </x-field>
</x-field-group>

## Summary

By providing clear and specific instructions to the `update` command, you can efficiently manage your website's structure. The AI handles the technical execution, allowing you to focus on the logical organization of your content.

After structuring your pages, the next step is to refine the information within them. For more information, proceed to the [Updating Page Content](./core-tasks-updating-website-content-updating-page-content.md) guide.