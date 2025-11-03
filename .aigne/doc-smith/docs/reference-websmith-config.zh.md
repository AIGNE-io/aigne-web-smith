# WebSmith 配置

本指南旨在说明 `config.yaml` 文件的用途和用法，该文件是任何 WebSmith 项目的核心配置。您可以在项目根目录的 `.aigne/web-smith/config.yaml` 路径下找到此文件。

---

## 什么是配置文件？

### 基本信息

`config.yaml` 文件是 WebSmith 的**核心配置文件**。它使用 YAML 格式存储 WebSmith 生成网站所需的所有参数。

**文件详情**：
- **文件名**：`config.yaml`（固定名称）
- **位置**：`.aigne/web-smith/config.yaml`（相对于项目根目录）
- **格式**：YAML（UTF-8 编码）

### 核心用途

该配置文件是 WebSmith 操作的**核心参数载体**。每次执行 `generate` 命令时，AI Agent 都会读取此文件，并根据其设置生成网站结构和内容。

**主要功能**：
- 定义网站类型和目标受众。
- 控制内容生成策略和写作风格。
- 决定网站规模和页面结构。
- 配置多语言支持。
- 设置部署参数。

---

## 配置文件有什么用？

### 核心作用

`config.yaml` 文件是运行 `aigne web generate` 命令时使用的**说明手册**。它告诉系统如何生成网站。通过此文件，您可以指定网站的风格和类型、AI 的写作风格、网站规模（单页或多页）、语言版本以及所有其他关键参数，以指导 AI Agent 生成满足您需求的网站结构和内容。

**总而言之**：该配置文件是 WebSmith 生成网站的唯一依据和参数来源。整个过程都基于此文件中的设置。

### 功能分组

配置文件中的字段分为以下功能组：

#### 项目基础

该组包含项目的基本标识和显示信息，用于网站品牌建设和 SEO 优化。

**字段**：`projectName`、`projectDesc`、`projectLogo`、`projectId`、`projectSlug`、`projectCover`

**用途**：定义网站的名称、描述、徽标、标识符及其他基本信息，影响页面标题、导航菜单、SEO 元标签和社交媒体分享。

#### 网站策略

该组定义网站的类型、风格、规模和生成策略，是控制 AI 生成内容的核心配置。

**字段**：`pagePurpose`、`targetAudienceTypes`、`websiteScale`、`rules`

**用途**：
- `pagePurpose`：定义网站类型（例如，营销落地页、电子商务网站、SaaS 产品网站），影响生成的页面组件和内容组织。
- `targetAudienceTypes`：定义目标受众（例如，最终用户、开发者、企业主），影响 AI 的写作风格、语言复杂度和示例选择。
- `websiteScale`：定义网站规模（单页或多页），控制要生成的页面数量。
- `rules`：为页面生成提供详细指导，包括结构、内容和风格要求。

#### 国际化

该组配置网站的语言版本，支持多语言网站生成。

**字段**：`locale`、`translateLanguages`

**用途**：定义网站的主要语言和翻译语言列表，控制生成哪些语言版本的网站（每种语言都会生成一个完整的网站结构）。

#### 内容源

该组指定供 AI 分析的内容源，用作生成网站页面的素材和参考信息。

**字段**：`sourcesPath`、`defaultDatasources`

**用途**：
- `sourcesPath`：指定供 AI 分析的文档目录、Markdown 文件、YAML 文件、图片资源等。**此字段决定了生成网站内容的质量和效果，直接影响 AI 生成内容的准确性、相关性和专业性。**
- `defaultDatasources`：指定要注入到每个页面的通用数据源，每次运行命令时都会添加到上下文中（例如，包含项目中图片位置和描述的 `media.md` 文件）。

#### 输出与部署

该组配置生成文件的输出位置和网站部署参数。

**字段**：`pagesDir`、`appUrl`、`checkoutId`、`shouldSyncAll`、`navigationType`

**用途**：
- `pagesDir`：指定保存生成的页面文件的目录（输出位置）。
- `appUrl`：指定网站的部署 URL，影响生成的链接和 SEO。
- `checkoutId`、`shouldSyncAll`、`navigationType`：这些是开发期间使用的临时变量，仅作为配置文件中的占位数据。用户无需关心这些值。

