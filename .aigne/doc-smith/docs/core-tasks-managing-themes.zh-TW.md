# 管理主題

您網站的視覺主題——其顏色、字型和整體風格——在其識別中扮演著至關重要的角色。AIGNE WebSmith 提供了一個 `theme` 指令，以系統性地管理您網站的美學方面。這讓您能透過 AI 產生新的設計概念，並用一個指令來套用它們。

`theme` 指令分為兩個主要子指令：
*   **`generate`**：根據您的輸入建立一個新主題，並將其儲存在本機。
*   **`apply`**：將本機主題上傳到您的網站，更新其線上外觀。

本指南將依序介紹整個流程，從主題產生開始，然後再到套用。

## 產生新主題

`theme generate` 指令會啟動一個由 AI 驅動的流程，以建立一個完整的主題設定。AI 將引導您選擇一個名稱並定義新主題的視覺特徵。產生的設定會以 `.yaml` 檔案的形式儲存在本機的 `themes` 目錄中，以供後續使用。

### 流程

1.  **執行指令**：在您的終端機中執行 `aigne theme generate`。
2.  **命名您的主題**：首先，系統會提示您為您的主題提供一個唯一的名稱。此名稱稍後將用於識別該主題。
3.  **AI 驅動的設計**：接著，AI 會詢問問題以了解您對顏色、字體排印和風格的設計偏好。
4.  **本機儲存**：設計流程完成後，主題會自動儲存到您專案的 `themes` 資料夾中的一個檔案（例如 `my-new-theme.yaml`）。

### 使用方式

要開始產生新主題，請執行以下指令：

```sh
aigne theme generate
```
*別名：`aigne theme gen`*

依照螢幕上的提示完成主題建立流程。

## 套用主題

產生一個或多個主題後，`theme apply` 指令可讓您選擇一個已儲存的主題並將其套用到您的網站。此指令會讀取您的本機主題檔案，將它們以列表形式呈現，並在您確認後，將所選主題上傳到您的網站，使變更生效。

### 流程

1.  **執行指令**：在您的終端機中執行 `aigne theme apply`。
2.  **選擇主題**：該工具會掃描 `themes` 目錄並顯示您已產生的所有可用主題列表。該列表包含主題名稱、主色和字型等詳細資訊，以幫助您選擇。
3.  **確認目標**：系統將顯示目標網站 URL、目前使用的主題（如果有的話）以及您選擇的新主題。
4.  **最終確認**：在進行任何變更之前，系統會要求您做最終確認。這是一項安全措施，以防止意外覆寫。
5.  **套用至網站**：確認後，主題將被上傳並套用到您的網站。一則成功訊息將表示此流程已完成。

### 使用方式

要套用現有主題，請使用以下指令。

```sh
aigne theme apply
```

您也可以直接將網站 URL 指定為參數。如果省略，將使用您 `aigne.config.yaml` 檔案中的 `appUrl`。

```sh
aigne theme apply --appUrl https://your-website.com
```

### 參數

`apply` 指令接受以下參數：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您網站的完整 URL。如果您未提供此項，指令將使用您 `aigne.config.yaml` 設定檔中定義的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的設定檔位置。預設為標準的 `aigne.config.yaml` 路徑。</x-field-desc>
  </x-field>
</x-field-group>

---

透過遵循這些步驟，您可以有效地管理您網站的視覺識別。更新主題後的下一步，您可能會想檢視如何[發佈您的網站](./core-tasks-publishing-your-website.md)。