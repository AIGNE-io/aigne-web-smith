# 配置参考

`config.yaml` 文件是您网站生成的核心控制面板。理解其设置，可以帮助您定制 AI 输出的方方面面，从页面结构到内容基调。本指南提供了完整、逐字段的参考，以帮助您精确地修改您的网站。

## 概览

`config.yaml` 文件是 AIGNE WebSmith 的主要配置源。它使用 YAML 格式存储 AI Agent 生成网站所需的所有参数。每当您运行 `generate` 或 `update` 等命令时，WebSmith 都会读取此文件以了解您的需求。

-   **文件名：** `config.yaml`
-   **位置：** `.aigne/web-smith/config.yaml`（相对于您的项目根目录）
-   **格式：** YAML (UTF-8)

该文件控制网站的目标、目标受众、内容生成规则、页面结构、多语言支持和部署设置。

### 创建和更新配置

`config.yaml` 文件在您首次使用 WebSmith 时自动创建。

**创建：**

您可以通过两种方式创建该文件：

1.  **在首次生成期间：** 在新项目中运行 `aigne web generate` 将启动一个交互式向导来创建 `config.yaml` 文件，然后再开始生成过程。
2.  **单独创建：** 运行 `aigne web init` 会启动相同的向导来创建配置文件，而不会立即生成网站。

```sh aigne web init icon=lucide:terminal
aigne web init
```

![AIGNE WebSmith 配置向导](../../../assets/images/web-smith-config.png)

**更新：**

您可以使用以下两种方法之一更新您的配置：

1.  **直接编辑文件：** 在文本编辑器中打开 `.aigne/web-smith/config.yaml` 并修改字段。
2.  **使用交互式向导：** 再次运行 `aigne web init`。向导将加载您现有的设置并引导您进行更新。

## 配置参数

`config.yaml` 中的字段按功能组进行组织。以下各节详细解释了每个参数。

### 项目基础

该组定义了您项目的身份，用于品牌推广、SEO 和社交媒体分享。

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>您项目的显示名称。它会出现在页面标题（`<title>`）、导航栏和其他品牌元素中。为便于阅读，请保持在 50 个字符以内。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true">
    <x-field-desc markdown>项目的简要描述，用于 SEO 元描述（`<meta name="description">`）和社交分享预览。建议长度在 150 个字符以内。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>您项目徽标的 URL 或本地路径。它用于网站页眉、favicon 和社交媒体缩略图。支持完整 URL 或相对路径（例如 `./assets/logo.png`）。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>在 WebSmith 服务中标识您项目的唯一 UUID。它是自动生成的，不应更改，因为更改它会使您的项目与其部署历史记录脱钩。</x-field-desc>
  </x-field>
  <x-field data-name="projectSlug" data-type="string" data-default="/" data-required="false">
    <x-field-desc markdown>您网站部署的 URL 路径前缀。例如，slug 为 `/docs` 会将网站部署到 `https://example.com/docs/`。</x-field-desc>
  </x-field>
  <x-field data-name="projectCover" data-type="string" data-required="false">
    <x-field-desc markdown>用于社交媒体预览（例如 Open Graph）的封面图片路径。请使用高质量图片，推荐尺寸为 1200×630 像素。</x-field-desc>
  </x-field>
</x-field-group>

### 网站策略

这些字段定义了 AI 的高层策略，影响网站的目标、内容基调和整体结构。

<x-field-group>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>定义网站的主要目标，这会影响页面结构和使用的组件。可能的值包括 `landingPage`、`ecommerce`、`saas`、`portfolio`、`corporate`、`blog`、`nonprofit` 和 `education`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>指定目标受众，这会影响 AI 的基调、复杂性和示例。可能的值包括 `customers`、`businessOwners`、`marketers`、`designers`、`developers`、`investors`、`jobSeekers`、`students` 和 `generalPublic`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-default="standard" data-required="false">
    <x-field-desc markdown>控制页面数量和导航复杂性。选项有：`singlePage`（一个可滚动的页面）、`minimal`（2-6 页）、`standard`（7-12 页，推荐）、`comprehensive`（12+ 页）或 `aiDecide`（让 AI 决定）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>为 AI 提供关于内容结构、基调和风格的详细、多行指令。这是引导生成过程以满足您特定要求的关键字段。支持 Markdown 格式。</x-field-desc>
  </x-field>
</x-field-group>

### 语言

配置主要语言和任何用于翻译的附加语言。

<x-field-group>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="false">
    <x-field-desc markdown>网站基础内容的主要语言，使用 IETF 语言代码指定（例如 `en`、`zh`、`ja`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>一个附加语言代码列表，用于将网站翻译成这些语言。每个语言代码都会生成一个完整的、翻译后的网站结构版本。</x-field-desc>
  </x-field>
</x-field-group>

### 数据源

这些字段指定 AI Agent 将用作参考材料的内容和数据。

<x-field-group>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>供 AI 分析的本地目录和文件路径数组。**这是影响内容质量最重要的字段**，因为 AI 仅使用这些源作为参考。请包含文档、README 和其他关键项目文件。</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="array" data-required="false">
    <x-field-desc markdown>一个文件路径数组，这些文件会被注入到每个页面的上下文中。这对于共享数据很有用，例如列出图片位置和描述的 `media.md` 文件。</x-field-desc>
  </x-field>
