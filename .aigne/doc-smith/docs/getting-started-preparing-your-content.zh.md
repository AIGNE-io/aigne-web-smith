# 准备您的内容

要想通过 AIGNE WebSmith 获得最佳效果，提供合适的源材料是最关键的一步。您网站的质量和相关性直接取决于您提供给 AI 的信息。本指南将详细说明在开始之前需要准备什么。

在开始生成网站之前，收集所有描述您的项目、产品或业务的相关文档至关重要。AI 仅使用您提供的文件作为其知识库。高质量、全面的源材料将生成一个专业且准确的网站，而稀疏或不相关的内容将导致网站内容空泛且效果不佳。

要深入了解如何构建您的知识以获得最佳结果，请参阅我们的[方法论](./guides.md)指南。

```d2
direction: down

User: {
  shape: c4-person
}

Source-Content: {
  label: "源内容目录"
  shape: rectangle
  grid-columns: 2

  Product-Documents: {
    label: "产品文档\n(.md, .pdf, .docx)"
  }

  Marketing-Plans: {
    label: "营销计划\n(.md, .pdf)"
  }

  Business-Plans: {
    label: "商业计划\n(.docx, .md)"
  }

  Media-Assets: {
    label: "媒体资产\n(.svg, .png)"
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
  label: "生成的网站"
  shape: rectangle
}

User -> Source-Content: "1. 准备并组织内容"
User -> Websmith-Config: "2. 定义 sourcesPath"
Websmith-Config -> AIGNE-WebSmith: "3. 提供配置"
Source-Content -> AIGNE-WebSmith: "4. 读取源材料"
AIGNE-WebSmith -> Generated-Website: "5. 生成网站"

```

## `sourcesPath` 的作用

在您的配置文件中，`sourcesPath` 参数告诉 AIGNE WebSmith 在哪里找到您的内容。您可以指定一个或多个目录，AI 将递归读取其中的文件，以了解您网站的主题。

这是决定您生成网站质量最重要的一项设置。

以下是 `websmith-config.yaml` 文件中如何定义 `sourcesPath` 的基本示例：

```yaml websmith-config.yaml icon=lucide:file-code
# 包含您源材料的目录。
sourcesPath:
  - ./docs
  - ./product-briefs
# 其他配置细节如下...
pagePurpose: "To create a marketing website for a new SaaS product."
targetAudienceTypes: "Potential customers, developers, and investors."
```

在此示例中，WebSmith 将使用 `./docs` 和 `./product-briefs` 目录中的所有支持文件作为生成网站的上下文。

## 源内容中应包含什么

要构建一个有效的网站，AI 需要清晰地了解您的目标。您的源内容应全面涵盖您的项目或业务的关键方面。

### 推荐的内容类型

提供一系列详细说明您项目的文档。您的信息越详尽，AI 就越能创建出符合您愿景的内容。

| 内容类型 | 描述 | 示例 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **产品文档** | 对您的产品或服务的详细描述，包括其功能、优点和技术规格。 | `Product-Brief.md`、`Technical-Specifications.pdf`、`Feature-List.docx` |
| **营销计划** | 关于您的目标受众、品牌基调、关键信息和竞争分析的信息。 | `Marketing-Strategy.md`、`Brand-Guidelines.pdf`、`Competitor-Analysis.pptx` |
| **商业计划** | 对您的业务目标、使命、愿景和公司历史的宏观概述。 | `Business-Plan-Q3.docx`、`Company-Overview.md` |
| **现有内容** | 任何已有的文章、博客文章或文档，可用于重新调整用途或作为风格和语气的参考。 | `Blog-Posts/`、`FAQ.md`、`About-Us.txt` |
| **媒体文件** | 应包含在网站上的图像、徽标和其他视觉资产。确保它们的质量足以在网页上显示。 | `assets/logo.png`、`images/product-screenshot.jpg` |

### 支持的文件格式

AIGNE WebSmith 支持多种常见的文本内容和媒体资产文件格式。

| 类别 | 支持的格式 |
| :------------ | :----------------------------------------------------------------------------------- |
| **文本** | `.md`、`.txt`、`.html`、`.json`、`.yaml`、`.xml` |
| **文档** | `.pdf`、`.doc`、`.docx`、`.xls`、`.xlsx`、`.ppt`、`.pptx` |
| **图像** | `.jpg`、`.jpeg`、`.png`、`.gif`、`.svg`、`.webp` |
| **代码** | `.js`、`.ts`、`.py`、`.go`、`.rs`、`.java` 以及其他常见的编程语言文件 |

## 如何组织您的内容目录

一个组织良好的目录结构有助于您和 AI 有效地管理源材料。虽然对文件夹结构没有严格要求，但建议采用逻辑化的组织方式。

考虑按用途对文件进行分组。这使得管理 `sourcesPath` 配置和理解正在使用的信息变得更加容易。

以下是一个结构良好的内容目录示例：

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

然后，您可以将 `sourcesPath` 配置为指向根目录：

```yaml websmith-config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources
# 其他配置...
```

## 总结

准备内容是使用 AIGNE WebSmith 创建高质量网站的基础步骤。通过收集全面的源材料并使用 `sourcesPath` 正确指向它们，您为 AI 提供了生成准确、相关且专业的网页所需的上下文。

内容准备就绪后，您现在可以创建配置文件并生成您的第一个网站了。

<x-cards>
<x-card data-title="您的第一个网站" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
进入下一步，创建您的配置并生成您的网站。
</x-card>
</x-cards>