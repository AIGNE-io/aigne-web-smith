# WebSmith 設定

## 什麼是設定檔？

### 基本概念

`config.yaml` 是 WebSmith 的核心設定檔。它使用 YAML 格式，儲存 WebSmith 產生、翻譯和發佈網站所需的所有參數。

![.aigne/web-smith/config.yaml 的引導式審閱畫面](../../../assets/images/web-smith-config.png)

**檔案詳情**
- **檔案名稱：** `config.yaml` (固定)
- **位置：** `.aigne/web-smith/config.yaml`，相對於專案根目錄
- **格式：** YAML (UTF-8)

---

## 設定檔有什麼作用？

### 核心功能

設定檔是 WebSmith 的中央參數載體。每當 WebSmith 執行 `generate` 指令時，它會讀取此檔案，並根據其設定產生網站結構和內容。

主要用途：
- 定義網站類型和目標受眾
- 控制內容生成策略和寫作風格
- 決定網站規模和頁面結構
- 設定多語言支援
- 設定部署參數

### 功能分組

欄位按功能分組如下：

#### 第 1 組：專案基礎

用於品牌和 SEO 的基本識別碼和呈現資訊。

欄位：`projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

用途：定義名稱、描述、標誌、識別碼等。影響頁面標題、導覽選單、SEO meta 標籤和社群分享。

#### 第 2 組：網站策略

定義網站類型、語氣、規模和生成策略。這控制了 WebSmith 如何產生內容。

欄位：`pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

用途：
- `pagePurpose`：定義網站類型（例如，登陸頁面、電子商務、SaaS），影響元件和內容組織
- `targetAudienceTypes`：定義受眾（例如，終端使用者、開發者、企業主），影響 WebSmith 的語氣、複雜度和範例
- `websiteScale`：定義網站規模（單頁 vs 多頁），控制頁面數量
- `rules`：關於結構、內容和風格的詳細指導

#### 第 3 組：語言

設定語言版本以支援多語言網站。

欄位：`locale`, `translateLanguages`

用途：定義主要語言和翻譯目標。每種語言都會產生一個完整的網站結構。

#### 第 4 組：資料來源

指定 WebSmith 分析的資料來源，作為頁面生成的素材和參考。

欄位：`sourcesPath`, `defaultDatasources`

用途：
- `sourcesPath`：WebSmith 分析的目錄或檔案（Markdown、YAML、圖片等）。這直接決定了內容的品質、準確性和相關性。
- `defaultDatasources`：在指令執行時注入到每個頁面的通用資料來源（例如，包含圖片位置和描述的 `media.md`）

#### 第 5 組：輸出與部署

設定輸出路徑和部署參數。

欄位：`pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

用途：
- `pagesDir`：生成的頁面檔案寫入的位置
- `appUrl`：部署的網站 URL，影響連結和 SEO
- `checkoutId`, `shouldSyncAll`, `navigationType`：開發期間使用的臨時變數；您通常不需要管理它們

#### 第 6 組：媒體與顯示

設定圖片品質和相關的呈現參數。

欄位：`media.minImageWidth`, `lastGitHead`

用途：
- `media.minImageWidth`：最小圖片寬度，用於過濾低品質素材
- `lastGitHead`：用於增量更新的最後一次 Git 提交 ID

---

## 設定檔如何建立？

### 生成方法

使用以下指令：

```bash Init icon=lucide:terminal
aigne web init
```

此指令會啟動一個互動式精靈來填寫：

- 網站類型 (`pagePurpose`)：主要目的（可複選）
- 目標受眾 (`targetAudienceTypes`)：網站的對象（可複選）
- 網站規模 (`websiteScale`)：頁面數量
- 主要語言 (`locale`)
- 翻譯語言 (`translateLanguages`)（可複選）
- 輸出目錄 (`pagesDir`)
- 來源路徑 (`sourcesPath`)（可多項輸入）
- 自訂規則 (`rules`)（可選）

完成後，檔案會儲存到 `.aigne/web-smith/config.yaml`。

### 實際設定範例

以下是 AIGNE WebSmith 專案的實際設定：

```yaml config.yaml icon=logos:yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. Core Messaging & Strategy: Foundational elements that define *what* you communicate to the user.
  1. Answer Critical Questions "Above the Fold": The very first screen a user sees must clearly and immediately answer:
    * What it is: A concise description of the product.
    * Who it's for: The specific target audience (e.g., solo founders, small teams).
    * Why it's different: Your unique value proposition (e.g., "open, composable, exportable code, agent workflow").
    * Primary Action: A single, clear Call to Action (CTA) that aligns with the user's main goal.
  2. Establish Credibility with Proof: Don't expect users to trust your claims. Show them proof early in the narrative.
    * Show, Don't Just Tell: The most powerful proof is a demo. Include a short (30-45s) silent video loop or a link to a real site built with the tool.
    * Use Social Proof: Before explaining "How it Works," insert tangible evidence like a customer logo, a compelling data point (e.g., "Used by 50+ teams"), or a strong user quote.
  3. Define a Clear Call to Action (CTA):
    * Align CTA with the Audience: The primary CTA should be the main action you want your target user to take (e.g., "Generate My Site").
    * Prioritize CTAs: Relegate secondary actions (like "See it on GitHub") to less prominent positions (tertiary buttons or footer links), especially for non-developer audiences.
    * Maintain a Persistent Mobile CTA: On mobile, a single primary CTA should always be visible.
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

