# 发布到新的专用网站

本指南将引导您创建并发布到全新的专用网站。这是一项付费服务，提供完全托管的环境，支持自定义域名和专用资源——非常适合专业项目。整个过程完全自动化：运行命令，完成一次性设置和支付，您的网站即可上线。

## 流程概述

发布到新的专用网站涉及一系列由 `publish` 命令处理的自动化步骤。该命令与部署服务交互，以配置和设置所有必要的资源。

工作流程如下：

1.  **启动**：用户运行 `aigne web publish` 命令。
2.  **选项选择**：用户在交互式提示中选择“New dedicated website”（新的专用网站）选项。
3.  **确认资产**：系统会提示用户确认是否在部署中包含品牌、导航和区域设置。
4.  **支付与配置**：用户将被引导至一个安全的网页以完成支付。随后，系统会自动设置网站托管和环境。
5.  **内容部署**：AIGNE WebSmith 将生成的页面上传并发布到新创建网站上的默认项目中。
6.  **确认**：用户收到新网站的实时 URL。

## 分步说明

请严格按照以下步骤发布您的网站。

### 1. 启动发布命令

首先，请确保您已使用 `aigne web generate` 命令生成了网站页面。一旦输出目录中的内容准备就绪，请在您的终端中执行以下命令：

```bash Publish Website icon=lucide:terminal
aigne web publish
```

### 2. 选择发布选项

当终端列出发布目标时，选择 **New dedicated website** 并确认。
![显示“New dedicated website”选项高亮的提示](../../../assets/images/web-smith-publish-dedicated.png)

### 3. 确认附加资产

选择专用选项后，终端会询问是否包含区域设置、导航和品牌信息。接受默认的“Yes”，以便您的新网站在启动时就已完全配置好。

![询问是否包含区域设置、导航和品牌信息的提示](../../../assets/images/web-smith-publish-dedicated-process.png)

### 4. 完成设置和支付

选择该选项后，自动化设置过程将开始：

1.  **支付**：您的终端中将出现一条消息，提示支付流程正在开始。一个安全的支付链接将在您的默认网页浏览器中打开。

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

![确认专用网站支付的结账屏幕](../../../assets/images/web-smith-payment.png)

2.  **配置**：支付完成后，WebSmith 会自动恢复。终端将等待服务被配置、启动和验证——您无需进行任何进一步操作。

![支付确认和成功消息](../../../assets/images/web-smith-payment-success.png)

3.  **完成**：设置完成后，终端会显示实时 URL 以及一个订阅管理链接。


![显示配置进度和实时 URL 的终端输出](../../../assets/images/web-smith-payment-success-url.png)

### 5. 授权托管服务

在 WebSmith 上传内容之前，请批准发布权限请求。终端会启动一个浏览器，您授予访问权限后，生成的令牌将被保存以供将来运行使用。

![确认 WebSmith 访问权限的服务授权屏幕](../../../assets/images/web-smith-service-auth.png)

### 6. 自动发布内容

一旦网站配置完成且授权成功，AIGNE WebSmith 将自动上传您生成的页面和媒体资产。

![确认页面和资产上传成功的终端输出](../../../assets/images/web-smith-publish-success.png)

## 恢复未完成的设置

如果之前创建专用网站的尝试已启动但未完成（例如，支付过程被放弃），系统将保存会话详情。下次运行 `aigne web publish` 时，您将看到一个额外的选项来恢复该过程。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.aigne.io) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

选择此“Resume”选项可让您从上次中断的地方继续，如果支付已处理，则无需重新开始或再次支付。系统将使用已保存的 `checkoutId` 来恢复之前的会话并完成网站设置。

## 总结

您已成功将项目发布到一个新的专用网站。您的内容现已上线，可通过提供的 URL 访问。要进行更改，您可以使用 `aigne web update` 更新内容，或使用 `aigne web generate` 重新生成整个网站结构，然后再运行一次 `aigne web publish` 命令。系统将使用已保存的配置将更新发布到同一个网站。