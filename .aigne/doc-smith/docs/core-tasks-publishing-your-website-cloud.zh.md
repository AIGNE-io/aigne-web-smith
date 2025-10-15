# 发布至 WebSmith Cloud

本指南提供了将您的网站发布至 WebSmith Cloud 的系统性步骤。该服务提供免费托管，使您的网站能够公开访问，而无需您管理自己的服务器基础设施。我们推荐新用户从这里开始，它也非常适合开源项目、个人作品集或以社区为中心的网站。

## 前提条件

在开始发布流程之前，请确保您已经生成了网站页面。如果您尚未完成此步骤，请运行以下命令：

```bash
aigne web generate
```

## 发布流程

发布过程通过一个命令启动。系统随后将引导您完成必要的选择和授权。

### 步骤 1：执行发布命令

打开您的终端，导航至项目根目录，并执行 `publish` 命令。

```bash 命令行 icon=lucide:terminal
aigne web publish
```

您也可以使用别名 `pub` 或 `p`。

### 步骤 2：选择发布平台

执行命令后，您将看到一个发布选项列表。要使用免费的云托管服务，请选择第一个选项。

使用箭头键高亮以下选项并按 Enter 键：

```text
? 选择要发布页面的平台：
❯ WebSmith Cloud (https://websmith.aigne.io) – 免费托管。您的页面将可公开访问。最适合开源项目或社区共享。
  您现有的网站 - 直接集成并发布到您当前的站点（需要设置）
  新的专用网站 - 付费服务。为专业用途创建具有自定义域名和托管的新网站。
```

### 步骤 3：授权 AIGNE WebSmith（仅限首次使用的用户）

如果您是首次发布到 WebSmith Cloud，命令行工具需要获得授权才能代表您进行发布。这是一次性的安全流程。

1.  一个安全的认证 URL 将在您的默认网络浏览器中自动打开。
2.  系统将提示您登录您的账户，并批准来自“AIGNE WebSmith”的连接请求。
3.  批准后，您可以关闭浏览器标签页并返回到终端。

该工具将安全地存储您的授权凭证，因此您在后续发布时无需重复此步骤。

### 步骤 4：等待发布

现在，CLI 将自动处理整个发布过程。这包括：

- 打包您的页面和内容文件。
- 上传所有相关的媒体资产。
- 将文件部署到 WebSmith Cloud 服务器。

此过程可能需要几分钟时间，具体取决于您网站的大小。

## 查看您上线的网站

成功完成后，CLI 将显示一条确认消息。该消息将包括已发布的页面和资产总数，以及访问您线上网站的直接 URL。

```text
✅ 页面发布成功！（`10/10` 个页面，`25` 个媒体资产）

🔗 线上 URL：
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 可选：更新特定页面（`aigne web update`）或优化网站结构（`aigne web generate`）
```

您现在可以在网络浏览器中访问这些 URL，以查看您已发布的网站。

---

您已成功将网站发布至 WebSmith Cloud。如果您需要进行更改，可以修改您的内容并再次运行 `publish` 命令，或使用 `update` 命令进行更具体的修改。更多详情，请参阅[更新网站内容](./core-tasks-updating-website-content.md)。

如需了解其他部署目标，请参阅以下指南：

- [发布至您自己的网站](./core-tasks-publishing-your-website-custom.md)
- [发布至新的专用网站](./core-tasks-publishing-your-website-new-dedicated-website.md)