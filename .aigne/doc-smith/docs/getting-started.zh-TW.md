# 入門指南

本指南提供逐步流程，幫助您使用 AIGNE WebSmith 產生第一個完整且專業的網站。整個過程設計在 30 分鐘內完成，無需任何程式設計知識。

遵循這些說明，您將安裝必要的工具、定義您網站的需求，並使用單一指令自動產生所有頁面和內容。

### 流程概覽

從概念到上線網站的過程包含三個主要階段。每個階段都是一個建立在前一階段基礎上的邏輯步驟，確保過程順暢且結果可預測。

```d2
direction: down

step1: {
  label: "1. 安裝"
  shape: oval
}

step2: {
  label: "2. 準備您的內容"
  shape: oval
}

step3: {
  label: "3. 您的第一個網站"
  shape: oval
}

result: {
  label: "完整的網站"
  shape: rectangle
  style.fill: "#D5E8D4"
}

step1 -> step2: "安裝 CLI 工具"
step2 -> step3: "定義您網站的目標"
step3 -> result: "用一個指令產生"
```

### 打造新網站的路徑

首先，請依序閱讀以下各節。每一節都包含該階段的詳細說明。

<x-cards>
  <x-card data-title="安裝" data-icon="lucide:download" data-href="/getting-started/installation">
    提供清晰、逐步的說明，教您如何安裝 AIGNE 命令列介面 (CLI)，這是使用 WebSmith 所需的必要工具。
  </x-card>
  <x-card data-title="準備您的內容" data-icon="lucide:clipboard-list" data-href="/getting-started/preparing-your-content">
    說明您應該準備好的關鍵資訊和內容想法。充分的準備有助於 AI 根據您的需求產生最佳的網站。
  </x-card>
  <x-card data-title="您的第一個網站" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
    一個實作教學，引導您建立一個簡單的設定檔，並使用一個指令產生一個完整的多頁面網站。
  </x-card>
</x-cards>

### 總結

完成本節概述的步驟後，您將成功產生一個新網站。下一步是學習如何管理、更新和發布您的網站。

關於將網站發布到雲端、更新其內容以及執行其他常見任務的詳細指南，請前往 [核心任務](./core-tasks.md) 章節。