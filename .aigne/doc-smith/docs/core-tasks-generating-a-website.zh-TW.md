# 產生網站

AIGNE WebSmith 的核心功能是根據您的來源內容和一組定義好的需求，產生一個完整且專業的網站。此過程由 `generate` 指令處理，該指令會調度一系列 AI Agent 來規劃、撰寫和建構您的網站。

本指南詳細介紹 `generate` 指令，並說明如何在 `config.yaml` 檔案中定義您的網站需求，該檔案是 AI 的主要藍圖。

## `generate` 指令

`aigne web generate` 指令會啟動整個網站建立過程。它會讀取您的設定、分析您的來源資料、規劃網站結構、為每個頁面產生內容，並組合最終的檔案。

### 用法

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

1.  **載入設定**：它首先會尋找並載入 `config.yaml` 檔案，以了解您的高層次需求。如果此檔案不存在，它將自動啟動引導式設定來建立一個。
2.  **分析來源**：AI 會掃描您設定中 `sourcesPath` 指定的文件、Markdown 檔案和其他資料，以了解主題內容。
3.  **規劃網站結構**：根據目的、受眾和來源內容，AI 會為您的網站提出一個合乎邏輯的網站地圖，概述所有頁面及其層級結構。在內容產生開始前，系統會提示您檢閱並核准此結構。
4.  **產生頁面內容**：對於已核准結構中的每個頁面，AI 會產生詳細內容，包括標題、描述以及由專業元件（如主視覺橫幅、功能列表和常見問題）組成的區塊。
5.  **儲存網站檔案**：每個頁面的最終結構化內容會以 YAML 檔案形式儲存在您設定中由 `pagesDir` 指定的目錄中。這些檔案現在已準備好可供發布。

### 參數

`generate` 指令接受數個可選參數以自訂其行為。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>指定詞彙表檔案的路徑（例如：`@glossary.md`）。這能確保專案特定術語在產生的內容中一致地使用。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>若設定為 `true`，指令將從頭開始重新產生所有頁面，覆寫任何先前產生的檔案。這在對 `config.yaml` 檔案或來源文件進行重大變更後很有用。</x-field-desc>
  </x-field>
</x-field-group>

**帶有參數的範例：**

```bash
# 使用詞彙表檔案重新產生整個網站
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 設定檔 (`config.yaml`)

`config.yaml` 檔案是您網站的藍圖。它為 AI 提供了必要的上下文和約束，以建立一個符合您特定需求的網站。此檔案定義了專案、網站的目的與受眾、語言設定以及檔案位置。

以下是 `config.yaml` 檔案中關鍵屬性的詳細說明。

### 設定選項

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>您的專案或網站名稱。用於中繼資料和發布。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="false">
    <x-field-desc markdown>您的專案簡短描述。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>您專案標誌的 URL 或本地路徑。</x-field-desc>
  </x-field>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>一個定義網站主要目標的字串陣列。範例：`landingPage`、`ecommerce`、`portfolio`、`corporate`、`blog`、`saas`、`nonprofit`、`education`、`mixedPurpose`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>一個識別主要受眾的字串陣列。範例：`customers`、`businessOwners`、`marketers`、`designers`、`developers`、`investors`、`jobSeekers`、`students`、`generalPublic`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>定義網站的期望規模和複雜度。選項包括 `singlePage`、`minimal`、`standard`、`comprehensive` 和 `aiDecide`。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>一個用於任何自訂規則或特定指示的欄位，供 AI 在產生過程中遵循，例如語氣、要排除的內容或要強調的特定要點。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>網站內容的主要語言，由語言代碼指定（例如：`en`、`zh`、`es`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>要將網站翻譯成的語言代碼列表。例如：`['zh', 'fr']`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>將儲存產生的網站頁面檔案的本地目錄路徑。</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>指向您來源內容的檔案路徑或 glob 模式陣列。AI 將分析這些檔案以產生網站。</x-field-desc>
  </x-field>
</x-field-group>

### `config.yaml` 範例

以下是一個完整的 `config.yaml` 檔案範例，其中包含解釋每個區塊的註解。

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
#   landingPage     - 登陸頁面 / 首頁：將訪客轉化為使用者或客戶
#   ecommerce       - 電子商務 / 線上商店：在線上銷售產品或服務
#   portfolio       - 作品集 / 展示：展示創意作品、專案或成就
#   corporate       - 企業 / 商業：提供公司資訊的專業商業網站
#   blog            - 部落格 / 內容網站：分享文章、新聞和定期內容更新
#   saas            - SaaS / 軟體產品：推廣軟體服務並引導使用者上手
#   nonprofit       - 非營利 / 社群：推廣理念、接受捐贈、招募志工
#   education       - 教育 / 學習：提供課程、教學或教育內容
#   mixedPurpose    - 多功能網站：涵蓋多種需求的綜合性網站
pagePurpose:
  - saas

# 目標受眾：誰會最常閱讀此內容？
# 可用選項（取消註解並根據需要修改）：
#   customers        - 客戶 / 終端使用者：購買或使用您產品/服務的人
#   businessOwners   - 企業主 / 創業家：經營企業並尋求解決方案的人
#   marketers        - 行銷團隊：推廣產品或管理行銷活動的人
#   designers        - 設計師 / 創意專業人士：專注於視覺設計和使用者體驗的人
#   developers       - 開發者 / 技術使用者：建構或整合技術解決方案的人
#   investors        - 投資者 / 利益相關者：評估業務潛力和成長的人
#   jobSeekers       - 求職者 / 潛在員工：尋找職涯機會的人
#   students         - 學生 / 學習者：尋求教育內容或資源的人
#   generalPublic    - 一般大眾 / 混合受眾：興趣和背景多樣的廣泛受眾
targetAudienceTypes:
  - developers

# 網站規模：您的網站應該有多少頁面？
# 可用選項（取消註解並根據需要修改）：
#   singlePage      - 單頁（僅 1 頁）：所有內容整合在 1 個頁面中
#   minimal         - 最小規模（2-6 頁）：僅含核心頁面 - 快速上線
#   standard        - 標準（7-12 頁）：包含主要區塊的完整網站 [推薦]
#   comprehensive   - 綜合性（12+ 頁）：功能齊全、區塊詳細的網站
#   aiDecide        - 由 AI 決定：分析專案複雜度並建議合適的規模
websiteScale: standard

# 自訂規則：定義特定的頁面產生規則和需求
rules: 'Maintain a formal and technical tone. Avoid marketing jargon. Focus on practical, step-by-step instructions.'

# 詞彙表：定義專案特定的術語和定義
# glossary: "@glossary.md"  # 包含詞彙表定義的 Markdown 檔案路徑

locale: en
# translateLanguages:  # 要將頁面翻譯成的語言列表
#   - zh  # 範例：中文翻譯
#   - en  # 範例：英文翻譯

pagesDir: ./aigne-web-smith/pages  # 儲存產生頁面的目錄
sourcesPath:  # 要分析的原始碼路徑
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # 每個頁面中包含的預設資料來源
  - ./media.md
# minImageWidth: 只有寬度大於此值（以像素為單位）的圖片才會在頁面產生過程中使用
media:
  minImageWidth: 800
```

## 總結

透過將 `generate` 指令與一個定義完善的 `config.yaml` 檔案相結合，您可以有效率地產生一個完全符合您具體規格的完整網站。此過程自動化了網站結構和內容創作的繁重工作，讓您可以專注於提供高品質的來源資料。

產生網站後，下一步是將其發布到網路上。

延伸閱讀：
*   [發布您的網站](./core-tasks-publishing-your-website.md)