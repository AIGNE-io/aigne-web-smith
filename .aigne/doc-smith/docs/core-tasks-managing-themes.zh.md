# 管理主题

您网站的视觉主题——其颜色、字体和整体风格——对其身份认同至关重要。AIGNE WebSmith 提供了一个 `theme` 命令，用于系统地管理您网站的美学方面。这使您能够通过 AI 生成新的设计概念，并用一条命令应用它们。

`theme` 命令分为两个主要子命令：
*   **`generate`**：根据您的输入创建一个新主题并将其保存在本地。
*   **`apply`**：将本地主题上传到您的网站，更新其线上外观。

本指南将按逻辑顺序介绍此过程，从主题生成开始，然后讲解如何应用主题。

## 生成新主题

`theme generate` 命令会启动一个由 AI 驱动的流程来创建一个完整的主题配置。AI 将引导您选择一个名称并定义新主题的视觉特征。生成的配置将作为一个 `.yaml` 文件保存在本地的 `themes` 目录中，以备后用。

### 流程

1.  **运行命令**：在您的终端中执行 `aigne theme generate`。
2.  **命名您的主题**：首先，系统会提示您为主题提供一个唯一的名称。该名称将用于以后识别它。
3.  **AI 驱动的设计**：然后，AI 会提出问题，以了解您对颜色、排版和风格的设计偏好。
4.  **本地保存**：设计过程完成后，主题会自动保存到项目 `themes` 文件夹下的一个文件中（例如，`my-new-theme.yaml`）。

### 用法

要开始生成新主题，请运行以下命令：

```sh
aigne theme generate
```
*别名：`aigne theme gen`*

按照屏幕上的提示完成主题创建过程。

## 应用主题

生成一个或多个主题后，您可以使用 `theme apply` 命令选择一个已保存的主题并将其应用到您的网站。该命令会读取您本地的主题文件，以列表形式呈现它们，并在您确认后将所选主题上传到您的网站，使更改立即生效。

### 流程

1.  **运行命令**：在您的终端中执行 `aigne theme apply`。
2.  **选择主题**：该工具会扫描 `themes` 目录，并显示您已生成的所有可用主题的列表。该列表包含主题名称、主色调和字体等详细信息，以帮助您进行选择。
3.  **确认目标**：系统将显示目标网站的 URL、当前活动的主题（如果有）以及您选择的新主题。
4.  **最终确认**：在进行任何更改之前，系统会要求您进行最终确认。这是一项安全措施，以防止意外覆盖。
5.  **应用到网站**：一旦确认，主题将被上传并应用到您的网站。一条成功消息将表明该过程已完成。

### 用法

要应用现有主题，请使用以下命令。

```sh
aigne theme apply
```

您也可以直接将网站 URL 指定为参数。如果省略，将使用您 `aigne.config.yaml` 文件中的 `appUrl`。

```sh
aigne theme apply --appUrl https://your-website.com
```

### 参数

`apply` 命令接受以下参数：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您网站的完整 URL。如果您不提供此项，该命令将使用您 `aigne.config.yaml` 配置文件中定义的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的配置文件的位置。默认为标准的 `aigne.config.yaml` 路径。</x-field-desc>
  </x-field>
</x-field-group>

---

通过遵循这些步骤，您可以有效地管理您网站的视觉形象。更新主题后的下一步，您可能需要查看如何[发布您的网站](./core-tasks-publishing-your-website.md)。