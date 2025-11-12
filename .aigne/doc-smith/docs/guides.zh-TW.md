# 方法論

一個高品質的網站並非始於巧妙的提示，而是源於結構良好、高品質的知識。本指南提供了一套策略性方法論，教您如何準備內容，以利用 AIGNE WebSmith 獲得最佳成果。系統的輸出品質直接反映了輸入內容的品質。

## 核心原則：知識即基礎

WebSmith 是一個知識轉換系統；它能將您的專業知識轉化為一個功能齊全的網站。因此，生成網站的品質受限於您所提供的來源資料品質。要創建一個卓越的網站，您必須首先以 AI 能有效利用的方式來組織您的知識。本節概述了一種漸進式的方法來建立您的知識庫，從快速入門到可擴展的系統化方法論。下圖說明了這種漸進式方法。

```d2
direction: down

Knowledge-Preparation-Methodology: {
  label: "漸進式知識準備方法論"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Level-1: {
    label: "層級 1：最小可行資料來源"
    shape: rectangle
    style.fill: "#f0f9ff"

    Input-1: {
      label: "輸入：單一文件\n（例如 README）"
      shape: rectangle
    }

    Process-1: {
      label: "流程：生成與迭代"
      shape: diamond
    }

    Output-1: {
      label: "輸出：功能性網站"
      shape: rectangle
    }
  }

  Level-2: {
    label: "層級 2：策略性資料來源（建議）"
    shape: rectangle
    style.fill: "#e6f7ff"

    Input-2: {
      label: "輸入：結構化內容簡報\n（受眾、價值、意圖、證據）"
      shape: rectangle
    }

    Process-2: {
      label: "流程：策略性生成與評估"
      shape: diamond
    }

    Output-2: {
      label: "輸出：有效、目標明確的網站"
      shape: rectangle
    }
  }

  Level-3: {
    label: "層級 3：模組化知識系統（進階）"
    shape: rectangle
    style.fill: "#bae0ff"

    Input-3: {
      label: "輸入：模組化知識庫\n（單一事實來源）"
      shape: rectangle
    }

    Process-3: {
      label: "流程：組合、生成與傳播"
      shape: diamond
    }

    Output-3: {
      label: "輸出：可擴展、一致的網站"
      shape: rectangle
    }
  }
}

Knowledge-Preparation-Methodology.Level-1.Input-1 -> Knowledge-Preparation-Methodology.Level-1.Process-1
Knowledge-Preparation-Methodology.Level-1.Process-1 -> Knowledge-Preparation-Methodology.Level-1.Output-1
Knowledge-Preparation-Methodology.Level-1 -> Knowledge-Preparation-Methodology.Level-2: "複雜度增加"
Knowledge-Preparation-Methodology.Level-2.Input-2 -> Knowledge-Preparation-Methodology.Level-2.Process-2
Knowledge-Preparation-Methodology.Level-2.Process-2 -> Knowledge-Preparation-Methodology.Level-2.Output-2
Knowledge-Preparation-Methodology.Level-2 -> Knowledge-Preparation-Methodology.Level-3: "複雜度增加"
Knowledge-Preparation-Methodology.Level-3.Input-3 -> Knowledge-Preparation-Methodology.Level-3.Process-3
Knowledge-Preparation-Methodology.Level-3.Process-3 -> Knowledge-Preparation-Methodology.Level-3.Output-3

```

## 層級 1：最小可行資料來源

此方法旨在 30 分鐘內生成一個功能性網站，非常適合簡單的專案或需要快速入門的使用者。

### 需求

-   一份主要文件，例如 README 或產品說明，至少 500 字。
-   一個清晰、簡潔的答案，回答「這個產品/服務是什麼，以及為誰而設？」這個問題。
-   3 到 5 張與內容相關的高品質圖片。

### 流程

1.  **設定 `sourcesPath`**：在您的 `config.yaml` 檔案中，將 `sourcesPath` 指向包含您主要文件的目錄。
2.  **生成**：執行 `aigne web generate` 指令。
3.  **檢視與迭代**：檢查初步生成的網站，並找出需要改進的地方。修改您的來源文件並重新生成。

這個層級對於已有文件且產品直接明瞭的情況非常有效。然而，對於訊息傳遞複雜、有多個目標受眾或價值主張細膩的專案來說，這可能不夠。

## 層級 2：策略性資料來源（建議）

要建立一個能有效傳達您市場定位並與目標受眾產生共鳴的網站，需要更具策略性的方法。這包括在生成前，將原始資訊提煉成結構化的內容簡報。

### 1. 定義策略性背景

首先，在一份專門的文件中回答以下核心問題，以建立清晰的基礎：

-   **受眾**：您想觸及的主要和次要受眾是誰？
-   **問題**：您的產品或服務為他們解決了什麼具體問題？
-   **差異化**：是什麼讓您的解決方案與眾不同？避免使用通用的行銷說詞，專注於實質的差異。
-   **行動呼籲 (CTA)**：您最希望訪客採取的單一最重要行動是什麼？

### 2. 將價值與受眾對應

建立一個價值矩陣，闡明您的解決方案如何使每個受眾群體受益。這能確保訊息傳遞是量身訂做且相關的。

| 受眾 | 功能價值 | 情感價值 | 證據 |
| :--- | :--- | :--- | :--- |
| **開發者** | API 優先設計、全面的 SDK | 對可靠性的信心、易於使用 | 99.99% 正常運行時間 SLA、50+ 個程式碼範例 |
| **商業領袖** | 降低 40% 的處理成本 | 安全上的安心、競爭優勢 | PCI DSS Level 1 合規、財星 500 大企業客戶 |

