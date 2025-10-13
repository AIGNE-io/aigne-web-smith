# 发布到 WebSmith Cloud

本指南提供了将您的网站发布到 WebSmith Cloud 的系统化流程。该服务提供免费托管，使您的网站能够公开访问，而无需您管理自己的服务器基础设施。对于新用户而言，这是推荐的起点，并且非常适合开源项目、作品集或以社区为中心的网站。

有关其他部署目标，请参阅以下指南：
- [发布到您自己的网站](./core-tasks-publishing-your-website-custom.md)
- [发布到新的专用网站](./core-tasks-publishing-your-website-new-dedicated-website.md)

## 先决条件

在开始发布过程之前，请确保您已经生成了网站页面。如果您尚未完成此步骤，请运行以下命令来完成：

```bash
aigne web generate
```

## 发布流程

发布过程通过一个命令启动。系统随后将引导您完成必要的选择和授权。

### 第 1 步：执行发布命令

打开您的终端，导航到项目的根目录，并执行 `publish` 命令。

```bash Command Line icon=lucide:terminal
aigne web publish
```

您也可以使用别名 `pub` 或 `p`。

### 第 2 步：选择发布平台

执行命令后，您将看到一个发布选项列表。要使用免费的云托管服务，请选择第一个选项。

使用箭头键高亮以下选项并按 Enter 键：

```text
? 选择要发布页面的平台:
❯ WebSmith Cloud (https://websmith.ai) – 免费托管。您的页面将可公开访问。最适合开源项目或社区共享。
  您现有的网站 - 在您当前的网站上直接集成和发布（需要设置）
  新的专用网站 - 付费服务。为专业用途创建具有自定义域名和托管的新网站。
```

### 第 3 步：授权 AIGNE WebSmith（仅限首次使用的用户）

如果您是首次发布到 WebSmith Cloud，命令行工具需要获得授权才能代表您进行发布。这是一次性的安全程序。

1.  一个安全的认证 URL 将在您的默认网络浏览器中自动打开。
2.  系统将提示您登录您的账户，并批准来自“AIGNE WebSmith”的连接请求。
3.  批准后，您可以关闭浏览器标签页并返回到终端。

该工具将安全地存储您的授权凭据，因此您在后续发布时无需重复此步骤。

### 第 4 步：等待发布

现在，CLI 将自动处理整个发布过程。这包括：
- 捆绑您的页面和内容文件。
- 上传所有相关的媒体资产。
- 将文件部署到 WebSmith Cloud 服务器。

此过程可能需要几分钟时间，具体取决于您网站的大小。

## 查阅您已上线的网站

成功完成后，CLI 将显示一条确认消息。此消息将包括已发布的页面和资产的总数，以及访问您已上线网站的直接 URL。

```text
✅ 页面发布成功！（`10/10` 个页面，`25` 个媒体资产）

🔗 线上 URL:
   https://websmith.ai/your-project-slug/
   https://websmith.ai/your-project-slug/about
   https://websmith.ai/your-project-slug/services

💡 可选操作：更新特定页面（`aigne web update`）或优化网站结构（`aigne web generate`）
```

您现在可以在网络浏览器中访问这些 URL，以查看您已发布的网站。

---

您已成功将网站发布到 WebSmith Cloud。如果需要进行更改，您可以修改内容并再次运行 `publish` 命令，或使用 `update` 命令进行更具体的修改。有关更多详细信息，请参阅[更新网站内容](./core-tasks-updating-website-content.md)。