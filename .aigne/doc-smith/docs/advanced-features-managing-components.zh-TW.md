# 管理元件

由 AIGNE WebSmith 產生的網站是由一系列預先設計的視覺元素（稱為元件）所構成。這些元件是您頁面的建構基塊，例如主視覺區塊、功能列表、價格表和常見問題手風琴式選單。`component` 指令可讓您管理和更新此函式庫，以確保您的網站能取用最新的設計和功能。

本節將說明如何使用 `component pull` 指令，將您的本機元件函式庫與 Pages Kit 專案中定義的函式庫進行同步。

## 元件函式庫概覽

元件函式庫是一系列標準化、可重複使用的頁面元素集合。當您產生網站時，WebSmith 會從此函式庫中選擇並設定最適合的元件來建構您的頁面。

保持此函式庫的更新很重要，主要有兩個原因：
1.  **取得新設計**：當新的視覺元件被設計並新增至您的 Pages Kit 專案時，將它們拉取到您的本機函式庫中，即可供 AI 使用。
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
    <x-field-desc markdown>用於從您的 Pages Kit 專案拉取元件的唯一 URL。此 URL 包含必要的專案 ID 和安全憑證。您通常可以在 Pages Kit 專案的設定頁面中找到此 URL。</x-field-desc>
  </x-field>
</x-field-group>

### 更新流程

更新您的元件函式庫是一個直接但重要的過程。請仔細遵循以下步驟。

#### 步驟 1：執行拉取指令

使用您的 Pages Kit 專案提供的特定 URL 執行該指令。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

該工具將連接至該 URL 並下載最新的元件函式庫定義。

#### 步驟 2：檢視變更

成功下載後，WebSmith 將會顯示變更摘要。摘要將顯示您現有函式庫與新函式庫之間的比較，詳細說明「原子」（基本）和「複合」（複雜）元件的數量。

輸出範例如下：

```
✅ Pull Components successfully (not saved yet)!
📊 New Components Statistics:
  🔹 Atomic components: 10 (9 → 10)
    • LogoV1 - A component to display a heading and a list of logos...
    • RichText - A RichText component primarily displays the title...
    • NewFeatureCard - A brand new card for features...
  🧩 Composite components: 22 (22 → 22)
    • Logo Wall - Structure - Optional section title...
    • User Review - Structure (top → bottom) - Review Content/Quote...
```

此摘要可讓您在套用變更前進行驗證。

#### 步驟 3：確認更新

接著，WebSmith 會在對您的本機檔案進行任何永久性變更之前，提示您進行確認。

```
Do you want to update (save) the built-in components file? (y/N)
```

-   按下 `y` 和 `Enter` 鍵以繼續更新。
-   按下 `n` 或 `Enter` 鍵以取消操作。系統將不會進行任何變更。

#### 步驟 4：重新產生您的網站

如果您確認更新，WebSmith 將執行兩個關鍵動作：

1.  **儲存新函式庫**：它會用新版本覆寫您本機的 `builtin-component-library.yaml` 檔案。
2.  **清除已產生的內容**：為確保您的網站能使用新元件正確地重新建構，它將**刪除**您工作區和輸出目錄中**所有先前產生的頁面檔案**。

此過程完成後，您將看到一則確認訊息和下一步的提醒。

```
💾 New components saved.
🧹 Cleaned previous generated content.
🚀 Next: please run below command to re-generate pages:

  `aigne web generate`
```

您現在必須執行 `generate` 指令，以使用更新後的元件函式庫來建立您的網站頁面。

## 總結

`component pull` 指令是讓您網站的視覺建構基塊與中央 Pages Kit 儲存庫保持同步的標準程序。此過程包含拉取最新的函式庫、檢視變更、確認更新，最後重新產生您的網站以套用新元件。

有關建立頁面的更多資訊，請前往 [產生網站](./core-tasks-generating-a-website.md) 一節。