# 檢視更新歷史記錄

AIGNE WebSmith 會自動為您對網站所做的每一項變更保留詳細的日誌。無論您是更新單一頁面的內容，還是重組整個網站結構，每個操作都會被記錄下來。此歷史記錄提供了一個清晰、按時間順序排列的記錄，讓您可以追蹤進度並回顧過去的修改。

`history` 命令是存取此日誌的主要工具。它讓您可以以類似 Git 等版本控制系統的格式，檢視所有已記錄的更新列表。

## 檢視歷史日誌

若要查看完整的更新列表，請使用 `history view` 命令。此命令會顯示從最新到最舊的所有條目。

```bash Terminal icon=lucide:terminal
aigne history view
```

### 理解輸出內容

該命令會產生一個列表，其中每一行代表一次更新。其格式設計得簡潔且資訊豐富。

**輸出範例：**

```bash
📜 Update History

e5c7a91 5 minutes ago   page (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page (services): Added new section for consulting services
1d9c0b2 1 day ago       structure: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page (contact): Updated the main office phone number
```

日誌中的每個條目都包含幾個關鍵資訊。以下是各個組件的詳細說明：

| 組件 | 說明 |
| :--- | :--- |
| **雜湊值 (Hash)** | 一個唯一的 7 字元代碼（`e5c7a91`），用於識別特定的更新。 |
| **日期** | 一個相對時間戳，指示更新的執行時間（例如，「5 minutes ago」）。 |
| **操作 (Operation)** | 所發生變更的類型。這將是 `structure`（針對全站變更）或 `page`（針對特定頁面的內容編輯）。 |
| **頁面路徑 (Page Path)** | 如果操作是 `page`，則會在括號中顯示被修改頁面的路徑（例如，`(about-us)`）。 |
| **回饋 (Feedback)** | 您在執行 `update` 命令時提供的描述性訊息。此文字解釋了變更的目的。 |

### 命令別名

為了方便起見，`history` 命令接受 `view` 的幾個別名。以下命令是等效的，並會產生相同的輸出：

-   `aigne history log`
-   `aigne history list`

選擇您最容易記住的一個即可。

## 總結

`history` 命令是追蹤您網站演變的重要工具。透過檢視日誌，您可以輕鬆回憶起過去變更的細節，了解它們是在何時進行的，並查看其背後的原因。

有關建立這些歷史記錄條目的操作的更多資訊，請參考以下部分：
-   [更新網站內容](./core-tasks-updating-website-content.md)
-   [更新網站結構](./core-tasks-updating-website-content-updating-website-structure.md)