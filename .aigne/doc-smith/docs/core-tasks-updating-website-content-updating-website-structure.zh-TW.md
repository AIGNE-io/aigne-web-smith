# 更新網站結構

網站的結構，通常被稱為其資訊架構，是其頁面的安排與組織。一個合乎邏輯的結構對於使用者導覽和理解至關重要。AIGNE WebSmith 提供了一個直接的流程，透過新增、移除、更新或重組頁面來修改您的網站結構。

這些結構上的修改不是透過單獨的指令來執行。而是，您向 `update` 指令提供清晰的自然語言回饋。AI 會解讀您的指令，並將必要的變更應用於網站計畫。本文件概述了可用於建構您網站的具體操作。

關於修改頁面內內容的詳細資訊，請參閱 [更新頁面內容](./core-tasks-updating-website-content-updating-page-content.md) 指南。

## 更新流程

修改您的網站結構是一個互動式的過程，您需要在其中描述期望的變更。系統會根據您的輸入，使用一組專門的工具來執行這些變更。

一般的工作流程如下：
1.  在您的終端機中執行 `aigne update` 指令。
2.  系統將提示您提供回饋。
3.  清楚地描述您希望進行的結構性變更（例如：「新增一個名為『部落格』的新頁面」、「將『職涯發展』頁面移至『關於我們』之下」）。
4.  AI 將分析您的請求，執行必要的操作，並呈現更新後的結構供您審查和確認。

## 核心結構操作

AI 可以執行四種基本操作來改變您的網站結構。了解這些操作將幫助您提供更有效的回饋。

### 新增頁面

此操作會在您的網站結構中建立一個新頁面。要新增頁面，您需要提供其基本屬性。

**回饋範例：** `"新增一個標題為『我們的服務』的新頁面，路徑為 '/services'。它應該是一個頂層頁面。"`

建立新頁面時使用以下參數：

<x-field-group>
  <x-field data-name="title" data-type="string" data-required="true">
    <x-field-desc markdown>新頁面的標題，將顯示在導覽和標題中。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="true">
    <x-field-desc markdown>關於頁面用途和內容的簡要描述。</x-field-desc>
  </x-field>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>頁面的唯一 URL 路徑。必須以 `/` 開頭（例如：`/about-us`）。</x-field-desc>
  </x-field>
  <x-field data-name="parentId" data-type="string" data-required="false">
    <x-field-desc markdown>父層頁面的路徑。如果新頁面是子頁面，請在此提供父層頁面的路徑。對於頂層頁面，此欄位應為 `null`。</x-field-desc>
  </x-field>
</x-field-group>

### 更新頁面

此操作會修改現有頁面的元資料，例如其標題或描述。您必須指定您希望變更的頁面路徑。

**回饋範例：** `"將路徑為 '/about' 的頁面標題更新為『關於我們公司』。"`

更新現有頁面時使用以下參數：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>要更新的頁面的 URL 路徑。此路徑用於識別正確的頁面。</x-field-desc>
  </x-field>
  <x-field data-name="title" data-type="string" data-required="false">
    <x-field-desc markdown>頁面的新標題。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="false">
    <x-field-desc markdown>頁面的新描述。</x-field-desc>
  </x-field>
</x-field-group>

### 移動頁面

此操作會變更頁面在網站層級結構中的位置。您可以將頁面移動到不同的父層頁面下，或變更其 URL 路徑。這對於重組內容很有用。

**回饋範例：** `"將 '/team' 頁面移動到 '/about' 之下，使其成為子頁面。其新路徑應為 '/about/team'。"`

移動頁面時使用以下參數：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>您想要移動的頁面的目前 URL 路徑。</x-field-desc>
  </x-field>
  <x-field data-name="newParentId" data-type="string" data-required="false">
    <x-field-desc markdown>新父層頁面的路徑。若要使其成為頂層頁面，請省略此欄位或將其設定為 `null`。</x-field-desc>
  </x-field>
  <x-field data-name="newPath" data-type="string" data-required="true">
    <x-field-desc markdown>頁面的新 URL 路徑。更新路徑以反映新的層級結構是標準作法（例如，將頁面移動到 `/about` 下，其路徑應類似 `/about/newpage`）。</x-field-desc>
  </x-field>
</x-field-group>

### 刪除頁面

此操作會從網站結構中永久移除一個頁面。

**重要事項：** 擁有子頁面的頁面無法直接刪除。您必須先移動或刪除其子頁面。

**回饋範例：** `"請移除路徑為 '/archive/old-news' 的頁面。"`

刪除頁面時使用以下參數：

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>您希望刪除的頁面的 URL 路徑。</x-field-desc>
  </x-field>
</x-field-group>

## 總結

透過向 `update` 指令提供清晰且具體的指示，您可以有效率地管理您的網站結構。AI 會處理技術執行層面的工作，讓您能專注於內容的邏輯組織。

在建構好您的頁面結構後，下一步是完善頁面內的資訊。更多資訊，請參閱 [更新頁面內容](./core-tasks-updating-website-content-updating-page-content.md) 指南。