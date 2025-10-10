# Publish to a new dedicated website

This guide provides a systematic process for publishing your content to a new, dedicated website. This option is a paid service that provisions a fully managed hosting environment for your project, suitable for professional use where a custom domain and dedicated resources are required.

The process is automated. After you initiate the command, AIGNE WebSmith will guide you through a one-time setup and payment process. Once completed, your website will be created, and your content will be published to it.

## Process Overview

Publishing to a new dedicated website involves a sequence of automated steps handled by the `publish` command. The command interfaces with a deployment service to provision and configure all necessary resources.

The workflow is as follows:
1.  **Initiation**: The user runs the `aigne web publish` command.
2.  **Option Selection**: The user chooses the "New dedicated website" option from the interactive prompt.
3.  **Payment & Provisioning**: The user is directed to a secure web page to complete payment. The system then automatically sets up the website hosting and environment.
4.  **Content Deployment**: AIGNE WebSmith uploads and publishes the generated pages to the newly created website.
5.  **Confirmation**: The user receives the live URL for the new website.

## Step-by-Step Instructions

To publish your website, follow these steps precisely.

### 1. Initiate the Publish Command

First, ensure your website pages have been generated using the `aigne web generate` command. Once your content is ready in the output directory, execute the following command in your terminal:

```bash
aigne web publish
```

### 2. Select the Publishing Option

You will be presented with several publishing options. Use the arrow keys to highlight and select the "New dedicated website" option.

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
❯ New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

Press Enter to confirm your selection.

### 3. Complete the Setup and Payment

After selecting the option, the automated setup process will begin:

1.  **Payment**: A message will appear in your terminal indicating that the payment process is starting. A secure payment link will be opened in your default web browser.

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

2.  **Provisioning**: Follow the instructions on the web page to complete the payment. While you are doing this, the command-line tool will wait. Once payment is confirmed, the system will automatically proceed with the setup. You will see progress updates in your terminal.

    ```text
    📦 Step 2/4: Setting up your website...
    🚀 Step 3/4: Starting your website...
    🌐 Step 4/4: Getting your website URL...
    ```

3.  **Completion**: When the setup is complete, the terminal will display a confirmation message with the URL of your new website and a link to manage your subscription.

    ```text
    🔗 Your website is ready at: https://your-new-site.example.com
    🔗 Manage your subscription at: https://billing.example.com/manage/sub_12345
    ```

### 4. Automatic Content Publishing

Once the dedicated website is successfully provisioned, AIGNE WebSmith will immediately begin uploading your generated pages and media assets. The process is fully automatic.

Upon completion, you will receive a final confirmation message listing the live URLs for your published pages.

```text
✅ Pages published successfully! (`15/15` pages, `42` media assets)

🔗 Live URLs:
   https://your-new-site.example.com/
   https://your-new-site.example.com/about
   https://your-new-site.example.com/services
   ...

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## Resuming an Incomplete Setup

If a previous attempt to create a dedicated website was initiated but not completed (e.g., the payment process was abandoned), the system will save the session details. The next time you run `aigne web publish`, you will see an additional option to resume the process.

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

Selecting this "Resume" option allows you to continue from where you left off without needing to start over or pay again if the payment was already processed. The system will use the saved `checkoutId` to restore the previous session and complete the website setup.

## Summary

You have successfully published your project to a new, dedicated website. Your content is now live and accessible at the provided URL. To make changes, you can either update the content with `aigne web update` or regenerate the entire site structure with `aigne web generate`, followed by another `aigne web publish` command. The system will use the saved configuration to publish updates to the same website.