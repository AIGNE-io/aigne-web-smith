# 安裝

在開始使用 AIGNE WebSmith 產生網站之前，您必須先安裝 AIGNE 命令列介面 (CLI)。此工具提供了與 WebSmith 框架互動所需的指令。本節將提供安裝過程的逐步指南。

## 先決條件

若要安裝並執行 AIGNE CLI，您的開發環境必須符合以下要求：

*   **Node.js 與 npm**：AIGNE CLI 是以 npm 套件的形式發布，因此需要 Node.js。如果您尚未安裝 Node.js，請從 [Node.js 官方網站](https://nodejs.org/) 下載並安裝。安裝 Node.js 的同時也會安裝 npm (節點套件管理器)。

## 安裝 AIGNE CLI

建議的安裝方式是全域安裝 CLI。這樣一來，您就可以在終端機的任何目錄中存取 `aigne` 指令。

若要執行全域安裝，請在您的終端機中執行以下指令：

```bash
npm install -g @aigne/cli
```

### 替代方案：本機安裝

或者，您也可以將 AIGNE CLI 安裝為特定專案中的本機依賴項。如果您偏好以專案為單位管理依賴項，這種方式會很適合。

若要進行本機安裝，請導覽至您專案的根目錄並執行：

```bash
npm install @aigne/cli
```

當採用本機安裝時，您需要使用 `npx aigne ...` 或設定 npm 指令碼來執行指令。

## 後續步驟

安裝完成後，您就可以開始建立您的第一個網站了。請前往下一節開始操作。

*   **[您的第一個網站](./getting-started-your-first-website.md)**：一個實作教學，引導您使用簡單的設定檔來產生一個完整的網站。