# 本地化網站

使用本指南執行 `aigne web translate`，選擇您想要的頁面和語言，並儲存已本地化的版本，以便與您的主要網站一同發佈。

AIGNE WebSmith 提供了一種強大而直接的方法，可以自動將您的網站內容翻譯成多種語言，讓您能以最少的心力觸及全球受眾。`translate` 指令使用 AI 為您現有的頁面生成高品質的翻譯。

本文件將引導您完成內容翻譯的過程，從基本的互動式使用到使用命令列參數的進階選項。

## 翻譯如何運作

翻譯過程的設計旨在簡單而高效。當您執行 `translate` 指令時，WebSmith 會執行以下步驟：

1.  **識別來源內容**：它會載入您現有的網站結構和內容，並從您的設定中確定主要語言。
2.  **選擇頁面**：您可以指定要翻譯的頁面。如果您未指定，它將以互動方式列出所有可用的頁面供您選擇。
3.  **選擇目標語言**：您可以提供一個目標語言列表。如果您未提供，它將顯示支援的語言列表供您選擇。
4.  **生成翻譯**：AI 會處理每個選定頁面的內容，並為每種選擇的語言生成一個翻譯版本。它可以使用選用的詞彙表來確保術語的一致性。
5.  **儲存翻譯檔案**：新翻譯的頁面會被儲存到特定語言的目錄中，供您審閱和發佈。

## 基本用法

最直接的方法是執行不帶任何參數的指令。WebSmith 將透過互動式提示引導您完成整個過程。

在您的終端機中執行以下指令：

```bash 本地化網站 icon=lucide:terminal
aigne web translate
```

![顯示為翻譯選擇了多種語言的互動式提示](../../../assets/images/web-smith-translate.png)

系統將提示您：
1.  選擇您希望翻譯的頁面（使用空白鍵選擇，按 Enter 鍵確認）。
2.  從支援的選項列表中選擇目標語言。

在您做出選擇後，AI 將開始翻譯過程。

## 指令參數

為了獲得更多控制權以及在自動化腳本中使用，您可以使用以下命令列參數。

<x-field-group>
  <x-field data-name="--pages" data-type="array" data-required="false">
    <x-field-desc markdown>一個要翻譯的頁面路徑陣列。如果省略，系統將提示您以互動方式選擇頁面。例如：`--pages /about /contact`</x-field-desc>
  </x-field>
  <x-field data-name="--langs" data-type="array" data-required="false">
    <x-field-desc markdown>一個要翻譯成的語言代碼陣列。如果省略，系統將提示您以互動方式選擇語言。請參閱下表以獲取完整的支援語言列表。</x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string" data-required="false">
    <x-field-desc markdown>一個特定術語的詞彙表，以確保翻譯過程中術語的一致性。您可以提供一個鍵值對字串，或使用 `@` 前綴引用一個檔案路徑（例如：`@./glossary.txt`）。</x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string" data-required="false">
    <x-field-desc markdown>向 AI 提供回饋以改善和優化現有的翻譯。這對於進行修正或調整語氣很有用。</x-field-desc>
  </x-field>
</x-field-group>

## 範例

### 將特定頁面翻譯成多種語言

此指令會將 `/about-us` 和 `/services/main` 頁面翻譯成日語和法語，無需互動式提示。

```bash 翻譯特定頁面 icon=lucide:terminal
aigne web translate --pages /about-us /services/main --langs ja fr
```

### 使用詞彙表以確保術語一致

為確保您的品牌名稱「WebSmith」和術語「SaaS」在翻譯成西班牙語時保持一致，您可以使用 `--glossary` 參數。

```bash 使用詞彙表翻譯 icon=lucide:terminal
aigne web translate --langs es --glossary "WebSmith:WebSmith AI,SaaS:Software como Servicio"
```

對於較大的詞彙表，使用檔案會更實用。建立一個名為 `glossary.txt` 的檔案並包含您的術語，然後引用它。

```bash 使用詞彙表檔案翻譯 icon=lucide:terminal
aigne web translate --langs de --glossary @./glossary.txt
```

## 支援的語言

下表列出了目前所有可用的翻譯語言。

| 語言 | 代碼 |
| :--- | :--- |
| 英語 | `en` |
| 簡體中文 | `zh` |
| 繁體中文 | `zh-TW` |
| 日語 | `ja` |
| 法語 | `fr` |
| 德語 | `de` |
| 西班牙語 | `es` |
| 義大利語 | `it` |
| 俄語 | `ru` |
| 韓語 | `ko` |
| 葡萄牙語 | `pt` |
| 阿拉伯語 | `ar` |

---

翻譯完您的內容後，下一步自然是將其提供給您的使用者。請在[發佈網站](./guides-publish-website.md)部分了解如何部署您的多語言網站。