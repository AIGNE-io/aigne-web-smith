網站產生後，最後一步就是讓它在線上可供存取。本指南涵蓋了使用 AIGNE WebSmith 發佈您網站的各種方法，確保您可以選擇最符合您技術和預算需求的選項。

`aigne web publish` 指令是部署您產生的網站檔案的主要工具。根據您的需求，您可以部署到免費的 WebSmith Cloud、與您自己現有的基礎設施整合，或設定一個新的專用網站。

### 發佈目的地

WebSmith 提供三個不同的發佈目標。關於詳細的逐步說明，請參考每個選項的具體指南。

<x-cards data-columns="3">
  <x-card data-title="至 WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/to-websmith-cloud">發佈至我們免費、託管的託管平台。適合開源專案、個人網站或社群分享。</x-card>
  <x-card data-title="至現有網站" data-icon="lucide:server" data-href="/guides/publish-website/to-existing-website">將產生的頁面直接整合並部署到您目前自行管理的網站基礎設施上。</x-card>
  <x-card data-title="至新的專用網站" data-icon="lucide:globe" data-href="/guides/publish-website/to-new-dedicated-website">建立並發佈到一個具備自訂網域和專業託管的全新、完全託管的網站。此為付費服務。</x-card>
</x-cards>

### 一般流程

無論目的地為何，發佈流程都由一個指令啟動。該工具隨後會引導您完成任何必要的身份驗證或設定步驟。

1.  **產生您的網站**：在發佈前，請確保您已使用 `aigne web generate` 指令建立您的網站。
2.  **執行發佈指令**：在您的終端機中執行以下指令：
    ```sh aigne web publish icon=lucide:upload-cloud
    aigne web publish
    ```
3.  **遵循互動式提示**：CLI 將會呈現可用的發佈選項。如果您尚未指定目標，系統將會要求您選擇一個。首次連接至某個服務時，將會開啟一個瀏覽器視窗進行身份驗證。

    ![WebSmith 發佈選項](../../../assets/images/web-smith-publish-resume.png)

4.  **驗證部署**：指令完成後，將會輸出確認訊息以及您已發佈頁面的線上網址。建議您造訪這些連結，以驗證部署是否成功，且網站顯示是否符合預期。

    ![成功發佈輸出](../../../assets/images/web-smith-publish-success.png)

### 摘要

發佈您的網站是一個由 `aigne web publish` 指令處理的直接流程。透過提供多個部署目標，WebSmith 確保了各種使用案例的靈活性。

關於每種發佈方法的具體說明，請參考詳細指南：

-   [至 WebSmith Cloud](./guides-publish-website-to-websmith-cloud.md)
-   [至現有網站](./guides-publish-website-to-existing-website.md)
-   [至新的專用網站](./guides-publish-website-to-new-dedicated-website.md)