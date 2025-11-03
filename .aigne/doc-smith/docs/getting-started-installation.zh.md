# 安装

在使用 AIGNE WebSmith 生成网站之前，您必须首先安装 AIGNE 命令行界面 (CLI)。该工具提供了与 WebSmith 框架交互所需的命令。本节提供了安装过程的分步指南。

## 前提条件

要安装并运行 AIGNE CLI，您的开发环境必须满足以下要求：

*   **Node.js 和 npm**：AIGNE CLI 是一个 npm 包，因此需要 Node.js。如果您尚未安装 Node.js，请从 [Node.js 官网](https://nodejs.org/) 下载并安装。安装 Node.js 的同时也会安装 npm (Node Package Manager)。

## 安装 AIGNE CLI

推荐的安装方法是全局安装 CLI。这样，您就可以在终端的任何目录中使用 `aigne` 命令。

要执行全局安装，请在终端中运行以下命令：

```bash
npm install -g @aigne/cli
```

### 安装 Beta 版本

对于希望测试最新功能的用户，我们提供了 beta 版本。要安装 beta 版本，您必须先安装 beta 包，然后运行升级命令。

请在终端中执行以下命令：

```bash
npm install -g @aigne/cli@beta
aigne web upgrade --beta
```

### 替代方案：本地安装

或者，您也可以将 AIGNE CLI 作为特定项目内的本地依赖项进行安装。如果您倾向于按项目管理依赖项，则适合使用此方法。

要进行本地安装，请导航至您的项目根目录并运行：

```bash
npm install @aigne/cli
```

本地安装后，您需要使用 `npx aigne ...` 或配置 npm 脚本来运行命令。

## 后续步骤

安装完成后，您就可以创建您的第一个网站了。请继续阅读下一部分以开始操作。

*   **[Preparing Your Content](./getting-started-preparing-your-content.md)**：解释您应该准备好什么样的内容和信息，以帮助 AI 根据您的需求生成最佳网站。