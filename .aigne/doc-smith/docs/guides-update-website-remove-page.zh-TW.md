# 移除頁面

需要清理您的網站結構嗎？本指南將說明如何使用 `aigne web remove-page` 指令來安全地刪除頁面、自動尋找因此產生的任何損壞連結，並重新生成受影響的內容以維護網站的完整性。

## 概覽

`remove-page` 指令提供了一種互動式的方式，可從您的網站中移除一個或多個頁面。此指令的一個關鍵功能是能夠偵測並修復因頁面刪除而導致的內部連結損壞。在您移除頁面後，WebSmith 會自動掃描剩餘內容，尋找任何指向已刪除頁面的連結。接著，它會提示您重新生成受影響的頁面，確保您網站的導覽保持一致且無錯誤。

此過程有助於防止使用者遇到失效連結，從而維護一個乾淨且專業的網站。

## 流程

若要開始此流程，請在您的終端機中執行以下指令：

```sh aigne web remove-page icon=lucide:terminal
aigne web remove-page
```

您也可以使用別名 `remove` 或 `rm`：

```sh aigne web rm icon=lucide:terminal
aigne web rm
```

### 步驟 1：選擇要移除的頁面

該指令將顯示您目前網站結構中所有頁面的列表。您可以使用方向鍵在此列表中導覽，並按下空白鍵選擇您希望移除的頁面。

```text 選擇要移除的頁面
? Select pages to remove (Press Enter with no selection to finish):
❯ ◯ Smart Video Streaming Credit Service [/home]
  ◉ About the Project [/about]
  ◯ Frequently Asked Questions [/about/faq]
```

選擇完所有想刪除的頁面後，按下 `Enter` 鍵確認。如果您決定不移除任何頁面，可以在未做任何選擇的情況下按下 `Enter` 鍵退出流程。
接著，該工具會在繼續刪除前要求確認。

### 步驟 2：自動連結修正（可選）

移除所選頁面後，WebSmith 會掃描您剩餘的頁面，尋找任何現在指向不存在內容的內部連結。

如果發現損壞的連結，您將看到一個受影響頁面的列表。預設情況下，所有這些頁面都會被選中以進行修復。您可以檢視該列表並按下 `Enter` 鍵，讓 WebSmith 重新生成這些頁面，從而自動移除無效連結。如果您偏好手動處理損壞的連結，可以取消選擇所有頁面以跳過此步驟。

```text 選擇要修復的頁面
? Select Pages with Invalid Links to Fix (all selected by default, press Enter to confirm, or unselect all to skip):
❯ ◉ Home (home.md)
    Invalid Links(1): /about
```

### 步驟 3：檢視摘要

流程完成後，終端機中將顯示一份摘要。此摘要提供：

*   所有成功移除的頁面列表。
*   所有為修復損壞連結而重新生成的頁面列表。
*   所有為修復損壞連結而重新生成的頁面列表。

```text 移除頁面操作摘要
---
📊 Summary

🗑️  Removed Pages:
   Total: 1 page(s)

   1. /about

✅ Pages fixed (Removed invalid links):
   Total: 1 page(s)

   1. /home
      Title: Home
      Invalid links fixed: /about
```
這確保您對網站結構和內容所做的所有變更都有清晰的記錄。

## 總結

`aigne web remove-page` 指令是維護您網站結構的可靠工具。它不僅簡化了刪除頁面的過程，還包含一個智慧連結檢查功能，以保護您網站導覽的完整性。

有關相關任務，請參閱以下指南：
<x-cards data-columns="2">
  <x-card data-title="新增頁面" data-href="/guides/update-website/add-page" data-icon="lucide:file-plus">瞭解如何將新頁面新增至您的網站結構。</x-card>
  <x-card data-title="更新頁面" data-href="/guides/update-website/update-page" data-icon="lucide:file-pen-line">修飾個別網頁中的內容和詳細資訊。</x-card>
</x-cards>