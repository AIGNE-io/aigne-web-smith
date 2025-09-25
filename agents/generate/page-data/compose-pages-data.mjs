import { rmSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import _ from "lodash";
import { parse, stringify } from "yaml";
import {
  extractFieldCombinations,
  generateDeterministicId,
} from "../../../utils/generate-helper.mjs";
import savePagesKitData from "./save-pages-data.mjs";

// ============= Logging Control =============
const ENABLE_LOGS = process.env.ENABLE_LOGS === "true"; // Set to false to disable all log output

function log(...args) {
  if (ENABLE_LOGS) {
    console.log(...args);
  }
}

function logError(...args) {
  if (ENABLE_LOGS) {
    console.error(...args);
  }
}

// ============= Common Utility Functions =============

/**
 * Read middle format file for specified language
 * @param {string} tmpDir - Temporary directory
 * @param {string} locale - Language code
 * @param {string} fileName - File name
 * @returns {Promise<Object|null>} Parsed file content
 */
async function readMiddleFormatFile(tmpDir, locale, fileName) {
  try {
    const filePath = join(tmpDir, locale, fileName);

    const content = readFileSync(filePath, "utf8");

    return parse(content);
  } catch (error) {
    log(`⚠️  Unable to read file ${locale}/${fileName}: ${error.message}`);
    return null;
  }
}

/**
 * Get nested object value, supports a.b.c format
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * Process simple template replacement, only handles <%= xxx %> pattern
 */
function processSimpleTemplate(obj, data) {
  if (typeof obj === "string") {
    return obj.replace(/<%=\s*([^%]+)\s*%>/g, (_match, key) => {
      const value = getNestedValue(data, key.trim());
      return value !== undefined ? value : "";
    });
  } else if (Array.isArray(obj)) {
    // Recursively process each element in the array
    return obj.map((item) => processSimpleTemplate(item, data));
  } else if (obj && typeof obj === "object") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = processSimpleTemplate(value, data);
    }
    return result;
  }
  return obj;
}

/**
 * Process array template - Special case: single-element array as template
 */
function processArrayTemplate(templateArray, data) {
  // If not an array or not a single-element array, process normally
  if (!Array.isArray(templateArray) || templateArray.length !== 1) {
    return templateArray.map((item) => processSimpleTemplate(item, data));
  }

  // Special case: single-element array might be a template array, find array fields in data
  const arrayField = Object.keys(data).find((key) => Array.isArray(data[key]));

  if (arrayField && data[arrayField]?.length > 0) {
    // This is a template array, need to copy template for each data item
    const template = templateArray[0];
    return data[arrayField].map((arrayItem) => processSimpleTemplate(template, arrayItem));
  }

  // Otherwise process array normally
  return templateArray.map((item) => processSimpleTemplate(item, data));
}

/**
 * Unified template processing function
 */
function processTemplate(obj, data) {
  // For arrays, first check if it's a special template array case
  if (Array.isArray(obj) && obj.length === 1) {
    // Might be a template array, use dedicated processing function
    return processArrayTemplate(obj, data);
  }
  // Other cases use normal processing (including regular arrays and objects)
  return processSimpleTemplate(obj, data);
}

/**
 * Ensure custom component sections include default config overrides
 */
function ensureCustomComponentConfig(section) {
  if (section.component === "custom-component") {
    section.config = {
      useCache: true,
      ...section.config,
    };
  }

  return section;
}

function cloneTemplateSection(section, { templateId, sectionIndex, path = [] }, idMap) {
  const cloned = _.cloneDeep(section);

  const derivedId = generateDeterministicId(
    JSON.stringify({
      templateId,
      templateSectionId: section.id,
      sectionIndex,
      path,
    }),
  );

  cloned.id = derivedId;
  idMap.set(section.id, derivedId);

  if (cloned.sectionIds && cloned.sections) {
    const nextSections = {};
    const nextSectionIds = [];

    cloned.sectionIds.forEach((childId, idx) => {
      const childTemplate = section.sections?.[childId];
      if (!childTemplate) {
        return;
      }

      const childClone = cloneTemplateSection(
        childTemplate,
        {
          templateId,
          sectionIndex,
          path: [...path, idx],
        },
        idMap,
      );

      nextSections[childClone.id] = childClone;
      nextSectionIds.push(childClone.id);
    });

    cloned.sections = nextSections;
    cloned.sectionIds = nextSectionIds;
  } else {
    delete cloned.sections;
    delete cloned.sectionIds;
  }

  ensureCustomComponentConfig(cloned);

  return cloned;
}

