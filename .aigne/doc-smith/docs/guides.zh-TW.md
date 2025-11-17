# 指南

完成初始設定並產生您的第一個網站後，您將主要使用一套指南來進行日常操作。本中心總結了最常見的工作流程——產生、發佈、修改內容、本地化和調整樣式——讓您可以直接跳到您需要的任務。

每個任務都被設計成一個直接的命令列操作。典型的工作流程包括產生初始網站、反覆更新其內容或結構，然後發佈變更。

### 標準工作流程

下圖說明了使用 WebSmith 建立和維護網站的標準、順序工作流程。

```d2
direction: down

config: {
  label: "1. 定義需求\n(例如 my-website.yaml)"
  shape: rectangle
}

generate: {
  label: "2. 建立網站\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. 修改內容\n`aigne web update`"
  shape: rectangle
}

publish: {
  label: "4. 發佈網站\n`aigne web publish`"
  shape: rectangle
}

live_site: {
  label: "線上網站"
  shape: cylinder
}

config -> generate: "初始建立"
generate -> update: "審閱與修改"
update -> update: "反覆變更"
update -> publish: "部署變更"
publish -> live_site: "上線"
```

您將在下方找到針對每個工作流程的詳細指南。

<x-cards data-columns="2">
  <x-card data-title="建立網站" data-icon="lucide:bot" data-href="/guides/create-website">
    了解如何使用 `generate` 命令，從一個概述您需求的設定檔中建立一個完整的網站。
  </x-card>
  <x-card data-title="發佈網站" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    探索發佈網站的不同選項，從免費的 WebSmith Cloud 到您自己的自訂網域。
  </x-card>
  <x-card data-title="更新網站" data-icon="lucide:file-pen-line" data-href="/guides-update-website">
    了解何時應更新您的結構，何時應更新單一頁面，然後跳至每個工作流程的詳細指南。
  </x-card>
  <x-card data-title="本地化網站" data-icon="lucide:languages" data-href="/guides/localize-website">
    使用 `translate` 命令自動為您的網站頁面建立不同語言的版本。
  </x-card>
  <x-card data-title="自訂主題" data-icon="lucide:palette" data-href="/guides/customize-theme">
    涵蓋如何使用 `theme` 命令來產生並應用不同的視覺風格和配色方案到您的網站。
  </x-card>
  <x-card data-title="使用自訂元件庫" data-icon="lucide:cubes" data-href="/advanced-features/use-custom-component-libraries">
    解釋如何使用 `component` 命令來拉取和更新用於建構您網站的元件庫。
  </x-card>
  <x-card data-title="互動模式" data-icon="lucide:message-square-plus" data-href="/guides/interactive-mode">
    了解如何使用 `chat` 命令，以對話的方式互動式地建構和修改您的網站。
  </x-card>
  <x-card data-title="管理偏好設定" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    解釋如何使用 `prefs` 命令來檢視、管理和清除已儲存的使用者偏好設定，以自訂 WebSmith 的行為。
  </x-card>
  <x-card data-title="管理更新歷史" data-icon="lucide:history" data-href="/guides/update-website/manage-update-history">
    了解如何使用 `history` 命令來檢閱更新過程中記錄的所有變更。
  </x-card>
  <x-card data-title="清理工作區" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    向您展示如何使用 `clear` 命令來安全地移除已產生的檔案、工作區資料或整個設定。
  </x-card>
</x-cards>

---

本節涵蓋了管理您網站的基本命令。有關所有可用命令及其參數的完整列表，請參閱[命令參考](./reference-command.md)。
