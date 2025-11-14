# 準備素材

在執行 `aigne web generate` 之前，優秀網站就已奠定基礎。本指南為您提供了一份具體的清單，用於收集簡報、來源文件和證明素材，以便 WebSmith 能夠建立反映您需求的頁面，引用正確的證據，並減少修改週期。

## 工作流程如何運作

```d2
direction: right

Gather: {
  label: "收集簡報 + 資產"
  shape: rectangle
}

Organize: {
  label: "整理 sources/"
  shape: rectangle
}

Configure: {
  label: "更新 config.yaml"
  shape: rectangle
}

Generate: {
  label: "執行 `aigne web generate`"
  shape: rectangle
}

Review: {
  label: "審核頁面 + 迭代"
  shape: rectangle
}

Gather -> Organize -> Configure -> Generate -> Review
```

每個步驟都為下一步提供基礎：雜亂的輸入會導致通用的輸出，而一套精心策劃的內容套件則能讓 WebSmith 在第一時間就聽起來權威十足。

## 步驟 1. 掌握核心要素

建立一份簡短的簡報（Markdown 或 DOCX 格式皆可），回答以下四個問題：

| 問題 | 為何重要 | 範例 |
| :---------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **受眾** | 語氣、詞彙和證明應與頁面的讀者相匹配。 | 「成長階段的金融科技創辦人及其工程主管。」 |
| **問題** | 強迫您清晰地說明您解決的痛點。 | 「手動處理新客戶的流程會產生超過 10 小時的重複性合規審查。」 |
| **差異化** | 避免文案聽起來與所有競爭對手都一樣。 | 「唯一一個在區域資料湖上建立 KYC + KYB 自動化功能的平台。」 |
| **主要行動呼籲 (CTA)** | 將每個區塊都導向單一的轉換行動。 | 「預約 20 分鐘的整合評估。」 |

將此檔案儲存在專案內部，以便您能將其新增至 `sourcesPath`。

## 步驟 2. 收集參考內容與資產

WebSmith 只能使用您提供的資料。請將以下內容整理到一個 `sources` 目錄或類似的資料夾中。

### 建議的內容類型

| 內容類型 | 描述 | 範例 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **產品文件** | 功能分解、架構說明、API 參考、定價解釋。 | `docs/product-overview.md`, `api/quickstart.md` |
| **行銷計畫** | 定位、訊息架構、活動簡報、競爭對手摘要。 | `marketing/positioning.pdf`, `brand/voice.md` |
| **商業計畫** | 使命、願景、路線圖、融資里程碑、領導團隊簡介。 | `company/mission.txt`, `investor/roadmap.pptx` |
| **現有內容** | 部落格文章、常見問題、更新日誌——任何能展現語氣或可重複故事的內容。 | `blog/*.md`, `faq.md`, `release-notes/2024-02.md` |
| **媒體檔案** | Logo、產品截圖、團隊照片、圖表。 | `assets/logo.svg`, `screenshots/dashboard.png` |

### 支援的格式

| 類別 | 格式 |
| :------------ | :--------------------------------------------------------------------------------------------------------- |
| **文字** | `.md`, `.txt`, `.html`, `.json`, `.yaml`, `.xml` |
| **文件** | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| **圖片** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp` |
| **程式碼** | `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`，以及大多數其他用於擷取程式碼片段的主流語言 |

## 步驟 3. 組織所有內容以便重複使用

將檔案進行邏輯分組，這樣您（和 WebSmith）就能清楚地知道什麼內容在哪裡。

```sh project-sources/ icon=lucide:folder-tree
project-sources/
├── 01_briefs/
│   ├── product-overview.md
│   └── audience-matrix.md
├── 02_proof/
│   ├── testimonials.md
│   └── security-metrics.xlsx
├── 03_assets/
│   ├── logo.svg
│   └── dashboard.png
└── 04_content/
    ├── blog/
    └── faq.md
