import { parse, stringify } from "yaml";
import {
  extractComponentName,
  getRequiredFieldsByComponentName,
  getSectionByPath,
  groupErrorsBySection,
  replaceSectionByPath,
  sectionToYaml,
  tryAutoFixSection,
  validateFixedSection,
} from "../../utils/section-fix-utils.mjs";
import { formatValidationErrors } from "../../utils/utils.mjs";
import checkDetailResult from "./check-detail-result.mjs";

const MAX_RETRIES = 3;

// Unfixable error codes
const UNFIXABLE_ERROR_CODES = new Set([
  "YAML_SYNTAX_ERROR",
  "INVALID_INPUT_TYPE",
  "EMPTY_CONTENT",
  "INVALID_ROOT_TYPE",
  "ARRAY_ROOT_NOT_ALLOWED",
  "EMPTY_ARRAY_ROOT",
  "MISSING_META",
  "MISSING_SECTIONS",
  "INVALID_META_TYPE",
  "INVALID_SECTIONS_TYPE",
  "INVALID_SECTION_TYPE",
]);

export default async function fixDetailCheckErrors(
  {
    ...input
  },
  options,
) {
  const {
    websiteStructure,
    reviewContent,
    allowArrayFallback = false,
    locale,
    componentLibrary,
    mediaFiles = [],
  } = input;

  const validationResult = {
    isApproved: input.isApproved,
    detailFeedback: input.detailFeedback,
    errors: input.errors,
  };

  // If already approved, return immediately
  if (validationResult.isApproved) {
    return {
      ...input,
      isApproved: true,
      reviewContent,
      fixAttempts: [],
      unfixableErrors: [],
      remainingErrors: [],
      detailFeedback: validationResult.detailFeedback || "",
    };
  }

  // Parse original content
  let parsedData;
  try {
    parsedData = parse(reviewContent);
  } catch (error) {
    return {
      ...input,
      isApproved: false,
      reviewContent,
      fixAttempts: [],
      unfixableErrors: [
        {
          code: "YAML_SYNTAX_ERROR",
          message: `Failed to parse YAML: ${error.message}`,
        },
      ],
      remainingErrors: validationResult.errors || [],
      detailFeedback: validationResult.detailFeedback || "",
    };
  }

  // Initialize
  const fixAttempts = [];
  const unfixableErrors = [];
  const errors = validationResult.errors || [];

  // Classify errors
  const fixableErrors = [];
  for (const error of errors) {
    if (UNFIXABLE_ERROR_CODES.has(error.code)) {
      unfixableErrors.push(error);
    } else {
      fixableErrors.push(error);
    }
  }

  // If all errors are unfixable, return immediately
  if (fixableErrors.length === 0) {
    return {
      ...input,
      isApproved: false,
      reviewContent,
      fixAttempts: [],
      unfixableErrors,
      remainingErrors: errors,
      detailFeedback: validationResult.detailFeedback || "",
    };
  }

  // Group errors by section
  const { grouped: errorsBySection, globalErrors } = groupErrorsBySection(
    fixableErrors,
    parsedData,
  );

  // Retry loop
  let currentParsedData = parsedData;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES && errorsBySection.size > 0) {
    retryCount++;

    const sectionsToFix = Array.from(errorsBySection.entries());
    const failedSections = new Map();

    for (const [sectionPath, sectionErrors] of sectionsToFix) {
      // Get current section
      const section = getSectionByPath(currentParsedData, sectionPath);
      if (!section) {
        fixAttempts.push({
          sectionPath,
          errorCodes: sectionErrors.map((e) => e.code),
          result: "Failed: Section not found",
          success: false,
          retry: retryCount,
        });
        continue;
      }

      // Extract componentName
      const componentName = extractComponentName(section, sectionErrors);
      if (!componentName) {
        fixAttempts.push({
          sectionPath,
          errorCodes: sectionErrors.map((e) => e.code),
          result: "Failed: Cannot determine componentName",
          success: false,
          retry: retryCount,
        });
        failedSections.set(sectionPath, sectionErrors);
        continue;
      }

      // Get required fields for this component
      const requiredFields = getRequiredFieldsByComponentName(componentLibrary, componentName);
      if (!requiredFields) {
        fixAttempts.push({
          sectionPath,
          errorCodes: sectionErrors.map((e) => e.code),
          result: `Failed: Component '${componentName}' not found in library`,
          success: false,
          retry: retryCount,
        });
        failedSections.set(sectionPath, sectionErrors);
        continue;
      }

      // Try auto-fix first (program-based, no AI)
      const autoFixResult = tryAutoFixSection(
        section,
        sectionErrors,
        sectionPath,
        componentLibrary,
      );

      if (autoFixResult?.fixed) {
        // Auto-fix succeeded
        const fixedSectionYaml = sectionToYaml(autoFixResult.section);
        currentParsedData = replaceSectionByPath(currentParsedData, sectionPath, fixedSectionYaml);

        fixAttempts.push({
          sectionPath,
          errorCodes: sectionErrors.map((e) => e.code),
          result: autoFixResult.action,
          success: true,
          retry: retryCount,
          method: "auto",
        });

        // Remove from error group
        errorsBySection.delete(sectionPath);
        continue;
      }

      // Cannot auto-fix, call AI Agent
      try {
        const sectionYaml = sectionToYaml(section);
        const sectionIndex = Number.parseInt(sectionPath.split(".")[1], 10);

        const fixResult = await options.context.invoke(options.context.agents.sectionErrorFixer, {
          ...input,
          sectionYaml,
          sectionPath,
          sectionIndex,
          errors: sectionErrors,
          componentName,
          requiredFields,
          pageContext: {
            meta: currentParsedData.meta || {},
            path: sectionPath,
          },
        });

        const fixedSectionYaml = fixResult.fixedSection || fixResult;

        // Validate fixed section
        const validation = validateFixedSection(fixedSectionYaml, sectionPath, componentLibrary);

        if (validation.isValid) {
          // Validation passed, replace section
          currentParsedData = replaceSectionByPath(
            currentParsedData,
            sectionPath,
            fixedSectionYaml,
          );

          fixAttempts.push({
            sectionPath,
            errorCodes: sectionErrors.map((e) => e.code),
            result: `Fixed: ${sectionErrors.length} error(s) resolved`,
            success: true,
            retry: retryCount,
            method: "ai",
          });

          // Remove from error group
          errorsBySection.delete(sectionPath);
        } else {
          // Validation failed, keep original section
          fixAttempts.push({
            sectionPath,
            errorCodes: sectionErrors.map((e) => e.code),
            result: `Failed: Validation failed after fix - ${validation.validationFeedback}`,
            success: false,
            retry: retryCount,
            newErrors: validation.errors || [],
          });
        }
      } catch (error) {
        fixAttempts.push({
          sectionPath,
          errorCodes: sectionErrors.map((e) => e.code),
          result: `Failed: AI Agent error - ${error.message}`,
          success: false,
          retry: retryCount,
        });
        failedSections.set(sectionPath, sectionErrors);
      }
    }

    // Update error groups for next retry
    errorsBySection.clear();
    for (const [path, errs] of failedSections.entries()) {
      errorsBySection.set(path, errs);
    }

    // If no failed sections, break loop
    if (errorsBySection.size === 0) {
      break;
    }
  }

  // Generate fixed content
  const fixedContent = stringify(currentParsedData);

  // Final validation
  const finalValidation = await checkDetailResult(
    {
      websiteStructure,
      reviewContent: fixedContent,
      allowArrayFallback,
      locale,
      componentLibrary,
      mediaFiles,
    },
    options,
  );

  // Collect remaining errors
  const remainingErrors = [...unfixableErrors, ...globalErrors, ...(finalValidation.errors || [])];

  return {
    ...input,
    content: fixedContent,
    isApproved: finalValidation.isApproved,
    reviewContent: fixedContent,
    fixAttempts,
    unfixableErrors,
    remainingErrors,
    detailFeedback: formatValidationErrors(remainingErrors),
  };
}

fixDetailCheckErrors.input_schema = {
  type: "object",
  properties: {
    websiteStructure: {
      type: "array",
      description: "Website structure array",
    },
    reviewContent: {
      type: "string",
      description: "Original YAML content to fix",
    },
    isApproved: {
      type: "boolean",
      description: "Is approved",
    },
    detailFeedback: {
      type: "string",
      description: "Detail feedback",
    },
    allowArrayFallback: {
      type: "boolean",
      description: "Allow array fallback",
    },
    locale: {
      type: "string",
      description: "Locale code",
    },
    componentLibrary: {
      type: "array",
      description: "Component library array",
    },
    mediaFiles: {
      type: "array",
      description: "Media files array",
    },
  },
  required: ["websiteStructure", "reviewContent", "locale", "componentLibrary"],
};
