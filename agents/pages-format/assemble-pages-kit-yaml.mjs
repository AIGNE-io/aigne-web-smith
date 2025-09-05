import { stringify } from "yaml";
import { generateRandomId } from "./sdk.mjs";

export default async function assemblePagesKitYaml(input) {
  const { structuredData, middleFormatContent, componentsList, locale } = input;

  // 生成唯一ID集合
  function generateUniqueIds(count) {
    const ids = new Set();
    while (ids.size < count) {
      ids.add(generateRandomId());
    }
    return Array.from(ids);
  }

  // 解析中间格式获取meta信息
  function extractMeta(middleFormatContent) {
    try {
      const yamlData = middleFormatContent;
      const metaMatch = yamlData.match(/meta:\s*\n([\s\S]*?)(?=\n\w|\n$)/);

      if (metaMatch) {
        const metaSection = metaMatch[1];
        const title =
          metaSection.match(/title:\s*['"]?(.*?)['"]?\s*$/m)?.[1] || "";
        const description =
          metaSection.match(/description:\s*['"]?(.*?)['"]?\s*$/m)?.[1] || "";
        const image =
          metaSection.match(/image:\s*['"]?(.*?)['"]?\s*$/m)?.[1] || "";

        return { title, description, image };
      }

      return { title: "", description: "", image: "" };
    } catch (error) {
      return { title: "", description: "", image: "" };
    }
  }

  // 为扁平化数据中的每个组件生成ID
  function assignIdsToFlatData(flatData, idGenerator) {
    const idMapping = new Map();

    // 为每个组件生成ID并记录映射
    const dataWithIds = flatData.map((item) => {
      const newId = idGenerator();
      const result = {
        ...item,
        id: newId,
      };

      // 记录名称到ID的映射，用于后续dataSource处理
      if (item.name) {
        idMapping.set(item.name, newId);
      }

      return result;
    });

    return { dataWithIds, idMapping };
  }

  // 处理dataSource的通用函数
  function processDataSource(dataSource, componentsList, componentId) {
    const properties = {};
    Object.entries(dataSource).forEach(([key, value]) => {
      let mappedId = key;

      // 如果是 customComponent，通过 componentId 找到对应组件的 propKeyToIdMap
      if (componentId && componentsList?.length) {
        const currentComponent = componentsList.find(
          (comp) => comp.content?.id === componentId
        );
        if (currentComponent) {
          mappedId = currentComponent.content?.propKeyToIdMap?.[key] || key;
        }
      }

      properties[mappedId] = {
        value: value,
      };
    });
    return { properties };
  }

  // 重建树状结构从扁平化数据
  function rebuildTreeStructure(flatData) {
    const sections = {};
    const sectionIds = [];
    const globalDataSource = {};

    // 按level分组
    const levelGroups = {};
    flatData.forEach((item) => {
      const level = item.level;
      if (!levelGroups[level]) {
        levelGroups[level] = [];
      }
      levelGroups[level].push(item);
    });

    // 处理所有顶级组件
    const topLevelKeys = Object.keys(levelGroups)
      .filter((key) => !key.includes("."))
      .sort((a, b) => parseInt(a) - parseInt(b));

    topLevelKeys.forEach((levelKey) => {
      levelGroups[levelKey].forEach((item) => {
        if (item.component === "layout-block") {
          const childSections = {};
          const childSectionIds = [];
          const gridSettings = { desktop: {}, mobile: {} };

          // 查找直接子组件
          const childLevel = levelKey + ".";
          Object.keys(levelGroups).forEach((key) => {
            if (key.startsWith(childLevel) && key.split(".").length === 2) {
              levelGroups[key].forEach((child) => {
                // 提取gridSettings
                if (child.config && child.config.gridSettings) {
                  gridSettings.desktop[child.id] =
                    child.config.gridSettings.desktop;
                  gridSettings.mobile[child.id] =
                    child.config.gridSettings.mobile;

                  // 创建子组件（移除gridSettings）
                  const childConfig = { ...child.config };
                  delete childConfig.gridSettings;

                  childSections[child.id] = {
                    id: child.id,
                    name: child.name,
                    component: child.component,
                    config: childConfig,
                  };
                  childSectionIds.push(child.id);

                  // 处理子组件的dataSource
                  if (child.dataSource) {
                    const componentId = child.config?.componentId;
                    globalDataSource[child.id] = {
                      [locale]: processDataSource(
                        child.dataSource,
                        componentsList,
                        componentId
                      ),
                    };
                  }
                }
              });
            }
          });

          // 创建layout-block
          sections[item.id] = {
            id: item.id,
            name: item.name,
            component: item.component,
            config: {
              ...item.config,
              gridSettings,
            },
            sections: childSections,
            sectionIds: childSectionIds,
          };
        } else {
          // 处理custom-component（不需要sections和sectionIds）
          sections[item.id] = {
            id: item.id,
            name: item.name,
            component: item.component,
            config: item.config,
          };

          // 处理dataSource
          if (item.dataSource) {
            const componentId = item.config?.componentId;
            globalDataSource[item.id] = processDataSource(
              item.dataSource,
              componentsList,
              componentId,
              locale
            );
          }
        }

        sectionIds.push(item.id);
      });
    });

    return { sections, sectionIds, globalDataSource };
  }

  try {
    // 解析结构化数据
    let parsedStructuredData;
    if (Array.isArray(structuredData)) {
      // 直接使用数组
      parsedStructuredData = structuredData;
    } else if (typeof structuredData === "string") {
      try {
        parsedStructuredData = JSON.parse(structuredData);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON in structuredData: ${
            parseError.message
          }. Content: ${structuredData.substring(0, 200)}...`
        );
      }
    } else if (typeof structuredData === "object" && structuredData !== null) {
      // 如果是对象，检查是否有structuredData属性
      if (
        structuredData.structuredData &&
        Array.isArray(structuredData.structuredData)
      ) {
        parsedStructuredData = structuredData.structuredData;
      } else {
        throw new Error(
          `Invalid structuredData object: expected array in structuredData property, got ${typeof structuredData.structuredData}`
        );
      }
    } else {
      throw new Error(
        `Invalid structuredData type: expected array, JSON string, or object with structuredData array, got ${typeof structuredData}`
      );
    }

    // 估算并生成所需ID（页面ID + sections中的所有ID需求）
    const estimatedIdCount = Math.max(50, parsedStructuredData.length * 10);
    const ids = generateUniqueIds(estimatedIdCount);
    let idIndex = 0;

    const getNextId = () => ids[idIndex++] || generateRandomId();

    // 提取meta信息
    const meta = extractMeta(middleFormatContent);

    // 生成当前时间戳
    const now = new Date().toISOString();

    // 构建完整的Pages Kit YAML结构
    const pagesKitData = {
      id: getNextId(),
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
      isPublic: true,
      meta: {
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
      sections: {},
      sectionIds: [],
      dataSource: {},
    };

    // 注：扁平化结构不再需要全局ID映射表

    // 处理扁平化数据
    if (Array.isArray(parsedStructuredData)) {
      // 为每个组件生成ID
      const { dataWithIds } = assignIdsToFlatData(
        parsedStructuredData,
        getNextId
      );

      // 重建树状结构
      const { sections, sectionIds, globalDataSource } =
        rebuildTreeStructure(dataWithIds);

      // 设置到Pages Kit数据
      pagesKitData.sections = sections;
      pagesKitData.sectionIds = sectionIds;
      Object.assign(pagesKitData.dataSource, globalDataSource);
    }

    // 使用 yaml 库转换为YAML字符串
    const yamlString = stringify(pagesKitData, {
      indent: 2,
      lineWidth: 0,
      minContentWidth: 0,
    });

    return {
      ...input,
      pagesKitYaml: yamlString,
    };
  } catch (error) {
    throw new Error(`Pages Kit YAML assemble failed: ${error.message}`);
  }
}

assemblePagesKitYaml.taskTitle = "组装 Pages Kit YAML '{{ path }}'";
