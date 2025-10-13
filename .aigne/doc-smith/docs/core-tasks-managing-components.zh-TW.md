# 管理元件

由 AIGNE WebSmith 產生的網站是由一系列預先設計的視覺元素（稱為元件）所建構而成。這些元件是您頁面的基礎建構區塊，例如首屏區塊、功能列表、價格表和常見問答折疊選單。`component` 指令讓您可以管理和更新此函式庫，以確保您的網站能取用最新的設計和功能。

本節將說明如何使用 `component pull` 指令，將您本地的元件函式庫與您在 Pages Kit 專案中定義的函式庫進行同步。

## 元件函式庫概覽

元件函式庫是一組標準化、可重複使用的頁面元素集合。當您產生網站時，WebSmith 會從此函式庫中選擇並配置最合適的元件來建構您的頁面。

保持此函式庫的更新很重要，主要有兩個原因：
1.  **取用新設計**：當新的視覺元件被設計並加入到您的 Pages Kit 專案時，將它們拉取到您的本地函式庫中，即可供 AI 使用。
2.  **錯誤修復與改善**：更新可能包含對現有元件的改善或修復，從而提升您網站的品質和外觀。

## 拉取與更新元件

`aigne web component pull` 指令會從您的 Pages Kit 專案提供的特定 URL 中，擷取最新版本的元件函式庫。

### 指令語法

若要拉取最新的元件，請使用以下指令結構：

```bash
aigne web component pull --url <your_component_pull_url>
```

您也可以使用別名 `comp`：

```bash
aigne web comp pull --url <your_component_pull_url>
```

### 參數

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>從您的 Pages Kit 專案拉取元件的唯一 URL。此 URL 包含必要的專案 ID 和安全憑證。您通常可以在 Pages Kit 專案的設定頁面中找到此 URL。</x-field-desc>
  </x-field>
</x-field-group>

### 更新流程

更新您的元件函式庫是一個直接但重要的過程。請謹慎遵循以下步驟。

#### 步驟 1：執行拉取指令

使用您的 Pages Kit 專案提供的特定 URL 來執行此指令。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

此工具將會連線至該 URL 並下載最新的元件函式庫定義。

#### 步驟 2：檢視變更

成功下載後，WebSmith 會顯示變更的摘要。它會顯示您現有函式庫與新函式庫之間的比較，並詳述「原子」（基礎）和「複合」（複雜）元件的數量。

輸出範例如下：

```
✅ 成功拉取元件（尚未儲存）！
📊 新元件統計資料：
  🔹 原子元件：10 (9 → 10)
    • LogoV1 - 一個用於顯示標題和 logo 列表的元件...
    • RichText - 一個主要顯示標題的 RichText 元件...
    • NewFeatureCard - 一個全新的功能卡片...
  🧩 複合元件：22 (22 → 22)
    • Logo Wall - 結構 - 可選的區塊標題...
    • User Review - 結構（由上到下）- 評論內容/引言...
```

此摘要可讓您在套用變更前先行核對。

#### 步驟 3：確認更新

接著，WebSmith 會在對您的本地檔案進行任何永久性變更前，提示您進行確認。

```
您要更新（儲存）內建元件檔案嗎？ (y/N)
```

-   按下 `y` 和 `Enter` 鍵以繼續更新。
-   按下 `n` 或 `Enter` 鍵以取消操作。此時將不會進行任何變更。

#### 步驟 4：重新產生您的網站

如果您確認更新，WebSmith 將執行兩個關鍵操作：

1.  **儲存新函式庫**：它會用新版本覆寫您本地的 `builtin-component-library.yaml` 檔案。
2.  **清除已產生的內容**：為確保您的網站能以新元件正確地重新建構，它將會從您的工作區和輸出目錄中**刪除所有先前產生的頁面檔案**。

過程完成後，您將會看到一則確認訊息和下一步的提醒。

```
💾 新元件已儲存。
🧹 已清除先前產生的內容。
🚀 下一步：請執行以下指令以重新產生頁面：

  `aigne web generate`
```

您現在必須執行 `generate` 指令，以使用更新後的元件函式庫來建立您的網站頁面。

## 總結

`component pull` 指令是讓您網站的視覺建構區塊與中央 Pages Kit 儲存庫保持同步的標準程序。此流程包含拉取最新的函式庫、檢視變更、確認更新，最後重新產生您的網站以套用新元件。

有關建立頁面的更多資訊，請前往[產生網站](./core-tasks-generating-a-website.md)一節。