</x-field-group>

### 输出与部署

配置输出目录和部署 URL。

<x-field-group>
  <x-field data-name="pagesDir" data-type="string" data-default="./aigne/web-smith/pages" data-required="false">
    <x-field-desc markdown>存储生成的网站文件（例如 `page.yaml`）的输出目录。</x-field-desc>
  </x-field>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您网站的最终部署 URL。`publish` 命令使用此 URL 来确定部署目标。</x-field-desc>
  </x-field>
</x-field-group>

### 媒体与显示

这些设置控制如何处理图片等媒体资源。

<x-field-group>
  <x-field data-name="media.minImageWidth" data-type="integer" data-default="800" data-required="false">
    <x-field-desc markdown>图片在网站上被考虑使用的最小宽度（以像素为单位）。这有助于过滤掉低质量或小尺寸的图片。</x-field-desc>
  </x-field>
</x-field-group>

### 系统管理字段

这些字段通常由 WebSmith 管理，不需要手动编辑。

<x-field-group>
  <x-field data-name="lastGitHead" data-type="string" data-required="false">
    <x-field-desc markdown>上次生成的 Git 提交哈希，用于增量更新。</x-field-desc>
  </x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false">
    <x-field-desc markdown>开发期间使用的临时变量。</x-field-desc>
  </x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>开发期间使用的临时变量。</x-field-desc>
  </x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false">
    <x-field-desc markdown>开发期间使用的临时变量。</x-field-desc>
  </x-field>
</x-field-group>

## 应用更改

对 `config.yaml` 文件的更改不会自动应用。您必须运行相应的命令才能使您的修改生效。所需命令取决于您更改了哪个字段。

| 字段 | 应用更改的命令 | 说明 |
| :-------------------------------------------------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------ |
| `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `locale`              | `aigne web clear && aigne web generate`                | 这些字段需要完全重新生成才能正确重构网站。 |
| `rules`, `media.minImageWidth`, `defaultDatasources`                        | `aigne web update`                                     | 更新现有内容而无需完全重新生成。 |
| `sourcesPath`                                                               | `aigne web clear && aigne web generate` 或 `aigne web update` | 在更新期间会分析新的数据源以改进内容。 |
| `translateLanguages`                                                        | `aigne web translate`                                  | 根据更新后的列表添加新的语言版本。 |
| `projectName`, `projectDesc`, `projectLogo`, `projectCover`, `appUrl` | `aigne web publish`                                    | 这些字段主要在发布过程中使用。 |

## 完整配置示例

以下是 AIGNE WebSmith 项目本身的完整 `config.yaml` 文件，展示了一个真实世界的配置。

```yaml config.yaml
projectName: AIGNE WebSmith
projectDesc: "基于 AIGNE 框架的 AI 驱动的网站生成工具"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. 核心信息与策略：定义向用户传达*什么*内容的基础元素。
  1. 在“首屏”回答关键问题：用户看到的第一个屏幕必须清晰、立即地回答：
    * 它是什么：产品的简明描述。
    * 它是为谁设计的：特定的目标受众（例如，个人创业者、小团队）。
    * 它有何不同：您独特的价值主张（例如，“开放、可组合、可导出的代码、Agent 工作流”）。
    * 主要行动：一个单一、明确的行动号召（CTA），与用户的主要目标一致。
  2. 用证据建立信誉：不要期望用户相信您的声明。尽早向他们展示证据。
    * 展示，而不仅仅是讲述：最有力的证据是演示。包含一个简短的（30-45秒）无声视频循环或一个使用该工具构建的真实网站的链接。
    * 使用社会认同：在解释“工作原理”之前，插入具体的证据，如客户标志、一个引人注目的数据点（例如，“被 50 多个团队使用”）或一个强有力的用户引言。
  3. 定义明确的行动号召（CTA）：
    * 使 CTA 与受众保持一致：主要 CTA 应该是您希望目标用户采取的主要行动（例如，“生成我的网站”）。
    * 确定 CTA 的优先级：将次要行动（如“在 GitHub 上查看”）放在不太显眼的位置（三级按钮或页脚链接），特别是对于非开发者受众。
    * 在移动设备上保持一个持久的 CTA：在移动设备上，一个主要 CTA 应始终可见。
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
pagesDir: .aigne/web-smith/pages
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 600
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
checkoutId: ""
projectCover: .aigne/web-smith/cover.png
shouldSyncAll: ""
navigationType: ""
appUrl: https://mhevtaeg.user.aigne.io
```

## 总结

掌握 `config.yaml` 文件可以让您完全控制网站生成过程。通过仔细定义您的项目基础、网站策略和数据源，您可以引导 AI 生成高质量、相关且定制化的网站。

如需更多实践指导，请参阅以下指南：

<x-cards data-columns="3">
  <x-card data-title="创建网站" data-icon="lucide:rocket" data-href="/guides/create-website">了解从头开始生成您的第一个网站的完整工作流程。</x-card>
  <x-card data-title="准备材料" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">了解如何准备源文档以获得最佳效果。</x-card>
  <x-card data-title="问题排查" data-icon="lucide:wrench" data-href="/reference/trouble-shooting">查找常见配置和生成问题的解决方案。</x-card>
</x-cards>