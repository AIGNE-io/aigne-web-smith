# 概述

AIGNE WebSmith 是一款 AI 驱动的工具，旨在自动化创建内容丰富的专业网站。它能处理从规划网站结构、编写内容到生成最终页面并在线发布的所有事务。这使您能够以最少的精力，在无需任何技术专长的情况下，将一个简单的想法变为一个经过 SEO 优化的线上网站。

WebSmith 构建于强大的 AIGNE 框架之上，如同您的自动化 Web 开发团队。您只需提供网站的愿景，AI agents 就会完成繁重的工作，确保交付高质量的成果以呈现给您的受众。

## 主要特性

WebSmith 通过一系列智能功能简化了整个网站创建过程。

<x-cards data-columns="3">
  <x-card data-title="AI 驱动生成" data-icon="lucide:brain-circuit">
    WebSmith 使用 AI 智能地规划您的网站结构，为每个页面生成引人入胜的相关内容，并确保其从一开始就为搜索引擎进行了优化。
  </x-card>
  <x-card data-title="专业模板" data-icon="lucide:layout-template">
    您的网站将使用一系列现代、专业设计的组件库来构建。最终的模板是完全响应式的，确保您的网站在桌面、平板电脑和移动设备上都能完美呈现。
  </x-card>
  <x-card data-title="一键发布" data-icon="lucide:rocket">
    网站生成后，只需一个命令即可发布。WebSmith 会处理整个过程，并为您提供一个可立即与世界分享的线上 URL。
  </x-card>
</x-cards>

## 工作原理

整个过程设计得简单高效。您无需执行一系列复杂的技术步骤，而是通过简单的命令和描述与系统交互。

```d2
direction: down

User: {
  shape: c4-person
  label: "您"
}

Define-Requirements: {
  label: "1. 定义您的网站"
  style.fill: "#f0f9ff"
}

AI-Generation: {
  label: "2. AI 生成网站"
  style.fill: "#f0f9ff"

  sub-process: {
    direction: right
    Plan-Structure: "规划结构"
    Write-Content: "编写内容"
    Build-Pages: "构建页面"
  }
}

Publish: {
  label: "3. 在线发布"
  style.fill: "#f0f9ff"
}

Live-Website: {
  label: "线上网站"
  shape: cylinder
  style.fill: "#ecfdf5"
}

User -> Define-Requirements: "提供关于\n您需求的简单描述"
Define-Requirements -> AI-Generation: "'aigne web generate'"
AI-Generation -> Publish: "生成的文件"
Publish -> Live-Website: "'aigne web publish'"
```

1.  **描述您的网站**：首先，您需要创建一个简单的文件，概述您的网站主题、目标受众以及所需页面。这可以是一个新的 SaaS 产品、个人作品集或技术文档中心。
2.  **通过命令生成**：运行 `aigne web generate` 命令。AI 会分析您的需求，规划最佳的网站结构，编写所有内容，并使用专业的设计组件组装页面。
3.  **即时发布**：准备就绪后，运行 `aigne web publish` 命令。WebSmith 会上传所有必要文件，并为您的新网站提供一个线上 URL。

## WebSmith 适用人群

AIGNE WebSmith 非常适合任何需要快速创建高质量网站的人，包括：

*   **中小型企业主**：建立专业的线上形象以吸引客户。
*   **开发者和初创公司**：为您的产品快速创建营销网站、博客或文档。
*   **市场营销人员**：无需依赖开发团队即可部署登陆页面和内容中心。
*   **创作者**：轻松建立个人品牌或作品集网站。

## 后续步骤

现在您已经对 AIGNE WebSmith 的功能有了大致了解，可以开始创建您的第一个网站了。

*   **[快速入门](./getting-started.md)**：遵循我们的指南安装所需工具，并在 30 分钟内生成您的第一个网站。