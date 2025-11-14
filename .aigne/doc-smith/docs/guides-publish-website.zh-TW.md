# 發佈網站

當您的頁面在本地看起來不錯時，執行 `aigne web publish` 將其發佈上線。此命令每次都使用相同的流程——選擇一個目的地，授權一次，然後 WebSmith 會為您上傳所有頁面及資產。

## 最快路徑 (WebSmith Cloud)

如果您只需要一個公開的 URL，請遵循以下步驟：

1. **執行命令**
   ```bash 快速發佈 icon=lucide:terminal
   aigne web publish
   ```
   別名 `aigne web pub` 和 `aigne web p` 也同樣有效。
2. **選擇 WebSmith Cloud**
   當提示出現時，選擇 **WebSmith Cloud**（預設選項）並按下 Enter。
3. **授權一次**
   終端機會打開一個瀏覽器，以便您登入並批准發佈存取權限。完成這一次性步驟後，憑證將被快取在本地。
4. **等待部署**
   WebSmith 會壓縮您生成的檔案，上傳媒體，並在完成後印出上線的 URL。稍後重新執行相同的命令以發佈更新——除非您更改目的地，否則不會有額外的提示。

> **提示：** 若要編寫部署腳本或跳過提示，請新增 `--appUrl https://your-site.com`。終端機命令會記住上次發佈的 URL，因此未來的執行將完全自動化。

## 何時使用其他選項

根據您的託管策略選擇目的地。下面的每張卡片都連結到一個專門的演練。

<x-cards data-columns="3">
  <x-card data-title="至 WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/cloud">
    讓您的網站上線的最快方式。使用我們免費的公開託管服務。此選項非常適合測試、開源專案或社群分享。
  </x-card>
  <x-card data-title="至現有網站" data-icon="lucide:server" data-href="/guides/publish-website/custom">
    適用於已在 ArcBlock 平台上建立網站的用戶。本指南說明如何將您新生成的頁面整合併發佈到現有基礎設施。
  </x-card>
  <x-card data-title="至新的專用網站" data-icon="lucide:globe" data-href="/guides/publish-website/new-dedicated-website">
    一項付費服務，可創建一個具有自訂網域和託管功能的新專用網站。這是專業和商業用途的推薦選擇。
  </x-card>
</x-cards>

如果您想從 WebSmith Cloud 轉移到另一個目的地（或反之），請執行 `aigne web clear --targets deploymentConfig` 來重設快取的部署目標，然後再次執行 `aigne web publish` 並選擇新的目的地。