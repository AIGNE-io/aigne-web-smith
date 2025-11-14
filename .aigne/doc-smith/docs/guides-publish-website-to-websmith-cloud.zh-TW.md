# 發布至 WebSmith Cloud

本指南將引導您使用 `aigne web publish` 指令，將網站發布至免費的 WebSmith Cloud 託管選項，內容涵蓋從指令調用到首次授權及驗證線上 URL 的完整流程。

本指南提供將您的網站發布至 WebSmith Cloud 的系統性步驟。此服務提供免費託管，讓您的網站能公開存取，而無需您管理自己的伺服器基礎設施。對於新使用者來說，這是推薦的起點，也非常適合開源專案、作品集或以社群為主的網站。

## 前提條件

在進行發布流程前，請確保您已生成網站頁面。若您尚未完成此步驟，請執行以下指令：

```bash 生成網站 icon=lucide:terminal
aigne web generate
```

## 發布流程

發布流程由單一指令啟動。系統將引導您完成必要的選擇與授權。

### 步驟 1：執行發布指令

開啟您的終端機，導航至專案的根目錄，並執行 `publish` 指令。

```bash 發布網站 icon=lucide:terminal
aigne web publish
```

您也可以使用別名 `pub` 或 `p`。

### 步驟 2：選擇發布平台

執行指令後，您將看到一個發布選項列表。請選擇 **WebSmith Cloud** 以使用免費的託管選項。

![顯示選擇 WebSmith Cloud 作為發布目標的提示](../../../assets/images/web-smith-publish-cloud.png)

### 步驟 3：授權 AIGNE WebSmith（首次設定所需）

如果這是您第一次發布至 WebSmith Cloud，命令列工具需要獲得授權才能代表您進行發布。這是一次性的安全程序。

1.  一個安全的認證 URL 將在您的預設網頁瀏覽器中自動開啟。
2.  系統將提示您登入帳戶並核准來自「AIGNE WebSmith」的連線請求。
3.  核准後，您可以關閉瀏覽器分頁並返回終端機。

此工具將安全地儲存您的授權憑證，因此您在後續發布時無需重複此步驟。

![要求為 WebSmith Cloud 部署進行授權的瀏覽器視窗](../../../assets/images/web-smith-publish-cloud-auth.png)

### 步驟 4：等待發布

現在，終端機將自動處理整個發布過程。這包括：

- 捆綁您的頁面與內容檔案。
- 上傳所有相關的媒體資產。
- 將檔案部署至 WebSmith Cloud 伺服器。

此過程可能需要幾分鐘，具體時間取決於您網站的大小。

## 檢視您的線上網站

成功完成後，終端機會顯示一則確認訊息。此訊息包含已發布的頁面與資產總數，以及用於存取您線上網站的直接 URL。

![終端機輸出確認頁面和資產上傳成功](../../../assets/images/web-smith-publish-success.png)

您現在可以在網頁瀏覽器中訪問這些 URL 來檢視您已發布的網站。

---

您已成功將網站發布至 WebSmith Cloud。若需進行變更，您可以修改內容後再次執行 `publish` 指令，或使用 `update` 指令進行更具體的修改。更多詳細資訊，請參閱 [更新網站](./guides-update-website.md)。

若需部署至其他目標，請參考以下指南：

- [至現有網站](./guides-publish-website-to-existing-website.md)
- [至新的專用網站](./guides-publish-website-to-new-dedicated-website.md)