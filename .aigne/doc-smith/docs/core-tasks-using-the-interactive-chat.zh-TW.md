# 使用互動式聊天

`chat` 指令提供了一個互動式的對話介面，用於建立和管理您的網站。您無需執行像 `generate` 或 `update` 這樣的單獨指令，而是可以用簡單的語言描述您的需求，AI 助理將引導您完成整個過程。對於偏好引導式體驗的使用者來說，這是一個理想的起點。

## 運作方式

互動式聊天會話由一個專屬的 AI agent 提供支援，它能理解您的請求並使用其他 WebSmith 工具來執行任務。它會記住您的對話內容，讓您可以進行連續的變更並在先前的操作基礎上繼續建構。

一般的工作流程遵循一個簡單的對話循環：

```d2
direction: down

start: {
  label: "開始聊天會話"
  shape: oval
}

user_input: {
  label: "使用者提供請求\n（例如：『建立一個網站』）"
}

ai_process: {
  label: "AI 助理分析請求"
}

execute_task: {
  label: "AI 執行相應指令\n（generate, update, publish 等）"
  shape: diamond
}

show_result: {
  label: "助理顯示結果\n並等待下一個指令"
}

end: {
  label: "結束聊天會話"
  shape: oval
}

start -> user_input
user_input -> ai_process
ai_process -> execute_task
execute_task -> show_result: "成功"
show_result -> user_input
execute_task -> user_input: "需要更多資訊"
user_input -> end: "使用者輸入 'exit'"
```

## 開始互動式會話

若要開始，請在您的終端機中執行 `chat` 指令：

```bash
aigne web chat
```

這將啟動助理，它會向您問候並等待您的指示。

## 您可以做什麼

聊天助理可以執行 AIGNE WebSmith CLI 中提供的大多數核心任務。您只需請求它：

*   **產生新網站**：描述您的網站需求、目標受眾和期望的風格。
*   **更新現有內容**：指定您想變更的頁面或區塊，並提供新的詳細資訊。
*   **翻譯頁面**：請求將特定頁面翻譯成另一種語言。
*   **發佈您的網站**：告知助理您準備好將網站發佈到 Pages Kit。
*   **管理檔案**：要求查看目前的檔案結構或特定頁面的內容。

## 對話範例

以下是一個範例，展示您如何使用互動式聊天來建立、修改和發佈一個簡單的網站。

```bash Command Line icon=lucide:terminal
aigne web chat

> 歡迎使用 AIGNE WebSmith 互動式助理！
> 今天我能如何幫助您建立網站？

您：
我需要為一個新的 SaaS 產品建立一個網站，該產品可以幫助團隊管理他們的專案。

> 當然。可以請您提供更多細節嗎？
> - 產品的核心功能是什麼？
> - 目標受眾是誰？
> - 網站應該採用什麼風格（例如：商務、現代、活潑）？

您：
主要功能是任務追蹤、團隊協作和報告。目標受眾是中小型企業主。我們採用現代商務風格吧。

> 謝謝。我已有足夠的資訊來規劃網站結構。
> 我現在將產生以下頁面：
> - 首頁
> - 功能
> - 定價
> - 關於我們
> - 聯絡我們
> ...
> [產生過程開始]
> ...
> 網站產生完成。檔案已儲存至 'output' 目錄。
> 接下來您想做什麼？

您：
在首頁上，新增一個客戶見證的區塊。

> 了解。我將在首頁上新增一個客戶見證區塊。
> [更新過程開始]
> ...
> 首頁已更新。還有其他需要嗎？

您：
不，目前就這樣。請發佈網站。

> 我現在將把網站發佈到您設定的 Pages Kit 專案。
> [發佈過程開始]
> ...
> 您的網站已成功發佈。
> 您現在可以輸入 'exit' 來退出聊天。

您：
exit

> 再見！
```

## 退出聊天

若要隨時結束您的互動式會話，只需輸入 `exit` 或 `quit` 並按下 Enter 鍵即可。

---

互動式聊天是一種強大的方式，可用於管理您的整個網站生命週期，而無需記住特定的指令和參數。若需要更直接的控制，您隨時可以使用後續章節中詳述的標準指令。

### 延伸閱讀

*   [產生網站](./core-tasks-generating-a-website.md)
*   [更新網站內容](./core-tasks-updating-website-content.md)
*   [發佈您的網站](./core-tasks-publishing-your-website.md)