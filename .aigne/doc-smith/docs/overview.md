# Overview

Need to launch a professional website but don't have time to code or hire a development team? AIGNE WebSmith automates the entire process, transforming your product brief into a complete, multi-page website with engaging content, modern design, and SEO optimization—all with a single command.

AIGNE WebSmith is an AI-driven tool that automatically creates professional websites from your vision and requirements. It is built on the [AIGNE Framework](https://www.aigne.io/framework) and leverages [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o) components to produce production-ready, responsive websites.

The tool addresses the common challenges of website creation: it's time-consuming to build, requires technical expertise, and maintaining content quality across multiple pages is difficult. By automating this process, WebSmith helps ensure your website is professional, consistent, and ready to launch in hours instead of weeks.

## Key Features

AIGNE WebSmith simplifies the entire website creation process with a suite of intelligent features.

<x-cards data-columns="3">
  <x-card data-title="AI-Powered Generation" data-icon="lucide:brain-circuit">
    WebSmith uses AI to intelligently plan your website's structure, generate engaging and relevant content for every page, and ensure it's optimized for search engines right from the start.
  </x-card>
  <x-card data-title="Professional Templates" data-icon="lucide:layout-template">
    Your website will be built using a library of modern, professionally designed components. The final templates are fully responsive, ensuring your site looks great on desktops, tablets, and mobile devices.
  </x-card>
  <x-card data-title="One-Click Publishing" data-icon="lucide:rocket">
    Once your website is generated, a single command is all it takes to publish it. WebSmith handles the entire process, providing you with a live URL to share with the world immediately.
  </x-card>
</x-cards>

## Core Capabilities

WebSmith provides a comprehensive set of features to handle the complete website lifecycle from concept to publication.

*   **AI-Powered Generation**: Analyzes your requirements to propose a logical website structure and generates content that effectively communicates your message to your target audience.
*   **Multi-Language Support**: Translates your website into 12 languages, including English, Chinese (Simplified), and Japanese. The translation process is context-aware to maintain brand voice and technical accuracy.
*   **Integration with LLMs**: Connects with various Large Language Models (LLMs). By default, it uses [AIGNE Hub](https://www.aigne.io/hub), a service that allows you to switch between models like Google Gemini and OpenAI GPT without needing separate API keys. You can also configure your own API keys for direct provider access.
*   **Professional Design with Pages Kit**: Generates websites using [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o), a library of modern, responsive components. Every section looks production-ready and works seamlessly across desktop, tablet, and mobile devices.
*   **Smart Updates**: Detects changes in your requirements and updates the corresponding pages of your website. You can also provide specific feedback to refine generated content.
*   **Publishing Options**: Publish your website with a single command. You can deploy to WebSmith Cloud or your own custom domain with full control over deployment configuration.

## How It Works

WebSmith operates by analyzing your requirements to understand your vision, target audience, and desired functionality. Based on this analysis, it generates a complete website set, from navigation structure to detailed page content and styling.

```d2
direction: down

Requirements: {
  label: "Product Brief & Requirements"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Planning-Engine: {
    label: "Planning Engine"
    shape: rectangle
  }

  Generation-Engine: {
    label: "Generation Engine"
    shape: rectangle
  }

  Theme-Engine: {
    label: "Theme Engine"
    shape: rectangle
  }

  LLMs: {
    label: "Large Language Models"
    shape: rectangle

    AIGNE-Hub: {
      label: "AIGNE Hub"
    }

    Direct-Access: {
      label: "Direct Access"
      shape: rectangle
      Google-Gemini: {}
      OpenAI-GPT: {}
    }
  }
}

Pages-Kit: {
  label: "Pages Kit Components"
  shape: rectangle
}

Published-Website: {
  label: "Published Website"
  shape: rectangle

  WebSmith-Cloud: {
    label: "WebSmith Cloud"
  }

  Custom-Domain: {
    label: "Custom Domain"
  }
}

Requirements -> AIGNE-WebSmith.Planning-Engine: "Analyzes"
AIGNE-WebSmith.Planning-Engine -> AIGNE-WebSmith.Generation-Engine: "Plans"
AIGNE-WebSmith.Generation-Engine <-> AIGNE-WebSmith.LLMs: "Utilizes"
AIGNE-WebSmith.Generation-Engine -> AIGNE-WebSmith.Theme-Engine: "Generates"
AIGNE-WebSmith.Theme-Engine -> Pages-Kit: "Applies"
Pages-Kit -> Published-Website: "Publishes"
```

1.  **Describe Your Website**: You start by creating a simple file that outlines what your website is about, who your target audience is, and what pages you need. This could be for a new SaaS product, a personal portfolio, or a technical documentation hub.
2.  **Generate with a Command**: You run the `aigne web generate` command. The AI analyzes your requirements, plans an optimal site structure, writes all the content, and assembles the pages using professional design components.
3.  **Publish Instantly**: Once you're ready, you run the `aigne web publish` command. WebSmith uploads all the necessary files and provides you with a live URL for your new website.

## Available Commands

WebSmith is operated through a command-line interface. The following table provides a summary of the main commands and their functions.

| Command | Description |
| :--- | :--- |
| `generate` | Creates a new website from your requirements and content brief. |
| `update` | Modifies existing pages based on feedback or requirement changes. |
| `translate` | Translates your website into one or more of the 12 supported languages. |
| `publish` | Deploys your website to a live, accessible URL. |
| `theme` | Generates or updates the visual theme and styling of your website. |
| `history` | Views the history of updates made to your website. |
| `chat` | Starts an interactive mode session to generate and manage your website. |
| `clear` | Removes generated files, configurations, and cached data. |
| `init` | Guides you through an interactive process to create an initial configuration file. |
| `prefs` | Manages saved preferences and configurations for website generation. |

## Who is WebSmith for?

AIGNE WebSmith is ideal for anyone who needs to create a high-quality website quickly, including:

- **Small and Medium Business Owners**: Launch a professional web presence to attract customers.
- **Developers & Startups**: Quickly create marketing sites, landing pages, or product showcases.
- **Marketers**: Deploy campaign sites and content hubs without relying on development teams.
- **Agencies**: Rapidly prototype and deliver client websites with consistent quality.

## Next Steps

Ready to create your first website? Follow our comprehensive guide to get started.

<x-cards>
  <x-card data-title="Getting Started" data-icon="lucide:rocket" data-href="/getting-started">
    Follow our step-by-step guide to install AIGNE WebSmith, connect to AIGNE Hub, and generate your first professional website in under 30 minutes.
  </x-card>
</x-cards>