### 3. 帶有意圖地規劃內容

透過定義每個區塊的目的，而不僅僅是其內容，來組織您的內容大綱。這能確保頁面的每個部分都服務於一個策略性目標。

```markdown
# 首頁內容大綱

## 區塊：主視覺
- **意圖**：立即闡明產品的用途和目標受眾。
- **關鍵訊息**：「為現代應用程式打造的支付基礎設施。」
- **支持要點**：「全球超過 10,000 名開發者信賴。」
- **CTA**：「開始建構」

## 區塊：問題陳述
- **意圖**：與受眾的具體痛點產生共鳴。
- **關鍵訊息**：「支付整合不應耗時數月。」
- **支持證據**：包含真實引述或常見的挫折。
```

### 4. 收集證據與素材

收集高品質的素材來證實您的說法。信譽建立在證明之上，而非僅僅斷言。

-   客戶推薦和詳細的案例研究。
-   量化的使用指標和效能數據。
-   真實的產品截圖和示範影片。
-   競爭對手分析，以確立您的獨特定位。

### 5. 生成與評估

執行生成指令後，根據您的策略性目標評估輸出結果：

-   生成的內容是否達成了每個區塊所定義的**意圖**？
-   在瀏覽頁面的前 10 秒內，核心價值主張是否清晰可見？
-   所有重要聲明是否都有您提供的**證據**支持？
-   使用者旅程是否合乎邏輯地導向主要的行動呼籲？

更新您的來源文件以填補任何已發現的缺口，然後重新生成。規劃 2-3 次的優化週期以達到精良的成果。

## 層級 3：模組化知識系統（進階）

對於管理多個產品、維護數個網站，或需要大規模保持訊息一致性的組織而言，將知識視為可重複使用的資產是最有效的策略。

### 模組化知識架構

將您的組織知識分解為獨立、專注的 Markdown 檔案，並按領域組織。這會建立一個單一事實來源，可以針對不同情境選擇性地組合。

建議的目錄結構：

```sh
knowledge-base/
├── 01_foundation/
│   ├── mission-vision.md
│   └── brand-voice-guidelines.md
├── 02_products/
│   ├── product-a-overview.md
│   ├── product-a-features.md
│   └── product-a-technical-specs.md
├── 03_proof-points/
│   ├── customer-testimonials.md
│   └── case-study-enterprise-x.md
└── 04_audiences/
    ├── developer-persona.md
    └── business-buyer-persona.md
```

### 針對情境進行組合

透過將 WebSmith 指向這些模組化檔案的不同組合，可以生成不同的網頁。

-   **開發者入口網站**：由 `product-a-technical-specs.md`、`developer-persona.md` 和相關的 `proof-points/` 組成。
-   **行銷網站**：由 `product-a-overview.md`、`product-a-features.md` 和 `case-study-enterprise-x.md` 組成。

### 模組化系統的優點

-   **一致性**：確保核心訊息和產品細節在所有數位資產中都相同。
-   **效率**：更新單一知識模組會自動將變更傳播到所有使用它的網站。
-   **可擴展性**：隨著產品和網站數量增長，簡化了內容管理。
-   **協作**：允許領域專家擁有並維護特定的知識模組，從而提高準確性和品質。

## 最佳實踐與常見錯誤

遵循經證實的模式並避免常見的陷阱，將顯著提升您生成網站的品質。

### 優質資料來源的特點

-   **具體且明確**：用可衡量的數據取代模糊的陳述。
    -   **避免**：「我們提供最好的解決方案。」
    -   **建議**：「我們將支付處理時間從 3 週縮短到 2 天。」
-   **有證據支持**：用數據、推薦或案例研究來支持每一項聲明。
    -   **避免**：「我們的客戶都愛我們。」
    -   **建議**：「在 G2 上評分為 4.8/5，客戶續約率達 94%。」
-   **了解受眾**：根據目標讀者調整語言和資訊。為開發者提供技術細節，為決策者提供商業成果。
-   **專注且結構化**：將大主題分解為更小、邏輯清晰的文件，每個文件都有明確的目的。

### 應避免的常見錯誤

-   **假設 AI 會「自己搞定」**：AI 會放大它所獲得的資訊。模糊的輸入永遠只會產生模糊的輸出。請明確說明您的定位和受眾。
-   **只提供功能列表**：沒有情境的功能是沒有意義的。將每個功能與它解決的問題及其帶來的好處連結起來。
-   **將知識與格式化指令混合**：不要在您的來源檔案中包含「讓這個區塊更精彩」之類的風格指令。請使用 `config.yaml` 的 `rules` 區塊來指導風格和語氣。
-   **使用單一、龐大的文件**：一個龐大的文件會讓 AI 難以辨別結構和優先順序。將知識分解為專注於特定主題的檔案。
-   **跳過迭代**：第一次生成的輸出應被視為草稿。規劃一個包含評估、優化來源資料和重新生成的多步驟流程。

## 總結

由 AIGNE WebSmith 生成的網站品質，並非取決於提示工程，而是取決於來源知識的品質與結構。透過採用漸進式的方法論——從簡單開始，進階到策略性方法，最終建立一個模組化的知識系統——您可以產出清晰、具說服力且品質一致的網站。

如需更多實作指導，請繼續閱讀 [入門指南](./getting-started.md)。