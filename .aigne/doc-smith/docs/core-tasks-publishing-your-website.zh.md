# 发布您的网站

一旦您的网站生成，下一步就是让它在互联网上可访问。这个过程被称为发布。AIGNE WebSmith 通过提供一个单一命令 `aigne web publish` 来简化这项任务，该命令提供了多种目标选项以满足不同需求，从快速的免费托管到专业的自定义域名。

本节概述了可用的发布选项。每个选项都在其各自的指南中有详细说明，以提供清晰、分步的指导。

### 发布选项

WebSmith 提供了三种主要方法来发布您的网站。请选择最符合您项目需求的方法。

<x-cards data-columns="3">
  <x-card data-title="发布到 WebSmith Cloud" data-icon="lucide:cloud" data-href="/core-tasks/publishing-your-website/cloud">
    让您的网站上线的快捷方式。使用我们免费的公共托管服务。此选项非常适合测试、开源项目或社区共享。
  </x-card>
  <x-card data-title="发布到您自己的网站" data-icon="lucide:server" data-href="/core-tasks/publishing-your-website/custom">
    适用于已在 ArcBlock 平台上构建网站的用户。本指南介绍了如何将新生成的页面集成并发布到您现有的基础架构中。
  </x-card>
  <x-card data-title="发布到新的专用网站" data-icon="lucide:globe" data-href="/core-tasks/publishing-your-website/new-dedicated-website">
    一项付费服务，可创建一个具有自定义域名和托管功能的全新专用网站。这是专业和商业用途的推荐选择。
  </x-card>
</x-cards>

### 发布流程

发布过程由 `aigne web publish` 命令处理。当您首次在没有任何先前配置的情况下运行此命令时，WebSmith 将启动一个交互式提示，引导您选择上述选项之一。

一般工作流程如下：

```d2
direction: down

user: {
  shape: c4-person
  label: "用户"
}

cli: {
  label: "AIGNE CLI"
}

interactive-prompt: {
  label: "交互式提示"
  shape: diamond
}

websmith-cloud: {
  label: "WebSmith Cloud"
  shape: cylinder
}

existing-website: {
  label: "现有网站"
  shape: cylinder
}

new-website: {
  label: "新的专用网站"
  shape: cylinder
}

user -> cli: "运行 `aigne web publish`"
cli -> interactive-prompt: "是否已配置发布目标？"

interactive-prompt -> websmith-cloud: "否 -> 选择 'WebSmith Cloud'"
interactive-prompt -> existing-website: "否 -> 选择 '现有网站'"
interactive-prompt -> new-website: "否 -> 选择 '新网站'"
interactive-prompt -> existing-website: "是"
```

### 开始使用

要开始，只需在您的终端中运行发布命令即可。

```bash
aigne web publish
```

如果这是您第一次发布，系统将提示您选择一个目标。有关每个选项的详细说明，请参阅上面链接的具体指南。

### 摘要

WebSmith 提供了一个灵活的发布系统，以适应各种部署场景。您可以从免费的云托管开始，之后随着需求的演变，再过渡到自定义或专用网站。

要继续，请从上述选项中选择一个发布指南。我们建议从 [发布到 WebSmith Cloud](./core-tasks-publishing-your-website-cloud.md) 开始，以进行快速、直接的初始部署。