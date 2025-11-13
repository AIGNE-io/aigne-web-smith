# 發佈至現有網站

使用本指南來設定 `aigne web publish`，使其部署至您已在營運的 ArcBlock 驅動網站，包括 URL 輸入和服務授權。

本指南提供了一個系統性的流程，可將您產生的網站內容直接發佈至您自己現有的網站基礎設施。此方法適用於管理自己 ArcBlock 驅動網站並希望整合由 AIGNE WebSmith 產生的內容的使用者。

發佈至自訂網站可讓您完全控制託管和整合。在繼續之前，請確保您現有的網站相容且設定正確。

## 先決條件

為成功發佈至您自己的網站，必須滿足以下條件：

1.  **一個已產生的網站：** 您必須已使用 `aigne web generate` 指令產生了您的網站頁面。產生的內容應存在於您專案的輸出目錄中。
2.  **一個由 Blocklet Server 驅動的網站：** 您的目標網站必須是一個正在運行的 Blocklet 應用程式。AIGNE WebSmith 直接與 Blocklet Server 環境整合。
3.  **必要元件：** **Pages Kit** 元件必須已安裝並在您的目標網站上運行。此元件提供了 AIGNE WebSmith 上傳和管理您內容所必需的 API。

如果您的網站尚未設定，您可以從 Blocklet Store 獲取必要的元件：

- [在您的網站上安裝 Pages Kit](https://store.blocklet.dev/blocklets/z8ia29UsENBg6tLZUKi2HABj38Cw1LmHZocbQ)

## 發佈流程

發佈流程包括執行一個指令、選擇適當的選項、提供您網站的 URL，以及授權 AIGNE WebSmith CLI 連接至您的網站。

### 步驟 1：啟動發佈指令

從您的專案目錄中，在終端機執行 `publish` 指令以開始此流程。

```bash 發佈網站 icon=lucide:terminal
aigne web publish
```

### 步驟 2：選擇發佈選項

當提示選擇目的地時，請選擇 **Your existing website**（您現有的網站）。

![顯示已選擇「Your existing website」選項的提示](../../../assets/images/web-smith-publish-exist.png)

### 步驟 3：提供您的網站 URL

當終端機提示時，請提供已運行 Pages Kit 的網站完整 URL。

![要求輸入目標網站 URL 的提示](../../../assets/images/web-smith-publish-exist-url.png)

### 步驟 4：授權發佈指令

首次連接至新網站時，終端機指令需要您的授權才能發佈內容。這對每個網站來說是一次性的設定過程。

1.  **瀏覽器驗證：** 您的預設網頁瀏覽器會自動開啟一個頁面，以便您授予發佈指令存取權限。
2.  **登入：** 系統將提示您使用 DID 錢包登入您的網站。
3.  **批准連接：** 登入後，您必須批准來自「AIGNE WebSmith」的請求以存取您的網站。該請求將要求管理頁面的權限。

一旦批准，系統會產生一個安全的存取權杖並儲存在您本地的使用者主目錄中（`~/.aigne/web-smith-connected.yaml`）。此權杖將用於後續所有對此特定 URL 的發佈操作，因此您無需重複授權步驟。

![確認 WebSmith 存取權限的服務授權畫面](../../../assets/images/web-smith-service-auth.png)

### 步驟 5：等待確認

授權後，終端機指令將繼續進行以下操作：

1.  打包您產生的頁面檔案和資產。
2.  上傳所有參考的媒體檔案。
3.  將頁面內容發佈至您的網站。

成功完成後，終端機將顯示一條確認訊息，包括您新發佈頁面的線上 URL。

```text 成功訊息
✅ Pages published successfully! (`5/5` pages, `12` media assets)

🔗 Live URLs:
   https://my-awesome-site.com/docs/
   https://my-awesome-site.com/docs/introduction
   https://my-awesome-site.com/docs/getting-started
   https://my-awesome-site.com/docs/api-reference
   https://my-awesome-site.com/docs/contact

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## 故障排除

如果您在發佈過程中遇到錯誤，請參考以下常見問題。

- **錯誤：「The provided URL is not a valid website on ArcBlock platform」**
  - **原因：** 您輸入的 URL 未指向一個有效的 Blocklet 應用程式。
  - **解決方案：** 請驗證 URL 是否正確且網站正在運行。確保您已包含正確的協定（例如 `https://`）。

- **錯誤：「This website does not have required components for publishing」**
  - **原因：** 目標網站是一個有效的 Blocklet，但缺少必要的「Pages Kit」元件。
  - **解決方案：** 在您的網站上安裝 Pages Kit 元件。您可以在[此處](https://www.arcblock.io/docs/blocklet-development/en/add-components)找到說明。

- **錯誤：「Unable to connect」或「Failed to obtain access token」**
  - **原因：** 這通常表示存在網路問題，或目標伺服器不可用。如果您在瀏覽器中拒絕了授權請求，也可能發生此情況。
  - **解決方案：** 檢查您的網路連線，確保網站 URL 正確且可存取，然後重新執行 `aigne web publish` 指令，並確保批准授權請求。

---

成功發佈後，您可以進一步管理您的內容。若要對現有頁面進行更改，請參閱[更新網站](./guides-update-website.md)。