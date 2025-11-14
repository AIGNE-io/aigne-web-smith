# 入門指南

請遵循本指南，以最快的途徑建立一個可運作的網站：安裝 AIGNE CLI、收集來源素材、執行 `aigne web generate`、核准計畫，並檢視產生的頁面——所有操作都集中在一處完成。

## 查看端到端流程

```d2
direction: right

Developer: {
  label: "您"
  shape: c4-person
}

Install: {
  label: "安裝 AIGNE CLI"
  shape: rectangle
}

Workspace: {
  label: "建立專案 + 收集來源素材"
  shape: rectangle
}

Generate: {
  label: "執行 `aigne web generate`"
  shape: rectangle
}

Plan: {
  label: "核准網站計畫"
  shape: diamond
}

Review: {
  label: "檢查產生的頁面"
  shape: rectangle
}

Developer -> Install -> Workspace -> Generate -> Plan -> Review -> Developer
```

## 先決條件

- **Node.js 20 或更新版本**（包含 npm）。請使用 `node -v` 檢查。
- **AIGNE 帳號**（選用）。您可以使用 AIGNE CLI 內建的託管模型，無需新增 API 金鑰。
- **來源素材**，用於描述您的產品或服務。如需更詳細的清單，請閱讀[準備素材](./reference-prepare-materials.md)指南。

## 步驟 1. 安裝並驗證 AIGNE CLI

全域安裝 AIGNE CLI，以便 `aigne` 指令在任何資料夾中都可用：

```bash 安裝 AIGNE CLI icon=lucide:terminal
npm install -g @aigne/cli
```

驗證安裝是否成功：

```bash --help icon=lucide:terminal
aigne web --help
```

需要測試版通道嗎？請使用 `npm install -g @aigne/cli@beta` 安裝，並執行 `aigne web upgrade --beta` 以取得最新的 Agent。

## 步驟 2. 建立專案工作區

為您的第一個網站設定一個乾淨的目錄，並切換到該目錄：

```bash 建立工作區 icon=mdi:folder-open
mkdir my-first-websmith-site
cd my-first-websmith-site
```

將您希望 AI 讀取的文件、簡報和媒體複製或建立到此資料夾（或附近的 `sources` 目錄）中。定義明確的資料能顯著提升輸出品質，因此請花幾分鐘時間遵循[準備清單](./reference-prepare-materials.md)。

## 步驟 3. 執行 `aigne web generate`

在專案目錄中，啟動產生器：

```bash 產生網站 icon=material-symbols:rocket-launch-outline
aigne web generate
```

因為這是一個新的工作區，WebSmith 會啟動一個互動式精靈來擷取：

1.  **網站目的** - 例如，SaaS 行銷網站、文件中心、投資者更新。
2.  **目標受眾** - 開發人員、客戶、投資者等，以便語氣和佐證資料符合讀者需求。
3.  **網站規模** - 選擇最小、標準、全面，或讓 AI 決定。
4.  **語言** - 選擇主要語言環境及任何要產生的翻譯版本。
5.  **頁面目錄** - 儲存產生檔案的位置（預設為 `aigne/web-smith/pages`）。
6.  **來源路徑** - 包含您產品知識的目錄或檔案。
7.  **自訂規則** - 約束條件，如語氣、術語或合規提醒。

您的回答會被寫入 `.aigne/doc-smith/config.yaml`，以便未來執行時重複使用。

## 步驟 4. 檢視設定檔

打開產生的設定檔並檢查其值是否合理，特別是 `sourcesPath`。以下是一個精簡範例：

```yaml config.yaml icon=mdi:file-document-outline
projectName: My Awesome Project
projectDesc: This is a project that does amazing things.
pagePurpose:
  - saas
targetAudienceTypes:
  - developers
websiteScale: standard
locale: en
pagesDir: aigne/web-smith/pages
sourcesPath:
  - ./docs
  - ./briefs/product-overview.md
  - ./evidence
rules: >
  Use confident, concrete copy. Highlight 99.99% uptime and SOC 2 compliance.
```

> **重要提示：** `sourcesPath` 控制著 AI 能參考的所有內容。請將其指向包含您的簡報、規格、定價表和佐證資料的確切目錄，以確保產生的文案準確無誤。

## 步驟 5. 核准計畫並檢查頁面

讀取您的設定檔後，WebSmith 會提出一個網站地圖（包含頁面、章節和關鍵要點）。核准後，AI 將開始草擬內容並組裝 Astro/React 範本。執行完成後，您會看到：

- 產生好的檔案位於您選擇的 `pagesDir` 中。
- 每個頁面的日誌，顯示使用了哪些來源檔案。
- 後續操作建議（發布、翻譯或迭代）。

您可以在本地端開啟產生的頁面，或直接前往[發布網站](./guides-publish-website.md)指南將其上線。

## 接下來呢？

<x-cards data-columns="3">
  <x-card data-title="準備素材" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">
    建立一個可重複使用的內容套件，確保每次產生都從高品質的輸入開始。
  </x-card>
  <x-card data-title="建立網站" data-icon="lucide:wrench" data-href="/guides/create-website">
    深入了解 `generate` 工作流程的進階選項。
  </x-card>
  <x-card data-title="發布網站" data-icon="lucide:rocket" data-href="/guides/publish-website">
    將產生的頁面變成一個即時網站，部署在 WebSmith Cloud 或您自己的基礎設施上。
  </x-card>
</x-cards>
