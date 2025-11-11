import { parse, stringify } from "yaml";
import { validateSingleSection } from "./utils.mjs";

/**
 * Extract section root path from a full path
 * Examples:
 * - "sections.0" -> "sections.0"
 * - "sections.2.list.0" -> "sections.2"
 * - "sections.10.heroCta.text" -> "sections.10"
 * @param {string} fullPath - Full path (e.g., "sections.2.list.0")
 * @returns {string|null} - Section root path (e.g., "sections.2") or null
 */
export function extractSectionRootPath(fullPath) {
  if (!fullPath || typeof fullPath !== "string") {
    return null;
  }

  // Match sections.N pattern at the start
  const match = fullPath.match(/^(sections\.\d+)/);
  return match ? match[1] : null;
}

/**
 * Get the sub-path after section root
 * Examples:
 * - "sections.0" -> ""
 * - "sections.2.list.0" -> "list.0"
 * - "sections.10.heroCta.text" -> "heroCta.text"
 * @param {string} fullPath - Full path
 * @returns {string} - Sub-path after section root, empty string if none
 */
export function getSubPathAfterSection(fullPath) {
  const rootPath = extractSectionRootPath(fullPath);
  if (!rootPath || fullPath === rootPath) {
    return "";
  }
  return fullPath.slice(rootPath.length + 1); // +1 to skip the dot
}

/**
 * Extract section path(s) from error path
 * Returns an array because one error (e.g., invalid media/link) can affect multiple sections
 * @param {string} errorPath - The error path
 * @param {Object} error - The error object (optional, needed for internal_links/media_resources)
 * @param {Object} parsedData - Parsed page data (optional, needed for internal_links/media_resources)
 * @returns {string[]} - Array of section paths, empty array if none found
 */
export function extractSectionPath(errorPath, error = null, parsedData = null) {
  if (!errorPath || typeof errorPath !== "string") {
    return [];
  }

  // Handle special paths - need to scan sections to find which ones contain the resource
  if (errorPath === "internal_links" || errorPath === "media_resources") {
    if (!error || !parsedData || !parsedData.sections) {
      return [];
    }

    // Get the invalid resource from error details
    const invalidResource =
      errorPath === "internal_links" ? error.details?.invalidLink : error.details?.invalidMedia;

    if (!invalidResource) {
      return [];
    }

    // Scan ALL sections to find which ones contain this resource
    const matchingSections = [];
    for (let i = 0; i < parsedData.sections.length; i++) {
      const section = parsedData.sections[i];
      const sectionJson = JSON.stringify(section);

      if (sectionJson.includes(invalidResource)) {
        matchingSections.push(`sections.${i}`);
      }
    }

    return matchingSections; // May be empty, one, or multiple sections
  }

  // Extract sections.N part
  const match = errorPath.match(/^sections\.\d+/);
  return match ? [match[0]] : [];
}

/**
 * Group errors by section path
 * Note: One error can be added to multiple sections if it affects multiple sections
 * (e.g., an invalid media resource used in multiple sections)
 * @param {Array} errors - Array of validation errors
 * @param {Object} parsedData - Parsed page data
 * @returns {Object} - { grouped: Map<sectionPath, errors[]>, globalErrors: Array }
 */
