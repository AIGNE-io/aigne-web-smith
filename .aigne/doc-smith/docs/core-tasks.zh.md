# 核心任务

完成初始设置并生成您的第一个网站后，您将主要使用一组核心命令进行日常操作。本节将对这些基本任务进行实践性概述，例如生成网站、发布更新、优化内容和管理翻译。

每项任务都被设计为一个简单的命令行操作。典型的工作流程包括生成初始网站，迭代地更新其内容或结构，然后发布变更。

### 标准工作流程

下图说明了使用 WebSmith 创建和维护网站的标准顺序工作流程。

```d2
direction: down

config: {
  label: "1. 定义需求\n（例如，my-website.yaml）"
  shape: rectangle
}

generate: {
  label: "2. 生成网站\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. 优化内容\n`aigne web update`"
  shape: rectangle
}

publish: {
  label: "4. 发布网站\n`aigne web publish`"
  shape: rectangle
}

live_site: {
  label: "线上网站"
  shape: cylinder
}

config -> generate: "初始创建"
generate -> update: "审查与优化"
update -> update: "迭代变更"
update -> publish: "部署变更"
publish -> live_site: "上线"
```

下面您将找到每个核心任务的详细指南。

<x-cards data-columns="2">
  <x-card data-title="生成网站" data-icon="lucide:bot" data-href="/core-tasks/generating-a-website">
    学习如何使用 `generate` 命令从一个概述您需求的配置文件中创建一个完整的网站。
  </x-card>
  <x-card data-title="发布您的网站" data-icon="lucide:upload-cloud" data-href="/core-tasks/publishing-your-website">
    探索发布您网站的不同选项，从免费的 WebSmith Cloud 到您自己的自定义域名。
  </x-card>
  <x-card data-title="更新网站内容" data-icon="lucide:file-pen-line" data-href="/core-tasks/updating-website-content">
    了解如何使用 `update` 命令进行更改或提供反馈，以优化您现有页面上的内容。
  </x-card>
  <x-card data-title="翻译您的内容" data-icon="lucide:languages" data-href="/core-tasks/translating-your-content">
    使用 `translate` 命令自动创建您网站页面的不同语言版本。
  </x-card>
  <x-card data-title="管理主题" data-icon="lucide:palette" data-href="/core-tasks/managing-themes">
    介绍如何使用 `theme` 命令为您的网站生成并应用不同的视觉风格和配色方案。
  </x-card>
  <x-card data-title="管理组件" data-icon="lucide:cubes" data-href="/core-tasks/managing-components">
    解释如何使用 `component` 命令拉取和更新用于构建您网站的组件库。
  </x-card>
  <x-card data-title="使用交互式聊天" data-icon="lucide:message-square-plus" data-href="/core-tasks/using-the-interactive-chat">
    学习如何使用 `chat` 命令以对话方式交互式地构建和修改您的网站。
  </x-card>
  <x-card data-title="管理偏好设置" data-icon="lucide:settings-2" data-href="/core-tasks/managing-preferences">
    解释如何使用 `prefs` 命令查看、管理和清除已保存的用户偏好设置，以自定义 WebSmith 的行为。
  </x-card>
  <x-card data-title="查看更新历史" data-icon="lucide:history" data-href="/core-tasks/viewing-update-history">
    学习如何使用 `history` 命令查看对您网站内容和结构所做的所有先前更新的日志。
  </x-card>
  <x-card data-title="清理工作区和数据" data-icon="lucide:trash-2" data-href="/core-tasks/clearing-generated-content">
    向您展示如何使用 `clear` 命令安全地移除生成的文件、工作区数据或整个配置。
  </x-card>
</x-cards>

---

本节涵盖了管理您网站的基本命令。有关所有可用命令及其参数的完整列表，请查阅[命令行参考](./reference-command-line-reference.md)。