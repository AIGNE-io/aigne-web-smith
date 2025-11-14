# 发布到 WebSmith Cloud

本指南将引导您发布到 WebSmith Cloud——一个免费托管服务，让您的网站公开可访问而无需管理任何基础设施。这是新用户的推荐起点，非常适合开源项目、个人作品集或社区网站。

## 前提条件

在开始发布流程之前，请确保您已经生成了网站页面。如果您尚未完成此步骤，请运行以下命令：

```bash 生成网站 icon=lucide:terminal
aigne web generate
```

## 发布流程

发布过程通过一个命令启动。系统将引导您完成必要的选择和授权。

### 第 1 步：执行发布命令

打开您的终端，导航到项目的根目录，并执行 `publish` 命令。

```bash 发布网站 icon=lucide:terminal
aigne web publish
```

您也可以使用别名 `pub` 或 `p`。

### 第 2 步：选择发布平台

执行命令后，您将看到一个发布选项列表。选择 **WebSmith Cloud** 以使用免费托管选项。

![显示选择 WebSmith Cloud 作为发布目标的提示](../../../assets/images/web-smith-publish-cloud.png)

### 第 3 步：授权 AIGNE WebSmith（需要首次设置）

如果这是您第一次发布到 WebSmith Cloud，命令行工具需要获得授权才能代表您进行发布。这是一次性的安全流程。

1.  一个安全的认证 URL 将在您的默认网页浏览器中自动打开。
2.  系统将提示您登录您的账户，并批准来自 “AIGNE WebSmith” 的连接请求。
3.  批准后，您可以关闭浏览器标签页并返回到终端。

该工具将安全地存储您的授权凭证，因此您在后续发布时无需重复此步骤。

![请求为 WebSmith Cloud 部署进行授权的浏览器窗口](../../../assets/images/web-smith-publish-cloud-auth.png)

### 第 4 步：等待发布

现在，终端会自动处理整个发布过程。这包括：

- 打包您的页面和内容文件。
- 上传所有相关的媒体资产。
- 将文件部署到 WebSmith Cloud 服务器。

此过程可能需要几分钟，具体取决于您网站的大小。

## 查看您的线上网站

成功完成后，终端会显示一条确认消息。该消息包括已发布的页面和资产的总数，以及访问您线上网站的直接 URL。

```text
✅ 页面发布成功！ (共 `10/10` 个页面，`25` 个媒体资产)

🔗 线上 URL：
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 可选操作：更新特定页面 (`aigne web update`) 或优化网站结构 (`aigne web generate`)
```

您现在可以在网页浏览器中访问这些 URL 来查看您已发布的网站。

---

您已成功将网站发布到 WebSmith Cloud。如果您需要进行更改，可以修改您的内容并再次运行 `publish` 命令，或使用 `update` 命令进行更具体的修改。更多详情，请参阅[更新网站](./guides-update-website.md)。

对于其他部署目标，请参阅以下指南：

- [发布到现有网站](./guides-publish-website-to-existing-website.md)
- [发布到新的专用网站](./guides-publish-website-to-new-dedicated-website.md)