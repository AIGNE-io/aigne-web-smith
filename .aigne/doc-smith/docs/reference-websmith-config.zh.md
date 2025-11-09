# WebSmith 配置

## 什么是配置文件？

### 基本概念

`config.yaml` 是 WebSmith 的核心配置文件。它采用 YAML 格式，存储了 WebSmith 生成网站所需的所有参数。

**文件详情**：
- **文件名**：`config.yaml` (固定名称)
- **位置**：`.aigne/web-smith/config.yaml` (相对于项目根目录)
- **格式**：YAML (UTF-8 编码)

---

## 配置文件有什么作用？

### 核心功能

该配置文件是 WebSmith 的中央参数载体。每当 AI Agent 运行 `generate` 命令时，它都会读取此文件，并根据其设置生成网站结构和内容。

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

目的：定义名称、描述、徽标、标识符等。影响页面标题、导航菜单、SEO 元标签和社交分享。

#### 第 2 组：网站策略

定义网站类型、基调、规模和生成策略。这控制了 AI 如何生成内容。

字段：`pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

目的：
- `pagePurpose`：定义网站类型（例如，落地页、电子商务、SaaS），影响组件和内容组织
- `targetAudienceTypes`：定义受众（例如，最终用户、开发者、企业主），影响 AI 的语气、复杂度和示例
- `websiteScale`：定义网站规模（单页 vs 多页），控制页面数量
- `rules`：关于结构、内容和风格的详细指导

#### 第 3 组：语言

配置语言版本以支持多语言网站。

字段：`locale`, `translateLanguages`

目的：定义主要语言和翻译目标。每种语言都会生成一个完整的网站结构。

#### 第 4 组：数据源

指定 AI 作为页面生成素材和参考进行分析的数据来源。

字段：`sourcesPath`, `defaultDatasources`

目的：
- `sourcesPath`：供 AI 分析的目录或文件（Markdown、YAML、图片等）。这直接决定了内容的质量、准确性和相关性。
- `defaultDatasources`：在命令运行时注入到每个页面的通用数据源（例如，包含图片位置和描述的 `media.md`）

#### 第 5 组：输出与部署

配置输出路径和部署参数。

字段：`pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

目的：
- `pagesDir`：生成的页面文件的写入位置
- `appUrl`：部署的网站 URL，影响链接和 SEO
- `checkoutId`, `shouldSyncAll`, `navigationType`：开发过程中使用的临时变量；您通常不需要管理它们

#### 第 6 组：媒体与展示

配置图片质量和相关的展示参数。

字段：`media.minImageWidth`, `lastGitHead`

目的：
- `media.minImageWidth`：过滤低质量素材的最小图片宽度
- `lastGitHead`：用于增量更新的最后一次 Git 提交 ID

---

## 如何创建配置文件？

### 生成方法

使用以下命令：

```bash
aigne web init
```

此命令会启动一个交互式向导来填写：

- 网站类型 (`pagePurpose`)：主要目的（多选）
- 目标受众 (`targetAudienceTypes`)：网站为谁服务（多选）
- 网站规模 (`websiteScale`)：页面数量
- 主要语言 (`locale`)
- 翻译语言 (`translateLanguages`)（多选）
- 输出目录 (`pagesDir`)
- 源路径 (`sourcesPath`)（多条目）
- 自定义规则 (`rules`)（可选）

完成后，文件将保存到 `.aigne/web-smith/config.yaml`。

### 实际配置示例

以下是 AIGNE WebSmith 项目的实际配置：

