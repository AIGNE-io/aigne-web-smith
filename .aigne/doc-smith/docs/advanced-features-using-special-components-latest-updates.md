# Latest Updates

The 'Latest Updates' component provides a dynamic way to showcase recent news, blog posts, or announcements on your website. It integrates with Discuss Kit, a blog system, to automatically fetch and display content, keeping your site fresh and demonstrating ongoing activity.

This component is particularly useful for:
- Announcing new features, product updates, or technical articles.
- Providing tangible proof of progress and momentum.
- Enhancing brand transparency and user engagement.

## Configuration Guide

To implement the 'Latest Updates' section, you must prepare a data source file and then reference it in your website's generation rules. The process is straightforward and ensures that the AI can correctly locate and render the content.

### Step 1: Prepare the Data File

First, create a YAML file that specifies the source and presentation of your updates. This file acts as a data descriptor that tells WebSmith where to fetch the blog content from.

A recommended location for this file is `src/blog-list-data.yaml`.

#### Example Data File

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # Your Discuss Kit Blocklet URL
blogLabel: "japan" # Optional filter tag
blogMoreButtonText: "See More"
```

#### Field Descriptions

The following table details the configurable fields in your data file.

| Field                | Description                                                                                                                                                                                            | Required |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle`          | The main title displayed for the section. It is recommended to keep this under 60 characters for clarity.                                                                                                |   Yes    |
| `blogDescription`    | A brief summary that appears under the title, explaining the content of the section.                                                                                                                   |   Yes    |
| `blogUrl`            | The source URL where the content resides. This should be the URL of your Discuss Kit Blocklet. WebSmith automatically extracts post titles, summaries, cover images, and publication dates.               |   Yes    |
| `blogLabel`          | An optional tag used to filter the posts. This allows you to display content from a specific category, such as a product, feature, or region.                                                          |    No    |
| `blogMoreButtonText` | The text for an optional "See More" button that can link to your main blog or news page.                                                                                                                  |    No    |

### Step 2: Define the Section in Generation Rules

After creating the data file, you need to instruct the AI on how to use it. This is done by adding a rule to your WebSmith `config.yaml` file. The rule should specify the section's position, component type, and data source.

#### Example Rule

```yaml config.yaml icon=yaml
Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum. Connect each featured post to a specific ArcBlock capability or outcome.
```

This example rule accomplishes the following:
*   **Positioning:** Places the 'Latest Updates' component as the second section on the page.
*   **Component Type:** Identifies the section as a "Blog List" type.
*   **Data Source:** Points to `src/blog-list-data.yaml` as the source of configuration.

### Step 3: Generate or Update Your Website

With the data file and generation rule in place, run the appropriate command to have AIGNE WebSmith build or refresh your site. If generating for the first time, use `aigne web generate`. To add a section to an existing site, use `aigne web update` and select the document to add the section.

WebSmith will now automatically load your YAML data, retrieve the latest posts from the specified Discuss Kit URL, and render the 'Latest Updates' section on your website.

## Advanced Usage

For more complex websites, you can use the `blogLabel` field to create multiple, distinct update sections on different pages, each filtered to a specific topic.

## Summary

The 'Latest Updates' component is a powerful tool for keeping your website content current and engaging. By following the simple steps of creating a data file and defining a generation rule, you can automate the process of displaying news and blog posts directly on your site.

For more information on other special components, please refer to the documentation on [Using Special Components](./advanced-features-using-special-components.md).