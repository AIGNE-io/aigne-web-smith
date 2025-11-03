# WebSmith 設定檔

本指南說明 `config.yaml` 檔案的用途與用法，這是任何 WebSmith 專案的核心設定檔。您可以在專案的根目錄 `.aigne/web-smith/config.yaml` 中找到此檔案。

---

## 什麼是設定檔？

### 基本資訊

`config.yaml` 檔案是 WebSmith 的**核心設定檔**。它使用 YAML 格式來儲存 WebSmith 產生您的網站所需的所有參數。

**檔案詳細資訊**：
- **檔案名稱**：`config.yaml` (固定名稱)
- **位置**：`.aigne/web-smith/config.yaml` (相對於專案根目錄)
- **格式**：YAML (UTF-8 編碼)

### 核心目的

設定檔是 WebSmith 運作的**核心參數載體**。每次執行 `generate` 命令時，AI agent 都會讀取此檔案，並根據其設定產生網站的結構與內容。

**主要功能**：
- 定義網站類型與目標受眾。
- 控制內容生成策略與寫作風格。
- 決定網站規模與頁面結構。
- 設定多語言支援。
- 設定部署參數。

---

## 設定檔的用途是什麼？

### 核心功能

`config.yaml` 檔案是在執行 `aigne web generate` 命令時使用的**說明手冊**。它告訴系統如何產生網站。透過此檔案，您可以指定網站的風格與類型、AI 的寫作風格、網站的規模（單頁或多頁）、語言版本，以及所有其他指導 AI agent 產生符合您需求的網站結構與內容的關鍵參數。

**總結**：設定檔是 WebSmith 網站生成的唯一依據與參數來源。整個流程都基於此檔案中的設定。

### 功能群組

設定檔中的欄位分為以下功能群組：

#### 專案基礎

此群組包含專案的基本識別與顯示資訊，用於網站品牌推廣與 SEO 優化。

**欄位**：`projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

**目的**：定義網站的名稱、描述、標誌、識別碼與其他基本資訊，影響頁面標題、導覽選單、SEO meta 標籤與社群媒體分享。

#### 網站策略

此群組定義網站的類型、風格、規模與生成策略，是控制 AI 生成內容的核心設定。

**欄位**：`pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

**目的**：
- `pagePurpose`：定義網站類型（例如，行銷登陸頁面、電子商務網站、SaaS 產品網站），這會影響生成的頁面元件與內容組織。
- `targetAudienceTypes`：定義目標受眾（例如，終端使用者、開發者、企業主），這會影響 AI 的寫作風格、語言複雜度與範例選擇。
- `websiteScale`：定義網站規模（單頁或多頁），控制要生成的頁面數量。
- `rules`：為頁面生成提供詳細的指導，包括結構、內容與風格要求。

#### 國際化

此群組設定網站的語言版本，支援多語言網站生成。

**欄位**：`locale`, `translateLanguages`

**目的**：定義網站的主要語言與翻譯語言列表，控制生成哪些語言版本的網站（每種語言都會生成一個完整的網站結構）。

#### 內容來源

此群組指定 AI 分析的內容來源，這些來源被用作生成網站頁面的素材與參考資訊。

**欄位**：`sourcesPath`, `defaultDatasources`

**目的**：
- `sourcesPath`：指定供 AI 分析的文件目錄、Markdown 檔案、YAML 檔案、圖片資源等。**此欄位決定了生成網站內容的品質與效果，直接影響 AI 生成內容的準確性、相關性與專業性。**
- `defaultDatasources`：指定要注入到每個頁面的通用資料來源，每次執行命令時都會將其加入到上下文中（例如，`media.md`，其中包含專案中圖片的位置與描述）。

#### 輸出與部署

此群組設定生成檔案的輸出位置與網站部署參數。

