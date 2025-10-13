# 准备您的内容

AIGNE WebSmith 生成的网站质量与您提供的信息质量成正比。清晰详细的输入可以让 AI 创建出能够准确反映您目标且只需最少修改的网站。

本指南概述了在生成网站之前您应准备的基本内容和信息。花时间收集这些材料将简化流程，并最终产出更优质的成品。内容准备就绪后，您可以继续阅读 [您的第一个网站](./getting-started-your-first-website.md) 教程来生成您的网站。

## 1. 定义您的网站蓝图

对 AI 而言，最关键的输入是关于您网站目的、结构和风格的清晰描述。这通常在 YAML 配置文件中提供。AI 会使用这些指令来规划网站架构并生成内容。

您的蓝图应清晰定义以下几个方面：

### 网站要求 (`rules`)

这是一套给 AI 的详细指令。请尽可能具体。一套定义明确的规则应包括：

*   **页面结构**：列出您网站上想要的所有页面。例如：首页、关于我们、功能、定价、博客和联系我们。
*   **页面内容**：为每个页面简要描述其用途和应包含的关键信息。例如，“功能页面应详细介绍我们产品的三个核心功能，并为每个功能提供简短描述。”
*   **主要目标**：阐明网站的主要目标。这有助于 AI 确定内容的优先级，并加入有效的行为召唤（CTA）。例如：“鼓励访客注册免费试用”，或“通过联系表单获取潜在客户”。
*   **基调与风格**：描述您网站期望的个性。是专业严谨，还是休闲友好？语言应该是技术性的还是简单的？

以下是 YAML 文件中 `rules` 部分的一个实际示例：

```yaml my-website.yaml
rules: |
  Create a modern SaaS product website that includes:
  1. A homepage introducing the product and its core features.
  2. A pricing page with a comparison table for three distinct plans.
  3. A page showcasing customer success stories or testimonials.
  4. A contact page with a form and support information.

  Requirements:
  - The style should be professional and business-oriented.
  - The content must highlight the product's key advantages.
  - Include clear calls-to-action (CTAs) to guide users to sign up for a trial.
```

### 目标受众 (`targetAudience`)

定义您的目标受众至关重要。AI 会利用这些信息来调整内容的词汇、基调和复杂性，以便与您的目标访客产生共鸣。

*   **好的示例：** `targetAudience: "中型科技公司的技术决策者和首席技术官。"`
*   **效果较差的示例：** `targetAudience: "所有人。"`

### 语言与风格

您还可以为您的网站指定主要语言和通用风格主题。

*   **`locale`**：网站内容的语言（例如，`en` 代表英语，`zh` 代表中文）。
*   **`websiteStyle`**：一个高级别的风格描述符（例如，`business`、`modern`、`minimalist`）。

## 2. 收集现有源材料

AIGNE WebSmith 可以分析现有文档和文件，以更深入地了解您的项目、品牌和产品。提供这些材料能为 AI 提供宝贵的上下文，从而生成更相关、更准确的内容。

可以考虑收集以下类型的文件：

*   **文本文档**：README 文件、项目文档、营销文案、白皮书或任何描述您产品或业务的文本。
*   **媒体资产**：高质量的图片和视频对于专业网站至关重要。这包括徽标、产品截图、团队照片和宣传视频。

将这些文件整理到一个专门的项目文件夹中。然后，您可以在生成过程中指示 WebSmith 使用此文件夹作为信息来源。

### 准备媒体资产

为了获得最佳的视觉效果，正确准备媒体文件非常重要。

*   **图片质量**：使用高分辨率的图片。为确保您的图片能正确显示且不被过滤掉，它们的**最小宽度应为 800 像素**。
*   **整理**：将所有媒体文件保存在项目目录中一个指定的子文件夹（例如 `/assets` 或 `/images`）内，以便于管理。

## 总结清单

在开始之前，请确保您已完成以下步骤。此清单将帮助您整理材料，以实现高效的网站生成过程。

| 任务 | 状态 | 描述 |
| :--- | :--- | :--- |
| **起草网站要求** | ☐ | 撰写清晰的 `rules` 描述，概述页面、内容和目标。 |
| **定义目标受众** | ☐ | 确定您网站的主要受众。 |
| **收集文本文档** | ☐ | 收集所有相关文档、README 文件和营销材料。 |
| **准备媒体资产** | ☐ | 收集并整理高质量的图片（最小宽度 800 像素）和视频。 |
| **整理所有内容** | ☐ | 将所有准备好的文件放入一个结构清晰的单一项目文件夹中。 |

当您的内容准备并整理好后，您就可以创建配置文件并生成您的网站了。

### 后续步骤

*   [您的第一个网站](./getting-started-your-first-website.md)