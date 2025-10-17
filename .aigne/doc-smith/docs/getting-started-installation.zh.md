# 安装

在开始使用 AIGNE WebSmith 生成网站之前，您必须首先安装 AIGNE 命令行界面 (CLI)。该工具提供了与 WebSmith 框架交互所需的命令。本节将提供安装过程的分步指南。

## 先决条件

要安装并运行 AIGNE CLI，您的开发环境必须满足以下要求：

*   **Node.js 和 npm**：AIGNE CLI 是一个 npm 包，需要 Node.js。如果您尚未安装 Node.js，请从 [Node.js 官网](https://nodejs.org/) 下载并安装。安装 Node.js 的同时也会安装 npm (Node 包管理器)。

## 安装 AIGNE CLI

推荐的安装方法是全局安装 CLI。这使得 `aigne` 命令可以在您终端的任何目录中访问。

要执行全局安装，请在终端中运行以下命令：

```bash
npm install -g @aigne/cli
```

### 替代方案：本地安装

或者，您也可以在特定项目中将 AIGNE CLI 作为本地依赖项安装。如果您希望按项目管理依赖项，这种方式比较适合。

要在本地安装，请导航到您项目的根目录并运行：

```bash
npm install @aigne/cli
```

在本地安装时，您需要使用 `npx aigne ...` 或配置 npm 脚本来运行命令。

## 后续步骤

安装完成后，您就可以创建您的第一个网站了。请继续阅读下一部分以开始操作。

*   **[准备您的内容](./getting-started-preparing-your-content.md)**：解释了您应该准备什么样的内容和信息，以帮助 AI 根据您的需求生成最佳的网站。