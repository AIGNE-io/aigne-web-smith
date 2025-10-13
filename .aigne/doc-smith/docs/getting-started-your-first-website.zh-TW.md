# 您的第一個網站

本教學將提供一個手把手的指南，教您如何使用 AIGNE WebSmith 產生一個完整的網站。此過程包含兩個主要步驟：建立一個設定檔來定義您的網站需求，然後執行一個指令來產生網站頁面。

在繼續之前，請確保您已成功安裝 AIGNE CLI。若尚未安裝，請遵循 [安裝](./getting-started-installation.md) 指南中的說明。

## 步驟 1：建立您的設定檔

設定檔是一個 YAML 格式的純文字檔案，用來告訴 AI 您想建立何種類型的網站。它包含了網站目的、目標受眾以及任何特定規則或內容需求等細節。

您可以透過兩種方式建立此檔案：透過互動式設定流程，或手動建立。

### 方法 A：互動式設定（建議）

若想獲得引導式體驗，請使用 `init` 指令。它會詢問您一系列關於網站的問題，並自動為您產生 `config.yaml` 檔案。

1.  開啟您的終端機或命令提示字元。
2.  執行以下指令：

    ```bash
    aigne web init
    ```

3.  回答所提出的問題。設定過程將引導您定義：
    *   **網站目的**：您網站的主要目標（例如：產品展示、部落格、文件）。
    *   **目標受眾**：網站的目標對象（例如：開發者、企業主）。
    *   **網站規模**：大約的頁面數量。
    *   **語言**：內容的主要語言。
    *   **資料來源**：用作內容產生來源的本機檔案或資料夾。
    *   **自訂規則**：給 AI 的任何特定指示。

完成後，一個名為 `config.yaml` 的檔案將會建立在 `aigne-web-smith` 目錄中，為下一步做好準備。

### 方法 B：手動建立

如果您偏好手動建立設定檔，可以建立一個文字檔案，並以 `.yaml` 為副檔名儲存（例如 `my-website.yaml`）。

此方法提供直接的控制權，但需要對 YAML 語法有基本的了解。

1.  建立一個名為 `my-website.yaml` 的新檔案。
2.  複製並貼上以下範本到您的檔案中，並修改其值以符合您的需求。

    ```yaml title="my-website.yaml"
    # 1. 定義您網站的規則和結構。
    # 這可以是一個簡單的頁面列表，或是一個更詳細的大綱。
    rules: |
      Create a modern website for a SaaS product that includes:
      1. A homepage introducing the product and its core features.
      2. A detailed pricing page with a comparison of different plans.
      3. A page showcasing customer success stories or testimonials.
      4. A simple contact page with a form and support information.

    # 2. 描述您網站的主要受眾。
    targetAudience: Small to medium-sized business owners and marketing managers.

    # 3. 指定網站內容的主要語言。
    locale: en

    # 4. 為網站選擇一個通用風格。
    # 常見選項包含「business」（商業）、「creative」（創意）、「minimalist」（極簡）等。
    websiteStyle: business
    ```

此範例設定指示 AI 為一個 SaaS 產品產生一個四頁的網站，目標對象為企業主，語言為英文，並採用專業的商業風格。

## 步驟 2：產生網站

一旦您的設定檔準備就緒，您就可以使用 `generate` 指令來開始網站的建立過程。AI 將會讀取您的設定、規劃網站結構，並為每個頁面產生內容和範本。

1.  確保您位於與設定檔相同的目錄中。
2.  在您的終端機中執行 `generate` 指令。

    *   如果您使用互動式設定（`aigne web init`），檔案名稱為 `config.yaml`，將會被自動使用：

      ```bash
      aigne web generate
      ```

    *   如果您是手動建立檔案（例如 `my-website.yaml`），則需要使用 `--input` 旗標來指定它：

      ```bash
      aigne web generate --input @my-website.yaml
      ```

產生過程可能需要幾分鐘，具體時間取決於頁面數量和您的需求複雜度。您會在終端機中看到進度更新。

## 步驟 3：檢視產生的檔案

在 `generate` 指令成功完成後，您的網站頁面將會儲存到您在設定中指定的本機目錄（預設為 `aigne-web-smith/pages`）。

您現在可以開啟此資料夾來檢視結果。您會找到一組檔案，通常是 YAML 格式，分別對應到您網站的每個頁面。這些檔案包含了可以發布的結構化內容和版面配置資訊。

## 總結與後續步驟

您已成功建立一個設定檔，並用它透過一個指令產生了一個多頁網站。產生的檔案現在已在您的本機電腦上準備就緒。

下一個合理的步驟是發布您的網站，讓它可以在線上存取。若要了解如何操作，請繼續閱讀下一份指南。

- **[發布您的網站](./core-tasks-publishing-your-website.md)**：了解如何將您產生的網站部署到網路上。