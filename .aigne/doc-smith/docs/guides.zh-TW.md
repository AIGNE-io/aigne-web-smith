# 指南

需要日常管理您的網站嗎？本節為您提供常見操作的逐步指南，例如建立網站、發布更新、管理翻譯以及自訂外觀與風格。遵循這些教學，讓您的網站順利運行。

下圖說明了使用這些指令管理網站的典型生命週期：
```d2
direction: down

User: {
  shape: c4-person
}

Local-Workspace: {
  label: "本地工作區"
  shape: rectangle
  style.stroke-dash: 4

  websmith-create: {
    label: "1. websmith create"
  }

  Development-Cycle: {
    label: "2. 開發週期（迭代）"
    shape: rectangle
    websmith-update: {
      label: "websmith update"
    }
    websmith-theme: {
      label: "websmith theme"
    }
    websmith-translate: {
      label: "websmith translate"
    }
  }

  websmith-publish: {
    label: "3. websmith publish"
  }
}

WebSmith-Cloud: {
  label: "WebSmith Cloud"
  shape: cylinder
}

User -> Local-Workspace.websmith-create: "初始化網站"
Local-Workspace.websmith-create -> Local-Workspace.Development-Cycle
Local-Workspace.Development-Cycle -> Local-Workspace.websmith-publish: "定稿變更"
Local-Workspace.websmith-publish -> WebSmith-Cloud: "部署網站"

```

<x-cards data-columns="2">
  <x-card data-title="建立網站" data-icon="lucide:plus-square" data-href="/guides/create-website">
    詳細介紹建立工作流程，包括設定欄位、提示以及在發布前驗證輸出的方法。
  </x-card>
  <x-card data-title="更新網站" data-icon="lucide:file-pen-line" data-href="/guides/update-website">
    了解如何使用「update」指令進行變更或提供回饋，以改善您現有頁面的內容。
  </x-card>
  <x-card data-title="發布網站" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    解釋每個發布目標，從 WebSmith Cloud 到完全自訂的基礎設施，並提供先決條件和驗證技巧。
  </x-card>
  <x-card data-title="本地化網站" data-icon="lucide:languages" data-href="/guides/localize-website">
    解釋如何使用「translate」指令自動為您的網站頁面建立不同語言的版本。
  </x-card>
  <x-card data-title="自訂主題" data-icon="lucide:palette" data-href="/guides/customize-theme">
    涵蓋如何使用「theme」指令來產生並應用不同的視覺風格和配色方案到您的網站。
  </x-card>
  <x-card data-title="管理偏好設定" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    解釋如何使用「prefs」指令來檢視、管理和清除已儲存的使用者偏好設定，以自訂 WebSmith 的行為。
  </x-card>
  <x-card data-title="清理工作區" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    向您展示如何使用「clear」指令安全地移除產生的檔案、工作區資料或整個設定。
  </x-card>
  <x-card data-title="互動模式 (Beta)" data-icon="lucide:bot" data-href="/guides/interactive-mode">
    使用互動模式作為對話式副駕駛，以迭代方式規劃、編輯和完善您的網站。
  </x-card>
</x-cards>

## 總結

這些指南涵蓋了管理您網站生命週期的基本指令。有關更進階的主題和完整的指令列表，請參閱 [進階功能](./advanced-features.md) 和 [參考](./reference.md) 部分。