**欄位**：`pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

**目的**：
- `pagesDir`：指定儲存生成頁面檔案的目錄（輸出位置）。
- `appUrl`：指定網站的部署 URL，影響生成的連結與 SEO。
- `checkoutId`, `shouldSyncAll`, `navigationType`：這些是開發期間使用的暫時變數，僅作為設定檔中的佔位符資料。使用者無需關心這些值。

#### 媒體與顯示

此群組設定與圖片品質與顯示相關的參數。

**欄位**：`media.minImageWidth`, `lastGitHead`

**目的**：
- `media.minImageWidth`：定義最小圖片寬度要求，用於過濾掉低品質的圖片。
- `lastGitHead`：記錄上次生成時的 Git commit ID，用於增量更新。

---

## 如何產生設定檔？

### 生成方式

設定檔是透過執行以下命令產生的：

```bash
aigne web init
```

此命令會啟動一個互動式精靈，引導您逐步完成設定過程：

1.  **網站類型** (`pagePurpose`)：選擇網站的主要目的（可複選）。
2.  **目標受眾** (`targetAudienceTypes`)：選擇網站的目標使用者群體（可複選）。
3.  **網站規模** (`websiteScale`)：選擇網站的頁面數量。
4.  **主要語言** (`locale`)：選擇網站的主要語言。
5.  **翻譯語言** (`translateLanguages`)：選擇要翻譯成的語言（可複選）。
6.  **頁面輸出目錄** (`pagesDir`)：設定儲存生成頁面檔案的位置。
7.  **資料來源路徑** (`sourcesPath`)：指定供 AI 分析的內容來源（可新增多個路徑）。
8.  **自訂規則** (`rules`)：可選，為頁面生成提供詳細要求。

完成精靈後，設定檔會自動儲存到 `.aigne/web-smith/config.yaml`。

### 設定範例

以下是 AIGNE WebSmith 專案本身的實際設定檔：

```yaml
projectName: AIGNE WebSmith
projectDesc: "基於 AIGNE 框架的 AI 網站生成工具"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. 核心訊息與策略：定義您向使用者傳達*什麼*的基礎元素。
  1. 在首屏回答關鍵問題：使用者看到的第一個畫面必須清晰且立即回答：
    * 它是什麼：對產品的簡潔描述。
    * 為誰而設：特定的目標受眾（例如，個人創業者、小型團隊）。
    * 為何與眾不同：您獨特的價值主張（例如，「開放、可組合、可匯出的程式碼、agent 工作流程」）。
    * 主要行動：一個單一、明確的行動呼籲 (CTA)，與使用者的主要目標一致。
  2. 用證明建立信譽：不要期望使用者相信您的說法。在敘述的早期向他們展示證明。
    * 展示，而不僅僅是告知：最有力的證明是示範。包含一個簡短的（30-45秒）無聲影片循環，或一個連結到用該工具建立的真實網站。
    * 使用社會證明：在解釋「如何運作」之前，插入具體的證據，如客戶標誌、一個引人注目的數據點（例如，「超過 50 個團隊使用」），或一句強而有力的使用者引言。
  3. 定義一個明確的行動呼籲 (CTA)：
    * 使 CTA 與受眾對齊：主要的 CTA 應該是您希望目標使用者採取的主要行動（例如，「產生我的網站」）。
    * 區分 CTA 的優先級：將次要的行動（如「在 GitHub 上查看」）放在較不顯眼的位置（次要按鈕或頁腳連結），特別是對於非開發者受眾。
    * 在行動裝置上維持一個固定的 CTA：在行動裝置上，一個主要的 CTA 應該始終可見。
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
pagesDir: .aigne/web-smith/pages
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 600
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
checkoutId: ""
projectCover: .aigne/web-smith/cover.png
shouldSyncAll: ""
navigationType: ""
appUrl: https://mhevtaeg.user.aigne.io
```

### 欄位參考

根據上述的實際設定，以下是每個欄位的詳細說明：

#### 專案基礎

**`projectName`**
- **目的**：專案的顯示名稱，顯示在頁面標題 (`<title>`)、導覽選單與網站品牌中。
- **類型**：字串
- **變更影響**：更改此值將更新整個網站上顯示的名稱。建議保持簡潔（50 個字元以內）以獲得更好的顯示效果與 SEO。
- **如何套用**：執行 `aigne web update` 或 `aigne web generate`。

**`projectDesc`**
- **目的**：專案描述，用於 SEO meta 描述標籤 (`<meta name="description">`) 與社群媒體分享。
- **類型**：字串
- **變更影響**：修改此項會更新 meta 標籤與社群分享的描述。建議長度在 150 個字元以內，並包含核心關鍵字以利 SEO。
- **如何套用**：執行 `aigne web update` 或 `aigne web generate`。

**`projectLogo`**
- **目的**：專案標誌，用於頁面頁首、瀏覽器 favicon 與社群分享縮圖。
- **類型**：字串 (URL 或檔案路徑)
- **變更影響**：更新整個網站的標誌。支援 HTTPS URL 或相對路徑（例如，`./assets/images/logo.svg`）。建議使用 PNG 或 SVG 格式。
- **如何套用**：執行 `aigne web update` 或 `aigne web generate`。

**`projectId`**
- **目的**：專案的唯一識別碼，供 WebSmith 服務用來關聯部署、歷史記錄與資料來源。
- **類型**：字串 (UUID 格式)
- **變更影響**：⚠️ **重要**：除非您打算建立一個新專案，否則請勿修改此 ID。更改它可能會破壞與現有部署、歷史記錄與資料來源的關聯。
- **如何套用**：如有必要修改，請執行 `aigne web generate` 重新生成。

**`projectSlug`**
- **目的**：URL 路徑前綴，影響網站的部署路徑與內部連結生成。
- **類型**：字串 (URL 路徑格式)
- **變更影響**：值為 `/` 會將網站部署到根目錄（例如，`https://example.com/`），而 `/docs` 會將其部署到 `https://example.com/docs/`。
- **如何套用**：執行 `aigne web generate` 以更新所有連結。

