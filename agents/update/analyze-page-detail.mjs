import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TeamAgent } from "@aigne/core";
import { getFileName, hasSourceFilesChanged } from "../../utils/utils.mjs";
import checkDetailResult from "../utils/check-detail-result.mjs";

// Get current script directory
const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function analyzePageDetail(input, options) {
  const {
    path,
    pagesDir,
    tmpDir,
    sourceIds,
    originalWebsiteStructure,
    websiteStructure,
    modifiedFiles,
    // forceRegenerate,
    locale,
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

  // Check if source files have changed since last generation
  let sourceFilesChanged = false;
  if (sourceIds && sourceIds.length > 0 && modifiedFiles) {
    sourceFilesChanged = hasSourceFilesChanged(sourceIds, modifiedFiles);

    if (sourceFilesChanged) {
      console.log(`Source files changed for ${path}, will regenerate`);
    }
  }

  // If file exists, check content validation
  let _contentValidationFailed = false;
  if (detailGenerated && fileContent && websiteStructure) {
    const validationResult = await checkDetailResult({
      websiteStructure,
      reviewContent: fileContent,
      pagesDir,
      tmpDir,
      locale,
    });

    if (!validationResult.isApproved) {
      _contentValidationFailed = true;
    }
  }

  if (detailGenerated) {
    return {
      path,
      pagesDir,
      ...rest,
      detailGenerated,
    };
  }

  const teamAgent = TeamAgent.from({
    name: "generateAndTranslatePageDetail",
    skills: [options.context.agents["generateAndTranslatePageDetail"]],
  });

  const result = await options.context.invoke(teamAgent, {
    ...input,
    pagesDir,
    path,
    sourceIds,
    originalWebsiteStructure,
    websiteStructure,
  });

  return {
    path,
    pagesDir,
    ...rest,
    result,
    detailGenerated,
  };
}
analyzePageDetail.taskTitle = "Analyze if '{{ title }}' needs generation";
