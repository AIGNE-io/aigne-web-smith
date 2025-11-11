# Methodology

A high-quality website begins not with clever prompts, but with well-structured, high-quality knowledge. This guide provides a strategic methodology for preparing your content to achieve the best possible results with AIGNE WebSmith. The system's output is a direct reflection of the input's quality.

## Core Principle: Knowledge as the Foundation

WebSmith is a knowledge transformation system; it converts your expertise into a functional website. The quality of the generated site is therefore limited by the quality of the source material you provide. To create a superior website, you must first structure your knowledge in a way the AI can effectively utilize. This section outlines a progressive approach to building your knowledge base, from a quick start to a scalable, systematic methodology. The following diagram illustrates this progressive approach.

```d2
direction: down

Knowledge-Preparation-Methodology: {
  label: "Progressive Knowledge Preparation Methodology"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Level-1: {
    label: "Level 1: Minimum Viable Data Source"
    shape: rectangle
    style.fill: "#f0f9ff"

    Input-1: {
      label: "Input: Single Document\n(e.g., README)"
      shape: rectangle
    }

    Process-1: {
      label: "Process: Generate & Iterate"
      shape: diamond
    }

    Output-1: {
      label: "Output: Functional Website"
      shape: rectangle
    }
  }

  Level-2: {
    label: "Level 2: Strategic Data Source (Recommended)"
    shape: rectangle
    style.fill: "#e6f7ff"

    Input-2: {
      label: "Input: Structured Content Briefs\n(Audience, Value, Intent, Evidence)"
      shape: rectangle
    }

    Process-2: {
      label: "Process: Generate & Evaluate Strategically"
      shape: diamond
    }

    Output-2: {
      label: "Output: Effective, Targeted Website"
      shape: rectangle
    }
  }

  Level-3: {
    label: "Level 3: Modular Knowledge System (Advanced)"
    shape: rectangle
    style.fill: "#bae0ff"

    Input-3: {
      label: "Input: Modular Knowledge Base\n(Single Source of Truth)"
      shape: rectangle
    }

    Process-3: {
      label: "Process: Compose, Generate, & Propagate"
      shape: diamond
    }

    Output-3: {
      label: "Output: Scalable, Consistent Websites"
      shape: rectangle
    }
  }
}

Knowledge-Preparation-Methodology.Level-1.Input-1 -> Knowledge-Preparation-Methodology.Level-1.Process-1
Knowledge-Preparation-Methodology.Level-1.Process-1 -> Knowledge-Preparation-Methodology.Level-1.Output-1
Knowledge-Preparation-Methodology.Level-1 -> Knowledge-Preparation-Methodology.Level-2: "Increased Sophistication"
Knowledge-Preparation-Methodology.Level-2.Input-2 -> Knowledge-Preparation-Methodology.Level-2.Process-2
Knowledge-Preparation-Methodology.Level-2.Process-2 -> Knowledge-Preparation-Methodology.Level-2.Output-2
Knowledge-Preparation-Methodology.Level-2 -> Knowledge-Preparation-Methodology.Level-3: "Increased Sophistication"
Knowledge-Preparation-Methodology.Level-3.Input-3 -> Knowledge-Preparation-Methodology.Level-3.Process-3
Knowledge-Preparation-Methodology.Level-3.Process-3 -> Knowledge-Preparation-Methodology.Level-3.Output-3

```

## Level 1: Minimum Viable Data Source

This approach is designed to generate a functional website in under 30 minutes, making it ideal for simple projects or for users who need to get started quickly.

### Requirements

- A primary document, such as a README or product description, with at least 500 words.
- A clear, concise answer to the question: "What is this product/service, and who is it for?"
- 3 to 5 high-quality images relevant to the content.

### Process

1.  **Configure `sourcesPath`**: In your `websmith-config.yaml`, point the `sourcesPath` to the directory containing your primary document(s).
2.  **Generate**: Run the `websmith generate` command.
3.  **Review and Iterate**: Examine the initial website and identify areas for improvement. Refine your source document and regenerate.

This level is effective for straightforward products with existing documentation. However, it may not be sufficient for projects with complex messaging, multiple target audiences, or nuanced value propositions.

## Level 2: Strategic Data Source (Recommended)

For a website that effectively communicates your market position and resonates with your target audience, a more strategic approach is necessary. This involves refining raw information into a structured content brief before generation.

### 1. Define Strategic Context

First, establish a clear foundation by answering these core questions in a dedicated document:

-   **Audience**: Who are the primary and secondary audiences you are trying to reach?
-   **Problem**: What specific problem does your product or service solve for them?
-   **Differentiation**: What makes your solution distinct from alternatives? Avoid generic marketing claims and focus on tangible differences.
-   **Call to Action (CTA)**: What is the single most important action you want a visitor to take?

### 2. Map Value to Audience

Create a value matrix to articulate how your solution benefits each audience segment. This ensures messaging is tailored and relevant.