function instantiateComponentTemplate({ component, sectionData, sectionIndex }) {
  const templateId = component.id || component.componentId || component.name;
  if (!component?.section) {
    return {
      section: null,
      idMap: new Map(),
      dataSource: {},
    };
  }

  const idMap = new Map();
  const clonedSection = cloneTemplateSection(
    component.section,
    {
      templateId,
      sectionIndex,
      path: [],
    },
    idMap,
  );

  const transformedDataSource = {};
  const templateDataSource = component.dataSource || {};

  Object.entries(templateDataSource).forEach(([originalSectionId, templateData]) => {
    const newSectionId = idMap.get(originalSectionId);
    if (!newSectionId) {
      return;
    }

    const processed = processTemplate(_.cloneDeep(templateData), sectionData);
    if (processed === undefined || processed === null) {
      return;
    }

    if (typeof processed === "object" && _.isEmpty(processed)) {
      return;
    }

    transformedDataSource[newSectionId] = processed;
  });

  return {
    section: clonedSection,
    idMap,
    dataSource: transformedDataSource,
  };
}

/**
 * Complete process for composing Pages Kit YAML
 * Integrates assembly and save logic, directly prints output results
 * @param {Object} input
 * @param {Array} input.middleFormatFiles - Middle format files array
 * @param {Array} input.componentLibrary - Component list
 * @param {string} input.locale - Language environment
 * @param {string} input.path - File path
 * @param {string} input.pagesDir - Pages directory
 * @returns {Promise<Object>}
 */

// Reusable function: match middle format sections to corresponding components
function composeSectionsWithComponents(middleFormatContent, componentLibrary) {
  log(`🔍 Starting to parse middle format and match components...`);

  try {
    // Parse middle format content
    const parsedData =
      typeof middleFormatContent === "string" ? parse(middleFormatContent) : middleFormatContent;
    if (!parsedData || !parsedData.sections) {
      log(`⚠️  Middle format content has no sections field`);
      return [];
    }

    log(`📑 Found ${parsedData.sections.length} sections`);

    const compositeComponents = (componentLibrary || []).filter(
      (component) => component.type === "composite",
    );

    // Match components for each section
    const composedSections = parsedData.sections?.map((section, index) => {
      log(`  🏷️  Processing Section ${index + 1}: "${section.name}"`);

      // Use SDK to extract field combinations
      const sectionAnalysis = extractFieldCombinations({ sections: [section] });
      const fieldCombinations = sectionAnalysis[0]?.fieldCombinations || [];

      log(`    📋 Field combinations:`, JSON.stringify(fieldCombinations));

      // Match component
      const matchedComponent = compositeComponents.find((component) => {
        const componentFields = component.fieldCombinations || [];
        return _.isEqual(componentFields?.sort(), fieldCombinations?.sort());
      });

      if (matchedComponent) {
        log(`    ✅ Matched component: ${matchedComponent.name}`);

        const instantiation = instantiateComponentTemplate({
          component: matchedComponent,
          sectionData: section,
          sectionIndex: index,
        });

        return {
          section,
          component: matchedComponent,
          instantiation,
          fieldCombinations,
          matched: true,
        };
      } else {
        log(`    ❌ No matching component found`);
        return {
          section,
          component: null,
          instantiation: null,
          fieldCombinations,
          matched: false,
        };
      }
    });

    const matchedCount = composedSections.filter((item) => item.matched).length;
    log(
      `✅ Matching completed: ${matchedCount}/${composedSections.length} sections found matching components`,
    );

    return composedSections;
  } catch (error) {
    logError(`❌ Failed to parse middle format:`, error.message);
    return [];
  }
}

