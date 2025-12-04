# Overview

This document provides a high-level introduction to AIGNE WebSmith. By the end, you will understand its core purpose, key features, and the fundamental workflow it uses to automate the creation of professional websites, from initial planning to final publication.

AIGNE WebSmith is an AI-driven tool that automates the creation of professional, SEO-optimized websites. It generates complete content and templates based on your provided source materials and can publish the final site directly. The system is designed to streamline the entire web development process, minimizing manual effort and technical requirements.

## Key Features

WebSmith offers a comprehensive set of features for automated website creation and management. The system is organized around four main capabilities: AI-driven generation, a professional template system, quality assurance, and direct publishing.

| Feature Area | Description |
| :--- | :--- |
| **AI-Powered Generation** | Utilizes AI to analyze requirements, plan an optimal site structure, generate detailed content for all pages in a single operation, and apply SEO best practices. It supports both English and Chinese content generation. |
| **Professional Templates** | Creates templates compatible with Pages Kit, using a component-based design with elements like Hero, CTA, and FAQ. The templates are responsive, adapting to both mobile and desktop displays. |
| **Quality Assurance** | Includes an automated evaluation system to assess website architecture, user experience, and content consistency. It is supported by a suite of over 32 test cases covering core functions. |
| **One-Click Publishing** | Enables direct, batch publishing of multi-page websites to Pages Kit. It provides status monitoring and delivers public access links immediately after a successful deployment. |

## How It Works

WebSmith employs a series of specialized AI agents that work sequentially to build and deploy a website. Each agent is responsible for a specific stage of the process, ensuring a structured and reliable workflow from conception to publication.

The following diagram illustrates this sequential process:

<!-- DIAGRAM_IMAGE_START:architecture:16:9 -->
![Overview](assets/diagram/overview-diagram-0.jpg)
<!-- DIAGRAM_IMAGE_END -->

The process is as follows:

1.  **Structure Planning**: An agent analyzes your project requirements to design an intelligent and logical website architecture.
2.  **Content Generation**: Based on the planned structure, another agent generates high-quality, relevant content for each page.
3.  **Template Generation**: A third agent takes the generated content and assembles it into professional, component-based templates.
4.  **Evaluation & Publishing**: Finally, evaluation agents assess the quality of the output before the publishing agent uploads the completed website.

This modular, agent-based architecture ensures that each step is handled by a specialized process, resulting in a consistent and high-quality final product.

## Core Components

The functionality of WebSmith is delivered through a set of distinct command-line interface (CLI) commands. Each command corresponds to a core component or workflow within the system.

<x-cards data-columns="2">
  <x-card data-title="Generate" data-icon="lucide:bot" data-href="/guides/create-website">
    Generates a complete website, including structure and content, from user-defined requirements.
  </x-card>
  <x-card data-title="Publish" data-icon="lucide:rocket" data-href="/guides/publish-website">
    Publishes the generated website to various targets, including WebSmith Cloud or your own infrastructure.
  </x-card>
  <x-card data-title="Update" data-icon="lucide:file-pen-line" data-href="/guides/update-website">
    Modifies the content or structure of an existing website based on new feedback or requirements.
  </x-card>
  <x-card data-title="Translate" data-icon="lucide:languages" data-href="/guides/localize-website">
    Translates existing website content into multiple languages, such as Chinese, Japanese, French, and German.
  </x-card>
  <x-card data-title="Theme" data-icon="lucide:palette" data-href="/guides/customize-theme">
    Manages visual themes by generating and applying different styles and color schemes to the website.
  </x-card>
  <x-card data-title="Component" data-icon="lucide:library" data-href="/advanced-features/use-custom-component-libraries">
    Manages the component library used to build the visual elements of your website.
  </x-card>
</x-cards>

## Summary

This overview has introduced the primary functions and architecture of AIGNE WebSmith. You should now have a foundational understanding of what WebSmith is, its main features, and the commands used to interact with it.

For your next steps, we recommend proceeding to the [Getting Started](./getting-started.md) guide, which provides a step-by-step tutorial to install, configure, and generate your first website.