#### 媒体与显示

该组配置与图片质量和显示相关的参数。

**字段**：`media.minImageWidth`、`lastGitHead`

**用途**：
- `media.minImageWidth`：定义最低图片宽度要求，用于过滤掉低质量图片。
- `lastGitHead`：记录上次生成时的 Git 提交 ID，用于增量更新。

---

## 配置文件如何生成？

### 生成方式

配置文件通过运行以下命令生成：

```bash
aigne web init
```

此命令会启动一个交互式向导，引导您逐步完成配置过程：

1.  **网站类型** (`pagePurpose`)：选择网站的主要用途（可多选）。
2.  **目标受众** (`targetAudienceTypes`)：选择网站的目标用户群体（可多选）。
3.  **网站规模** (`websiteScale`)：选择网站的页面数量。
4.  **主要语言** (`locale`)：选择网站的主要语言。
5.  **翻译语言** (`translateLanguages`)：选择要翻译成的语言（可多选）。
6.  **页面输出目录** (`pagesDir`)：设置保存生成页面文件的位置。
7.  **数据源路径** (`sourcesPath`)：指定供 AI 分析的内容源（可添加多个路径）。
8.  **自定义规则** (`rules`)：可选择性地为页面生成提供详细要求。

完成向导后，配置文件会自动保存到 `.aigne/web-smith/config.yaml`。

### 配置示例

以下是 AIGNE WebSmith 项目本身的实际配置文件：

```yaml
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

### 字段参考

基于以上真实配置，以下是每个字段的详细说明：

#### 项目基础

**`projectName`**
- **用途**：项目的显示名称，显示在页面标题（`<title>`）、导航菜单和网站品牌中。
- **类型**：字符串
- **变更影响**：更改此值将更新整个网站显示的名称。建议保持简洁（50 个字符以内），以获得更好的显示效果和 SEO。
- **如何应用**：运行 `aigne web update` 或 `aigne web generate`。

**`projectDesc`**
- **用途**：项目描述，用于 SEO 元描述标签（`<meta name="description">`）和社交媒体分享。
- **类型**：字符串
- **变更影响**：修改此项会更新元标签和社交分享描述。建议保持在 150 个字符以内，并包含核心关键词以利于 SEO。
- **如何应用**：运行 `aigne web update` 或 `aigne web generate`。

**`projectLogo`**
- **用途**：项目徽标，用于页面页眉、浏览器收藏夹图标和社交分享缩略图。
- **类型**：字符串（URL 或文件路径）
- **变更影响**：更新整个网站的徽标。支持 HTTPS URL 或相对路径（例如 `./assets/images/logo.svg`）。建议使用 PNG 或 SVG 格式。
- **如何应用**：运行 `aigne web update` 或 `aigne web generate`。

**`projectId`**
- **用途**：项目的唯一标识符，WebSmith 服务用它来关联部署、历史记录和数据源。
- **类型**：字符串（UUID 格式）
- **变更影响**：⚠️ **重要提示**：除非您打算创建一个新项目，否则不要修改此 ID。更改它可能会破坏与现有部署、历史记录和数据源的关联。
- **如何应用**：如果必须修改，运行 `aigne web generate` 进行重新生成。

**`projectSlug`**
- **用途**：URL 路径前缀，影响网站的部署路径和内部链接生成。
- **类型**：字符串（URL 路径格式）
- **变更影响**：值为 `/` 会将网站部署到根目录（例如 `https://example.com/`），而 `/docs` 则会部署到 `https://example.com/docs/`。
- **如何应用**：运行 `aigne web generate` 更新所有链接。

**`projectCover`**
- **用途**：网站的封面图片，用于社交媒体上的预览（例如，Open Graph、Twitter Cards）。
- **类型**：字符串（文件路径）
- **变更影响**：更新社交分享的预览图片。建议使用高质量图片（至少 1200x630 像素）。
- **如何应用**：运行 `aigne web update` 或 `aigne web generate`。