**`projectCover`**
- **目的**：網站的封面圖片，用於社群媒體上的預覽（例如，Open Graph、Twitter Cards）。
- **類型**：字串 (檔案路徑)
- **變更影響**：更新社群分享的預覽圖片。建議使用高品質圖片（至少 1200x630px）。
- **如何套用**：執行 `aigne web update` 或 `aigne web generate`。

#### 網站策略

**`pagePurpose`**
- **目的**：定義網站的主要目標，直接影響 AI 的生成策略與頁面結構。
- **類型**：陣列 (可複選)
- **可用值**：
  - `landingPage`：用於行銷與轉換。生成英雄區塊、功能、CTA 等。
  - `ecommerce`：用於線上銷售。生成產品目錄、購物車等。
  - `saas`：用於 SaaS 產品網站。生成功能描述、定價、示範等。
  - `portfolio`：用於展示作品。生成視覺驅動的版面、畫廊等。
  - `corporate`：用於公司資訊。生成公司概覽、服務、團隊資訊等。
  - `blog`：用於內容分享。生成內容組織、SEO 優化等。
  - `nonprofit`：用於非營利組織。生成使命宣言、捐款流程等。
  - `education`：用於教育網站。生成課程列表、學習路徑等。
  - `mixedPurpose`：用於多功能網站。生成元件的組合。
- **如何套用**：更改此項會改變整個網站的內容策略。執行 `aigne web generate` 以完全重新生成。

**`targetAudienceTypes`**
- **目的**：定義目標受眾，影響 AI 的寫作風格、語言複雜度與範例選擇。
- **類型**：陣列 (可複選)
- **可用值**：
  - `customers`：針對終端使用者。使用簡單的語言，強調可用性。
  - `businessOwners`：針對企業家。專注於投資回報率與商業價值。
  - `marketers`：針對行銷團隊。專注於行銷指標與品牌知名度。
  - `designers`：針對設計師。強調視覺吸引力與美學。
  - `developers`：針對技術使用者。提供技術細節、程式碼範例、API 文件。
  - `investors`：針對利害關係人。專注於成長指標與市場機會。
  - `jobSeekers`：針對招聘。專注於公司文化與職涯發展。
  - `students`：針對學習者。使用教育性語氣與逐步指導。
  - `generalPublic`：針對廣泛受眾。使用易於理解的語言與多個切入點。
- **如何套用**：改變語氣與範例。執行 `aigne web generate` 以完全重新生成。

**`websiteScale`**
- **目的**：定義網站的規模，控制頁面數量與導覽結構的複雜性。
- **類型**：字串 (單選)
- **可用值**：
  - `singlePage`：一個包含多個區塊的單頁網站。
  - `minimal`：一個包含 2-6 個核心頁面的小型網站（例如，首頁、關於我們、聯絡我們）。
  - `standard`：一個包含 7-12 個頁面的標準網站（推薦）。
  - `comprehensive`：一個包含 12 個以上頁面的大型網站。
  - `aiDecide`：讓 AI 根據其他參數決定適當的規模。
- **如何套用**：直接決定生成的頁面數量。執行 `aigne web generate` 以重新生成所有頁面。

**`rules`**
- **目的**：以 Markdown 格式為頁面生成提供詳細指示。這是指導 AI 最關鍵的欄位。
- **類型**：多行字串 (支援 Markdown)
- **變更影響**：直接影響生成內容的品質，包括頁面結構、內容組織與語氣。
- **如何套用**：`rules` 是內容生成的主要指南。執行 `aigne web generate` 以根據新規則完全重新生成。

#### 國際化

**`locale`**
- **目的**：定義網站的主要語言。AI 會先用此語言生成所有內容。
- **類型**：字串
- **支援代碼**：標準 IETF 語言代碼（例如，`en`, `zh`, `ja`, `fr`, `de`）。
- **如何套用**：更改所有頁面的主要語言。執行 `aigne web generate` 以新語言重新生成所有內容。

