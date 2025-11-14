# 发布到现有网站

本指南将向您展示如何发布到您已运营的 ArcBlock 驱动的网站。发布到您自己的基础设施可以让您完全控制托管、集成和部署。在继续之前，请确保您的网站兼容且配置正确。

## 前提条件

要成功发布到您自己的网站，必须满足以下条件：

1.  **已生成的网站：** 您必须已经使用 `aigne web generate` 命令生成了您的网站页面。生成的内容应存在于您项目的输出目录中。
2.  **由 Blocklet Server 驱动的网站：** 您的目标网站必须是一个正在运行的 Blocklet 应用程序。AIGNE WebSmith 直接与 Blocklet Server 环境集成。
3.  **必需组件：** 您的目标网站上必须已安装并运行 **Pages Kit** 组件。该组件提供了 AIGNE WebSmith 上传和管理内容所必需的 API。

如果您的网站尚未设置，您可以从 Blocklet Store 获取必要的组件：

- [在您的网站上安装 Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)

## 发布流程

发布流程包括运行一个命令、选择适当的选项、提供您网站的 URL，以及授权 AIGNE WebSmith CLI 连接到您的站点。

### 步骤 1：启动发布命令

在您的项目目录中，通过在终端运行 `publish` 命令来开始此过程。

```bash 发布网站 icon=lucide:terminal
aigne web publish
```

### 步骤 2：选择发布选项

当提示选择目标时，请选择 **Your existing website**。

![提示显示已选择“Your existing website”选项](../../../assets/images/web-smith-publish-exist.png)

### 步骤 3：提供您的网站 URL

当终端提示时，请提供已运行 Pages Kit 的站点的完整 URL。

![提示请求目标网站 URL](../../../assets/images/web-smith-publish-exist-url.png)

### 步骤 4：授权发布命令

首次连接到新网站时，终端命令需要您的授权才能发布内容。对于每个网站，这都是一次性的设置过程。

1.  **浏览器认证：** 您的默认网页浏览器会自动打开一个页面，以便您授予发布命令访问权限。
2.  **登录：** 系统将提示您使用 DID 钱包登录您的网站。
3.  **批准连接：** 登录后，您必须批准来自“AIGNE WebSmith”访问您站点的请求。该请求将要求获得管理页面的权限。

一旦批准，系统将生成一个安全访问令牌并存储在您本地的主目录中（`~/.aigne/web-smith-connected.yaml`）。该令牌将用于后续所有针对此特定 URL 的发布操作，因此您无需重复授权步骤。

![服务授权屏幕确认 WebSmith 访问权限](../../../assets/images/web-smith-service-auth.png)

### 步骤 5：等待确认

授权后，终端命令将继续执行以下操作：

1.  打包您生成的页面文件和资产。
2.  上传所有引用的媒体文件。
3.  将页面内容发布到您的网站。

成功完成后，终端将显示一条确认消息，其中包括您新发布页面的实时 URL。

```text 成功消息
✅ Pages published successfully! (`5/5` pages, `12` media assets)

🔗 Live URLs:
   https://my-awesome-site.com/docs/
   https://my-awesome-site.com/docs/introduction
   https://my-awesome-site.com/docs/getting-started
   https://my-awesome-site.com/docs/api-reference
   https://my-awesome-site.com/docs/contact

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## 问题排查

如果您在发布过程中遇到错误，请参考以下常见问题。

- **错误：“The provided URL is not a valid website on ArcBlock platform”**
  - **原因：** 您输入的 URL 未指向一个有效的 Blocklet 应用程序。
  - **解决方案：** 验证 URL 是否正确，以及网站是否正在运行。请确保您已包含正确的协议（例如 `https://`）。

- **错误：“This website does not have required components for publishing”**
  - **原因：** 目标网站是一个有效的 Blocklet，但缺少必需的“Pages Kit”组件。
  - **解决方案：** 在您的网站上安装 Pages Kit 组件。您可以在[此处](https://www.arcblock.io/docs/blocklet-development/en/add-components)找到相关说明。

- **错误：“Unable to connect” 或 “Failed to obtain access token”**
  - **原因：** 这通常表示存在网络问题，或者目标服务器不可用。如果您在浏览器中拒绝了授权请求，也可能发生此错误。
  - **解决方案：** 检查您的网络连接，确保网站 URL 正确且可访问，然后重新运行 `aigne web publish` 命令，并确保批准授权请求。

---

成功发布后，您可以进一步管理您的内容。要对现有页面进行更改，请参阅[更新网站](./guides-update-website.md)。