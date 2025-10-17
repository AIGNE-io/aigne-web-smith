# 管理主题

网站的视觉主题——其颜色、字体和整体风格——对其身份认同起着至关重要的作用。AIGNE WebSmith 提供了一个 `theme` 命令，用于系统地管理您网站的美学方面。这使您能够通过 AI 生成新的设计概念，并用一个命令来应用它们。

`theme` 命令分为两个主要子命令：
*   **`generate`**: 根据您的输入创建一个新主题并将其保存在本地。
*   **`apply`**: 将本地主题上传到您的网站，更新其实时外观。

本指南将按逻辑顺序介绍此过程，从主题生成开始，然后到主题应用。

## 生成新主题

`theme generate` 命令会启动一个由 AI 驱动的流程，以创建完整的主题配置。AI 将引导您选择一个名称并定义新主题的视觉特征。生成的配置将作为 `.yaml` 文件保存在本地的 `themes` 目录中，以备后用。

### 流程

1.  **启动生成**：在您的终端中运行 `aigne web theme generate`。
2.  **AI 驱动的设计**：与 AI 进行对话以定义您的主题。系统会询问您主题名称以及您对颜色、排版和整体氛围的偏好。
3.  **本地保存**：设计完成后，主题配置将作为 `.yaml` 文件保存在您项目的本地 `themes` 目录中。

### 用法

要开始生成新主题，请运行以下命令：

```sh
aigne web theme generate
```
*别名：`aigne web theme gen`*

按照屏幕上的提示完成主题创建过程。

## 应用主题

在生成一个或多个主题后，`theme apply` 命令允许您选择一个已保存的主题并将其应用到您的网站。此命令会读取您本地的主题文件，将它们以列表形式呈现，并在您确认后，将选定的主题上传到您的网站，使更改生效。

### 流程

1.  **运行命令**：在您的终端中执行 `aigne web theme apply`。
2.  **选择主题**：该工具会扫描 `themes` 目录并显示您已生成的所有可用主题的列表。该列表包含主题名称、主色和字体等详细信息，以帮助您进行选择。
3.  **审查和确认**：系统将显示目标网站 URL、当前活动主题以及您选择的新主题。在进行任何更改之前，系统会要求您进行最终确认。
4.  **应用到网站**：一旦确认，主题将被上传并应用到您的网站。一条成功消息将表明该过程已完成。

### 用法

要应用现有主题，请使用以下命令。

```sh
aigne web theme apply
```

您也可以直接将网站 URL 指定为参数。如果省略，将使用您 `config.yaml` 文件中的 `appUrl`。

```sh
aigne web theme apply --appUrl https://your-website.com
```

### 参数

`apply` 命令接受以下参数：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您的网站的完整 URL。如果您不提供此参数，该命令将使用您 `config.yaml` 配置文件中定义的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的配置文件的位置。默认为标准的 `config.yaml` 路径。</x-field-desc>
  </x-field>
</x-field-group>

---

通过遵循这些步骤，您可以有效地管理您网站的视觉形象。更新主题后的下一步，您可能需要查看如何[发布您的网站](./core-tasks-publishing-your-website.md)。