# 終端機播放器

終端機播放器是一個專門用於在您的網站上顯示互動式、預錄終端機會話的元件。這個元件是一個有效的工具，可用於示範命令列指令、展示軟體安裝過程，或以清晰且可重播的格式引導使用者完成技術流程。

此元件使用以 `asciinema` 格式建立的錄製檔案，確保對終端機輸出進行輕量級、基於文字的擷取。

## 流程概覽

使用終端機播放器的工作流程可以分解為一系列清晰、易於管理的步驟。此流程始於開發者錄製終端機會話，並以終端使用者在網站上觀看互動式播放結束。

```d2
direction: down

Developer: {
  shape: c4-person
}

Terminal: {
  label: "終端機\n(使用 asciinema CLI)"
  shape: rectangle
}

Cast-File: {
  label: "my-demo.cast"
  shape: rectangle
}

Online-Converter: {
  label: "ArcBlock 線上轉換器"
  shape: rectangle
}

JSON-File: {
  label: "my-demo.json"
  shape: rectangle
}

Website-Project: {
  label: "網站專案"
  shape: rectangle

  Page-Config: {
    label: "頁面 YAML 設定檔"
  }

  Terminal-Player-Component: {
    label: "TerminalPlayer 元件"
  }
}

Website-Visitor: {
  shape: c4-person
}

Developer -> Terminal: "1. 錄製會話"
Terminal -> Cast-File: "2. 產生"
Cast-File -> Online-Converter: "3. 上傳並轉換"
Online-Converter -> JSON-File: "4. 下載"
JSON-File -> Website-Project.Page-Config: "5. 在設定檔中引用"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 顯示播放內容"
```

## 建立終端機錄製

要使用終端機播放器，您必須先建立一個錄製檔案。建議為此使用的工具是 `asciinema`，一個用於錄製和分享終端機會話的開源命令列工具。

### 步驟 1：安裝 `asciinema` CLI

首先，在您的本機上安裝 `asciinema` 工具。安裝方法因您的作業系統而異。

```bash 安裝 icon=lucide:download
# 在 macOS 上使用 Homebrew
brew install asciinema

# 在 Ubuntu/Debian 上使用 APT
sudo apt install asciinema

# 使用 pipx (跨平台)
pipx install asciinema
```

有關其他安裝選項，請參閱官方 [asciinema 文件](https://docs.asciinema.org/)。

### 步驟 2：錄製您的會話

安裝 `asciinema` 後，您可以執行 `rec` 指令來開始錄製終端機會話。

```bash 錄製指令 icon=lucide:radio-tower
# 開始新的錄製，將儲存至 'my-demo.cast'
asciinema rec my-demo.cast
```

啟動指令後，在您的終端機中執行所有您想要擷取的動作。若要停止錄製，請按下 `Ctrl+D` 或輸入 `exit` 指令。一個名為 `my-demo.cast` 的檔案將儲存在您目前的目錄中。您可以透過執行 `asciinema play my-demo.cast` 在本機驗證播放內容。

**重要注意事項：**
*   **規劃您的步驟：** 錄製過程會擷取所有動作，包括暫停和錯誤。建議事先準備好腳本。
*   **終端機尺寸：** 播放器將複製錄製時所用終端機的欄寬和列高。請確保您的終端機視窗大小適當，以防止播放時內容換行或被截斷。

### 步驟 3：將 `.cast` 檔案轉換為 JSON

Terminal Player 元件要求錄製資料為特定的 JSON 格式。有一個線上轉換器可以簡化此轉換過程。

1.  **前往轉換器：** 在您的網頁瀏覽器中開啟 [ArcBlock 終端機播放器轉換器](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)。
2.  **上傳您的檔案：** 將您的 `.cast` 檔案拖放到頁面上。
3.  **預覽並下載：** 該工具將產生您錄製內容的即時預覽。確認無誤後，下載轉換後的 `.json` 檔案。
4.  **新增至專案：** 將下載的 JSON 檔案放入您網站的媒體或資產目錄中。

## 使用 Terminal Player 元件

在建立並轉換您的錄製檔案後，您可以透過在頁面的設定檔中定義 Terminal Player 來將其整合到任何頁面。您需要指定錄製檔案的 JSON 路徑，也可以選擇性地設定其版面配置。

### 設定範例

以下是在頁面的資料檔案中設定 `TerminalPlayer` 元件的範例。

```yaml 頁面設定範例 icon=lucide:file-cog
# 在您頁面的 YAML 設定檔中 (例如 page-name.yaml)

# ... 其他頁面內容 ...

sections:
  - component: TerminalPlayer
    props:
      # 顯示在終端機播放器上方的標題
      title: "Live Demo"
      # 關於錄製內容的簡要說明
      description: "This demo shows how to initialize a new AIGNE WebSmith project."
      # 您的錄製檔案的相對路徑
      recording: "/assets/data/my-demo.json"
      # (選用) 元件的版面配置。預設為 'right'。
      layout: "left"

# ... 其他頁面區塊 ...
```

### 元件屬性

`TerminalPlayer` 元件接受以下屬性來自訂其外觀和行為。

| 屬性 | 類型 | 是否必要 | 說明 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | 是 | 元件區塊的標題。 |
| `description` | `string` | 否 | 與標題一同顯示的簡短說明。 |
| `recording` | `string` | 是 | JSON 錄製檔案的路徑。 |
| `layout` | `string` | 否 | 決定文字內容相對於播放器的位置。可以是 `left` 或 `right`。預設為 `right`。 |

## 總結

Terminal Player 元件提供了一種強大的方法來展示命令列工作流程。透過遵循使用 `asciinema` 錄製、線上轉換檔案以及在您的頁面資料中設定元件的程序，您可以為您的使用者製作具吸引力且資訊豐富的技術教學。

欲了解更多資訊，請參閱官方 [asciinema 網站](https://asciinema.org/)。