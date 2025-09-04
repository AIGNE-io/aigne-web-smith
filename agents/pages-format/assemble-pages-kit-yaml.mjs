import { stringify } from "yaml";
import { generateRandomId } from "./sdk.mjs";

export default async function assemblePagesKitYaml(input) {
  const { structuredData, middleFormatContent } = input;

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

  // 重建树状结构从扁平化数据
  function rebuildTreeStructure(flatData) {
    const sections = [];
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

    // 处理顶级组件（level: "0", "1", "2"...）
    const topLevelKeys = Object.keys(levelGroups)
      .filter((key) => !key.includes("."))
      .sort((a, b) => parseInt(a) - parseInt(b));

    topLevelKeys.forEach((levelKey) => {
      const parentComponents = levelGroups[levelKey];

      parentComponents.forEach((parent) => {
        if (parent.component === "layout-block") {
          // 处理layout-block：收集子组件并重建gridSettings
          const childLevel = levelKey + ".";
          const children = [];
          const gridSettings = { desktop: {}, mobile: {} };

          // 收集所有子组件
          Object.keys(levelGroups).forEach((key) => {
            if (key.startsWith(childLevel) && key.split(".").length === 2) {
              levelGroups[key].forEach((child) => {
                // 提取gridSettings到父级
                if (child.config && child.config.gridSettings) {
                  gridSettings.desktop[child.id] =
                    child.config.gridSettings.desktop;
                  gridSettings.mobile[child.id] =
                    child.config.gridSettings.mobile;

                  // 移除子组件的gridSettings
                  const childConfig = { ...child.config };
                  delete childConfig.gridSettings;

                  const childSection = {
                    id: child.id,
                    name: child.name,
                    component: child.component,
                    config: childConfig,
                  };

                  children.push(childSection);

                  // 处理子组件的dataSource
                  if (child.dataSource) {
                    // @FIXME
                    globalDataSource[child.id] = {
                      properties: child.dataSource,
                    };
                  }
                }
              });
            }
          });

          // 构建完整的layout-block
          const layoutBlock = {
            id: parent.id,
            name: parent.name,
            component: parent.component,
            config: {
              ...parent.config,
              gridSettings,
            },
            sections: children,
          };

          sections.push(layoutBlock);
        } else {
          // 处理独立的custom-component
          const section = {
            id: parent.id,
            name: parent.name,
            component: parent.component,
            config: parent.config,
          };

          // 处理dataSource
          if (parent.dataSource) {
            globalDataSource[parent.id] = {
              properties: parent.dataSource,
            };
          }

          sections.push(section);
        }
      });
    });

    return { sections, globalDataSource };
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
      sections: [],
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
      const { sections, globalDataSource } = rebuildTreeStructure(dataWithIds);

      // 设置到Pages Kit数据
      pagesKitData.sections = sections;
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