```

使用描述性的資料夾前綴，以便清楚地知道哪些目錄對應到受眾、證明或媒體。

## 步驟 4. 在 `config.yaml` 中配置來源

將 `sourcesPath` 陣列指向您剛剛整理好的目錄（或特定檔案）。這是最重要的單一設定參數。

```yaml config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources/01_briefs
  - ./project-sources/02_proof
  - ./project-sources/03_assets
pagePurpose:
  - saas
targetAudienceTypes:
  - businessOwners
  - developers
rules: >
  Highlight 40% cost savings backed by customer quotes. Mention SOC 2 + ISO 27001.
```

當您執行 `aigne web generate` 時，WebSmith 會遞迴地讀取這些資料夾，將檔案分塊，並在撰寫文案和組合版面時引用它們。

## 選擇適合您的方式

時間有多充裕？選擇適合您情況的方法。

### 快速上手：只是需要個示範？

適合需要快速建立、稍後再完善的場景。

- 準備一份寫得不錯的 README（約 500 字以上）和幾張螢幕截圖
- 將它們新增至 `sourcesPath`
- 執行 `aigne web generate`，查看結果，迭代一次
- 非常適合原型、內部示範或試水

### 推薦方式：打造真正的產品

這是大多數團隊發布真實產品或服務的最佳選擇。

1. 記錄您的**受眾**、**問題**、**差異化**和 **CTA**
2. 為每個角色建立包含功能性與情感性證明的價值矩陣
3. 在讓 WebSmith 撰寫之前，按意圖概述每個頁面區塊
4. 將客戶見證、指標和截圖打包為獨立檔案
5. 產生後，驗證每個區塊是否達成目標，然後完善並重新執行

### 進階玩法：團隊知識庫

適合發布多個網站或維護長期內容系統的團隊。

- 將專業知識拆分為按主題組織的專注 Markdown 檔案
- 範例結構：

```sh
knowledge-base/
├── foundation/
│   ├── mission.md
│   └── brand-voice.md
├── products/
│   ├── payments-overview.md
│   └── payments-technical-specs.md
├── proof-points/
│   ├── case-study-fintech-x.md
│   └── g2-reviews.md
└── audiences/
    ├── developer-persona.md
    └── operator-persona.md
```

- 根據每個專案混合搭配目錄，使每個網站都從單一的真實來源中提取資料。
- 更新一個模組（例如 `case-study-fintech-x.md`）會自動改善所有未來參考它的生成結果。

## 品質檢查清單

- [ ] 每個主張在來源檔案中都有一個資料點、引述或指標。
- [ ] 角色和 CTA 與行銷話術分開記錄。
- [ ] 資產的命名具有描述性（例如 `dashboard-dark.png`，而不是 `image1.png`）。
- [ ] 已排除敏感或僅供內部使用的檔案（WebSmith 會讀取您指向的所有內容）。
- [ ] 來源文件專注於知識；風格指南則放在 `rules` 中。

## 獲得最佳效果的技巧

WebSmith 的設計目標就是一次生成優質網站——但品質取決於您提供的材料。

- **提供具體細節。** 來源材料越具體（資料點、引述、指標），您的網站就越有說服力。
- **將內容拆分為專注的檔案。** 不要放在一個巨型文件裡，而是將主題組織成更小的檔案。這能幫助 WebSmith 精確引用來源，生成更結構化的內容。
- **內容與指令分離。** 將知識內容放在來源檔案中，但將版面和語氣指令放在 `rules` 欄位中。

## 後續步驟

<x-cards data-columns="3">
  <x-card data-title="入門指南" data-icon="lucide:rocket" data-href="/getting-started">
    安裝 AIGNE CLI，執行 `aigne web generate`，並審核您的第一個網站。
  </x-card>
  <x-card data-title="建立網站" data-icon="lucide:wrench" data-href="/guides/create-website">
    了解在產生工作流程中可用的每個選項。
  </x-card>
  <x-card data-title="發布網站" data-icon="lucide:globe" data-href="/guides/publish-website">
    一旦內容看起來很棒，就部署到 WebSmith Cloud 或您自己的基礎設施上。
  </x-card>
</x-cards>
