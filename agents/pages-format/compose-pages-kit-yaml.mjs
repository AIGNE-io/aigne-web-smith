import { stringify, parse } from "yaml";
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import {
  generateRandomId,
  extractFieldCombinations,
  getChildFieldCombinationsKey,
} from "./sdk.mjs";
import { getFileName } from "../../utils/utils.mjs";

import savePagesKitYaml from "./save-pages-kit-yaml.mjs";
import _ from "lodash";
import { readFileSync } from "node:fs";

// ============= 公共工具函数 =============

/**
 * 根据字段组合查找匹配的组件
 */
function findComponentByFields(fieldCombinations, componentLibrary = []) {
  return componentLibrary.find((component) => {
    const componentFields = component.fieldCombinations || [];
    return _.isEqual(componentFields, fieldCombinations);
  });
}

/**
 * 获取嵌套对象的值，支持 a.b.c 格式
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

/**
 * 处理简单模板替换，只处理 <%= xxx %> 模式
 */
function processSimpleTemplate(obj, data) {
  if (typeof obj === "string") {
    return obj.replace(/<%=\s*([^%]+)\s*%>/g, (match, key) => {
      const value = getNestedValue(data, key.trim());
      return value !== undefined ? value : "";
    });
  } else if (Array.isArray(obj)) {
    // 递归处理数组中的每个元素
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
 * 处理数组模板 - 特殊情况：单元素数组作为模板处理
 */
function processArrayTemplate(templateArray, data) {
  // 如果不是数组或不是单元素数组，正常处理
  if (!Array.isArray(templateArray) || templateArray.length !== 1) {
    return templateArray.map((item) => processSimpleTemplate(item, data));
  }

  // 特殊情况：单元素数组可能是模板数组，查找数据中的数组字段
  const arrayField = Object.keys(data).find((key) => Array.isArray(data[key]));

  if (arrayField && data[arrayField]?.length > 0) {
    // 这是一个模板数组，需要为每个数据项复制模板
    const template = templateArray[0];
    return data[arrayField].map((arrayItem) =>
      processSimpleTemplate(template, arrayItem)
    );
  }

  // 否则正常处理数组
  return templateArray.map((item) => processSimpleTemplate(item, data));
}

/**
 * 统一的模板处理函数
 */
function processTemplate(obj, data) {
  // 对于数组，先检查是否为特殊的模板数组情况
  if (Array.isArray(obj) && obj.length === 1) {
    // 可能是模板数组，使用专用处理函数
    return processArrayTemplate(obj, data);
  }
  // 其他情况使用普通处理（包括普通数组和对象）
  return processSimpleTemplate(obj, data);
}

/**
 * 转换数据源到属性格式
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
 * 递归提取所有实例
 */
function extractAllInstances(instances) {
  const result = [];

  instances.forEach((instance) => {
    if (instance?.instance) {
      // arrayComponentInstances 格式：{ fieldName, itemIndex, instance }
      result.push({ instance: instance.instance });
      if (instance.instance?.relatedInstances) {
        result.push(...extractAllInstances(instance.instance.relatedInstances));
      }
    } else if (instance) {
      // 直接的实例格式
      result.push({ instance });
      if (instance.relatedInstances) {
        result.push(...extractAllInstances(instance.relatedInstances));
      }
    }
  });

  return result;
}

const DEFAULT_FLAG = false;
let DEFAULT_TEST_FILE = {};
try {
  DEFAULT_TEST_FILE = {
    filePath: "getting-started.yaml",
    content: readFileSync(
      "/Users/FireTable/Code/ArcBlock/aigne-web-smith/.aigne/web-smith/aigne/pages/tmp/zh/getting-started.yaml",
      "utf-8"
    ),
  };
} catch (error) {
  // ignore error
}

function convertToSection({
  componentInstance,
  arrayComponentInstances,
  locale,
}) {
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

    const allowSectionKey = Object.keys({
      ...config?.gridSettings?.desktop,

      ...config?.gridSettings?.mobile,
    });

    // 过滤复合组件的不存在的 section
    // const allSections = [...sections, ...arraySections].filter((section) => {
    //   return allowSectionKey.includes(section.id);
    // });

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

function createPagesKitInstance({ meta, locale }) {
  const now = new Date().toISOString();

  const pagesKitData = {
    id: generateRandomId(),
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    isPublic: true,
    locales: {
      [locale]: {
        backgroundColor: "",
        style: {
          maxWidth: "custom:1560px",
          paddingX: "large",
        },
        title: meta.title,
        description: meta.description,
        image: meta.image,
        header: {
          sticky: true,
        },
      },
    },
    sections: {},
    sectionIds: [],
    dataSource: {},
  };

  return pagesKitData;
}

/**
 * 组合 Pages Kit YAML 的完整流程
 * 集成组装和保存逻辑，直接打印输出结果
 * @param {Object} input
 * @param {Array} input.middleFormatFiles - 中间格式文件数组
 * @param {Array} input.componentLibrary - 组件列表
 * @param {string} input.locale - 语言环境
 * @param {string} input.path - 文件路径
 * @param {string} input.pagesDir - 页面目录
 * @returns {Promise<Object>}
 */
// 创建原子组件实例
function createAtomicInstance(section, component, instanceId) {
  console.log(`    📦 处理 atomic 组件...`);

  const dataSourceTemplate = component.dataSourceTemplate;
  if (!dataSourceTemplate) {
    console.log(`    ⚠️  组件 ${component.name} 没有 dataSourceTemplate`);
    return {
      id: instanceId,
      type: "atomic",
      componentId: component.componentId,
      name: section.name || component.name,
      dataSource: null,
      config: null,
    };
  }

  console.log(`    🔨 使用模板处理 section 数据...`);

  try {
    const dataSource = processTemplate(dataSourceTemplate, section);
    console.log(`    ✅ DataSource 生成成功`);

    return {
      id: instanceId,
      type: "atomic",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource,
      config: null,
    };
  } catch (error) {
    console.log(`    ❌ Template 编译失败:`, error.message);
    return {
      id: instanceId,
      type: "atomic",
      name: section.name || component.name,
      componentId: component.componentId,
      dataSource: dataSourceTemplate, // 使用原始模板作为fallback
      config: null,
    };
  }
}

// 创建复合组件实例
function createCompositeInstance(
  section,
  component,
  componentLibrary,
  instanceId
) {
  console.log(`    📦 处理 composite 组件...`);

  const relatedComponents = component.relatedComponents || [];
  const configTemplate = component.configTemplate;

  if (!configTemplate) {
    console.log(`    ⚠️  组件 ${component.name} 没有 configTemplate`);
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

  console.log(`    🔗 Related components 数量: ${relatedComponents.length}`);

  // 为每个 relatedComponent 生成完整的实例
  const relatedInstances = relatedComponents.map(
    ({ componentId, fieldCombinations }, index) => {
      console.log(
        `      🔍 处理 Related component ${index + 1}: ${componentId}`
      );

      // 查找组件库中对应的组件
      const relatedComponent = componentLibrary.find(
        (comp) => comp.componentId === componentId
      );

      if (!relatedComponent) {
        console.log(`      ❌ 未找到组件: ${componentId}`);
        return {
          originalComponentId: componentId,
          instanceId: generateRandomId(),
          instance: null,
        };
      }

      console.log(
        `      ✅ 找到组件: ${relatedComponent.name} (${relatedComponent.type})`
      );

      const childrenSection = _.pick(section, fieldCombinations);

      // 去掉顶层键，提取内部属性
      const flattenedChildren = (() => {
        const entries = Object.entries(childrenSection);
        if (
          entries.length > 0 &&
          entries.every(
            ([key, value]) =>
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
          )
        ) {
          return entries.reduce((acc, [key, value]) => {
            return { ...acc, ...value };
          }, {});
        }
        return childrenSection;
      })();

      // 递归创建子组件实例
      const childInstance = createComponentInstance(
        {
          ...section,
          ...flattenedChildren,
        },
        relatedComponent,
        componentLibrary
      );

      return {
        originalComponentId: componentId,
        originalGridSettingsKey:
          getChildFieldCombinationsKey(fieldCombinations),
        instanceId: childInstance.id,
        instance: childInstance,
        section,
      };
    }
  );

  // 替换 configTemplate 中的 relatedComponents 值
  console.log(`    🔄 替换 configTemplate 中的组件 ID...`);
  let configString = JSON.stringify(configTemplate);

  relatedInstances.forEach((instance) => {
    const oldKey = instance.originalGridSettingsKey;
    const newKey = instance.instanceId;
    configString = configString.replace(new RegExp(oldKey, "g"), newKey);
    console.log(`      ✅ 替换 ${oldKey} -> ${newKey}`);
  });

  try {
    const config = JSON.parse(configString);
    console.log(`    ✅ Config 生成成功`);

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
    console.log(`    ❌ Config 处理失败:`, error.message);
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

// 创建组件实例的统一函数
function createComponentInstance(section, component, componentLibrary = []) {
  const instanceId = generateRandomId();
  console.log(`    🔧 生成组件实例 ID: ${instanceId}`);

  if (component.type === "atomic") {
    return createAtomicInstance(section, component, instanceId);
  } else if (component.type === "composite") {
    return createCompositeInstance(
      section,
      component,
      componentLibrary,
      instanceId
    );
  }

  console.log(`    ⚠️  未知的组件类型: ${component.type}`);
  return {
    id: instanceId,
    type: component.type,
    componentId: component.componentId,
    dataSource: null,
    config: null,
  };
}

// 复用函数：将中间格式的sections匹配到对应的组件
function composeSectionsWithComponents(middleFormatContent, componentLibrary) {
  console.log(`🔍 开始解析中间格式并匹配组件...`);

  try {
    // 解析中间格式内容
    const parsedData =
      typeof middleFormatContent === "string"
        ? parse(middleFormatContent)
        : middleFormatContent;
    if (!parsedData || !parsedData.sections) {
      console.log(`⚠️  中间格式内容没有sections字段`);
      return [];
    }

    console.log(`📑 找到 ${parsedData.sections.length} 个sections`);

    // 为每个section匹配组件
    const composedSections = parsedData.sections.map((section, index) => {
      console.log(`  🏷️  处理 Section ${index + 1}: "${section.name}"`);

      // 使用SDK提取字段组合
      const sectionAnalysis = extractFieldCombinations({ sections: [section] });
      const fieldCombinations = sectionAnalysis[0]?.fieldCombinations || [];

      console.log(`    📋 字段组合:`, fieldCombinations);

      // 匹配组件
      const matchedComponent = componentLibrary.find((component) => {
        const componentFields = component.fieldCombinations || [];
        return _.isEqual(componentFields, fieldCombinations);
      });

      if (matchedComponent) {
        console.log(
          `    ✅ 匹配到组件: ${matchedComponent.name} (${matchedComponent.type})`
        );

        // 生成主组件实例
        const componentInstance = createComponentInstance(
          section,
          matchedComponent,
          componentLibrary
        );

        // 处理数组字段
        const arrayComponents = [];
        const arrayComponentInstances = [];
        const arrayFields = sectionAnalysis[0]?.arrayFields || [];

        if (arrayFields.length > 0) {
          console.log(`    🔍 处理 ${arrayFields.length} 个数组字段...`);

          arrayFields.forEach((arrayField) => {
            const { fieldName, fieldCombinationsList } = arrayField;
            console.log(
              `      📋 处理数组字段 "${fieldName}": ${fieldCombinationsList.length} 个items`
            );

            // 为数组中的每个item匹配组件并创建实例
            const arrayItemInstances = fieldCombinationsList.map(
              (itemFieldCombinations, itemIndex) => {
                console.log(
                  `        🔍 Item ${itemIndex + 1}: ${JSON.stringify(
                    itemFieldCombinations
                  )}`
                );

                // 匹配组件
                const itemComponent = componentLibrary.find((component) => {
                  const componentFields = component.fieldCombinations || [];
                  return _.isEqual(componentFields, itemFieldCombinations);
                });

                if (itemComponent) {
                  console.log(
                    `        ✅ 匹配到组件: ${itemComponent.name} (${itemComponent.type})`
                  );

                  // 获取数组中对应的实际数据
                  const itemData = section[fieldName]?.[itemIndex];

                  if (itemData) {
                    const itemInstance = createComponentInstance(
                      itemData,
                      itemComponent,
                      componentLibrary
                    );
                    return {
                      itemIndex,
                      component: itemComponent,
                      instance: itemInstance,
                      matched: true,
                    };
                  } else {
                    console.log(`        ⚠️  Item ${itemIndex + 1} 数据缺失`);
                    return {
                      itemIndex,
                      component: itemComponent,
                      instance: null,
                      matched: false,
                    };
                  }
                } else {
                  console.log(`        ❌ 未找到匹配的组件`);
                  return {
                    itemIndex,
                    component: null,
                    instance: null,
                    matched: false,
                  };
                }
              }
            );

            // 创建数组字段的容器组件
            const matchedItems = arrayItemInstances.filter(
              (item) => item.matched
            ).length;
            console.log(
              `      📊 数组字段 "${fieldName}": ${matchedItems}/${arrayItemInstances.length} 个items成功匹配`
            );

            // 收集数组字段的组件和实例
            const fieldComponents = [];
            const fieldInstances = [];

            arrayItemInstances.forEach((result) => {
              if (result.matched && result.component) {
                fieldComponents.push(result.component);
              }
              if (result.matched && result.instance) {
                fieldInstances.push({
                  fieldName,
                  itemIndex: result.itemIndex,
                  component: result.component,
                  instance: result.instance,
                });
              }
            });

            // 去重组件（同一类型的组件只需要记录一次）
            const uniqueComponents = _.uniqBy(fieldComponents, "componentId");
            arrayComponents.push(...uniqueComponents);
            arrayComponentInstances.push(...fieldInstances);

            console.log(
              `      🧩 找到 ${uniqueComponents.length} 种不同的组件类型`
            );
          });
        }

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
        console.log(`    ❌ 未找到匹配的组件`);
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
    console.log(
      `✅ 匹配完成: ${matchedCount}/${composedSections.length} 个sections找到了匹配的组件`
    );

    return composedSections;
  } catch (error) {
    console.error(`❌ 解析中间格式失败:`, error.message);
    return [];
  }
}

export default async function composePagesKitYaml(input) {
  const {
    middleFormatFiles,
    componentLibraryMap,
    locale,
    path,
    pagesDir,
    outputDir,
    moreContentsComponentList,
  } = input;

  const moreContentsComponentMap = {};

  moreContentsComponentList.forEach((comp) => {
    moreContentsComponentMap[comp.content.id] = comp;
  });

  console.log(`🔧 开始组合 Pages Kit YAML: ${path}`);
  console.log(
    `🧩 组件库数量: ${Object.keys(componentLibraryMap)?.length || 0}`
  );
  console.log(`🌐 语言环境: ${locale}`);
  console.log(`📁 输出目录: ${pagesDir}`);

  // 处理中间格式文件，匹配组件
  const allComposedSections = [];
  const allPagesKitYamlList = [];

  if (middleFormatFiles && Array.isArray(middleFormatFiles)) {
    console.log(`📄 中间格式文件数量: ${middleFormatFiles.length}`);

    [...(DEFAULT_FLAG ? [DEFAULT_TEST_FILE] : middleFormatFiles)].forEach(
      (file, index) => {
        const middleFormatContent =
          typeof file.content === "string" ? parse(file.content) : file.content;

        const filePath = file.filePath;

        const componentLibrary = componentLibraryMap[filePath];

        console.log(
          `\n📋 处理文件 ${index + 1}: 长度 ${file.content?.length || 0} 字符`
        );

        // 使用复用函数匹配sections和组件
        const composedSections = composeSectionsWithComponents(
          middleFormatContent,
          componentLibrary
        );

        // 收集所有匹配结果
        allComposedSections.push(...composedSections);

        // 创建Pages Kit实例
        const pagesKitData = createPagesKitInstance({
          meta: middleFormatContent.meta,
          locale,
        });

        // 使用重构后的函数组装 sections
        composedSections.forEach((section) => {
          const { componentInstance, arrayComponentInstances } = section;

          if (componentInstance) {
            // 转换为 section 格式
            pagesKitData.sections = {
              ...pagesKitData.sections,
              [componentInstance.id]: convertToSection({
                componentInstance,
                arrayComponentInstances,
                locale,
              }),
            };

            pagesKitData.sectionIds.push(componentInstance.id);

            // 使用公共函数提取所有实例
            const allInstances = [
              { instance: componentInstance },
              ...extractAllInstances(componentInstance?.relatedInstances || []),
              ...extractAllInstances(arrayComponentInstances || []),
            ];

            // 处理每个实例的数据源
            allInstances.forEach(({ instance }) => {
              const dataSourceResult = transformDataSource(
                instance,
                moreContentsComponentMap,
                locale
              );

              if (dataSourceResult) {
                pagesKitData.dataSource = {
                  ...pagesKitData.dataSource,
                  ...dataSourceResult,
                };
              }
            });
          }
        });

        // console.warn("compose the pages kit data", JSON.stringify(pagesKitData));

        allPagesKitYamlList.push({
          filePath: file.filePath,
          content: stringify(pagesKitData),
        });
      }
    );

    console.log(`\n📊 总计处理结果:`);
    console.log(`  - 总sections数量: ${allComposedSections.length}`);
    console.log(
      `  - 成功匹配数量: ${
        allComposedSections.filter((item) => item.matched).length
      }`
    );
    console.log(
      `  - 未匹配数量: ${
        allComposedSections.filter((item) => !item.matched).length
      }`
    );
  }

  allPagesKitYamlList?.forEach((item) => {
    const { filePath, content } = item;
    savePagesKitYaml({
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

composePagesKitYaml.taskTitle = "Compose Pages Kit YAML '{{ path }}'";