### 逐欄說明

根據上述實際設定，以下是每個欄位的作用：

#### 專案基礎

`projectName`
- 用途：顯示名稱，用於頁面 `<title>`、導覽和網站品牌
- 目前值：`AIGNE WebSmith`
- 類型：string
- 影響：
  - 更改名稱會更新所有頁面的標題和導覽標籤
  - 保持簡潔；為提高可讀性和 SEO，建議在 50 個字元以內
- 如何應用：變更後執行 `aigne web publish`

`projectDesc`
- 用途：專案描述，用於 SEO meta (`<meta name="description">`) 和社群分享
- 目前值：`"AI-powered website generation tool built on the AIGNE Framework"`
- 類型：string
- 影響：
  - 更新頁面和社群分享的 meta 描述
  - 為符合搜尋摘要的長度，建議在約 150 個字元以內
  - 包含 SEO 的關鍵詞
- 如何應用：變更後執行 `aigne web publish`

`projectLogo`
- 用途：用於頁首導覽、favicon 和社群縮圖的標誌
- 目前值：`https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- 類型：string (URL 或路徑)
- 影響：
  - 切換 URL/路徑會更新全站的標誌
  - 支援：HTTP/HTTPS URL 或相對路徑 (例如，`./assets/images/logo.svg`)
  - 偏好使用 PNG 或 SVG 以獲得清晰的顯示效果
- 如何應用：變更後執行 `aigne web publish`

`projectId`
- 用途：唯一的專案識別碼，WebSmith 服務用它來關聯部署、歷史記錄和資料來源
- 目前值：`pg4d0000-0000-4000-a000-000000000000` (UUID)
- 類型：string (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- 影響：
  - 更改為新的 UUID 會使系統將其視為一個新專案，這可能會：
    - 中斷與先前部署連結的關聯
    - 失去與專案歷史記錄的連結
    - 失去資料來源的關聯
- 如何應用：變更後執行 `aigne web publish`

`projectSlug`
- 用途：URL 路徑前綴，影響部署路徑和內部連結
- 目前值：`/` (根目錄)
- 類型：string (URL 路徑)
- 影響範例：
  - `/`：網站在根目錄，例如 `https://example.com/`
  - `/portfolio`：網站在 `https://example.com/portfolio/`
  - `/docs`：網站在 `https://example.com/docs/`
  - 更改會更新所有內部連結和部署路徑
- 如何應用：變更後執行 `aigne web publish`

`projectCover`
- 用途：網站封面圖片，用於預覽和社群分享（Open Graph、Twitter Card 等）
- 目前值：`.aigne/web-smith/cover.png`
- 類型：string (檔案路徑)
- 影響：
  - 更改路徑會更新社群分享時的預覽圖片
  - 使用高品質圖片（至少 1200×630）
  - 格式：PNG、JPG/JPEG、WebP 等
- 如何應用：變更後執行 `aigne web publish`

#### 網站策略

`pagePurpose`
- 用途：定義主要目的；直接影響生成策略和頁面結構
- 目前值：`[landingPage]` (陣列)
- 類型：array (可複選)
- 選項與效果：
  - `landingPage` (目前)：以轉換為重點的登陸頁面；生成英雄區、功能、CTA、常見問題等
  - `ecommerce`：線上商店；生成目錄、購物車、結帳、評論等
  - `saas`：SaaS 產品網站；生成功能、定價、示範、入門引導等
  - `portfolio`：作品集網站；生成視覺佈局、畫廊、案例研究等
  - `corporate`：公司網站；生成公司概覽、服務、團隊、聯絡方式等
  - `blog`：部落格；生成內容結構、SEO、分享、存檔等
  - `nonprofit`：非營利組織；生成使命、捐款流程、志工註冊等
  - `education`：教育；生成課程列表、學習路徑、進度追蹤等

