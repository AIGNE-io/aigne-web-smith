import chalk from "chalk";

export default async function theme({ apply, appUrl, name, config }, options) {
  try {
    // apply theme
    if (apply !== undefined) {
      const applyTheme = await import("./apply-theme.mjs");
      return await applyTheme.default({ appUrl, config }, options);
    } else {
      // generate theme
      const result = await options.context.invoke(options.context.agents["generateTheme"], {
        name,
        config,
      }, options);
      return result;
    }
  } catch (error) {
    return {
      message: chalk.red(`❌ Unable to process theme request: ${error}`),
    };
  }
}

theme.description = "Manage and apply website themes";

// Define input schema
theme.input_schema = {
  type: "object",
  properties: {
    apply: {
      type: "boolean",
      description: "Apply an existing theme to your website",
    },
    generate: {
      type: "boolean",
      description: "Create a new theme for your website",
    },
    name: {
      type: "string",
      description: "The name of the theme",
    },
    appUrl: {
      type: "string",
      description: "Your website's URL (e.g., https://example.com)",
    },
    config: {
      type: "string",
      description: "Path to configuration file",
    },
  },
};

theme.taskTitle = "🎨 Theme Management";
