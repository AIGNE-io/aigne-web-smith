使用 AIGNE WebSmith 擴展您的網站非常簡單。本指南將說明如何使用 `aigne web add-page` 命令將新頁面無縫整合到您的網站結構中，並自動更新內容和內部連結。

# 新增頁面

`aigne web add-page` 命令提供了一種互動式的方式來擴展您的網站。它允許您用自然語言描述新頁面，WebSmith 會處理建立頁面、產生內容，並智慧地更新現有頁面，加入指向新內容的相關連結。

## 命令用法

若要開始新增頁面，請導覽至您專案的根目錄並執行以下命令：

```sh aigne web add-page icon=lucide:terminal
aigne web add-page
```

或者，您也可以使用較短的別名 `add`：

```sh aigne web add icon=lucide:terminal
aigne web add
```

## 流程

當您執行 `add-page` 命令時，WebSmith 會啟動一個全面的自動化工作流程。此流程分為以下幾個步驟：

### 1. 新增頁面

該命令首先會印出目前的網站地圖，讓您清楚了解現有的頁面。接著，系統會提示您描述您想新增的頁面，指定其標題和位置（例如，「在主要服務頁面下新增一個定價頁面」）。您可以在單次操作中新增多個頁面。每次新增後，工具會顯示更新後的結構，並提示您進行下一次新增。若要完成新增頁面，只需在空白提示符下按 Enter 鍵即可。接著，WebSmith 會根據您專案的來源資料為每個新頁面產生內容。以下是新增頁面的使用案例：

```text 新增「團隊」和「職涯」頁面
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]

You can add a new page.
  • e.g. 'add an FAQ page under the About Us page'

Press Enter to finish: add a 'Team' page under '/about'
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]
    - Team [/about/team]

You can continue adding pages, or press Enter to finish: add a 'Careers' page under '/about'
```

### 2. 審查頁面以插入連結

新頁面建立後，WebSmith 會分析您現有的內容，以找出插入新內容連結的相關位置。這能確保無縫導覽，並幫助使用者發現新頁面。系統會向您呈現一份可新增連結的頁面列表，讓您在套用變更前進行審查和確認。以下是審查頁面以插入連結的使用案例：

```text 審查連結建議
? Select pages that need new links added (all selected by default, press Enter to confirm, or unselect all to skip):
  ◉ About Us (/about)
  ◯ My SaaS Platform (/home)

Do you want to proceed with these changes? (Y/n)
```

### 3. 輸出摘要

結構最終確定並插入連結後，會顯示一份摘要報告。此報告會列出新建立的頁面以及任何已更新並加入新連結的現有頁面。如果您的網站使用多種語言，新頁面和更新後的連結會自動納入翻譯工作流程。以下是輸出摘要的使用案例：

```text 最終摘要
---
📊 Summary

✨ Newly Generated Pages:
   Total: 2 page(s)

   1. /about/team
      Title: Our Team
      Description: Meet the dedicated team behind our project, driving innovation...

🔗 Pages Updated with New Links:
   Total: 1 page(s)

   1. /about
      Added links to: /about/team 

```

## 後續步驟

<x-cards data-columns="2">
  <x-card data-title="更新頁面" data-icon="lucide:file-text" data-href="/guides/update-website/update-page">
    了解如何使用自然語言指令來調整個別頁面的文字和細節。
  </x-card>
  <x-card data-title="移除頁面" data-icon="lucide:file-minus" data-href="/guides/update-website/remove-page">
    了解如何從您的網站結構中移除現有頁面。
  </x-card>
</x-cards>