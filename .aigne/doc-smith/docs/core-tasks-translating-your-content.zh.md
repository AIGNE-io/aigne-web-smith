# 翻译您的内容

AIGNE WebSmith 提供了一种强大而简单的方法，可以自动将您的网站内容翻译成多种语言，让您能以最小的精力触达全球受众。`translate` 命令使用 AI 为您现有的页面生成高质量的翻译。

本文档将指导您完成内容翻译的整个过程，从基本的交互式用法到使用命令行参数的更高级选项。

## 翻译工作原理

翻译流程旨在做到简单高效。当您运行 `translate` 命令时，WebSmith 会执行以下步骤：

1.  **识别源内容**：它会加载您现有的网站结构和内容，并根据您的配置确定主语言。
2.  **选择页面**：您可以指定要翻译的页面。如果您不指定，它将提供一个包含所有可用页面的交互式列表供您选择。
3.  **选择目标语言**：您可以提供一个目标语言列表。如果您不提供，它将显示一个支持的语言列表供您选择。
4.  **生成译文**：AI 会处理每个选定页面的内容，并为每种选定的语言生成翻译版本。它可以使用可选的术语表来确保术语的一致性。
5.  **保存翻译文件**：新翻译的页面会被保存到特定语言的目录中，以便您审阅和发布。

## 基本用法

最直接的方法是不带任何参数运行该命令。WebSmith 将通过交互式提示引导您完成整个过程。

在您的终端中运行以下命令：

```bash title="交互式翻译" icon=lucide:terminal
aigne web translate
```

系统将提示您：
1.  选择您希望翻译的页面（使用空格键选择，按回车键确认）。
2.  从支持的选项列表中选择目标语言。

完成选择后，AI 将开始翻译过程。

## 命令参数

为了实现更精细的控制以及在自动化脚本中使用，您可以使用以下命令行参数。

<x-field-group>
  <x-field data-name="--pages" data-type="array" data-required="false">
    <x-field-desc markdown>一个包含要翻译的页面路径的数组。如果省略，系统将提示您以交互方式选择页面。例如：`--pages /about /contact`</x-field-desc>
  </x-field>
  <x-field data-name="--langs" data-type="array" data-required="false">
    <x-field-desc markdown>一个包含目标语言代码的数组。如果省略，系统将提示您以交互方式选择语言。有关支持的语言完整列表，请参见下表。</x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string" data-required="false">
    <x-field-desc markdown>一个包含特定术语的术语表，以确保翻译过程中的术语一致性。您可以提供一个键值对字符串，或使用 `@` 前缀引用文件路径（例如：`@./glossary.txt`）。</x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string" data-required="false">
    <x-field-desc markdown>向 AI 提供反馈，以优化和改进现有翻译。这对于进行修正或调整语气很有用。</x-field-desc>
  </x-field>
</x-field-group>

## 示例

### 将特定页面翻译成多种语言

此命令无需交互式提示，即可将 `/about-us` 和 `/services/main` 页面翻译成日语和法语。

```bash title="翻译特定页面" icon=lucide:terminal
aigne web translate --pages /about-us /services/main --langs ja fr
```

### 使用术语表确保术语一致性

为确保您的品牌名称“WebSmith”和术语“SaaS”在翻译成西班牙语时保持一致，您可以使用 `--glossary` 参数。

```bash title="使用内联术语表进行翻译" icon=lucide:terminal
aigne web translate --langs es --glossary "WebSmith:WebSmith AI,SaaS:Software como Servicio"
```

对于较大的术语表，使用文件会更实用。创建一个名为 `glossary.txt` 的文件并包含您的术语，然后引用它。

```bash title="使用术语表文件进行翻译" icon=lucide:terminal
aigne web translate --langs de --glossary @./glossary.txt
```

## 支持的语言

下表列出了当前所有可用于翻译的语言。

| 语言 | 代码 |
| :--- | :--- |
| 英语 | `en` |
| 简体中文 | `zh` |
| 繁体中文 | `zh-TW` |
| 日语 | `ja` |
| 法语 | `fr` |
| 德语 | `de` |
| 西班牙语 | `es` |
| 意大利语 | `it` |
| 俄语 | `ru` |
| 韩语 | `ko` |
| 葡萄牙语 | `pt` |
| 阿拉伯语 | `ar` |

---

翻译完您的内容后，合乎逻辑的下一步是将其提供给您的用户。请在[发布您的网站](./core-tasks-publishing-your-website.md)部分了解如何部署您的多语言网站。