# 方法论

一个高质量网站的起点并非巧妙的提示词，而是结构良好、质量上乘的知识。本指南提供了一套战略方法论，用于准备您的内容，以便通过 AIGNE WebSmith 获得最佳效果。系统的输出质量直接反映了输入内容的质量。

## 核心原则：以知识为基石

WebSmith 是一个知识转化系统；它将您的专业知识转化为一个功能完备的网站。因此，生成网站的质量受限于您提供的源材料的质量。要创建一个卓越的网站，您必须首先以 AI 能够有效利用的方式来构建您的知识。本节概述了一种渐进式构建知识库的方法，从快速入门到可扩展的系统化方法论。下图展示了这种渐进式方法。

```d2
direction: down

Knowledge-Preparation-Methodology: {
  label: "渐进式知识准备方法论"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Level-1: {
    label: "级别 1：最小可行数据源"
    shape: rectangle
    style.fill: "#f0f9ff"

    Input-1: {
      label: "输入：单个文档\n（例如，README）"
      shape: rectangle
    }

    Process-1: {
      label: "过程：生成与迭代"
      shape: diamond
    }

    Output-1: {
      label: "输出：功能性网站"
      shape: rectangle
    }
  }

  Level-2: {
    label: "级别 2：战略性数据源（推荐）"
    shape: rectangle
    style.fill: "#e6f7ff"

    Input-2: {
      label: "输入：结构化内容简报\n（受众、价值、意图、证据）"
      shape: rectangle
    }

    Process-2: {
      label: "过程：战略性生成与评估"
      shape: diamond
    }

    Output-2: {
      label: "输出：有效且有针对性的网站"
      shape: rectangle
    }
  }

  Level-3: {
    label: "级别 3：模块化知识系统（高级）"
    shape: rectangle
    style.fill: "#bae0ff"

    Input-3: {
      label: "输入：模块化知识库\n（单一事实来源）"
      shape: rectangle
    }

    Process-3: {
      label: "过程：组合、生成与传播"
      shape: diamond
    }

    Output-3: {
      label: "输出：可扩展、一致的网站"
      shape: rectangle
    }
  }
}

Knowledge-Preparation-Methodology.Level-1.Input-1 -> Knowledge-Preparation-Methodology.Level-1.Process-1
Knowledge-Preparation-Methodology.Level-1.Process-1 -> Knowledge-Preparation-Methodology.Level-1.Output-1
Knowledge-Preparation-Methodology.Level-1 -> Knowledge-Preparation-Methodology.Level-2: "复杂度增加"
Knowledge-Preparation-Methodology.Level-2.Input-2 -> Knowledge-Preparation-Methodology.Level-2.Process-2
Knowledge-Preparation-Methodology.Level-2.Process-2 -> Knowledge-Preparation-Methodology.Level-2.Output-2
Knowledge-Preparation-Methodology.Level-2 -> Knowledge-Preparation-Methodology.Level-3: "复杂度增加"
Knowledge-Preparation-Methodology.Level-3.Input-3 -> Knowledge-Preparation-Methodology.Level-3.Process-3
Knowledge-Preparation-Methodology.Level-3.Process-3 -> Knowledge-Preparation-Methodology.Level-3.Output-3
```

## 级别 1：最小可行数据源

这种方法旨在 30 分钟内生成一个功能性网站，非常适合简单项目或需要快速入门的用户。

### 要求

-   一份主要文档，如 README 或产品描述，至少包含 500 字。
-   对“这个产品/服务是什么，为谁服务？”这个问题有一个清晰、简洁的回答。
-   3 到 5 张与内容相关的高质量图片。

### 流程

1.  **配置 `sourcesPath`**：在您的 `websmith-config.yaml` 文件中，将 `sourcesPath` 指向包含您主要文档的目录。
2.  **生成**：运行 `websmith generate` 命令。
3.  **审查与迭代**：检查初始网站，找出需要改进的地方。优化您的源文档并重新生成。

这个级别对于已有文档的直接产品非常有效。但是，对于信息复杂、目标受众多样或价值主张微妙的项目来说，这可能不够。

## 级别 2：战略性数据源（推荐）

要创建一个能有效传达您的市场定位并与目标受众产生共鸣的网站，需要采用更具战略性的方法。这包括在生成之前将原始信息提炼成结构化的内容简报。

### 1. 定义战略背景

首先，通过在一个专门的文档中回答以下核心问题，建立一个清晰的基础：

-   **受众**：您试图触达的主要和次要受众是谁？
-   **问题**：您的产品或服务为他们解决了什么具体问题？
-   **差异化**：您的解决方案与替代方案有何不同？避免泛泛的市场宣传，专注于切实的差异。
-   **行动号召 (CTA)**：您希望访问者采取的最重要的一个行动是什么？

### 2. 将价值与受众匹配

创建一个价值矩阵，阐明您的解决方案如何惠及每个受众群体。这能确保信息传递是量身定制且相关的。

| 受众 | 功能价值 | 情感价值 | 证据 |
| :--- | :--- | :--- | :--- |
| **开发者** | API 优先设计，全面的 SDK | 对可靠性的信心，易于使用 | 99.99% 正常运行时间 SLA，50+ 代码示例 |
| **商业领袖** | 降低 40% 的处理成本 | 安全安心，竞争优势 | PCI DSS 1 级合规，财富 500 强客户 |

