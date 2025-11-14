import chalk from "chalk";

/**
 * Print summary of generated pages and pages with new links
 */
export default async function printAddPageSummary({ newPages = [], pagesWithNewLinks = [] }) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(chalk.bold.cyan("📊 Summary"));
  console.log(`${"=".repeat(80)}\n`);

  // Display newly generated pages
  if (newPages && newPages.length > 0) {
    console.log(chalk.bold.green("✨ Newly Generated Pages:"));
    console.log(chalk.green(`   Total: ${newPages.length} page(s)\n`));
    newPages.forEach((page, index) => {
      const title = page.title || page.path;
      console.log(`   ${chalk.cyan(`${index + 1}. ${page.path}`)}`);
      if (title !== page.path) {
        console.log(`      Title: ${chalk.yellow(title)}`);
      }
      if (page.description) {
        const desc = page.description.length > 60 
          ? `${page.description.substring(0, 60)}...` 
          : page.description;
        console.log(`      Description: ${chalk.gray(desc)}`);
      }
      console.log();
    });
  } else {
    console.log(chalk.bold.green("✨ Newly Generated Pages:"));
    console.log(chalk.gray("   No new pages were generated.\n"));
  }

  // Display pages with new links
  if (pagesWithNewLinks && pagesWithNewLinks.length > 0) {
    console.log(chalk.bold.blue("🔗 Pages Updated with New Links:"));
    console.log(chalk.blue(`   Total: ${pagesWithNewLinks.length} page(s)\n`));
    pagesWithNewLinks.forEach((page, index) => {
      console.log(`   ${chalk.cyan(`${index + 1}. ${page.path}`)}`);
      console.log(`      Added links to: ${chalk.yellow(page.newLinks.join(", "))}`);
      console.log();
    });
  } else {
    console.log(chalk.bold.blue("🔗 Pages Updated with New Links:"));
    console.log(chalk.gray("   No pages were updated with new links.\n"));
  }

  console.log(`${"=".repeat(80)}\n`);

  // Return the same data to pass through
  return {
    newPages,
    pagesWithNewLinks,
  };
}

printAddPageSummary.taskTitle = "Print add page summary";
printAddPageSummary.description = "Display summary of generated pages and pages with new links";

