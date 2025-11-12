# 準備您的內容

要從 AIGNE WebSmith 獲得最佳成果，提供正確的來源資料是最關鍵的一步。您網站的品質和相關性直接取決於您提供給 AI 的資訊。本指南概述了在開始之前需要準備的確切內容。

在開始生成網站之前，收集所有描述您的專案、產品或業務的相關文件至關重要。AI 僅使用您提供的檔案作為其知識庫。高品質、全面的來源資料將產生專業且準確的網站，而稀疏或不相關的內容將導致網站變得普通且效果不佳。

若要深入了解如何建構您的知識以獲得最佳成果，請參閱我們的[方法論](./guides.md)指南。

```d2
direction: down

User: {
  shape: c4-person
}

Source-Content: {
  label: "來源內容目錄"
  shape: rectangle
  grid-columns: 2

  Product-Documents: {
    label: "產品文件\n(.md, .pdf, .docx)"
  }

  Marketing-Plans: {
    label: "行銷計畫\n(.md, .pdf)"
  }

  Business-Plans: {
    label: "商業計畫\n(.docx, .md)"
  }

  Media-Assets: {
    label: "媒體素材\n(.svg, .png)"
  }
}

Websmith-Config: {
  label: "websmith-config.yaml"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  icon: "https://www.arcblock.io/image-bin/uploads/89a24f04c34eca94f26c9dd30aec44fc.png"
}

Generated-Website: {
  label: "生成的網站"
  shape: rectangle
}

User -> Source-Content: "1. 準備並組織內容"
User -> Websmith-Config: "2. 定義 sourcesPath"
Websmith-Config -> AIGNE-WebSmith: "3. 提供設定"
Source-Content -> AIGNE-WebSmith: "4. 讀取來源資料"
AIGNE-WebSmith -> Generated-Website: "5. 生成網站"

```

## `sourcesPath` 的作用

在您的設定檔中，`sourcesPath` 參數告訴 AIGNE WebSmith 在哪裡尋找您的內容。您可以指定一個或多個目錄，AI 將遞迴讀取其中的檔案，以了解您的網站應包含哪些內容。

這是決定您生成網站品質最重要的一項設定。

以下是 `sourcesPath` 在 `websmith-config.yaml` 檔案中定義的基本範例：

```yaml websmith-config.yaml icon=lucide:file-code
# 包含您來源資料的目錄。
sourcesPath:
  - ./docs
  - ./product-briefs
# 其他設定細節如下...
pagePurpose: "為新的 SaaS 產品建立一個行銷網站。"
targetAudienceTypes: "潛在客戶、開發者和投資者。"
```

在此範例中，WebSmith 將使用 `./docs` 和 `./product-briefs` 目錄中所有支援的檔案作為生成網站的上下文。

## 您的來源內容應包含什麼

要建立一個有效的網站，AI 需要清楚了解您的目標。您的來源內容應全面涵蓋您的專案或業務的關鍵方面。

### 推薦的內容類型

提供一系列詳細說明您專案的文件。您提供的資訊越詳盡，AI 就越能創作出符合您願景的內容。

| 內容類型 | 描述 | 範例 |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **產品文件** | 關於您的產品或服務、其功能、優點和技術規格的詳細描述。 | `Product-Brief.md`、`Technical-Specifications.pdf`、`Feature-List.docx` |
| **行銷計畫** | 關於您的目標受眾、品牌語氣、關鍵訊息和競爭分析的資訊。 | `Marketing-Strategy.md`、`Brand-Guidelines.pdf`、`Competitor-Analysis.pptx` |
| **商業計畫** | 關於您的業務目標、使命、願景和公司歷史的高階概述。 | `Business-Plan-Q3.docx`、`Company-Overview.md` |
| **現有內容** | 任何已有的文章、部落格文章或文件，可用於重新利用或作為風格和語氣的參考。 | `Blog-Posts/`、`FAQ.md`、`About-Us.txt` |
| **媒體檔案** | 應包含在網站上的圖片、標誌和其他視覺素材。請確保它們的品質足以在網頁上顯示。 | `assets/logo.png`、`images/product-screenshot.jpg` |

### 支援的檔案格式

AIGNE WebSmith 支援多種常見的檔案格式，適用於文字內容和媒體素材。

| 類別 | 支援的格式 |
| :------------ | :----------------------------------------------------------------------------------- |
| **文字** | `.md`、`.txt`、`.html`、`.json`、`.yaml`、`.xml` |
| **文件** | `.pdf`、`.doc`、`.docx`、`.xls`、`.xlsx`、`.ppt`、`.pptx` |
| **圖片** | `.jpg`、`.jpeg`、`.png`、`.gif`、`.svg`、`.webp` |
| **程式碼** | `.js`、`.ts`、`.py`、`.go`、`.rs`、`.java` 和其他常見的程式語言檔案 |

## 如何建構您的內容目錄

一個組織良好的目錄結構有助於您和 AI 有效地管理來源資料。雖然沒有嚴格的資料夾結構要求，但建議採用邏輯性的組織方式。

考慮按用途對您的檔案進行分組。這樣可以更輕鬆地管理您的 `sourcesPath` 設定，並了解正在使用哪些資訊。

以下是一個結構良好的內容目錄範例：

```sh project-sources/ icon=lucide:folder-tree
project-sources/
├── 01-business-plan/
│   ├── company-overview.md
│   └── mission-and-vision.txt
├── 02-product-docs/
│   ├── feature-list.md
│   └── technical-specifications.pdf
├── 03-marketing-materials/
│   ├── brand-guidelines.pdf
│   └── target-audience-profile.docx
└── 04-media-assets/
    ├── logo.svg
    └── product-screenshot.png
```

然後，您可以將您的 `sourcesPath` 設定指向根目錄：

```yaml websmith-config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources
# 其他設定...
```

## 總結

準備您的內容是使用 AIGNE WebSmith 建立高品質網站的基礎步驟。透過收集全面的來源資料，並使用 `sourcesPath` 正確指向它們，您為 AI 提供了生成準確、相關且專業的網頁所需的上下文。

準備好您的內容後，您現在可以建立設定檔並生成您的第一個網站了。

<x-cards>
<x-card data-title="您的第一個網站" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
繼續下一步，建立您的設定檔並生成您的網站。
</x-card>
</x-cards>