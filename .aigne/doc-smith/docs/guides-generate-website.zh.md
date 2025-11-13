# 生成网站

使用本指南，只需一个命令即可将您的源材料转换为可上线的网站。您将检查可用的 `aigne web generate` 标志，批准 AI 生成的站点地图，并了解完成的页面在磁盘上的存放位置。

如果您需要快速参考每个标志和别名，请运行 `aigne web -h`；您应该会看到如下所示的示例输出。

![`aigne web -h` 的输出，显示可用的标志和别名](../../../assets/images/web-smith-help.png)

## 生成过程

`aigne web generate` 命令会启动整个网站创建过程。它会读取您的配置，分析您的源材料，规划网站结构，为每个页面生成内容，并组装最终文件。

### 用法

要在终端中运行生成过程，请执行以下命令：

```bash Generate Website icon=lucide:terminal
aigne web generate
```

您也可以使用别名 `gen` 或 `g`：

```bash Generate Website icon=lucide:terminal
aigne web gen
```

### 生成过程

当您运行 `generate` 命令时，WebSmith 会执行以下操作序列：

1.  **加载配置**：它首先查找并加载 `config.yaml` 文件以了解您的高级要求。如果此文件不存在，它将自动启动引导式设置来创建一个。
2.  **分析源文件**：AI 会扫描您配置中 `sourcesPath` 指定的文档、Markdown 文件和其他材料，以理解主题内容。
3.  **规划网站结构**：根据目的、受众和源内容，AI 会为您的网站提出一个逻辑站点地图，概述所有页面及其层次结构。在内容生成开始之前，系统会提示您审查并批准此结构。

![在批准生成前审查建议的网站结构](../../../assets/images/web-smith-generate-structure.png)

4.  **生成页面内容**：对于已批准结构中的每个页面，AI 会生成详细内容，包括标题、描述以及由专业组件（如英雄横幅、功能列表和常见问题解答）构成的章节。
5.  **保存网站文件**：每个页面的最终结构化内容将作为 YAML 文件保存在您配置中由 `pagesDir` 指定的目录中。这些文件现在已准备好发布。

![生成运行摘要，显示成功输出和后续步骤](../../../assets/images/web-smith-generate-success.png)

### 参数

`generate` 命令接受几个可选参数来自定义其行为。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>指定词汇表文件的路径（例如 `@glossary.md`）。这确保了项目特定术语在生成的内容中得到一致使用。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>如果设置为 `true`，该命令将从头开始重新生成所有页面，覆盖任何先前生成的文件。这在对 `config.yaml` 文件或源文档进行重大更改后非常有用。</x-field-desc>
  </x-field>
</x-field-group>

**带参数的示例：**

```bash # Regenerate Website icon=lucide:terminal
# 使用词汇表文件重新生成整个网站
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 配置文件 (`config.yaml`)

`config.yaml` 文件是您网站的蓝图。它为 AI 提供了必要的上下文和约束，以构建一个满足您特定需求的网站。该文件定义了项目、网站的目的和受众、语言设置以及文件位置。

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
    <x-field-desc markdown>定义网站主要目标的字符串数组。示例：`landingPage`、`ecommerce`、`portfolio`、`corporate`、`blog`、`saas`、`nonprofit`、`education`、`mixedPurpose`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>识别主要受众的字符串数组。示例：`customers`、`businessOwners`、`marketers`、`designers`、`developers`、`investors`、`jobSeekers`、`students`、`generalPublic`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>定义网站的期望大小和复杂性。选项包括 `singlePage`、`minimal`、`standard`、`comprehensive` 和 `aiDecide`。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>用于 AI 在生成过程中遵循的任何自定义规则或特定指令的字段，例如语调、要排除的内容或要强调的特定要点。</x-field-desc>
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

# 目的：您希望读者实现的主要结果是什么？
# 可用选项（根据需要取消注释并修改）：
#   landingPage     - 落地页 / 主页：将访客转化为用户或客户
#   ecommerce       - 电子商务 / 在线商店：在线销售产品或服务
#   portfolio       - 作品集 / 展示：展示创意作品、项目或成就
#   corporate       - 企业 / 商业：包含公司信息的专业商业网站
#   blog            - 博客 / 内容网站：分享文章、新闻和定期内容更新
#   saas            - SaaS / 软件产品：推广软件服务并引导用户上手
#   nonprofit       - 非营利 / 社区：推广事业、接受捐赠、吸引志愿者
#   education       - 教育 / 学习：提供课程、教程或教育内容
#   mixedPurpose    - 多用途网站：涵盖多种需求的综合性网站
pagePurpose:
  - saas

# 目标受众：谁会最常阅读这些内容？
# 可用选项（根据需要取消注释并修改）：
#   customers        - 客户 / 最终用户：购买或使用您产品/服务的人
#   businessOwners   - 企业主 / 企业家：经营企业并寻求解决方案的人
#   marketers        - 营销团队：推广产品或管理营销活动的人
#   designers        - 设计师 / 创意专业人士：专注于视觉设计和用户体验的人
#   developers       - 开发者 / 技术用户：构建或集成技术解决方案的人
#   investors        - 投资者 / 利益相关者：评估业务潜力和增长的人
#   jobSeekers       - 求职者 / 潜在员工：寻找职业机会的人
#   students         - 学生 / 学习者：寻求教育内容或资源的人
#   generalPublic    - 普通大众 / 混合受众：兴趣和背景各异的广泛受众
targetAudienceTypes:
  - developers

# 网站规模：您的网站应该有多少个页面？
# 可用选项（根据需要取消注释并修改）：
#   singlePage      - 单页（仅 1 页）：所有内容合并到 1 个页面中
#   minimal         - 最小规模（2-6 页）：仅包含核心页面 - 快速上线
#   standard        - 标准规模（7-12 页）：包含主要部分的完整网站 [推荐]
#   comprehensive   - 全面规模（12+ 页）：功能齐全、章节详细的网站
#   aiDecide        - 让 AI 决定：分析项目复杂性并建议合适的规模
websiteScale: standard

# 自定义规则：定义特定的页面生成规则和要求
rules: '保持正式和技术的语调。避免使用营销术语。专注于实用、分步的说明。'

# 词汇表：定义项目特定的术语和定义
# glossary: "@glossary.md"  # 包含词汇表定义的 Markdown 文件路径

locale: en
# translateLanguages:  # 要将页面翻译成的语言列表
#   - zh  # 示例：中文翻译
#   - en  # 示例：英文翻译

pagesDir: ./aigne-web-smith/pages  # 保存生成页面的目录
sourcesPath:  # 要分析的源代码路径
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # 每个页面都包含的默认数据源
  - ./media.md
# minImageWidth: 只有宽度大于此值（以像素为单位）的图片才会在页面生成中使用
media:
  minImageWidth: 800
```

## 总结

通过将 `generate` 命令与定义明确的 `config.yaml` 文件相结合，您可以高效地生成一个完全符合您具体规格的完整网站。此过程自动化了网站结构和内容创建的繁重工作，让您能够专注于提供高质量的源材料。

生成您的网站后，下一步是将其发布到线上。

进一步阅读：
*   [发布网站](./guides-publish-website.md)