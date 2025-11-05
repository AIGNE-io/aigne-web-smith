# 命令列參考

本文件為 AIGNE WebSmith 命令列介面（CLI）中所有可用命令提供了全面、符合事實的參考。每個條目都包含命令功能的描述、其可用的別名，以及其參數和子命令的詳細清單。

CLI 操作的標準語法如下：
```bash
aigne web <command> [subcommand] [parameters]
```

執行 `aigne web` 而不帶任何命令將啟動一個互動式聊天會話。

## 主要命令

下表總結了主要的命令。每個命令在以下各節中有更詳細的說明。

| 命令 | 別名 | 描述 |
| :--- | :--- | :--- |
| [generate](#generate) | `gen`, `g` | 根據設定檔產生一個完整的網站。 |
| [publish](#publish) | `pub`, `p` | 將產生的網站發佈到一個 Pages Kit 實例。 |
| [update](#update) | `up` | 根據使用者回饋修改現有網站內容。 |
| [translate](#translate) | | 將網站頁面翻譯成不同語言。 |
| [theme](#theme) | | 管理網站視覺主題，包括產生和應用。 |
| [component](#component) | `comp` | 管理用於建構網站的元件庫。 |
| [chat](#chat) | | 啟動一個用於網站管理的互動式聊天會話（預設）。 |
| [prefs](#prefs) | | 管理從回饋中學習到的已儲存使用者偏好。 |
| [history](#history) | | 顯示對網站所做的先前更新的日誌。 |
| [clear](#clear) | | 移除產生的檔案、工作區資料或設定。 |

---

### generate
`generate` 命令負責協調創建一個完整的網站，從規劃網站結構到根據指定的設定檔產生頁面內容和範本。

**別名：** `gen`, `g`

**用法：**
```bash
aigne web generate
```

**參數：**

<x-field-group>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="指定網站設定的檔案路徑。這通常是自動提供的。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向一個詞彙表檔案的路徑，以確保術語的一致性。使用格式 @<file>。"></x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false" data-desc="強制重新產生所有頁面，覆蓋任何現有的已產生內容。"></x-field>
</x-field-group>

### publish
`publish` 命令會將產生的網站檔案上傳到一個 Pages Kit 實例。它管理批次上傳過程並提供狀態監控。

**別名：** `pub`, `p`

**用法：**
```bash
aigne web publish --appUrl "https://example.com"
```

**參數：**

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="將要發佈頁面的目標 Pages Kit 網站的基礎 URL。"></x-field>
  <x-field data-name="with-navigations" data-type="string" data-required="false" data-default="menu" data-desc="發佈導航資料。可接受的值為 'flat' 或 'menu'。"></x-field>
  <x-field data-name="with-locales" data-type="boolean" data-required="false" data-desc="設定為 true 時，發佈網站的地區設定和語言設定。"></x-field>
</x-field-group>

### update
`update` 命令根據使用者提供的回饋修改現有網站的內容。它可用於完善文字、新增或移除區塊，或更改頁面結構。

**別名：** `up`

**用法：**
```bash
aigne web update --pages "/about" --feedback "Add a mission statement."
```

**參數：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="一個需要更新的頁面路徑陣列（例如：[\"/about-us\", \"/contact\"]）。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="對指定頁面所需變更或改進的描述。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向一個詞彙表檔案的路徑，以確保術語的一致性。使用格式 @<file>。"></x-field>
</x-field-group>

### translate
`translate` 命令將現有網站頁面的內容翻譯成一個或多個指定的語言。

**用法：**
```bash
aigne web translate --pages "/home" --langs "fr,de,es"
```

**參數：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="一個需要翻譯的頁面路徑陣列。"></x-field>
  <x-field data-name="langs" data-type="array" data-required="false" data-desc="一個語言代碼的陣列。可用語言：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="用以指導和改善翻譯品質的具體說明。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向一個詞彙表檔案的路徑，以確保翻譯的一致性。使用格式 @<file>。"></x-field>
</x-field-group>

### theme
`theme` 命令管理網站的視覺主題，包括其產生和應用。

#### 子命令

**`generate`**
根據網站的設計和使用者建議產生一個新主題。

**別名：** `gen`

**用法：**
```bash
aigne web theme generate --name "CustomTheme"
```

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="false" data-desc="新主題的名稱。"></x-field>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="用作主題基礎的網站設定檔案路徑。"></x-field>
</x-field-group>

**`apply`**
將先前產生的主題應用到網站上。

**別名：** `a`

**用法：**
```bash
aigne web theme apply
```
此子命令沒有任何特定參數。它會應用目前設定的主題。

### component
`component` 命令管理網站的元件庫。

**別名：** `comp`

#### 子命令

**`pull`**
從指定的 URL 拉取元件以更新本地元件庫。

**用法：**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```
<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true" data-desc="用於拉取元件庫的完整 URL。"></x-field>
</x-field-group>

**`list`**
列出目前元件庫中可用的元件。

**別名：** `ls`, `l`

**用法：**
```bash
aigne web component list
```
此子命令不接受任何參數。

### chat
`chat` 命令會啟動一個互動式會話，以對話方式產生、更新和管理網站。這是執行 `aigne web` 而未指定其他命令時的預設命令。

**用法：**
```bash
aigne web
```
此命令不接受任何參數。

### prefs
`prefs` 命令管理 WebSmith 從回饋中學習到的使用者偏好，以自訂 AI 行為。

#### 子命令
**`list`**
列出所有已儲存的使用者偏好。

**別名：** `ls`

**用法：**
```bash
aigne web prefs list
```
此子命令不接受任何參數。

**`remove`**
移除一個或多個指定的偏好。

**別名：** `rm`

**用法：**
```bash
aigne web prefs remove --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="一個要移除的偏好 ID 陣列。"></x-field>
</x-field-group>

**`toggle`**
切換一個或多個偏好的啟用狀態。

**別名：** `t`

**用法：**
```bash
aigne web prefs toggle --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="一個將要切換狀態的偏好 ID 陣列。"></x-field>
</x-field-group>

### history
`history` 命令用於查看網站內容和結構的更新歷史。

#### 子命令

**`view`**
以緊湊的日誌風格格式顯示更新歷史。每個條目都包含一個雜湊值、日期、操作以及相關的回饋。

**別名：** `log`, `list`

**用法：**
```bash
aigne web history view
```
此子命令不接受任何參數。

### clear
`clear` 命令會從專案目錄中移除產生的檔案、工作區資料或設定。

**用法：**
```bash
aigne web clear --targets "generatedPages" "websiteConfig"
```

**參數：**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false" data-desc="一個無需提示即可清除的項目陣列。有效項目為：websiteStructure、generatedPages、websiteConfig、deploymentConfig、authTokens、mediaDescription、translationCaches。"></x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="false" data-desc="覆蓋來源頁面的預設目錄路徑。"></x-field>
  <x-field data-name="tmpDir" data-type="string" data-required="false" data-desc="覆蓋暫存工作區的預設目錄路徑。"></x-field>
  <x-field data-name="outputDir" data-type="string" data-required="false" data-desc="覆蓋已產生頁面的預設目錄路徑。"></x-field>
  <x-field data-name="configPath" data-type="string" data-required="false" data-desc="覆蓋設定檔的預設路徑。"></x-field>
</x-field-group>

---

## 總結

本參考指南詳細介紹了 AIGNE WebSmith CLI 的主要命令和參數。如需以任務為導向的說明，請參閱文件中[核心任務](./core-tasks.md)部分的指南。