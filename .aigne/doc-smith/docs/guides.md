# Guides

Once you have completed the initial setup and generated your first website, you will primarily use a set of guides for day-to-day operations. This hub summarizes the most common workflows—generate, publish, refine content, localize, and adjust styling—so you can jump straight to the task you need.

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

Below you will find detailed guides for each of these workflows.

<x-cards data-columns="2">
  <x-card data-title="Generate Website" data-icon="lucide:bot" data-href="/guides/generate-website">
    Learn how to use the `generate` command to create a complete website from a configuration file that outlines your requirements.
  </x-card>
  <x-card data-title="Publish Website" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    Explore the different options for publishing your website, from the free WebSmith Cloud to your own custom domain.
  </x-card>
  <x-card data-title="Update Website" data-icon="lucide:file-pen-line" data-href="/guides-update-website">
    Understand when to update your structure versus a single page, then jump to the detailed guides for each workflow.
  </x-card>
  <x-card data-title="Localize Website" data-icon="lucide:languages" data-href="/guides/localize-website">
    Use the `translate` command to automatically create different language versions of your website pages.
  </x-card>
  <x-card data-title="Customize Theme" data-icon="lucide:palette" data-href="/guides/customize-theme">
    Covers how to use the `theme` command to generate and apply different visual styles and color schemes to your website.
  </x-card>
  <x-card data-title="Use Custom Component Libraries" data-icon="lucide:cubes" data-href="/advanced-features/use-custom-component-libraries">
    Explains how to use the `component` command to pull and update the component library used to build your website.
  </x-card>
  <x-card data-title="Use Interactive Chat (Beta)" data-icon="lucide:message-square-plus" data-href="/guides/use-interactive-chat-beta">
    Learn how to use the `chat` command to interactively build and modify your website in a conversational way.
  </x-card>
  <x-card data-title="Manage Preferences" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    Explains how to use the `prefs` command to view, manage, and clear saved user preferences to customize WebSmith's behavior.
  </x-card>
  <x-card data-title="View Update History" data-icon="lucide:history" data-href="/guides/view-update-history">
    Learn how to use the `history` command to review a log of all previous updates made to your website content and structure.
  </x-card>
  <x-card data-title="Cleanup Workspace" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    Shows you how to use the `clear` command to safely remove generated files, workspace data, or the entire configuration.
  </x-card>
</x-cards>

---

This section covers the fundamental commands for managing your website. For a comprehensive list of all available commands and their parameters, please consult the [Command Line Reference](./reference-command-line-reference.md).
