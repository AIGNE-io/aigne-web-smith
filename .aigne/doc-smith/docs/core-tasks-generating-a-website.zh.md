# 生成网站

`aigne web generate` 命令是创建新网站的核心功能。它使用一个由 AI 驱动的流程来解释您的需求，规划网站结构，并生成所有必要的内容和模板文件。整个过程由一个配置文件指导，您在该文件中定义网站的目标和规格。

本指南将系统地概述 `generate` 命令，并详细分解配置文件的参数。有关动手实践的教程，请参阅 [你的第一个网站](./getting-started-your-first-website.md)。

## `generate` 命令

生成过程通过 `generate` 命令启动。其主要目的是读取您的配置，与 AI agents 交互，并在您的本地工作区中构建网站文件。

**用法**

```bash Command Line icon=lucide:terminal
aigne web generate
```

**别名**

为方便起见，您也可以使用更短的别名 `gen` 或 `g`。

```bash Command Line icon=lucide:terminal
# 这些命令等同于 'aigne web generate'
aigne web gen
aigne web g
```

通常，您会使用输入文件将需求传递给命令。这可以通过 `--input` 标志，后跟 `@` 符号和配置文件路径来完成。

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-website.yaml
```

## 网站配置文件

要生成网站，您必须提供一个 YAML 格式的配置文件。该文件作为蓝图，定义了网站的目的、目标受众、风格和内容要求。AI 使用这些信息来对网站的结构、基调和功能做出明智的决策。

您的配置文件可以使用以下参数：

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>关于您想创建的网站的详细描述。这是最关键的参数。您应该提供一套清晰、结构化的指令，包括所需的页面类型（例如，主页、定价、关于我们）、需要突出的关键功能，以及任何关于风格或内容的具体要求。规则越精确，AI 就能更好地根据您的需求定制网站。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>对网站目标受众的描述。例如，`小型企业主`、`软件开发者`或`潜在投资者`。这有助于 AI 适当地调整内容的语言、基调和复杂性。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>网站内容的主要语言。目前支持的值为 `en`（英语）和 `zh`（中文）。默认值为 `zh`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>定义网站的整体美学和基调。例如，`商业`、`创意`、`简约`或`科技`。这会影响 AI 在布局、图像和写作风格方面的选择。</x-field-desc>
  </x-field>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>应在整个网站中一致使用的特定术语、产品名称或行话的列表。这能确保术语的准确性。您可以将其作为字符串提供，或使用 `@<file-path>` 语法从文件中加载。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>如果设置为 `true`，该命令将从头开始重新生成所有页面，忽略先前生成中任何已存在的文件。当您希望完全重新开始时，此选项非常有用。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>来自您的 Pages Kit 实例的项目 ID。虽然生成时非必需，但在此处提供它可以简化后续的发布流程。更多详情请参阅 [发布你的网站](./core-tasks-publishing-your-website.md)。</x-field-desc>
  </x-field>
</x-field-group>

## 分步示例

以下是生成网站的一个实用、分步的过程。

### 第 1 步：创建配置文件

首先，创建一个新的 YAML 文件来定义您的网站。在本例中，我们将其命名为 `my-saas-website.yaml`。

```yaml my-saas-website.yaml icon=lucide:file-text
rules: |
  创建一个现代化的 SaaS 产品网站，包括：
  1. 一个带有产品介绍和核心功能的主页。
  2. 一个包含不同计划比较表的定价页面。
  3. 一个用于客户成功案例和推荐语的页面。
  4. 一个专门用于技术文档的门户。
  5. 一个包含支持表单和联系方式的联系页面。

  要求：
  - 风格应专业且面向商业。
  - 内容必须突出产品的优势和独特卖点。
  - 包含清晰的行动号召（CTA）按钮，以引导用户进行免费试用。

targetAudience: 中小型企业（SMB）所有者和技术决策者。
locale: en
websiteStyle: business
```

### 第 2 步：运行 `generate` 命令

配置文件保存后，打开您的终端并运行 `generate` 命令，使用 `--input` 标志指向您的文件。

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-saas-website.yaml
```

AI 现在将开始生成过程。它会分析您的规则，规划网站结构，然后为每个页面创建内容。您将在终端中看到进度更新。此过程可能需要几分钟，具体取决于页面数量和需求的复杂性。

### 第 3 步：审查生成的文件

命令完成后，生成的网站文件将保存在您项目的本地工作区中。您现在可以检查这些文件，查看 AI 创建的结构和内容。

## 总结

`generate` 命令是一个强大的工具，它能将一组简单的基于文本的需求转换为一个功能完备的网站。成功结果的关键在于您的 YAML 配置文件中有一个清晰且详细的 `rules` 定义。

生成网站后，合乎逻辑的下一步是发布它。要了解如何操作，请继续下一节。

- **下一步**：[发布你的网站](./core-tasks-publishing-your-website.md)