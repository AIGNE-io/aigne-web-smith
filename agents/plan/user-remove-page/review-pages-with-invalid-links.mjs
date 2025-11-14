/**
 * Review pagesWithInvalidLinks and let user select which pages should be fixed
 */
export default async function reviewPagesWithInvalidLinks(
  { pagesWithInvalidLinks = [], websiteStructure = [] },
  options,
) {
  // If no pages to review, return empty array
  if (!pagesWithInvalidLinks || pagesWithInvalidLinks.length === 0) {
    return {
      pagesWithInvalidLinks: [],
      websiteStructureResult: websiteStructure,
    };
  }

  // Let user select which pages to fix (default: all selected)
  const selectedPages = await options.prompts.checkbox({
    message:
      "Select pages to fix (all selected by default, press Enter to confirm, or unselect all to skip):",
    choices: pagesWithInvalidLinks.map((page, index) => ({
      name: `${page.path}${page.title !== page.path ? ` (${page.title})` : ""} - Invalid: ${page.invalidLinks.join(", ")}`,
      value: index,
      checked: true, // Default to all selected
    })),
  });

  // Filter pagesWithInvalidLinks based on user selection
  const filteredPagesWithInvalidLinks = selectedPages
    .map((index) => pagesWithInvalidLinks[index])
    .filter(Boolean);

  // Narrow websiteStructureResult
  const selectedPaths = new Set(filteredPagesWithInvalidLinks.map((p) => p.path));
  const websiteStructureResult = websiteStructure.filter((page) => selectedPaths.has(page.path));

  if (filteredPagesWithInvalidLinks.length === 0) {
    console.log(`\n⚠️  No pages selected. Skipping page fix.\n`);
  } else {
    console.log(
      `\n✅ Selected ${filteredPagesWithInvalidLinks.length} out of ${pagesWithInvalidLinks.length} pages to fix.\n`,
    );
  }

  return {
    pagesWithInvalidLinks: filteredPagesWithInvalidLinks,
    websiteStructureResult,
  };
}

reviewPagesWithInvalidLinks.taskTitle = "Review pages with invalid links";
reviewPagesWithInvalidLinks.description =
  "Let user review and select which pages with invalid links should be fixed";
