# WebSmith 設定檔

本指南為 `.aigne/web-smith/config.yaml` 檔案中的所有設定提供了詳細參考。此檔案是 WebSmith 規劃、生成和部署您網站的唯一事實來源。它定義了您專案的核心訊息、目標受眾、資料來源、在地化和發布細節，AI agents 在執行每個 `generate` 或 `update` 命令時都依賴這些資訊。

**主要原則**

*   **穩定的元資料**：保持 `projectName`、`projectId` 和 `projectSlug` 等必要元資料的一致性。下游服務依賴這些識別碼。
*   **策略驅動的內容**：策略欄位（`pagePurpose`、`targetAudienceTypes`、`rules`）指導 AI 的敘事風格。當您的產品或行銷策略變更時，請優先更新這些欄位。
*   **明確的資料來源**：`sourcesPath` 和 `defaultDatasources` 列表控制 WebSmith 分析的內容。新的資料檔案必須在生成前在此處註冊。
*   **受控的部署**：部署設定（`appUrl`、`checkoutId`）影響生成網站的發布方式。

```d2
direction: down

# Actors
developer: {
  label: "開發者"
  shape: c4-person
}

# Core Components
websmith-engine: {
  label: "AIGNE WebSmith 引擎"
  shape: rectangle
  style: {
    fill: "#f0f4ff"
    stroke: "#b3c7f2"
  }
}

# Artifacts & Data
config-file: {
  label: "config.yaml"
  shape: rectangle
  grid-columns: 2
  grid-gap: 40

  metadata: {
    label: "1. 專案元資料"
    shape: rectangle
    projectName
    projectDesc
    projectId
  }

  strategy: {
    label: "2. 網站策略"
    shape: rectangle
    pagePurpose
    targetAudienceTypes
    rules
  }

  localization: {
    label: "3. 在地化"
    shape: rectangle
    locale
    translateLanguages
  }

  sources: {
    label: "4. 內容來源"
    shape: rectangle
    sourcesPath
  }

  media: {
    label: "5. 媒體與資產"
    shape: rectangle
    minImageWidth
    projectCover
  }

  deployment: {
    label: "6. 部署"
    shape: rectangle
    appUrl
    checkoutId
  }
}

content-sources: {
  label: "內容來源\n(.md, .yaml)"
  shape: cylinder
}

repository: {
  label: "Git 儲存庫"
  shape: cylinder
  
  generated-site: {
    label: "生成的網站\n(Markdown/HTML)"
    shape: cylinder
    style.fill: "#e6ffed"
  }
}

# Workflow Connections
developer -> config-file: "1. 修改設定"
developer -> content-sources: "2. 新增來源"
developer -> websmith-engine: "3. 執行 `aigne generate`"

config-file -> websmith-engine: "讀取"
content-sources -> websmith-engine: "分析"

websmith-engine -> repository.generated-site: "生成/更新"

developer -> repository: "4. 審查與提交"
```

## 設定結構

此設定檔分為幾個邏輯區塊。以下是每個參數的詳細說明。

### 專案發布元資料

此區塊定義您專案的核心識別資訊。這些資訊將用於生成的頁面、報告和 SEO 元資料中。

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="您專案的易讀標題。它會出現在頁面標題和報告中。"></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="一段簡短的行銷描述，用於 SEO 元資料和內部 AI 提示。"></x-field>
  <x-field data-name="projectLogo" data-type="URL" data-required="false" data-desc="您專案 Logo 的絕對 URL 或可存取的 CDN 路徑，用於頁首和社群媒體卡片。"></x-field>
  <x-field data-name="projectId" data-type="UUID" data-required="true" data-desc="WebSmith 服務的唯一識別碼。這是自動生成的，不應在專案之間修改或重複使用。"></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="您專案的預設 URL 片段（例如 /my-site）。請保持此設定與您的部署目標同步。"></x-field>
</x-field-group>

### 網站策略與敘事

這些欄位指導 AI 關於網站內容的敘事、語氣和結構。

<x-field-group>
  <x-field data-name="pagePurpose" data-type="list" data-required="true">
    <x-field-desc markdown>宣告網站的主要目標（例如 `landingPage`、`portfolio`、`documentation`）。您可以列出多個目的以融合不同的敘事方法。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="list" data-required="false">
    <x-field-desc markdown>指導語氣和行動呼籲 (CTA)。有效選項包括 `customers`、`developers`、`investors` 等。請包含所有相關的受眾。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="enum" data-required="false">
    <x-field-desc markdown>表示網站的預期規模和複雜度（例如 `singlePage`、`standard`、`aiDecide`）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>給予 AI 關於結構、敘事流程和語氣的高優先級指令。WebSmith 會將 Markdown 格式（標題、列表）解析為指導，而非字面上的文案。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="path" data-required="false" data-desc="生成網站頁面的輸出目錄。WebSmith 會將最終檔案寫入此處。"></x-field>
