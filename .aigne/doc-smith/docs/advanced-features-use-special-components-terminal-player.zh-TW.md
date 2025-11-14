# 終端機播放器

終端機播放器 (Terminal Player) 是一個特殊元件，用於在您的網站上顯示可互動的預錄終端機會話。此元件是一個有效的工具，能以清晰且可重播的格式展示命令列指令、軟體安裝過程，或引導使用者完成技術流程。

此元件使用 `asciinema` 格式建立的錄製檔案，確保了終端機輸出是以輕量級、基於文字的方式擷取。

## 流程概覽

使用終端機播放器的流程可分解為一系列清晰且易於管理的步驟。此過程從開發者錄製終端機會話開始，到終端使用者在網站上觀看互動式播放結束。

```d2
direction: down

Developer: {
  shape: c4-person
}

Terminal: {
  label: "終端機\n（含 asciinema CLI）"
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
}

Developer -> Terminal: "1. 錄製會話"
Terminal -> Cast-File: "2. 產生"
Cast-File -> Online-Converter: "3. 上傳並轉換"
Online-Converter -> JSON-File: "4. 下載"
JSON-File -> Website-Project.Page-Config: "5. 在設定中引用"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 顯示播放"
```

## 建立終端機錄製

要使用終端機播放器，您必須先建立一個錄製檔案。推薦使用的工具是 `asciinema`，這是一個用於錄製和分享終端機會話的開源命令列公用程式。

### 步驟 1：安裝 `asciinema` CLI

首先，在您的本機電腦上安裝 `asciinema` 工具。安裝方法因您的作業系統而異。

```bash 安裝 icon=lucide:download
# 在 macOS 上使用 Homebrew
brew install asciinema

# 在 Ubuntu/Debian 上使用 APT
sudo apt install asciinema

# 使用 pipx（跨平台）
pipx install asciinema
```

如需其他安裝選項，請參考官方的 [asciinema 文件](https://docs.asciinema.org/)。

### 步驟 2：錄製您的會話

安裝 `asciinema` 後，您可以透過執行 `rec` 指令開始錄製終端機會話。

```bash 錄製指令 icon=lucide:radio-tower
# 開始新的錄製，將儲存至 'my-demo.cast'
asciinema rec my-demo.cast
```

啟動指令後，在您的終端機中執行所有您想擷取的動作。若要停止錄製，請按 `Ctrl+D` 或輸入 `exit` 指令。一個名為 `my-demo.cast` 的檔案將儲存在您目前的目錄中。您可以透過執行 `asciinema play my-demo.cast` 在本機驗證播放。

**重要考量：**
*   **規劃您的步驟：** 錄製會擷取所有動作，包括暫停和錯誤。建議事先準備好腳本。
*   **終端機尺寸：** 播放器將複製錄製時所用終端機的欄寬和列高尺寸。請確保您的終端機視窗大小適當，以防止播放時內容換行或被截斷。

### 步驟 3：將 `.cast` 檔案轉換為 JSON

終端機播放器元件要求錄製資料為特定的 JSON 格式。我們提供了一個線上轉換器來簡化此轉換過程。

1.  **前往轉換器：** 在您的網頁瀏覽器中打開 [ArcBlock 終端機播放器轉換器](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)。
2.  **上傳您的檔案：** 將您的 `.cast` 檔案拖放到頁面上。
3.  **預覽並下載：** 該工具將產生您錄製內容的即時預覽。確認無誤後，下載轉換後的 `.json` 檔案。
4.  **新增至專案：** 將下載的 JSON 檔案放入您網站的媒體或資產目錄中。

## 使用錄製內容

一旦將 JSON 錄製檔案放置在您專案的媒體或資產目錄中，AI 即可使用它。您無需在 YAML 檔案中手動設定元件。

只需在您的內容來源檔案中描述需要終端機演示。當您執行 `aigne web generate` 或 `aigne web update` 時，AI 將自動找到相關的 `.json` 錄製檔，並使用終端機播放器元件將其顯示在您的網站上。

```bash AIGNE CLI 指令 icon=lucide:terminal
# 從頭開始產生網站
aigne web generate
 
# 使用您的變更更新網站
aigne web update
```

有關錄製的更多資訊，您可以參考官方的 [asciinema 網站](https://asciinema.org/)。

## 其他資源

- [ArcBlock 終端機播放器轉換器](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)
- [asciinema 文件](https://docs.asciinema.org/)