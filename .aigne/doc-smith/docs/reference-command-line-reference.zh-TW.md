# 命令列參考

本文件為 AIGNE WebSmith 命令列介面 (CLI) 中所有可用指令提供了全面的參考資料。每個指令都詳細說明其用途、可用參數和實際使用範例。

本指南適用於需要詳細資訊以進行進階操作或自動化腳本的使用者。

## 指令摘要

下表快速總覽了所有可用的 `aigne web` 子指令。

| 指令 | 別名 | 說明 |
| :--- | :--- | :--- |
| `generate` | `gen`, `g` | 從一組需求中產生一個完整的網站。 |
| `publish` | - | 將產生的網站內容發布到 Pages Kit。 |
| `update` | - | 根據新的回饋或需求更新現有的網站內容。 |
| `translate` | - | 將現有的網站頁面翻譯成不同的語言。 |
| `chat` | - | 啟動一個互動式聊天會話來建立和修改您的網站。 |
| `theme` | - | 管理網站視覺主題，包括產生和應用。 |
| `component` | `comp` | 管理用於建立網站的元件庫。 |
| `prefs` | - | 管理從更新過程中的回饋中學習到的使用者偏好設定。 |
| `history` | - | 顯示對網站進行的所有先前更新的日誌。 |
| `clear` | - | 移除產生的檔案、工作區資料或設定。 |

---

## 主要指令

這些指令構成了使用 WebSmith 建立和管理網站的核心工作流程。

### generate

`generate` 指令是建立新網站的主要工具。它會調度一系列 AI Agent 來規劃網站結構、為每個頁面撰寫內容，並組合最終的資料檔案。

**用法**

```bash
aigne web generate [options]
```

**參數**

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>關於網站需求、結構和內容的詳細描述。可以作為字串提供，或透過輸入檔案提供（例如：`--input @my-website.yaml`）。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>網站目標受眾的描述。這有助於 AI 調整內容的語氣和重點。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>網站內容的目標語言（例如：`en` 代表英語，`zh` 代表中文）。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>網站期望的視覺和文字風格（例如：`business`、`creative`、`minimalist`）。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>Pages Kit 專案 ID。提供此 ID 有助於客製化產生的元件並為發布做準備。</x-field-desc>
  </x-field>
</x-field-group>

**範例**

此範例使用一個外部 YAML 檔案來提供產生規則。

```bash title="使用輸入檔案產生網站"
aigne web generate --input @my-website.yaml
```

```yaml title="my-website.yaml"
rules: |
  建立一個現代化的 SaaS 產品網站，其中包含：
  1. 一個具有明確價值主張的首頁。
  2. 一個詳細介紹產品功能的特色頁面。
  3. 一個具有多種訂閱等級的定價頁面。
  4. 一個帶有表單的聯絡頁面。
targetAudience: "中小型企業主"
locale: en
websiteStyle: business
```

### publish

`publish` 指令會將產生的網站頁面上傳到您的 Pages Kit 專案，使其上線。

**用法**

```bash
aigne web publish [options]
```

**參數**

<x-field-group>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>您的 Pages Kit 專案的唯一識別碼，網站將發布到此專案。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>指定要發布的網站語言版本。若未提供，將使用預設的地區設定。</x-field-desc>
  </x-field>
  <x-field data-name="dryRun" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>若設定為 `true`，指令將模擬發布過程而不進行任何實際變更，僅顯示將會上傳的內容。</x-field-desc>
  </x-field>
  <x-field data-name="overwrite" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>若設定為 `true`，Pages Kit 上任何具有相同路徑的現有頁面將被覆寫。請謹慎使用。</x-field-desc>
  </x-field>
</x-field-group>

**範例**

```bash title="發布網站的英文版本"
aigne web publish --projectId "your-project-id" --locale en --overwrite
```

### update

`update` 指令讓您能夠完善現有的網站內容。您可以提供回饋或新指令來修改特定頁面的結構或詳細資訊。

**用法**

```bash
aigne web update
```

此指令以互動模式執行，引導您完成選擇頁面和提供更新回饋的過程。

### translate

`translate` 指令會為您現有的網站頁面產生新的語言版本。它會讀取來源地區設定的內容，並在目標語言中建立對應的頁面。

