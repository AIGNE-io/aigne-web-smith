import { parse, stringify } from "yaml";
import { validateSingleSection } from "./utils.mjs";

/**
 * Extract section path root from error path (e.g., "sections.0")
 * @param {string} errorPath - The error path
 * @param {Object} error - The error object (optional, needed for internal_links/media_resources)
 * @param {Object} parsedData - Parsed page data (optional, needed for internal_links/media_resources)
 * @returns {string|null} - Section path or null
 */
export function extractSectionPath(errorPath, error = null, parsedData = null) {
  if (!errorPath || typeof errorPath !== "string") {
    return null;
  }

  // Handle special paths - need to scan sections to find which one contains the resource
  if (errorPath === "internal_links" || errorPath === "media_resources") {
    if (!error || !parsedData || !parsedData.sections) {
      return null;
    }

    // Get the invalid resource from error details
    const invalidResource =
      errorPath === "internal_links" ? error.details?.invalidLink : error.details?.invalidMedia;

    if (!invalidResource) {
      return null;
    }

    // Scan sections to find which one contains this resource
    for (let i = 0; i < parsedData.sections.length; i++) {
      const section = parsedData.sections[i];
      const sectionJson = JSON.stringify(section);

      if (sectionJson.includes(invalidResource)) {
        return `sections.${i}`;
      }
    }

    return null; // Resource not found in any section
  }

  // Extract sections.N part
  const match = errorPath.match(/^sections\.\d+/);
  return match ? match[0] : null;
}

/**
 * Group errors by section path
 * @param {Array} errors - Array of validation errors
 * @param {Object} parsedData - Parsed page data
 * @returns {Object} - { grouped: Map<sectionPath, errors[]>, globalErrors: Array }
 */
