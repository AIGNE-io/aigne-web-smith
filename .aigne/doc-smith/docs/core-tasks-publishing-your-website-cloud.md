# Publish to WebSmith Cloud

This guide provides a systematic procedure for publishing your website to WebSmith Cloud. This service offers free hosting, making your website publicly accessible without requiring you to manage your own server infrastructure. It is the recommended starting point for new users and is well-suited for open-source projects, portfolios, or community-focused sites.

## Prerequisites

Before proceeding with the publication process, ensure that you have already generated your website's pages. If you have not completed this step, please do so by running the following command:

```bash
aigne web generate
```

## Publishing Procedure

The publishing process is initiated through a single command. The system will then guide you through the necessary selections and authorizations.

### Step 1: Execute the Publish Command

Open your terminal, navigate to your project's root directory, and execute the `publish` command.

```bash Command Line icon=lucide:terminal
aigne web publish
```

You can also use the aliases `pub` or `p`.

### Step 2: Select the Publishing Platform

After executing the command, you will be presented with a list of publishing options. To use the free cloud hosting, select the first option.

Use the arrow keys to highlight the following choice and press Enter:

```text
? Select platform to publish your pages:
❯ WebSmith Cloud (https://websmith.aigne.io) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
  New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

### Step 3: Authorize AIGNE WebSmith (First-Time Users Only)

If this is your first time publishing to WebSmith Cloud, the command-line tool needs to be authorized to publish on your behalf. This is a one-time security procedure.

1.  A secure authentication URL will automatically open in your default web browser.
2.  You will be prompted to log in to your account and approve the connection request from "AIGNE WebSmith".
3.  Once you approve, you can close the browser tab and return to the terminal.

The tool will securely store your authorization credentials, so you will not need to repeat this step for subsequent publications.

### Step 4: Await Publication

The CLI will now handle the entire publication process automatically. This includes:

- Bundling your page and content files.
- Uploading all associated media assets.
- Deploying the files to the WebSmith Cloud servers.

This process may take a few minutes, depending on the size of your website.

## Reviewing Your Live Website

Upon successful completion, the CLI will display a confirmation message. This message will include the total number of pages and assets published, along with the direct URLs to access your live website.

```text
✅ Pages published successfully! (`10/10` pages, `25` media assets)

🔗 Live URLs:
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

You can now visit these URLs in your web browser to view your published website.

---

You have successfully published your website to WebSmith Cloud. If you need to make changes, you can modify your content and run the `publish` command again, or use the `update` command for more specific modifications. For more details, see [Updating Website Content](./core-tasks-updating-website-content.md).

For alternative deployment targets, refer to the following guides:

- [Publish to your own website](./core-tasks-publishing-your-website-custom.md)
- [Publish to a new dedicated website](./core-tasks-publishing-your-website-new-dedicated-website.md)
