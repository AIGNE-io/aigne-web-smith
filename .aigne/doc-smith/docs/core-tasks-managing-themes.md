# Managing Themes

The visual theme of your website—its colors, fonts, and overall style—plays a crucial role in its identity. AIGNE WebSmith provides a `theme` command to systematically manage the aesthetic aspects of your site. This allows you to generate new design concepts with AI and apply them with a single command.

The `theme` command is divided into two primary sub-commands:
*   **`generate`**: Creates a new theme based on your input and saves it locally.
*   **`apply`**: Uploads a local theme to your website, updating its live appearance.

This guide will proceed logically through the process, starting with theme generation and then moving to application.

## Generating a New Theme

The `theme generate` command initiates an AI-driven process to create a complete theme configuration. The AI will guide you through selecting a name and defining the visual characteristics of your new theme. The resulting configuration is saved as a `.yaml` file in a local `themes` directory for later use.

### Process

1.  **Run the Command**: Execute `aigne theme generate` in your terminal.
2.  **Name Your Theme**: You will first be prompted to provide a unique name for your theme. This name will be used to identify it later.
3.  **AI-Powered Design**: The AI will then ask questions to understand your design preferences for colors, typography, and mood.
4.  **Save Locally**: Once the design process is complete, the theme is automatically saved to a file within your project's `themes` folder (e.g., `my-new-theme.yaml`).

### Usage

To start generating a new theme, run the following command:

```sh
aigne theme generate
```
*Alias: `aigne theme gen`*

Follow the on-screen prompts to complete the theme creation process.

## Applying a Theme

After generating one or more themes, the `theme apply` command allows you to select a saved theme and apply it to your website. This command reads your local theme files, presents them as a list, and, upon your confirmation, uploads the selected theme to your site, making the changes live.

### Process

1.  **Run the Command**: Execute `aigne theme apply` in your terminal.
2.  **Select a Theme**: The tool scans the `themes` directory and displays a list of all available themes you have generated. The list includes details like the theme name, primary color, and fonts to help you choose.
3.  **Confirm the Target**: The system will display the target website URL, the currently active theme (if any), and the new theme you have selected.
4.  **Final Confirmation**: You will be asked for a final confirmation before any changes are made. This is a safety measure to prevent accidental overwrites.
5.  **Apply to Website**: Once confirmed, the theme is uploaded and applied to your website. A success message will indicate that the process is complete.

### Usage

To apply an existing theme, use the command below.

```sh
aigne theme apply
```

You can also specify the website URL directly as a parameter. If omitted, the `appUrl` from your `aigne.config.yaml` file will be used.

```sh
aigne theme apply --appUrl https://your-website.com
```

### Parameters

The `apply` command accepts the following parameters:

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>The full URL of your website. If you do not provide this, the command will use the `appUrl` defined in your `aigne.config.yaml` configuration file.</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>The location of your configuration file. Defaults to the standard `aigne.config.yaml` path.</x-field-desc>
  </x-field>
</x-field-group>

---

By following these steps, you can effectively manage your website's visual identity. For the next step after updating your theme, you may want to review how to [publish your website](./core-tasks-publishing-your-website.md).