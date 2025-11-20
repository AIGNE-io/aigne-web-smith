import { join } from "node:path";
import chalk from "chalk";
import pLimit from "p-limit";
import { getFileName, pathExists } from "../../../utils/utils.mjs";

/**
 * Review pagesWithNewLinks and let user select which pages should be updated
 */
export default async function reviewPagesWithNewLinks(input, options) {
  const { pagesWithNewLinks = [], websiteStructure = [], locale = "en", tmpDir } = input;

  // If no pages to review, return empty array
  if (!pagesWithNewLinks || pagesWithNewLinks.length === 0) {
    return { pagesWithNewLinks: [] };
  }

  // pagesWithNewLinks.map((page, index) => ({
  //   name: `${page.path} → ${page.newLinks.join(", ")}`,
  //   value: index,
  //   checked: true, // Default to all selected
  // })),

  // Build choices with file existence check
  const limit = pLimit(50);
  const choices = await Promise.all(
    pagesWithNewLinks.map((page, index) =>
      limit(async () => {
        // Find corresponding page in websiteStructure to get title
        const structurePage = websiteStructure.find((item) => item.path === page.path);
        const title = structurePage?.title || page.path;

        // Generate filename from page path
        const flatName = page.path.replace(/^\//, "").replace(/\//g, "-");
        const filename = getFileName({ locale, fileName: flatName });

        // Check file existence if tmpDir is provided
        let fileExists = true;
        let missingFileText = "";
        if (tmpDir) {
          const filePath = join(tmpDir, locale, filename);
          fileExists = await pathExists(filePath);
          if (!fileExists) {
            missingFileText = chalk.red(" - file not found");
          }
        }

        return {
          name: `${title} (${filename})${missingFileText}`,
          value: index,
          checked: fileExists, // Only check if file exists
          disabled: !fileExists, // Disable if file doesn't exist
          description: `New Links: ${page.newLinks.join(", ")}`,
        };
      }),
    ),
  );

  // Let user select which pages to update (default: all selected)
  const selectedPages = await options.prompts.checkbox({
    message:
      "Select pages that need new links added (all selected by default, press Enter to confirm, or unselect all to skip):",
    choices,
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

  // save original pagesWithNewLinks to user context
  options.context.userContext.originalPagesWithNewLinks = filteredPagesWithNewLinks;

  return { pagesWithNewLinks: filteredPagesWithNewLinks };
}

reviewPagesWithNewLinks.taskTitle = "Review pages to update";
reviewPagesWithNewLinks.description =
  "Let the user review and select which pages should be updated with new links";
