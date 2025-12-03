# 准备材料

优秀的网站始于运行 `aigne web generate` 之前。本指南为您提供了一份具体的清单，用于收集简报、源文档和证明材料，以便 WebSmith 能够构建出反映您需求、引用正确证据并减少修订周期的页面。

## 准备工作流程

以下是从收集材料到获得第一个网站的流程：

<!-- DIAGRAM_IMAGE_START:flowchart:16:9 -->
![Prepare Materials](assets/diagram/reference-prepare-materials-diagram-0.jpg)
<!-- DIAGRAM_IMAGE_END -->

每一步都建立在前一步的基础上。更好的输入意味着更好的输出——就这么简单。一个组织良好的内容套件能帮助 WebSmith 从一开始就创建出权威且符合品牌形象的页面。

## 第 1 步：从基础开始

创建一个简短的简报，回答以下四个问题。一个简单的 Markdown 或 Word 文档即可：

| 问题 | 重要性 | 示例 |
| :---------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **受众** | 语气、词汇和证明材料应与页面的读者相匹配。 | “成长阶段的金融科技创始人和他们的工程主管。” |
| **问题** | 迫使您清晰地阐述您解决的痛点。 | “手动入职流程导致超过 10 小时的重复性合规审查工作。” |
| **差异化优势**| 避免文案听起来与所有竞争对手都一样。 | “唯一一个基于区域数据湖构建 KYC + KYB 自动化功能的平台。” |
| **主要行动号召 (CTA)** | 使每个部分都为一个单一的转化行动服务。 | “预约一个 20 分钟的集成审查会议。” |

将此文件保存在项目内部，以便您可以将其添加到 `sourcesPath` 中。

## 第 2 步：收集您的内容和资产

WebSmith 基于您提供的内容进行工作。您提供的相关材料越多，您的网站就会越好。将这些项目整理到一个 `sources` 目录中：

### 推荐的内容类型

| 内容类型 | 描述 | 示例 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **产品文档** | 功能分解、架构说明、API 参考、定价解释。 | `docs/product-overview.md`, `api/quickstart.md` |
| **营销计划** | 定位、信息框架、活动简报、竞争对手摘要。 | `marketing/positioning.pdf`, `brand/voice.md` |
| **商业计划** | 使命、愿景、路线图、融资里程碑、领导层简介。 | `company/mission.txt`, `investor/roadmap.pptx` |
| **现有内容** | 博客文章、常见问题解答、更新日志——任何能展示语气或可重复故事的内容。 | `blog/*.md`, `faq.md`, `release-notes/2024-02.md` |
| **媒体文件** | 标志、产品截图、团队照片、图表。 | `assets/logo.svg`, `screenshots/dashboard.png` |

### 支持的格式

| 类别 | 格式 |
| :------------ | :--------------------------------------------------------------------------------------------------------- |
| **文本** | `.md`, `.txt`, `.html`, `.json`, `.yaml`, `.xml` |
| **文档** | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| **图片** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp` |
| **代码** | `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, 以及大多数其他用于代码片段提取的主流语言 |

## 第 3 步：为清晰而组织

将您的文件进行逻辑分组。这使得您和 WebSmith 都能轻松找到所需内容。

```sh project-sources/ icon=lucide:folder-tree
project-sources/
├── 01_briefs/
│   ├── product-overview.md
│   └── audience-matrix.md
├── 02_proof/
│   ├── testimonials.md
│   └── security-metrics.xlsx
├── 03_assets/
│   ├── logo.svg
│   └── dashboard.png
└── 04_content/
    ├── blog/
    └── faq.md
```

使用描述性的文件夹名称和前缀。应该一眼就能看出每个目录包含什么。

## 第 4 步：在 `config.yaml` 中连接您的源

将 `sourcesPath` 数组指向您刚刚组织的目录（或特定文件）。这是最重要的配置参数。

```yaml config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources/01_briefs
  - ./project-sources/02_proof
  - ./project-sources/03_assets
pagePurpose:
  - saas
targetAudienceTypes:
  - businessOwners
  - developers
rules: >
  突出由客户评价支持的 40% 成本节约。提及 SOC 2 + ISO 27001。
```

当您运行 `aigne web generate` 时，WebSmith 会递归读取这些文件夹，对文件进行分块，并在编写文案和组装布局时引用它们。

## 选择您的方法

您有多少时间？选择适合您情况的方法。

### 快速开始：只需要一个演示？

非常适合当您需要快速搭建并可以稍后完善的情况。

- 从一个写得好的 README（约 500+ 字）和几张截图开始
- 将它们添加到 `sourcesPath`
- 运行 `aigne web generate`，审查结果，并迭代一次
- 非常适合用于原型、内部演示或初步测试

### 推荐：构建真实的产品

对于大多数推出真实产品或服务的团队来说，这是最佳选择。

1.  记录您的**受众**、**问题**、**差异化优势**和 **CTA**
2.  为每个用户画像构建一个包含功能性和情感性证明的价值矩阵
3.  在让 WebSmith 编写之前，按意图概述每个页面部分
4.  将客户推荐、指标和截图打包为单独的文件
5.  生成后，验证每个部分是否达到其目标，然后优化并重新运行

### 高级：团队知识库

适用于需要发布多个网站或维护长期内容系统的团队。

- 将您的专业知识拆分到按主题组织的重点明确的 Markdown 文件中
- 示例结构：

```sh
knowledge-base/
├── foundation/
│   ├── mission.md
│   └── brand-voice.md
├── products/
│   ├── payments-overview.md
│   └── payments-technical-specs.md
├── proof-points/
│   ├── case-study-fintech-x.md
│   └── g2-reviews.md
└── audiences/
    ├── developer-persona.md
    └── operator-persona.md
```

这种方法具有极佳的扩展性：
- 为不同项目混合搭配目录
- 每个网站都从单一的事实来源获取信息
- 更新一个文件（`case-study-fintech-x.md`），所有引用它的网站都会自动得到改进

## 质量清单

在运行生成命令之前，请确保：

- [ ] 每个声明都有源文件中的数据点、引述或指标支持
- [ ] 用户画像和 CTA 与营销文案分开记录
- [ ] 资产有描述性的名称（例如 `dashboard-dark.png`，而不是 `image1.png`）
- [ ] 敏感或仅限内部使用的文件已被排除（WebSmith 会读取您指向的所有内容）
- [ ] 源文档包含知识；风格指南则放在 `rules` 字段中

## 获得最佳结果的提示

WebSmith 旨在一次性生成优秀的网站——但质量取决于您提供给它的内容。

- **提供具体细节。** 您的源材料（数据点、引述、指标）越具体，您的网站就越具权威性。
- **将内容分解为重点突出的文件。** 与其使用一个庞大的文档，不如将主题组织成更小的文件。这有助于 WebSmith 精确引用来源并生成结构更清晰的内容。
- **将内容与指令分开。** 将您的知识放入源文件中，但将布局和语气指令保留在它们所属的 `rules` 字段中。

## 后续步骤

<x-cards data-columns="3">
  <x-card data-title="开始使用" data-icon="lucide:rocket" data-href="/getting-started">
    安装 AIGNE CLI，运行 `aigne web generate`，并审查您的第一个网站。
  </x-card>
  <x-card data-title="创建网站" data-icon="lucide:wrench" data-href="/guides/create-website">
    了解生成工作流程中可用的每个选项。
  </x-card>
  <x-card data-title="发布网站" data-icon="lucide:globe" data-href="/guides/publish-website">
    一旦内容看起来很棒，就部署到 WebSmith Cloud 或您自己的基础设施。
  </x-card>
</x-cards>
