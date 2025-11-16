import chalk from "chalk";

/**
 * Print summary of generated pages and pages with new links
 */
export default async function printAddPageSummary({ newPages = [] }, options) {
  let message = `\n${"=".repeat(80)}\n`;
  message += `${chalk.bold.cyan("📊 Summary")}\n`;
  message += `${"=".repeat(80)}\n\n`;

  // Display newly generated pages
  if (newPages && newPages.length > 0) {
    message += `✨ Newly Generated Pages:\n`;
    message += `   Total: ${newPages.length} page(s)\n\n`;
    newPages.forEach((page, index) => {
      const title = page.title || page.path;
      message += `   ${chalk.cyan(`${index + 1}. ${page.path}`)}\n`;
      if (title !== page.path) {
        message += `      Title: ${chalk.yellow(title)}\n`;
      }
      if (page.description) {
        const desc =
          page.description.length > 60
            ? `${page.description.substring(0, 60)}...`
            : page.description;
        message += `      Description: ${chalk.gray(desc)}\n`;
      }
      message += `\n`;
    });
  } else {
    message += `✨ Newly Generated Pages:\n`;
    message += `${chalk.gray("   No new pages were generated.\n\n")}`;
  }

  // Display pages with new links
  const pagesWithNewLinks = options.context?.userContext?.originalPagesWithNewLinks || [];
  if (pagesWithNewLinks && pagesWithNewLinks.length > 0) {
    message += `🔗 Pages Updated with New Links:\n`;
    message += `   Total: ${pagesWithNewLinks.length} page(s)\n\n`;
    pagesWithNewLinks.forEach((page, index) => {
      message += `   ${chalk.cyan(`${index + 1}. ${page.path}`)}\n`;
      message += `      Added links to: ${chalk.yellow(page.newLinks.join(", "))}\n\n`;
    });
  } else {
    message += `🔗 Pages Updated with New Links:\n`;
    message += `${chalk.gray("   No pages were updated with new links.\n\n")}`;
  }

  message += `${"=".repeat(80)}\n\n`;

  return {
    message,
  };
}

printAddPageSummary.taskTitle = "Print add page summary";
printAddPageSummary.description = "Display summary of generated pages and pages with new links";
