# 更新網站內容

在產生網站的初始版本後，您可能需要對產生的內容進行調整或完善。`update` 指令是此迭代過程的主要工具。它允許您以純英文提供回饋，以修改您的網站結構和單一頁面的內容。

此指令透過利用 AI 來理解您的請求並將其直接應用於網站檔案，從而簡化了編輯過程。無論您需要新增頁面、重組區塊，還是僅僅修改標題，`update` 指令都提供了一種互動式的方式來進行這些變更，而無需手動編輯設定檔。

本節概述了更新流程。有關詳細的逐步說明，請參閱各類更新的具體指南：

<x-cards data-columns="2">
  <x-card data-title="更新網站結構" data-icon="lucide:layout-list" data-href="/core-tasks/updating-website-content/updating-website-structure">
    了解如何新增、移除、重新命名或重組網站頁面。
  </x-card>
  <x-card data-title="更新頁面內容" data-icon="lucide:file-text" data-href="/core-tasks/updating-website-content/updating-page-content">
    了解如何修改特定頁面中的文字、區塊和其他元素。
  </x-card>
</x-cards>

## 更新工作流程

更新流程設計為互動式且直觀。以下是典型工作流程的摘要：

1.  **啟動指令**：在您的專案目錄中，從終端機執行 `aigne web update` 指令。
2.  **選擇頁面**：該工具將顯示您現有網站頁面的列表。系統將提示您選擇要修改的特定頁面。
3.  **提供回饋**：選擇頁面後，系統會要求您提供回饋。您可以在此處以自然語言描述您想做的變更。例如，您可以說：「將第一節的標題更改為『我們的核心價值』」或「在頁面末尾新增一個常見問題解答區塊」。
4.  **AI 處理**：AI Agent 將分析您的回饋，並決定對頁面結構或內容進行必要的修改。
5.  **審查並儲存**：變更將被應用，更新後的頁面內容將被儲存。

## 基本指令用法

要開始更新過程，請導覽至您專案的根目錄並執行以下指令：

```bash CLI 指令 icon=lucide:terminal
aigne web update
```

此指令會啟動一個互動式對話，引導您選擇頁面並提供回饋。

### 參數

雖然此指令主要是互動式的，但您可以使用參數來簡化流程。

<x-field-group>
  <x-field data-name="feedback" data-type="string" data-required="false">
    <x-field-desc markdown>直接以命令列參數形式提供回饋，以跳過互動式回饋提示。例如：`aigne web update --feedback "Change the main title"`。</x-field-desc>
  </x-field>
  <x-field data-name="pages" data-type="array" data-required="false">
    <x-field-desc markdown>指定要更新的一個或多個頁面路徑。這對於將相同的回饋應用於多個頁面，或以非互動方式指定特定頁面非常有用。</x-field-desc>
  </x-field>
</x-field-group>

## 總結

`update` 指令是一個靈活的工具，用於在網站初次建立後對其進行完善和改進。透過使用自然語言回饋，您可以有效地修改整個網站結構和每個頁面的詳細內容。

有關更詳細的說明和範例，請繼續閱讀相關小節：

*   **下一步**：了解如何 [更新網站結構](./core-tasks-updating-website-content-updating-website-structure.md) 或 [更新頁面內容](./core-tasks-updating-website-content-updating-page-content.md)。
*   **相關閱讀**：更新完成後，您可能會想透過 [查看更新歷史記錄](./core-tasks-viewing-update-history.md) 來檢視您的變更。