**`translateLanguages`**
- **目的**：要將網站翻譯成的其他語言列表。將為每種語言生成一個完整的、已翻譯的網站版本。
- **類型**：陣列 (可複選)
- **支援代碼**：與 `locale` 相同（不能包含 `locale` 本身的值）。
- **如何套用**：新增或移除語言版本。執行 `aigne web generate` 以重新生成所有語言版本。

#### 內容來源

**`sourcesPath`**
- **目的**：定義供 AI 分析的內容來源目錄/檔案。**此欄位是生成內容品質、準確性與相關性的決定性因素。**
- **類型**：陣列 (路徑列表)
- **變更影響**：新增新路徑會擴展 AI 的知識庫，可能提升內容品質。移除路徑可能導致資訊缺失。支援目錄與檔案 (`.md`, `.yaml`, `.json`, `.txt`)。
- **如何套用**：新的資料來源將被分析。執行 `aigne web generate`。

**`defaultDatasources`**
- **目的**：在每個頁面生成任務中都會注入到上下文中的資料來源（例如，描述圖片資產的 `media.md` 檔案）。
- **類型**：陣列 (檔案路徑列表)
- **變更影響**：適用於提供通用的、可重複使用的資訊，如聯絡方式或品牌資產。
- **如何套用**：在執行 `aigne web update` 或 `aigne web generate` 時生效。

#### 輸出與部署

**`pagesDir`**
- **目的**：WebSmith 儲存生成頁面檔案的輸出目錄（例如，`page.yaml`, `_navigations.yaml`）。
- **類型**：字串 (路徑)
- **變更影響**：更改生成檔案的儲存位置。如果目錄不存在，將會自動建立。
- **如何套用**：變更將在下次生成時生效。

**`appUrl`**
- **目的**：網站的最終部署 URL。
- **類型**：字串 (URL 格式)
- **變更影響**：決定網站發布的平台。必須包含協議 (`https://`)。
- **如何套用**：**僅在 `aigne web publish` 命令期間生效。**

**`checkoutId`**, **`shouldSyncAll`**, **`navigationType`**
- **目的**：這些是開發期間使用的暫時變數。使用者不應修改這些值，因為它們由系統自動管理。

#### 媒體與顯示

**`media.minImageWidth`**
- **目的**：要包含的圖片所需的最小寬度（以像素為單位）。用於過濾掉低品質的圖片。
- **類型**：整數 (像素)
- **變更影響**：較高的值可確保只使用高品質圖片，但可能會減少可用圖片的數量。
- **如何套用**：執行 `aigne web generate` 以重新過濾並套用新的圖片選擇。

**`lastGitHead`**
- **目的**：儲存上次生成時的 Git commit hash，用於增量更新。
- **類型**：字串 (Git commit hash)
- **變更影響**：此值由系統自動管理，不應手動修改。

---

## 何時修改設定檔

### 調整核心功能

**情境 1：從單頁網站升級為多頁網站**
- **要修改的欄位**：`websiteScale` (例如，從 `singlePage` 改為 `standard`)
- **命令**：如果已經生成了文件，請執行 `aigne web clear` 然後 `aigne web generate`。

**情境 2：更改網站的目的**
- **要修改的欄位**：`pagePurpose` (例如，從 `saas` 改為 `ecommerce`)
- **命令**：如果已經生成了文件，請執行 `aigne web clear` 然後 `aigne web generate`。

**情境 3：調整目標受眾**
- **要修改的欄位**：`targetAudienceTypes` (例如，從 `customers` 改為 `businessOwners`)
- **命令**：如果已經生成了文件，請執行 `aigne web clear` 然後 `aigne web generate`。

### 更新內容來源

**情境 4：新增內容來源**
- **要修改的欄位**：`sourcesPath` (新增檔案或目錄路徑)
- **命令**：執行 `aigne web generate`。新的來源將可供 AI 使用。

### 優化與修正問題

**情境 5：提升圖片品質**
- **要修改的欄位**：`media.minImageWidth` (例如，從 `600` 增加到 `1000`)
- **命令**：執行 `aigne web update` 或 `aigne web generate`。

**情境 6：優化 AI 生成的內容**
- **要修改的欄位**：`rules` (為結構、語氣等新增更具體的指示)
- **命令**：執行 `aigne web update` 或 `aigne web generate`。

### 管理語言

**情境 7：新增語言**
- **要修改的欄位**：`translateLanguages` (新增語言代碼，例如 `fr`)
- **命令**：執行 `aigne web translate` 或 `aigne web update`。

**情境 8：更改主要語言**
- **要修改的欄位**：`locale` (例如，從 `zh` 改為 `en`)
- **命令**：執行 `aigne web clear` 然後 `aigne web generate`。

