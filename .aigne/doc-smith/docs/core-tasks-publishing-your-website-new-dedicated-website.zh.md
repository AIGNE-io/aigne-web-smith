# 发布到新的专属网站

本指南提供了一个系统化的流程，用于将您的内容发布到一个全新的专属网站。此选项是一项付费服务，为您的项目提供一个完全托管的托管环境，适用于需要自定义域名和专属资源的专业用途。

该过程是自动化的。当您启动命令后，AIGNE WebSmith 将引导您完成一次性的设置和支付流程。完成后，您的网站将被创建，并且您的内容将被发布到该网站上。

## 流程概述

发布到新的专属网站涉及一系列由 `publish` 命令处理的自动化步骤。该命令与部署服务交互，以置备和配置所有必要的资源。

工作流程如下：

1.  **启动**：用户运行 `aigne web publish` 命令。
2.  **选项选择**：用户从交互式提示中选择“新的专属网站”选项。
3.  **确认资产**：系统会提示用户确认是否在部署中包含品牌、导航和区域设置。
4.  **支付与置备**：用户将被引导至一个安全的网页以完成支付。随后，系统会自动设置网站托管和环境。
5.  **内容部署**：AIGNE WebSmith 将生成的页面上传并发布到新创建网站上的一个默认项目中。
6.  **确认**：用户收到新网站的实时 URL。

## 分步说明

要发布您的网站，请严格按照以下步骤操作。

### 1. 启动发布命令

首先，确保您已使用 `aigne web generate` 命令生成了网站页面。当您的内容在输出目录中准备就绪后，请在终端中执行以下命令：

```bash
aigne web publish
```

### 2. 选择发布选项

您将看到几个发布选项。使用箭头键高亮并选择“新的专属网站”选项。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.aigne.io) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
❯ New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

按 Enter 键确认您的选择。

### 3. 确认附加资产

选择创建新网站后，系统会要求您确认是否发布其他网站资产。这包括项目中定义的品牌详情（名称、描述）、导航结构和区域配置。

```text
? Publish pages to the new dedicated website with locales, navigations and branding? › (Y/n)
```

建议选择“是”（默认选项），以确保您的新网站配置完整。发布这些资产可确保您网站的品牌、菜单结构和语言选项得到正确应用。

### 4. 完成设置和支付

选择该选项后，自动化设置过程将开始：

1.  **支付**：您的终端中将出现一条消息，提示支付流程正在开始。一个安全的支付链接将在您的默认网页浏览器中打开。

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

2.  **置备**：按照网页上的说明完成支付。在此期间，命令行工具将等待。一旦支付确认，系统将自动进行设置。您将在终端中看到进度更新。

    ```text
    📦 Step 2/4: Setting up your website...
    🚀 Step 3/4: Starting your website...
    🌐 Step 4/4: Getting your website URL...
    ```

3.  **完成**：设置完成后，终端将显示一条确认消息，其中包含您新网站的 URL 和一个用于管理订阅的链接。

    ```text
    🔗 Your website is ready at: https://your-new-site.example.com
    🔗 Manage your subscription at: https://billing.example.com/manage/sub_12345
    ```

### 5. 自动内容发布

专属网站成功置备后，AIGNE WebSmith 将立即开始上传您生成的页面和媒体资产。该过程完全自动。

完成后，您将收到一条最终确认消息，其中列出了已发布页面的实时 URL。

```text
✅ Pages published successfully! (`15/15` pages, `42` media assets)

🔗 Live URLs:
   https://your-new-site.example.com/
   https://your-new-site.example.com/about
   https://your-new-site.example.com/services
   ...

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## 恢复未完成的设置

如果之前创建专属网站的尝试已启动但未完成（例如，支付流程被放弃），系统将保存会话详情。下次运行 `aigne web publish` 时，您将看到一个额外的选项来恢复该过程。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.aigne.io) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

选择此“恢复”选项可以让您从上次中断的地方继续，而无需重新开始或在已付款的情况下再次支付。系统将使用保存的 `checkoutId` 来恢复先前的会话并完成网站设置。

## 总结

您已成功将项目发布到一个全新的专属网站。您的内容现已上线，可通过提供的 URL 访问。要进行更改，您可以使用 `aigne web update` 更新内容，或使用 `aigne web generate` 重新生成整个网站结构，然后再执行一次 `aigne web publish` 命令。系统将使用保存的配置将更新发布到同一个网站。