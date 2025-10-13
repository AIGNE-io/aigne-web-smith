# 生成網站

`aigne web generate` 命令是建立新網站的核心功能。它使用 AI 驅動的流程來解讀您的需求、規劃網站結構，並生成所有必要的內容和範本檔案。整個流程由一個設定檔指導，您可以在其中定義網站的目標和規格。

本指南將系統性地概述 `generate` 命令，並詳細解析設定檔的參數。若需實作教學，請參閱 [您的第一個網站](./getting-started-your-first-website.md)。

## `generate` 命令

生成流程是透過 `generate` 命令啟動的。其主要目的是讀取您的設定、與 AI agents 互動，並在您的本機工作區中建構網站檔案。

**用法**

```bash Command Line icon=lucide:terminal
aigne web generate
```

**別名**

為方便起見，您也可以使用較短的別名 `gen` 或 `g`。

```bash Command Line icon=lucide:terminal
# 這些命令等同於 'aigne web generate'
aigne web gen
aigne web g
```

通常，您會使用一個輸入檔案將您的需求傳遞給該命令。這可以透過 `--input` 旗標，後面加上一個 `@` 符號和您的設定檔路徑來完成。

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-website.yaml
```

## 網站設定檔

要生成網站，您必須提供一個 YAML 格式的設定檔。這個檔案作為藍圖，定義了網站的目的、目標受眾、風格和內容需求。AI 會利用這些資訊來對網站的結構、語氣和功能做出明智的決策。

您的設定檔可使用以下參數：

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>您想建立的網站的詳細描述。這是最關鍵的參數。您應該提供一組清晰、結構化的指令，包括所需的頁面類型（例如，首頁、定價、關於我們）、要突顯的關鍵功能，以及任何對風格或內容的特定要求。規則越精確，AI 就越能根據您的需求量身打造網站。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>網站目標受眾的描述。例如，`小型企業主`、`軟體開發者`或`潛在投資者`。這有助於 AI 適當地調整內容的語言、語氣和複雜度。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>網站內容的主要語言。目前支援的值為 `en`（英文）和 `zh`（中文）。預設值為 `zh`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>定義網站的整體美學和基調。例如，`business`（商業）、`creative`（創意）、`minimalist`（簡約）或 `tech-focused`（科技導向）。這會影響 AI 在版面配置、圖像和寫作風格上的選擇。</x-field-desc>
  </x-field>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>一份應在整個網站中一致使用的特定術語、產品名稱或行話清單。這能確保術語的準確性。您可以將其以字串形式提供，或使用 `@<檔案路徑>` 語法從檔案中載入。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>若設定為 `true`，此命令將從頭開始重新生成所有頁面，忽略先前生成時已存在的任何檔案。當您想要完全重新開始時，這非常有用。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>您的 Pages Kit 執行個體的專案 ID。雖然生成時並非必要，但在此提供它可以簡化後續的發佈流程。詳情請參閱 [發佈您的網站](./core-tasks-publishing-your-website.md)。</x-field-desc>
  </x-field>
</x-field-group>

## 逐步範例

以下是生成網站的實際逐步流程。

### 步驟 1：建立設定檔

首先，建立一個新的 YAML 檔案來定義您的網站。在此範例中，我們將其命名為 `my-saas-website.yaml`。

```yaml my-saas-website.yaml icon=lucide:file-text
rules: |
  建立一個現代化的 SaaS 產品網站，包含：
  1. 一個包含產品介紹和核心功能的首頁。
  2. 一個包含不同方案比較表的定價頁面。
  3. 一個用於客戶成功案例和見證的頁面。
  4. 一個專門的技術文件入口網站。
  5. 一個包含支援表單和聯絡資訊的聯絡頁面。

  需求：
  - 風格應專業且以商業為導向。
  - 內容必須突顯產品的優勢和獨特賣點。
  - 包含清晰的行動呼籲（CTA）按鈕，以引導使用者進行免費試用。

targetAudience: 中小型企業（SMB）所有者和技術決策者。
locale: en
websiteStyle: business
```

### 步驟 2：執行 `generate` 命令

儲存設定檔後，開啟您的終端機並執行 `generate` 命令，使用 `--input` 旗標指向您的檔案。

```bash Command Line icon=lucide:terminal
aigne web generate --input @my-saas-website.yaml
```

AI 現在將開始生成流程。它會分析您的規則、規劃網站結構，然後為每個頁面建立內容。您將在終端機中看到進度更新。此流程可能需要幾分鐘時間，具體取決於頁面數量和需求的複雜度。

### 步驟 3：檢閱生成的檔案

命令完成後，生成的網站檔案將儲存在您專案的工作區中。您現在可以檢查這些檔案，查看 AI 建立的結構和內容。

## 總結

`generate` 命令是一個強大的工具，能將一組簡單的文字需求轉換為一個結構完整的網站。成功結果的關鍵在於您的 YAML 設定檔中清晰且詳細的 `rules` 定義。

生成網站後，下一個合理的步驟是將其發佈。要了解如何操作，請繼續閱讀下一節。

- **下一步**：[發佈您的網站](./core-tasks-publishing-your-website.md)