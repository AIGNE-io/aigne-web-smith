# 管理佈景主題

您網站的視覺主題——其顏色、字型和整體風格——在其識別度中扮演著至關重要的角色。AIGNE WebSmith 提供了一個 `theme` 指令，用於系統化地管理您網站的美學方面。這讓您能透過 AI 產生新的設計概念，並用一個指令來應用它們。

`theme` 指令分為兩個主要子指令：
*   **`generate`**：根據您的輸入建立一個新的佈景主題並將其儲存在本地。
*   **`apply`**：將本地的佈景主題上傳到您的網站，更新其線上外觀。

本指南將依序說明整個流程，從產生佈景主題開始，然後再到應用。

## 產生新的佈景主題

`theme generate` 指令會啟動一個由 AI 驅動的流程，以建立一個完整的佈景主題設定。AI 將引導您選擇名稱並定義新佈景主題的視覺特徵。產生的設定會以 `.yaml` 檔案的形式儲存在本地的 `themes` 目錄中，以供後續使用。

### 流程

1.  **啟動產生程序**：在您的終端機中執行 `aigne web theme generate`。
2.  **AI 驅動設計**：與 AI 進行對話以定義您的佈景主題。系統將詢問您佈景主題的名稱以及您對顏色、字體和整體風格的偏好。
3.  **本地儲存**：設計定案後，佈景主題設定將以 `.yaml` 檔案的形式儲存在您專案的本地 `themes` 目錄中。

### 使用方法

若要開始產生新的佈景主題，請執行以下指令：

```sh
aigne web theme generate
```
*別名：`aigne web theme gen`*

遵循螢幕上的提示完成佈景主題建立流程。

## 應用佈景主題

產生一個或多個佈景主題後，`theme apply` 指令可讓您選擇一個已儲存的佈景主題並將其應用到您的網站。此指令會讀取您本地的佈景主題檔案，將它們以列表形式呈現，並在您確認後，將所選的佈景主題上傳到您的網站，使變更即時生效。

### 流程

1.  **執行指令**：在您的終端機中執行 `aigne web theme apply`。
2.  **選擇佈景主題**：該工具會掃描 `themes` 目錄並顯示您已產生的所有可用佈景主題列表。該列表包含佈景主題名稱、主色和字型等詳細資訊，以幫助您選擇。
3.  **檢視並確認**：系統將顯示目標網站 URL、目前使用中的佈景主題以及您選擇的新佈景主題。在進行任何變更之前，系統會要求您最終確認。
4.  **應用至網站**：一旦確認，佈景主題將被上傳並應用到您的網站。一則成功訊息將表示流程已完成。

### 使用方法

若要應用現有的佈景主題，請使用以下指令。

```sh
aigne web theme apply
```

您也可以直接將網站 URL 指定為參數。如果省略，將使用您 `config.yaml` 檔案中的 `appUrl`。

```sh
aigne web theme apply --appUrl https://your-website.com
```

### 參數

`apply` 指令接受以下參數：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您網站的完整 URL。如果您未提供此項，指令將使用您 `config.yaml` 設定檔中定義的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的設定檔位置。預設為標準的 `config.yaml` 路徑。</x-field-desc>
  </x-field>
</x-field-group>

---

透過遵循這些步驟，您可以有效地管理您網站的視覺識別。更新佈景主題後的下一步，您可能會想檢視如何 [發布您的網站](./core-tasks-publishing-your-website.md)。