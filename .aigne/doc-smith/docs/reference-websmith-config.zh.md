# WebSmith 配置文件

本指南详细介绍了 `.aigne/web-smith/config.yaml` 文件中的所有设置。此文件是 WebSmith 规划、生成和部署您网站的唯一可信来源。它定义了您项目的消息传递、目标受众、数据源、本地化和发布细节，AI agent 在执行每个 `generate` 或 `update` 命令时都会依赖这些信息。

**关键原则**

*   **稳定的元数据**：保持 `projectName`、`projectId` 和 `projectSlug` 等必需元数据的一致性。下游服务依赖这些标识符。
*   **策略驱动的内容**：策略字段（`pagePurpose`、`targetAudienceTypes`、`rules`）指导 AI 的叙事风格。当您的产品或营销策略发生变化时，请首先更新这些字段。
*   **明确的数据源**：`sourcesPath` 和 `defaultDatasources` 列表控制 WebSmith 分析哪些内容。新的数据文件必须在这里注册后才能用于生成。
*   **受控的部署**：部署设置（`appUrl`、`checkoutId`）影响生成网站的发布方式。

```d2
direction: down

# Actors
developer: {
  label: "开发者"
  shape: c4-person
}

# Core Components
websmith-engine: {
  label: "AIGNE WebSmith 引擎"
  shape: rectangle
  style: {
    fill: "#f0f4ff"
    stroke: "#b3c7f2"
  }
}

# Artifacts & Data
config-file: {
  label: "config.yaml"
  shape: rectangle
  grid-columns: 2
  grid-gap: 40

  metadata: {
    label: "1. 项目元数据"
    shape: rectangle
    projectName
    projectDesc
    projectId
  }

  strategy: {
    label: "2. 网站策略"
    shape: rectangle
    pagePurpose
    targetAudienceTypes
    rules
  }

  localization: {
    label: "3. 本地化"
    shape: rectangle
    locale
    translateLanguages
  }

  sources: {
    label: "4. 内容源"
    shape: rectangle
    sourcesPath
  }

  media: {
    label: "5. 媒体与资产"
    shape: rectangle
    minImageWidth
    projectCover
  }

  deployment: {
    label: "6. 部署"
    shape: rectangle
    appUrl
    checkoutId
  }
}

content-sources: {
  label: "内容源\n(.md, .yaml)"
  shape: cylinder
}

repository: {
  label: "Git 仓库"
  shape: cylinder
  
  generated-site: {
    label: "生成的网站\n(Markdown/HTML)"
    shape: cylinder
    style.fill: "#e6ffed"
  }
}

# Workflow Connections
developer -> config-file: "1. 修改配置"
developer -> content-sources: "2. 添加新源"
developer -> websmith-engine: "3. 运行 `aigne generate`"

config-file -> websmith-engine: "读取"
content-sources -> websmith-engine: "分析"

websmith-engine -> repository.generated-site: "生成/更新"

developer -> repository: "4. 审查与提交"
```

## 配置结构

该配置分为几个逻辑部分。以下是每个参数的详细分解。

### 项目发布元数据

本节定义了您项目的核心身份。此信息用于生成的页面、报告和 SEO 元数据。

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="项目的人类可读标题。它会出现在页面标题和报告中。"></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="用于 SEO 元数据和内部 AI 提示的简短营销描述。"></x-field>
  <x-field data-name="projectLogo" data-type="URL" data-required="false" data-desc="项目的徽标的绝对 URL 或可访问的 CDN 路径，用于页眉和社交媒体卡片。"></x-field>
  <x-field data-name="projectId" data-type="UUID" data-required="true" data-desc="WebSmith 服务的唯一标识符。这是自动生成的，不应在项目之间修改或回收。"></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="项目的默认 URL 段（例如 /my-site）。请保持此项与您的部署目标同步。"></x-field>
</x-field-group>

### 网站策略与叙事

这些字段指导 AI 网站内容的叙事、基调和结构。

