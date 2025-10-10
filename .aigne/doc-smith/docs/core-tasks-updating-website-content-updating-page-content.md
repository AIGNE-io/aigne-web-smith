# Updating Page Content

This document provides instructions for modifying the content of an individual webpage. The primary method for this task is the `aigne update` command, which allows you to refine page details by providing simple, text-based feedback.

This process is distinct from modifying the overall website map. For instructions on adding, removing, or reorganizing pages, please refer to the [Updating Website Structure](./core-tasks-updating-website-content-updating-website-structure.md) guide.

## The Update Process

The `update` command initiates an interactive process where the AI applies changes to a page based on your specific instructions. The system is designed to interpret natural language feedback to perform targeted modifications.

The operational flow is as follows:

1.  **Initiate Command**: Run `aigne update` in your terminal.
2.  **Select Page**: The system will display a list of all existing pages. Select the single page you wish to modify.
3.  **Provide Feedback**: You will be prompted to enter your feedback. This is a plain-text description of the changes you want to make.
4.  **AI Modification**: The AI analyzes your feedback and uses a set of content modification tools to update the page's content structure.
5.  **Review and Save**: The updated page content is saved, and the process is complete.

### Example Command

To begin the update process, execute the following command in your project's root directory:

```bash Aigne CLI icon=lucide:terminal
aigne update
```

You will then be prompted to provide feedback for your selected page. For example:

```text Feedback Prompt
? Please provide your feedback for improving the page content: (Press Enter to skip) › Change the title of the hero section to "Welcome to AIGNE WebSmith".
```

## Supported Content Modifications

The AI can perform several types of content modifications on a page's sections. A "section" refers to a distinct block of content on the page, such as a hero banner, a feature list, or a contact form.

The following table outlines the supported actions and the kind of feedback that triggers them.

| Action | Description | Example Feedback |
| :--- | :--- | :--- |
| **Update Section** | Modifies the properties of an existing section, such as its title, text, or other attributes. | "In the 'About Us' section, change the heading to 'Our Mission'." |
| **Add Section** | Adds a new section to the page at a specified position. | "Add a new section with a three-column feature list after the introduction." |
| **Delete Section** | Removes an entire section from the page by its name. | "Remove the 'Testimonials' section." |
| **Move Section** | Changes the order of sections on the page. | "Move the 'Contact Us' section to be the last section on the page." |

## Practical Examples

### Example 1: Updating a Section's Title

-   **Goal**: Change the main heading on the "Home" page.
-   **Page to Select**: `/home`
-   **Feedback**: `Change the hero section's title to "Creative Solutions for Modern Business".`

The AI will identify the hero section and update its title property, leaving all other content on the page unchanged.

### Example 2: Adding a New Section

-   **Goal**: Add a frequently asked questions (FAQ) section to the "Services" page.
-   **Page to Select**: `/services`
-   **Feedback**: `Add a new FAQ section after the 'Our Process' section. Include questions about pricing, timelines, and support.`

The AI will generate a new section containing the requested content and insert it into the specified position on the page.

### Example 3: Deleting a Section

-   **Goal**: Remove an outdated "Promotions" section from the "Pricing" page.
-   **Page to Select**: `/pricing`
-   **Feedback**: `Delete the 'Current Promotions' section.`

The AI will locate the section named "Current Promotions" and remove it completely from the page layout.

### Example 4: Reordering Sections

-   **Goal**: Move the "Team" section to appear before the "Careers" section on the "About" page.
-   **Page to Select**: `/about`
-   **Feedback**: `Move the 'Our Team' section to be right before the 'Careers' section.`

The AI will adjust the order of the sections on the page to match your request.

---

This feedback-driven approach allows for precise and intuitive content updates without needing to directly edit configuration files. For more complex structural changes involving multiple pages, see the [Updating Website Structure](./core-tasks-updating-website-content-updating-website-structure.md) guide.