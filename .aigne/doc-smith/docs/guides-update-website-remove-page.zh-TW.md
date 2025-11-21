# 移除頁面

需要整理您的網站結構嗎？本指南將說明如何使用 `aigne web remove-page` 指令來安全地刪除頁面、自動找出因此產生的任何失效連結，並重新生成受影響的內容以維持網站的完整性。

## 總覽

`remove-page` 指令提供了一個互動式的方式，讓您能從網站中移除一個或多個頁面。此指令的一大特色是它能夠偵測並修復因刪除頁面而導致的內部失效連結。在您移除頁面後，WebSmith 會自動掃描剩餘的內容，找出任何指向已刪除頁面的連結。接著，它會提示您重新生成受影響的頁面，確保您網站的導覽保持一致且無錯誤。

此過程有助於防止使用者遇到無效連結，從而維持網站的簡潔與專業。

## 如何移除頁面

若要開始此過程，請在您的終端機中執行以下指令：

```sh aigne web remove-page icon=lucide:terminal
aigne web remove-page
```

您也可以使用別名 `remove` 或 `rm`：

```sh aigne web rm icon=lucide:terminal
aigne web rm
```

### 步驟 1：選擇要移除的頁面

該指令將顯示您目前網站結構中的所有頁面列表。您可以使用方向鍵在此列表中導覽，並透過按下空白鍵來選擇您希望移除的頁面。

![一個終端機介面，要求使用者選擇要移除的頁面，其中「About the Project」被反白顯示。](../../../assets/images/web-smith-remove-page-select.png)

當您選定所有要刪除的頁面後，請按 `Enter` 鍵確認。如果您決定不移除任何頁面，可以直接按 `Enter` 鍵退出此過程，無需進行任何選擇。

### 步驟 2：自動連結修正（可選）

移除所選頁面後，WebSmith 會掃描您剩餘的頁面，檢查是否有任何內部連結現在指向不存在的內容。

如果發現失效連結，畫面上將會顯示受影響的頁面列表。預設情況下，所有這些頁面都會被選取以進行修復。您可以檢視此列表，然後按下 `Enter` 鍵，讓 WebSmith 重新生成這些頁面，並自動移除無效連結。如果您偏好手動處理失效連結，可以取消選取所有頁面以跳過此步驟。

### 步驟 3：檢視摘要

過程完成後，終端機中會顯示一則摘要。此摘要提供：

*   所有成功移除的頁面列表。
*   所有為修復失效連結而重新生成的頁面列表。

![一個終端機介面，顯示移除頁面操作的摘要，包含已移除頁面和已修復頁面的列表。](../../../assets/images/web-smith-remove-page-success.png)

這能確保您清楚地記錄對網站結構和內容所做的所有變更。

## 總結

`aigne web remove-page` 指令是維護您網站結構的可靠工具。它不僅簡化了刪除頁面的過程，還包含一個智慧的連結檢查功能，以保護您網站導覽的完整性。

如需相關任務，請參閱以下指南：
<x-cards data-columns="2">
  <x-card data-title="新增頁面" data-href="/guides/update-website/add-page" data-icon="lucide:file-plus">了解如何將新頁面新增至您的網站結構。</x-card>
  <x-card data-title="更新頁面" data-href="/guides/update-website/update-page" data-icon="lucide:file-pen-line">修改個別網頁的內容和詳細資訊。</x-card>
</x-cards>