</x-field-group>

### 在地化與語言

為您的網站內容設定語言。

<x-field-group>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>內容生成的主要語言，使用 IETF 語言代碼指定（例如 `en`、`en-US`、`zh-TW`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith 應將內容翻譯成的其他 IETF 語言代碼列表。</x-field-desc>
  </x-field>
</x-field-group>

### 內容來源與資料來源

定義 WebSmith 應在何處尋找您的內容。

<x-field-group>
  <x-field data-name="sourcesPath" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith 為分析上下文而掃描的目錄或檔案路徑列表。在生成前，請在此處新增新的資料檔案（例如 `.yaml`、`.md`）。</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="list" data-required="false">
    <x-field-desc markdown>會自動注入每個頁面的資料來源路徑列表。適用於全域可用的資料，如媒體目錄。</x-field-desc>
  </x-field>
</x-field-group>

### 媒體與視覺資產

控制圖片和其他視覺元素的處理方式。

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="在生成的版面中，圖片所允許的最小寬度（以像素為單位）。"></x-field>
  </x-field>
  <x-field data-name="projectCover" data-type="path" data-required="false" data-desc="用於主視覺區塊和社群媒體預覽的封面圖片路徑。"></x-field>
</x-field-group>

### 部署與整合

這些欄位包含與發布您的網站相關的設定。

<x-field-group>
  <x-field data-name="appUrl" data-type="URL" data-required="false" data-desc="網站的主要部署 URL。用於標準連結和其他參考。"></x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false" data-desc="一個可選的導覽樣式覆寫設定。"></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="ArcBlock 部署/結帳服務的識別碼。"></x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>控制發布步驟是否推送所有產物。設定為 `"true"` 以進行完整同步。</x-field-desc>
  </x-field>
  <x-field data-name="lastGitHead" data-type="string" data-required="false" data-desc="上次生成時的 Git commit SHA。WebSmith 會自動更新此值。"></x-field>
</x-field-group>

## 設定範例

以下是一個 `config.yaml` 檔案範例，展示了一個典型的設定。

```yaml config.yaml icon=logos:yaml
# 1. 專案發布元資料
projectName: "AIGNE WebSmith Docs"
projectDesc: "The official documentation for AIGNE WebSmith."
projectLogo: "https://example.com/logo.png"
projectId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
projectSlug: "websmith-docs"

# 2. 網站策略與敘事
pagePurpose:
  - documentation
  - landingPage
targetAudienceTypes:
  - developers
websiteScale: "standard"
rules: |
  - Focus on clarity and practical examples.
  - Maintain a professional but approachable tone.
  - Ensure all code snippets are accurate and easy to copy.
pagesDir: "src/pages"

# 3. 在地化與語言
locale: "en"
translateLanguages:
  - "zh-TW"

# 4. 內容來源與資料來源
sourcesPath:
  - "src/content"
  - "src/data/features.yaml"
defaultDatasources:
  - "src/data/site-metadata.yaml"

# 5. 媒體與視覺資產
media:
  minImageWidth: 600
projectCover: "src/assets/cover-image.png"

# 6. 部署與整合
appUrl: "https://docs.aigne.com/websmith"
checkoutId: "chk_12345"
shouldSyncAll: "false"
lastGitHead: ""
```

## 常見更新工作流程

若要使用設定檔將變更應用到您的網站，請遵循以下步驟：

1.  **修改設定**：根據需要調整 `config.yaml` 中的策略、元資料或其他欄位。
2.  **註冊新來源**：如果您有新的資料檔案，請在 `sourcesPath` 下註冊它們，並在必要時註冊於 `defaultDatasources`。
3.  **執行 WebSmith**：使用 `aigne run generate` 進行全新建置，或使用 `aigne run update` 刷新現有頁面的內容。
4.  **審查並提交**：審查生成的內容以確保其反映您的變更，然後將更新後的檔案提交到您的儲存庫。

透過保持此設定檔與您的專案目標和內容來源一致，您可以確保 WebSmith 持續生成高品質且符合品牌形象的網站。