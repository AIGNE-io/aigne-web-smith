# 指南

需要管理您的日常网站运营吗？本节提供了常见操作的分步指南，例如创建网站、发布更新、管理翻译以及自定义外观和风格。遵循这些教程，让您的网站平稳运行。

下图说明了使用这些命令管理网站的典型生命周期：
```d2
direction: down

User: {
  shape: c4-person
}

Local-Workspace: {
  label: "本地工作区"
  shape: rectangle
  style.stroke-dash: 4

  websmith-create: {
    label: "1. websmith create"
  }

  Development-Cycle: {
    label: "2. 开发周期（迭代）"
    shape: rectangle
    websmith-update: {
      label: "websmith update"
    }
    websmith-theme: {
      label: "websmith theme"
    }
    websmith-translate: {
      label: "websmith translate"
    }
  }

  websmith-publish: {
    label: "3. websmith publish"
  }
}

WebSmith-Cloud: {
  label: "WebSmith 云"
  shape: cylinder
}

User -> Local-Workspace.websmith-create: "初始化网站"
Local-Workspace.websmith-create -> Local-Workspace.Development-Cycle
Local-Workspace.Development-Cycle -> Local-Workspace.websmith-publish: "最终确定变更"
Local-Workspace.websmith-publish -> WebSmith-Cloud: "部署网站"

```

<x-cards data-columns="2">
  <x-card data-title="创建网站" data-icon="lucide:plus-square" data-href="/guides/create-website">
    分解创建工作流程，包括配置字段、提示以及在发布前验证输出的方法。
  </x-card>
  <x-card data-title="更新网站" data-icon="lucide:file-pen-line" data-href="/guides/update-website">
    了解如何使用“update”命令进行更改或提供反馈，以优化您现有页面的内容。
  </x-card>
  <x-card data-title="发布网站" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    解释每个发布目标，从 WebSmith 云到完全自定义的基础设施，并提供先决条件和验证技巧。
  </x-card>
  <x-card data-title="本地化网站" data-icon="lucide:languages" data-href="/guides/localize-website">
    解释如何使用“translate”命令自动创建您网站页面的不同语言版本。
  </x-card>
  <x-card data-title="自定义主题" data-icon="lucide:palette" data-href="/guides/customize-theme">
    介绍如何使用“theme”命令为您的网站生成并应用不同的视觉样式和配色方案。
  </x-card>
  <x-card data-title="管理偏好设置" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    解释如何使用“prefs”命令查看、管理和清除已保存的用户偏好设置，以自定义 WebSmith 的行为。
  </x-card>
  <x-card data-title="清理工作区" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    向您展示如何使用“clear”命令安全地移除生成的文件、工作区数据或整个配置。
  </x-card>
  <x-card data-title="交互模式 (Beta)" data-icon="lucide:bot" data-href="/guides/interactive-mode">
    使用交互模式作为对话式副驾驶，迭代地规划、编辑和完善您的网站。
  </x-card>
</x-cards>

## 总结

这些指南涵盖了管理您网站生命周期的基本命令。有关更高级的主题和完整的命令列表，请参阅[高级功能](./advanced-features.md)和[参考](./reference.md)部分。