# 管理主題

您網站的視覺主題——包含其顏色、字體和整體風格——在其品牌識別中扮演著至關重要的角色。AIGNE WebSmith 提供了一個 `theme` 指令，讓您可以系統化地管理網站的美學方面。這讓您能透過 AI 生成新的設計概念，並用一個指令來套用它們。

`theme` 指令分為兩個主要的子指令：
*   **`generate`**：根據您的輸入創建一個新主題，並將其儲存在本機。
*   **`apply`**：將本機主題上傳到您的網站，更新其線上外觀。

本指南將依序介紹整個流程，從主題生成開始，然後再到套用主題。

## 生成新主題

`theme generate` 指令會啟動一個由 AI 驅動的流程，以創建完整的主題設定。AI 將引導您選擇一個名稱並定義新主題的視覺特徵。最終的設定將以 `.yaml` 檔案的形式儲存在本機的 `themes` 目錄中，以供後續使用。

### 流程

1.  **啟動生成**：在您的終端機中執行 `aigne theme generate`。
2.  **AI 驅動設計**：與 AI 進行對話以定義您的主題。系統會詢問您主題名稱以及您對顏色、字體排印和整體氛圍的偏好。
3.  **本機儲存**：設計定案後，主題設定將以 `.yaml` 檔案的形式儲存在您專案的本機 `themes` 目錄中。

### 使用方法

要開始生成新主題，請執行以下指令：

```sh
aigne theme generate
```
*別名：`aigne theme gen`*

請依照螢幕上的提示完成主題創建過程。

## 套用主題

生成一個或多個主題後，您可以使用 `theme apply` 指令來選擇一個已儲存的主題並將其套用到您的網站上。此指令會讀取您的本機主題檔案，將它們以列表形式呈現，並在您確認後，將所選主題上傳到您的網站，使變更即時生效。

### 流程

1.  **執行指令**：在您的終端機中執行 `aigne theme apply`。
2.  **選擇主題**：工具會掃描 `themes` 目錄，並顯示您已生成的所有可用主題列表。該列表包含主題名稱、主色和字體等詳細資訊，以幫助您進行選擇。
3.  **檢視並確認**：系統將顯示目標網站的 URL、目前使用中的主題以及您所選擇的新主題。在進行任何變更之前，系統會要求您進行最終確認。
4.  **套用至網站**：一旦確認，主題將被上傳並套用到您的網站。一則成功訊息將表示此過程已完成。

### 使用方法

要套用一個現有的主題，請使用以下指令。

```sh
aigne theme apply
```

您也可以直接將網站 URL 指定為參數。如果省略，將會使用您 `aigne.config.yaml` 檔案中定義的 `appUrl`。

```sh
aigne theme apply --appUrl https://your-website.com
```

### 參數

`apply` 指令接受以下參數：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您網站的完整 URL。如果您未提供此項，指令將會使用您 `aigne.config.yaml` 設定檔中定義的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的設定檔位置。預設為標準的 `aigne.config.yaml` 路徑。</x-field-desc>
  </x-field>
</x-field-group>

---

透過遵循這些步驟，您可以有效地管理您網站的視覺識別。更新主題後的下一步，您可能會想回顧如何[發佈您的網站](./core-tasks-publishing-your-website.md)。