# 配置参考

## 什么是配置文件？

### 基础知识

`config.yaml` 是 WebSmith 的核心配置文件。它使用 YAML 格式，存储了 WebSmith 生成、翻译和发布网站所需的所有参数。

![.aigne/web-smith/config.yaml 的引导式审查界面](../../../assets/images/web-smith-config.png)

**文件详情**
- **文件名：** `config.yaml` (固定)
- **位置：** `.aigne/web-smith/config.yaml`，相对于项目根目录
- **格式：** YAML (UTF-8)

---

## 配置文件有什么作用？

### 核心功能

配置文件是 WebSmith 的中央参数载体。每次 WebSmith 运行 `generate` 命令时，它都会读取此文件，并根据其设置生成网站结构和内容。

主要用途：
- 定义网站类型和目标受众
- 控制内容生成策略和写作风格
- 决定网站规模和页面结构
- 配置多语言支持
- 设置部署参数

### 功能分组

字段按功能分组如下：

#### 第 1 组：项目基础信息

用于品牌和 SEO 的基本标识符和展示信息。

字段：`projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

用途：定义名称、描述、徽标、标识符等。影响页面标题、导航菜单、SEO 元标签和社交分享。

#### 第 2 组：网站策略

定义网站类型、基调、规模和生成策略。这控制了 WebSmith 如何生成内容。

字段：`pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

用途：
- `pagePurpose`：定义网站类型（例如，落地页、电子商务、SaaS），影响组件和内容组织
- `targetAudienceTypes`：定义受众（例如，最终用户、开发者、企业主），影响 WebSmith 的基调、复杂度和示例
- `websiteScale`：定义网站规模（单页 vs 多页），控制页面数量
- `rules`：关于结构、内容和风格的详细指导

#### 第 3 组：语言

配置语言版本以支持多语言网站。

字段：`locale`, `translateLanguages`

用途：定义主要语言和翻译目标。每种语言都会生成一个完整的网站结构。

#### 第 4 组：数据源

指定 WebSmith 分析的数据源，作为页面生成的素材和参考。

字段：`sourcesPath`, `defaultDatasources`

用途：
- `sourcesPath`：WebSmith 分析的目录或文件（Markdown、YAML、图像等）。这直接决定了内容的质量、准确性和相关性。
- `defaultDatasources`：在命令运行时注入到每个页面的通用数据源（例如，包含图像位置和描述的 `media.md`）

#### 第 5 组：输出与部署

配置输出路径和部署参数。

字段：`pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

用途：
- `pagesDir`：生成的页面文件的写入位置
- `appUrl`：已部署的网站 URL，影响链接和 SEO
- `checkoutId`, `shouldSyncAll`, `navigationType`：开发期间使用的临时变量；通常不需要您管理它们

#### 第 6 组：媒体与展示

配置图像质量和相关的展示参数。

字段：`media.minImageWidth`, `lastGitHead`

用途：
- `media.minImageWidth`：用于过滤低质量资产的最小图像宽度
- `lastGitHead`：用于增量更新的最后一次 Git 提交 ID

---

## 配置文件是如何创建的？

### 生成方法

使用以下命令：

```bash Init icon=lucide:terminal
aigne web init
```

此命令会启动一个交互式向导来填写：

- 网站类型 (`pagePurpose`)：主要目的（可多选）
- 目标受众 (`targetAudienceTypes`)：网站的目标用户（可多选）
- 网站规模 (`websiteScale`)：页面数量
- 主要语言 (`locale`)
- 翻译语言 (`translateLanguages`)（可多选）
- 输出目录 (`pagesDir`)
- 源路径 (`sourcesPath`)（可多条目）
- 自定义规则 (`rules`)（可选）

完成后，文件将保存到 `.aigne/web-smith/config.yaml`。

### 真实配置示例

以下是 AIGNE WebSmith 项目的实际配置：

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

### 字段逐一解释

基于上述真实配置，以下是每个字段的作用：

#### 项目基础信息

`projectName`
- 用途：显示在页面 `<title>`、导航和网站品牌中的名称
- 当前值：`AIGNE WebSmith`
- 类型：字符串
- 影响：
  - 更改名称会更新所有页面的标题和导航标签
  - 保持简洁；为便于阅读和 SEO，建议在 50 个字符以内
- 如何应用：更改后运行 `aigne web publish`

`projectDesc`
- 用途：用于 SEO 元数据（`<meta name="description">`）和社交分享的项目描述
- 当前值：`"AI-powered website generation tool built on the AIGNE Framework"`
- 类型：字符串
- 影响：
  - 更新页面和社交分享中的元描述
  - 为适应搜索摘要，建议在 150 个字符以内
  - 包含 SEO 关键词
- 如何应用：更改后运行 `aigne web publish`

`projectLogo`
- 用途：用于页眉导航、网站图标（favicon）和社交缩略图的徽标
- 当前值：`https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- 类型：字符串（URL 或路径）
- 影响：
  - 切换 URL/路径会更新整个网站的徽标
  - 支持：HTTP/HTTPS URL 或相对路径（例如，`./assets/images/logo.svg`）
  - 为获得清晰显示效果，建议使用 PNG 或 SVG 格式
