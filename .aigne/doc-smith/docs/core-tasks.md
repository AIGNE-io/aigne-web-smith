# Core Tasks

Once you have completed the initial setup and generated your first website, you will primarily use a set of core commands for day-to-day operations. This section provides a practical overview of these essential tasks, such as generating the site, publishing updates, refining content, and managing translations.

Each task is designed to be a straightforward command-line operation. The typical workflow involves generating the initial site, iteratively updating its content or structure, and then publishing the changes.

### Standard Workflow

The following diagram illustrates the standard, sequential workflow for creating and maintaining a website with WebSmith.

```d2
direction: down

config: {
  label: "1. Define Requirements\n(e.g., my-website.yaml)"
  shape: rectangle
}

generate: {
  label: "2. Generate Website\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. Refine Content\n`aigne web update`"
  shape: rectangle
}

publish: {
  label: "4. Publish Website\n`aigne web publish`"
  shape: rectangle
}

live_site: {
  label: "Live Website"
  shape: cylinder
}

config -> generate: "Initial Creation"
generate -> update: "Review & Refine"
update -> update: "Iterative Changes"
update -> publish: "Deploy Changes"
publish -> live_site: "Go Live"
```

Below you will find detailed guides for each of these core tasks.

<x-cards data-columns="2">
  <x-card data-title="Generating a Website" data-icon="lucide:bot" data-href="/core-tasks/generating-a-website">
    Learn how to use the `generate` command to create a complete website from a configuration file that outlines your requirements.
  </x-card>
  <x-card data-title="Publishing Your Website" data-icon="lucide:upload-cloud" data-href="/core-tasks/publishing-your-website">
    Explore the different options for publishing your website, from the free WebSmith Cloud to your own custom domain.
  </x-card>
  <x-card data-title="Updating Website Content" data-icon="lucide:file-pen-line" data-href="/core-tasks/updating-website-content">
    Understand how to use the `update` command to make changes or provide feedback to refine the content on your existing pages.
  </x-card>
  <x-card data-title="Translating Your Content" data-icon="lucide:languages" data-href="/core-tasks/translating-your-content">
    Use the `translate` command to automatically create different language versions of your website pages.
  </x-card>
  <x-card data-title="Managing Themes" data-icon="lucide:palette" data-href="/core-tasks/managing-themes">
    Covers how to use the `theme` command to generate and apply different visual styles and color schemes to your website.
  </x-card>
  <x-card data-title="Managing Components" data-icon="lucide:cubes" data-href="/core-tasks/managing-components">
    Explains how to use the `component` command to pull and update the component library used to build your website.
  </x-card>
  <x-card data-title="Using the Interactive Chat" data-icon="lucide:message-square-plus" data-href="/core-tasks/using-the-interactive-chat">
    Learn how to use the `chat` command to interactively build and modify your website in a conversational way.
  </x-card>
  <x-card data-title="Managing Preferences" data-icon="lucide:settings-2" data-href="/core-tasks/managing-preferences">
    Explains how to use the `prefs` command to view, manage, and clear saved user preferences to customize WebSmith's behavior.
  </x-card>
  <x-card data-title="Viewing Update History" data-icon="lucide:history" data-href="/core-tasks/viewing-update-history">
    Learn how to use the `history` command to review a log of all previous updates made to your website content and structure.
  </x-card>
  <x-card data-title="Clearing Workspace and Data" data-icon="lucide:trash-2" data-href="/core-tasks/clearing-generated-content">
    Shows you how to use the `clear` command to safely remove generated files, workspace data, or the entire configuration.
  </x-card>
</x-cards>

---

This section covers the fundamental commands for managing your website. For a comprehensive list of all available commands and their parameters, please consult the [Command Line Reference](./reference-command-line-reference.md).