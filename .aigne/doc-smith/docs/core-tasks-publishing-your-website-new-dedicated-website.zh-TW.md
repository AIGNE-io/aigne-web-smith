# 發佈至新的專屬網站

本指南提供將您的內容發佈至一個全新專屬網站的系統化流程。此選項為付費服務，為您的專案提供一個全代管的託管環境，適用於需要自訂網域和專屬資源的專業用途。

此流程為自動化。在您啟動指令後，AIGNE WebSmith 將引導您完成一次性的設定與付款流程。完成後，您的網站將被建立，內容也將發佈至該網站。

## 流程概覽

發佈至新的專屬網站涉及一系列由 `publish` 指令處理的自動化步驟。該指令會與部署服務介接，以配置和設定所有必要的資源。

工作流程如下：
1.  **啟動**：使用者執行 `aigne web publish` 指令。
2.  **選擇選項**：使用者從互動式提示中選擇「New dedicated website」選項。
3.  **付款與資源配置**：使用者將被導向一個安全的網頁以完成付款。系統接著會自動設定網站託管與環境。
4.  **內容部署**：AIGNE WebSmith 會將產生的頁面上傳並發佈至新建立的網站。
5.  **確認**：使用者會收到新網站的線上網址。

## 逐步說明

若要發佈您的網站，請確實遵循以下步驟。

### 1. 啟動發佈指令

首先，請確保您已使用 `aigne web generate` 指令產生了網站頁面。一旦您的內容在輸出目錄中準備就緒，請在您的終端機中執行以下指令：

```bash
aigne web publish
```

### 2. 選擇發佈選項

您將會看到數個發佈選項。請使用方向鍵來反白並選擇「New dedicated website」選項。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
❯ New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

按下 Enter 鍵確認您的選擇。

### 3. 完成設定與付款

選擇該選項後，自動化設定流程將會開始：

1.  **付款**：您的終端機中會出現一則訊息，表示付款流程正在開始。一個安全的付款連結將在您的預設網頁瀏覽器中開啟。

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

2.  **資源配置**：請依照網頁上的指示完成付款。在此期間，命令列工具將會等待。一旦付款確認，系統將自動繼續設定。您將在終端機中看到進度更新。

    ```text
    📦 Step 2/4: Setting up your website...
    🚀 Step 3/4: Starting your website...
    🌐 Step 4/4: Getting your website URL...
    ```

3.  **完成**：設定完成後，終端機將顯示一則確認訊息，其中包含您新網站的網址以及管理您訂閱的連結。

    ```text
    🔗 Your website is ready at: https://your-new-site.example.com
    🔗 Manage your subscription at: https://billing.example.com/manage/sub_12345
    ```

### 4. 自動發佈內容

專屬網站成功配置後，AIGNE WebSmith 將立即開始上傳您產生的頁面和媒體資產。此流程完全自動化。

完成後，您將收到一則最終確認訊息，其中列出已發佈頁面的線上網址。

```text
✅ Pages published successfully! (`15/15` pages, `42` media assets)

🔗 Live URLs:
   https://your-new-site.example.com/
   https://your-new-site.example.com/about
   https://your-new-site.example.com/services
   ...

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## 恢復未完成的設定

如果先前曾嘗試建立專屬網站但未完成（例如，放棄了付款流程），系統將會儲存该工作階段的詳細資訊。當您下次執行 `aigne web publish` 時，您將看到一個額外的選項以恢復該流程。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

選擇此「Resume」選項可讓您從上次中斷的地方繼續，無須重新開始或再次付款（如果款項已處理）。系統將使用已儲存的 `checkoutId` 來還原先前的工作階段並完成網站設定。

## 總結

您已成功將您的專案發佈至一個新的專屬網站。您的內容現在已上線，可透過提供的網址存取。若要進行變更，您可以使用 `aigne web update` 更新內容，或使用 `aigne web generate` 重新產生整個網站結構，然後再執行一次 `aigne web publish` 指令。系統將使用已儲存的配置將更新發佈至同一個網站。