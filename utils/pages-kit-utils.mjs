import { PAGES_KIT_API_BASE } from "./constants.mjs";

/**
 * Upload page template to Pages Kit
 * @param {Object} params
 * @param {string} params.pageTemplate - Page YAML template
 * @param {string} params.locale - Language code
 * @param {string} params.projectId - Project ID
 * @returns {Promise<Object>} Upload result
 */
export async function uploadPageTemplate({ pageTemplate, locale, projectId }) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    projectId,
    lang: locale,
    pageYaml: pageTemplate,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${PAGES_KIT_API_BASE}/upload-page`, requestOptions);

    try {
      const data = await response.json();
      return { uploadPageResult: data, success: true };
    } catch {
      const text = await response.text();
      return { uploadPageResult: text, success: response.ok };
    }
  } catch (error) {
    return { error: error.message, success: false };
  }
}

/**
 * Validate Pages Kit YAML structure
 * @param {string} yamlContent - YAML content to validate
 * @returns {Object} Validation result
 */
export function validatePageYaml(yamlContent) {
  try {
    const yaml = require("yaml");
    const parsed = yaml.parse(yamlContent);

    // Check required fields
    const requiredFields = ["slug", "sections"];
    const missingFields = requiredFields.filter((field) => !parsed[field]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      };
    }

    // Validate sections structure
    if (!Array.isArray(parsed.sections)) {
      return {
        isValid: false,
        error: "Sections must be an array",
      };
    }

    // Check each section has required fields
    for (let i = 0; i < parsed.sections.length; i++) {
      const section = parsed.sections[i];
      if (!section.name || !section.component) {
        return {
          isValid: false,
          error: `Section ${i + 1} missing required name or component field`,
        };
      }
    }

    return { isValid: true, parsed };
  } catch (error) {
    return {
      isValid: false,
      error: `YAML parsing error: ${error.message}`,
    };
  }
}

/**
 * Generate SEO-optimized slug from title
 * @param {string} title - Page title
 * @returns {string} SEO-friendly slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Optimize meta data for SEO
 * @param {Object} meta - Meta data object
 * @returns {Object} Optimized meta data
 */
export function optimizeMetaData(meta) {
  const optimized = { ...meta };

  // Optimize title length (30-60 characters)
  if (optimized.title) {
    if (optimized.title.length > 60) {
      optimized.title = `${optimized.title.substring(0, 57)}...`;
    }
  }

  // Optimize description length (120-160 characters)
  if (optimized.description) {
    if (optimized.description.length > 160) {
      optimized.description = `${optimized.description.substring(0, 157)}...`;
    } else if (optimized.description.length < 120) {
      // Could suggest expansion, but we'll leave as is
    }
  }

  return optimized;
}

/**
 * Generate component configuration based on type
 * @param {string} componentType - Component type
 * @param {Object} data - Component data
 * @returns {Object} Component configuration
 */
export function generateComponentConfig(componentType, data = {}) {
  const configs = {
    "layout-block": {
      gridSettings: {
        columns: data.columns || 12,
        gap: data.gap || 16,
        responsive: data.responsive || true,
      },
    },
    "custom-component": {
      componentId: data.componentId,
      componentName: data.componentName,
    },
  };

  return configs[componentType] || {};
}

/**
 * Validate component data against component schema
 * @param {string} componentId - Component ID
 * @param {Object} dataSource - Component data
 * @param {Object} componentSchema - Component schema definition
 * @returns {Object} Validation result
 */
export function validateComponentData(_componentId, dataSource, componentSchema) {
  if (!componentSchema || !componentSchema.properties) {
    return { isValid: true }; // Skip validation if no schema
  }

  const errors = [];
  const properties = componentSchema.properties;

  // Check required properties
  for (const [propKey, propDef] of Object.entries(properties)) {
    if (propDef.required && !dataSource[propKey]) {
      errors.push(`Missing required property: ${propKey}`);
    }

    // Type validation
    const value = dataSource[propKey];
    if (value !== undefined && value !== null) {
      if (propDef.type === "array" && !Array.isArray(value)) {
        errors.push(`Property ${propKey} should be an array`);
      } else if (propDef.type === "string" && typeof value !== "string") {
        errors.push(`Property ${propKey} should be a string`);
      } else if (propDef.type === "boolean" && typeof value !== "boolean") {
        errors.push(`Property ${propKey} should be a boolean`);
      } else if (propDef.type === "url" && typeof value === "string" && !isValidUrl(value)) {
        errors.push(`Property ${propKey} should be a valid URL`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Check if a string is a valid URL
 * @param {string} string - String to validate
 * @returns {boolean} True if valid URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} baseUrl - Base image URL
 * @returns {Object} Responsive image configuration
 */
export function generateResponsiveImages(baseUrl) {
  if (!baseUrl || !isValidUrl(baseUrl)) {
    return { url: baseUrl };
  }

  // This is a placeholder implementation
  // In a real scenario, you might want to integrate with an image processing service
  return {
    url: baseUrl,
    srcSet: {
      mobile: baseUrl,
      tablet: baseUrl,
      desktop: baseUrl,
    },
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw",
  };
}

/**
 * Process component list and extract available components
 * @param {string} componentListContent - Component list markdown content
 * @returns {Object} Parsed component information
 */
export function parseComponentList(componentListContent) {
  const components = {
    basic: [],
    custom: [],
  };

  try {
    // This is a simplified parser - you might want to use a proper markdown parser
    const lines = componentListContent.split("\n");
    let currentSection = null;
    let currentComponent = null;

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.includes("basic-component-list:")) {
        currentSection = "basic";
      } else if (trimmed.includes("custom-component-list:")) {
        currentSection = "custom";
      } else if (trimmed.startsWith("- id:") && currentSection) {
        const id = trimmed.replace("- id:", "").trim();
        currentComponent = { id };
      } else if (trimmed.startsWith("name:") && currentComponent) {
        currentComponent.name = trimmed.replace("name:", "").trim();
      } else if (trimmed.startsWith("description:") && currentComponent) {
        currentComponent.description = trimmed.replace("description:", "").trim();

        if (currentSection && currentComponent.id && currentComponent.name) {
          components[currentSection].push(currentComponent);
          currentComponent = null;
        }
      }
    }
  } catch (error) {
    console.warn("Failed to parse component list:", error.message);
  }

  return components;
}

/**
 * Generate default component data based on component type
 * @param {string} componentId - Component ID
 * @param {Object} componentDef - Component definition
 * @returns {Object} Default component data
 */
export function generateDefaultComponentData(_componentId, componentDef) {
  if (!componentDef || !componentDef.properties) {
    return {};
  }

  const data = {};

  for (const [propKey, propDef] of Object.entries(componentDef.properties)) {
    switch (propDef.type) {
      case "string":
        data[propKey] = propDef.description || `Default ${propKey}`;
        break;
      case "boolean":
        data[propKey] = false;
        break;
      case "array":
        data[propKey] = [];
        break;
      case "url":
        data[propKey] = "https://via.placeholder.com/400x300";
        break;
      case "color":
        data[propKey] = "#ffffff";
        break;
      case "json":
        if (propDef.subProperties?.text) {
          data[propKey] = { text: `Default ${propKey} text` };
        } else {
          data[propKey] = {};
        }
        break;
      default:
        data[propKey] = null;
    }
  }

  return data;
}
