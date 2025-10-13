# 清理工作區與資料

`clear` 命令提供了一種安全且方便的方式，用於移除生成的內容、臨時工作區檔案或整個網站設定。當您想從頭開始生成過程、釋放磁碟空間或重設專案設定時，這個功能特別有用。

您可以以互動方式執行此命令以選擇要移除的特定項目，或直接指定目標以進行自動清理。

## 命令用法

若要啟動清理過程，請在您的終端機中執行以下命令：

```bash
aigne clear
```

當不指定任何目標執行時，此命令會進入互動模式。它會掃描您的專案中可移除的項目，並向您顯示一個清單。這是大多數使用情境下的建議方法，因為它能讓您檢視將被刪除的內容。

```text
? 請選擇要清理的項目：
❯ ◉ workspace
  ◯ generated pages
  ◯ website configuration
```

## 可清理的目標

`clear` 命令可以移除多種類型的資料，每種類型都有其特定用途。

| 目標名稱 | 說明 |
| :--- | :--- |
| `workspace` | 移除臨時檔案和中繼資料，例如 AI 生成的網站結構。在重新生成網站之前清理此項目通常很有用，以確保不會使用舊資料。 |
| `generatedPages` | 刪除包含最終生成的網站頁面和資產的輸出目錄。 |
| `websiteConfig` | 移除主要的 `config.yaml` 檔案。**請謹慎使用此選項**，因為您需要執行 `aigne web init` 來建立新的設定，才能再次生成網站。 |

## 清理特定目標

對於腳本或非互動式使用，您可以透過將目標名稱作為參數傳遞給命令來指定要清理的項目。您可以提供一個或多個目標。

命令將跳過互動式提示，並立即移除指定的項目。

### 範例：清理工作區與頁面

若要不經提示直接移除臨時工作區和先前生成的頁面，請使用以下命令：

```bash title="終端機"
aigne clear workspace generatedPages
```

輸出將確認哪些項目已被清理，哪些項目原本就是空的。

```text
✅ 清理成功！

- 🧹 已清理工作區 (./.tmp)
- 🧹 已清理生成的頁面 (./dist)
```

### 範例：清理所有項目

若要完全重設您的專案，您可以清理所有可用的目標。

```bash title="終端機"
aigne clear workspace generatedPages websiteConfig
```

執行此命令後，您將需要重新初始化您的專案。

```text
✅ 清理成功！

- 🧹 已清理工作區 (./.tmp)
- 🧹 已清理生成的頁面 (./dist)
- 🧹 已清理網站設定 (./config.yaml)

👉 請執行 `aigne web init` 來生成一個新的設定檔。
```

## 參數

`clear` 命令接受數個可選參數以覆寫預設路徑，從而對清理過程進行更進階的控制。

<x-field-group>
  <x-field data-name="targets" data-type="array">
    <x-field-desc markdown>一個字串陣列，用於指定要清理的項目而無需提示。有效選項為 `workspace`、`generatedPages` 和 `websiteConfig`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string">
    <x-field-desc markdown>覆寫來源頁面的預設目錄，這有助於定位 `config.yaml` 檔案。</x-field-desc>
  </x-field>
  <x-field data-name="tmpDir" data-type="string">
    <x-field-desc markdown>覆寫臨時工作區目錄 (`.tmp`) 的預設路徑。</x-field-desc>
  </x-field>
  <x-field data-name="outputDir" data-type="string">
    <x-field-desc markdown>覆寫生成的頁面輸出目錄的預設路徑。</x-field-desc>
  </x-field>
  <x-field data-name="configPath" data-type="string">
    <x-field-desc markdown>提供網站設定檔的直接路徑，覆寫任何推斷出的位置。</x-field-desc>
  </x-field>
</x-field-group>