`targetAudienceTypes`
- 用途：定義目標受眾；直接影響語氣、複雜度和範例選擇
- 目前值：`[customers]` (陣列)
- 類型：array (可複選)
- 選項與效果：
  - `customers` (目前)：終端使用者/客戶；使用簡單語言，強調易用性和成果；增加信任信號和使用者故事
  - `businessOwners`：企業主/創辦人；專注於投資回報率和商業價值；專業語氣；包含商業案例和回報分析
  - `marketers`：行銷團隊；以 KPI 和品牌為導向；包含行銷工具和分析
  - `designers`：設計師；強調視覺效果和設計展示；美學和靈感；包含設計案例和視覺工具
  - `developers`：開發者/技術使用者；技術細節、程式碼範例、API 文件；注重準確性和實作
  - `investors`：投資者/利害關係人；成長指標、市場機會、財務前景；商業計畫和市場資料
  - `jobSeekers`：求職者；注重文化、成長、福利；職位列表和公司文化
  - `students`：學生/學習者；教學語氣、逐步指導、進度追蹤；教學和課程材料
  - `generalPublic`：一般/混合受眾；易於理解的語言、多個切入點、廣泛的吸引力
- 如何應用：變更後執行 `aigne web clear && aigne web generate`

`websiteScale`
- 用途：定義網站規模，控制頁面數量和導覽複雜度
- 目前值：`singlePage`
- 類型：string (單選)
- 選項與效果：
  - `singlePage` (目前)：單頁網站；所有區塊都在一個可滾動的頁面上（英雄區、功能、常見問題、CTA 等）；適合快速啟動/MVP
  - `minimal`：2–6 頁；首頁、關於、服務/產品、聯絡方式等；適合小型企業/簡單網站
  - `standard`：7–12 頁；minimal + 作品集/部落格、團隊、常見問題、定價等；專業網站、作品集、小型電子商務（推薦）
  - `comprehensive`：12+ 頁；standard + 詳細服務頁面、案例研究、資源中心等；大型/複雜/內容豐富的網站
  - `aiDecide`：讓 WebSmith 根據類型、受眾和程式碼庫分析決定規模；考慮業務需求、內容量和維護能力
- 如何應用：變更後執行 `aigne web clear && aigne web generate`

`rules`
- 用途：關於結構、內容和風格的詳細生成指導（Markdown）。這是 WebSmith 最重要的指導，直接影響品質和使用者體驗。
- 目前值：一個包含詳細指導的多行區塊（見上例），包括：
  - 核心訊息與策略
  - 在「首屏之上」回答關鍵問題
  - 用證據建立可信度
  - 定義明確的行動呼籲
- 類型：多行字串 (支援 Markdown)
- 影響：
  - 空白或稀疏的規則：WebSmith 會退回預設值，可能不符合您的需求
  - 詳細的規則：WebSmith 會遵循您的指導來安排結構、組織和語氣
  - 變更：WebSmith 會根據新規則重新生成，影響區塊和表達方式
- 如何應用：變更後執行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 語言

`locale`
- 用途：用於基礎內容生成的主要網站語言
- 目前值：`en`
- 類型：string
- 支援的語言代碼：標準 IETF 代碼，如 `en`、`zh`、`zh-TW`、`ja`、`ko`、`fr`、`de`、`es`、`pt`、`ru`、`it`、`ar` 等
- 如何應用：變更後執行 `aigne web clear && aigne web generate`

`translateLanguages`
- 用途：要翻譯成的語言列表；每種語言都會成為一個完整的網站結構
- 目前值：`[zh, zh-TW, ja]`
- 類型：array (可複選)
- 支援的代碼：與 `locale` 相同（但不能包含 `locale` 本身）
- 每種語言的效果：
  - `zh`：生成一個完整的簡體中文網站
  - `zh-TW`：生成一個完整的繁體中文網站
  - `ja`：生成一個完整的日文網站
  - 其他語言行為類似；每種都會生成一個獨立的網站結構
- 如何應用：變更後執行 `aigne web translate`

#### 資料來源

`sourcesPath`
- 用途：由 WebSmith 引擎分析的目錄/檔案（陣列）。WebSmith 僅使用這些來源作為生成網站內容的參考。這直接決定了品質、準確性和相關性。
- 目前值：
  ```yaml
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
  ```
- 類型：array (路徑)
- 重要性：
  - 內容品質的主要決定因素：僅使用這些來源作為參考
  - 建議：
    - 包含主要文件和 readme
    - 包含重要的專案資訊來源
    - 保持來源準確且最新
    - 定期更新以符合專案狀態