| Audience                  | Functional Value                               | Emotional Value                                | Evidence                                        |
| :------------------------ | :--------------------------------------------- | :--------------------------------------------- | :---------------------------------------------- |
| **Developers**            | API-first design, comprehensive SDKs           | Confidence in reliability, ease of use         | 99.99% uptime SLA, 50+ code examples            |
| **Business Leaders**      | Reduce processing costs by 40%                 | Security peace of mind, competitive advantage  | PCI DSS Level 1 compliance, Fortune 500 clients |

### 3. Outline Content with Intent

Structure your content outline by defining the purpose of each section, not just its content. This ensures every part of the page serves a strategic goal.

```markdown
# Home Page Content Outline

## Section: Hero
- **Intent**: Immediately clarify the product's purpose and target audience.
- **Key Message**: "Payment infrastructure for modern applications."
- **Supporting Points**: "Trusted by 10,000+ developers worldwide."
- **CTA**: "Start Building"

## Section: Problem Statement
- **Intent**: Resonate with the specific pain points of the audience.
- **Key Message**: "Payment integration shouldn't take months."
- **Supporting Evidence**: Include real quotes or common frustrations.
```

### 4. Gather Evidence and Assets

Collect high-quality assets that substantiate your claims. Credibility is built on proof, not just assertions.

-   Customer testimonials and detailed case studies.
-   Quantitative usage metrics and performance data.
-   Authentic product screenshots and demonstration videos.
-   Competitor analysis to inform your unique positioning.

### 5. Generate and Evaluate

After running the generation command, assess the output against your strategic goals:

-   Does the generated content fulfill the defined **intent** for each section?
-   Is the core value proposition clear within the first 10 seconds of viewing the page?
-   Are all significant claims supported by the **evidence** you provided?
-   Does the user journey flow logically toward the primary call to action?

Update your source documents to fill any identified gaps and regenerate. Plan for 2-3 refinement cycles to achieve a polished result.

## Level 3: Modular Knowledge System (Advanced)

For organizations that manage multiple products, maintain several websites, or require consistent messaging at scale, treating knowledge as a reusable asset is the most effective strategy.

### Modular Knowledge Architecture

Decompose your organizational knowledge into discrete, focused Markdown files organized by domain. This creates a single source of truth that can be selectively combined for different contexts.

A recommended directory structure:

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

### Composition for Context

Different web pages can be generated by pointing WebSmith to different combinations of these modular files.

-   **Developer Portal**: Composed from `product-a-technical-specs.md`, `developer-persona.md`, and relevant `proof-points/`.
-   **Marketing Site**: Composed from `product-a-overview.md`, `product-a-features.md`, and `case-study-enterprise-x.md`.

### Benefits of a Modular System

-   **Consistency**: Ensures that core messaging and product details are identical across all digital properties.
-   **Efficiency**: Updating a single knowledge module automatically propagates the change to all websites that use it.
-   **Scalability**: Simplifies content management as the number of products and websites grows.
-   **Collaboration**: Allows domain experts to own and maintain specific knowledge modules, improving accuracy and quality.

## Best Practices and Common Mistakes

Adhering to proven patterns and avoiding common pitfalls will significantly improve the quality of your generated website.

### Hallmarks of a Good Data Source

-   **Specific and Concrete**: Replace vague statements with measurable facts.
    -   **Avoid**: "We offer the best solutions."
    -   **Prefer**: "We reduce payment processing time from 3 weeks to 2 days."
-   **Evidence-Backed**: Support every claim with data, testimonials, or case studies.
    -   **Avoid**: "Our customers love us."
    -   **Prefer**: "Rated 4.8/5 on G2 with a 94% customer renewal rate."
-   **Audience-Aware**: Tailor language and information to the target reader. Provide technical details for developers and business outcomes for decision-makers.
-   **Focused and Structured**: Break down large topics into smaller, logically organized documents, each with a clear purpose.

### Common Mistakes to Avoid

-   **Assuming the AI Will "Figure It Out"**: The AI amplifies the information it is given. Vague input will always result in vague output. Be explicit about your positioning and audience.
-   **Providing Only Feature Lists**: Features are meaningless without context. Connect each feature to the problem it solves and the benefit it provides.
-   **Mixing Knowledge with Formatting Instructions**: Do not include stylistic commands like "make this section more exciting" in your source files. Use the `rules` section of `websmith-config.yaml` to guide style and tone.
-   **Using a Single, Large Document**: A monolithic document makes it difficult for the AI to discern structure and priority. Decompose knowledge into focused, topic-specific files.
-   **Skipping Iteration**: The first generated output should be treated as a draft. Plan for a multi-step process of evaluation, refinement of source material, and regeneration.

## Summary

The quality of a website generated by AIGNE WebSmith is not determined by prompt engineering, but by the quality and structure of the source knowledge. By adopting a progressive methodology—starting simple, advancing to a strategic approach, and eventually building a modular knowledge system—you can produce websites that are clear, compelling, and consistently high-quality.

For more hands-on guidance, proceed to the [Getting Started](./getting-started.md) guide.