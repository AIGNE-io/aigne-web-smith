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
blogLabel: "japan"
blogMoreButtonText: "See More"
```

**Field descriptions:**

- `blogTitle`: The section title (≤ 60 characters)
- `blogDescription`: A short summary of what’s displayed
- `blogUrl`: The source URL, usually your Discuss Kit Blocklet
- `blogLabel`: Optional filter tag (topic, region, etc.)
- `blogMoreButtonText`: Optional “See more” button text

> **Note:** The Discuss Kit API must be accessible (public or within your Blocklet).  
> WebSmith will automatically extract titles, summaries, cover images, and dates from the provided `blogUrl`.

---

## 3. Define the Section in Generation Rules

In your site’s custom generation rules in `config.yaml`, specify where and how this section should be rendered:

```yaml
Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum. Connect each featured post to a specific ArcBlock capability or outcome.
```

**Explanation:**

- Places this section as **Section 2** of the page
- Uses the **Blog List** component type
- Loads its data from `src/blog-list-data.yaml`
- Indicates the section serves as “Proof & Momentum” by linking each post to a tangible capability or achievement

---

## 4. Generate or Update the Site

Run one of the following commands after setting up your data and rules:

```bash
aigne run generate
```

Or update an existing site:

```bash
aigne run update
```

WebSmith will:

1. Load your YAML data
2. Retrieve posts from Discuss Kit
3. Render the **Latest Updates** section automatically

---

## 5. Optional Enhancements

- Create localized versions of `blog-list-data.yaml` for multilingual sites
- Use `blogLabel` to categorize updates (e.g., by product, feature, or region)