- 影響：
  - 新增路徑：WebSmith 會分析更多素材，通常能提升品質
  - 移除路徑：WebSmith 會停止分析它們，可能會遺漏資訊
  - 路徑類型：
    - 目錄 (例如，`./assets/documents`)：遞迴分析
    - 檔案 (例如，`./README.md`)：直接分析
    - 支援的類型：`.md`、`.yaml`/`.yml`、`.json`、`.txt` 等
    - 圖片目錄：圖片不會被分析，但可以被引用
- 如何應用：變更後執行 `aigne web clear && aigne web generate` 或 `aigne web update`

`defaultDatasources`
- 用途：自動注入到每個頁面上下文的資料來源（例如，媒體、聯絡資訊）。這些在每次指令執行時都會被加入，但並非每個資源都會完全內嵌；適合資源描述，如 `media.md`。
- 目前值：`[./media.md]`
- 類型：array (檔案路徑)
- 影響：
  - 新增：新包含的通用內容（品牌資訊、共用片段等）
  - 移除：不再注入
  - 適用於：`media.md`（圖片位置和描述）、共用的聯絡/品牌資訊
  - 支援：`.md`、`.yaml`/`.yml`、`.json`
- 如何應用：變更後執行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 輸出與部署

`pagesDir`
- 用途：生成的網站檔案的輸出目錄（例如，`page.yaml`、`_navigations.yaml`）
- 目前值：`.aigne/web-smith/pages`
- 類型：string (路徑)
- 影響：
  - 更改（例如，改為 `./output/pages`）會將未來的輸出移至該處
  - 為方便移植，偏好使用相對路徑
  - 若目錄不存在，會自動建立
- 如何應用：未來的生成會寫入新目錄

`appUrl`
- 用途：網站部署 URL；決定網站發佈到何處
- 目前值：`https://mhevtaeg.user.aigne.io`
- 類型：string (URL)
- 影響：
  - 更改為另一個 URL 會發佈到一個新目標
  - 必須包含協定；若缺少，會自動加上 `https://`
  - 在最終網域確定後設定，以避免變動
- 如何應用：僅由 `aigne web publish` 使用；其他指令會忽略它

`checkoutId`
- 用途：臨時開發變數；僅為方便而儲存
- 目前值：`""`
- 類型：string
- 注意：由系統管理；您通常不需要設定它

`shouldSyncAll`
- 用途：臨時開發變數；僅為方便而儲存
- 目前值：`""`
- 類型：string (`"true"` 或 `""`)
- 注意：由系統管理；您通常不需要設定它

`navigationType`
- 用途：臨時開發變數；僅為方便而儲存
- 目前值：`""`
- 類型：string
- 注意：由系統管理；您通常不需要設定它

#### 媒體與顯示

`media.minImageWidth`
- 用途：最小圖片寬度（像素），用於過濾低品質圖片；只有寬度大於此值的圖片會被使用
- 目前值：`600`
- 類型：integer (像素)
- 效果：
  - 較低 (400–600)：允許更多圖片，品質風險較高；適合快速啟動
  - 中等 (600–800)：品質/數量平衡；預設建議
  - 較高 (800–1000)：品質較高，圖片較少；適合作品集/高階品牌
  - 非常高 (1000+)：頂級視覺品質，可用圖片極少
- 如何應用：變更後執行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 其他設定

（目前無其他欄位。）

