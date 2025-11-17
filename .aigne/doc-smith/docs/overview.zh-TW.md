# 總覽

需要推出一個專業網站，但沒有時間編寫程式碼或聘請開發團隊嗎？AIGNE WebSmith 將整個過程自動化，只需一個指令，就能將您的產品簡介轉化為一個完整、多頁面、內容豐富、設計現代且經過 SEO 優化的網站。

AIGNE WebSmith 是一款由 AI 驅動的工具，可根據您的願景和需求自動創建專業網站。它建立在 [AIGNE 框架](https://www.aigne.io/framework)之上，並利用 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o) 元件來生成可立即上線、響應式的網站。

該工具解決了網站創建中的常見挑戰：耗時、需要技術專業知識，以及在多個頁面間維持內容品質的困難。透過自動化此過程，WebSmith 有助於確保您的網站在數小時內就能專業、一致地準備就緒，而非數週。

## 主要功能

AIGNE WebSmith 透過一系列智慧功能簡化了整個網站創建過程。

<x-cards data-columns="3">
  <x-card data-title="AI 驅動生成" data-icon="lucide:brain-circuit">
    WebSmith 使用 AI 智慧地規劃您的網站結構，為每個頁面生成引人入勝且相關的內容，並確保從一開始就針對搜尋引擎進行優化。
  </x-card>
  <x-card data-title="專業範本" data-icon="lucide:layout-template">
    您的網站將使用一系列現代化、專業設計的元件庫來建構。最終的範本是完全響應式的，確保您的網站在桌上型電腦、平板電腦和行動裝置上都能完美呈現。
  </x-card>
  <x-card data-title="一鍵發布" data-icon="lucide:rocket">
    一旦您的網站生成完畢，只需一個指令即可發布。WebSmith 會處理整個過程，並立即提供一個可供分享的線上 URL。
  </x-card>
</x-cards>

## 核心能力

WebSmith 提供一套全面的功能，處理從概念到發布的完整網站生命週期。

*   **AI 驅動生成**：分析您的需求，提出合乎邏輯的網站結構，並生成能有效向目標受眾傳達訊息的內容。
*   **多語言支援**：將您的網站翻譯成 12 種語言，包括英語、簡體中文和日語。翻譯過程具備情境感知能力，以保持品牌語氣和技術準確性。
*   **與大型語言模型 (LLM) 整合**：可連接各種大型語言模型 (LLM)。預設情況下，它使用 [AIGNE Hub](https://www.aigne.io/hub)，這項服務讓您可以在 Google Gemini 和 OpenAI GPT 等模型之間切換，而無需單獨的 API 金鑰。您也可以設定自己的 API 金鑰以直接存取供應商。
*   **使用 Pages Kit 進行專業設計**：使用 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o) 生成網站，這是一個包含現代化、響應式元件的函式庫。每個區塊都看起來像是可立即上線的成品，並在桌上型電腦、平板電腦和行動裝置上無縫運作。
*   **智慧更新**：偵測您需求中的變更，並更新網站的相應頁面。您還可以提供具體回饋來完善生成的內容。
*   **發布選項**：只需一個指令即可發布您的網站。您可以部署到 WebSmith Cloud 或您自己的自訂網域，並完全控制部署設定。

## 運作方式

WebSmith 的運作方式是分析您的需求，以理解您的願景、目標受眾和期望的功能。基於此分析，它會生成一套完整的網站，從導覽結構到詳細的頁面內容和樣式。

```d2
direction: down

Requirements: {
  label: "產品簡介與需求"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Planning-Engine: {
    label: "規劃引擎"
    shape: rectangle
  }

  Generation-Engine: {
    label: "生成引擎"
    shape: rectangle
  }

  Theme-Engine: {
    label: "主題引擎"
    shape: rectangle
  }

  LLMs: {
    label: "大型語言模型"
    shape: rectangle

    AIGNE-Hub: {
      label: "AIGNE Hub"
    }

    Direct-Access: {
      label: "直接存取"
      shape: rectangle
      Google-Gemini: {}
      OpenAI-GPT: {}
    }
  }
}

Pages-Kit: {
  label: "Pages Kit 元件"
  shape: rectangle
}

Published-Website: {
  label: "已發布的網站"
  shape: rectangle

  WebSmith-Cloud: {
    label: "WebSmith Cloud"
  }

  Custom-Domain: {
    label: "自訂網域"
  }
}

Requirements -> AIGNE-WebSmith.Planning-Engine: "分析"
AIGNE-WebSmith.Planning-Engine -> AIGNE-WebSmith.Generation-Engine: "規劃"
AIGNE-WebSmith.Generation-Engine <-> AIGNE-WebSmith.LLMs: "利用"
AIGNE-WebSmith.Generation-Engine -> AIGNE-WebSmith.Theme-Engine: "生成"
AIGNE-WebSmith.Theme-Engine -> Pages-Kit: "應用"
Pages-Kit -> Published-Website: "發布"
```

1.  **描述您的網站**：您首先需要建立一個簡單的檔案，概述您的網站主題、目標受眾以及您需要的頁面。這可以是一個新的 SaaS 產品、個人作品集或技術文件中心。
2.  **透過指令生成**：您執行 `aigne web generate` 指令。AI 會分析您的需求，規劃出最佳的網站結構，撰寫所有內容，並使用專業的設計元件組裝頁面。
3.  **即時發布**：當您準備就緒後，執行 `aigne web publish` 指令。WebSmith 會上傳所有必要的檔案，並為您的新網站提供一個可供使用的線上 URL。

## 可用指令

WebSmith 透過命令列介面操作。下表總結了主要指令及其功能。

| 指令 | 說明 |
| :--- | :--- |
| `generate` | 根據您的需求和內容簡介創建一個新網站。 |
| `update` | 根據回饋或需求變更修改現有頁面。 |
| `translate` | 將您的網站翻譯成 12 種支援的語言之一或多種。 |
| `publish` | 將您的網站部署到一個可供存取的線上 URL。 |
| `theme` | 生成或更新您網站的視覺主題和樣式。 |
| `history` | 查看對您網站所做的更新歷史記錄。 |
| `chat` | 啟動互動模式會話，以生成和管理您的網站。 |
| `clear` | 移除生成的檔案、設定和快取資料。 |
| `init` | 引導您完成一個互動過程，以創建初始設定檔。 |
| `prefs` | 管理用於網站生成的已儲存偏好設定和組態。 |

## WebSmith 適合哪些人？

AIGNE WebSmith 非常適合任何需要快速創建高品質網站的人，包括：

- **中小型企業主**：推出專業的網路形象以吸引客戶。
- **開發者與新創公司**：快速創建行銷網站、登陸頁面或產品展示頁。
- **行銷人員**：無需依賴開發團隊即可部署活動網站和內容中心。
- **代理商**：快速製作原型並以一致的品質交付客戶網站。

## 後續步驟

準備好創建您的第一個網站了嗎？請遵循我們的綜合指南開始。

<x-cards>
  <x-card data-title="開始使用" data-icon="lucide:rocket" data-href="/getting-started">
    遵循我們的逐步指南，安裝 AIGNE WebSmith、連接到 AIGNE Hub，並在 30 分鐘內生成您的第一個專業網站。
  </x-card>
</x-cards>