export function groupErrorsBySection(errors, parsedData) {
  const grouped = new Map();
  const globalErrors = [];

  for (const error of errors) {
    // Pass error and parsedData to handle internal_links/media_resources
    const sectionPath = extractSectionPath(error.path, error, parsedData);

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

  return { grouped, globalErrors };
}

/**
 * Extract componentName from section or error details
 * @param {Object} section - Section object
 * @param {Array} errors - Array of errors for this section
 * @returns {string|null} - Component name or null
 */
export function extractComponentName(section, errors) {
  // Priority 1: Read componentName field from section
  if (section?.componentName) {
    return section.componentName;
  }

  // Priority 2: Extract from error details (structured data)
  const fieldCombinationError = errors.find((e) => e.code === "UNKNOWN_FIELD_COMBINATION");

  if (fieldCombinationError?.details?.suggestedComponents?.length > 0) {
    return fieldCombinationError.details.suggestedComponents[0];
  }

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

/**
 * Check if errors can be auto-fixed by program (without AI)
 * Can auto-fix UNKNOWN_FIELD_COMBINATION errors in these cases:
 * 1. Only extra fields (no missing fields) - remove extra fields
 * 2. Only missing fields (no extra fields) - add missing fields with empty values
 * Cannot auto-fix:
 * - Both extra and missing fields - likely wrong component, needs AI to fix
 * - INVALID_INTERNAL_LINK or INVALID_MEDIA_RESOURCE errors
 * @param {Array} errors - Array of errors for a section
 * @returns {boolean} - True if can be auto-fixed
 */
export function canAutoFixErrors(errors) {
  // Must have at least one UNKNOWN_FIELD_COMBINATION error
  const fieldCombinationErrors = errors.filter((e) => e.code === "UNKNOWN_FIELD_COMBINATION");
  if (fieldCombinationErrors.length === 0) {
    return false;
  }

  // Check all field combination errors using structured data
  for (const error of fieldCombinationErrors) {
    const { extraFields = [], missingFields = [] } = error.details || {};

    // Cannot auto-fix if both extra and missing fields exist
    // This indicates the component is likely completely wrong
    if (extraFields.length > 0 && missingFields.length > 0) {
      return false;
    }

    // Must have either extra fields or missing fields to fix
    if (extraFields.length === 0 && missingFields.length === 0) {
      return false;
    }
  }

  // Check if there are any other error types that cannot be auto-fixed
  for (const error of errors) {
    const { code } = error;

    // These types cannot be auto-fixed programmatically
    if (code === "INVALID_INTERNAL_LINK" || code === "INVALID_MEDIA_RESOURCE") {
      return false;
    }

    // Only UNKNOWN_FIELD_COMBINATION errors can be auto-fixed
    if (code !== "UNKNOWN_FIELD_COMBINATION") {
      return false;
    }
  }

  return true;
}

/**
 * Extract extra fields from error details
 * @param {Object} error - Error object
 * @returns {Array<string>} - Array of extra field names
 */
function extractExtraFields(error) {
  return error.details?.extraFields || [];
}

/**
 * Extract missing fields from error details
 * @param {Object} error - Error object
 * @returns {Array<string>} - Array of missing field names
 */
function extractMissingFields(error) {
  return error.details?.missingFields || [];
}

/**
 * Add missing fields to section with empty string values
 * Handles nested paths including:
 * - Simple fields: "title" -> { title: "" }
 * - Nested object fields: "heroCta.text" -> { heroCta: { text: "" } }
 * - Array item properties: "list.0.name" -> { list: [{ name: "" }] }
 * @param {Object} section - Section object
 * @param {Array<string>} fieldsToAdd - Array of field paths to add
 * @returns {Object} - Section with fields added
 */
function addFieldsToSection(section, fieldsToAdd) {
  const result = JSON.parse(JSON.stringify(section)); // Deep clone

  for (const fieldPath of fieldsToAdd) {
    const parts = fieldPath.split(".");
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        // Last part - set the value
        if (Array.isArray(current)) {
          const index = Number.parseInt(part, 10);
          // Ensure array is large enough
          while (current.length <= index) {
            current.push({});
          }
          current[index] = "";
        } else {
          current[part] = "";
        }
      } else {
        // Navigate deeper, creating structure as needed
        const nextPart = parts[i + 1];
        const nextIsNumeric = /^\d+$/.test(nextPart);

        if (Array.isArray(current)) {
          const index = Number.parseInt(part, 10);
          // Ensure array is large enough
          while (current.length <= index) {
            current.push({});
          }
          if (!current[index] || typeof current[index] !== "object") {
            current[index] = nextIsNumeric ? [] : {};
          }
          current = current[index];
        } else {
          if (!current[part] || typeof current[part] !== "object") {
            current[part] = nextIsNumeric ? [] : {};
          }
          current = current[part];
        }
      }
    }
  }

  return result;
}

/**
 * Remove extra fields from section
 * Handles nested paths including:
 * - Simple fields: "extraField"
 * - Nested object fields: "heroCta.extra"
 * - Array item properties: "list.0.extraProp", "splitHeroWithBgColorActions.0.link2"
 * - Whole array items: "list.4", "list.5" (only when it's the last part of path)
 * @param {Object} section - Section object
 * @param {Array<string>} fieldsToRemove - Array of field paths to remove
 * @returns {Object} - Section with fields removed
 */
