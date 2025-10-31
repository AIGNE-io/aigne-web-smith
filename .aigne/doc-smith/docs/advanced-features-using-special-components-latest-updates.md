# Latest Updates

The 'Latest Updates' component provides a dynamic way to showcase recent news, blog posts, or announcements on your website. It integrates with Discuss Kit, a blog system, to automatically fetch and display content, keeping your site fresh and demonstrating ongoing activity.

This component is particularly useful for:
- Showcasing new features, updates, or technical articles.
- Providing "Proof & Momentum"—visible, ongoing progress.
- Reinforcing brand transparency and engagement.

## How to Use

To implement the 'Latest Updates' section, you must prepare a data source file and then reference it in your website's generation rules. The process is straightforward and ensures that the AI can correctly locate and render the content.

### Step 1: Prepare the Data File

First, create a YAML file that acts as a data descriptor, telling WebSmith where to fetch the blog content from.

A recommended location for this file is `src/blog-list-data.yaml`.

#### Example Data File

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # Or your Discuss Kit Blocklet URL
blogLabel: "did-domain"
blogMoreButtonText: "See More"
```

#### Field Descriptions

| Field                | Description                                                                                                                                                                                            | Required |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle`          | The main title displayed for the section. It is recommended to keep this under 60 characters for clarity.                                                                                                |   Yes    |
| `blogDescription`    | A brief summary that appears under the title, explaining the content of the section.                                                                                                                   |   Yes    |
| `blogUrl`            | The source URL, usually your Discuss Kit Blocklet. WebSmith automatically extracts titles, summaries, cover images, and dates. The Discuss Kit API must be publicly accessible.                          |   Yes    |
| `blogLabel`          | An optional filter tag to display content from a specific category. The value should be obtained from your Discuss Kit site (e.g., the `labels` query parameter in the URL).                               |    No    |
| `blogMoreButtonText` | The text for an optional "See More" button that can link to your main blog or news page.                                                                                                                  |    No    |

### Step 2: Register the Data Source

After creating the data file, you must register it so WebSmith can find and use it.

Add the file path to the `sourcesPath` field in your `config.yaml`:

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

If you are updating an existing site, you must also add the file path to `.aigne/web-smith/pages/workspace/website-structure.yaml` under the `sourceIds` section. This ensures WebSmith can locate the new data source during `update` operations.

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### Step 3: Define the Section in Generation Rules

Next, instruct the AI on how to use the data source by adding a rule to your WebSmith `config.yaml` file. The rule should specify the section's position, component type, and data source.

#### Example Rule

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

This example rule accomplishes the following:
*   **Positioning**: Places the 'Latest Updates' component as the second section on the page.
*   **Component Type**: Identifies the section as a "Latest Updates" or "Blog List" type.
*   **Data Source**: Points to `src/blog-list-data.yaml` as the source of configuration.

Alternatively, when using the `update` command, you can provide a direct prompt instead of editing the `config.yaml` file:

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### Step 4: Generate or Update Your Website

With the data file and generation rule in place, run the appropriate command to have AIGNE WebSmith build or refresh your site. If generating for the first time, use `aigne web generate`. To add a section to an existing site, use `aigne web update` and select the document to add the section.

WebSmith will now automatically load your YAML data, retrieve the latest posts from the specified Discuss Kit URL, and render the 'Latest Updates' section on your website.

## Summary

The 'Latest Updates' component is a powerful tool for keeping your website content current and engaging. By following the simple steps of creating a data file and defining a generation rule, you can automate the process of displaying news and blog posts directly on your site.

For more information on other special components, please refer to the documentation on [Using Special Components](./advanced-features-using-special-components.md).