- 如何应用：更改后运行 `aigne web publish`

`projectId`
- 用途：唯一的项目标识符，WebSmith 服务用它来关联部署、历史记录和数据源
- 当前值：`pg4d0000-0000-4000-a000-000000000000` (UUID)
- 类型：字符串 (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- 影响：
  - 更改为新的 UUID 会使系统认为这是一个新项目，这可能导致：
    - 与之前部署链接的关联中断
    - 失去与项目历史的联系
    - 失去数据源关联
- 如何应用：更改后运行 `aigne web publish`

`projectSlug`
- 用途：URL 路径前缀，影响部署路径和内部链接
- 当前值：`/` (根目录)
- 类型：字符串（URL 路径）
- 影响示例：
  - `/`：网站位于根目录，例如 `https://example.com/`
  - `/portfolio`：网站位于 `https://example.com/portfolio/`
  - `/docs`：网站位于 `https://example.com/docs/`
  - 更改会更新所有内部链接和部署路径
- 如何应用：更改后运行 `aigne web publish`

`projectCover`
- 用途：用于预览和社交分享（如 Open Graph、Twitter Card 等）的网站封面图片
- 当前值：`.aigne/web-smith/cover.png`
- 类型：字符串（文件路径）
- 影响：
  - 更改路径会更新社交分享时的预览图片
  - 使用高质量图片（至少 1200×630）
  - 格式：PNG、JPG/JPEG、WebP 等
- 如何应用：更改后运行 `aigne web publish`

#### 网站策略

`pagePurpose`
- 用途：定义主要目的；直接影响生成策略和页面结构
- 当前值：`[landingPage]` (数组)
- 类型：数组（可多选）
- 选项与效果：
  - `landingPage` (当前)：以转化为重点的落地页；生成英雄区、功能介绍、行为召唤、常见问题等
  - `ecommerce`：在线商店；生成商品目录、购物车、结账、评论等
  - `saas`：SaaS 产品网站；生成功能介绍、定价、演示、入门引导等
  - `portfolio`：作品集网站；生成视觉布局、画廊、案例研究等
  - `corporate`：公司网站；生成公司概览、服务、团队、联系方式等
  - `blog`：博客；生成内容结构、SEO、分享、存档等
  - `nonprofit`：非营利组织；生成使命、捐赠流程、志愿者注册等
  - `education`：教育；生成课程列表、学习路径、进度跟踪等

`targetAudienceTypes`
- 用途：定义目标受众；直接影响基调、复杂度和示例选择
- 当前值：`[customers]` (数组)
- 类型：数组（可多选）
- 选项与效果：
  - `customers` (当前)：最终用户/客户；语言简单，强调易用性和成果；增加信任信号和用户故事
  - `businessOwners`：企业主/创始人；关注投资回报率和商业价值；专业基调；包含商业案例和回报分析
  - `marketers`：营销团队；关注 KPI 和品牌；包含营销工具和分析
  - `designers`：设计师；强调视觉和设计展示；美学和灵感；包含设计案例和视觉工具
  - `developers`：开发者/技术用户；技术细节、代码示例、API 文档；注重准确性和实现
  - `investors`：投资者/利益相关者；增长指标、市场机会、财务前景；商业计划和市场数据
  - `jobSeekers`：求职者；关注文化、成长、福利；职位列表和公司文化
  - `students`：学生/学习者；教学基调、分步指导、进度跟踪；教程和课程材料
  - `generalPublic`：普通/混合受众；语言易于理解，多个入口点，广泛吸引力
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`websiteScale`
- 用途：定义网站规模，控制页面数量和导航复杂性
- 当前值：`singlePage`
- 类型：字符串（单选）
- 选项与效果：
  - `singlePage` (当前)：单页网站；所有部分都在一个可滚动的页面上（英雄区、功能、常见问题、行为召唤等）；适合快速启动/MVP
  - `minimal`：2–6 页；主页、关于、服务/产品、联系方式等；小型企业/简单网站
  - `standard`：7–12 页；包含 minimal 的所有内容，外加作品集/博客、团队、常见问题、定价等；专业网站、作品集、小型电商（推荐）
  - `comprehensive`：12 页以上；包含 standard 的所有内容，外加详细的服务页面、案例研究、资源中心等；大型/复杂/内容丰富的网站
  - `aiDecide`：让 WebSmith 根据类型、受众和仓库分析来决定规模；考虑业务需求、内容量和维护能力
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`rules`
- 用途：关于结构、内容和风格的详细生成指导（Markdown 格式）。这是 WebSmith 最重要的指导，直接影响质量和用户体验。
- 当前值：一个包含详细指导的多行代码块（见上例），包括：
  - 核心信息与策略
  - 在“首屏”回答关键问题
  - 用证据建立信誉
  - 定义明确的行为召唤
- 类型：多行字符串（支持 Markdown）
- 影响：
  - 空白或稀疏的规则：WebSmith 会回退到默认设置，可能不完全符合您的需求
  - 详细的规则：WebSmith 会遵循您的指导来确定结构、组织和基调
  - 更改：WebSmith 会根据新规则重新生成，影响章节和表达方式
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 语言

`locale`
- 用途：用于基础内容生成的主要网站语言
- 当前值：`en`
- 类型：字符串
- 支持的语言代码：标准 IETF 代码，如 `en`、`zh`、`zh-TW`、`ja`、`ko`、`fr`、`de`、`es`、`pt`、`ru`、`it`、`ar` 等。
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`translateLanguages`
- 用途：要翻译的目标语言列表；每种语言都会生成一个完整的网站结构
- 当前值：`[zh, zh-TW, ja]`
- 类型：数组（可多选）
- 支持的代码：与 `locale` 相同（但不能包含 `locale` 本身）
- 每种语言的效果：
  - `zh`：生成一个完整的简体中文网站
  - `zh-TW`：生成一个完整的繁体中文网站
  - `ja`：生成一个完整的日文网站
  - 其他语言行为类似；每种语言都会生成一个独立的网站结构
- 如何应用：更改后运行 `aigne web translate`

#### 数据源

`sourcesPath`
- 用途：WebSmith 引擎分析的目录/文件（数组）。WebSmith 仅使用这些作为生成网站内容的参考。这直接决定了质量、准确性和相关性。
- 当前值：
  ```yaml
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
  ```
- 类型：数组（路径）
- 重要性：
  - 内容质量的主要决定因素：仅使用这些源作为参考
  - 建议：
    - 包含主要文档和自述文件
    - 包含重要的项目信息来源
    - 保持源文件准确且最新
    - 定期更新以匹配项目状态
- 影响：
  - 添加路径：WebSmith 分析更多材料，通常能提高质量
  - 删除路径：WebSmith 停止分析它们，可能会丢失信息
  - 路径类型：
    - 目录（例如，`./assets/documents`）：递归分析
    - 文件（例如，`./README.md`）：直接分析
    - 支持的类型：`.md`, `.yaml`/`.yml`, `.json`, `.txt` 等。
    - 图像目录：图像不被分析，但可以被引用
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

`defaultDatasources`
- 用途：自动注入到每个页面上下文的数据源（例如，媒体、联系信息）。这些在每次命令运行时都会添加，但并非所有资源都会完全内联；适用于像 `media.md` 这样的资源描述。
- 当前值：`[./media.md]`
- 类型：数组（文件路径）
- 影响：
  - 添加：新包含的通用内容（品牌信息、共享片段等）
  - 删除：不再注入
  - 适用于：`media.md`（图像位置和描述）、共享的联系/品牌信息
  - 支持：`.md`、`.yaml`/`.yml`、`.json`
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 输出与部署

`pagesDir`
- 用途：生成的网站文件（例如，`page.yaml`、`_navigations.yaml`）的输出目录
- 当前值：`.aigne/web-smith/pages`
- 类型：字符串（路径）
- 影响：
  - 更改（例如，改为 `./output/pages`）会将未来的输出移动到那里
  - 为便于移植，建议使用相对路径
  - 如果目录不存在，会自动创建
- 如何应用：未来的生成操作会写入新目录

`appUrl`
- 用途：网站部署 URL；决定网站发布到何处
- 当前值：`https://mhevtaeg.user.aigne.io`
- 类型：字符串（URL）
- 影响：
  - 更改为另一个 URL 会发布到新的目标
  - 必须包含协议；如果缺少，会自动添加 `https://`
  - 在确定最终域名后设置，以避免频繁更改
- 如何应用：仅由 `aigne web publish` 使用；其他命令会忽略它

`checkoutId`
- 用途：临时开发变量；仅为方便而存储
- 当前值：`""`
- 类型：字符串
- 注意：由系统管理；您通常不需要设置它

`shouldSyncAll`
- 用途：临时开发变量；仅为方便而存储
- 当前值：`""`
- 类型：字符串（`"true"` 或 `""`）
- 注意：由系统管理；您通常不需要设置它

`navigationType`
- 用途：临时开发变量；仅为方便而存储
- 当前值：`""`
- 类型：字符串
- 注意：由系统管理；您通常不需要设置它

#### 媒体与展示

`media.minImageWidth`
- 用途：用于过滤低质量图像的最小图像宽度（像素）；只有比此宽度更宽的图像才会被使用
- 当前值：`600`
- 类型：整数（像素）
- 效果：
  - 较低（400–600）：允许更多图像，质量风险较低；适合快速启动
  - 中等（600–800）：平衡质量/数量；默认推荐
  - 较高（800–1000）：质量更高，图像更少；适合作品集/高端品牌
  - 非常高（1000+）：顶级视觉质量，可用图像更少
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 其他配置

（当前没有其他字段。）

`lastGitHead`
- 用途：生成时的最后一次 Git 提交 ID（用于增量更新）
- 当前值：`c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- 类型：字符串（Git 提交哈希值）
- 效果：
  - 每次生成后自动维护
  - 用于检测已更改的文件；手动编辑可能会影响增量行为
- 注意：通常由系统管理；仅在必要时使用有效的哈希值进行编辑

---

## 字段概览

| 字段 | 类型 | 默认值 | 示例 | 应用命令 |
|---|---|---|---|---|
| `projectName` | 字符串 | `""` | `"My Project"` | `publish` |
| `projectDesc` | 字符串 | `""` | `"AI-powered website tool"` | `publish` |
| `projectLogo` | 字符串 | `""` | `"https://example.com/logo.png"` | `publish` |
| `projectId` | 字符串 | UUID | `"pg4d0000-0000-4000-a000-000000000000"` | `publish` |
| `projectSlug` | 字符串 | `"/"` | `"/"` | `publish` |
| `projectCover` | 字符串 | `""` | `"./assets/cover.png"` | `publish` |
| `pagePurpose` | 数组 | `[]` | `["landingPage"]` | `clear && generate` |
| `targetAudienceTypes` | 数组 | `[]` | `["customers"]` | `clear && generate` |
| `websiteScale` | 字符串 | `"standard"` | `"standard"` | `clear && generate` |
| `rules` | 字符串 | `""` | `"### Page Structure\n1. Hero section"` | `update` |
| `locale` | 字符串 | `"en"` | `"en"` | `clear && generate` |
| `translateLanguages` | 数组 | `[]` | `["zh", "ja"]` | `translate` |
| `pagesDir` | 字符串 | `"./aigne/web-smith/pages"` | `"./aigne/web-smith/pages"` | `generate` |
| `sourcesPath` | 数组 | `[]` | `["./README.md", "./docs"]` | `generate` |
| `defaultDatasources` | 数组 | `["./media.md"]` | `["./media.md"]` | `update` |
| `media.minImageWidth` | 整数 | `800` | `800` | `update` |
| `appUrl` | 字符串 | `""` | `"https://example.com"` | `publish` |
| `lastGitHead` | 字符串 | `""` | `"c4a4d3db..."` | 自动 |
| `checkoutId` | 字符串 | `""` | `""` | 内部 |
| `shouldSyncAll` | 字符串 | `""` | `""` | 内部 |
| `navigationType` | 字符串 | `""` | `""` | 内部 |

**注意：** 有关详细的允许值和描述，请参阅下面的 [字段逐一解释](#field-by-field-explanation) 部分。

---

## 复制粘贴示例

### 最小示例：单页，仅英文

一个单页英文网站的最小配置：

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

**命令序列：**
```bash 生成网站 icon=lucide:terminal
aigne web generate
```

---

### 标准示例：多页，英文 + 日文

一个多页网站的标准配置，支持英文和日文：

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

**命令序列：**
```bash 生成网站 icon=lucide:terminal
aigne web generate
aigne web translate
aigne web publish
```

**注意：** 版本将在有重大变更时更新；届时将提供迁移说明。

---

## 如果出现问题

如果您的网站生成失败或产生意外结果，请使用这些恢复方法：

- **Git 还原：** 如果您正在使用版本控制，请恢复到上一个可用的配置：
  ```bash 运行命令 icon=lucide:terminal
  git revert HEAD
  ```

- **清理后重新生成：** 清除所有生成的文件并从头开始重新生成：
  ```bash 运行命令 icon=lucide:terminal
  aigne web clear && aigne web generate
  ```

这将恢复到一个干净的状态，并根据当前配置重新生成您的网站。

---

## 什么时候应该修改它？

### 功能调整

场景：从单页升级到多页
- 触发条件：需要从单个页面扩展为完整网站
- 字段：`websiteScale`
- 示例：
```yaml
# 之前
websiteScale: singlePage

# 之后
websiteScale: standard
```
- 应用：
  - 如果尚未生成任何内容：运行 `aigne web generate`
  - 如果已经生成：运行 `aigne web clear` 然后运行 `aigne web generate`

场景：更改网站类型
- 触发条件：产品定位变更（例如，SaaS → 电商）
- 字段：`pagePurpose`
- 示例：
```yaml
# 之前
pagePurpose:
  - saas

# 之后
pagePurpose:
  - ecommerce
```
- 应用：与场景 1 相同

场景：调整目标受众
- 触发条件：受众变化（例如，消费者 → 企业）
- 字段：`targetAudienceTypes`
- 示例：
```yaml
# 之前
targetAudienceTypes:
  - customers

# 之后
targetAudienceTypes:
  - businessOwners
  - developers
```
- 应用：与场景 1 相同

### 适应性调整

场景：添加新的数据源
- 触发条件：添加了 WebSmith 必须分析的新文档或内容。如果未添加路径，后续的 `aigne web generate` 运行将无法读取它。
- 字段：`sourcesPath`
- 示例：
```yaml
# 之前
sourcesPath:
  - ./assets/documents

# 之后：添加新源
sourcesPath:
  - ./assets/documents
  - ./docs/api
  - ./content/blog
```
- 应用：在填写提示时，`aigne web generate` 会读取此字段

### 修复问题

场景：图像质量不足
- 触发条件：输出中出现低质量图像
- 字段：`media.minImageWidth`
- 示例：
```yaml
# 之前：最小 600px
media:
  minImageWidth: 600

# 之后：最小 1000px
media:
  minImageWidth: 1000
```
- 应用：`aigne web update` 或 `aigne web generate`

场景：生成的内容不符合预期
- 触发条件：基调/结构不符合期望
- 字段：`rules`
- 示例：
```yaml
# 之前：空或过于稀疏
rules: ""

# 之后：详细指导
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
- 应用：
  - 由 `aigne web update` 读取
  - 在填写提示时，由 `aigne web generate` 读取
  - 注意：规则会随每个提示一起发送

### 多语言

场景：添加新语言
- 字段：`translateLanguages`
- 示例：
```yaml
# 之前：仅中文 + 英文
locale: zh
translateLanguages:
  - en

# 之后：添加法语和德语
locale: zh
translateLanguages:
  - en
  - fr
  - de
```
- 应用：`aigne web translate` 或 `aigne web update`

场景：更改主要语言
- 字段：`locale`
- 示例：
```yaml
# 之前：中文为主要语言
locale: zh
translateLanguages:
  - en

# 之后：英文为主要语言
locale: en
translateLanguages:
  - zh
```
- 应用：运行 `aigne web clear` 然后运行 `aigne web generate`

### 基本信息变更

场景：更新项目基础信息
- 字段：`projectName`, `projectDesc`, `projectLogo`, `projectCover`
- 示例：
```yaml
# 之前
projectName: "Old Project Name"
projectDesc: "Old description"
projectLogo: "Old Logo URL"

# 之后
projectName: "New Project Name"
projectDesc: "New description"
projectLogo: "New Logo URL"
projectCover: "./assets/images/new-cover.png"
```
- 应用：`aigne web publish`（其他命令会忽略这些字段）

场景：集成外部部署
- 字段：`appUrl`
- 示例：
```yaml
# 之前
appUrl: ""

# 之后
appUrl: https://your-app.user.aigne.io
```
- 应用：仅 `aigne web publish`；`appUrl` 决定目标平台

### 验证变更

- 检查生成的页面文件，确认更新后的值已存在。例如，更改 `projectName` 后，确保新名称出现在预期位置。

---

## 如果文件损坏了怎么办？

### YAML 格式错误

场景：使用全角（中文）冒号
```yaml
projectName： "My Project"  # 错误：全角冒号
```
正确：
```yaml
projectName: "My Project"  # 正确：ASCII 冒号
```
影响：
- YAML 解析失败；`aigne web generate` 会显示错误
- 命令中止；网站不会被生成
恢复：
1. 将所有全角冒号替换为 ASCII `:`
2. 重新运行 `aigne web generate`

场景：不存在的字段
```yaml
projectName: "My Project"
unknownField: "some value"
```
影响：
- CLI 会忽略无法识别的字段且不报错
- 文件解析成功；字段被忽略；生成不受影响
- 您必须验证输出是否符合预期
恢复：
1. 检查生成的输出
2. 查阅本指南以获取有效的字段名称
3. 删除未知字段

场景：缩进错误
```yaml
pagePurpose:
- landingPage  # 错误：缺少缩进
targetAudienceTypes:
  - customers  # 正确：两个空格的缩进
```
正确：
```yaml
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
```
影响：
- YAML 解析失败；结构被误读
- 值可能丢失或被错误解释
恢复：
1. 只使用空格（不要用 Tab 键）并保持一致的缩进（通常是两个空格）
2. 确保数组使用正确的 `-` 并有正确的缩进

场景：删除关键字段
```yaml
# 意外删除了 projectName
projectDesc: "Description"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
影响：
- 标题可能为空或使用默认值
- 某些功能可能无法按预期工作
- 解析成功但输出质量下降
恢复：
1. 如果可用，从 Git 历史记录中恢复
2. 运行 `aigne web init` 重新生成，然后合并自定义内容
3. 根据本指南填写缺失的必填字段

场景：错误的值类型
`pagePurpose` 必须是数组，而不是字符串：
```yaml
# 错误
pagePurpose: landingPage

# 正确
pagePurpose:
  - landingPage
```
`translateLanguages` 必须是数组，而不是字符串：
```yaml
# 错误
translateLanguages: en

# 正确
translateLanguages:
  - en
```
影响：
- 当类型错误时，可能会使用默认值
- WebSmith 可能无法正确读取值
- 输出可能不符合预期
恢复：
1. 在本指南中确认正确的格式
2. 使用正确的 YAML 数组语法，带 `-`
3. 重新生成以进行验证

### 检测与恢复

方法 1：在生成期间检测
- 编辑后，运行 `aigne web generate`
- 系统会报告 YAML/格式错误并提供有用的信息

方法 2：从备份中恢复
- 如果使用 Git，从历史记录中恢复
- 如果使用手动备份：
```bash Cp Config-backup-20240101.yaml .aigne/web-smith/config.yaml icon=lucide:terminal
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

方法 3：重新生成文件
- 如果无法修复，运行 `aigne web init` 重新创建它。首先备份旧的 `config.yaml`，以便您可以合并自定义值。

### 产品稳健性

根据 WebSmith 的行为：
1. 文件缺失：明确的错误和运行 `aigne web init` 的指导
2. YAML 解析失败：友好的错误提示，不会导致程序崩溃
3. 未知字段：静默忽略；生成继续；手动验证结果
4. 错误的值类型：可能会使用默认值；解析继续
5. 缺失可选字段：应用默认值（例如，`locale` 默认为 "en"）

### 预防技巧

1. 对配置文件使用版本控制
2. 在进行重大编辑前进行备份
3. 优先通过 CLI（`aigne web init`）进行编辑，减少手动格式错误
4. 编辑后通过运行 `aigne web generate` 来验证更改

---

## 默认值与优先级

### 显式默认值

以下字段具有显式默认值：

- `locale`：默认为 `"en"` (英文)
- `websiteScale`：默认为 `"standard"` (7-12 页)
- `pagesDir`：默认为 `"./aigne/web-smith/pages"`
- `translateLanguages`：默认为 `[]` (空数组，无翻译)
- `media.minImageWidth`：默认为 `800` (像素)

### 优先级规则

配置优先级遵循以下顺序：

1. **显式配置值** 具有最高优先级
2. **`rules` 覆盖默认值**（如果已指定）；如果 `rules` 为空，WebSmith 会回退到默认值
3. **缺失值回退到默认值**；如果未指定或字段为空，系统将使用其默认值

### i18n 回退行为

在生成多语言网站时：

- **主要语言 (`locale`)**：始终用作内容生成的基础语言
- **翻译语言 (`translateLanguages`)**：内容从主要语言翻译为每个目标语言
- **翻译缺失时的回退**：如果翻译失败，系统会回退到主要语言的内容
- **禁用 i18n**：要禁用国际化，请将 `translateLanguages` 设置为空数组 `[]`

---

## 相关指南

<x-cards>
  <x-card data-title="问题排查" data-icon="lucide:wrench" data-href="./reference-trouble-shooting">
    配置、生成、发布和翻译的常见问题解决方案。包含错误消息、原因和详细修复步骤。
  </x-card>
  <x-card data-title="准备素材" data-icon="lucide:folder-check" data-href="./reference-prepare-materials">
    组织源文件和准备素材的最佳实践。学习如何收集简报、文档和资产以实现高质量生成。
  </x-card>
  <x-card data-title="创建网站" data-icon="lucide:rocket" data-href="./guides-create-website">
    创建网站的分步指南。包含编写有效规则和选择正确配置的详细示例。
  </x-card>
</x-cards>