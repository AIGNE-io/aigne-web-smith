# 最新動態

「最新動態」元件提供了一種動態方式，可在您的網站上展示最新新聞、部落格文章或公告。它與部落格系統 Discuss Kit 整合，自動擷取並顯示內容，讓您的網站保持新穎並展現持續的活動。

此元件特別適用於：
- 展示新功能、更新或技術文章。
- 提供「證明與動力」——即可見的、持續的進展。
- 強化品牌透明度與參與度。

## 如何使用

要實作「最新動態」區塊，您必須準備一個資料來源檔案，然後在您網站的生成規則中引用它。這個過程簡單明瞭，並確保 AI 能夠正確地定位和渲染內容。

### 步驟 1：準備資料檔案

首先，建立一個作為資料描述符的 YAML 檔案，告訴 WebSmith 從何處擷取部落格內容。

建議將此檔案放置於 `src/blog-list-data.yaml`。

#### 範例資料檔案

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # Or your Discuss Kit Blocklet URL
blogLabel: "did-domain"
blogMoreButtonText: "See More"
```

#### 欄位說明

| 欄位 | 說明 | 必要 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle` | 該區塊顯示的主標題。建議長度在 60 個字元以內，以求清晰。 | 是 |
| `blogDescription` | 顯示在標題下方的簡要摘要，說明該區塊的內容。 | 是 |
| `blogUrl` | 來源 URL，通常是您的 Discuss Kit Blocklet。WebSmith 會自動提取標題、摘要、封面圖片和日期。Discuss Kit API 必須可公開存取。 | 是 |
| `blogLabel` | 一個選用的篩選標籤，用以顯示特定類別的內容。該值應從您的 Discuss Kit 網站取得（例如，URL 中的 `labels` 查詢參數）。 | 否 |
| `blogMoreButtonText` | 選用的「查看更多」按鈕的文字，該按鈕可連結至您的主要部落格或新聞頁面。 | 否 |

### 步驟 2：註冊資料來源

建立資料檔案後，您必須註冊它，以便 WebSmith 能夠找到並使用它。

將檔案路徑新增至您 `config.yaml` 中的 `sourcesPath` 欄位：

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

如果您正在更新現有網站，您還必須將檔案路徑新增至 `.aigne/web-smith/pages/workspace/website-structure.yaml` 的 `sourceIds` 區塊下。這可確保 WebSmith 在執行 `update` 操作時能夠找到新的資料來源。

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### 步驟 3：在生成規則中定義區塊

接著，透過在您的 WebSmith `config.yaml` 檔案中新增一條規則，來指示 AI 如何使用該資料來源。該規則應指定區塊的位置、元件類型和資料來源。

#### 範例規則

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

此範例規則達成以下目的：
*   **定位**：將「最新動態」元件放置為頁面上的第二個區塊。
*   **元件類型**：將該區塊識別為「最新動態」或「部落格列表」類型。
*   **資料來源**：指向 `src/blog-list-data.yaml` 作為設定來源。

或者，當使用 `update` 指令時，您可以提供一個直接的提示，而不用編輯 `config.yaml` 檔案：

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### 步驟 4：生成或更新您的網站

備妥資料檔案和生成規則後，執行相應的指令，讓 AIGNE WebSmith 建立或刷新您的網站。如果是首次生成，請使用 `aigne web generate`。若要將區塊新增至現有網站，請使用 `aigne web update` 並選擇要新增該區塊的文件。

WebSmith 現在將自動載入您的 YAML 資料，從指定的 Discuss Kit URL 擷取最新的文章，並在您的網站上渲染「最新動態」區塊。

## 總結

「最新動態」元件是一個強大的工具，可讓您的網站內容保持最新且具吸引力。透過遵循建立資料檔案和定義生成規則的簡單步驟，您可以自動化在您的網站上直接顯示新聞和部落格文章的過程。

欲了解更多關於其他特殊元件的資訊，請參閱關於[使用特殊元件](./advanced-features-using-special-components.md)的文件。
