# 檢視更新歷史記錄

本指南將引導您如何查詢 `aigne web history`、解讀日誌格式，以及篩選或檢視單筆更新。

AIGNE WebSmith 會自動為您對網站所做的每一項變更保留一份詳細的日誌。無論您是更新單一頁面的內容，還是重組整個網站結構，每個操作都會被記錄下來。這份歷史記錄提供了一個清晰、按時間順序排列的紀錄，讓您能夠追蹤進度並回顧過去的修改。

`aigne web history` 命令是存取此日誌的主要工具。它讓您能以類似 Git 等版本控制系統的格式，檢視所有已記錄的更新列表。

## 檢視歷史日誌

若要查看完整的更新列表，請使用 `aigne web history view` 命令。此命令會顯示從最新到最舊的所有條目。

```bash 檢視更新歷史記錄 icon=lucide:terminal
aigne web history view
```

### 理解輸出內容

此命令會產生一個列表，其中每一行代表一次更新。其格式設計旨在簡潔且資訊豐富。

**範例輸出：**

```bash
📜 Update History

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

日誌中的每個條目都包含幾個關鍵資訊。以下是各個部分的說明：

| 元件 | 說明 |
| :--- | :--- |
| **雜湊值 (Hash)** | 一個唯一的 7 字元代碼 (`e5c7a91`)，用於識別特定的更新。 |
| **日期 (Date)** | 一個相對時間戳，表示更新的時間（例如「5 minutes ago」）。 |
| **操作 (Operation)** | 發生的變更類型。網站範圍的變更為 `structure_update`，特定頁面的內容編輯則為 `page_update`。 |
| **頁面路徑 (Page Path)** | 如果操作是 `page_update`，修改的頁面路徑會顯示在括號中（例如 `(about-us)`）。 |
| **回饋 (Feedback)** | 您在執行 `update` 命令時提供的描述性訊息。此文字說明了變更的目的。 |

### 命令別名

為方便起見，`aigne web history` 命令接受多個 `view` 的別名。以下命令是等效的，將產生相同的輸出：

-   `aigne web history log`
-   `aigne web history list`

選擇您最容易記住的一個即可。

## 總結

`aigne web history` 命令是追蹤您網站演變的重要工具。透過檢視日誌，您可以輕鬆回憶過去變更的細節、了解變更的時間，並查看其背後的原因。

有關建立這些歷史記錄條目的操作的更多資訊，請參閱以下部分：
-   [更新網站](./guides-update-website.md)
-   [更新網站結構](./guides-update-website-update-structure.md)