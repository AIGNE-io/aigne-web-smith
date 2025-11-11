import { parse, stringify } from "yaml";
import { validateSingleSection } from "./utils.mjs";

/**
 * Extract section path root from error path (e.g., "sections.0")
 * @param {string} errorPath - The error path
 * @returns {string|null} - Section path or null
 */
export function extractSectionPath(errorPath) {
  if (!errorPath || typeof errorPath !== "string") {
    return null;
  }

  // Handle special paths
  if (errorPath === "internal_links" || errorPath === "media_resources") {
    return null; // Need to scan content to determine section
  }

  // Extract sections.N part
  const match = errorPath.match(/^sections\.\d+/);
  return match ? match[0] : null;
}

/**
 * Group errors by section path
 * @param {Array} errors - Array of validation errors
 * @param {Object} _parsedData - Parsed page data (reserved for future use)
 * @returns {Object} - { grouped: Map<sectionPath, errors[]>, globalErrors: Array }
 */
export function groupErrorsBySection(errors, _parsedData) {
  const grouped = new Map();
  const globalErrors = [];

  for (const error of errors) {
    const sectionPath = extractSectionPath(error.path);

    if (!sectionPath) {
      // Global errors or special handling needed
      globalErrors.push(error);
      continue;
    }

    if (!grouped.has(sectionPath)) {
      grouped.set(sectionPath, []);
    }
    grouped.get(sectionPath).push(error);
  }

  // TODO: Handle internal_links and media_resources errors
  // Need to scan _parsedData to find which section contains these resources

  return { grouped, globalErrors };
}

/**
 * Extract componentName from section or error messages
 * @param {Object} section - Section object
 * @param {Array} errors - Array of errors for this section
 * @returns {string|null} - Component name or null
 */
export function extractComponentName(section, errors) {
  // Priority 1: Read componentName field from section
  if (section?.componentName) {
    return section.componentName;
  }

  // Priority 2: Extract suggested component name from error messages
  const fieldCombinationError = errors.find((e) => e.code === "UNKNOWN_FIELD_COMBINATION");

  if (fieldCombinationError?.message) {
    const match = fieldCombinationError.message.match(/match component\(s\): ([^.]+)/);
    if (match) {
      const suggestedComponents = match[1].split(",").map((s) => s.trim());
      // Return first suggested component
      return suggestedComponents[0];
    }
  }

  // Priority 3: Infer from sectionName
  // Can add heuristic rules later

  return null;
}

/**
 * Get required fields by componentName from component library
 * @param {Array} componentLibrary - Component library array
 * @param {string} componentName - Component name
 * @returns {Array|null} - Array of required fields or null
 */
export function getRequiredFieldsByComponentName(componentLibrary, componentName) {
  if (!componentLibrary || !Array.isArray(componentLibrary) || !componentName) {
    return null;
  }

  const component = componentLibrary.find(
    (comp) => comp.type === "composite" && comp.name === componentName,
  );

  if (!component || !component.fieldCombinations) {
    return null;
  }

  return component.fieldCombinations;
}

/**
 * Get section object by path
 * @param {Object} parsedData - Parsed page data
 * @param {string} sectionPath - Section path (e.g., "sections.0")
 * @returns {Object|null} - Section object or null
 */
export function getSectionByPath(parsedData, sectionPath) {
  if (!parsedData || !sectionPath) {
    return null;
  }

  const pathParts = sectionPath.split(".");
  let current = parsedData;

  for (const part of pathParts) {
    if (current == null) {
      return null;
    }
    current = current[part];
  }

  return current;
}

/**
 * Replace section at specified path with new section
 * @param {Object} parsedData - Parsed page data
 * @param {string} sectionPath - Section path (e.g., "sections.0")
 * @param {string} newSectionYaml - New section in YAML format
 * @returns {Object} - Updated parsed data
 */
export function replaceSectionByPath(parsedData, sectionPath, newSectionYaml) {
  if (!parsedData || !sectionPath || !newSectionYaml) {
    return parsedData;
  }

  // Parse new section
  const newSection = parse(newSectionYaml);

  const pathParts = sectionPath.split(".");
  let current = parsedData;

  // Navigate to parent object
  for (let i = 0; i < pathParts.length - 1; i++) {
    if (current == null) {
      return parsedData;
    }
    current = current[pathParts[i]];
  }

  // Replace last level
  const lastKey = pathParts[pathParts.length - 1];
  if (current && typeof current === "object") {
    current[lastKey] = newSection;
  }

  return parsedData;
}

/**
 * Convert section object to YAML string
 * @param {Object} section - Section object
 * @returns {string} - YAML string
 */
export function sectionToYaml(section) {
  if (!section) {
    return "";
  }
  return stringify(section).trim();
}

/**
 * Validate fixed section using validateSingleSection
 * @param {string} sectionYaml - Section in YAML format
 * @param {string} sectionPath - Section path
 * @param {Array} componentLibrary - Component library array
 * @returns {Object} - Validation result { isValid, errors?, validationFeedback? }
 */
export function validateFixedSection(sectionYaml, sectionPath, componentLibrary) {
  try {
    const section = parse(sectionYaml);

    const result = validateSingleSection({
      section,
      sectionPath,
      componentLibrary,
    });

    return result;
  } catch (error) {
    return {
      isValid: false,
      validationFeedback: `Failed to parse section YAML: ${error.message}`,
      errors: [
        {
          path: sectionPath,
          message: `Invalid YAML: ${error.message}`,
          code: "YAML_PARSE_ERROR",
        },
      ],
    };
  }
}
