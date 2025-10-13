# 發佈至 WebSmith Cloud

本指南提供將您的網站發佈至 WebSmith Cloud 的系統化步驟。此服務提供免費託管，讓您的網站能公開存取，而無需您管理自己的伺服器基礎設施。對於新用戶而言，這是建議的起點，也非常適合開源專案、作品集或以社群為主的網站。

若要部署至其他目標，請參閱以下指南：
- [發佈至您自己的網站](./core-tasks-publishing-your-website-custom.md)
- [發佈至新的專用網站](./core-tasks-publishing-your-website-new-dedicated-website.md)

## 事前準備

在開始發佈流程之前，請確保您已經生成了網站頁面。若您尚未完成此步驟，請執行以下指令來生成頁面：

```bash
aigne web generate
```

## 發佈程序

發佈流程透過單一指令啟動。系統將引導您完成必要的選擇和授權。

### 步驟 1：執行發佈指令

打開您的終端機，導航至專案的根目錄，並執行 `publish` 指令。

```bash Command Line icon=lucide:terminal
aigne web publish
```

您也可以使用別名 `pub` 或 `p`。

### 步驟 2：選擇發佈平台

執行指令後，您會看到一個發佈選項列表。若要使用免費的雲端託管，請選擇第一個選項。

使用方向鍵反白以下選項，然後按下 Enter 鍵：

```text
? 請選擇要發佈頁面的平台：
❯ WebSmith Cloud (https://websmith.ai) – 免費託管。您的頁面將可公開存取。最適合開源專案或社群分享。
  您現有的網站 - 整合並直接發佈到您目前的網站（需要設定）
  新的專用網站 - 付費服務。為專業用途建立一個擁有自訂網域和託管的新網站。
```

### 步驟 3：授權 AIGNE WebSmith（僅限首次使用者）

如果這是您第一次發佈至 WebSmith Cloud，命令列工具需要獲得授權才能代表您進行發佈。這是一次性的安全程序。

1.  一個安全的驗證 URL 將在您的預設網頁瀏覽器中自動打開。
2.  系統會提示您登入帳戶，並批准來自「AIGNE WebSmith」的連線請求。
3.  批准後，您可以關閉瀏覽器分頁並返回終端機。

該工具將安全地儲存您的授權憑證，因此您在後續的發佈中無需重複此步驟。

### 步驟 4：等待發佈

現在，CLI 將自動處理整個發佈過程。此過程包括：
- 捆綁您的頁面和內容檔案。
- 上傳所有相關的媒體資產。
- 將檔案部署到 WebSmith Cloud 伺服器。

此過程可能需要幾分鐘時間，具體取決於您網站的大小。

## 檢視您上線的網站

成功完成後，CLI 將顯示一則確認訊息。此訊息將包含已發佈的頁面和資產總數，以及用於存取您上線網站的直接 URL。

```text
✅ 頁面發佈成功！（`10/10` 個頁面，`25` 個媒體資產）

🔗 上線網址：
   https://websmith.ai/your-project-slug/
   https://websmith.ai/your-project-slug/about
   https://websmith.ai/your-project-slug/services

💡 可選操作：更新特定頁面（`aigne web update`）或調整網站結構（`aigne web generate`）
```

您現在可以在網頁瀏覽器中訪問這些 URL，以查看您已發佈的網站。

---

您已成功將您的網站發佈至 WebSmith Cloud。若您需要進行變更，可以修改您的內容並再次執行 `publish` 指令，或使用 `update` 指令進行更具體的修改。更多詳細資訊，請參閱 [更新網站內容](./core-tasks-updating-website-content.md)。