#### 网站策略

**`pagePurpose`**
- **用途**：定义网站的主要目标，直接影响 AI 的生成策略和页面结构。
- **类型**：数组（可多选）
- **可选值**：
  - `landingPage`：用于营销和转化。生成英雄区域、功能介绍、号召性用语等。
  - `ecommerce`：用于在线销售。生成产品目录、购物车等。
  - `saas`：用于 SaaS 产品网站。生成功能描述、定价、演示等。
  - `portfolio`：用于作品展示。生成视觉驱动的布局、画廊等。
  - `corporate`：用于公司信息。生成公司概览、服务、团队信息等。
  - `blog`：用于内容分享。生成内容组织、SEO 优化等。
  - `nonprofit`：用于非营利组织。生成使命宣言、捐赠流程等。
  - `education`：用于教育网站。生成课程列表、学习路径等。
  - `mixedPurpose`：用于多功能网站。生成组件的组合。
- **如何应用**：更改此项会改变整个网站的内容策略。运行 `aigne web generate` 以完全重新生成。

**`targetAudienceTypes`**
- **用途**：定义目标受众，影响 AI 的写作风格、语言复杂度和示例选择。
- **类型**：数组（可多选）
- **可选值**：
  - `customers`：面向最终用户。使用简单语言，强调可用性。
  - `businessOwners`：面向企业家。关注投资回报率和商业价值。
  - `marketers`：面向营销团队。关注营销指标和品牌知名度。
  - `designers`：面向设计师。强调视觉吸引力和美学。
  - `developers`：面向技术用户。提供技术细节、代码示例、API 文档。
  - `investors`：面向利益相关者。关注增长指标和市场机会。
  - `jobSeekers`：用于招聘。关注公司文化和职业发展。
  - `students`：面向学习者。使用教育性语气和分步指导。
  - `generalPublic`：面向广大受众。使用易于理解的语言和多个切入点。
- **如何应用**：改变语气和示例。运行 `aigne web generate` 以完全重新生成。

**`websiteScale`**
- **用途**：定义网站的规模，控制页面数量和导航结构的复杂性。
- **类型**：字符串（单选）
- **可选值**：
  - `singlePage`：包含多个区域的单页网站。
  - `minimal`：包含 2-6 个核心页面的小型网站（例如，首页、关于、联系方式）。
  - `standard`：包含 7-12 个页面的标准网站（推荐）。
  - `comprehensive`：包含 12 个以上页面的大型网站。
  - `aiDecide`：让 AI 根据其他参数决定合适的规模。
- **如何应用**：直接决定生成的页面数量。运行 `aigne web generate` 重新生成所有页面。

**`rules`**
- **用途**：以 Markdown 格式为页面生成提供详细指令。这是指导 AI 最关键的字段。
- **类型**：多行字符串（支持 Markdown）
- **变更影响**：直接影响生成内容的质量，包括页面结构、内容组织和语气。
- **如何应用**：`rules` 是内容生成的主要指南。运行 `aigne web generate` 以根据新规则完全重新生成。

#### 国际化

**`locale`**
- **用途**：定义网站的主要语言。AI 首先会用此语言生成所有内容。
- **类型**：字符串
- **支持代码**：标准 IETF 语言代码（例如 `en`、`zh`、`ja`、`fr`、`de`）。
- **如何应用**：更改所有页面的主要语言。运行 `aigne web generate` 以新语言重新生成所有内容。

**`translateLanguages`**
- **用途**：要将网站翻译成的其他语言列表。每种语言都会生成一个完整的、已翻译的网站版本。
- **类型**：数组（可多选）
- **支持代码**：与 `locale` 相同（不能包含 `locale` 值本身）。
- **如何应用**：添加或删除语言版本。运行 `aigne web generate` 重新生成所有语言版本。

#### 内容源

**`sourcesPath`**
- **用途**：定义供 AI 分析的内容源目录/文件。**此字段是决定生成内容质量、准确性和相关性的决定性因素。**
- **类型**：数组（路径列表）
- **变更影响**：添加新路径会扩展 AI 的知识库，可能提高内容质量。删除路径可能导致信息缺失。支持目录和文件（`.md`、`.yaml`、`.json`、`.txt`）。
- **如何应用**：新的数据源将被分析。运行 `aigne web generate`。

