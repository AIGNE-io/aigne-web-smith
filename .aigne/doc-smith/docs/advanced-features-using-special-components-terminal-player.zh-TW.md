# 終端機播放器

終端機播放器 (Terminal Player) 是一個專門用來在您的網站上顯示互動式、預錄終端機工作階段的元件。此元件是一個有效的工具，能以清晰且可重播的格式，來示範指令行操作、展示軟體安裝過程，或引導使用者完成技術流程。

此元件使用 `asciinema` 格式建立的錄製檔，確保了對終端機輸出的輕量、基於文字的擷取。

## 流程概覽

使用終端機播放器的工作流程可分解為一系列清晰、易於管理的步驟。此流程始於開發者錄製終端機工作階段，並以終端使用者在網站上觀看互動式播放告終。

```d2
direction: down

Developer: {
  shape: c4-person
  label: "開發者"
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
    label: "頁面 YAML 設定"
  }

  Terminal-Player-Component: {
    label: "TerminalPlayer 元件"
  }
}

Website-Visitor: {
  shape: c4-person
  label: "網站訪客"
}

Developer -> Terminal: "1. 錄製工作階段"
Terminal -> Cast-File: "2. 產生"
Cast-File -> Online-Converter: "3. 上傳並轉換"
Online-Converter -> JSON-File: "4. 下載"
JSON-File -> Website-Project.Page-Config: "5. 在設定中引用"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 顯示播放"
```

## 建立終端機錄製

要使用終端機播放器，您必須先建立一個錄製檔。為此，推薦的工具是 `asciinema`，這是一個用於錄製和分享終端機工作階段的開源指令行工具。

### 步驟一：安裝 `asciinema` CLI

首先，在您的本機電腦上安裝 `asciinema` 工具。安裝方法因您的作業系統而異。

```bash 安裝 icon=lucide:download
# 在 macOS 上使用 Homebrew
brew install asciinema

# 在 Ubuntu/Debian 上使用 APT
sudo apt install asciinema

# 使用 pipx (跨平台)
pipx install asciinema
```

如需更多安裝選項，請參考官方 [asciinema 文件](https://docs.asciinema.org/)。

### 步驟二：錄製您的工作階段

安裝 `asciinema` 後，您可以透過執行 `rec` 指令開始錄製終端機工作階段。

```bash 錄製指令 icon=lucide:radio-tower
# 開始新的錄製，將儲存為 'my-demo.cast'
asciinema rec my-demo.cast
```

啟動指令後，在您的終端機中執行所有您想要擷取的操作。要停止錄製，請按 `Ctrl+D` 或輸入 `exit` 指令。一個名為 `my-demo.cast` 的檔案將儲存在您目前的目錄中。您可以透過執行 `asciinema play my-demo.cast` 在本機驗證播放。

**重要注意事項：**
*   **規劃您的步驟：** 錄製會擷取所有操作，包含暫停和錯誤。建議事先準備好腳本。
*   **終端機尺寸：** 播放器將複製錄製時所用終端機的欄寬和列高。請確保您的終端機視窗大小適當，以防止播放時內容換行或被截斷。

### 步驟三：將 .cast 檔案轉換為 JSON

Terminal Player 元件要求錄製資料為特定的 JSON 格式。我們提供一個線上轉換器來簡化此轉換過程。

1.  **前往轉換器：** 在您的網頁瀏覽器中開啟 [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)。
2.  **上傳您的檔案：** 將您的 `.cast` 檔案拖曳到頁面上。
3.  **預覽並下載：** 該工具將產生您錄製內容的即時預覽。確認無誤後，下載轉換後的 `.json` 檔案。
4.  **新增至專案：** 將下載的 JSON 檔案放入您網站的媒體或資產目錄中。
 
## 使用錄製檔
 
一旦將 JSON 錄製檔放置在您專案的媒體或資產目錄中，AI 就可以使用它。無需在 YAML 檔案中手動設定元件。
 
只需在您的內容來源檔案中描述需要終端機示範。當您執行 `aigne generate` 或 `aigne update` 時，AI 將自動找到相關的 `.json` 錄製檔，並使用 Terminal Player 元件將其顯示在您的網站上。
 
```bash AIGNE CLI 指令 icon=lucide:terminal
# 從頭開始產生網站
aigne generate
 
# 用您的變更來更新網站
aigne update
```
 
有關錄製的更多資訊，您可以查閱官方 [asciinema 網站](https://asciinema.org/)。