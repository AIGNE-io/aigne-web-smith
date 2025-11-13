# 使用自訂元件庫

由 AIGNE WebSmith 產生的網站是由一系列預先設計的視覺元素（稱為元件）所構成。雖然 WebSmith 包含一套標準元件，但您可以使用 Pages Kit 專案來定義和管理一個**自訂元件庫**。這讓您可以根據自身需求量身打造設計和功能。

本節將說明如何使用 `component pull` 指令，將您本地的元件庫與 Pages Kit 專案中定義的元件庫進行同步。

## 元件庫概覽

自訂元件庫是為您的專案量身打造的一系列標準化、可重複使用的頁面元素。當您產生網站時，WebSmith 將使用您的自訂元件來建構頁面，以確保品牌一致性和獨特的版面配置。

保持本地元件庫同步非常重要，主要有兩個原因：
1.  **取得新設計**：當新的視覺元件被設計並加入到您的 Pages Kit 專案時，將它們拉取到您的本地元件庫中，AI 就能夠使用這些新元件。
2.  **錯誤修復與改進**：更新可能包含對現有元件的改進或修復，從而提升您網站的品質和外觀。

## 同步您的自訂元件庫

`aigne web component pull` 指令會從您的 Pages Kit 專案提供的特定 URL 中取得最新版本的元件庫。

### 指令語法

若要拉取最新的元件，請使用以下指令結構：

```bash Component Pull icon=lucide:terminal
aigne web component pull --url <your_component_pull_url>
```

您也可以使用別名 `comp`：

```bash Component Pull (Alias) icon=lucide:terminal
aigne web comp pull --url <your_component_pull_url>
```

### 參數

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>用於從您的 Pages Kit 專案拉取元件的唯一 URL。此 URL 包含必要的專案 ID 和安全憑證。您通常可以在 Pages Kit 專案的設定頁面中找到此 URL。</x-field-desc>
  </x-field>
</x-field-group>

### 更新流程

更新您的元件庫是一個直接但重要的過程。請仔細遵循以下步驟。

#### 步驟 1：執行拉取指令

使用您的 Pages Kit 專案提供的特定 URL 執行指令。

```bash Component Pull icon=lucide:terminal
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

該工具將連接到此 URL 並下載最新的元件庫定義。

#### 步驟 2：檢視變更

下載成功後，WebSmith 將顯示變更摘要。它會顯示您現有元件庫與新元件庫之間的比較，詳細說明「原子」（基本）和「複合」（複雜）元件的數量。

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

此摘要可讓您在套用變更前進行確認。

#### 步驟 3：確認更新

在對您的本地檔案進行任何永久性變更之前，WebSmith 會提示您進行確認。

```
Do you want to update (save) the built-in components file? (y/N)
```

-   按下 `y` 和 `Enter` 鍵繼續更新。
-   按下 `n` 或 `Enter` 鍵取消操作。系統將不會進行任何變更。
 
#### 步驟 4：重新產生您的網站

如果您確認更新，WebSmith 將執行兩個關鍵操作：

1.  **儲存新元件庫**：它會用新版本覆寫您本地的 `builtin-component-library.yaml` 檔案。
2.  **清除已產生的內容**：為確保您的網站能使用新元件正確地重新建構，它將**刪除**工作區和輸出目錄中**所有先前產生的頁面檔案**。

完成此過程後，您將看到一則確認訊息和下一步的提醒。

```
💾 New components saved.
🧹 Cleaned previous generated content.
🚀 Next: please run below command to re-generate pages:

  `aigne web generate`
```

您現在必須執行 `generate` 指令，以使用更新後的元件庫來建立您的網站頁面。

## 總結

`component pull` 指令是保持您本地環境的視覺建構模塊與您的自訂 Pages Kit 儲存庫同步的標準程序。此過程包括拉取最新的元件庫、檢視變更、確認更新，最後重新產生您的網站以套用新元件。

有關建立頁面的更多資訊，請前往[產生網站](./guides-generate-website.md)部分。