`lastGitHead`
- 用途：生成時的最後一次 Git 提交 ID（用於增量更新）
- 目前值：`c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- 類型：string (Git 提交雜湊值)
- 效果：
  - 每次生成後自動維護
  - 用於偵測變更的檔案；手動編輯可能會影響增量行為
- 注意：通常由系統管理；若有必要，僅在提供有效雜湊值時才編輯

---

## 欄位總覽

| 欄位 | 類型 | 預設值 | 範例 | 應用指令 |
|---|---|---|---|---|
| `projectName` | string | `""` | `"My Project"` | `publish` |
| `projectDesc` | string | `""` | `"AI-powered website tool"` | `publish` |
| `projectLogo` | string | `""` | `"https://example.com/logo.png"` | `publish` |
| `projectId` | string | UUID | `"pg4d0000-0000-4000-a000-000000000000"` | `publish` |
| `projectSlug` | string | `"/"` | `"/"` | `publish` |
| `projectCover` | string | `""` | `"./assets/cover.png"` | `publish` |
| `pagePurpose` | array | `[]` | `["landingPage"]` | `clear && generate` |
| `targetAudienceTypes` | array | `[]` | `["customers"]` | `clear && generate` |
| `websiteScale` | string | `"standard"` | `"standard"` | `clear && generate` |
| `rules` | string | `""` | `"### Page Structure\n1. Hero section"` | `update` |
| `locale` | string | `"en"` | `"en"` | `clear && generate` |
| `translateLanguages` | array | `[]` | `["zh", "ja"]` | `translate` |
| `pagesDir` | string | `"./aigne/web-smith/pages"` | `"./aigne/web-smith/pages"` | `generate` |
| `sourcesPath` | array | `[]` | `["./README.md", "./docs"]` | `generate` |
| `defaultDatasources` | array | `["./media.md"]` | `["./media.md"]` | `update` |
| `media.minImageWidth` | integer | `800` | `800` | `update` |
| `appUrl` | string | `""` | `"https://example.com"` | `publish` |
| `lastGitHead` | string | `""` | `"c4a4d3db..."` | 自動 |
| `checkoutId` | string | `""` | `""` | 內部 |
| `shouldSyncAll` | string | `""` | `""` | 內部 |
| `navigationType` | string | `""` | `""` | 內部 |

**注意：** 有關詳細的允許值和描述，請參閱下方的[逐欄說明](#field-by-field-explanation)部分。

---

## 複製貼上範例

### 最小範例：單頁、僅英文

一個單頁英文網站的最小設定：

```yaml
configVersion: 1
projectName: My Project
projectDesc: "A simple landing page"
projectLogo: ""
projectId: pg4d1000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: ""
locale: en
translateLanguages: []
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: ""
```

**指令順序：**
```bash Generate Website icon=lucide:terminal
aigne web generate
```

---

### 標準範例：多頁、英文 + 日文

一個多頁網站的標準設定，包含英文和日文：

```yaml
configVersion: 1
projectName: My Project
projectDesc: "AI-powered website generation tool"
projectLogo: https://example.com/logo.png
projectId: pg4d2000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
  - saas
targetAudienceTypes:
  - customers
  - developers
websiteScale: standard
rules: |
  ### Page Structure Requirements
  1. Hero section must include clear value proposition
  2. Use positive, confident tone
  3. Include concrete case data
locale: en
translateLanguages:
  - ja
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
  - ./docs
  - ./CHANGELOG.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: https://example.com
```

**指令順序：**
```bash Generate Website icon=lucide:terminal
aigne web generate
aigne web translate
aigne web publish
```

**注意：** 版本將隨著破壞性變更而更新；將提供遷移說明。

---

## 如果出錯了

如果您的網站生成失敗或產生非預期的結果，請使用這些復原方法：

- **Git 還原：** 如果您正在使用版本控制，請還原到上一個可運作的設定：
  ```bash Run command icon=lucide:terminal
  git revert HEAD
  ```

- **全新重新生成：** 清除所有生成的檔案並從頭開始重新生成：
  ```bash Run command icon=lucide:terminal
  aigne web clear && aigne web generate
  ```

這會還原到一個乾淨的狀態，並根據目前的設定重新生成您的網站。

---

## 何時應該更改它？

### 功能調整

情境：從單頁升級到多頁
- 觸發：需要從單一頁面擴展為一個完整的網站
- 欄位：`websiteScale`
- 範例：
```yaml
# 之前
websiteScale: singlePage

# 之後
websiteScale: standard
```
- 應用：
  - 如果尚未生成任何內容：執行 `aigne web generate`
  - 如果已經生成：執行 `aigne web clear` 然後 `aigne web generate`

情境：更改網站類型
- 觸發：產品定位變更（例如，SaaS → 電子商務）
- 欄位：`pagePurpose`
- 範例：
```yaml
# 之前
pagePurpose:
  - saas

# 之後
pagePurpose:
  - ecommerce
```
- 應用：同情境 1

情境：調整目標受眾
- 觸發：受眾轉變（例如，消費者 → 企業）
- 欄位：`targetAudienceTypes`
- 範例：
```yaml
# 之前
targetAudienceTypes:
  - customers

# 之後
targetAudienceTypes:
  - businessOwners
  - developers
```
- 應用：同情境 1

### 適應

情境：新增新的資料來源
- 觸發：新增了 WebSmith 必須分析的新文件或內容。如果未新增路徑，之後的 `aigne web generate` 執行將無法讀取它。
- 欄位：`sourcesPath`
- 範例：
```yaml
# 之前
sourcesPath:
  - ./assets/documents

# 之後：新增新來源
sourcesPath:
  - ./assets/documents
  - ./docs/api
  - ./content/blog
```
- 應用：在填寫提示時，`aigne web generate` 會讀取

### 修復

情境：圖片品質不足
- 觸發：輸出中出現低品質圖片
- 欄位：`media.minImageWidth`
- 範例：
```yaml
# 之前：最小 600px
media:
  minImageWidth: 600

