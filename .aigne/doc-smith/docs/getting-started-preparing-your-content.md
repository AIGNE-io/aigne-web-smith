# Preparing Your Content

To get the best results from AIGNE WebSmith, providing the right source material is the most critical step. The quality and relevance of your website depend directly on the information you provide to the AI. This guide outlines exactly what to prepare before you begin.

Before you start generating your website, it's essential to gather all the relevant documents that describe your project, product, or business. The AI uses only the files you provide as its knowledge base. High-quality, comprehensive source material will result in a professional and accurate website, while sparse or irrelevant content will lead to a generic and less effective site.

For a deeper dive into structuring your knowledge for the best outcomes, refer to our [Methodology](./guides.md) guide.

```d2
direction: down

User: {
  shape: c4-person
}

Source-Content: {
  label: "Source Content Directory"
  shape: rectangle
  grid-columns: 2

  Product-Documents: {
    label: "Product Docs\n(.md, .pdf, .docx)"
  }

  Marketing-Plans: {
    label: "Marketing Plans\n(.md, .pdf)"
  }

  Business-Plans: {
    label: "Business Plans\n(.docx, .md)"
  }

  Media-Assets: {
    label: "Media Assets\n(.svg, .png)"
  }
}

Websmith-Config: {
  label: "websmith-config.yaml"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  icon: "https://www.arcblock.io/image-bin/uploads/89a24f04c34eca94f26c9dd30aec44fc.png"
}

Generated-Website: {
  label: "Generated Website"
  shape: rectangle
}

User -> Source-Content: "1. Prepares & organizes content"
User -> Websmith-Config: "2. Defines sourcesPath"
Websmith-Config -> AIGNE-WebSmith: "3. Provides configuration"
Source-Content -> AIGNE-WebSmith: "4. Reads source material"
AIGNE-WebSmith -> Generated-Website: "5. Generates website"

```

## The Role of `sourcesPath`

In your configuration file, the `sourcesPath` parameter tells AIGNE WebSmith where to find your content. You can specify one or more directories, and the AI will recursively read the files within them to understand what your website should be about.

This is the single most important setting for determining the quality of your generated website.

Here is a basic example of how `sourcesPath` is defined in the `websmith-config.yaml` file:

```yaml websmith-config.yaml icon=lucide:file-code
# The directory containing your source material.
sourcesPath:
  - ./docs
  - ./product-briefs
# Other configuration details follow...
pagePurpose: "To create a marketing website for a new SaaS product."
targetAudienceTypes: "Potential customers, developers, and investors."
```

In this example, WebSmith will use all supported files within the `./docs` and `./product-briefs` directories as the context for generating the website.

## What to Include in Your Source Content

To build an effective website, the AI needs a clear understanding of your objectives. Your source content should comprehensively cover the key aspects of your project or business.

### Recommended Content Types

Provide a collection of documents that detail your project. The more thorough your information, the better the AI can create content that aligns with your vision.

| Content Type          | Description                                                                                                                              | Example                                                                       |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Product Documents** | Detailed descriptions of your product or service, its features, benefits, and technical specifications.                                  | `Product-Brief.md`, `Technical-Specifications.pdf`, `Feature-List.docx`       |
| **Marketing Plans**   | Information about your target audience, brand voice, key messaging, and competitive analysis.                                            | `Marketing-Strategy.md`, `Brand-Guidelines.pdf`, `Competitor-Analysis.pptx`   |
| **Business Plans**    | High-level overviews of your business goals, mission, vision, and company history.                                                       | `Business-Plan-Q3.docx`, `Company-Overview.md`                                |
| **Existing Content**  | Any pre-existing articles, blog posts, or documentation that can be repurposed or used as a reference for style and tone.                | `Blog-Posts/`, `FAQ.md`, `About-Us.txt`                                       |
| **Media Files**       | Images, logos, and other visual assets that should be included on the website. Ensure they are of sufficient quality for web display.     | `assets/logo.png`, `images/product-screenshot.jpg`                            |

### Supported File Formats

AIGNE WebSmith supports a wide range of common file formats for both text-based content and media assets.

| Category      | Supported Formats                                                                    |
| :------------ | :----------------------------------------------------------------------------------- |
| **Text**      | `.md`, `.txt`, `.html`, `.json`, `.yaml`, `.xml`                                       |
| **Documents** | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`                              |
| **Images**    | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp`                                       |
| **Code**      | `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, and other common programming language files |

## How to Structure Your Content Directory

A well-organized directory structure helps both you and the AI manage the source material effectively. There is no strict requirement for folder structure, but a logical organization is recommended.

Consider grouping your files by their purpose. This makes it easier to manage your `sourcesPath` configuration and understand what information is being used.

Here is an example of a well-structured content directory:

```sh project-sources/ icon=lucide:folder-tree
project-sources/
├── 01-business-plan/
│   ├── company-overview.md
│   └── mission-and-vision.txt
├── 02-product-docs/
│   ├── feature-list.md
│   └── technical-specifications.pdf
├── 03-marketing-materials/
│   ├── brand-guidelines.pdf
│   └── target-audience-profile.docx
└── 04-media-assets/
    ├── logo.svg
    └── product-screenshot.png
```

You can then configure your `sourcesPath` to point to the root directory:

```yaml websmith-config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources
# Other configuration...
```

## Summary

Preparing your content is a foundational step for creating a high-quality website with AIGNE WebSmith. By gathering comprehensive source materials and pointing to them correctly using `sourcesPath`, you provide the AI with the necessary context to generate accurate, relevant, and professional web pages.

With your content prepared, you are now ready to create your configuration file and generate your first website.

<x-cards>
<x-card data-title="Your First Website" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
Proceed to the next step to create your configuration and generate your website.
</x-card>
</x-cards>