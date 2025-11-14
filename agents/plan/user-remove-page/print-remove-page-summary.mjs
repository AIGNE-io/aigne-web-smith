import chalk from "chalk";

/**
 * Print summary of removed pages and pages with invalid links
 */
export default async function printRemovePageSummary({
  deletedPages = [],
  pagesWithInvalidLinks = [],
  errors = [],
}) {
  console.log(`\n${"=".repeat(80)}`);
  console.log(chalk.bold.cyan("📊 Summary"));
  console.log(`${"=".repeat(80)}\n`);

  // Display removed pages
  if (deletedPages && deletedPages.length > 0) {
    console.log(chalk.bold.red("🗑️  Removed Pages:"));
    console.log(chalk.red(`   Total: ${deletedPages.length} page(s)\n`));
    deletedPages.forEach((path, index) => {
      console.log(`   ${chalk.cyan(`${index + 1}. ${path}`)}`);
      console.log();
    });
  } else {
    console.log(chalk.bold.red("🗑️  Removed Pages:"));
    console.log(chalk.gray("   No pages were removed.\n"));
  }

  // Display pages with invalid links
  if (pagesWithInvalidLinks && pagesWithInvalidLinks.length > 0) {
    console.log(chalk.bold.yellow("⚠️  Pages Regenerated (Invalid Links Fixed):"));
    console.log(chalk.yellow(`   Total: ${pagesWithInvalidLinks.length} page(s)\n`));
    pagesWithInvalidLinks.forEach((page, index) => {
      console.log(`   ${chalk.cyan(`${index + 1}. ${page.path}`)}`);
      if (page.title !== page.path) {
        console.log(`      Title: ${chalk.yellow(page.title)}`);
      }
      console.log(`      Invalid links fixed: ${chalk.gray(page.invalidLinks.join(", "))}`);
      console.log();
    });
  } else {
    console.log(chalk.bold.yellow("⚠️  Pages Regenerated (Invalid Links Fixed):"));
    console.log(chalk.gray("   No pages needed regeneration.\n"));
  }

  // Display errors if any
  if (errors && Array.isArray(errors) && errors.length > 0) {
    console.log(chalk.bold.yellow("⚠️  Errors:"));
    errors.forEach((error, index) => {
      console.log(`   ${chalk.yellow(`${index + 1}. ${error.path || error.title || "Unknown"}`)}`);
      console.log(`      ${chalk.gray(error.error || error.message || "Unknown error")}`);
      console.log();
    });
  }

  console.log(`${"=".repeat(80)}\n`);

  // Return the same data to pass through
  return {
    deletedPages,
    pagesWithInvalidLinks,
    errors,
  };
}

printRemovePageSummary.taskTitle = "Print remove page summary";
printRemovePageSummary.description = "Display summary of removed pages";