```yaml config.yaml icon=logos:yaml
projectName: AIGNE WebSmith
projectDesc: "基于 AIGNE 框架构建的 AI 驱动的网站生成工具"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. 核心信息与策略：定义您向用户传达*什么*内容的基础元素。
  1. 在“首屏”回答关键问题：用户看到的第一个屏幕必须清晰、立即地回答：
    * 它是什么：产品的简明描述。
    * 它为谁服务：特定的目标受众（例如，独立创始人、小团队）。
    * 它有何不同：您独特的价值主张（例如，“开放、可组合、可导出的代码、Agent 工作流”）。
    * 主要行动：一个与用户主要目标一致的、单一清晰的行动号召（CTA）。
  2. 用证据建立信誉：不要期望用户相信您的声明。在叙述早期向他们展示证据。
    * 展示，而不仅仅是讲述：最强有力的证据是演示。包括一个简短的（30-45秒）无声视频循环或一个使用该工具构建的真实网站链接。
    * 使用社会证明：在解释“工作原理”之前，插入具体的证据，如客户徽标、引人注目的数据点（例如，“被 50 多个团队使用”）或强有力的用户引言。
  3. 定义清晰的行动号召（CTA）：
    * 使 CTA 与受众保持一致：主要 CTA 应该是您希望目标用户采取的主要行动（例如，“生成我的网站”）。
    * 确定 CTA 的优先级：将次要行动（如“在 GitHub 上查看”）放在不太显眼的位置（三级按钮或页脚链接），特别是对于非开发者受众。
    * 在移动设备上保持持久的 CTA：在移动设备上，一个主要 CTA 应该始终可见。
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

### 逐字段解释

基于上述实际配置，以下是每个字段的作用：

#### 项目基础信息

`projectName`
- 目的：显示在页面 `<title>`、导航和网站品牌中的名称
- 当前值：`AIGNE WebSmith`
- 类型：字符串
- 影响：
  - 更改名称会更新所有页面的标题和导航标签
  - 保持简洁；少于 50 个字符以提高可读性和 SEO
- 如何应用：更改后运行 `aigne web publish`

`projectDesc`
- 目的：用于 SEO 元信息（`<meta name="description">`）和社交分享的项目描述
- 当前值：`"基于 AIGNE 框架构建的 AI 驱动的网站生成工具"`
- 类型：字符串
- 影响：
  - 更新页面和社交分享的元描述
  - 保持在约 150 个字符以内，以便在搜索摘要中显示
  - 包含 SEO 关键词
- 如何应用：更改后运行 `aigne web publish`

`projectLogo`
- 目的：用于页眉导航、网站图标和社交媒体缩略图的徽标
- 当前值：`https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- 类型：字符串（URL 或路径）
- 影响：
  - 切换 URL/路径会更新整个网站的徽标
  - 支持：HTTP/HTTPS URL 或相对路径（例如 `./assets/images/logo.svg`）
  - 推荐使用 PNG 或 SVG 以获得清晰的显示效果
- 如何应用：更改后运行 `aigne web publish`

