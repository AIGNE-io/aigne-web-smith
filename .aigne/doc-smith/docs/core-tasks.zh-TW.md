# 核心任務

完成初始設定並產生您的第一個網站後，日常營運將主要使用一組核心指令。本節將實務地概述這些基本任務，例如產生網站、發布更新、優化內容和管理翻譯。

每項任務都設計為簡單直接的命令列操作。典型的工作流程包括產生初始網站、反覆更新其內容或結構，然後發布變更。

### 標準工作流程

下圖說明了使用 WebSmith 建立和維護網站的標準、循序工作流程。

```d2
direction: down

config: {
  label: "1. 定義需求\n（例如：my-website.yaml）"
  shape: rectangle
}

generate: {
  label: "2. 產生網站\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. 優化內容\n`aigne web update`"
  shape: rectangle
}

publish: {
  label: "4. 發布網站\n`aigne web publish`"
  shape: rectangle
}

live_site: {
  label: "上線網站"
  shape: cylinder
}

config -> generate: "初始建立"
generate -> update: "審查與優化"
update -> update: "反覆變更"
update -> publish: "部署變更"
publish -> live_site: "上線"
```

以下您將找到每項核心任務的詳細指南。

<x-cards data-columns="2">
  <x-card data-title="產生網站" data-icon="lucide:bot" data-href="/core-tasks/generating-a-website">
    學習如何使用 `generate` 指令，從概述您需求的設定檔中建立一個完整的網站。
  </x-card>
  <x-card data-title="發布您的網站" data-icon="lucide:upload-cloud" data-href="/core-tasks/publishing-your-website">
    探索發布網站的不同選項，從免費的 WebSmith Cloud 到您自己的自訂網域。
  </x-card>
  <x-card data-title="更新網站內容" data-icon="lucide:file-pen-line" data-href="/core-tasks/updating-website-content">
    了解如何使用 `update` 指令進行變更或提供回饋，以優化現有頁面的內容。
  </x-card>
  <x-card data-title="翻譯您的內容" data-icon="lucide:languages" data-href="/core-tasks/translating-your-content">
    使用 `translate` 指令自動為您的網站頁面建立不同語言的版本。
  </x-card>
  <x-card data-title="管理主題" data-icon="lucide:palette" data-href="/core-tasks/managing-themes">
    介紹如何使用 `theme` 指令為您的網站產生並套用不同的視覺風格和配色方案。
  </x-card>
  <x-card data-title="管理元件" data-icon="lucide:cubes" data-href="/core-tasks/managing-components">
    說明如何使用 `component` 指令來拉取和更新用於建構您網站的元件庫。
  </x-card>
  <x-card data-title="使用互動式聊天" data-icon="lucide:message-square-plus" data-href="/core-tasks/using-the-interactive-chat">
    學習如何使用 `chat` 指令以對話方式互動地建立和修改您的網站。
  </x-card>
  <x-card data-title="管理偏好設定" data-icon="lucide:settings-2" data-href="/core-tasks/managing-preferences">
    說明如何使用 `prefs` 指令來查看、管理和清除已儲存的使用者偏好設定，以自訂 WebSmith 的行為。
  </x-card>
  <x-card data-title="檢視更新歷史" data-icon="lucide:history" data-href="/core-tasks/viewing-update-history">
    學習如何使用 `history` 指令來檢視對您網站內容和結構所做的所有先前更新的日誌。
  </x-card>
  <x-card data-title="清除工作區和資料" data-icon="lucide:trash-2" data-href="/core-tasks/clearing-generated-content">
    向您展示如何使用 `clear` 指令安全地移除已產生的檔案、工作區資料或整個設定。
  </x-card>
</x-cards>

---

本節涵蓋了管理您網站的基本指令。有關所有可用指令及其參數的完整列表，請參閱 [命令列參考](./reference-command-line-reference.md)。