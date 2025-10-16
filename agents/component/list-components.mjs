import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import _ from "lodash";
import { parse } from "yaml";
import { BUILTIN_COMPONENT_LIBRARY_NAME, COMPONENTS_DIR } from "../../utils/constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function listComponents() {
  const rootDir = path.join(__dirname, "../../");
  const componentDir = path.join(rootDir, COMPONENTS_DIR);
  const filePath = path.join(componentDir, BUILTIN_COMPONENT_LIBRARY_NAME);

  try {
    // Check if component library file exists
    if (!fs.existsSync(filePath)) {
      return {
        message: `❌ Component library not found at: ${filePath}\n\n💡 Tip: Run ${chalk.cyan("aigne web component pull <url>")} to fetch the component library first.`,
      };
    }

    // Read and parse the component library file
    const text = fs.readFileSync(filePath, "utf8");
    const doc = parse(text);

    const atomicCount = doc.atomic?.length || 0;
    const compositeCount = doc.composite?.length || 0;

    // Helper function to format component summary
    const formatSummary = (summary) => {
      const base = summary ?? "no summary";
      const normalized = base.replace(/\s+/g, " ").trim();
      const display = normalized || "no summary";
      return _.truncate(display, { length: 80 });
    };

    // Build the formatted output message
    let message = `📚 Built-in Component Library (${chalk.cyan(filePath)})\n`;
    message += `📊 Total: ${atomicCount + compositeCount} components\n\n`;

    // List atomic components
    if (atomicCount > 0) {
      message += `🔹 Atomic Components (${chalk.cyan(atomicCount)}):\n`;
      doc.atomic?.forEach((component) => {
        message += `  • ${chalk.cyan(component.name)} - ${formatSummary(component.summary)}\n`;
      });
      message += "\n";
    } else {
      message += `🔹 Atomic Components: None\n\n`;
    }

    // List composite components
    if (compositeCount > 0) {
      message += `🧩 Composite Components (${chalk.cyan(compositeCount)}):\n`;
      doc.composite?.forEach((component) => {
        message += `  • ${chalk.cyan(component.name)} - ${formatSummary(component.summary)}\n`;
      });
      message += "\n";
    } else {
      message += `🧩 Composite Components: None\n\n`;
    }

    // Add helpful information
    message += `💡 Commands:\n`;
    message += `  • Update library: ${chalk.cyan("aigne web component pull <url>")}\n`;
    message += `  • Generate pages: ${chalk.cyan("aigne web generate")}\n`;

    console.info(message);

    return { message };
  } catch (err) {
    return {
      message: `❌ Failed to list components: ${err.message}\n\n📍 Expected file: ${filePath}`,
    };
  }
}

listComponents.description = "List all available components in the built-in component library";
listComponents.taskTitle = "List components";
listComponents.taskRenderMode = "hide";
