# 安裝

在您開始使用 AIGNE WebSmith 生成網站之前，您必須先安裝 AIGNE 命令列介面（CLI）。此工具提供了與 WebSmith 框架互動所需的命令。本節將提供安裝過程的逐步指南。

## 系統需求

*   **Node.js >=20**：AIGNE WebSmith 需要 Node.js 20 或更高版本
*   **npm**：npm（Node Package Manager）會隨 Node.js 自動安裝

如果您尚未安裝 Node.js，請從 [Node.js 官方網站](https://nodejs.org/) 下載並安裝。

## 安裝

在您的終端機中執行以下命令：

```bash
npm install -g @aigne/cli
```

## 進階安裝選項

### Beta 版本

若要安裝 beta 版本以測試最新功能：

```bash
npm install -g @aigne/cli@beta
aigne web upgrade --beta
```

### 本地安裝

若要將 CLI 安裝為專案依賴項：

```bash
npm install @aigne/cli
```

當本地安裝時，請使用 `npx aigne ...` 來執行命令。

## 後續步驟

安裝完成後，您就可以建立您的第一個網站了。請前往下一節開始。

*   **[準備您的內容](./getting-started-preparing-your-content.md)**：說明您應該準備好哪些類型的內容和資訊，以幫助 AI 為您的需求生成最佳的網站。