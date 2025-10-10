# Your First Website

This tutorial provides a hands-on guide to generating a complete website using AIGNE WebSmith. The process involves two primary steps: creating a configuration file to define your website's requirements and then executing a single command to generate the site pages.

Before proceeding, ensure you have successfully installed the AIGNE CLI. If you have not, please follow the instructions in the [Installation](./getting-started-installation.md) guide.

## Step 1: Create Your Configuration File

The configuration file is a simple text file in YAML format that tells the AI what kind of website you want to build. It includes details such as the site's purpose, target audience, and any specific rules or content requirements.

You can create this file in two ways: through an interactive setup process or by creating it manually.

### Method A: Interactive Setup (Recommended)

For a guided experience, use the `init` command. This will ask you a series of questions about your website and automatically generate the `config.yaml` file for you.

1.  Open your terminal or command prompt.
2.  Run the following command:

    ```bash
    aigne web init
    ```

3.  Answer the questions presented. The setup will guide you through defining:
    *   **Website Purpose**: The primary goal of your site (e.g., product showcase, blog, documentation).
    *   **Target Audience**: Who the website is for (e.g., developers, business owners).
    *   **Website Scale**: The approximate number of pages.
    *   **Language**: The primary language for the content.
    *   **Data Sources**: Local files or folders to use as source material for content generation.
    *   **Custom Rules**: Any specific instructions for the AI.

Upon completion, a `config.yaml` file will be created in the `aigne-web-smith` directory, ready for the next step.

### Method B: Manual Creation

If you prefer to create the configuration file manually, you can create a text file and save it with a `.yaml` extension (for example, `my-website.yaml`).

This method provides direct control but requires a basic understanding of YAML syntax.

1.  Create a new file named `my-website.yaml`.
2.  Copy and paste the following template into your file, modifying the values to match your requirements.

    ```yaml title="my-website.yaml"
    # 1. Define the rules and structure for your website.
    # This can be a simple list of pages or a more detailed outline.
    rules: |
      Create a modern website for a SaaS product that includes:
      1. A homepage introducing the product and its core features.
      2. A detailed pricing page with a comparison of different plans.
      3. A page showcasing customer success stories or testimonials.
      4. A simple contact page with a form and support information.

    # 2. Describe the primary audience for your website.
    targetAudience: Small to medium-sized business owners and marketing managers.

    # 3. Specify the primary language for the website content.
    locale: en

    # 4. Choose a general style for the website.
    # Common options include 'business', 'creative', 'minimalist', etc.
    websiteStyle: business
    ```

This example configuration instructs the AI to generate a four-page website for a SaaS product, targeted at business owners, in English, with a professional business style.

## Step 2: Generate the Website

Once your configuration file is ready, you can use the `generate` command to start the website creation process. The AI will read your configuration, plan the website structure, and generate the content and template for each page.

1.  Ensure you are in the same directory as your configuration file.
2.  Run the `generate` command in your terminal.

    *   If you used the interactive setup (`aigne web init`), the file is named `config.yaml` and will be used automatically:

      ```bash
      aigne web generate
      ```

    *   If you created the file manually (e.g., `my-website.yaml`), you need to specify it using the `--input` flag:

      ```bash
      aigne web generate --input @my-website.yaml
      ```

The generation process may take a few minutes, depending on the number of pages and the complexity of your requirements. You will see progress updates in the terminal.

## Step 3: Review the Generated Files

After the `generate` command completes successfully, your website pages will be saved to the local directory specified in your configuration (by default, `aigne-web-smith/pages`).

You can now open this folder to inspect the results. You will find a set of files, typically in YAML format, corresponding to each page of your website. These files contain the structured content and layout information that can be published.

## Summary and Next Steps

You have successfully created a configuration file and used it to generate a multi-page website with a single command. The generated files are now ready on your local machine.

The next logical step is to publish your website to make it accessible online. To learn how to do this, proceed to the next guide.

- **[Publishing Your Website](./core-tasks-publishing-your-website.md)**: Learn how to deploy your generated site to the web.