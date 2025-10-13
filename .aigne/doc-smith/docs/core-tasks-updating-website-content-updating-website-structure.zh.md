# 更新网站结构

网站的结构，通常被称为其信息架构，是指网站页面的排列和组织方式。一个逻辑清晰的结构对于用户导航和理解至关重要。AIGNE WebSmith 提供了一个简单的流程，通过添加、删除、更新或重组页面来修改您的网站结构。

这些结构性修改不是通过单个命令执行的。相反，您需要向 `update` 命令提供清晰、自然的语言反馈。AI 会解释您的指令并对网站计划应用必要的更改。本文档概述了可用于构建网站的具体操作。

有关修改页面内容的详细信息，请参阅[更新页面内容](./core-tasks-updating-website-content-updating-page-content.md)指南。

## 更新流程

修改您的网站结构涉及一个交互式会话，您需要在其中描述期望的更改。系统会使用一套专门的工具，根据您的输入来执行这些更改。

一般工作流程如下：
1.  在您的终端中运行 `aigne update` 命令。
2.  系统将提示您提供反馈。
3.  清晰地描述您希望进行的结构性更改（例如，“添加一个名为‘博客’的新页面”，“将‘招贤纳士’页面移动到‘关于我们’下”）。
4.  AI 将分析您的请求，执行必要的操作，并呈现更新后的结构供您审查和确认。

## 核心结构操作

AI 可以执行四种基本操作来改变您的网站结构。了解这些操作将帮助您提供更有效的反馈。

### 添加页面

此操作会在您的网站结构中创建一个新页面。要添加页面，您需要提供其基本属性。

**反馈示例：** `"添加一个标题为“我们的服务”、路径为“/services”的新页面。它应该是一个顶级页面。"`

创建新页面时使用以下参数：

<x-field-group>
  <x-field data-name="title" data-type="string" data-required="true">
    <x-field-desc markdown>新页面的标题，将显示在导航和标题中。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="true">
    <x-field-desc markdown>对页面用途和内容的简要描述。</x-field-desc>
  </x-field>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>页面的唯一 URL 路径。必须以 `/` 开头（例如，`/about-us`）。</x-field-desc>
  </x-field>
  <x-field data-name="parentId" data-type="string" data-required="false">
    <x-field-desc markdown>父页面的路径。如果新页面是子页面，请在此处提供父页面的路径。对于顶级页面，此项应为 `null`。</x-field-desc>
  </x-field>
</x-field-group>

### 更新页面

此操作可修改现有页面的元数据，例如其标题或描述。您必须指定要更改的页面的路径。

**反馈示例：** `"将路径为“/about”的页面标题更新为“关于我们公司”。"`

更新现有页面时使用以下参数：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>要更新的页面的 URL 路径。这用于识别正确的页面。</x-field-desc>
  </x-field>
  <x-field data-name="title" data-type="string" data-required="false">
    <x-field-desc markdown>页面的新标题。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="false">
    <x-field-desc markdown>页面的新描述。</x-field-desc>
  </x-field>
</x-field-group>

### 移动页面

此操作可更改页面在网站层级结构中的位置。您可以将页面移动到不同的父页面下，或更改其 URL 路径。这对于重组内容非常有用。

**反馈示例：** `"将页面“/team”移动到“/about”下，使其成为其子页面。其新路径应为“/about/team”。"`

移动页面时使用以下参数：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>您要移动的页面的当前 URL 路径。</x-field-desc>
  </x-field>
  <x-field data-name="newParentId" data-type="string" data-required="false">
    <x-field-desc markdown>新父页面的路径。要使其成为顶级页面，请省略此项或将其设置为 `null`。</x-field-desc>
  </x-field>
  <x-field data-name="newPath" data-type="string" data-required="true">
    <x-field-desc markdown>页面的新 URL 路径。通常做法是更新路径以反映新的层级结构（例如，将页面移动到 `/about` 下应产生类似 `/about/newpage` 的路径）。</x-field-desc>
  </x-field>
</x-field-group>

### 删除页面

此操作会从网站结构中永久删除一个页面。

**重要提示：** 拥有子页面（sub-pages）的页面不能被直接删除。您必须先移动或删除其子页面。

**反馈示例：** `"请移除路径为“/archive/old-news”的页面。"`

删除页面时使用以下参数：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>您希望删除的页面的 URL 路径。</x-field-desc>
  </x-field>
</x-field-group>

## 总结

通过向 `update` 命令提供清晰具体的指令，您可以高效地管理您的网站结构。AI 会处理技术执行，让您能够专注于内容的逻辑组织。

在构建好页面结构之后，下一步是完善其中的信息。更多信息，请继续阅读[更新页面内容](./core-tasks-updating-website-content-updating-page-content.md)指南。