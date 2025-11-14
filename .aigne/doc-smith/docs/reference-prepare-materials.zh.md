# 准备素材

在运行 `aigne web generate` 之前，优秀网站就已奠定基础。本指南为您提供了一个具体的清单，用于收集简报、源文档和证明素材，以便 WebSmith 能够构建反映您需求、引用正确证据并减少修订周期的页面。

## 工作流程如何运作

```d2
direction: right

Gather: {
  label: "收集简报 + 资产"
  shape: rectangle
}

Organize: {
  label: "整理 sources/"
  shape: rectangle
}

Configure: {
  label: "更新 config.yaml"
  shape: rectangle
}

Generate: {
  label: "运行 `aigne web generate`"
  shape: rectangle
}

Review: {
  label: "审查页面 + 迭代"
  shape: rectangle
}

Gather -> Organize -> Configure -> Generate -> Review
```

每一步都为下一步提供输入：混乱的输入会导致泛泛的输出，而精心策划的内容套件则能让 WebSmith 在第一次生成时就显得权威。

## 第 1 步：捕获基本要素

创建一份简短的简报（Markdown 或 DOCX 格式均可），回答以下四个问题：

| 问题 | 重要性 | 示例 |
| :---------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **受众** | 语气、词汇和证明应与页面读者相匹配。 | “成长阶段的金融科技创始人和他们的工程负责人。” |
| **问题** | 迫使您清晰地说明所解决的痛点。 | “手动入职流程导致超过 10 小时的重复性合规审查。” |
| **差异化因素**| 避免文案听起来与所有竞争对手都一样。 | “唯一一个基于区域数据湖构建 KYC + KYB 自动化的平台。” |
| **主要 CTA** | 将每个部分都对准一个单一的转化行动。 | “预约一个 20 分钟的集成评估。” |

将此文件保存在项目内部，以便您可以将其添加到 `sourcesPath`。

## 第 2 步：收集参考内容和资产

WebSmith 只能使用您提供的内容。请将以下内容整理到一个 `sources` 目录或类似文件夹中。

### 推荐的内容类型

| 内容类型 | 描述 | 示例 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **产品文档** | 功能分解、架构说明、API 参考、定价解释。 | `docs/product-overview.md`, `api/quickstart.md` |
| **营销计划** | 定位、信息框架、活动简报、竞争对手摘要。 | `marketing/positioning.pdf`, `brand/voice.md` |
| **商业计划** | 使命、愿景、路线图、融资里程碑、领导层简介。 | `company/mission.txt`, `investor/roadmap.pptx` |
| **现有内容** | 博客文章、常见问题解答、更新日志——任何能展示语气或可重复故事的内容。 | `blog/*.md`, `faq.md`, `release-notes/2024-02.md` |
| **媒体文件** | 徽标、产品截图、团队照片、图表。 | `assets/logo.svg`, `screenshots/dashboard.png` |

### 支持的格式

| 类别 | 格式 |
| :------------ | :--------------------------------------------------------------------------------------------------------- |
| **文本** | `.md`, `.txt`, `.html`, `.json`, `.yaml`, `.xml` |
| **文档** | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| **图片** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp` |
| **代码** | `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`，以及大多数其他用于代码片段提取的主流语言 |

## 第 3 步：整理所有内容以便复用

将文件进行逻辑分组，这样您（和 WebSmith）就能清楚地知道什么内容在哪里。

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

使用描述性的文件夹前缀，以便清楚地知道哪些目录对应于受众、证明或媒体。

## 第 4 步：在 `config.yaml` 中配置源文件

将 `sourcesPath` 数组指向您刚刚组织的目录（或特定文件）。这是最重要的一个配置参数。

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
  突出由客户评价支持的 40% 成本节省。提及 SOC 2 + ISO 27001。
```

当您运行 `aigne web generate` 时，WebSmith 会递归地读取这些文件夹，对文件进行分块，并在编写文案和组装布局时引用它们。

## 选择适合您的方式

时间有多充裕？选择适合您情况的方法。

### 快速上手：只是需要个演示？

适合需要快速搭建，稍后再完善的场景。

- 准备一份写得不错的 README（约 500 字以上）和几张截图
- 将它们添加到 `sourcesPath`
- 运行 `aigne web generate`，查看结果，迭代一次
- 非常适合原型、内部演示或试水

### 推荐方式：打造真正的产品

这是大多数团队发布真实产品或服务的最佳选择。

1. 记录您的**受众**、**问题**、**差异化**和 **CTA**
2. 为每个用户画像构建包含功能性和情感性证明的价值矩阵
3. 在让 WebSmith 编写之前，按意图概述每个页面部分
4. 将客户评价、指标和截图打包为单独的文件
5. 生成后，验证每个部分是否达成目标，然后完善并重新运行

### 进阶玩法：团队知识库

适合发布多个网站或维护长期内容系统的团队。

- 将专业知识拆分为按主题组织的专注 Markdown 文件
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

这种方式扩展性很好：
- 为不同项目混合搭配目录
- 每个网站都从单一的真实来源获取信息
- 更新一个文件（`case-study-fintech-x.md`），所有引用它的网站都会自动改进

## 质量检查清单

在运行 generate 之前，确保：

- [ ] 每个声明都有数据点、引述或指标支撑
- [ ] 用户画像和 CTA 与营销文案分开记录
- [ ] 资产使用描述性名称（`dashboard-dark.png`，而不是 `image1.png`）
- [ ] 已排除敏感或仅限内部的文件（WebSmith 会读取您指向的所有内容）
- [ ] 源文档包含知识内容；风格指南放在 `rules` 字段中

## 获得最佳效果的技巧

WebSmith 的设计目标就是一次生成优质网站——但质量取决于您提供的材料。

- **提供具体细节。** 源材料越具体（数据点、引述、指标），您的网站就越有说服力。
- **将内容拆分为专注的文件。** 不要放在一个巨型文档里，而是将主题组织成更小的文件。这能帮助 WebSmith 精确引用来源，生成更结构化的内容。
- **内容与指令分离。** 将知识内容放在源文件中，但将布局和语气指令放在 `rules` 字段中。

## 后续步骤

<x-cards data-columns="3">
  <x-card data-title="开始使用" data-icon="lucide:rocket" data-href="/getting-started">
    安装 AIGNE CLI，运行 `aigne web generate`，并审查您的第一个网站。
  </x-card>
  <x-card data-title="创建网站" data-icon="lucide:wrench" data-href="/guides/create-website">
    了解生成工作流程中所有可用的选项。
  </x-card>
  <x-card data-title="发布网站" data-icon="lucide:globe" data-href="/guides/publish-website">
    一旦内容看起来很棒，就部署到 WebSmith Cloud 或您自己的基础设施。
  </x-card>
</x-cards>
