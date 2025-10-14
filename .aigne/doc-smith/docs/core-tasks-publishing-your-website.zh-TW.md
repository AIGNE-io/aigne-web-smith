# 發佈您的網站

網站生成後，下一步就是讓它在網際網路上可供存取。這個過程稱為發佈。AIGNE WebSmith 透過提供單一指令 `aigne web publish` 來簡化此任務，該指令提供多種目的地選項以滿足不同需求，從快速的免費託管到專業的自訂網域。

本節概述了可用的發佈選項。每個選項都在其各自的指南中詳細說明，以提供清晰、逐步的指示。

### 發佈選項

WebSmith 提供三種主要方法來發佈您的網站。請選擇最符合您專案需求的方法。

<x-cards data-columns="3">
  <x-card data-title="發佈至 WebSmith Cloud" data-icon="lucide:cloud" data-href="/core-tasks/publishing-your-website/cloud">
    讓您的網站上線最快的方法。使用我們的免費公共託管服務。此選項非常適合用於測試、開源專案或社群分享。
  </x-card>
  <x-card data-title="發佈至您自己的網站" data-icon="lucide:server" data-href="/core-tasks/publishing-your-website/custom">
    適用於已在 ArcBlock 平台上建立網站的使用者。本指南說明如何將您新產生的頁面整合並發佈到現有的基礎架構中。
  </x-card>
  <x-card data-title="發佈至新的專用網站" data-icon="lucide:globe" data-href="/core-tasks/publishing-your-website/new-dedicated-website">
    一項付費服務，可建立具備自訂網域和託管功能的新專用網站。這是專業和商業用途的建議選擇。
  </x-card>
</x-cards>

### 發佈流程

發佈流程由 `aigne web publish` 指令處理。當您在沒有任何先前設定的情況下首次執行此指令時，WebSmith 將啟動一個互動式提示，引導您選擇上述選項之一。

一般工作流程如下：

```d2
direction: down

user: {
  shape: c4-person
  label: "使用者"
}

cli: {
  label: "AIGNE CLI"
}

interactive-prompt: {
  label: "互動式提示"
  shape: diamond
}

websmith-cloud: {
  label: "WebSmith Cloud"
  shape: cylinder
}

existing-website: {
  label: "現有網站"
  shape: cylinder
}

new-website: {
  label: "新的專用網站"
  shape: cylinder
}

user -> cli: "執行 `aigne web publish`"
cli -> interactive-prompt: "是否已設定發佈目的地？"

interactive-prompt -> websmith-cloud: "否 -> 選擇 'WebSmith Cloud'"
interactive-prompt -> existing-website: "否 -> 選擇 '現有網站'"
interactive-prompt -> new-website: "否 -> 選擇 '新網站'"
interactive-prompt -> existing-website: "是"
```

### 開始使用

要開始，只需在您的終端機中執行發佈指令即可。

```bash
aigne web publish
```

如果這是您第一次發佈，系統將提示您選擇一個目的地。關於每個選項的詳細說明，請參閱上方連結的特定指南。

### 總結

WebSmith 提供了一個靈活的發佈系統，以適應各種部署情境。您可以從免費的雲端託管開始，之後隨著需求的演變，再轉換到自訂或專用網站。

若要繼續，請從上述選項中選擇一篇發佈指南。我們建議從 [發佈至 WebSmith Cloud](./core-tasks-publishing-your-website-cloud.md) 開始，以進行快速而直接的初始部署。