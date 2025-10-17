# 總覽

AIGNE WebSmith 是一款由 AI 驅動的工具，旨在自動化建立專業、內容豐富的網站。它能處理從規劃網站結構、撰寫內容，到生成最終頁面並發佈上線的所有事務。這讓您能以最少的精力，且無需任何技術專業知識，就能將一個簡單的想法變成一個上線且 SEO 最佳化的網站。

AIGNE WebSmith 建構於強大的 [AIGNE 框架](https://www.aigne.io/framework) 之上，如同您的自動化網站開發團隊。您只需提供網站的願景，AI Agent 就會完成繁重的工作，確保產出高品質的成果，隨時準備好呈現給您的受眾。

## 主要功能

AIGNE WebSmith 透過一系列智慧功能，簡化了整個網站建立流程。

<x-cards data-columns="3">
  <x-card data-title="AI 驅動生成" data-icon="lucide:brain-circuit">
    WebSmith 使用 AI 智慧地規劃您的網站結構，為每個頁面生成引人入勝且相關的內容，並確保從一開始就對搜尋引擎進行了最佳化。
  </x-card>
  <x-card data-title="專業範本" data-icon="lucide:layout-template">
    您的網站將使用一個由現代化、專業設計的元件庫來建構。最終的範本是完全響應式的，確保您的網站在桌上型電腦、平板電腦和行動裝置上都能完美呈現。
  </x-card>
  <x-card data-title="一鍵發佈" data-icon="lucide:rocket">
    網站生成後，只需一個指令即可發佈。WebSmith 會處理整個流程，並立即提供一個可上線的 URL 供您与世界分享。
  </x-card>
</x-cards>

## 運作方式

整個流程設計得簡單而高效。您無需執行一系列複雜的技術步驟，而是透過簡單的指令和描述與系統互動。

```d2
direction: down

User: {
  shape: c4-person
  label: "您"
}

Define-Requirements: {
  label: "1. 定義您的網站"
  style.fill: "#f0f9ff"
}

AI-Generation: {
  label: "2. AI 生成網站"
  style.fill: "#f0f9ff"

  sub-process: {
    direction: right
    Plan-Structure: "規劃結構"
    Write-Content: "撰寫內容"
    Build-Pages: "建構頁面"
  }
}

Publish: {
  label: "3. 發佈上線"
  style.fill: "#f0f9ff"
}

Live-Website: {
  label: "上線網站"
  shape: cylinder
  style.fill: "#ecfdf5"
}

User -> Define-Requirements: "提供您需求的\n簡單描述"
Define-Requirements -> AI-Generation: "'aigne web generate'"
AI-Generation -> Publish: "生成的檔案"
Publish -> Live-Website: "'aigne web publish'"
```

1.  **描述您的網站**：首先，您需要建立一個簡單的檔案，概述您的網站主題、目標受眾以及需要的頁面。這可以是一個新的 SaaS 產品、個人作品集或技術文件中心。
2.  **透過指令生成**：接著，您執行 `aigne web generate` 指令。AI 會分析您的需求，規劃最佳的網站結構，撰寫所有內容，並使用專業的設計元件組裝頁面。
3.  **立即發佈**：準備就緒後，您執行 `aigne web publish` 指令。WebSmith 會上傳所有必要的檔案，並為您的新網站提供一個可上線的 URL。

## WebSmith 適合哪些人？

AIGNE WebSmith 非常適合任何需要快速建立高品質網站的人，包括：

- **中小型企業主**：建立專業的網路形象以吸引客戶。
- **開發者與新創公司**：為您的產品快速建立行銷網站、部落格或文件。
- **行銷人員**：無需依賴開發團隊，即可部署登陸頁面和內容中心。
- **創作者**：輕鬆建立個人品牌或作品集網站。

## 後續步驟

既然您已對 AIGNE WebSmith 的功能有了宏觀的了解，您已準備好建立您的第一個網站了。

- **[開始使用](./getting-started.md)**：遵循我們的指南安裝必要的工具，並在 30 分鐘內生成您的第一個網站。