**用法**

```bash
aigne web translate
```

此指令以互動模式執行，提示您選擇來源頁面和翻譯的目標語言。

### chat

`chat` 指令會啟動一個互動式、對話式的會話來建立或修改您的網站。此模式允許您以自然語言下達指令，AI 將執行相應的操作，例如建立新頁面、修改內容或規劃網站結構。

**用法**

```bash
aigne web chat
```

## 管理指令

這些指令用於管理與您網站專案相關的資產、設定和歷史記錄。

### theme

`theme` 指令群組用於管理您網站的視覺風格。

#### theme generate

根據您的設計需求建立一個新的主題設定。

**用法**

```bash
aigne web theme generate --name "My Custom Theme"
```

**參數**

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="true">
    <x-field-desc markdown>您正在建立的新主題的唯一名稱。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>如果您需要覆寫預設設定，則為設定檔案的路徑。</x-field-desc>
  </x-field>
</x-field-group>

#### theme apply

將先前產生的主題應用到您的網站。

**用法**

```bash
aigne web theme apply
```

此指令以互動方式執行，讓您選擇要應用的主題。

### component

`component` 指令群組管理用於建構您網站頁面的視覺元件庫（例如：Hero、FAQ、CTA）。

#### component pull

從指定的 Pages Kit 專案 URL 中提取元件庫。這可以確保您的本地專案擁有用於頁面產生的最新可用元件。

**用法**

```bash
aigne web component pull --url "your-pages-kit-url"
```

**參數**

<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true">
    <x-field-desc markdown>您的 Pages Kit 專案的元件提取端點的完整 URL。此 URL 包含必要的專案 ID 和驗證密鑰。</x-field-desc>
  </x-field>
</x-field-group>

### prefs

`prefs` 指令允許您檢視和管理 WebSmith 在內容更新過程中從您的回饋中學習到的使用者偏好設定。這些偏好設定有助於 AI 在未來的操作中更好地符合您的風格。

**用法**

```bash
aigne web prefs [action] [options]
```

**操作與參數**

<x-field-group>
  <x-field data-name="--list" data-type="boolean" data-required="false">
    <x-field-desc markdown>顯示所有已儲存的偏好設定，並標示其狀態（啟用/停用）、範圍和內容。</x-field-desc>
  </x-field>
  <x-field data-name="--remove" data-type="boolean" data-required="false">
    <x-field-desc markdown>移除一個或多個偏好設定。可與 `--id` 一起使用，若未提供 ID，則以互動方式執行。</x-field-desc>
  </x-field>
  <x-field data-name="--toggle" data-type="boolean" data-required="false">
    <x-field-desc markdown>切換一個或多個偏好設定的啟用狀態。可與 `--id` 一起使用，或以互動方式執行。</x-field-desc>
  </x-field>
  <x-field data-name="--id" data-type="array" data-required="false">
    <x-field-desc markdown>指定要對其執行 `--remove` 或 `--toggle` 操作的偏好設定的唯一 ID。</x-field-desc>
  </x-field>
</x-field-group>

**範例**

```bash title="列出所有已儲存的偏好設定"
aigne web prefs --list
```

```bash title="根據 ID 移除特定的偏好設定"
aigne web prefs --remove --id "pref_abc123"
```

### history

`history` 指令群組提供存取您網站變更日誌的功能。

#### history view

以精簡的 git-log 風格格式顯示更新歷史記錄。每個條目都包含一個唯一的雜湊值、變更日期、執行的操作以及觸發更新的回饋。

**用法**

```bash
aigne web history view
```

### clear

`clear` 指令用於移除產生的內容並重設部分工作區。這在需要重新開始或清理磁碟空間時很有用。

**用法**

```bash
aigne web clear
```

此指令預設以互動模式執行，讓您選擇要清除的項目。您也可以直接指定目標。

**參數**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false">
    <x-field-desc markdown>一組無需提示即可清除的項目陣列。有效值為 `workspace`、`generatedPages` 和 `websiteConfig`。</x-field-desc>
  </x-field>
</x-field-group>

**範例**

```bash title="以非互動方式清除工作區和產生的頁面"
aigne web clear --targets workspace generatedPages
```