# 管理组件

由 AIGNE WebSmith 生成的网站由一系列预先设计的可视化元素（称为组件）构成。这些组件是您页面的构建块，例如首屏区域、功能列表、价格表和常见问题手风琴。`component` 命令允许您管理和更新此组件库，以确保您的网站能够使用最新的设计和功能。

本节将说明如何使用 `component pull` 命令，将本地组件库与您的 Pages Kit 项目中定义的组件库进行同步。

## 组件库概述

组件库是标准化、可重用页面元素的集合。当您生成网站时，WebSmith 会从此库中选择并配置最合适的组件来构建您的页面。

保持此库的更新非常重要，主要有两个原因：
1.  **访问新设计**：当新的可视化组件被设计并添加到您的 Pages Kit 项目中时，将它们拉取到您的本地库中，即可供 AI 使用。
2.  **错误修复和改进**：更新可能包含对现有组件的改进或修复，从而提升您网站的质量和外观。

## 拉取和更新组件

`aigne web component pull` 命令从您的 Pages Kit 项目提供的特定 URL 中获取最新版本的组件库。

### 命令语法

要拉取最新的组件，请使用以下命令结构：

```bash
aigne web component pull --url <your_component_pull_url>
```

您也可以使用别名 `comp`：

```bash
aigne web comp pull --url <your_component_pull_url>
```

### 参数

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>用于从您的 Pages Kit 项目中拉取组件的唯一 URL。此 URL 包含必要的项目 ID 和安全凭证。您通常可以在 Pages Kit 的项目设置页面中找到此 URL。</x-field-desc>
  </x-field>
</x-field-group>

### 更新流程

更新组件库是一个直接但重要的过程。请仔细遵循以下步骤。

#### 第 1 步：运行拉取命令

使用您的 Pages Kit 项目提供的特定 URL 执行该命令。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

该工具将连接到该 URL 并下载最新的组件库定义。

#### 第 2 步：审查变更

成功下载后，WebSmith 将显示变更摘要。它会显示您现有库与新库之间的比较，详细说明“原子”（基础）组件和“复合”（复杂）组件的数量。

输出示例如下：

```
✅ 组件拉取成功（尚未保存）！
📊 新组件统计：
  🔹 原子组件：10 (9 → 10)
    • LogoV1 - 用于显示标题和徽标列表的组件...
    • RichText - RichText 组件主要显示标题...
    • NewFeatureCard - 全新的功能卡片...
  🧩 复合组件：22 (22 → 22)
    • Logo Wall - 结构 - 可选的区域标题...
    • User Review - 结构 (从上到下) - 评论内容/引言...
```

该摘要可让您在应用更改前验证即将发生的变化。

#### 第 3 步：确认更新

在对您的本地文件进行任何永久性更改之前，WebSmith 会提示您进行确认。

```
是否要更新（保存）内置组件文件？(y/N)
```

-   按 `y` 和 `Enter` 继续更新。
-   按 `n` 或 `Enter` 取消操作。不会进行任何更改。

#### 第 4 步：重新生成您的网站

如果您确认更新，WebSmith 将执行两个关键操作：

1.  **保存新库**：它会用新版本覆盖您的本地 `builtin-component-library.yaml` 文件。
2.  **清除生成的内容**：为确保您的网站能用新组件正确重建，它将**删除所有先前生成的页面文件**，包括工作区和输出目录中的文件。

该过程完成后，您将看到一条确认消息和下一步的提醒。

```
💾 新组件已保存。
🧹 已清除先前生成的内容。
🚀 下一步：请运行以下命令重新生成页面：

  `aigne web generate`
```

您现在必须运行 `generate` 命令，以使用更新后的组件库创建您的网站页面。

## 总结

`component pull` 命令是保持您网站的可视化构建块与中央 Pages Kit 存储库同步的标准流程。该过程涉及拉取最新的库、审查更改、确认更新，最后重新生成您的网站以应用新组件。

有关创建页面的更多信息，请继续阅读[生成网站](./core-tasks-generating-a-website.md)部分。