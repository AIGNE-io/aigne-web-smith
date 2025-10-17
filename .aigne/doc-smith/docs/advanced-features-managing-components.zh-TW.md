# 使用自訂元件庫

由 AIGNE WebSmith 產生的網站是由一系列預先設計的視覺元素（稱為元件）所構成的。雖然 WebSmith 包含一組標準元件，但您可以使用 Pages Kit 專案來定義和管理**自訂元件庫**。這讓您可以根據特定需求量身打造設計和功能。

本節將說明如何使用 `component pull` 命令，將您的本機元件庫與 Pages Kit 專案中定義的元件庫同步。

## 元件庫概覽

自訂元件庫是為您的專案量身打造的一系列標準化、可重複使用的頁面元素。當您產生網站時，WebSmith 將使用您的自訂元件來建構頁面，以確保品牌一致性和獨特的版面配置。

保持本機元件庫同步非常重要，主要有兩個原因：
1.  **存取新設計**：當新的視覺元件被設計並新增到您的 Pages Kit 專案時，將它們拉取到您的本機元件庫中，AI 就能夠使用它們。
2.  **錯誤修復與改進**：更新可能包含對現有元件的改進或修復，從而提升您網站的品質和外觀。

## 同步您的自訂元件庫

`aigne web component pull` 命令會從您的 Pages Kit 專案提供的特定 URL 中，擷取最新版本的元件庫。

### 命令語法

若要拉取最新的元件，請使用以下命令結構：

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

更新您的元件庫是一個直接但重要的過程。請仔細遵循以下步驟。

#### 步驟 1：執行 Pull 命令

使用您的 Pages Kit 專案提供的特定 URL 執行此命令。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

該工具將連接到該 URL 並下載最新的元件庫定義。

#### 步驟 2：檢閱變更

成功下載後，WebSmith 將顯示變更摘要。它會顯示您現有元件庫與新元件庫之間的比較，詳細說明「原子」（基本）和「複合」（複雜）元件的數量。

輸出範例如下：

```
✅ 成功拉取元件（尚未儲存）！
📊 新元件統計資料：
  🔹 原子元件：10 (9 → 10)
    • LogoV1 - 一個用於顯示標題和標誌列表的元件...
    • RichText - 一個主要顯示標題的 RichText 元件...
    • NewFeatureCard - 一個全新的功能卡片...
  🧩 複合元件：22 (22 → 22)
    • Logo Wall - 結構 - 可選的區段標題...
    • User Review - 結構 (上 → 下) - 評論內容/引文...
```

此摘要可讓您在套用變更前先行核對。

#### 步驟 3：確認更新

接著，WebSmith 會在對您的本機檔案進行任何永久性變更前，提示您進行確認。

```
您想要更新（儲存）內建的元件檔案嗎？ (y/N)
```

-   按下 `y` 和 `Enter` 鍵以繼續更新。
-   按下 `n` 或 `Enter` 鍵以取消操作。將不會進行任何變更。
 
#### 步驟 4：重新產生您的網站

如果您確認更新，WebSmith 將執行兩個關鍵操作：

1.  **儲存新元件庫**：它會用新版本覆寫您本機的 `builtin-component-library.yaml` 檔案。
2.  **清除已產生的內容**：為確保您的網站能使用新元件正確地重新建置，它將**刪除**您工作區和輸出目錄中**所有先前產生的頁面檔案**。

過程完成後，您會看到一則確認訊息和下一步的提醒。

```
💾 新元件已儲存。
🧹 已清除先前產生的內容。
🚀 下一步：請執行以下命令以重新產生頁面：

  `aigne web generate`
```

您現在必須執行 `generate` 命令，以使用更新後的元件庫來建立您的網站頁面。

## 總結

`component pull` 命令是讓您本機環境的視覺建構區塊與您的自訂 Pages Kit 儲存庫保持同步的標準程序。此過程包括拉取最新的元件庫、檢閱變更、確認更新，最後重新產生您的網站以套用新元件。

更多關於建立頁面的資訊，請前往 [產生網站](./core-tasks-generating-a-website.md) 一節。