# 之後：最小 1000px
media:
  minImageWidth: 1000
```
- 應用：`aigne web update` 或 `aigne web generate`

情境：生成的內容不符預期
- 觸發：語氣/結構不如預期
- 欄位：`rules`
- 範例：
```yaml
# 之前：空白或太稀疏
rules: ""

# 之後：詳細指導
rules: |
  ### Page Structure Requirements
  1. Above the fold must include:
     * Clear product headline
     * Concise description (≤ 2 sentences)
     * Primary call‑to‑action

  2. Content organization:
     * Positive, confident tone
     * Include concrete case data
     * Avoid excessive marketing jargon
```
- 應用：
  - `aigne web update` 會讀取
  - 在填寫提示時，`aigne web generate` 會讀取
  - 注意：規則會隨每個提示一起發送

### 多語言

情境：新增一種新語言
- 欄位：`translateLanguages`
- 範例：
```yaml
# 之前：只有中文 + 英文
locale: zh
translateLanguages:
  - en

# 之後：新增法文和德文
locale: zh
translateLanguages:
  - en
  - fr
  - de
```
- 應用：`aigne web translate` 或 `aigne web update`

情境：更改主要語言
- 欄位：`locale`
- 範例：
```yaml
# 之前：中文為主要語言
locale: zh
translateLanguages:
  - en

# 之後：英文為主要語言
locale: en
translateLanguages:
  - zh
```
- 應用：執行 `aigne web clear` 然後 `aigne web generate`

### 基本資訊變更

情境：更新專案基本資訊
- 欄位：`projectName`, `projectDesc`, `projectLogo`, `projectCover`
- 範例：
```yaml
# 之前
projectName: "Old Project Name"
projectDesc: "Old description"
projectLogo: "Old Logo URL"

# 之後
projectName: "New Project Name"
projectDesc: "New description"
projectLogo: "New Logo URL"
projectCover: "./assets/images/new-cover.png"
```
- 應用：`aigne web publish` (其他指令會忽略這些)

情境：整合外部部署
- 欄位：`appUrl`
- 範例：
```yaml
# 之前
appUrl: ""

# 之後
appUrl: https://your-app.user.aigne.io
```
- 應用：僅 `aigne web publish`；`appUrl` 決定目標平台

### 驗證變更

- 檢查生成的頁面檔案，確認更新的值已存在。例如，更改 `projectName` 後，確保新名稱出現在預期的位置。

---

## 如果檔案損壞了怎麼辦？

### YAML 格式錯誤

情境：使用全形（中文）冒號
```yaml
projectName： "My Project"  # 錯：全形冒號
```
正確：
```yaml
projectName: "My Project"  # 對：ASCII 冒號
```
效果：
- YAML 解析失敗；`aigne web generate` 會顯示錯誤
- 指令中止；網站不會被生成
復原：
1. 將所有全形冒號替換為 ASCII `:`
2. 重新執行 `aigne web generate`

情境：不存在的欄位
```yaml
projectName: "My Project"
unknownField: "some value"
```
效果：
- CLI 會忽略無法識別的欄位而不報錯
- 檔案解析成功；欄位被忽略；生成不受影響
- 您必須驗證輸出是否符合預期
復原：
1. 檢查生成的輸出
2. 參考本指南以獲取有效的欄位名稱
3. 移除未知欄位

情境：縮排錯誤
```yaml
pagePurpose:
- landingPage  # 錯：缺少縮排
targetAudienceTypes:
  - customers  # 對：兩個空格的縮排
```
正確：
```yaml
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
```
效果：
- YAML 解析失敗；結構被誤讀
- 值可能會遺失或被錯誤解讀
復原：
1. 只使用空格（不要用 Tab），並保持一致的縮排（通常是兩個空格）
2. 確保陣列使用適當的 `-` 並有正確的縮排

情境：刪除關鍵欄位
```yaml
# 意外移除了 projectName
projectDesc: "Description"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
效果：
- 標題可能為空或使用預設值
- 某些功能可能無法如預期運作
- 解析成功但輸出品質下降
復原：
1. 如果可用，從 Git 歷史記錄還原
2. 執行 `aigne web init` 重新生成，然後合併自訂內容
3. 根據本指南填寫缺失的必填欄位

情境：值類型錯誤
`pagePurpose` 必須是陣列，而不是字串：
```yaml
# 錯
pagePurpose: landingPage

# 對
pagePurpose:
  - landingPage
```
`translateLanguages` 必須是陣列，而不是字串：
```yaml
# 錯
translateLanguages: en

# 對
translateLanguages:
  - en
```
效果：
- 當類型錯誤時，可能會使用預設值
- WebSmith 可能無法正確讀取值
- 輸出可能不符預期
復原：
1. 在本指南中確認正確的格式
2. 使用帶 `-` 的正確 YAML 陣列語法
3. 重新生成以驗證

