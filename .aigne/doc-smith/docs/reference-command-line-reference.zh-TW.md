# 命令列參考

本文件為 AIGNE WebSmith 命令列介面 (CLI) 中所有可用命令的完整參考。每個條目都包含命令功能的描述、其可用的別名，以及其參數和選項的詳細清單。

所有命令的通用語法為：
```bash
aigne web <command> [subcommand] [options]
```

在沒有任何命令的情況下執行 `aigne web` 將會啟動一個互動式聊天會話。

## 主要命令

下表總結了 AIGNE WebSmith CLI 中可用的主要命令。

| 命令 | 描述 |
| :--- | :--- |
| [generate](#generate) | 根據設定檔產生一個完整的網站。 |
| [publish](#publish) | 將產生的網站內容發佈至 Pages Kit 平台。 |
| [update](#update) | 根據新的回饋或需求修改現有網站的內容。 |
| [translate](#translate) | 將現有網站頁面翻譯成不同語言。 |
| [theme](#theme) | 管理網站的視覺主題，包含產生與套用。 |
| [component](#component) | 管理用於建構網站的元件庫。 |
| [chat](#chat) | 啟動互動式聊天會話（預設），以對話方式建構和修改您的網站。 |
| [prefs](#prefs) | 管理已儲存的使用者偏好設定，以自訂 WebSmith 的行為。 |
| [history](#history) | 顯示對網站所做的所有先前更新的日誌。 |
| [clear](#clear) | 移除產生的檔案、工作區資料或設定。 |

---

### generate
從使用者提供的設定檔產生一個完整的網站。此命令會統籌整個過程，從規劃網站結構到產生頁面內容和範本。

**別名：** `gen`, `g`

**用法：**
```bash
aigne web generate
```

**參數：**

<x-field-group>
  <x-field data-name="config" data-type="String" data-required="true" data-desc="網站設定檔的路徑。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含術語詞彙表的檔案，以確保在產生的內容中術語的一致性。使用 @<file> 格式。"></x-field>
  <x-field data-name="forceRegenerate" data-type="Boolean" data-required="false" data-desc="若設為 true，則強制重新產生所有頁面，即使它們已存在。"></x-field>
</x-field-group>

### publish
將產生的網站檔案發佈至 Pages Kit 實例。此命令處理批次上傳並提供狀態監控。

**別名：** `pub`, `p`

**用法：**
```bash
aigne web publish --appUrl "https://your-pages-kit-url.com"
```

**參數：**

<x-field-group>
  <x-field data-name="appUrl" data-type="String" data-required="false" data-desc="目標 Pages Kit 網站的基礎 URL，頁面將發佈至此。"></x-field>
  <x-field data-name="with-navigations" data-type="Boolean" data-required="false" data-desc="若設為 true，則將網站導覽資料與頁面一同發佈。"></x-field>
  <x-field data-name="with-locales" data-type="Boolean" data-required="false" data-desc="若設為 true，則發佈網站的地區設定和語言設定。"></x-field>
</x-field-group>

### update
根據使用者回饋更新現有網站的內容。此命令可用於修飾文字、新增區塊或修改頁面結構。

**別名：** `up`

**用法：**
```bash
aigne web update --pages "/about-us" --feedback "Add a new section for team members."
```

**參數：**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="要更新的頁面路徑陣列（例如 /about-us, /contact）。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="關於內容所需變更或改進的詳細描述。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含術語詞彙表的檔案，以確保一致性。使用 @<file> 格式。"></x-field>
</x-field-group>

### translate
將現有網站頁面的內容翻譯成一種或多種指定語言。

**用法：**
```bash
aigne web translate --pages /home --langs fr de es
```

**參數：**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="要翻譯的頁面路徑陣列。"></x-field>
  <x-field data-name="langs" data-type="Array" data-required="false" data-desc="以空格分隔的語言代碼列表，用於將內容翻譯成指定語言。可用代碼包括：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="用於提高翻譯品質的具體說明或回饋。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含術語詞彙表的檔案，以確保翻譯一致性。使用 @<file> 格式。"></x-field>
</x-field-group>

### theme
管理您網站的視覺主題。您可以根據您的設計偏好產生新主題並將其套用至您的網站。

#### 子命令

**`generate`** (別名: `gen`)
根據您的網站設計產生一個新的主題設定。

**用法：**
```bash
aigne web theme generate --name "MyCustomTheme" --config @path/to/config.yaml
```

**參數：**

<x-field-group>
  <x-field data-name="name" data-type="String" data-required="false" data-desc="新主題的唯一名稱。"></x-field>
  <x-field data-name="config" data-type="String" data-required="false" data-desc="用於作為主題基礎的網站設定檔路徑。"></x-field>
</x-field-group>

**`apply`**
將先前產生的主題套用至網站。

**用法：**
```bash
aigne web theme apply --appUrl "https://your-pages-kit-url.com"
```

**參數：**

<x-field-group>
  <x-field data-name="appUrl" data-type="String" data-required="false" data-desc="目標 Pages Kit 網站的基礎 URL，主題將套用至此。"></x-field>
</x-field-group>

### component
管理您網站的元件庫。

**別名：** `comp`

#### 子命令

**`pull`**
從指定的 URL 拉取更新的元件庫。這能確保您的網站是使用最新的視覺元件建構的。

**用法：**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```

**參數：**

<x-field-group>
  <x-field data-name="url" data-type="String" data-required="true" data-desc="由您的 Pages Kit 實例提供的完整 URL，用於拉取元件庫。"></x-field>
</x-field-group>

### chat
啟動一個互動式聊天會話，讓您以對話方式產生、更新和管理您的網站。如果未指定其他命令，此為**預設命令**。聊天代理可以存取所有其他命令。

**用法：**
```bash
aigne web
```

此命令不接受任何參數。它會在您的終端機中開啟一個互動式提示。

### prefs
管理 WebSmith 隨著時間從您的回饋中學習到的使用者偏好設定。這些偏好設定有助於根據您的特定需求量身打造 AI 的輸出。

**用法：**
```bash
# 列出所有已儲存的偏好設定
aigne web prefs --list

# 透過 ID 移除特定的偏好設定
aigne web prefs --remove --id "pref_abc123"
```

**參數：**

<x-field-group>
  <x-field data-name="--list" data-type="Flag" data-required="false" data-desc="以格式化清單顯示所有已儲存的使用者偏好設定。"></x-field>
  <x-field data-name="--remove" data-type="Flag" data-required="false" data-desc="移除一個或多個偏好設定。需要 --id 參數，否則將提示進行選擇。"></x-field>
  <x-field data-name="--toggle" data-type="Flag" data-required="false" data-desc="切換一個或多個偏好設定的啟用狀態。需要 --id，否則將提示進行選擇。"></x-field>
  <x-field data-name="--id" data-type="Array" data-required="false" data-desc="要管理（移除或切換）的偏好設定 ID 陣列。僅在非互動式使用 --remove 或 --toggle 時為必要。"></x-field>
</x-field-group>

### history
提供您網站內容和結構的更新歷史記錄檢視。

#### 子命令

**`view`** (別名: `log`, `list`)
以類似 `git log` 的精簡日誌風格格式顯示更新歷史記錄。每個條目都包含一個唯一的雜湊值、更新日期、執行的操作以及提供的回饋。

**用法：**
```bash
aigne web history view
```

此命令不接受任何參數。

### clear
安全地移除產生的檔案、工作區資料或設定。這對於重新開始或清理您的專案目錄很有用。

**用法：**
```bash
# 無需提示即可清除網站結構和產生的頁面
aigne web clear --targets websiteStructure generatedPages
```

**參數：**

<x-field-group>
  <x-field data-name="targets" data-type="Array" data-required="false" data-desc="無需提示即可清除的項目陣列。可能的值：websiteStructure、generatedPages、websiteConfig、deploymentConfig、authTokens、mediaDescription。"></x-field>
  <x-field data-name="pagesDir" data-type="String" data-required="false" data-desc="覆寫您的來源頁面的預設目錄路徑。"></x-field>
  <x-field data-name="tmpDir" data-type="String" data-required="false" data-desc="覆寫暫存工作區的預設目錄路徑。"></x-field>
  <x-field data-name="outputDir" data-type="String" data-required="false" data-desc="覆寫產生的頁面的預設目錄路徑。"></x-field>
  <x-field data-name="configPath" data-type="String" data-required="false" data-desc="覆寫設定檔的預設路徑。"></x-field>
</x-field-group>

## 總結

本參考指南涵蓋了 AIGNE WebSmith CLI 的主要命令及其參數。如需更詳細、以任務為導向的說明，請參閱 [核心任務](./core-tasks.md) 章節中的指南。