**`defaultDatasources`**
- **用途**：在每个页面生成任务中注入到上下文的数据源（例如，描述图片资产的 `media.md` 文件）。
- **类型**：数组（文件路径列表）
- **变更影响**：对于提供通用的、可重用的信息（如联系方式或品牌资产）非常有用。
- **如何应用**：在运行 `aigne web update` 或 `aigne web generate` 时生效。

#### 输出与部署

**`pagesDir`**
- **用途**：WebSmith 保存生成的页面文件（例如 `page.yaml`、`_navigations.yaml`）的输出目录。
- **类型**：字符串（路径）
- **变更影响**：更改生成文件的保存位置。如果目录不存在，将自动创建。
- **如何应用**：更改在下一次生成时生效。

**`appUrl`**
- **用途**：网站的最终部署 URL。
- **类型**：字符串（URL 格式）
- **变更影响**：决定网站发布的平台。必须包含协议（`https://`）。
- **如何应用**：**仅在 `aigne web publish` 命令期间生效。**

**`checkoutId`**、**`shouldSyncAll`**、**`navigationType`**
- **用途**：这些是开发期间使用的临时变量。用户不应修改这些值，因为它们由系统自动管理。

#### 媒体与显示

**`media.minImageWidth`**
- **用途**：图片被包含所需的最小宽度（以像素为单位）。用于过滤掉低质量图片。
- **类型**：整数（像素）
- **变更影响**：较高的值可确保只使用高质量图片，但可能会减少可用图片的数量。
- **如何应用**：运行 `aigne web generate` 以重新筛选并应用新的图片选择。

**`lastGitHead`**
- **用途**：存储上次生成时的 Git 提交哈希值，用于增量更新。
- **类型**：字符串（Git 提交哈希值）
- **变更影响**：此值由系统自动管理，不应手动修改。

---

## 何时修改配置文件

### 调整核心功能

**场景 1：从单页网站升级到多页网站**
- **需修改字段**：`websiteScale`（例如，从 `singlePage` 改为 `standard`）
- **命令**：如果已生成文档，运行 `aigne web clear` 然后 `aigne web generate`。

**场景 2：更改网站用途**
- **需修改字段**：`pagePurpose`（例如，从 `saas` 改为 `ecommerce`）
- **命令**：如果已生成文档，运行 `aigne web clear` 然后 `aigne web generate`。

**场景 3：调整目标受众**
- **需修改字段**：`targetAudienceTypes`（例如，从 `customers` 改为 `businessOwners`）
- **命令**：如果已生成文档，运行 `aigne web clear` 然后 `aigne web generate`。

### 更新内容源

**场景 4：添加新的内容源**
- **需修改字段**：`sourcesPath`（添加新的文件或目录路径）
- **命令**：运行 `aigne web generate`。新的内容源将对 AI 可用。

### 优化与修复问题

**场景 5：提高图片质量**
- **需修改字段**：`media.minImageWidth`（例如，从 `600` 增加到 `1000`）
- **命令**：运行 `aigne web update` 或 `aigne web generate`。

**场景 6：优化 AI 生成的内容**
- **需修改字段**：`rules`（为结构、语气等添加更具体的指令）
- **命令**：运行 `aigne web update` 或 `aigne web generate`。

### 管理语言

**场景 7：添加新语言**
- **需修改字段**：`translateLanguages`（添加新的语言代码，例如 `fr`）
- **命令**：运行 `aigne web translate` 或 `aigne web update`。

**场景 8：更改主要语言**
- **需修改字段**：`locale`（例如，从 `zh` 改为 `en`）
- **命令**：运行 `aigne web clear` 然后 `aigne web generate`。

### 更新基本信息

**场景 9：更新项目品牌信息**
- **需修改字段**：`projectName`、`projectDesc`、`projectLogo`、`projectCover`
- **命令**：运行 `aigne web publish`。