### 偵測與復原

方法 1：在生成期間偵測
- 編輯後，執行 `aigne web generate`
- 系統會報告 YAML/格式錯誤並提供有用的訊息

方法 2：從備份還原
- 如果使用 Git，從歷史記錄還原
- 如果使用手動備份：
```bash Cp Config-backup-20240101.yaml .aigne/web-smith/config.yaml icon=lucide:terminal
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

方法 3：重新生成檔案
- 如果您無法修復它，執行 `aigne web init` 來重新建立它。先備份舊的 `config.yaml`，以便您可以合併自訂的值。

### 產品穩健性

根據 WebSmith 的行為：
1. 缺少檔案：明確的錯誤和執行 `aigne web init` 的指導
2. YAML 解析失敗：友善的錯誤訊息，不會崩潰
3. 未知欄位：靜默忽略；生成繼續；手動驗證結果
4. 錯誤的值類型：可能會使用預設值；解析繼續
5. 缺少可選欄位：應用預設值（例如，`locale` 預設為 "en"）

### 預防技巧

1. 對設定檔使用版本控制
2. 在重大編輯前進行備份
3. 偏好透過 CLI (`aigne web init`) 編輯，減少手動格式錯誤
4. 編輯後執行 `aigne web generate` 來驗證變更

---

## 預設值與優先順序

### 明確的預設值

以下欄位有明確的預設值：

- `locale`：預設為 `"en"` (英文)
- `websiteScale`：預設為 `"standard"` (7-12 頁)
- `pagesDir`：預設為 `"./aigne/web-smith/pages"`
- `translateLanguages`：預設為 `[]` (空陣列，無翻譯)
- `media.minImageWidth`：預設為 `800` (像素)

### 優先順序規則

設定的優先順序遵循此順序：

1. **明確的設定值** 具有最高優先權
2. **`rules` 會覆蓋預設值** (若有指定)；如果 `rules` 為空，WebSmith 會退回預設值
3. **缺少的值會退回預設值**；如果未指定或為空欄位，系統會使用其預設值

### i18n 退回行為

在生成多語言網站時：

- **主要語言 (`locale`)**：始終用作內容生成的基礎語言
- **翻譯語言 (`translateLanguages`)**：內容會從主要語言翻譯到每個目標語言
- **缺少翻譯時的退回**：如果翻譯失敗，系統會退回到主要語言的內容
- **停用 i18n**：要停用國際化，請將 `translateLanguages` 設為空陣列 `[]`

---

## 疑難排解

### 錯誤 1：「找不到設定檔」

**錯誤訊息：**
```
Config file not found: .aigne/web-smith/config.yaml
Please run 'aigne web init' to create the config file.
```

**原因：** 設定檔在預期位置不存在。

**修正：** 執行 `aigne web init` 以互動方式建立設定檔。

---

### 錯誤 2：「解析設定檔時出錯」

**錯誤訊息：**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因：** 設定檔中的 YAML 語法錯誤（例如，縮排不正確、冒號錯誤、缺少引號）。

**修正：**
1. 檢查錯誤中提到的行號
2. 驗證 YAML 語法（使用空格，而非 Tab；使用正確的冒號格式）
3. 使用 YAML 驗證器驗證檔案
4. 重新執行 `aigne web generate`

---

### 錯誤 3：從 `standard` 切換到 `singlePage` 而未執行 `clear`

**錯誤訊息：**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因：** 將 `websiteScale` 從 `standard` 更改為 `singlePage`，但未先執行 `clear`，導致結構衝突。

**修正：**
1. 執行 `aigne web clear` 以移除舊的生成檔案
2. 執行 `aigne web generate` 以新規模重新生成
3. **在更改 `websiteScale` 時，總是在 `generate` 之前執行 `clear`**

---

### 錯誤 4：「無效的地區代碼」

**錯誤訊息：**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因：** 在 `locale` 或 `translateLanguages` 中使用了不支援的語言代碼。

**修正：**
1. 檢查支援的語言代碼列表
2. 使用有效的 IETF 語言代碼（例如，`en`、`zh`、`ja`）
3. 更新設定並重新執行指令

---

### 錯誤 5：「找不到資料來源」

**錯誤訊息：**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**原因：** `sourcesPath` 為空，或所有指定路徑不存在或無法存取。

**修正：**
1. 驗證 `sourcesPath` 中的檔案/目錄是否存在
2. 檢查檔案權限（確保檔案可讀）
3. 將有效路徑新增到 `sourcesPath`（例如，`["./README.md", "./docs"]`）
4. 重新執行 `aigne web generate`

---

## 最佳實踐

### `sourcesPath` 最佳實踐

**好的資料夾佈局：**

```
project/
├── README.md           # ✅ 包含
├── docs/               # ✅ 包含
│   ├── getting-started.md
│   └── api-reference.md
├── CHANGELOG.md        # ✅ 包含
└── assets/
    ├── images/         # ✅ 包含 (用於圖片參考)
    └── recordings/     # ❌ 略過 (除非需要)
