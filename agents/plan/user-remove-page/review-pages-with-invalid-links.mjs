import { toDisplayLink } from "../../../utils/protocol-utils.mjs";
import { getFileName } from "../../../utils/utils.mjs";

/**
 * Review pagesWithInvalidLinks and let user select which pages should be fixed
 */
export default async function reviewPagesWithInvalidLinks(
  { pagesWithInvalidLinks = [], websiteStructure = [], locale = "en" },
  options,
) {
  // If no pages to review, return empty array
  if (!pagesWithInvalidLinks || pagesWithInvalidLinks.length === 0) {
    return {
      pagesWithInvalidLinks: [],
      websiteStructureResult: websiteStructure,
    };
  }

  // Create choices for user selection, default all checked
  const choices = pagesWithInvalidLinks.map((page, index) => {
    const flatName = page.path.replace(/^\//, "").replace(/\//g, "-");
    const filename = getFileName({ locale, fileName: flatName });

    return {
      name: `${page.title} (${filename})`,
      value: index,
      checked: true, // Default all selected
      description: `Invalid Links(${page.invalidLinks?.length || 0}): ${page.invalidLinks?.map(toDisplayLink)?.join(", ")}`,
    };
  });

  // Let user select which pages to fix (default: all selected)
  const selectedPages = await options.prompts.checkbox({
    message:
      "Select Pages with Invalid Links to Fix (all selected by default, press Enter to confirm, or unselect all to skip):",
    choices,
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
    websiteStructureResult, // for batch generate
    selectedPages: [...websiteStructureResult], // for batch translate
  };
}

reviewPagesWithInvalidLinks.taskTitle = "Review pages with invalid links";
reviewPagesWithInvalidLinks.description =
  "Let user review and select which pages with invalid links should be fixed";