### 更新基本資訊

**情境 9：更新專案品牌**
- **要修改的欄位**：`projectName`, `projectDesc`, `projectLogo`, `projectCover`
- **命令**：執行 `aigne web publish`。

**情境 10：設定部署 URL**
- **要修改的欄位**：`appUrl`
- **命令**：執行 `aigne web publish`。

---

## 如何套用設定變更

### 使用命令套用變更

套用不同欄位的變更需要不同的命令：

- **功能性 (`pagePurpose`, `websiteScale`, `targetAudienceTypes`)**：
  - 如果內容已存在，則執行 `aigne web clear` 然後 `aigne web generate`。
- **內容來源 (`sourcesPath`, `defaultDatasources`)**：
  - `aigne web generate` 或 `aigne web update`。
- **問題修正 (`media.minImageWidth`, `rules`)**：
  - `aigne web update` 或 `aigne web generate`。
- **國際化**：
  - `translateLanguages`：`aigne web translate` 或 `aigne web update`。
  - `locale`：`aigne web clear` 然後 `aigne web generate`。
- **基本資訊 (`projectName`, `appUrl`, 等)**：
  - `aigne web publish`。

### 工作流程摘要

1.  修改 `config.yaml` 檔案。
2.  儲存檔案。
3.  根據您變更的欄位執行適當的命令。
4.  檢查生成的檔案以驗證變更是否已生效。

---

## 處理設定錯誤

### 常見錯誤

- **縮排不正確**：YAML 對縮排很敏感。請一致地使用空格（而非 Tab）。
- **特殊字元**：鍵值對請使用標準的英文冒號 (`:`)，而非其他字元。
- **值類型不正確**：在需要陣列的地方提供了字串（例如，`pagePurpose: landingPage` 而非 `pagePurpose: [landingPage]`）。系統將退回使用預設值。
- **缺少必要欄位**：如果刪除了一個關鍵欄位，生成過程可能仍會繼續，但會導致網站資訊缺失（例如，沒有標題）。
- **未知欄位**：新增一個不存在於結構定義中的欄位將被系統忽略，且不會引起錯誤。

### 偵測與復原

- **自動偵測**：執行任何 `aigne web` 命令都會解析該檔案。如果存在 YAML 語法錯誤，命令將會失敗並報告錯誤。
- **復原計畫**：
  1.  **版本控制**：最佳實踐是將您的 `config.yaml` 納入版本控制（例如，Git）。您可以還原到先前可用的版本。
  2.  **驗證與修正**：仔細檢查您的檔案是否有語法錯誤。將其與本指南中的範例進行比較。
  3.  **重新初始化**：如果檔案嚴重損壞，您可以備份它、刪除它，然後執行 `aigne web init` 來產生一個新的、乾淨的設定檔。然後您可以從備份中手動複製您的自訂設定。

### 系統穩健性

- **找不到檔案**：系統會引導您執行 `aigne web init`。
- **YAML 解析失敗**：系統將報告一個使用者友善的錯誤。
- **未知欄位**：多餘的欄位會被忽略。
- **值格式不正確**：系統將使用預設值。
- **缺少欄位**：某些欄位有預設值（`locale` 預設為 "en"）。

### 預防措施

1.  **使用版本控制**：將 `config.yaml` 放在 Git 中。
2.  **定期備份**：在進行重大變更之前建立備份。
3.  **使用 CLI**：偏好使用 `aigne web init` 進行初始設定以避免手動錯誤。
4.  **變更後驗證**：編輯後立即執行命令以檢查錯誤。

---

## 常見問題

### Q1：如果我對設定檔的變更沒有生效，該怎麼辦？
**A**：首先，確保檔案已儲存。其次，檢查是否有 YAML 格式錯誤。第三，確保您執行了正確的命令來套用特定的變更（例如，`projectName` 需要 `aigne web publish`）。

### Q2：如何新增一種新語言？
**A**：在您的 `config.yaml` 檔案中，將該語言的代碼新增到 `translateLanguages` 陣列中。然後，執行 `aigne web translate` 或 `aigne web update`。

### Q3：如果生成的內容不符合我的期望怎麼辦？
**A**：這通常是因為指導不足。試著讓您的 `rules` 更詳細，調整 `targetAudienceTypes` 使其更具體，或在您的 `sourcesPath` 中新增更多相關內容。

### Q4：如何修正設定檔中的格式錯誤？
**A**：最常見的錯誤是縮排不一致、使用非標準字元作為冒號，以及不正確的資料類型（例如，字串而非陣列）。請參閱「如果設定檔損壞會發生什麼？」部分以獲得詳細的復原步驟。