```

**不好的資料夾佈局：**

```
project/
├── node_modules/       # ❌ 不要包含 (太大)
├── dist/               # ❌ 不要包含 (生成的檔案)
├── .git/               # ❌ 不要包含 (版本控制)
└── test/               # ❌ 不要包含 (測試檔案)
```

**最佳實踐：**

1. **包含必要的說明文件：**
   - `README.md` (專案概覽)
   - `docs` 目錄 (說明文件)
   - `CHANGELOG.md` (版本歷史)

2. **包含專案設定：**
   - `aigne.yaml` (專案設定)
   - 與您的專案相關的設定檔

3. **包含圖片目錄：**
   - `assets/images/` (用於圖片參考)
   - 注意：圖片不會被分析，但可以被引用

4. **避免大型目錄：**
   - `node_modules/` (太大，不必要)
   - `dist/` 或 `build/` (生成的檔案)
   - `.git/` (版本控制)

5. **Glob 模式支援：**
   - **目前不支援** 在 `sourcesPath` 中使用 Glob 模式
   - 使用明確的檔案路徑或目錄路徑
   - 範例：`["./README.md", "./docs"]` ✅
   - 範例：`["./docs/**/*.md"]` ❌ (不支援)

6. **忽略檔案：**
   - **目前不支援** `.aigneignore`
   - 從 `sourcesPath` 中手動排除不必要的檔案/目錄

---

### `rules` 最佳實踐

**6 點登陸頁面骨架：**

將此骨架複製到您的 `rules` 欄位並進行自訂：

```yaml
rules: |
  ### I. Core Messaging & Strategy
  1. Above the fold must answer: What it is, Who it's for, Why it's different, Primary action
  2. Establish credibility with proof: Show demo, social proof, customer logos
  3. Define clear CTA: Primary action aligned with audience, persistent mobile CTA
  
  ### II. Content Organization
  4. Use positive, confident tone: Avoid marketing jargon, focus on benefits
  5. Include concrete data: Case studies, metrics, real examples
  6. Maintain consistency: Product naming, terminology, structure
```

**語氣指導：**

- **對客戶：** 明確的益處、簡單的語言、信任信號
- **對開發者：** 技術準確性、程式碼範例、API 參考
- **對企業主：** 專注於投資回報率、節省時間的益處、專業語氣

**CTA 指導：**

- **主要 CTA：** 您希望使用者採取的主要行動（例如，「生成我的網站」）
- **次要 CTAs：** 放在較不顯眼的位置（例如，「在 GitHub 上查看」）
- **行動裝置：** 保持一個持續可見的主要 CTA

**最佳實踐：**

1. **要具體：** 包含具體要求，而非模糊的建議
2. **使用結構：** 用標題和項目符號組織規則
3. **與受眾對齊：** 將語氣與 `targetAudienceTypes` 匹配
4. **專注於成果：** 描述您想要的，而不是如何實現它
5. **保持專注：** 避免過長的規則（為效能考慮，目標 < 2KB）
6. **測試和迭代：** 根據生成的內容品質調整規則

---

## 常見問題

Q1：變更未生效
- 可能原因：檔案未儲存、YAML 錯誤，或您需要重新生成
- 修正：儲存、修正 YAML、執行 `aigne web generate`，並驗證輸出是否包含更新的值

Q2：如何新增語言？
- 步驟：
  1. 在 `translateLanguages` 下新增代碼
  2. 執行 `aigne web generate`
  3. 檢查 `.aigne/web-smith/pages/workspace/{lang}/`
- 範例：
```yaml
locale: zh
translateLanguages:
  - en
  - ja
  - fr  # 新增的法文
```

Q3：生成的內容不符預期
- 原因：`rules` 不足、`targetAudienceTypes` 不符，或 `sourcesPath` 稀疏
- 修正：豐富 `rules`、調整受眾、新增更多來源

Q4：如何修正格式錯誤？
- 常見問題：全形冒號、縮排不一致、陣列格式錯誤。
- 修正：遵循第 6 節的指導，若有需要從備份還原，並重新生成以驗證。