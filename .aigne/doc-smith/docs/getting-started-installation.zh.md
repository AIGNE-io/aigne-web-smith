# 安装

在开始使用 AIGNE WebSmith 生成网站之前，您必须先安装 AIGNE 命令行界面（CLI）。该工具提供了与 WebSmith 框架交互所需的命令。本节将提供分步安装指南。

## 系统要求

*   **Node.js >=20**: AIGNE WebSmith 需要 Node.js 20 或更高版本
*   **npm**: npm (Node Package Manager) 会随 Node.js 自动安装

如果您尚未安装 Node.js，请从 [Node.js 官方网站](https://nodejs.org/) 下载并安装。

## 安装

在您的终端中运行以下命令：

```bash
npm install -g @aigne/cli
```

## 高级安装选项

### Beta 版本

要安装用于测试最新功能的 Beta 版本，请运行：

```bash
npm install -g @aigne/cli@beta
aigne web upgrade --beta
```

### 本地安装

要将 CLI 作为项目依赖项安装，请运行：

```bash
npm install @aigne/cli
```

当在本地安装时，请使用 `npx aigne ...` 来运行命令。

## 后续步骤

安装完成后，您就可以创建您的第一个网站了。请继续阅读下一节以开始。

*   **[准备您的内容](./getting-started-preparing-your-content.md)**：解释您应该准备好哪些类型的内容和信息，以帮助 AI 根据您的需求生成最佳网站。