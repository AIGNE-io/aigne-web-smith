# 概述

需要上线一个专业的网站，但没有时间编码或雇佣开发团队？AIGNE WebSmith 可将整个流程自动化，将您的产品简介转化为一个完整的多页网站，内容引人入胜、设计现代且经过 SEO 优化——所有这些只需一个命令即可完成。

AIGNE WebSmith 是一款 AI 驱动的工具，可根据您的愿景和需求自动创建专业网站。它基于 [AIGNE 框架](https://www.aigne.io/framework) 构建，并利用 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o) 组件来生成可用于生产环境的响应式网站。

该工具解决了网站创建中的常见挑战：构建耗时、需要技术专业知识，以及在多个页面间保持内容质量很困难。通过将此过程自动化，WebSmith 可帮助确保您的网站专业、一致，并在数小时内准备好上线，而非数周。

## 主要功能

AIGNE WebSmith 通过一套智能功能简化了整个网站创建过程。

<x-cards data-columns="3">
  <x-card data-title="AI 驱动生成" data-icon="lucide:brain-circuit">
    WebSmith 使用 AI 智能规划您的网站结构，为每个页面生成引人入胜且相关的内容，并确保从一开始就为搜索引擎进行优化。
  </x-card>
  <x-card data-title="专业模板" data-icon="lucide:layout-template">
    您的网站将使用一个包含现代化、专业设计组件的库来构建。最终的模板是完全响应式的，确保您的网站在桌面、平板电脑和移动设备上都看起来很棒。
  </x-card>
  <x-card data-title="一键发布" data-icon="lucide:rocket">
    网站生成后，只需一个命令即可发布。WebSmith 会处理整个过程，为您提供一个实时 URL，以便立即与世界分享。
  </x-card>
</x-cards>

## 核心能力

WebSmith 提供了一套全面的功能，以处理从概念到发布的完整网站生命周期。

*   **AI 驱动生成**：分析您的需求，提出一个逻辑合理的网站结构，并生成能够有效向目标受众传达您信息的内容。
*   **多语言支持**：将您的网站翻译成 12 种语言，包括英语、中文（简体）和日语。翻译过程具有上下文感知能力，以保持品牌语调和技术准确性。
*   **与 LLM 集成**：可连接各种大型语言模型（LLM）。默认情况下，它使用 [AIGNE Hub](https://www.aigne.io/hub)，该服务允许您在 Google Gemini 和 OpenAI GPT 等模型之间切换，而无需单独的 API 密钥。您也可以配置自己的 API 密钥以直接访问提供商。
*   **使用 Pages Kit 进行专业设计**：使用 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o) 生成网站，这是一个包含现代化、响应式组件的库。每个部分都看起来可用于生产环境，并在桌面、平板电脑和移动设备上无缝工作。
*   **智能更新**：检测您需求中的变化，并更新网站的相应页面。您还可以提供具体反馈来优化生成的内容。
*   **发布选项**：只需一个命令即可发布您的网站。您可以部署到 WebSmith Cloud 或您自己的自定义域名，并完全控制部署配置。

## 工作原理

WebSmith 通过分析您的需求来运作，以了解您的愿景、目标受众和期望的功能。基于此分析，它会生成一套完整的网站，从导航结构到详细的页面内容和样式。

```d2
direction: down

Requirements: {
  label: "产品简介与需求"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Planning-Engine: {
    label: "规划引擎"
    shape: rectangle
  }

  Generation-Engine: {
    label: "生成引擎"
    shape: rectangle
  }

  Theme-Engine: {
    label: "主题引擎"
    shape: rectangle
  }

  LLMs: {
    label: "大型语言模型"
    shape: rectangle

    AIGNE-Hub: {
      label: "AIGNE Hub"
    }

    Direct-Access: {
      label: "直接访问"
      shape: rectangle
      Google-Gemini: {}
      OpenAI-GPT: {}
    }
  }
}

Pages-Kit: {
  label: "Pages Kit 组件"
  shape: rectangle
}

Published-Website: {
  label: "已发布的网站"
  shape: rectangle

  WebSmith-Cloud: {
    label: "WebSmith Cloud"
  }

  Custom-Domain: {
    label: "自定义域名"
  }
}

Requirements -> AIGNE-WebSmith.Planning-Engine: "分析"
AIGNE-WebSmith.Planning-Engine -> AIGNE-WebSmith.Generation-Engine: "规划"
AIGNE-WebSmith.Generation-Engine <-> AIGNE-WebSmith.LLMs: "利用"
AIGNE-WebSmith.Generation-Engine -> AIGNE-WebSmith.Theme-Engine: "生成"
AIGNE-WebSmith.Theme-Engine -> Pages-Kit: "应用"
Pages-Kit -> Published-Website: "发布"
```

1.  **描述您的网站**：您首先创建一个简单的文件，概述您的网站是关于什么的，目标受众是谁，以及您需要哪些页面。这可以是一个新的 SaaS 产品、个人作品集或技术文档中心。
2.  **通过命令生成**：您运行 `aigne web generate` 命令。AI 会分析您的需求，规划出最佳的网站结构，编写所有内容，并使用专业的设计组件组装页面。
3.  **即时发布**：准备就绪后，您运行 `aigne web publish` 命令。WebSmith 会上传所有必要的文件，并为您的新网站提供一个实时 URL。

## 可用命令

WebSmith 通过命令行界面进行操作。下表总结了主要命令及其功能。

| 命令 | 描述 |
| :--- | :--- |
| `generate` | 根据您的需求和内容简介创建一个新网站。 |
| `update` | 根据反馈或需求变化修改现有页面。 |
| `translate` | 将您的网站翻译成 12 种支持的语言中的一种或多种。 |
| `publish` | 将您的网站部署到一个可实时访问的 URL。 |
| `theme` | 生成或更新您网站的视觉主题和样式。 |
| `history` | 查看对您网站所做更新的历史记录。 |
| `chat` | 启动交互模式会话以生成和管理您的网站。 |
| `clear` | 移除生成的文件、配置和缓存数据。 |
| `init` | 通过一个交互式过程引导您创建一个初始配置文件。 |
| `prefs` | 管理用于网站生成的已保存偏好和配置。 |

## WebSmith 适用于谁？

AIGNE WebSmith 非常适合任何需要快速创建高质量网站的人，包括：

- **中小型企业主**：上线专业的网站以吸引客户。
- **开发者与初创公司**：快速创建营销网站、登陆页面或产品展示。
- **市场营销人员**：无需依赖开发团队即可部署活动网站和内容中心。
- **代理机构**：快速构建原型并以一致的质量交付客户网站。

## 下一步

准备好创建您的第一个网站了吗？请遵循我们全面的指南开始吧。

<x-cards>
  <x-card data-title="入门指南" data-icon="lucide:rocket" data-href="/getting-started">
    遵循我们的分步指南安装 AIGNE WebSmith，连接到 AIGNE Hub，并在 30 分钟内生成您的第一个专业网站。
  </x-card>
</x-cards>