### 3. 有意图地规划内容

通过定义每个部分的目的，而不仅仅是其内容，来构建您的内容大纲。这确保了页面的每个部分都服务于一个战略目标。

```markdown
# 首页内容大纲

## 部分：首屏
- **意图**：立即阐明产品的用途和目标受众。
- **关键信息**：“为现代应用打造的支付基础设施。”
- **支撑要点**：“受到全球 10,000+ 开发者的信赖。”
- **行动号召**：“开始构建”

## 部分：问题陈述
- **意图**：与受众的具体痛点产生共鸣。
- **关键信息**：“支付集成不应耗时数月。”
- **支撑证据**：包含真实引述或常见困扰。
```

### 4. 收集证据和资产

收集高质量的资产来证实您的声明。信誉建立在证据之上，而不仅仅是断言。

-   客户推荐和详细的案例研究。
-   量化的使用指标和性能数据。
-   真实的产品截图和演示视频。
-   竞争对手分析，以明确您的独特定位。

### 5. 生成与评估

运行生成命令后，根据您的战略目标评估输出结果：

-   生成的内容是否实现了每个部分设定的**意图**？
-   在浏览页面的前 10 秒内，核心价值主张是否清晰？
-   所有重要声明是否都有您提供的**证据**支持？
-   用户旅程是否逻辑清晰地导向主要的行动号召？

更新您的源文档以填补任何已发现的空白，然后重新生成。计划进行 2-3 轮优化迭代，以达到完善的效果。

## 级别 3：模块化知识系统（高级）

对于管理多个产品、维护多个网站或需要大规模保持信息一致性的组织而言，将知识视为可复用资产是最有效的策略。

### 模块化知识架构

将您的组织知识分解为按领域组织的、离散且专注的 Markdown 文件。这创建了一个单一事实来源，可以为不同情境选择性地组合使用。

推荐的目录结构：

```sh
knowledge-base/
├── 01_foundation/
│   ├── mission-vision.md
│   └── brand-voice-guidelines.md
├── 02_products/
│   ├── product-a-overview.md
│   ├── product-a-features.md
│   └── product-a-technical-specs.md
├── 03_proof-points/
│   ├── customer-testimonials.md
│   └── case-study-enterprise-x.md
└── 04_audiences/
    ├── developer-persona.md
    └── business-buyer-persona.md
```

### 针对情境进行组合

通过将 WebSmith 指向这些模块化文件的不同组合，可以生成不同的网页。

-   **开发者门户**：由 `product-a-technical-specs.md`、`developer-persona.md` 和相关的 `proof-points/` 组合而成。
-   **营销网站**：由 `product-a-overview.md`、`product-a-features.md` 和 `case-study-enterprise-x.md` 组合而成。

### 模块化系统的优势

-   **一致性**：确保核心信息和产品细节在所有数字资产中保持一致。
-   **效率**：更新一个知识模块会自动将更改传播到所有使用它的网站。
-   **可扩展性**：随着产品和网站数量的增长，简化了内容管理。
-   **协作**：允许领域专家拥有并维护特定的知识模块，从而提高准确性和质量。

## 最佳实践与常见错误

遵循经过验证的模式并避免常见陷阱将显著提高您生成网站的质量。

### 优质数据源的特点

-   **具体且明确**：用可衡量的事实替代模糊的陈述。
    -   **避免**：“我们提供最佳解决方案。”
    -   **推荐**：“我们将支付处理时间从 3 周缩短到 2 天。”
-   **有据可依**：用数据、推荐或案例研究支持每一项声明。
    -   **避免**：“我们的客户都喜欢我们。”
    -   **推荐**：“在 G2 上评分为 4.8/5，客户续订率达 94%。”
-   **了解受众**：根据目标读者调整语言和信息。为开发者提供技术细节，为决策者提供业务成果。
-   **专注且结构化**：将大主题分解为更小的、逻辑清晰的文档，每个文档都有明确的目的。

### 需要避免的常见错误

-   **假设 AI 会“自行解决”**：AI 会放大其接收到的信息。模糊的输入总是导致模糊的输出。要明确您的定位和受众。
-   **只提供功能列表**：没有上下文的功能是毫无意义的。将每个功能与其解决的问题和提供的好处联系起来。
-   **将知识与格式化指令混合**：不要在源文件中包含诸如“让这部分更精彩”之类的风格指令。使用 `websmith-config.yaml` 的 `rules` 部分来指导风格和语调。
-   **使用单一、庞大的文档**：庞大的文档使 AI 难以辨别结构和优先级。将知识分解为专注的、特定主题的文件。
-   **跳过迭代**：首次生成的输出应被视为草稿。计划一个多步骤流程，包括评估、优化源材料和重新生成。

## 总结

由 AIGNE WebSmith 生成的网站质量并非由提示词工程决定，而是由源知识的质量和结构决定。通过采用渐进式方法论——从简单开始，逐步发展到战略性方法，最终构建一个模块化知识系统——您可以产出清晰、引人注目且持续高质量的网站。

如需更多实践指导，请继续阅读[入门指南](./getting-started.md)。