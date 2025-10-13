# 快速入门

本指南将引导您逐步完成使用 AIGNE WebSmith 生成您的第一个完整、专业的网站。整个过程设计在 30 分钟内完成，无需任何编程知识。

遵循这些说明，您将安装必要的工具，定义网站的需求，并使用单个命令自动生成所有页面和内容。

### 流程概览

从概念到上线网站的旅程包括三个主要阶段。每个阶段都是建立在前一阶段基础上的逻辑步骤，确保了平稳且可预测的结果。

```d2
direction: down

step1: {
  label: "1. 安装"
  shape: oval
}

step2: {
  label: "2. 准备内容"
  shape: oval
}

step3: {
  label: "3. 您的第一个网站"
  shape: oval
}

result: {
  label: "完整的网站"
  shape: rectangle
  style.fill: "#D5E8D4"
}

step1 -> step2: "安装 CLI 工具"
step2 -> step3: "定义您的网站目标"
step3 -> result: "一键生成"
```

### 您的新网站创建之路

首先，请按顺序阅读以下各节。每一节都包含该阶段的详细说明。

<x-cards>
  <x-card data-title="安装" data-icon="lucide:download" data-href="/getting-started/installation">
    提供清晰、分步的说明，指导您如何安装 AIGNE 命令行界面 (CLI)，这是使用 WebSmith 所需的基本工具。
  </x-card>
  <x-card data-title="准备内容" data-icon="lucide:clipboard-list" data-href="/getting-started/preparing-your-content">
    解释您应准备好的关键信息和内容构想。充分的准备有助于 AI 根据您的需求生成最佳的网站。
  </x-card>
  <x-card data-title="您的第一个网站" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
    一个实践教程，带您逐步创建一个简单的配置文件，并使用一个命令生成一个完整的多页面网站。
  </x-card>
</x-cards>

### 总结

完成本节概述的步骤后，您将成功生成一个新网站。下一步是学习如何管理、更新和发布您的网站。

有关将网站发布到云端、更新内容以及执行其他常见任务的详细指南，请继续阅读 [核心任务](./core-tasks.md) 部分。