function removeFieldsFromSection(section, fieldsToRemove) {
  const result = { ...section };

  // Separate complete array items to delete vs properties to delete
  const arrayItemsToRemove = new Map(); // Map<arrayPath, Set<indices>>
  const fieldsToDelete = []; // Regular field paths to delete

  for (const fieldPath of fieldsToRemove) {
    const parts = fieldPath.split(".");

    // Find if path ends with a numeric index AND has no more parts after it
    // e.g., "list.4" → delete whole item
    // but "list.0.prop" → delete property from item
    let isWholeArrayItem = false;
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      if (/^\d+$/.test(lastPart)) {
        // Last part is numeric - this means delete the whole array item
        isWholeArrayItem = true;
        const arrayPath = parts.slice(0, -1).join(".");
        const index = Number.parseInt(lastPart, 10);

        if (!arrayItemsToRemove.has(arrayPath)) {
          arrayItemsToRemove.set(arrayPath, new Set());
        }
        arrayItemsToRemove.get(arrayPath).add(index);
      }
    }

    if (!isWholeArrayItem) {
      fieldsToDelete.push(fieldPath);
    }
  }

  // Remove properties (including properties within array items)
  for (const fieldPath of fieldsToDelete) {
    const parts = fieldPath.split(".");
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isNumeric = /^\d+$/.test(part);

      if (i === parts.length - 1) {
        // Last part - delete it
        if (current && typeof current === "object") {
          delete current[part];
        }
      } else {
        // Navigate deeper
        if (current && typeof current === "object") {
          if (Array.isArray(current) && isNumeric) {
            // Navigate into array
            const index = Number.parseInt(part, 10);
            if (index >= 0 && index < current.length) {
              current = current[index];
            } else {
              break; // Index out of bounds
            }
          } else if (part in current) {
            // Navigate into object
            current = current[part];
          } else {
            break; // Path doesn't exist
          }
        } else {
          break;
        }
      }
    }
  }

  // Remove whole array items (in descending order to avoid index shifting)
  for (const [arrayPath, indices] of arrayItemsToRemove.entries()) {
    const parts = arrayPath.split(".");
    let current = result;

    // Navigate to the array
    for (const part of parts) {
      const isNumeric = /^\d+$/.test(part);
      if (current && typeof current === "object") {
        if (Array.isArray(current) && isNumeric) {
          const index = Number.parseInt(part, 10);
          current = current[index];
        } else if (part in current) {
          current = current[part];
        } else {
          current = null;
          break;
        }
      } else {
        current = null;
        break;
      }
    }

    // If we found an array, remove items in descending order
    if (Array.isArray(current)) {
      const sortedIndices = Array.from(indices).sort((a, b) => b - a); // Descending order
      for (const index of sortedIndices) {
        if (index >= 0 && index < current.length) {
          current.splice(index, 1);
        }
      }
    }
  }

  return result;
}

/**
 * Attempt to auto-fix section errors without AI
 * Handles:
 * 1. Removing extra fields
 * 2. Adding missing fields with empty string values
 * 3. Both removing and adding fields
 * @param {Object} section - Section object
 * @param {Array} errors - Array of errors
 * @param {string} sectionPath - Section path
 * @param {Array} componentLibrary - Component library
 * @returns {Object|null} - { fixed: boolean, section: Object, action: string } or null if cannot auto-fix
 */
export function tryAutoFixSection(section, errors, sectionPath, componentLibrary) {
  if (!canAutoFixErrors(errors)) {
    return null;
  }

  let fixedSection = { ...section };
  const actions = [];

  // Handle UNKNOWN_FIELD_COMBINATION errors
  const fieldCombinationErrors = errors.filter((e) => e.code === "UNKNOWN_FIELD_COMBINATION");
  for (const error of fieldCombinationErrors) {
    // Remove extra fields
    const extraFields = extractExtraFields(error);
    if (extraFields.length > 0) {
      fixedSection = removeFieldsFromSection(fixedSection, extraFields);
      actions.push(`Removed extra fields: ${extraFields.join(", ")}`);
    }

    // Add missing fields with empty values
    const missingFields = extractMissingFields(error);
    if (missingFields.length > 0) {
      fixedSection = addFieldsToSection(fixedSection, missingFields);
      actions.push(`Added missing fields: ${missingFields.join(", ")}`);
    }
  }

  // Validate the fixed section
  const validation = validateSingleSection({
    section: fixedSection,
    sectionPath,
    componentLibrary,
  });

  if (validation.isValid) {
    return {
      fixed: true,
      section: fixedSection,
      action: `Auto-fixed: ${actions.join("; ")}`,
    };
  }

  // If still has errors after fixing, cannot auto-fix
  return null;
}
