# 发布到您自己的网站

本指南提供了一个系统性的流程，用于将您生成的网站内容直接发布到您自己现有的网站基础设施中。此方法适用于那些管理自己的 ArcBlock 驱动网站并希望集成由 AIGNE WebSmith 生成内容的用户。

发布到自定义网站可以完全控制托管和集成。在继续之前，请确保您现有的网站兼容并已正确配置。

## 前提条件

要成功发布到您自己的网站，必须满足以下条件：

1.  **一个已生成的网站：** 您必须已经使用 `aigne web generate` 命令生成了您的网站页面。生成的内容应存在于您项目的输出目录中。
2.  **一个 ArcBlock 驱动的网站：** 您的目标网站必须是一个正在运行的 Blocklet 应用程序。AIGNE WebSmith 直接与 Blocklet Server 环境集成。
3.  **必需组件：** **Pages Kit** 组件必须已在您的目标网站上安装并运行。该组件为 AIGNE WebSmith 提供了上传和管理内容所必需的 API。

如果您的网站尚未设置，您可以从 Blocklet Store 获取必要的组件：
*   [在您的网站上安装 Pages Kit](https://store.blocklet.dev/blocklets/z8ia29UsENBg6tLZUKi2HABj38Cw1LmHZocbQ)

## 发布流程

发布流程包括运行一个命令、选择适当的选项、提供您网站的 URL，以及授权 AIGNE WebSmith CLI 连接到您的站点。

### 第 1 步：启动发布命令

在您的项目目录中，通过在终端中运行 `publish` 命令来开始此过程。

```bash 命令行 icon=lucide:terminal
aigne web publish
```

### 第 2 步：选择发布选项

系统将为您呈现几个发布选项。使用箭头键高亮并选择 **“您现有的网站”**。

```text 发布选项
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – 免费托管。您的页面将公开可访问。最适合开源项目或社区共享。
❯ 您现有的网站 - 在您当前的网站上直接集成和发布（需要设置）
  新的专用网站 - 付费服务。为专业用途创建具有自定义域名和托管的新网站。
```

### 第 3 步：提供您的网站 URL

选择自定义选项后，系统将提示您输入网站的 URL。

```text 输入 URL
? Please enter your website URL:
› https://my-awesome-site.com
```

输入安装了 Pages Kit 组件的网站的完整 URL，然后按 Enter 键。

### 第 4 步：授权 CLI

首次连接到新网站时，CLI 需要您的授权才能发布内容。对于每个网站，这都是一次性的设置过程。

1.  **浏览器认证：** 您的默认 Web 浏览器将自动打开一个页面，供您连接和授权 CLI。
2.  **登录：** 系统将提示您使用 DID Wallet 登录您的网站。
3.  **批准连接：** 登录后，您必须批准来自“AIGNE WebSmith”的访问您站点的请求。该请求将要求获得管理页面的权限。

一旦批准，系统将生成一个安全的访问令牌并将其本地存储在您的主目录中（`~/.aigne/web-smith-connected.yaml`）。此令牌将用于后续所有针对此特定 URL 的发布操作，因此您无需重复授权步骤。

### 第 5 步：等待确认

授权后，CLI 将继续执行以下操作：
1.  捆绑您生成的页面文件和资产。
2.  上传所有引用的媒体文件。
3.  将页面内容发布到您的网站。

成功完成后，终端将显示一条确认消息，其中包含您新发布页面的实时 URL。

```text 成功消息
✅ 页面发布成功！（`5/5` 个页面，`12` 个媒体资产）

🔗 实时 URL：
   https://my-awesome-site.com/docs/
   https://my-awesome-site.com/docs/introduction
   https://my-awesome-site.com/docs/getting-started
   https://my-awesome-site.com/docs/api-reference
   https://my-awesome-site.com/docs/contact

💡 可选：更新特定页面（`aigne web update`）或优化网站结构（`aigne web generate`）
```

## 故障排除

如果在发布过程中遇到错误，请参考下面的常见问题。

*   **错误：“The provided URL is not a valid website on ArcBlock platform”**
    *   **原因：** 您输入的 URL 未指向一个有效的 Blocklet 应用程序。
    *   **解决方案：** 验证 URL 是否正确以及网站是否正在运行。确保您已包含正确的协议（例如，`https://`）。

*   **错误：“This website does not have required components for publishing”**
    *   **原因：** 目标网站是一个有效的 Blocklet，但缺少必需的“Pages Kit”组件。
    *   **解决方案：** 在您的网站上安装 Pages Kit 组件。您可以在[此处](https://www.arcblock.io/docs/blocklet-development/en/add-components)找到说明。

*   **错误：“Unable to connect”或“Failed to obtain access token”**
    *   **原因：** 这通常表示存在网络问题，或者目标服务器不可用。如果您在浏览器中拒绝了授权请求，也可能发生这种情况。
    *   **解决方案：** 检查您的互联网连接，确保网站 URL 正确且可访问，然后重新运行 `aigne web publish` 命令，并确保批准授权请求。

---

成功发布后，您可以进一步管理您的内容。要对现有页面进行更改，请参阅[更新网站内容](./core-tasks-updating-website-content.md)。