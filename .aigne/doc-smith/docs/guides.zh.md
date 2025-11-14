# 指南

完成初始设置并生成您的第一个网站后，日常操作将主要使用一套指南。本中心总结了最常见的工作流程——生成、发布、完善内容、本地化和调整样式——因此您可以直接跳到您需要的任务。

每个任务都被设计成一个直接的命令行操作。典型的工作流程包括生成初始站点，迭代更新其内容或结构，然后发布更改。

### 标准工作流程

下图展示了使用 WebSmith 创建和维护网站的标准顺序工作流程。

```d2
direction: down

config: {
  label: "1. 定义需求\n（例如，my-website.yaml）"
  shape: rectangle
}

generate: {
  label: "2. 创建网站\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. 完善内容\n`aigne web update`"
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

config -> generate: "初次创建"
generate -> update: "审查与完善"
update -> update: "迭代更改"
update -> publish: "部署更改"
publish -> live_site: "上线"
```

您将在下面找到每个工作流程的详细指南。

<x-cards data-columns="2">
  <x-card data-title="创建网站" data-icon="lucide:bot" data-href="/guides/create-website">
    了解如何使用 `generate` 命令从一个概述您需求的配置文件中创建一个完整的网站。
  </x-card>
  <x-card data-title="发布网站" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    探索发布网站的不同选项，从免费的 WebSmith Cloud 到您自己的自定义域名。
  </x-card>
  <x-card data-title="更新网站" data-icon="lucide:file-pen-line" data-href="/guides-update-website">
    了解何时应更新网站结构而不是单个页面，然后跳转到每个工作流程的详细指南。
  </x-card>
  <x-card data-title="本地化网站" data-icon="lucide:languages" data-href="/guides/localize-website">
    使用 `translate` 命令自动创建您网站页面的不同语言版本。
  </x-card>
  <x-card data-title="自定义主题" data-icon="lucide:palette" data-href="/guides/customize-theme">
    介绍如何使用 `theme` 命令来生成和应用不同的视觉风格和配色方案到您的网站。
  </x-card>
  <x-card data-title="使用自定义组件库" data-icon="lucide:cubes" data-href="/advanced-features/use-custom-component-libraries">
    解释如何使用 `component` 命令来拉取和更新用于构建您网站的组件库。
  </x-card>
  <x-card data-title="互动模式" data-icon="lucide:message-square-plus" data-href="/guides/interactive-mode">
    学习如何使用 `chat` 命令以对话方式交互式地构建和修改您的网站。
  </x-card>
  <x-card data-title="管理偏好设置" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    解释如何使用 `prefs` 命令查看、管理和清除已保存的用户偏好设置，以自定义 WebSmith 的行为。
  </x-card>
  <x-card data-title="管理更新历史" data-icon="lucide:history" data-href="/guides/update-website/manage-update-history">
    学习如何使用 `history` 命令来审查更新过程中记录的所有变更。
  </x-card>
  <x-card data-title="清理工作区" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    向您展示如何使用 `clear` 命令安全地移除生成的文件、工作区数据或整个配置。
  </x-card>
</x-cards>

---

本节涵盖了管理您网站的基本命令。有关所有可用命令及其参数的完整列表，请参阅[命令参考](./reference-command.md)。
