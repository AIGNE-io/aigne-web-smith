import chalk from "chalk";

/**
 * Print summary of removed pages and pages with invalid links
 */
export default async function printRemovePageSummary({
  deletedPages = [],
  pagesWithInvalidLinks = [],
}) {
  let message = `\n${"=".repeat(80)}\n`;
  message += `${chalk.bold.cyan("📊 Summary")}\n`;
  message += `${"=".repeat(80)}\n\n`;

  // Display removed pages
  if (deletedPages && deletedPages.length > 0) {
    message += `🗑️  Removed Pages:\n`;
    message += `   Total: ${deletedPages.length} page(s)\n\n`;
    deletedPages.forEach((path, index) => {
      message += `   ${chalk.cyan(`${index + 1}. ${path}`)}\n\n`;
    });
  } else {
    message += `🗑️  Removed Pages:\n`;
    message += `${chalk.gray("   No pages were removed.\n\n")}`;
  }

  // Display pages with invalid links
  if (pagesWithInvalidLinks && pagesWithInvalidLinks.length > 0) {
    message += `✅ Pages fixed (Removed invalid links):\n`;
    message += `   Total: ${pagesWithInvalidLinks.length} page(s)\n\n`;
    pagesWithInvalidLinks.forEach((page, index) => {
      message += `   ${chalk.cyan(`${index + 1}. ${page.path}`)}\n`;
      if (page.title !== page.path) {
        message += `      Title: ${chalk.yellow(page.title)}\n`;
      }
      message += `      Invalid links fixed: ${chalk.gray(page.invalidLinks.join(", "))}\n\n`;
    });
  } else {
    message += `✅ Pages fixed (Removed invalid links):\n`;
    message += `${chalk.gray("   No pages needed fixed.\n\n")}`;
  }

  message += `${"=".repeat(80)}\n\n`;

  return { message };
}

printRemovePageSummary.taskTitle = "Print remove page summary";
printRemovePageSummary.description = "Display summary of removed pages";
