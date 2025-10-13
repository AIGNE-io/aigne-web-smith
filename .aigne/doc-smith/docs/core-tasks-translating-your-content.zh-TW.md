# 翻譯您的內容

AIGNE WebSmith 提供了一種強大而直接的方式，可以自動將您的網站內容翻譯成多種語言，讓您能以最少的心力觸及全球受眾。`translate` 命令使用 AI 為您現有的頁面產生高品質的翻譯。

本文件將引導您完成翻譯內容的過程，從基本的互動式使用到使用命令列參數的更進階選項。

## 翻譯的運作方式

翻譯過程設計得既簡單又高效。當您執行 `translate` 命令時，WebSmith 會執行以下步驟：

1.  **識別來源內容**：它會載入您現有的網站結構和內容，並根據您的設定確定主要語言。
2.  **選擇頁面**：您可以指定要翻譯的頁面。如果您不指定，它將會呈現一個包含所有可用頁面的互動式清單供您選擇。
3.  **選擇目標語言**：您可以提供一個目標語言清單。如果您不提供，它將會顯示一個支援的語言清單供您選擇。
4.  **產生翻譯**：AI 會處理每個選定頁面的內容，並為每個選擇的語言產生翻譯版本。它可以使用選用的詞彙表來確保術語的一致性。
5.  **儲存翻譯檔案**：新翻譯的頁面會被儲存到特定語言的目錄中，供您檢閱和發布。

## 基本用法

對於最直接的方法，您可以不帶任何參數地執行此命令。WebSmith 將透過互動式提示引導您完成整個過程。

在您的終端機中執行以下命令：

```bash title="互動式翻譯" icon=lucide:terminal
aigne web translate
```

系統將提示您：
1.  選擇您希望翻譯的頁面（使用空格鍵選擇，按 Enter 鍵確認）。
2.  從支援的選項清單中選擇目標語言。

一旦您完成選擇，AI 將開始翻譯過程。

## 命令參數

為了獲得更多控制權以及在自動化腳本中使用，您可以使用以下命令列參數。

<x-field-group>
  <x-field data-name="--pages" data-type="array" data-required="false">
    <x-field-desc markdown>一個包含要翻譯的頁面路徑的陣列。如果省略，系統將提示您以互動方式選擇頁面。例如：`--pages /about /contact`</x-field-desc>
  </x-field>
  <x-field data-name="--langs" data-type="array" data-required="false">
    <x-field-desc markdown>一個包含要翻譯成的目標語言代碼的陣列。如果省略，系統將提示您以互動方式選擇語言。有關支援語言的完整列表，請參閱下表。</x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string" data-required="false">
    <x-field-desc markdown>一個特定術語的詞彙表，以確保翻譯過程中的術語一致性。您可以提供一個鍵值對字串，或使用 `@` 前綴引用一個檔案路徑（例如：`@./glossary.txt`）。</x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string" data-required="false">
    <x-field-desc markdown>向 AI 提供回饋，以優化和改進現有翻譯。這對於進行修正或調整語氣很有用。</x-field-desc>
  </x-field>
</x-field-group>

## 範例

### 將特定頁面翻譯成多種語言

此命令會將 `/about-us` 和 `/services/main` 頁面翻譯成日文和法文，而無需互動式提示。

```bash title="翻譯特定頁面" icon=lucide:terminal
aigne web translate --pages /about-us /services/main --langs ja fr
```

### 使用詞彙表確保術語一致性

為確保您的品牌名稱「WebSmith」和術語「SaaS」在翻譯成西班牙文時保持一致，您可以使用 `--glossary` 參數。

```bash title="使用行內詞彙表進行翻譯" icon=lucide:terminal
aigne web translate --langs es --glossary "WebSmith:WebSmith AI,SaaS:Software como Servicio"
```

對於較大的詞彙表，使用檔案會更實用。建立一個名為 `glossary.txt` 的檔案並包含您的術語，然後引用它。

```bash title="使用詞彙表檔案進行翻譯" icon=lucide:terminal
aigne web translate --langs de --glossary @./glossary.txt
```

## 支援的語言

下表列出了目前所有可用的翻譯語言。

| 語言 | 代碼 |
| :--- | :--- |
| 英文 | `en` |
| 簡體中文 | `zh` |
| 繁體中文 | `zh-TW` |
| 日文 | `ja` |
| 法文 | `fr` |
| 德文 | `de` |
| 西班牙文 | `es` |
| 義大利文 | `it` |
| 俄文 | `ru` |
| 韓文 | `ko` |
| 葡萄牙文 | `pt` |
| 阿拉伯文 | `ar` |

---

翻譯完您的內容後，下一個合乎邏輯的步驟就是將其提供給您的使用者。請在 [發布您的網站](./core-tasks-publishing-your-website.md) 章節中了解如何部署您的多語言網站。