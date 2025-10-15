# 發布至 WebSmith Cloud

本指南提供了將您的網站發布至 WebSmith Cloud 的系統化步驟。此服務提供免費託管，讓您的網站能夠公開存取，而無需您管理自己的伺服器基礎設施。對於新使用者而言，這是建議的起點，並且非常適合開源專案、作品集或以社群為主的網站。

## 先決條件

在開始發布流程之前，請確保您已經產生了網站的頁面。如果您尚未完成此步驟，請執行以下指令來完成：

```bash
aigne web generate
```

## 發布程序

發布流程透過一個指令啟動。系統將引導您完成必要的選擇和授權。

### 步驟 1：執行發布指令

開啟您的終端機，導覽至專案的根目錄，然後執行 `publish` 指令。

```bash Command Line icon=lucide:terminal
aigne web publish
```

您也可以使用別名 `pub` 或 `p`。

### 步驟 2：選擇發布平台

執行指令後，您會看到一個發布選項列表。若要使用免費的雲端託管，請選擇第一個選項。

使用方向鍵反白顯示以下選項，然後按 Enter：

```text
? 請選擇要發布頁面的平台：
❯ WebSmith Cloud (https://websmith.aigne.io) – 免費託管。您的頁面將可公開存取。最適合開源專案或社群分享。
  您現有的網站 - 直接整合並發布到您目前的網站（需要設定）
  新的專用網站 - 付費服務。為專業用途建立一個具有自訂網域和託管的新網站。
```

### 步驟 3：授權 AIGNE WebSmith (僅限首次使用者)

如果您是第一次發布到 WebSmith Cloud，指令行工具需要獲得授權才能代表您發布。這是一次性的安全程序。

1.  一個安全的驗證 URL 將在您的預設網頁瀏覽器中自動開啟。
2.  系統會提示您登入帳戶，並核准來自「AIGNE WebSmith」的連線請求。
3.  核准後，您可以關閉瀏覽器分頁並返回終端機。

該工具將安全地儲存您的授權憑證，因此您在後續的發布中無需重複此步驟。

### 步驟 4：等待發布

現在，CLI 將自動處理整個發布過程。這包括：

- 打包您的頁面和內容檔案。
- 上傳所有相關的媒體資產。
- 將檔案部署到 WebSmith Cloud 伺服器。

此過程可能需要幾分鐘時間，具體取決於您網站的大小。

## 檢視您上線的網站

成功完成後，CLI 將顯示一則確認訊息。此訊息將包含已發布的頁面和資產總數，以及用於存取您上線網站的直接 URL。

```text
✅ 頁面發布成功！(共 `10/10` 個頁面，`25` 個媒體資產)

🔗 上線網址：
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 選用：更新特定頁面 (`aigne web update`) 或優化網站結構 (`aigne web generate`)
```

您現在可以在網頁瀏覽器中造訪這些 URL，以檢視您已發布的網站。

---

您已成功將網站發布至 WebSmith Cloud。若需變更，您可以修改內容後再次執行 `publish` 指令，或使用 `update` 指令進行更具體的修改。欲了解更多詳情，請參閱[更新網站內容](./core-tasks-updating-website-content.md)。

若需了解其他部署目標，請參閱以下指南：

- [發布至您自己的網站](./core-tasks-publishing-your-website-custom.md)
- [發布至新的專用網站](./core-tasks-publishing-your-website-new-dedicated-website.md)