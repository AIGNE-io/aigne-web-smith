import chalk from "chalk";

/**
 * Review pagesWithNewLinks and let user select which pages should be updated
 */
export default async function reviewPagesWithNewLinks(
  { pagesWithNewLinks = [] },
  options,
) {
  // If no pages to review, return empty array
  if (!pagesWithNewLinks || pagesWithNewLinks.length === 0) {
    return { pagesWithNewLinks: [] };
  }

  // Display pages that will be updated
  console.log("\n📋 The following pages will be updated with new links:\n");
  pagesWithNewLinks.forEach((page, index) => {
    console.log(
      `${chalk.cyan(`${index + 1}. ${page.path}`)} → ${chalk.yellow(page.newLinks.join(", "))}`,
    );
  });
  console.log();

  // Let user select which pages to update (default: all selected)
  const selectedPages = await options.prompts.checkbox({
    message: "Select pages to update (all selected by default, press Enter to confirm, or unselect all to skip):",
    choices: pagesWithNewLinks.map((page, index) => ({
      name: `${page.path} → ${page.newLinks.join(", ")}`,
      value: index,
      checked: true, // Default to all selected
    })),
  });

  // Filter pagesWithNewLinks based on user selection
  const filteredPagesWithNewLinks = selectedPages
    .map((index) => pagesWithNewLinks[index])
    .filter(Boolean);

  if (filteredPagesWithNewLinks.length === 0) {
    console.log(`\n⚠️  No pages selected. Skipping link updates.\n`);
  } else {
    console.log(
      `\n✅ Selected ${filteredPagesWithNewLinks.length} out of ${pagesWithNewLinks.length} pages to update.\n`,
    );
  }

  return { pagesWithNewLinks: filteredPagesWithNewLinks };
}

reviewPagesWithNewLinks.taskTitle = "Review pages to update";
reviewPagesWithNewLinks.description = "Let user review and select which pages should be updated with new links";

