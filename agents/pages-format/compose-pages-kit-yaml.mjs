import { stringify, parse } from "yaml";
import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { generateRandomId, extractFieldCombinations } from "./sdk.mjs";
import { getFileName } from "../../utils/utils.mjs";
import { PAGES_OUTPUT_DIR } from "../../utils/constants.mjs";
import savePagesKitYaml from "./save-pages-kit-yaml.mjs";
import _ from "lodash";

function convertToSection({
  componentInstance,
  arrayComponentInstances,
  locale,
  pagesDir,
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

    const allSections = [...sections, ...arraySections];

    let newConfig = JSON.stringify(config);

    Object.keys(oldKeyToIdMap).forEach((oldKey) => {
      newConfig = newConfig.replaceAll(oldKey, oldKeyToIdMap[oldKey]);
    });

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
// 创建组件实例的函数
function createComponentInstance(section, component, componentLibrary = []) {
  const instanceId = generateRandomId();
  console.log(`    🔧 生成组件实例 ID: ${instanceId}`);

  if (component.type === "atomic") {
    console.log(`    📦 处理 atomic 组件...`);

    // 1. 获取 dataSourceTemplate
    const dataSourceTemplate = component.dataSourceTemplate;
    if (!dataSourceTemplate) {
      console.log(`    ⚠️  组件 ${component.name} 没有 dataSourceTemplate`);
      return {
        id: instanceId,
        type: "atomic",
        componentId: component.componentId,
        dataSource: null,
        config: null,
      };
    }

    // 2. 使用 lodash template 处理数据
    console.log(`    🔨 使用模板处理 section 数据...`);
    const templateString = JSON.stringify(dataSourceTemplate);
    const compiled = _.template(templateString);

    try {
      const dataSource = JSON.parse(compiled(section));
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
  } else if (component.type === "composite") {
    console.log(`    📦 处理 composite 组件...`);

    // 1. 获取 relatedComponents 和 configTemplate
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

    // 2. 为每个 relatedComponent 生成完整的实例
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
          const fallbackInstanceId = generateRandomId();
          return {
            originalComponentId: componentId,
            instanceId: fallbackInstanceId,
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
          // 如果所有值都是对象，则展开这些对象的属性
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
          // 否则返回原对象
          return childrenSection;
        })();

        // 递归创建子组件实例，使用相同的 section 数据
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
          instanceId: childInstance.id, // 使用子实例的ID保证一致性
          instance: childInstance,
          section,
        };
      }
    );

    // 3. 替换 configTemplate 中的 relatedComponents 值
    console.log(`    🔄 替换 configTemplate 中的组件 ID...`);
    let configString = JSON.stringify(configTemplate);

    // 替换每个 relatedComponent ID 为对应的实例 ID
    relatedInstances.forEach((instance) => {
      const originalId = instance.originalComponentId;
      const newId = instance.instanceId;
      // 使用正则表达式替换所有出现的原始ID
      configString = configString.replace(new RegExp(originalId, "g"), newId);
      console.log(`      ✅ 替换 ${originalId} -> ${newId}`);
    });

    try {
      const config = JSON.parse(configString);
      console.log(`    ✅ Config 生成成功`);

      return {
        id: instanceId,
        type: "composite",
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
        componentId: component.componentId,
        dataSource: null,
        config: configTemplate, // 使用原始模板作为fallback
        relatedInstances,
      };
    }
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
    componentLibrary,
    locale,
    path,
    pagesDir,
    moreContentsComponentList,
  } = input;

  const moreContentsComponentMap = {};
  moreContentsComponentList.forEach((comp) => {
    moreContentsComponentMap[comp.content.id] = comp;
  });
  console.log(`🔧 开始组合 Pages Kit YAML: ${path}`);
  console.log(`🧩 组件库数量: ${componentLibrary?.length || 0}`);
  console.log(`🌐 语言环境: ${locale}`);
  console.log(`📁 输出目录: ${pagesDir}`);

  // 处理中间格式文件，匹配组件
  const allComposedSections = [];
  const allPagesKitYamlList = [];

  if (middleFormatFiles && Array.isArray(middleFormatFiles)) {
    console.log(`📄 中间格式文件数量: ${middleFormatFiles.length}`);

    [...middleFormatFiles].forEach((file, index) => {
      const middleFormatContent =
        typeof file.content === "string" ? parse(file.content) : file.content;

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

      // 组装 sections 到 pagesKitData
      composedSections.forEach((section) => {
        const { componentInstance, arrayComponentInstances } = section;

        if (componentInstance) {
          pagesKitData.sections = {
            ...pagesKitData.sections,
            [componentInstance.id]: convertToSection({
              componentInstance,
              arrayComponentInstances,
              locale,
            }),
          };

          pagesKitData.sectionIds.push(componentInstance.id);

          const allInstances = [
            componentInstance,
            ...(componentInstance?.relatedInstances || []),
            ...(arrayComponentInstances || []),
          ];

          allInstances?.forEach(({ instance }) => {
            if (instance?.dataSource) {
              const { componentId } = instance;
              const currentComponentInfo =
                moreContentsComponentMap[componentId];

              const propKeyToInfoMap =
                currentComponentInfo?.content?.propKeyToInfoMap;

              const properties = {};
              Object.entries(instance.dataSource).forEach(([key, value]) => {
                const mappedId = propKeyToInfoMap?.[key]?.id || key;
                properties[mappedId] = {
                  value,
                };
              });

              pagesKitData.dataSource = {
                ...pagesKitData.dataSource,
                [instance.id]: {
                  [locale]: {
                    properties,
                  },
                },
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
    });

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
    });
  });

  return {
    ...input,
  };
}

composePagesKitYaml.taskTitle = "Compose Pages Kit YAML '{{ path }}'";
