# 生成网站

AIGNE WebSmith 的核心功能是根据您的源内容和一组定义好的需求，生成一个完整的、专业的网站。此过程由 `generate` 命令处理，该命令会协调一系列 AI Agent 来规划、编写和构建您的网站。

本指南详细介绍了 `generate` 命令，并解释了如何在 `config.yaml` 文件中定义您的网站需求，该文件是 AI 的主要蓝图。

## `generate` 命令

`aigne web generate` 命令会启动整个网站创建过程。它会读取您的配置、分析您的源材料、规划网站结构、为每个页面生成内容，并组装最终文件。

### 用法

要在您的终端中运行生成过程，请执行以下命令：

```bash
aigne web generate
```

您也可以使用别名 `gen` 或 `g`：

```bash
aigne web gen
```

### 生成过程

当您运行 `generate` 命令时，WebSmith 会执行以下操作序列：

1.  **加载配置**：它首先会查找并加载 `config.yaml` 文件以了解您的高层需求。如果此文件不存在，它将自动启动引导式设置来创建一个。
2.  **分析源文件**：AI 会扫描您配置中 `sourcesPath` 指定的文档、Markdown 文件和其他材料，以理解主题内容。
3.  **规划网站结构**：基于目的、受众和源内容，AI 会为您的网站提出一个逻辑站点地图，概述所有页面及其层次结构。在内容生成开始之前，系统会提示您审查并批准此结构。
4.  **生成页面内容**：对于已批准结构中的每个页面，AI 会生成详细内容，包括标题、描述以及由专业组件（如英雄横幅、功能列表和常见问题解答）构成的章节。
5.  **保存网站文件**：每个页面的最终结构化内容将作为 YAML 文件保存在您配置中 `pagesDir` 指定的目录中。这些文件现在已准备好发布。

### 参数

`generate` 命令接受几个可选参数以自定义其行为。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>指定术语表文件的路径（例如 `@glossary.md`）。这确保了项目特定术语在生成的内容中得到一致使用。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>如果设置为 `true`，该命令将从头开始重新生成所有页面，覆盖任何先前生成的文件。这在对 `config.yaml` 文件或源文档进行重大更改后非常有用。</x-field-desc>
  </x-field>
</x-field-group>

**带参数示例：**

```bash
# 使用术语表文件重新生成整个网站
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 配置文件 (`config.yaml`)

`config.yaml` 文件是您网站的蓝图。它为 AI 提供了必要的上下文和约束，以构建满足您特定需求的网站。该文件定义了项目、网站的目的和受众、语言设置以及文件位置。

以下是 `config.yaml` 文件中关键属性的详细分解。

### 配置选项

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>您的项目或网站的名称。这用于元数据和发布。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="false">
    <x-field-desc markdown>您的项目的简要描述。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>您的项目徽标的 URL 或本地路径。</x-field-desc>
  </x-field>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>定义网站主要目标的字符串数组。示例：`productDocumentation`、`marketingLandingPage`、`blog`、`apiReference`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>识别主要受众的字符串数组。示例：`developers`、`businessUsers`、`endUsers`、`dataScientists`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>定义网站的期望大小和复杂性。选项包括 `small`（少数关键页面）、`standard`（一个全面的网站）和 `large`（一个内容丰富的扩展性网站）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>用于定义 AI 在生成过程中需要遵循的任何自定义规则或特定指令的字段，例如语气、要排除的内容或要强调的特定要点。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>网站内容的主要语言，由语言代码指定（例如 `en`、`zh`、`es`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>要将网站翻译成的语言代码列表。例如 `['zh', 'fr']`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>生成的网站页面文件将保存到的本地目录路径。</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>指向您的源内容的文件路径或 glob 模式数组。AI 将分析这些文件以生成网站。</x-field-desc>
  </x-field>
</x-field-group>

### `config.yaml` 示例

以下是一个完整的 `config.yaml` 文件示例，其中包含解释每个部分的注释。

```yaml config.yaml
# 用于页面发布的项目信息
projectName: AIGNE WebSmith
projectDesc: AI-driven website generation tool
projectLogo: https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg
projectId: aigne-websmith-docs
projectSlug: aigne-websmith

# =============================================================================
# 网站配置
# =============================================================================

# 目的：您希望读者达到的主要成果是什么？
# 可用选项（根据需要取消注释并修改）：
#   productDocumentation - 产品文档：深度指南、教程和 API 参考。
#   marketingLandingPage - 营销登陆页：展示产品并转化访客。
#   companyIntroduction - 公司介绍：展示您公司的愿景和团队。
#   blog              - 博客：文章、更新和行业见解。
#   caseStudies       - 案例研究：客户成功故事和用例。
#   knowledgeBase     - 知识库：常见问题解答和故障排除文章。
#   apiReference      - API 参考：您的 API 的详细文档。
#   mixedPurpose      - 混合目的：多个目标的组合。
pagePurpose:
  - productDocumentation

# 目标受众：谁会最常阅读这些内容？
# 可用选项（根据需要取消注释并修改）：
#   developers        - 开发者：使用您的产品进行构建的技术用户。
#   businessUsers     - 业务用户：关注业务价值的非技术用户。
#   endUsers          - 最终用户：使用最终产品的普通受众。
#   dataScientists    - 数据科学家：专注于数据和分析的用户。
#   investors         - 投资者：对公司潜力感兴趣的利益相关者。
#   jobSeekers        - 求职者：正在了解您公司的潜在员工。
targetAudienceTypes:
  - developers

# 网站规模：您的网站应该有多少个页面？
# 可用选项（根据需要取消注释并修改）：
#   small                - 小型：一个包含 3-5 个关键页面的简洁网站。
#   standard             - 标准：一个包含 5-10 个页面的综合性网站。
#   large                - 大型：一个包含超过 10 个页面的扩展性网站。
websiteScale: standard

# 自定义规则：定义特定的页面生成规则和要求
rules: 'Maintain a formal and technical tone. Avoid marketing jargon. Focus on practical, step-by-step instructions.'

# 术语表：定义项目特定的术语和定义
# glossary: "@glossary.md"  # 包含术语表定义的 Markdown 文件路径

locale: en
# translateLanguages:  # 要将页面翻译成的语言列表
#   - zh  # 示例：翻译成中文
#   - en  # 示例：翻译成英文

pagesDir: ./aigne-web-smith/pages  # 保存生成页面的目录
sourcesPath:  # 需要分析的源代码路径
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # 每个页面都包含的默认数据源
  - ./media.md
# minImageWidth: 只有宽度大于此值（像素）的图片才会在页面生成中使用
media:
  minImageWidth: 800
```

## 总结

通过将 `generate` 命令与定义明确的 `config.yaml` 文件相结合，您可以高效地生成一个完全符合您具体规格的完整网站。此过程自动化了网站结构和内容创建的繁重工作，让您可以专注于提供高质量的源材料。

生成网站后，下一步是将其发布到线上。

进一步阅读：
*   [发布您的网站](./core-tasks-publishing-your-website.md)