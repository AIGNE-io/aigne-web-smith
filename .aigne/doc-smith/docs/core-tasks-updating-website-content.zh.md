# 更新网站内容

在生成网站的初始版本后，您可能需要对生成的内容进行调整或优化。`update` 命令是这个迭代过程的主要工具。它允许您用自然语言提供反馈，以修改网站结构和单个页面的内容。

该命令利用 AI 理解您的请求并将其直接应用于网站文件，从而简化了编辑过程。无论您是需要添加新页面、重组版块，还是仅仅重述标题，`update` 命令都提供了一种交互式的方式来进行这些更改，而无需手动编辑配置文件。

本节概述了更新过程。有关详细的分步说明，请参阅每种更新类型的具体指南：

<x-cards data-columns="2">
  <x-card data-title="更新网站结构" data-icon="lucide:layout-list" data-href="/core-tasks/updating-website-content/updating-website-structure">
    了解如何添加、删除、重命名或重组网站页面。
  </x-card>
  <x-card data-title="更新页面内容" data-icon="lucide:file-text" data-href="/core-tasks/updating-website-content/updating-page-content">
    了解如何修改特定页面内的文本、版块和其他元素。
  </x-card>
</x-cards>

## 更新工作流

更新过程被设计为交互式且直观的。以下是典型工作流的摘要：

1.  **启动命令**：在您的项目目录中，从终端运行 `aigne web update` 命令。
2.  **选择页面**：该工具将显示您现有网站页面的列表。系统将提示您选择要修改的特定页面。
3.  **提供反馈**：选择页面后，系统会要求您提供反馈。您可以在这里用自然语言描述您想做的更改。例如，您可以说，“将第一部分的标题更改为‘我们的核心价值观’”或“在页面末尾添加一个新的常见问题解答部分”。
4.  **AI 处理**：AI Agent 将分析您的反馈，并确定对页面结构或内容所需的修改。
5.  **审查并保存**：应用更改并保存更新后的页面内容。

## 基本命令用法

要开始更新过程，请导航到您项目的根目录并运行以下命令：

```bash CLI 命令 icon=lucide:terminal
aigne web update
```

此命令会启动一个交互式会话，引导您选择页面并提供反馈。

### 参数

虽然该命令主要是交互式的，但您可以使用参数来简化流程。

<x-field-group>
  <x-field data-name="feedback" data-type="string" data-required="false">
    <x-field-desc markdown>直接以命令行参数的形式提供反馈，以跳过交互式反馈提示。例如：`aigne web update --feedback "Change the main title"`。</x-field-desc>
  </x-field>
  <x-field data-name="pages" data-type="array" data-required="false">
    <x-field-desc markdown>指定一个或多个要更新的页面路径。这对于将相同的反馈应用于多个页面或非交互式地针对特定页面非常有用。</x-field-desc>
  </x-field>
</x-field-group>

## 总结

`update` 命令是一个灵活的工具，用于在网站初次创建后对其进行优化和改进。通过使用自然语言反馈，您可以高效地修改整个网站结构和每个页面的详细内容。

有关更详细的说明和示例，请继续阅读相关子章节：

*   **下一步**：了解如何[更新网站结构](./core-tasks-updating-website-content-updating-website-structure.md)或[更新页面内容](./core-tasks-updating-website-content-updating-page-content.md)。
*   **相关阅读**：进行更新后，您可能希望通过[查看更新历史](./core-tasks-viewing-update-history.md)来回顾您的更改。