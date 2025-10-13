import { getFileName, validatePageDetail } from "../../utils/utils.mjs";

export default async function checkDetailResult({
  websiteStructure,
  reviewContent,
  allowArrayFallback = false,
  // pagesDir,
  // tmpDir,
  locale,
  componentLibrary,
}) {
  let isApproved = true;
  const detailFeedback = [];

  // Create a set of allowed links, including both original paths and processed page paths
  const allowedLinks = new Set();
  websiteStructure.forEach((item) => {
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

  if (reviewContent) {
    const validation = validatePageDetail({
      pageDetailYaml: reviewContent,
      componentLibrary,
      allowArrayFallback,
    });

    if (!validation.isValid) {
      isApproved = false;
      detailFeedback.push(validation.validationFeedback);
    }
  }

  return {
    isApproved,
    detailFeedback: detailFeedback.join("\n"),
  };
}
