# Publishing Your Website

Once your website has been generated, the next step is to make it accessible on the internet. This process is known as publishing. AIGNE WebSmith simplifies this task by providing a single command, `aigne web publish`, which offers several destination options to suit different needs, from quick free hosting to professional custom domains.

This section provides an overview of the available publishing choices. Each option is detailed in its own guide to provide clear, step-by-step instructions.

### Publishing Options

WebSmith offers three primary methods for publishing your website. Select the one that best aligns with your project's requirements.

<x-cards data-columns="3">
  <x-card data-title="Publish to WebSmith Cloud" data-icon="lucide:cloud" data-href="/core-tasks/publishing-your-website/cloud">
    The quickest way to get your site online. Use our free, public hosting service. This option is ideal for testing, open-source projects, or community sharing.
  </x-card>
  <x-card data-title="Publish to Your Own Website" data-icon="lucide:server" data-href="/core-tasks/publishing-your-website/custom">
    For users who already have a website built on the ArcBlock platform. This guide explains how to integrate and publish your newly generated pages to your existing infrastructure.
  </x-card>
  <x-card data-title="Publish to a New Dedicated Website" data-icon="lucide:globe" data-href="/core-tasks/publishing-your-website/new-dedicated-website">
    A paid service that creates a new, dedicated website with custom domain and hosting capabilities. This is the recommended choice for professional and commercial use.
  </x-card>
</x-cards>

### The Publishing Process

The publishing process is handled by the `aigne web publish` command. When you run this command for the first time without any prior configuration, WebSmith will launch an interactive prompt to guide you through selecting one of the options described above.

The general workflow is as follows:

```d2
direction: down

user: {
  shape: c4-person
  label: "User"
}

cli: {
  label: "AIGNE CLI"
}

interactive-prompt: {
  label: "Interactive Prompt"
  shape: diamond
}

websmith-cloud: {
  label: "WebSmith Cloud"
  shape: cylinder
}

existing-website: {
  label: "Existing Website"
  shape: cylinder
}

new-website: {
  label: "New Dedicated Website"
  shape: cylinder
}

user -> cli: "Runs `aigne web publish`"
cli -> interactive-prompt: "Is publishing destination configured?"

interactive-prompt -> websmith-cloud: "No -> Select 'WebSmith Cloud'"
interactive-prompt -> existing-website: "No -> Select 'Existing Website'"
interactive-prompt -> new-website: "No -> Select 'New Website'"
interactive-prompt -> existing-website: "Yes"
```

### Getting Started

To begin, simply run the publish command in your terminal.

```bash
aigne web publish
```

If this is your first time publishing, you will be prompted to choose a destination. For detailed instructions on each option, please refer to the specific guides linked above.

### Summary

WebSmith provides a flexible publishing system to accommodate various deployment scenarios. You can start with free cloud hosting and later transition to a custom or dedicated website as your needs evolve.

To proceed, select one of the publishing guides from the options above. We recommend starting with [Publish to WebSmith Cloud](./core-tasks-publishing-your-website-cloud.md) for a fast and straightforward initial deployment.