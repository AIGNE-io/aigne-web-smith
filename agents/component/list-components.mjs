import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import {
  formatComponentSummary,
  getComponentLibraryPath,
  loadComponentLibrary,
} from "../../utils/utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function listComponents() {
  const rootDir = path.join(__dirname, "../../");
  const filePath = getComponentLibraryPath(rootDir);

  try {
    // Load component library
    const result = loadComponentLibrary(filePath);

    if (!result) {
      return {
        message: `❌ Component library not found at: ${filePath}\n\n💡 Tip: Run ${chalk.cyan("aigne web component pull <url>")} to fetch the component library first.`,
      };
    }

    const { doc, atomicCount, compositeCount } = result;

    // Build the formatted output message
    let message = `📚 Built-in Component Library (${chalk.cyan(filePath)})\n`;
    message += `📊 Total: ${atomicCount + compositeCount} components\n\n`;

    // List atomic components
    if (atomicCount > 0) {
      message += `🔹 Atomic Components (${chalk.cyan(atomicCount)}):\n`;
      doc.atomic?.forEach((component) => {
        message += `  • ${chalk.cyan(component.name)} - ${formatComponentSummary(component.summary)}\n`;
      });
      message += "\n";
    } else {
      message += `🔹 Atomic Components: None\n\n`;
    }

    // List composite components
    if (compositeCount > 0) {
      message += `🧩 Composite Components (${chalk.cyan(compositeCount)}):\n`;
      doc.composite?.forEach((component) => {
        message += `  • ${chalk.cyan(component.name)} - ${formatComponentSummary(component.summary)}\n`;
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
