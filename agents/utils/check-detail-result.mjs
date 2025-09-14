import { getFileName } from "../../utils/utils.mjs";

export default async function checkDetailResult({
  structurePlan,
  // reviewContent,
  // pagesDir,
  // tmpDir,
  locale,
}) {
  let isApproved = true;
  const detailFeedback = [];

  // Create a set of allowed links, including both original paths and processed page paths
  const allowedLinks = new Set();
  structurePlan.forEach((item) => {
    // Add original path
    allowedLinks.add(item.path);

    // Add processed page path (same logic as processContent in utils.mjs)
    let processedPath = item.path;
    if (processedPath.startsWith(".")) {
      processedPath = processedPath.replace(/^\./, "");
    }
    let flatPath = processedPath.replace(/^\//, "").replace(/\//g, "-");
    flatPath = getFileName({ locale: locale || "en", fileName: flatPath });
    allowedLinks.add(flatPath);
  });

  // Run comprehensive markdown validation with all checks
  try {
    const markdownErrors = [];

    if (markdownErrors.length > 0) {
      isApproved = false;
      detailFeedback.push(...markdownErrors);
    }
  } catch (error) {
    isApproved = false;
    detailFeedback.push(`Found markdown validation error in result: ${error.message}`);
  }

  return {
    isApproved,
    detailFeedback: detailFeedback.join("\n"),
  };
}
