# 發佈到您自己的網站

本指南提供了一個系統化的程序，可將您產生的網站內容直接發佈到您自己現有的網站基礎設施上。此方法適用於管理自己的 ArcBlock 驅動網站，並希望整合由 AIGNE WebSmith 產生內容的使用者。

發佈到自訂網站可讓您完全控制託管和整合。在繼續之前，請確保您現有的網站相容且已正確設定。

## 先決條件

要成功發佈到您自己的網站，必須滿足以下條件：

1.  **一個已產生的網站：** 您必須已經使用 `aigne web generate` 指令產生了您的網站頁面。產生的內容應存在於您專案的輸出目錄中。
2.  **一個由 ArcBlock 驅動的網站：** 您的目標網站必須是一個正在運行的 Blocklet 應用程式。AIGNE WebSmith 直接與 Blocklet Server 環境整合。
3.  **必要的元件：** 您的目標網站上必須安裝並運行 **Pages Kit** 元件。此元件提供了 AIGNE WebSmith 上傳和管理您內容所需的 API。

如果您的網站尚未設定，您可以從 Blocklet Store 獲取必要的元件：
*   [在您的網站上安裝 Pages Kit](https://store.blocklet.dev/blocklets/z8ia29UsENBg6tLZUKi2HABj38Cw1LmHZocbQ)

## 發佈流程

發佈流程包括運行一個指令、選擇適當的選項、提供您網站的 URL，以及授權 AIGNE WebSmith CLI 連接到您的網站。

### 步驟 1：啟動發佈指令

在您的專案目錄中，透過在終端機中運行 `publish` 指令來開始此流程。

```bash 命令列 icon=lucide:terminal
aigne web publish
```

### 步驟 2：選擇發佈選項

您將看到幾個發佈選項。請使用方向鍵來反白並選擇 **「您現有的網站」**。

```text 發佈選項
? 請選擇發佈您頁面的平台：
  WebSmith Cloud (https://websmith.ai) – 免費託管。您的頁面將可公開存取。最適合開源專案或社群分享。
❯ 您現有的網站 - 直接在您目前的網站上整合和發佈（需要設定）
  新的專用網站 - 付費服務。為專業用途建立一個具有自訂網域和託管的新網站。
```

### 步驟 3：提供您的網站 URL

選擇自訂選項後，系統將提示您輸入網站的 URL。

```text 輸入 URL
? 請輸入您的網站 URL：
› https://my-awesome-site.com
```

輸入已安裝 Pages Kit 元件的網站完整 URL，然後按 Enter。

### 步驟 4：授權 CLI

首次連接到新網站時，CLI 需要您的授權才能發佈內容。這是每個網站一次性的設定過程。

1.  **瀏覽器驗證：** 您的預設網頁瀏覽器將自動打開一個頁面，供您連接並授權 CLI。
2.  **登入：** 系統將提示您使用您的 DID Wallet 登入您的網站。
3.  **批准連接：** 登入後，您必須批准來自「AIGNE WebSmith」存取您網站的請求。該請求將要求管理頁面的權限。

一旦批准，系統將產生一個安全的存取權杖並儲存在您本地的使用者家目錄中 (`~/.aigne/web-smith-connected.yaml`)。此權杖將用於後續所有對此特定 URL 的發佈操作，因此您無需重複授權步驟。

### 步驟 5：等待確認

授權後，CLI 將繼續進行以下操作：
1.  捆綁您產生的頁面檔案和資產。
2.  上傳所有引用的媒體檔案。
3.  將頁面內容發佈到您的網站。

成功完成後，終端機中將顯示一條確認訊息，其中包含您新發佈頁面的即時 URL。

```text 成功訊息
✅ 頁面發佈成功！ (`5/5` 個頁面，`12` 個媒體資產)

🔗 即時 URL：
   https://my-awesome-site.com/docs/
   https://my-awesome-site.com/docs/introduction
   https://my-awesome-site.com/docs/getting-started
   https://my-awesome-site.com/docs/api-reference
   https://my-awesome-site.com/docs/contact

💡 可選：更新特定頁面 (`aigne web update`) 或優化網站結構 (`aigne web generate`)
```

## 疑難排解

如果在發佈過程中遇到錯誤，請參閱下面的常見問題。

*   **錯誤：「The provided URL is not a valid website on ArcBlock platform」**
    *   **原因：** 您輸入的 URL 未指向一個有效的 Blocklet 應用程式。
    *   **解決方案：** 請確認 URL 是否正確且網站正在運行。確保您已包含正確的協定（例如 `https://`）。

*   **錯誤：「This website does not have required components for publishing」**
    *   **原因：** 目標網站是一個有效的 Blocklet，但缺少必要的「Pages Kit」元件。
    *   **解決方案：** 在您的網站上安裝 Pages Kit 元件。您可以在[此處](https://www.arcblock.io/docs/blocklet-development/en/add-components)找到說明。

*   **錯誤：「Unable to connect」或「Failed to obtain access token」**
    *   **原因：** 這通常表示存在網路問題，或目標伺服器不可用。如果您在瀏覽器中拒絕了授權請求，也可能發生這種情況。
    *   **解決方案：** 檢查您的網路連線，確保網站 URL 正確且可存取，然後重新運行 `aigne web publish` 指令，並確保批准授權請求。

---

成功發佈後，您可以進一步管理您的內容。要對現有頁面進行更改，請參閱[更新網站內容](./core-tasks-updating-website-content.md)。