export function groupErrorsBySection(errors, parsedData) {
  const grouped = new Map();
  const globalErrors = [];

  for (const error of errors) {
    // Pass error and parsedData to handle internal_links/media_resources
    const sectionPaths = extractSectionPath(error.path, error, parsedData);

    if (sectionPaths.length === 0) {
      // Global errors or special handling needed
      globalErrors.push(error);
      continue;
    }

    // Add this error to all matching sections
    for (const sectionPath of sectionPaths) {
      if (!grouped.has(sectionPath)) {
        grouped.set(sectionPath, []);
      }
      grouped.get(sectionPath).push(error);
    }
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
 * Handles nested paths by:
 * 1. Grouping errors by their full path (from error.path field)
 * 2. Extracting and fixing the target object at each nested path
 * 3. Validating the entire section after fixes (if no nested paths)
 * @param {Object} section - Section object (root section)
 * @param {Array} errors - Array of errors (each error must have a path field)
 * @param {string} sectionPath - Section root path (e.g., "sections.2")
 * @param {Array} componentLibrary - Component library
 * @returns {Object|null} - { fixed: boolean, section: Object, action: string } or null if cannot auto-fix
 */
export function tryAutoFixSection(section, errors, sectionPath, componentLibrary) {
  if (!canAutoFixErrors(errors)) {
    return null;
  }

  // Deep clone to avoid mutating original
  let fixedSection = JSON.parse(JSON.stringify(section));
  const actions = [];

  // Group errors by their full path to handle nested paths
  const errorsByPath = new Map();
  for (const error of errors) {
    const fullPath = error.path || sectionPath;
    if (!errorsByPath.has(fullPath)) {
      errorsByPath.set(fullPath, []);
    }
    errorsByPath.get(fullPath).push(error);
  }

  // Process each path group
  for (const [fullPath, pathErrors] of errorsByPath.entries()) {
    // Get the sub-path after section root (e.g., "list.0" from "sections.2.list.0")
    const subPath = getSubPathAfterSection(fullPath);

    // Get the target object to fix
    // If subPath is empty, target is the section itself
    // Otherwise, navigate to the nested object
    let targetObject = fixedSection;
    let parentObject = null;
    let lastKey = null;

    if (subPath) {
      const subParts = subPath.split(".");
      for (let i = 0; i < subParts.length - 1; i++) {
        targetObject = targetObject[subParts[i]];
        if (!targetObject) {
          return null; // Path doesn't exist
        }
      }
      parentObject = targetObject;
      lastKey = subParts[subParts.length - 1];
      targetObject = targetObject[lastKey];

      if (!targetObject || typeof targetObject !== "object") {
        return null; // Target is not an object
      }
    }

    // Handle UNKNOWN_FIELD_COMBINATION errors for this path
    const fieldCombinationErrors = pathErrors.filter((e) => e.code === "UNKNOWN_FIELD_COMBINATION");
    for (const error of fieldCombinationErrors) {
      // Remove extra fields from target object
      const extraFields = extractExtraFields(error);
      if (extraFields.length > 0) {
        targetObject = removeFieldsFromSection(targetObject, extraFields);
        actions.push(`Removed extra fields at ${fullPath}: ${extraFields.join(", ")}`);
      }

      // Add missing fields to target object
      const missingFields = extractMissingFields(error);
      if (missingFields.length > 0) {
        targetObject = addFieldsToSection(targetObject, missingFields);
        actions.push(`Added missing fields at ${fullPath}: ${missingFields.join(", ")}`);
      }
    }

    // Update the fixed section with the modified target object
    if (subPath && parentObject && lastKey) {
      parentObject[lastKey] = targetObject;
    } else {
      fixedSection = targetObject;
    }
  }

  // Check if any error has nested path
  const hasNestedPath = errors.some((error) => {
    const fullPath = error.path || sectionPath;
    return getSubPathAfterSection(fullPath) !== "";
  });

  // For nested paths, we don't validate because:
  // 1. We only fixed a sub-object, not the entire section
  // 2. Validation would try to validate the sub-object as if it were a complete section
  // 3. The caller should validate the entire section after all fixes
  if (hasNestedPath) {
    return {
      fixed: true,
      section: fixedSection,
      action: `Auto-fixed: ${actions.join("; ")}`,
    };
  }

  // Only validate when fixing the root section (no sub-path)
  const rootPath = extractSectionRootPath(sectionPath);
  const validation = validateSingleSection({
    section: fixedSection,
    sectionPath: rootPath || sectionPath,
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
  return {
    fixed: false,
    section: fixedSection,
    action: `Cannot auto-fix: ${validation.validationFeedback}`,
  };
}