<x-field-group>
  <x-field data-name="pagePurpose" data-type="list" data-required="true">
    <x-field-desc markdown>声明网站的主要目标（例如 `landingPage`、`portfolio`、`documentation`）。您可以列出多个目的以融合不同的叙事方法。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="list" data-required="false">
    <x-field-desc markdown>指导网站的基调和号召性用语 (CTA)。有效选项包括 `customers`、`developers`、`investors` 等。请包含所有相关受众。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="enum" data-required="false">
    <x-field-desc markdown>指明网站的预期规模和复杂性（例如 `singlePage`、`standard`、`aiDecide`）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>关于结构、叙事流程和基调给 AI 的高优先级指令。WebSmith 会将 Markdown 格式（标题、列表）解析为指导，而非字面上的副本。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="path" data-required="false" data-desc="生成的网站页面的输出目录。这是 WebSmith 写入最终文件的位置。"></x-field>
</x-field-group>

### 本地化与语言

为您的网站内容配置语言。

<x-field-group>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>内容生成的主要语言，使用 IETF 语言代码指定（例如 `en`、`en-US`、`zh-TW`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith 应将内容翻译成的其他 IETF 语言代码列表。</x-field-desc>
  </x-field>
</x-field-group>

### 内容源与数据源

定义 WebSmith 应在何处查找您的内容。

<x-field-group>
  <x-field data-name="sourcesPath" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith 为获取上下文而分析的目录或文件路径列表。在生成前，请在此处添加新的数据文件（例如 `.yaml`、`.md`）。</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="list" data-required="false">
    <x-field-desc markdown>会自动注入到每个页面的数据源路径列表。对于像媒体目录这样的全局可用数据非常有用。</x-field-desc>
  </x-field>
</x-field-group>

### 媒体与视觉资产

控制图像和其他视觉元素处理方式。

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="生成布局中图片允许的最小宽度（单位：像素）。"></x-field>
  </x-field>
  <x-field data-name="projectCover" data-type="path" data-required="false" data-desc="用于首屏区域和社交媒体预览的封面图片的路径。"></x-field>
</x-field-group>

### 部署与集成

这些字段包含与发布网站相关的设置。

<x-field-group>
  <x-field data-name="appUrl" data-type="URL" data-required="false" data-desc="网站的主要部署 URL。用于规范链接和其他引用。"></x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false" data-desc="用于覆盖导航样式的可选设置。"></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="ArcBlock 部署/结账服务的标识符。"></x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>控制发布步骤是否推送所有构件。设置为 `"true"` 进行完全同步。</x-field-desc>
  </x-field>
  <x-field data-name="lastGitHead" data-type="string" data-required="false" data-desc="上次生成时的 Git 提交 SHA。WebSmith 会自动更新此项。"></x-field>
</x-field-group>

## 配置示例

以下是一个示例 `config.yaml` 文件，展示了典型设置。

```yaml config.yaml icon=logos:yaml
# 1. 项目发布元数据
projectName: "AIGNE WebSmith Docs"
projectDesc: "The official documentation for AIGNE WebSmith."
projectLogo: "https://example.com/logo.png"
projectId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
projectSlug: "websmith-docs"

# 2. 网站策略与叙事
pagePurpose:
  - documentation
  - landingPage
targetAudienceTypes:
  - developers
websiteScale: "standard"
rules: |
  - Focus on clarity and practical examples.
  - Maintain a professional but approachable tone.
  - Ensure all code snippets are accurate and easy to copy.
pagesDir: "src/pages"

# 3. 本地化与语言
locale: "en"
translateLanguages:
  - "zh-TW"

# 4. 内容源与数据源
sourcesPath:
  - "src/content"
  - "src/data/features.yaml"
defaultDatasources:
  - "src/data/site-metadata.yaml"

# 5. 媒体与视觉资产
media:
  minImageWidth: 600
projectCover: "src/assets/cover-image.png"

# 6. 部署与集成
appUrl: "https://docs.aigne.com/websmith"
checkoutId: "chk_12345"
shouldSyncAll: "false"
lastGitHead: ""
```

## 常见更新工作流

要使用配置文件将更改应用到您的网站，请遵循以下步骤：

1.  **修改配置**：根据需要在 `config.yaml` 中调整策略、元数据或其他字段。
2.  **注册新源**：如果您有新的数据文件，请在 `sourcesPath` 下注册它们，并在必要时在 `defaultDatasources` 下注册。
3.  **运行 WebSmith**：使用 `aigne run generate` 进行全新的构建，或使用 `aigne run update` 刷新现有页面的内容。
4.  **审查并提交**：审查生成的内容以确保其反映了您的更改，然后将更新的文件提交到您的仓库。

通过使此配置文件与您项目的目标和内容源保持一致，您可以确保 WebSmith 始终生成一个高质量、符合品牌的网站。