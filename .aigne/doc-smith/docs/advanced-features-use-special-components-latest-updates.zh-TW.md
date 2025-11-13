# 最新動態

「最新動態」元件提供了一種動態方式，在您的網站上展示最新消息、部落格文章或公告。它與部落格系統 Discuss Kit 整合，自動擷取並顯示內容，讓您的網站保持新鮮感，並展現持續的活躍度。

此元件特別適用於：
- 展示新功能、更新或技術文章。
- 提供「證明與動能」——可見的、持續的進展。
- 強化品牌透明度和參與度。

## 如何使用

要實作「最新動態」區塊，您必須準備一個資料來源檔案，然後在您網站的生成規則中引用它。這個過程很直接，並能確保 AI 正確地定位和渲染內容。

### 步驟 1：準備資料檔案

首先，建立一個 YAML 檔案作為資料描述符，告訴 WebSmith 從何處擷取部落格內容。

建議將此檔案放置在 `src/blog-list-data.yaml`。

#### 範例資料檔案

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "最新動態"
blogDescription: "在此處獲取最新動態。"
blogUrl: "https://www.arcblock.io" # 或您的 Discuss Kit Blocklet 網址
blogLabel: "did-domain"
blogMoreButtonText: "查看更多"
```

#### 欄位說明

| 欄位 | 說明 | 必填 |
| --- | --- | :---: |
| `blogTitle` | 該區塊顯示的主標題。為求清晰，建議長度保持在 60 個字元以內。 | 是 |
| `blogDescription` | 顯示在標題下方的簡短摘要，解釋該區塊的內容。 | 是 |
| `blogUrl` | 來源網址，通常是您的 Discuss Kit Blocklet。WebSmith 會自動擷取標題、摘要、封面圖片和日期。Discuss Kit API 必須可公開存取。 | 是 |
| `blogLabel` | 一個選用的篩選標籤，用以顯示特定分類的內容。其值應從您的 Discuss Kit 網站獲取（例如，網址中的 `labels` 查詢參數）。 | 否 |
| `blogMoreButtonText` | 一個選用的「查看更多」按鈕的文字，可連結至您的主要部落格或新聞頁面。 | 否 |

### 步驟 2：註冊資料來源

建立資料檔案後，您必須註冊它，以便 WebSmith 能夠找到並使用它。

將檔案路徑新增至 `config.yaml` 中的 `sourcesPath` 欄位：

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

如果您正在更新現有網站，您還必須將檔案路徑新增至 `.aigne/web-smith/pages/workspace/website-structure.yaml` 的 `sourceIds` 區塊下。這能確保 WebSmith 在執行 `update` 操作時可以找到新的資料來源。

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### 步驟 3：在生成規則中定義區塊

接下來，透過在您的 WebSmith `config.yaml` 檔案中新增一條規則，指示 AI 如何使用該資料來源。該規則應指定區塊的位置、元件類型和資料來源。

#### 範例規則

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

此範例規則達成以下目的：
*   **定位**：將「最新動態」元件放置為頁面上的第二個區塊。
*   **元件類型**：將該區塊識別為「最新動態」或「部落格列表」類型。
*   **資料來源**：指向 `src/blog-list-data.yaml` 作為設定來源。

或者，當使用 `update` 指令時，您可以提供直接的提示，而不用編輯 `config.yaml` 檔案：

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### 步驟 4：生成或更新您的網站

資料檔案和生成規則都設定好後，執行相應的指令，讓 AIGNE WebSmith 建立或刷新您的網站。如果是首次生成，請使用 `aigne web generate`。若要將區塊新增至現有網站，請使用 `aigne web update` 並選擇要新增區塊的文件。

WebSmith 現在將自動載入您的 YAML 資料，從指定的 Discuss Kit 網址擷取最新的文章，並在您的網站上渲染「最新動態」區塊。

## 總結

「最新動態」元件是一個強大的工具，能讓您的網站內容保持最新且具吸引力。透過建立資料檔案和定義生成規則的簡單步驟，您可以自動化在網站上直接顯示新聞和部落格文章的過程。

有關其他特殊元件的更多資訊，請參閱[使用特殊元件](./advanced-features-use-special-components.md)的文件。