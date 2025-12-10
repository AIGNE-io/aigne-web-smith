# 入門指南

本指南將引導您以最快的方式建立一個可運作的網站：安裝 AIGNE CLI、收集來源資料、執行 `aigne web generate`、批准計畫，並檢視產生的頁面——所有操作一氣呵成。

## 查看端到端流程

<!-- DIAGRAM_IMAGE_START:flowchart:4:3:1765349001 -->
![Getting Started](assets/diagram/getting-started-01.zh-TW.jpg)
<!-- DIAGRAM_IMAGE_END -->

## 先決條件

- **Node.js 20 或更新版本**（內含 npm）。請使用 `node -v` 檢查。
- **AIGNE 帳號**（選用）。您可以使用 AIGNE CLI 內建的託管模型，無需新增 API 金鑰。
- **來源資料**，用於描述您的產品或服務。如需更詳細的檢查清單，請閱讀[準備資料](./reference-prepare-materials.md)指南。

## 步驟 1. 安裝並驗證 AIGNE CLI

全域安裝 AIGNE CLI，以便在任何資料夾中都能使用 `aigne` 指令：

```bash Install AIGNE CLI icon=lucide:terminal
npm install -g @aigne/cli
```

驗證安裝是否成功：

```bash --help icon=lucide:terminal
aigne web --help
```

需要測試版嗎？請使用 `npm install -g @aigne/cli@beta` 進行安裝，並執行 `aigne web upgrade --beta` 以取得最新的 agents。

## 步驟 2. 建立專案工作區

為您的第一個網站設定一個乾淨的目錄，並切換到該目錄中：

```bash Create workspace icon=mdi:folder-open
mkdir my-first-websmith-site
cd my-first-websmith-site
```

將您希望 AI 讀取的文件、簡報和媒體複製或建立在此資料夾中（或附近的 `sources` 目錄中）。定義明確的資料能顯著提升輸出品質，因此請花幾分鐘時間遵循[準備工作檢查清單](./reference-prepare-materials.md)。

## 步驟 3. 執行 `aigne web generate`

在專案目錄中，啟動產生器：

```bash Generate website icon=material-symbols:rocket-launch-outline
aigne web generate
```

由於這是一個新的工作區，WebSmith 會啟動一個互動式精靈來擷取以下資訊：

1.  **網站目的** - 例如：SaaS 行銷網站、文件中心、投資者更新。
2.  **目標受眾** - 開發者、客戶、投資者等，以便語氣和佐證資料符合讀者需求。
3.  **網站規模** - 選擇最小、標準、全面，或讓 AI 決定。
4.  **語言** - 選擇主要地區設定及任何要產生的翻譯版本。
5.  **頁面目錄** - 儲存產生的檔案的位置（預設為 `aigne/web-smith/pages`）。
6.  **來源路徑** - 包含您產品知識的目錄或檔案。
7.  **自訂規則** - 限制條件，如語氣、術語或合規提醒。

您的回答將被寫入 `.aigne/doc-smith/config.yaml`，以便未來執行時重複使用。

## 步驟 4. 檢視設定

開啟產生的設定檔，並檢查其值是否合理，特別是 `sourcesPath`。以下是一個精簡範例：

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

> **重要提示：** `sourcesPath` 控制著 AI 可參考的所有內容。請將其指向包含您的簡報、規格、定價表和證明資料的確切目錄，以確保產生的文案準確無誤。

## 步驟 5. 批准計畫並檢查頁面

讀取您的設定後，WebSmith 會提出一個網站地圖（包含頁面、章節和關鍵要點）。批准後，AI 將開始草擬內容並組裝 Astro/React 範本。執行完成後，您將看到：

- 產生的檔案位於您所選的 `pagesDir` 目錄中。
- 每個頁面的日誌，顯示使用了哪些來源檔案。
- 後續操作建議（發布、翻譯或迭代）。

您可以在本機開啟產生的頁面，或直接前往[發布網站](./guides-publish-website.md)指南，將其上線。

## 接下來呢？

<x-cards data-columns="3">
  <x-card data-title="準備資料" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">
    建立一個可重複使用的內容套件，讓每次產生都能從高品質的輸入開始。
  </x-card>
  <x-card data-title="建立網站" data-icon="lucide:wrench" data-href="/guides/create-website">
    深入了解 `generate` 工作流程的進階選項。
  </x-card>
  <x-card data-title="發布網站" data-icon="lucide:rocket" data-href="/guides/publish-website">
    將產生的頁面部署到 WebSmith Cloud 或您自己的基礎設施上，使其成為一個上線網站。
  </x-card>
</x-cards>