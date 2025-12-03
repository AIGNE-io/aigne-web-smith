# 總覽

本文件旨在對 AIGNE WebSmith 提供高層次的介紹。閱讀完畢後，您將理解其核心目的、關鍵功能，以及它用來自動化建立專業網站的基本工作流程，從初期規劃到最終發布。

AIGNE WebSmith 是一款由 AI 驅動的工具，可自動化建立專業且經 SEO 優化的網站。它會根據您提供的原始資料產生完整的內容和範本，並可直接發布最終網站。該系統旨在簡化整個網站開發流程，將手動工作和技術要求降至最低。

## 關鍵功能

WebSmith 提供了一套用於自動化網站建立與管理的完整功能。該系統圍繞四大核心能力建構：AI 驅動的生成、專業的範本系統、品質保證以及直接發布。

| 功能領域 | 說明 |
| :--- | :--- |
| **AI 驅動的生成** | 利用 AI 分析需求、規劃最佳網站結構、一次性為所有頁面生成詳細內容，並應用 SEO 最佳實踐。支援英文和中文內容生成。 |
| **專業範本** | 建立與 Pages Kit 相容的範本，採用基於元件的設計，包含如 Hero、CTA 和 FAQ 等元素。範本具有響應式設計，能適應行動裝置和桌面顯示。 |
| **品質保證** | 包含一個自動化評估系統，用以評估網站架構、使用者體驗和內容一致性。由一套涵蓋核心功能的超過 32 個測試案例提供支援。 |
| **一鍵發布** | 可將多頁面網站直接批次發布到 Pages Kit。它提供狀態監控，並在成功部署後立即提供公開存取連結。 |

## 運作方式

WebSmith 採用一系列專業的 AI agent，這些 agent 依序工作以建立和部署網站。每個 agent 負責流程中的一個特定階段，確保從概念到發布的流程結構化且可靠。

下圖說明了此順序流程：

<!-- DIAGRAM_IMAGE_START:architecture:16:9 -->
![Overview](assets/diagram/overview-diagram-0.jpg)
<!-- DIAGRAM_IMAGE_END -->

流程如下：

1.  **結構規劃**：一個 agent 分析您的專案需求，以設計出一個智慧且合乎邏輯的網站架構。
2.  **內容生成**：基於規劃好的結構，另一個 agent 為每個頁面生成高品質且相關的內容。
3.  **範本生成**：第三個 agent 將生成的內容組合到專業的、基於元件的範本中。
4.  **評估與發布**：最後，在發布 agent 上傳已完成的網站之前，評估 agent 會評估產出品質。

這種模組化的、基於 agent 的架構確保了每一步都由專業的流程處理，從而產出一致且高品質的最終產品。

## 核心元件

WebSmith 的功能是透過一組獨特的命令列介面（CLI）指令來提供。每個指令對應系統中的一個核心元件或工作流程。

<x-cards data-columns="2">
  <x-card data-title="Generate" data-icon="lucide:bot" data-href="/guides/create-website">
    根據使用者定義的需求，生成一個完整的網站，包含結構和內容。
  </x-card>
  <x-card data-title="Publish" data-icon="lucide:rocket" data-href="/guides/publish-website">
    將生成的網站發布到各種目標，包括 WebSmith Cloud 或您自己的基礎設施。
  </x-card>
  <x-card data-title="Update" data-icon="lucide:file-pen-line" data-href="/guides/update-website">
    根據新的回饋或需求，修改現有網站的內容或結構。
  </x-card>
  <x-card data-title="Translate" data-icon="lucide:languages" data-href="/guides/localize-website">
    將現有網站內容翻譯成多種語言，例如中文、日文、法文和德文。
  </x-card>
  <x-card data-title="Theme" data-icon="lucide:palette" data-href="/guides/customize-theme">
    透過生成並應用不同的樣式和配色方案來管理網站的視覺主題。
  </x-card>
  <x-card data-title="Component" data-icon="lucide:library" data-href="/advanced-features/use-custom-component-libraries">
    管理用於建構您網站視覺元素的元件庫。
  </x-card>
</x-cards>

## 總結

本總覽介紹了 AIGNE WebSmith 的主要功能和架構。您現在應該對 WebSmith 是什麼、其主要功能以及與之互動所使用的指令有了基本的了解。

接下來，我們建議您繼續閱讀 [入門指南](./getting-started.md)，該指南提供了逐步教學，引導您安裝、設定並生成您的第一個網站。