**场景 10：设置部署 URL**
- **需修改字段**：`appUrl`
- **命令**：运行 `aigne web publish`。

---

## 如何应用配置变更

### 通过命令应用变更

应用不同字段的变更需要不同的命令：

- **功能性 (`pagePurpose`, `websiteScale`, `targetAudienceTypes`)**：
  - 如果内容已存在，运行 `aigne web clear` 然后 `aigne web generate`。
- **内容源 (`sourcesPath`, `defaultDatasources`)**：
  - `aigne web generate` 或 `aigne web update`。
- **问题修复 (`media.minImageWidth`, `rules`)**：
  - `aigne web update` 或 `aigne web generate`。
- **国际化**：
  - `translateLanguages`：`aigne web translate` 或 `aigne web update`。
  - `locale`：`aigne web clear` 然后 `aigne web generate`。
- **基本信息 (`projectName`, `appUrl`, 等)**：
  - `aigne web publish`。

### 工作流总结

1.  修改 `config.yaml` 文件。
2.  保存文件。
3.  根据您更改的字段运行相应的命令。
4.  通过检查生成的文件来验证更改是否已生效。

---

## 处理配置错误

### 常见错误

- **缩进不正确**：YAML 对缩进敏感。请统一使用空格（而非制表符）。
- **特殊字符**：键值对请使用标准英文冒号（`:`），而非其他字符。
- **值类型不正确**：在需要数组的地方提供了字符串（例如，`pagePurpose: landingPage` 而不是 `pagePurpose: [landingPage]`）。系统将回退到默认值。
- **缺少必填字段**：如果删除了关键字段，生成过程可能仍会继续，但会导致网站信息缺失（例如，没有标题）。
- **未知字段**：添加模式中不存在的字段将被系统忽略，不会导致错误。

### 检测与恢复

- **自动检测**：运行任何 `aigne web` 命令都会解析该文件。如果存在 YAML 语法错误，命令将失败并报告错误。
- **恢复计划**：
  1.  **版本控制**：最佳实践是使用版本控制系统（如 Git）管理您的 `config.yaml`。您可以恢复到之前可用的版本。
  2.  **验证与纠正**：仔细检查文件中的语法错误。与本指南中的示例进行比较。
  3.  **重新初始化**：如果文件严重损坏，您可以备份它，然后删除，并运行 `aigne web init` 生成一个新的、干净的配置。然后可以从备份中手动复制您的自定义设置。

### 系统稳健性

- **文件未找到**：系统将引导您运行 `aigne web init`。
- **YAML 解析失败**：系统将报告一个用户友好的错误。
- **未知字段**：多余的字段将被忽略。
- **值格式不正确**：系统将使用默认值。
- **缺少字段**：某些字段有默认值（`locale` 默认为 "en"）。

### 预防措施

1.  **使用版本控制**：将 `config.yaml` 保存在 Git 中。
2.  **定期备份**：在进行重大更改前创建备份。
3.  **使用命令行工具**：优先使用 `aigne web init` 进行初始设置，以避免手动错误。
4.  **更改后验证**：编辑后立即运行命令以检查错误。

---

## 常见问题解答

### Q1：如果我对配置文件的更改没有生效怎么办？
**A**：首先，确保文件已保存。其次，检查是否存在 YAML 格式错误。第三，确保您运行了正确的命令来应用特定更改（例如，对于 `projectName`，应运行 `aigne web publish`）。

### Q2：如何添加新语言？
**A**：在您的 `config.yaml` 文件中的 `translateLanguages` 数组中添加语言代码。然后，运行 `aigne web translate` 或 `aigne web update`。

### Q3：如果生成的内容不符合我的预期怎么办？
**A**：这通常是由于指导不足造成的。尝试让您的 `rules` 更加详细，将 `targetAudienceTypes` 调整得更具体，或者在您的 `sourcesPath` 中添加更多相关内容。

### Q4：如何修复配置文件中的格式错误？
**A**：最常见的错误是缩进不一致、使用非标准字符作为冒号以及数据类型不正确（例如，字符串而非数组）。请参考“如果配置文件损坏了会发生什么？”部分了解详细的恢复步骤。