import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { generateFieldConstraints } from "../../../utils/generate-helper.mjs";
import { getFileName } from "../../../utils/utils.mjs";
import checkDetailResult from "../../utils/check-detail-result.mjs";

export default async function analyzePageDetail(input, options) {
  const {
    path,
    pagesDir,
    tmpDir,
    sourceIds,
    originalWebsiteStructure,
    websiteStructure,
    // forceRegenerate,
    locale,
    componentLibrary,
    mediaFiles,
    ...rest
  } = input;

  // Check if the detail file already exists
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({ locale, fileName: flatName });

  const filePath = join(tmpDir, locale, fileFullName);
  let detailGenerated = true;
  let fileContent = null;

  try {
    await access(filePath);
    // If file exists, read its content for validation
    fileContent = await readFile(filePath, "utf8");
  } catch {
    detailGenerated = false;
  }

  // Check if sourceIds have changed by comparing with original structure plan
  let _sourceIdsChanged = false;
  if (originalWebsiteStructure && sourceIds) {
    // Find the original node in the structure plan
    const originalNode = originalWebsiteStructure.find((node) => node.path === path);

    if (originalNode?.sourceIds) {
      const originalSourceIds = originalNode.sourceIds;
      const currentSourceIds = sourceIds;

      // Compare arrays (order doesn't matter, but content does)
      if (originalSourceIds.length !== currentSourceIds.length) {
        _sourceIdsChanged = true;
      } else {
        // Check if any sourceId is different
        const originalSet = new Set(originalSourceIds);
        const currentSet = new Set(currentSourceIds);

        if (originalSet.size !== currentSet.size) {
          _sourceIdsChanged = true;
        } else {
          // Check if any element is different
          for (const sourceId of originalSourceIds) {
            if (!currentSet.has(sourceId)) {
              _sourceIdsChanged = true;
              break;
            }
          }
        }
      }
    }
  }

  // If file exists, check content validation
  let isContentValidationFailed = false;
  let validationResult = {};
  if (detailGenerated && fileContent && websiteStructure) {
    validationResult = await checkDetailResult({
      websiteStructure,
      reviewContent: fileContent,
      pagesDir,
      tmpDir,
      locale,
      componentLibrary,
      mediaFiles,
    });

    if (!validationResult.isApproved) {
      isContentValidationFailed = true;
    }
  }

  // If file exists and content validation passed, return
  if (detailGenerated && !isContentValidationFailed) {
    return {
      path,
      pagesDir,
      ...rest,
      detailGenerated,
    };
  }

  const fieldConstraints = generateFieldConstraints(componentLibrary);

  const result = await options.context.invoke(options.context.agents["generatePageDetailTeam"], {
    ...input,
    pagesDir,
    path,
    sourceIds,
    originalWebsiteStructure,
    websiteStructure,
    fieldConstraints,
    detailFeedback: isContentValidationFailed ? validationResult.detailFeedback : "",
    content: isContentValidationFailed ? fileContent : "",
  });

  return {
    path,
    pagesDir,
    ...rest,
    result,
    detailGenerated,
  };
}
analyzePageDetail.taskTitle = "Check '{{ title }}'";
