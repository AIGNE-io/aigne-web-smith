# 產生網站

AIGNE WebSmith 的核心功能是根據您的來源內容和一組定義好的需求，產生一個完整、專業的網站。此過程由 `generate` 指令處理，該指令會調度一系列 AI Agent 來規劃、撰寫並建構您的網站。

本指南詳細說明 `generate` 指令，並解釋如何在 `config.yaml` 檔案中定義您網站的需求，該檔案會作為 AI 的主要藍圖。

## `generate` 指令

`aigne web generate` 指令會啟動整個網站建立過程。它會讀取您的設定、分析您的來源資料、規劃網站結構、為每個頁面產生內容，並組合最終的檔案。

### 使用方式

若要執行產生過程，請在您的終端機中執行以下指令：

```bash
aigne web generate
```

您也可以使用別名 `gen` 或 `g`：

```bash
aigne web gen
```

### 產生過程

當您執行 `generate` 指令時，WebSmith 會執行以下操作序列：

1.  **載入設定**：它會首先尋找並載入 `config.yaml` 檔案，以了解您的高階需求。如果此檔案不存在，它將自動啟動引導式設定來建立一個。
2.  **分析來源**：AI 會掃描您設定中 `sourcesPath` 指定的文件、Markdown 檔案和其他資料，以了解主題內容。
3.  **規劃網站結構**：根據目的、受眾和來源內容，AI 會為您的網站提出一個合乎邏輯的網站地圖，概述所有頁面及其層級結構。在內容產生開始前，系統會提示您檢視並核准此結構。
4.  **產生頁面內容**：對於已核准結構中的每個頁面，AI 會產生詳細內容，包括標題、描述以及由專業元件（如主視覺橫幅、功能列表和常見問答）組成的區塊。
5.  **儲存網站檔案**：每個頁面的最終結構化內容會以 YAML 檔案形式儲存在您設定中 `pagesDir` 指定的目錄中。這些檔案現在已準備好可以發布。

### 參數

`generate` 指令接受數個可選參數來自訂其行為。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>指定詞彙表檔案的路徑（例如：`@glossary.md`）。這能確保專案特定術語在產生的內容中一致地使用。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>若設定為 `true`，指令將從頭開始重新產生所有頁面，並覆寫任何先前產生的檔案。這在對 `config.yaml` 檔案或來源文件進行重大變更後相當有用。</x-field-desc>
  </x-field>
</x-field-group>

**使用參數的範例：**

```bash
# 使用詞彙表檔案重新產生整個網站
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 設定檔 (`config.yaml`)

`config.yaml` 檔案是您網站的藍圖。它為 AI 提供了必要的脈絡和限制，以建立一個符合您特定需求的網站。此檔案定義了專案、網站的目的與受眾、語言設定以及檔案位置。

以下是 `config.yaml` 檔案中關鍵屬性的詳細說明。

### 設定選項

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>您的專案或網站的名稱。這將用於元資料和發布。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="false">
    <x-field-desc markdown>您的專案的簡要描述。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>您的專案標誌的 URL 或本地路徑。</x-field-desc>
  </x-field>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>一個定義網站主要目標的字串陣列。範例：`productDocumentation`、`marketingLandingPage`、`blog`、`apiReference`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>一個識別主要受眾的字串陣列。範例：`developers`、`businessUsers`、`endUsers`、`dataScientists`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>定義網站的期望規模和複雜度。選項包括 `small`（幾個關鍵頁面）、`standard`（一個全面的網站）和 `large`（一個內容豐富的廣泛網站）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>一個用於填寫任何自訂規則或特定指示的欄位，供 AI 在產生過程中遵循，例如語氣、要排除的內容或要強調的特定要點。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>網站內容的主要語言，以語言代碼指定（例如：`en`、`zh`、`es`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>要將網站翻譯成的語言代碼列表。例如：`['zh', 'fr']`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>將儲存產生的網站頁面檔案的本地目錄路徑。</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>一個指向您來源內容的檔案路徑或 glob 模式的陣列。AI 將分析這些檔案以產生網站。</x-field-desc>
  </x-field>
</x-field-group>

### `config.yaml` 範例

以下是一個完整的 `config.yaml` 檔案範例，並附有註解說明每個部分。

```yaml config.yaml
# 頁面發布的專案資訊
projectName: AIGNE WebSmith
projectDesc: AI-driven website generation tool
projectLogo: https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg
projectId: aigne-websmith-docs
projectSlug: aigne-websmith

# =============================================================================
# 網站設定
# =============================================================================

# 目的：您希望讀者達成的最主要成果是什麼？
# 可用選項（取消註解並根據需要修改）：
#   productDocumentation - 產品文件：深入的指南、教學和 API 參考。
#   marketingLandingPage - 行銷登陸頁面：展示產品並轉換訪客。
#   companyIntroduction - 公司介紹：介紹您公司的願景和團隊。
#   blog              - 部落格：文章、更新和行業見解。
#   caseStudies       - 案例研究：客戶成功故事和使用案例。
#   knowledgeBase     - 知識庫：常見問答和故障排除文章。
#   apiReference      - API 參考：您 API 的詳細文件。
#   mixedPurpose      - 混合目的：多個目標的組合。
pagePurpose:
  - productDocumentation

# 目標受眾：誰最常閱讀這些內容？
# 可用選項（取消註解並根據需要修改）：
#   developers        - 開發者：使用您的產品進行建構的技術使用者。
#   businessUsers     - 商業使用者：專注於商業價值的非技術使用者。
#   endUsers          - 終端使用者：使用最終產品的一般受眾。
#   dataScientists    - 資料科學家：專注於資料和分析的使用者。
#   investors         - 投資者：對公司潛力感興趣的利害關係人。
#   jobSeekers        - 求職者：探索您公司的潛在員工。
targetAudienceTypes:
  - developers

# 網站規模：您的網站應該有多少頁面？
# 可用選項（取消註解並根據需要修改）：
#   small                - 小型：一個包含 3-5 個關鍵頁面的簡潔網站。
#   standard             - 標準：一個包含 5-10 個頁面的全面網站。
#   large                - 大型：一個超過 10 個頁面的廣泛網站。
websiteScale: standard

# 自訂規則：定義特定的頁面產生規則和需求
rules: '保持正式和技術性的語氣。避免使用行銷術語。專注於實際、按部就班的說明。'

# 詞彙表：定義專案特定的術語和定義
# glossary: "@glossary.md"  # 包含詞彙表定義的 Markdown 檔案路徑

locale: en
# translateLanguages:  # 要將頁面翻譯成的語言列表
#   - zh  # 範例：中文翻譯
#   - en  # 範例：英文翻譯

pagesDir: ./aigne-web-smith/pages  # 儲存產生的頁面的目錄
sourcesPath:  # 要分析的原始碼路徑
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # 每個頁面中包含的預設資料來源
  - ./media.md
# minImageWidth: 只有寬度大於此值（單位為像素）的圖片才會用於頁面產生
media:
  minImageWidth: 800
```

## 總結

透過結合 `generate` 指令和一個定義完善的 `config.yaml` 檔案，您可以有效率地產生一個完全符合您特定需求的完整網站。此過程自動化了網站結構和內容創作的繁重工作，讓您能專注於提供高品質的來源資料。

產生網站後，下一步就是將其發布上線。

延伸閱讀：
*   [發布您的網站](./core-tasks-publishing-your-website.md)