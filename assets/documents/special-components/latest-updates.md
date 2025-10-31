# 🧩 How to Use the **Latest Updates** Section

## 1. Overview

The **Latest Updates** section displays your team’s most recent news and progress, powered by **Discuss Kit** — ArcBlock’s built-in community and blog system.  
It automatically pulls blog posts or announcements from your Discuss Kit instance to keep your site dynamic and trustworthy.

**Use cases:**

- Showcase new features, updates, or technical articles
- Provide “Proof & Momentum” — visible, ongoing progress
- Reinforce brand transparency and engagement

---

## 2. Prepare the Data

You need a data descriptor that tells WebSmith where to fetch the blog content.

**Recommended path:**

```
src/blog-list-data.yaml
```

**Example content:**

```yaml
# src/blog-list-data.yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # or your Discuss Kit Blocklet URL
blogLabel: "did-domain"
blogMoreButtonText: "See More"
```

**Field descriptions:**

- `blogTitle`: The section title (≤ 60 characters)
- `blogDescription`: A short summary of what’s displayed
- `blogUrl`: The source URL, usually your Discuss Kit Blocklet
- `blogLabel`: Optional filter tag (topic, region, etc.)
- `blogMoreButtonText`: Optional “See more” button text

> **Note:**  
> 1. The Discuss Kit API must be accessible (public or within your Blocklet).  
> 2. WebSmith will automatically extract titles, summaries, cover images, and dates from the provided `blogUrl`.
> 3. The `blogLabel` value should be obtained from your Discuss Kit site.  
>    For example, visit:  
>    [https://www.arcblock.io/content/blog?labels=did-domain](https://www.arcblock.io/content/blog?labels=did-domain)  
>    to find the label ID used for filtering.

---

## 3. Register the Data Source (Important)

After creating `src/blog-list-data.yaml`, you **must** register it so WebSmith can find and use it （keep list defined）.

### a. Add to `config.yaml`

Regardless of whether your site has already been generated, add the file to the `sourcesPath` field:

```yaml
sourcesPath:
  - src/blog-list-data.yaml
```

### b. If Your Site Has Already Been Generated

If you have already run `aigne web generate`, before updating, add the same file to:

```
.aigne/web-smith/pages/workspace/website-structure.yaml
```

Under the `sourceIds` section, include:

```yaml
sourceIds:
  - src/blog-list-data.yaml
```

This ensures WebSmith can locate and use your new data source during `update` operations.

---

## 4. Define the Section in Generation Rules

Specify where and how the section should be rendered in your site’s `config.yaml` rules field:

```yaml
# config.yaml
rules: 
  Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum. Connect each featured post to a specific ArcBlock capability or outcome.
```

### Additional Notes

- You can add this rule directly under the **rules** field in `config.yaml`.  
  It will automatically take effect during the next **generate** run.
- Alternatively, when running the **update** command, you can directly enter a prompt such as:  
  ```
  Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
  ```

This approach supports dynamic updates without manually editing YAML files.

---

## 5. Generate or Update the Site

After configuring your data and rules, run one of the following commands:

```bash
aigne run generate
```

Or, to update an existing site:

```bash
aigne run update
```

WebSmith will:

1. Load your YAML data  
2. Retrieve posts from Discuss Kit  
3. Render the **Latest Updates** section automatically  

---

## 6. Optional Enhancements

- Create localized versions of `blog-list-data.yaml` for multilingual websites  
- Use `blogLabel` to group updates by product, feature, or region  
- Combine multiple labeled sections for a richer content experience  