`projectId`
- 目的：WebSmith 服务使用的唯一项目标识符，用于关联部署、历史记录和数据源
- 当前值：`pg4d0000-0000-4000-a000-000000000000` (UUID)
- 类型：字符串 (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- 影响：
  - 更改为新的 UUID 会使系统将其视为一个新项目，这可能导致：
    - 与之前部署链接的关联中断
    - 丢失与项目历史的链接
    - 丢失数据源关联
- 如何应用：更改后运行 `aigne web publish`

`projectSlug`
- 目的：URL 路径前缀，影响部署路径和内部链接
- 当前值：`/` (根目录)
- 类型：字符串（URL 路径）
- 影响示例：
  - `/`：网站位于根目录，例如 `https://example.com/`
  - `/portfolio`：网站位于 `https://example.com/portfolio/`
  - `/docs`：网站位于 `https://example.com/docs/`
  - 更改会更新所有内部链接和部署路径
- 如何应用：更改后运行 `aigne web publish`

`projectCover`
- 目的：用于预览和社交分享（Open Graph、Twitter Card 等）的网站封面图片
- 当前值：`.aigne/web-smith/cover.png`
- 类型：字符串（文件路径）
- 影响：
  - 更改路径会更新社交分享时的预览图片
  - 使用高质量图片（至少 1200×630）
  - 格式：PNG、JPG/JPEG、WebP 等
- 如何应用：更改后运行 `aigne web publish`

#### 网站策略

`pagePurpose`
- 目的：定义主要目的；直接影响 AI 策略和页面结构
- 当前值：`[landingPage]` (数组)
- 类型：数组（多选）
- 选项和效果：
  - `landingPage` (当前值)：专注于转化的落地页；生成英雄区、功能、CTA、常见问题解答等。
  - `ecommerce`：在线商店；生成目录、购物车、结账、评论等。
  - `saas`：SaaS 产品网站；生成功能、定价、演示、引导等。
  - `portfolio`：作品集网站；生成视觉布局、画廊、案例研究等。
  - `corporate`：公司网站；生成公司概览、服务、团队、联系方式等。
  - `blog`：博客；生成内容结构、SEO、分享、存档等。
  - `nonprofit`：非营利组织；生成使命、捐赠流程、志愿者注册等。
  - `education`：教育；生成课程列表、学习路径、进度跟踪等。

`targetAudienceTypes`
- 目的：定义目标受众；直接影响语气、复杂度和示例选择
- 当前值：`[customers]` (数组)
- 类型：数组（多选）
- 选项和效果：
  - `customers` (当前值)：最终用户/客户；语言简单，强调易用性和成果；增加信任信号和用户故事
  - `businessOwners`：企业主/创始人；关注投资回报率和商业价值；专业语气；包括商业案例和回报分析
  - `marketers`：营销团队；关注 KPI 和品牌；包括营销工具和分析
  - `designers`：设计师；强调视觉和设计展示；美学和灵感；包括设计案例和视觉工具
  - `developers`：开发者/技术用户；技术细节、代码示例、API 文档；关注准确性和实现
  - `investors`：投资者/利益相关者；增长指标、市场机会、财务前景；商业计划和市场数据
  - `jobSeekers`：求职者；关注文化、成长、福利；职位列表和公司文化
  - `students`：学生/学习者；指导性语气、分步指南、进度跟踪；教程和课程材料
  - `generalPublic`：普通/混合受众；语言通俗易懂，多个入口点，广泛吸引力
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`websiteScale`
- 目的：定义网站规模，控制页面数量和导航复杂性
- 当前值：`singlePage`
- 类型：字符串（单选）
- 选项和效果：
  - `singlePage` (当前值)：单页网站；所有部分都在一个可滚动的页面上（英雄区、功能、常见问题解答、CTA 等）；适用于快速启动/MVP
  - `minimal`：2-6 页；主页、关于、服务/产品、联系方式等；适用于小型企业/简单网站
  - `standard`：7-12 页；包含 `minimal` 的所有内容，外加作品集/博客、团队、常见问题解答、定价等；适用于专业网站、作品集、小型电商（推荐）
  - `comprehensive`：12 页以上；包含 `standard` 的所有内容，外加详细的服务页面、案例研究、资源中心等；适用于大型/复杂/内容丰富的网站
  - `aiDecide`：让 AI 根据类型、受众和仓库分析来决定规模；考虑业务需求、内容量和维护能力
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`rules`
- 目的：关于结构、内容和风格的详细生成指南（Markdown）。这是给 AI 最重要的指导，直接影响质量和用户体验。
- 当前值：一个包含详细指导的多行代码块（见上例），包括：
  - 核心信息与策略
  - 在“首屏”回答关键问题
  - 用证据建立信誉
  - 定义清晰的行动号召
- 类型：多行字符串（支持 Markdown）
- 影响：
  - 空或稀疏的规则：AI 会回退到默认设置，可能不符合您的需求
  - 详细的规则：AI 会遵循您的指导来构建结构、组织和调整语气
  - 更改：AI 会根据新规则重新生成，影响章节和表达方式
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 语言

`locale`
- 目的：用于基础内容生成的主要网站语言
- 当前值：`en`
- 类型：字符串
- 支持的语言代码：标准的 IETF 代码，如 `en`, `zh`, `zh-TW`, `ja`, `ko`, `fr`, `de`, `es`, `pt`, `ru`, `it`, `ar` 等。
- 如何应用：更改后运行 `aigne web clear && aigne web generate`

`translateLanguages`
- 目的：要翻译成的语言列表；每种语言都会成为一个完整的网站结构
- 当前值：`[zh, zh-TW, ja]`
- 类型：数组（多选）
- 支持的代码：与 `locale` 相同（但不能包含 `locale` 本身）
- 每种语言的效果：
  - `zh`：生成一个完整的简体中文网站
  - `zh-TW`：生成一个完整的繁体中文网站
  - `ja`：生成一个完整的日文网站
  - 其他语言类似；每种语言都会生成一个独立的网站结构
- 如何应用：更改后运行 `aigne web translate`

#### 数据源

`sourcesPath`
- 目的：由 WebSmith AI Agent 分析的目录/文件（数组）。AI 仅使用这些作为生成网站内容的参考。这直接决定了质量、准确性和相关性。
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
    - 保持源的准确性和最新性
    - 定期更新以匹配项目状态
- 影响：
  - 添加路径：AI 分析更多材料，通常能提高质量
  - 删除路径：AI 停止分析它们，可能会丢失信息
  - 路径类型：
    - 目录（例如 `./assets/documents`）：递归分析
    - 文件（例如 `./README.md`）：直接分析
    - 支持的类型：`.md`, `.yaml`/`.yml`, `.json`, `.txt` 等
    - 图片目录：图片不会被分析，但可以被引用
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

`defaultDatasources`
- 目的：自动注入到每个页面上下文的数据源（例如，媒体、联系信息）。这些在每次命令运行时都会添加，但并非每个资源都会完全内联；适用于像 `media.md` 这样的资源描述。
- 当前值：`[./media.md]`
- 类型：数组（文件路径）
- 影响：
  - 添加：新包含的通用内容（品牌信息、共享片段等）
  - 删除：不再注入
  - 适用于：`media.md`（图片位置和描述）、共享的联系/品牌信息
  - 支持的格式：`.md`, `.yaml`/`.yml`, `.json`
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 输出与部署

`pagesDir`
- 目的：生成的网站文件的输出目录（例如 `page.yaml`, `_navigations.yaml`）
- 当前值：`.aigne/web-smith/pages`
- 类型：字符串（路径）
- 影响：
  - 更改（例如，改为 `./output/pages`）会将未来的输出移动到那里
  - 推荐使用相对路径以保证可移植性
  - 如果目录不存在，会自动创建
- 如何应用：未来的生成将写入新目录

`appUrl`
- 目的：网站部署 URL；决定网站发布到哪里
- 当前值：`https://mhevtaeg.user.aigne.io`
- 类型：字符串（URL）
- 影响：
  - 更改为另一个 URL 会发布到新的目标
  - 必须包含协议；如果缺少，会自动添加 `https://`
  - 在最终域名确定后设置，以避免频繁更改
- 如何应用：仅由 `aigne web publish` 使用；其他命令会忽略它

`checkoutId`
- 目的：临时开发变量；仅为方便存储
- 当前值：`""`
- 类型：字符串
- 注意：由系统管理；您通常不需要设置它

`shouldSyncAll`
- 目的：临时开发变量；仅为方便存储
- 当前值：`""`
- 类型：字符串（`"true"` 或 `""`）
- 注意：由系统管理；您通常不需要设置它

`navigationType`
- 目的：临时开发变量；仅为方便存储
- 当前值：`""`
- 类型：字符串
- 注意：由系统管理；您通常不需要设置它

#### 媒体与展示

`media.minImageWidth`
- 目的：过滤低质量图片的最小图片宽度（像素）；只有宽度大于此值的图片才会被使用
- 当前值：`600`
- 类型：整数（像素）
- 效果：
  - 较低（400–600）：允许更多图片，质量风险较低；适用于快速启动
  - 中等（600–800）：质量/数量平衡；默认推荐
  - 较高（800–1000）：质量更高，图片更少；适用于作品集/高端品牌
  - 非常高（1000+）：顶级视觉质量，可用图片极少
- 如何应用：更改后运行 `aigne web clear && aigne web generate` 或 `aigne web update`

#### 其他配置

（当前没有其他字段。）

`lastGitHead`
- 目的：生成时的最后一次 Git 提交 ID（用于增量更新）
- 当前值：`c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- 类型：字符串（Git 提交哈希）
- 效果：
  - 每次生成后自动维护
  - 用于检测更改的文件；手动编辑可能会影响增量行为
- 注意：通常由系统管理；仅在必要时使用有效的哈希值进行编辑

---

## 字段一览

| 字段 | 类型 | 默认值 | 示例 | 应用命令 |
|---|---|---|---|---|
| `projectName` | 字符串 | `""` | `"我的项目"` | `publish` |
| `projectDesc` | 字符串 | `""` | `"AI 驱动的网站工具"` | `publish` |
| `projectLogo` | 字符串 | `""` | `"https://example.com/logo.png"` | `publish` |
| `projectId` | 字符串 | UUID | `"pg4d0000-0000-4000-a000-000000000000"` | `publish` |
| `projectSlug` | 字符串 | `"/"` | `"/"` | `publish` |
| `projectCover` | 字符串 | `""` | `"./assets/cover.png"` | `publish` |
| `pagePurpose` | 数组 | `[]` | `["landingPage"]` | `clear && generate` |
| `targetAudienceTypes` | 数组 | `[]` | `["customers"]` | `clear && generate` |
| `websiteScale` | 字符串 | `"standard"` | `"standard"` | `clear && generate` |
| `rules` | 字符串 | `""` | `"### 页面结构\n1. 英雄区"` | `update` |
| `locale` | 字符串 | `"en"` | `"en"` | `clear && generate` |
| `translateLanguages` | 数组 | `[]` | `["zh", "ja"]` | `translate` |
| `pagesDir` | 字符串 | `"./aigne/web-smith/pages"` | `"./aigne/web-smith/pages"` | `generate` |
| `sourcesPath` | 数组 | `[]` | `["./README.md", "./docs"]` | `generate` |
| `defaultDatasources` | 数组 | `["./media.md"]` | `["./media.md"]` | `update` |
| `media.minImageWidth` | 整数 | `800` | `800` | `update` |
| `appUrl` | 字符串 | `""` | `"https://example.com"` | `publish` |
| `lastGitHead` | 字符串 | `""` | `"c4a4d3db..."` | 自动 |
| `checkoutId` | 字符串 | `""` | `""` | 内部使用 |
| `shouldSyncAll` | 字符串 | `""` | `""` | 内部使用 |
| `navigationType` | 字符串 | `""` | `""` | 内部使用 |

**注意：** 关于详细的允许值和描述，请参阅下方的[逐字段解释](#field-by-field-explanation)部分。

---

## 复制粘贴示例

### 最小示例：单页，仅英文

一个用于单页英文网站的最小配置：

```yaml
configVersion: 1
projectName: 我的项目
projectDesc: "一个简单的落地页"
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
```bash
aigne web generate
```

---

### 标准示例：多页，英文 + 日文

一个用于多页网站（含英文和日文）的标准配置：

```yaml
configVersion: 1
projectName: 我的项目
projectDesc: "AI 驱动的网站生成工具"
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
  ### 页面结构要求
  1. 英雄区必须包含清晰的价值主张
  2. 使用积极、自信的语气
  3. 包含具体的案例数据
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
```bash
aigne web generate
aigne web translate
aigne web publish
```

**注意：** 当有重大变更时，版本号会增加；届时将提供迁移说明。

---

## 如果出现问题

如果您的网站生成失败或产生意外结果，请使用以下恢复方法：

- **Git 还原：** 如果您正在使用版本控制，请恢复到上一个可用的配置：
  ```bash
  git revert HEAD
  ```

- **清理并重新生成：** 清除所有生成的文件并从头开始重新生成：
  ```bash
  aigne web clear && aigne web generate
  ```

这将恢复到一个干净的状态，并根据当前配置重新生成您的网站。

---

## 何时应该修改它？

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
  - 如果已经生成：运行 `aigne web clear` 然后 `aigne web generate`

场景：更改网站类型
- 触发条件：产品定位改变（例如，SaaS → 电商）
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
- 触发条件：添加了 AI 必须分析的新文档或内容。如果未添加路径，后续的 `aigne web generate` 运行将无法读取它。
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

### 修复

场景：图片质量不足
- 触发条件：输出中出现低质量图片
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
- 触发条件：语气/结构不符合期望
- 字段：`rules`
- 示例：
```yaml
# 之前：空或过于稀疏
rules: ""

# 之后：详细指导
rules: |
  ### 页面结构要求
  1. 首屏必须包含：
     * 清晰的产品标题
     * 简明的描述（≤ 2 句）
     * 主要的行动号召

  2. 内容组织：
     * 积极、自信的语气
     * 包含具体的案例数据
     * 避免过多的营销术语
```
- 应用：
  - `aigne web update` 会读取
  - 在填写提示时，`aigne web generate` 会读取
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
- 应用：运行 `aigne web clear` 然后 `aigne web generate`

### 基本信息变更

场景：更新项目基本信息
- 字段：`projectName`, `projectDesc`, `projectLogo`, `projectCover`
- 示例：
```yaml
# 之前
projectName: "旧项目名称"
projectDesc: "旧描述"
projectLogo: "旧徽标 URL"

# 之后
projectName: "新项目名称"
projectDesc: "新描述"
projectLogo: "新徽标 URL"
projectCover: "./assets/images/new-cover.png"
```
- 应用：`aigne web publish`（其他命令会忽略这些）

场景：集成外部部署
- 字段：`appUrl`
- 示例：
```yaml
# 之前
appUrl: ""

# 之后
appUrl: https://your-app.user.aigne.io
```
- 应用：仅 `aigne web publish` 使用；`appUrl` 决定目标平台

### 验证更改

- 检查生成的页面文件，确认更新后的值已存在。例如，更改 `projectName` 后，确保新名称出现在预期位置。

---

## 如果文件损坏了怎么办？

### YAML 格式错误

场景：使用全角（中文）冒号
```yaml
projectName： "我的项目"  # 错误：全角冒号
```
正确：
```yaml
projectName: "我的项目"  # 正确：ASCII 冒号
```
影响：
- YAML 解析失败；`aigne web generate` 会显示错误
- 命令中止；网站不会被生成
恢复：
1. 将所有全角冒号替换为 ASCII `:`
2. 重新运行 `aigne web generate`

场景：不存在的字段
```yaml
projectName: "我的项目"
unknownField: "一些值"
```
影响：
- CLI 会忽略无法识别的字段，不报错
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
  - customers  # 正确：两空格缩进
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
1. 仅使用空格（不用制表符）并保持一致的缩进（通常是两个空格）
2. 确保数组使用正确的 `-` 并有正确的缩进

场景：删除关键字段
```yaml
# 意外删除了 projectName
projectDesc: "描述"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
影响：
- 标题可能为空或使用默认值
- 某些功能可能无法正常工作
- 解析成功但输出质量下降
恢复：
1. 如果可用，从 Git 历史中恢复
2. 运行 `aigne web init` 重新生成，然后合并自定义项
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
- AI 可能无法正确读取值
- 输出可能不符合预期
恢复：
1. 在本指南中确认正确的格式
2. 使用正确的 YAML 数组语法，带 `-`
3. 重新生成以验证

### 检测与恢复

方法 1：在生成期间检测
- 编辑后，运行 `aigne web generate`
- 系统会报告 YAML/格式错误并提供有用的信息

方法 2：从备份中恢复
- 如果使用 Git，从历史记录中恢复
- 如果使用手动备份：
```bash
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

方法 3：重新生成文件
- 如果无法修复，运行 `aigne web init` 重新创建它。先备份旧的 `config.yaml`，以便您可以合并自定义值。

### 产品稳健性

根据 WebSmith 的行为：
1. 文件缺失：明确的错误和运行 `aigne web init` 的指导
2. YAML 解析失败：友好的错误提示，不会崩溃
3. 未知字段：静默忽略；生成继续；手动验证结果
4. 错误的值类型：可能会使用默认值；解析继续
5. 缺少可选字段：应用默认值（例如，`locale` 默认为 "en"）

### 预防技巧

1. 对配置文件使用版本控制
2. 在进行重大编辑前进行备份
3. 优先通过 CLI (`aigne web init`) 编辑，减少手动格式错误
4. 编辑后运行 `aigne web generate` 来验证更改

---

## 默认值与优先级

### 显式默认值

以下字段有明确的默认值：

- `locale`：默认为 `"en"` (英文)
- `websiteScale`：默认为 `"standard"` (7-12 页)
- `pagesDir`：默认为 `"./aigne/web-smith/pages"`
- `translateLanguages`：默认为 `[]` (空数组，不翻译)
- `media.minImageWidth`：默认为 `800` (像素)

### 优先级规则

配置优先级遵循以下顺序：

1. **显式配置值** 具有最高优先级
2. **`rules` 会覆盖默认值**（如果指定）；如果 `rules` 为空，AI 会回退到默认值
3. **缺失的值回退到默认值**；如果字段未指定或为空，系统将使用其默认值

### 国际化（i18n）回退行为

在生成多语言网站时：

- **主要语言 (`locale`)**：始终用作内容生成的基础语言
- **翻译语言 (`translateLanguages`)**：内容会从主要语言翻译成每个目标语言
- **翻译缺失时的回退**：如果翻译失败，系统会回退到主要语言的内容
- **禁用 i18n**：要禁用国际化，请将 `translateLanguages` 设置为空数组 `[]`

---

## 故障排除

### 错误 1：“找不到配置文件”

**错误信息：**
```
Config file not found: .aigne/web-smith/config.yaml
Please run 'aigne web init' to create the config file.
```

**原因：** 配置文件在预期位置不存在。

**修复：** 运行 `aigne web init` 以交互方式创建配置文件。

---

### 错误 2：“解析配置文件时出错”

**错误信息：**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因：** 配置文件中的 YAML 语法错误（例如，缩进不正确、冒号错误、缺少引号）。

**修复：**
1. 检查错误中提到的行号
2. 验证 YAML 语法（使用空格，而不是制表符；使用正确的冒号格式）
3. 使用 YAML 验证器验证文件
4. 重新运行 `aigne web generate`

---

### 错误 3：在没有 `clear` 的情况下从 `standard` 切换到 `singlePage`

**错误信息：**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因：** 在没有先运行 `clear` 的情况下，将 `websiteScale` 从 `standard` 更改为 `singlePage`，导致结构冲突。

**修复：**
1. 运行 `aigne web clear` 以删除旧的生成文件
2. 运行 `aigne web generate` 以使用新的规模重新生成
3. **在更改 `websiteScale` 时，总是在 `generate` 之前运行 `clear`**

---

### 错误 4：“无效的 locale 代码”

**错误信息：**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因：** 在 `locale` 或 `translateLanguages` 中使用了不支持的语言代码。

**修复：**
1. 查看支持的语言代码列表
2. 使用有效的 IETF 语言代码（例如 `en`、`zh`、`ja`）
3. 更新配置并重新运行命令

---

### 错误 5："未找到数据源"

**错误信息：**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**原因：** `sourcesPath` 为空，或者所有指定的路径都不存在或无法访问。

**修复：**
1. 验证 `sourcesPath` 中的文件/目录是否存在
2. 检查文件权限（确保文件可读）
3. 将有效路径添加到 `sourcesPath`（例如 `["./README.md", "./docs"]`）
4. 重新运行 `aigne web generate`

---

## 最佳实践

### `sourcesPath` 最佳实践

**好的文件夹布局：**

```
project/
├── README.md           # ✅ 包含
├── docs/               # ✅ 包含
│   ├── getting-started.md
│   └── api-reference.md
├── CHANGELOG.md        # ✅ 包含
└── assets/
    ├── images/         # ✅ 包含 (用于图片引用)
    └── recordings/     # ❌ 跳过 (除非需要)
```

**不好的文件夹布局：**

```
project/
├── node_modules/       # ❌ 不要包含 (太大)
├── dist/               # ❌ 不要包含 (生成的文件)
├── .git/               # ❌ 不要包含 (版本控制)
└── test/               # ❌ 不要包含 (测试文件)
```

**最佳实践：**

1. **包含核心文档：**
   - `README.md` (项目概览)
   - `docs/` 目录 (文档)
   - `CHANGELOG.md` (版本历史)

2. **包含项目配置：**
   - `aigne.yaml` (项目配置)
   - 与您的项目相关的配置文件

3. **包含图片目录：**
   - `assets/images/` (用于图片引用)
   - 注意：图片不会被分析，但可以被引用

4. **避免大型目录：**
   - `node_modules/` (太大，不必要)
   - `dist/` 或 `build/` (生成的文件)
   - `.git/` (版本控制)

5. **Glob 模式支持：**
   - `sourcesPath` **当前不支持** Glob 模式
   - 使用明确的文件路径或目录路径
   - 示例：`["./README.md", "./docs"]` ✅
   - 示例：`["./docs/**/*.md"]` ❌ (不支持)

6. **忽略文件：**
   - **当前不支持** `.aigneignore`
   - 从 `sourcesPath` 中手动排除不必要的文件/目录

---

### `rules` 最佳实践

**6 点落地页骨架：**

将此骨架复制到您的 `rules` 字段并进行自定义：

```yaml
rules: |
  ### I. 核心信息与策略
  1. 首屏必须回答：它是什么，为谁服务，有何不同，主要行动
  2. 用证据建立信誉：展示演示、社会证明、客户徽标
  3. 定义清晰的 CTA：主要行动与受众一致，移动端持久的 CTA
  
  ### II. 内容组织
  4. 使用积极、自信的语气：避免营销术语，专注于益处
  5. 包含具体数据：案例研究、指标、真实示例
  6. 保持一致性：产品命名、术语、结构
```

**语气指导：**

- **面向客户：** 清晰的益处、简单的语言、信任信号
- **面向开发者：** 技术准确性、代码示例、API 参考
- **面向企业主：** 关注投资回报率、节省时间的益处、专业的语气

**CTA 指导：**

- **主要 CTA：** 您希望用户采取的主要行动（例如，“生成我的网站”）
- **次要 CTA：** 放在不太显眼的位置（例如，“在 GitHub 上查看”）
- **移动端：** 保持一个持久的主要 CTA 可见

**最佳实践：**

1. **具体化：** 包含具体要求，而不是模糊的建议
2. **结构化：** 使用标题和项目符号组织规则
3. **与受众对齐：** 使语气与 `targetAudienceTypes` 匹配
4. **关注结果：** 描述您想要什么，而不是如何实现它
5. **保持专注：** 避免过长的规则（为了性能，目标 < 2KB）
6. **测试和迭代：** 根据生成的内容质量优化规则

---

## 常见问题解答

Q1: 更改没有生效
- 可能原因：文件未保存、YAML 错误，或者您需要重新生成
- 修复：保存、修复 YAML、运行 `aigne web generate`，并验证输出中是否包含更新后的值

Q2: 如何添加语言？
- 步骤：
  1. 在 `translateLanguages` 下添加代码
  2. 运行 `aigne web generate`
  3. 检查 `.aigne/web-smith/pages/workspace/{lang}/`
- 示例：
```yaml
locale: zh
translateLanguages:
  - en
  - ja
  - fr  # 新增法语
```

Q3: 生成的内容不符合预期
- 原因：`rules` 不充分、`targetAudienceTypes` 不匹配，或 `sourcesPath` 内容稀疏
- 修复：丰富 `rules`、调整受众、添加更多源

Q4: 如何修复格式错误？
- 常见问题：全角冒号、缩进不一致、错误的数组
- 修复：遵循第 6 节的指导，必要时从备份中恢复，并重新生成以验证
