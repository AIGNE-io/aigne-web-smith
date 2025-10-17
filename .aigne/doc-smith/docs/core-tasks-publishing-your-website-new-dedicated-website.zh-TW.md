# 發佈至新的專屬網站

本指南提供了一個系統化的流程，說明如何將您的內容發佈到一個新的專屬網站。此選項是一項付費服務，會為您的專案佈建一個全託管的主機環境，適合需要自訂網域和專屬資源的專業用途。

此流程是自動化的。在您啟動指令後，AIGNE WebSmith 將引導您完成一次性的設定和付款流程。完成後，您的網站將被建立，並且您的內容將會發佈至該網站。

## 流程概覽

發佈至新的專屬網站涉及一系列由 `publish` 指令處理的自動化步驟。該指令會與部署服務對接，以佈建和設定所有必要的資源。

工作流程如下：

1.  **啟動**：使用者執行 `aigne web publish` 指令。
2.  **選項選擇**：使用者從互動式提示中選擇「New dedicated website」選項。
3.  **確認資產**：系統會提示使用者確認是否在部署中包含品牌、導覽和語系設定。
4.  **付款與佈建**：使用者將被引導至一個安全的網頁以完成付款。接著，系統會自動設定網站主機和環境。
5.  **內容部署**：AIGNE WebSmith 會將產生的頁面上傳並發佈到新建網站上的一個預設專案中。
6.  **確認**：使用者會收到新網站的線上網址。

## 詳細步驟說明

若要發佈您的網站，請確實遵循以下步驟。

### 1. 啟動發佈指令

首先，請確保您已使用 `aigne web generate` 指令產生了網站頁面。一旦您的內容在輸出目錄中準備就緒，請在您的終端機中執行以下指令：

```bash
aigne web publish
```

### 2. 選擇發佈選項

您將會看到幾個發佈選項。請使用方向鍵來反白並選擇「New dedicated website」選項。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.aigne.io) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
❯ New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

按下 Enter 鍵以確認您的選擇。

### 3. 確認附加資產

選擇建立新網站後，系統會詢問您是否要發佈附加的網站資產。這包括您專案中定義的品牌細節（名稱、描述）、導覽結構和語系設定。

```text
? Publish pages to the new dedicated website with locales, navigations and branding? › (Y/n)
```

建議選擇「Yes」（預設選項），以確保您的新網站得到完整設定。發佈這些資產可確保您網站的品牌、選單結構和語言選項被正確應用。

### 4. 完成設定與付款

選擇該選項後，自動化設定流程將會開始：

1.  **付款**：您的終端機中會出現一則訊息，表示付款流程正在開始。一個安全的付款連結將在您的預設網頁瀏覽器中開啟。

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

2.  **佈建**：請按照網頁上的指示完成付款。在此期間，命令列工具將會等待。一旦付款被確認，系統將自動繼續進行設定。您將在終端機中看到進度更新。

    ```text
    📦 Step 2/4: Setting up your website...
    🚀 Step 3/4: Starting your website...
    🌐 Step 4/4: Getting your website URL...
    ```

3.  **完成**：設定完成後，終端機將顯示一則確認訊息，其中包含您新網站的網址以及管理訂閱的連結。

    ```text
    🔗 Your website is ready at: https://your-new-site.example.com
    🔗 Manage your subscription at: https://billing.example.com/manage/sub_12345
    ```

### 5. 自動內容發佈

一旦專屬網站成功佈建，AIGNE WebSmith 將立即開始上傳您產生的頁面和媒體資產。此過程完全自動化。

完成後，您將收到一則最終確認訊息，其中列出了您已發佈頁面的線上網址。

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

如果先前曾嘗試建立專屬網站但未完成（例如，放棄了付款流程），系統將會儲存該次的工作階段詳情。當您下次執行 `aigne web publish` 時，您將會看到一個額外的選項以恢復該流程。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.aigne.io) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

選擇此「Resume」選項可讓您從上次中斷的地方繼續，無需重新開始，如果款項已處理也無需再次付款。系統將使用已儲存的 `checkoutId` 來還原先前的工作階段並完成網站設定。

## 總結

您已成功將您的專案發佈到一個新的專屬網站。您的內容現在已經上線，並可透過提供的網址存取。若要進行變更，您可以使用 `aigne web update` 來更新內容，或使用 `aigne web generate` 重新產生整個網站結構，然後再次執行 `aigne web publish` 指令。系統將使用已儲存的設定將更新發佈到同一個網站。