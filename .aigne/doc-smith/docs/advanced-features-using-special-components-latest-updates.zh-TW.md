# 最新動態

「最新動態」元件提供了一種動態方式，在您的網站上展示最新消息、部落格文章或公告。它與部落格系統 Discuss Kit 整合，自動擷取並顯示內容，讓您的網站保持新穎並展現持續的活躍度。

此元件特別適用於：
- 宣佈新功能、產品更新或技術文章。
- 提供進展和動能的具體證明。
- 提升品牌透明度和使用者參與度。

## 設定指南

欲實作「最新動態」區塊，您必須準備一個資料來源檔案，然後在您網站的生成規則中引用它。此過程簡單明瞭，並確保 AI 能夠正確地定位和渲染內容。

### 步驟 1：準備資料檔案

首先，建立一個 YAML 檔案，用以指定您動態的來源和呈現方式。此檔案作為一個資料描述符，告知 WebSmith 從何處擷取部落格內容。

建議將此檔案存放於 `src/blog-list-data.yaml`。

#### 範例資料檔案

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # 您的 Discuss Kit Blocklet 網址
blogLabel: "japan" # 選填的篩選標籤
blogMoreButtonText: "See More"
```

#### 欄位說明

下表詳細說明了您資料檔案中可設定的欄位。

| 欄位                 | 說明                                                                                                                                                                                                   | 必填     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle`          | 該區塊顯示的主要標題。為求清晰，建議長度保持在 60 個字元以內。                                                                                                                                             |   是     |
| `blogDescription`    | 顯示在標題下方的簡要摘要，用以解釋該區塊的內容。                                                                                                                                                       |   是     |
| `blogUrl`            | 內容所在的來源網址。此應為您的 Discuss Kit Blocklet 的網址。WebSmith 會自動擷取文章標題、摘要、封面圖片和發布日期。                                                                                   |   是     |
| `blogLabel`          | 用於篩選文章的選填標籤。這可讓您顯示特定類別的內容，例如某個產品、功能或地區。                                                                                                                            |   否     |
| `blogMoreButtonText` | 選填的「查看更多」按鈕的文字，可連結至您的主要部落格或新聞頁面。                                                                                                                                          |   否     |

### 步驟 2：在生成規則中定義區塊

建立資料檔案後，您需要指示 AI 如何使用它。這可以透過在您的 WebSmith `config.yaml` 檔案中新增一條規則來完成。該規則應指定區塊的位置、元件類型和資料來源。

#### 範例規則

```yaml config.yaml icon=yaml
Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum. Connect each featured post to a specific ArcBlock capability or outcome.
```

此範例規則達成了以下目的：
*   **定位：** 將「最新動態」元件放置為頁面上的第二個區塊。
*   **元件類型：** 將該區塊識別為「部落格列表」類型。
*   **資料來源：** 指向 `src/blog-list-data.yaml` 作為設定來源。

### 步驟 3：生成或更新您的網站

當資料檔案和生成規則都準備就緒後，請執行相應的指令，讓 AIGNE WebSmith 建立或重新整理您的網站。如果是首次生成，請使用 `aigne web generate`。若要將區塊新增至現有網站，請使用 `aigne web update` 並選擇要新增區塊的文件。

WebSmith 現在將自動載入您的 YAML 資料，從指定的 Discuss Kit 網址擷取最新文章，並在您的網站上渲染「最新動態」區塊。

## 進階用法

對於更複雜的網站，您可以使用 `blogLabel` 欄位在不同頁面上建立多個獨立的動態區塊，每個區塊都篩選至特定主題。

## 總結

「最新動態」元件是一個強大的工具，能讓您的網站內容保持最新且具吸引力。透過遵循建立資料檔案和定義生成規則的簡單步驟，您可以自動化在網站上直接顯示新聞和部落格文章的過程。

欲了解其他特殊元件的更多資訊，請參閱關於 [使用特殊元件](./advanced-features-using-special-components.md) 的文件。