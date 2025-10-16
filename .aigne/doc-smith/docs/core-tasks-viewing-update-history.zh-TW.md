# 檢視更新歷史記錄

AIGNE WebSmith 會自動為您對網站所做的每一項變更保留詳細的日誌。無論是更新單一頁面的內容，還是重組整個網站結構，每個操作都會被記錄下來。這份歷史記錄提供了一個清晰、按時間順序的記錄，讓您可以追蹤進度並回顧過去的修改。

`web history` 指令是存取此日誌的主要工具。它能讓您以類似 Git 等版本控制系統的格式，檢視所有已記錄的更新列表。

## 檢視歷史記錄日誌

若要查看完整的更新列表，請使用 `web history view` 指令。此指令會顯示從最新到最舊的所有條目。

```bash 終端機 icon=lucide:terminal
aigne web history view
```

### 理解輸出內容

該指令會產生一個列表，其中每一行代表一次更新。其格式設計得簡潔且資訊豐富。

**輸出範例：**

```bash
📜 Update History

e5c7a91 5 minutes ago   page (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page (services): Added new section for consulting services
1d9c0b2 1 day ago       structure: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page (contact): Updated the main office phone number
```

日誌中的每個條目都包含幾個關鍵資訊。以下是各個組成部分的說明：

| 組成部分 | 說明 |
| :--- | :--- |
| **雜湊值** | 一個獨特的 7 字元代碼（`e5c7a91`），用於識別特定的更新。 |
| **日期** | 一個相對時間戳，表示更新的時間（例如，「5 minutes ago」）。 |
| **操作** | 變更的類型。可能是 `structure`（網站範圍的變更）或 `page`（特定頁面的內容編輯）。 |
| **頁面路徑** | 如果操作是 `page`，則會以括號顯示修改頁面的路徑（例如，`(about-us)`）。 |
| **回饋訊息** | 您在執行 `update` 指令時提供的描述性訊息。此文字說明了變更的目的。 |

### 指令別名

為了方便起見，`web history` 指令接受數個 `view` 的別名。以下指令是等效的，並會產生相同的輸出：

-   `aigne web history log`
-   `aigne web history list`

選擇一個您最容易記住的即可。

## 總結

`web history` 指令是追蹤您網站演變過程的重要工具。透過查看日誌，您可以輕鬆回憶起過去變更的細節，了解變更的時間以及其背後的原因。

有關建立這些歷史記錄條目的操作的更多資訊，請參考以下部分：
-   [更新網站內容](./core-tasks-updating-website-content.md)
-   [更新網站結構](./core-tasks-updating-website-content-updating-website-structure.md)