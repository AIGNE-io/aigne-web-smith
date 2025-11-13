# Publish Website

As soon as your pages look good locally, run `aigne web publish` to push them live. The command uses the same flow every time—pick a destination, authorize once, and WebSmith uploads all pages plus assets for you.

## Fastest path (WebSmith Cloud)

If you just need a public URL, follow these steps:

1. **Run the command**  
   ```bash Quick publish icon=lucide:terminal
   aigne web publish
   ```  
   Aliases `aigne web pub` and `aigne web p` work as well.
2. **Choose WebSmith Cloud**  
   When the prompt appears, select **WebSmith Cloud** (the default option) and press Enter.
3. **Authorize once**  
   The terminal opens a browser so you can sign in and approve publishing access. After this one-time step, credentials are cached locally.
4. **Wait for deployment**  
   WebSmith zips your generated files, uploads media, and prints the live URLs when it finishes. Re-run the same command later to publish updates—no extra prompts unless you change destinations.

> **Tip:** To script deployments or skip the prompt, add `--appUrl https://your-site.com`. The terminal command remembers the last URL it published to, so future runs are fully automatic.

## When to use other options

Choose the destination that matches your hosting strategy. Each card below links to a focused walkthrough.

<x-cards data-columns="3">
  <x-card data-title="To WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/cloud">
    The quickest way to get your site online. Use our free, public hosting service. This option is ideal for testing, open-source projects, or community sharing.
  </x-card>
  <x-card data-title="To Existing Website" data-icon="lucide:server" data-href="/guides/publish-website/custom">
    For users who already have a website built on the ArcBlock platform. This guide explains how to integrate and publish your newly generated pages to your existing infrastructure.
  </x-card>
  <x-card data-title="To New Dedicated Website" data-icon="lucide:globe" data-href="/guides/publish-website/new-dedicated-website">
    A paid service that creates a new, dedicated website with custom domain and hosting capabilities. This is the recommended choice for professional and commercial use.
  </x-card>
</x-cards>

If you want to move from WebSmith Cloud to another destination (or vice versa), run `aigne web clear --targets deploymentConfig` to reset the cached deploy target, then run `aigne web publish` again and choose the new destination.
