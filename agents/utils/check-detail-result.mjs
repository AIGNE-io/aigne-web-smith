import {
  buildAllowedLinksFromStructure,
  buildAllowedMediaFilesFromList,
} from "../../utils/protocol-utils.mjs";
import { getFileName, validatePageDetail } from "../../utils/utils.mjs";

export default async function checkDetailResult({
  websiteStructure,
  reviewContent,
  allowArrayFallback = false,
  // pagesDir,
  // tmpDir,
  locale,
  componentLibrary,
  mediaFiles = [],
}) {
  let isApproved = true;
  const detailFeedback = [];

  // Build allowed links from website structure
  const allowedLinks = buildAllowedLinksFromStructure(websiteStructure, locale, getFileName);

  // Build allowed media files from media files list
  const allowedMediaFiles = buildAllowedMediaFilesFromList(mediaFiles);

  if (reviewContent) {
    const validation = validatePageDetail({
      pageDetailYaml: reviewContent,
      componentLibrary,
      allowArrayFallback,
      allowedLinks,
      allowedMediaFiles,
    });

    if (!validation.isValid) {
      isApproved = false;
      detailFeedback.push(validation.validationFeedback);
    }
  }

  return {
    isApproved,
    detailFeedback: detailFeedback.join("\n"),
    errors: [],
  };
}
