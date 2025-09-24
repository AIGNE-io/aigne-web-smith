import chalk from "chalk";

export default async function theme({ apply, appUrl, name, config }, options) {
  try {
    // apply theme
    if (apply !== undefined) {
      const applyTheme = await import("./apply-theme.mjs");
      return await applyTheme.default({ appUrl }, options);
    } else {
      // generate theme
      const result = await options.context.invoke(options.context.agents["generateTheme"], {
        name,
        config,
      });
      return result;
    }
  } catch (error) {
    console.log(error);
    return {
      message: chalk.red(`❌ Theme router error: ${error}`),
    };
  }
}

theme.description = "Theme router";

// Define input schema
theme.input_schema = {
  type: "object",
  properties: {
    apply: {
      type: "boolean",
      description: "Upload and apply theme configuration",
    },
    generate: {
      type: "boolean",
      description: "Generate new theme configuration",
    },
    name: {
      type: "string",
      description: "The name of the theme",
    },
    appUrl: {
      type: "string",
      description: "The url of the app",
    },
    config: {
      type: "string",
      description: "Path to configuration file",
    },
  },
};