export default async function composePagesData(input) {
  const {
    middleFormatFiles,
    componentLibrary,
    locale,
    translateLanguages = [],
    pagesDir,
    outputDir,
    tmpDir,
  } = input;

  // clear outputDir data
  try {
    rmSync(outputDir, { recursive: true, force: true });
  } catch (_error) {
    // ignore error
  }

  log(`🔧 Starting to compose Pages Kit YAML: ${pagesDir}`);
  log(`🧩 Component library count: ${componentLibrary?.length || 0}`);
  log(`🌐 Locale: ${locale}`);
  log(`📁 Output directory: ${pagesDir}`);

  // Process middle format files, match components
  const allComposedSections = [];
  const allPagesKitYamlList = [];

  // Used to organize data by filePath for different languages
  const fileDataMap = new Map();

  if (middleFormatFiles && Array.isArray(middleFormatFiles)) {
    log(`📄 Page detail count: ${middleFormatFiles.length}`);

    // Build processing list containing all language files
    const filesToProcess = [];

    // Add main language files
    const mainFiles = middleFormatFiles;
    mainFiles.forEach((file) => {
      filesToProcess.push({
        ...file,
        language: locale,
        isMainLanguage: true,
      });
    });

    // Add translation language files
    if (translateLanguages && translateLanguages.length > 0 && tmpDir) {
      for (const translateLang of translateLanguages) {
        mainFiles.forEach((file) => {
          const translateFile = {
            filePath: file.filePath,
            content: null, // Read later
            language: translateLang,
            isMainLanguage: false,
          };
          filesToProcess.push(translateFile);
        });
      }
    }

    log(
      `📄 Total files to process: ${filesToProcess.length} (including ${translateLanguages?.length || 0} translation languages)`,
    );

    for (const [index, file] of filesToProcess.entries()) {
      // Read content for non-main language files
      let middleFormatContent;
      if (file.isMainLanguage) {
        middleFormatContent = typeof file.content === "string" ? parse(file.content) : file.content;
      } else {
        // Read translation language file
        const translateContent = await readMiddleFormatFile(tmpDir, file.language, file.filePath);
        if (!translateContent) {
          log(`⚠️  Skipping unreadable translation file: ${file.language}/${file.filePath}`);
          continue;
        }
        middleFormatContent = translateContent;
      }

      const filePath = file.filePath;
      const currentLanguage = file.language;

      log(
        `\n📋 Processing file ${index + 1}/${filesToProcess.length}: ${currentLanguage}/${filePath}`,
      );

      // Use reusable function to match sections and components
      const composedSections = composeSectionsWithComponents(middleFormatContent, componentLibrary);

      // Collect all matching results
      allComposedSections.push(...composedSections);

      // Ensure file entry exists in fileDataMap
      if (!fileDataMap.has(filePath)) {
        fileDataMap.set(filePath, {
          filePath,
          meta: middleFormatContent.meta,
          locales: {},
          sections: {},
          sectionIds: [],
          dataSource: {},
        });
      }

      const fileData = fileDataMap.get(filePath);

      // Add locale info for current language
      fileData.locales[currentLanguage] = {
        backgroundColor: "",
        style: {
          maxWidth: "custom:1560px",
          paddingY: "large",
          paddingX: "large",
        },
        title: middleFormatContent.meta.title,
        description: middleFormatContent.meta.description,
        image: middleFormatContent.meta.image,
        header: {
          sticky: true,
        },
      };

      // If main language, set sections and sectionIds
      if (file.isMainLanguage) {
        composedSections.forEach(({ instantiation }) => {
          const instantiatedSection = instantiation?.section;
          if (!instantiatedSection) {
            return;
          }

          fileData.sections[instantiatedSection.id] = instantiatedSection;
          if (!fileData.sectionIds.includes(instantiatedSection.id)) {
            fileData.sectionIds.push(instantiatedSection.id);
          }
        });
      }

      // Generate dataSource for all instances in current language
      composedSections.forEach(({ instantiation }) => {
        if (!instantiation) {
          return;
        }

        Object.entries(instantiation.dataSource || {}).forEach(([instanceId, data]) => {
          if (!instanceId || data === undefined) {
            return;
          }

          if (!fileData.dataSource[instanceId]) {
            fileData.dataSource[instanceId] = {};
          }

          fileData.dataSource[instanceId][currentLanguage] = _.cloneDeep(data);
        });
      });
    }

    // Convert data in fileDataMap to final Pages Kit YAML
    fileDataMap.forEach((fileData) => {
      const now = new Date().toISOString();

      const pagesKitData = {
        id: generateDeterministicId(fileData.filePath),
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        isPublic: true,
        locales: fileData.locales,
        sections: fileData.sections,
        sectionIds: fileData.sectionIds,
        dataSource: fileData.dataSource,
      };

      allPagesKitYamlList.push({
        filePath: fileData.filePath,
        content: stringify(pagesKitData, {
          aliasDuplicateObjects: false,
        }),
      });
    });

    log(`\n📊 Total processing results:`);
    log(`  - Total sections count: ${allComposedSections.length}`);
    log(
      `  - Successfully matched count: ${allComposedSections.filter((item) => item.matched).length}`,
    );
    log(`  - Unmatched count: ${allComposedSections.filter((item) => !item.matched).length}`);
    log(`  - Generated files count: ${fileDataMap.size}`);
  }

  allPagesKitYamlList?.forEach((item) => {
    const { filePath, content } = item;
    savePagesKitData({
      path: basename(filePath).split(".")?.[0] || filePath,
      locale,
      pagesDir,
      pagesKitYaml: content,
      outputDir,
    });
  });

  return {
    ...input,
  };
}

composePagesData.taskTitle = "Compose Pages Data";
