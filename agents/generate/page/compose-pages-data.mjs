import { readFileSync, rmSync } from "node:fs";
import { basename, join } from "node:path";
import _ from "lodash";
import { parse, stringify } from "yaml";
import {
  extractFieldCombinations,
  generateDeterministicId,
  generateRandomId,
  getChildFieldCombinationsKey,
} from "../../../utils/generate-helper.mjs";
import savePagesKitData from "./save-pages-data.mjs";

const DEFAULT_FLAG = false;
let DEFAULT_TEST_FILE = {};
try {
  DEFAULT_TEST_FILE = {
    filePath: "getting-started.yaml",
    content: readFileSync("getting-started.yaml", "utf-8"),
  };
} catch (_error) {
  // ignore error
}

// ============= Logging Control =============
const ENABLE_LOGS = process.env.ENABLE_LOGS === "true"; // Set to false to disable all log output

function log(...args) {
  if (ENABLE_LOGS) {
    console.log(...args);
  }
}

function logError(...args) {
  if (ENABLE_LOGS) {
    logError(...args);
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
 * Transform data source to properties format
 */
function transformDataSource(instance, moreContentsComponentMap, locale) {
  if (!instance?.dataSource) return null;

  const { componentId } = instance;
  const currentComponentInfo = moreContentsComponentMap[componentId];
  const propKeyToInfoMap = currentComponentInfo?.content?.propKeyToInfoMap;

  const properties = {};
  Object.entries(instance.dataSource).forEach(([key, value]) => {
    const mappedId = propKeyToInfoMap?.[key]?.id || key;
    properties[mappedId] = { value };
  });

  return {
    [instance.id]: {
      [locale]: {
        properties,
      },
    },
  };
}

/**
 * Recursively extract all instances
 */
function extractAllInstances(instances) {
  const result = [];

  instances.forEach((instance) => {
    if (instance?.instance) {
      // arrayComponentInstances format: { fieldName, itemIndex, instance }
      result.push({ instance: instance.instance });
      if (instance.instance?.relatedInstances) {
        result.push(...extractAllInstances(instance.instance.relatedInstances));
      }
    } else if (instance) {
      // Direct instance format
      result.push({ instance });
      if (instance.relatedInstances) {
        result.push(...extractAllInstances(instance.relatedInstances));
      }
    }
  });

  return result;
}

function convertToSection({ componentInstance, arrayComponentInstances, locale }) {
  if (componentInstance?.type === "atomic") {
    const { componentId, id, name } = componentInstance;

    return {
      id,
      name,
      component: "custom-component",
      config: {
        componentId,
        useCache: true,
      },
    };
  } else if (componentInstance?.type === "composite") {
    const { config, id, relatedInstances, name } = componentInstance;

    const sections =
      relatedInstances?.map(({ instance }) => {
        return convertToSection({ componentInstance: instance, locale });
      }) || [];

    const oldKeyToIdMap = {};

    const arraySections =
      arrayComponentInstances?.map(({ fieldName, itemIndex, instance }) => {
        const oldKey = `${fieldName}.${itemIndex}`;
        const section = convertToSection({
          componentInstance: instance,
          locale,
        });
        oldKeyToIdMap[oldKey] = section.id;

        return section;
      }) || [];

    let newConfig = JSON.stringify(config);

    Object.keys(oldKeyToIdMap).forEach((oldKey) => {
      newConfig = newConfig.replaceAll(oldKey, oldKeyToIdMap[oldKey]);
    });

    const allSections = [...sections, ...arraySections];

    return {
      id,
      component: "layout-block",
      name,
      config: JSON.parse(newConfig),
      sections: _.keyBy(allSections, "id"),
      sectionIds: allSections.map(({ id }) => id),
    };
  }
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
// Create atomic component instance
function createAtomicInstance(section, component, instanceId) {
  log(`    📦 Processing atomic component...`);

  const dataSourceTemplate = component.dataSourceTemplate;
  if (!dataSourceTemplate) {
    log(`    ⚠️  Component ${component.name} has no dataSourceTemplate`);
    return {
      id: instanceId,
      type: "atomic",
      componentId: component.componentId,
      name: section.name || component.name,
      dataSource: null,
      config: null,
    };
  }

  log(`    🔨 Processing section data with template...`);

  try {
    const dataSource = processTemplate(dataSourceTemplate, section);
    log(`    ✅ DataSource generated successfully`);

    return {
      id: instanceId,
      type: "atomic",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource,
      config: null,
    };
  } catch (error) {
    log(`    ❌ Template compilation failed:`, error.message);
    return {
      id: instanceId,
      type: "atomic",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource: dataSourceTemplate, // Use original template as fallback
      config: null,
    };
  }
}

// Create composite component instance
function createCompositeInstance(section, component, componentLibrary, instanceId) {
  log(`    📦 Processing composite component...`);

  const relatedComponents = component.relatedComponents || [];
  const configTemplate = component.configTemplate;

  if (!configTemplate) {
    log(`    ⚠️  Component ${component.name} has no configTemplate`);
    return {
      id: instanceId,
      type: "composite",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource: null,
      config: null,
      relatedInstances: [],
    };
  }

  log(`    🔗 Related components count: ${relatedComponents.length}`);

  // Generate complete instances for each relatedComponent
  const relatedInstances = relatedComponents.map(({ componentId, fieldCombinations }, index) => {
    log(`      🔍 Processing Related component ${index + 1}: ${componentId}`);

    // Find corresponding component in component library
    const relatedComponent = componentLibrary.find((comp) => comp.componentId === componentId);

    if (!relatedComponent) {
      log(`      ❌ Component not found: ${componentId}`);
      return {
        originalComponentId: componentId,
        instanceId: generateRandomId(),
        instance: null,
      };
    }

    log(`      ✅ Found component: ${relatedComponent.name} (${relatedComponent.type})`);

    const childrenSection = _.pick(section, fieldCombinations);

    // Remove top-level keys, extract internal properties
    const flattenedChildren = (() => {
      const entries = Object.entries(childrenSection);
      if (entries.length > 0) {
        return entries.reduce((acc, [, value]) => {
          if (typeof value === "object" && value !== null) {
            if (Array.isArray(value)) {
              // Extract object content from array
              value.forEach((item) => {
                if (typeof item === "object" && item !== null) {
                  Object.assign(acc, item);
                }
              });
            } else {
              // Extract object content
              Object.assign(acc, value);
            }
          }
          return acc;
        }, {});
      }
      return childrenSection;
    })();

    // Recursively create child component instances
    const childInstance = createComponentInstance(
      {
        ...section,
        ...flattenedChildren,
      },
      relatedComponent,
      componentLibrary,
      index, // Pass the same section index
    );

    return {
      originalComponentId: componentId,
      originalGridSettingsKey: getChildFieldCombinationsKey(fieldCombinations),
      instanceId: childInstance.id,
      instance: childInstance,
      section,
    };
  });

  // Replace relatedComponents values in configTemplate
  log(`    🔄 Replacing component IDs in configTemplate...`);
  let configString = JSON.stringify(configTemplate);

  relatedInstances.forEach((instance) => {
    const oldKey = instance.originalGridSettingsKey;
    const newKey = instance.instanceId;
    configString = configString.replace(new RegExp(oldKey, "g"), newKey);
    log(`      ✅ Replaced ${oldKey} -> ${newKey}`);
  });

  try {
    const config = JSON.parse(configString);
    log(`    ✅ Config generated successfully`);

    return {
      id: instanceId,
      type: "composite",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource: null,
      config,
      relatedInstances,
    };
  } catch (error) {
    log(`    ❌ Config processing failed:`, error.message);
    return {
      id: instanceId,
      type: "composite",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource: null,
      config: configTemplate,
      relatedInstances,
    };
  }
}

// Unified function for creating component instances
function createComponentInstance(section, component, componentLibrary = [], sectionIndex = 0) {
  // Use deterministic ID generation based on component ID and section content
  const contentHash = JSON.stringify({
    componentId: component.componentId,
    sectionName: section.name,
    sectionIndex,
    // Use hash of key fields to ensure same content generates same ID
    keys: Object.keys(section).sort(),
  });
  const instanceId = generateDeterministicId(contentHash);
  log(`    🔧 Generated component instance ID: ${instanceId}`);

  if (component.type === "atomic") {
    return createAtomicInstance(section, component, instanceId);
  } else if (component.type === "composite") {
    return createCompositeInstance(section, component, componentLibrary, instanceId);
  }

  log(`    ⚠️  Unknown component type: ${component.type}`);
  return {
    id: instanceId,
    type: component.type,
    componentId: component.componentId,
    dataSource: null,
    config: null,
  };
}

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

    // Match components for each section
    const composedSections = parsedData.sections.map((section, index) => {
      log(`  🏷️  Processing Section ${index + 1}: "${section.name}"`);

      // Use SDK to extract field combinations
      const sectionAnalysis = extractFieldCombinations({ sections: [section] });
      const fieldCombinations = sectionAnalysis[0]?.fieldCombinations || [];

      log(`    📋 Field combinations:`, JSON.stringify(fieldCombinations));

      // Match component
      const matchedComponent = componentLibrary.find((component) => {
        const componentFields = component.fieldCombinations || [];
        return _.isEqual(componentFields, fieldCombinations);
      });

      if (matchedComponent) {
        log(`    ✅ Matched component: ${matchedComponent.name} (${matchedComponent.type})`);

        // Generate main component instance
        const componentInstance = createComponentInstance(
          section,
          matchedComponent,
          componentLibrary,
          index, // Pass section index
        );

        // Process array fields
        const arrayComponents = [];
        const arrayComponentInstances = [];
        // const arrayFields = sectionAnalysis[0]?.arrayFields || [];

        // if (arrayFields.length > 0) {
        //   log(`    🔍 处理 ${arrayFields.length} 个数组字段...`);

        //   arrayFields.forEach((arrayField) => {
        //     const { fieldName, fieldCombinationsList } = arrayField;
        //     log(
        //       `      📋 处理数组字段 "${fieldName}": ${fieldCombinationsList.length} 个items`
        //     );

        //     // 为数组中的每个item匹配组件并创建实例
        //     const arrayItemInstances = fieldCombinationsList.map(
        //       (itemFieldCombinations, itemIndex) => {
        //         log(
        //           `        🔍 Item ${itemIndex + 1}: ${JSON.stringify(
        //             itemFieldCombinations
        //           )}`
        //         );

        //         // 匹配组件
        //         const itemComponent = componentLibrary.find((component) => {
        //           const componentFields = component.fieldCombinations || [];
        //           return _.isEqual(componentFields, itemFieldCombinations);
        //         });

        //         if (itemComponent) {
        //           log(
        //             `        ✅ 匹配到组件: ${itemComponent.name} (${itemComponent.type})`
        //           );

        //           // 获取数组中对应的实际数据
        //           const itemData = section[fieldName]?.[itemIndex];

        //           if (itemData) {
        //             const itemInstance = createComponentInstance(
        //               itemData,
        //               itemComponent,
        //               componentLibrary
        //             );
        //             return {
        //               itemIndex,
        //               component: itemComponent,
        //               instance: itemInstance,
        //               matched: true,
        //             };
        //           } else {
        //             log(`        ⚠️  Item ${itemIndex + 1} 数据缺失`);
        //             return {
        //               itemIndex,
        //               component: itemComponent,
        //               instance: null,
        //               matched: false,
        //             };
        //           }
        //         } else {
        //           log(`        ❌ 未找到匹配的组件`);
        //           return {
        //             itemIndex,
        //             component: null,
        //             instance: null,
        //             matched: false,
        //           };
        //         }
        //       }
        //     );

        //     // 创建数组字段的容器组件
        //     const matchedItems = arrayItemInstances.filter(
        //       (item) => item.matched
        //     ).length;
        //     log(
        //       `      📊 数组字段 "${fieldName}": ${matchedItems}/${arrayItemInstances.length} 个items成功匹配`
        //     );

        //     // 收集数组字段的组件和实例
        //     const fieldComponents = [];
        //     const fieldInstances = [];

        //     arrayItemInstances.forEach((result) => {
        //       if (result.matched && result.component) {
        //         fieldComponents.push(result.component);
        //       }
        //       if (result.matched && result.instance) {
        //         fieldInstances.push({
        //           fieldName,
        //           itemIndex: result.itemIndex,
        //           component: result.component,
        //           instance: result.instance,
        //         });
        //       }
        //     });

        //     // 去重组件（同一类型的组件只需要记录一次）
        //     const uniqueComponents = _.uniqBy(fieldComponents, "componentId");
        //     arrayComponents.push(...uniqueComponents);
        //     arrayComponentInstances.push(...fieldInstances);

        //     log(`      🧩 找到 ${uniqueComponents.length} 种不同的组件类型`);
        //   });
        // }

        return {
          section,
          component: matchedComponent,
          componentInstance,
          arrayComponents,
          arrayComponentInstances,
          fieldCombinations,
          matched: true,
        };
      } else {
        log(`    ❌ No matching component found`);
        return {
          section,
          component: null,
          componentInstance: null,
          arrayComponents: [],
          arrayComponentInstances: [],
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
    path,
    pagesDir,
    outputDir,
    moreContentsComponentList,
    tmpDir,
  } = input;

  // clear outputDir data
  try {
    rmSync(outputDir, { recursive: true, force: true });
  } catch (_error) {
    // ignore error
  }

  const moreContentsComponentMap = {};

  moreContentsComponentList.forEach((comp) => {
    moreContentsComponentMap[comp.content.id] = comp;
  });

  log(`🔧 Starting to compose Pages Kit YAML: ${path}`);
  log(`🧩 Component library count: ${componentLibrary?.length || 0}`);
  log(`🌐 Locale: ${locale}`);
  log(`📁 Output directory: ${pagesDir}`);

  // Process middle format files, match components
  const allComposedSections = [];
  const allPagesKitYamlList = [];

  // Used to organize data by filePath for different languages
  const fileDataMap = new Map();

  if (middleFormatFiles && Array.isArray(middleFormatFiles)) {
    log(`📄 Middle format files count: ${middleFormatFiles.length}`);

    // Build processing list containing all language files
    const filesToProcess = [];

    // Add main language files
    const mainFiles = DEFAULT_FLAG ? [DEFAULT_TEST_FILE] : middleFormatFiles;
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
        composedSections.forEach((section) => {
          const { componentInstance, arrayComponentInstances } = section;

          if (componentInstance) {
            fileData.sections[componentInstance.id] = convertToSection({
              componentInstance,
              arrayComponentInstances,
              locale: currentLanguage,
            });
            fileData.sectionIds.push(componentInstance.id);
          }
        });
      }

      // Generate dataSource for all instances in current language
      composedSections.forEach((section) => {
        const { componentInstance, arrayComponentInstances } = section;

        if (componentInstance) {
          // Use common function to extract all instances
          const allInstances = [
            { instance: componentInstance },
            ...extractAllInstances(componentInstance?.relatedInstances || []),
            ...extractAllInstances(arrayComponentInstances || []),
          ];

          // Process data source for each instance
          allInstances.forEach(({ instance }) => {
            const dataSourceResult = transformDataSource(
              instance,
              moreContentsComponentMap,
              currentLanguage,
            );

            if (dataSourceResult) {
              // Merge into file data
              Object.keys(dataSourceResult).forEach((instanceId) => {
                if (!fileData.dataSource[instanceId]) {
                  fileData.dataSource[instanceId] = {};
                }
                fileData.dataSource[instanceId] = {
                  ...fileData.dataSource[instanceId],
                  ...dataSourceResult[instanceId],
                };
              });
            }
          });
        }
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
