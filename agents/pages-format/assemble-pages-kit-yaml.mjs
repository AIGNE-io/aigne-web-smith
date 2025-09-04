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

  // 递归生成并替换所有ID，同时建立ID映射关系
  function generateIdsRecursively(obj, idGenerator, idMapping = new Map()) {
    if (Array.isArray(obj)) {
      return obj.map((item) =>
        generateIdsRecursively(item, idGenerator, idMapping)
      );
    } else if (obj && typeof obj === "object") {
      const result = {};

      // 为section对象自动添加ID（如果没有id字段）
      if ((obj.component || obj.name) && !obj.id) {
        result.id = idGenerator();
      }

      for (const [key, value] of Object.entries(obj)) {
        if (key === "id" && (!value || typeof value === "string")) {
          const newId = idGenerator();
          result[key] = newId;
          // 如果有原始ID，记录映射关系
          if (value && typeof value === "string") {
            idMapping.set(value, newId);
          }
        } else if (key === "dataSource" && typeof value === "object") {
          // dataSource先暂存，稍后统一处理ID映射
          result[key] = value;
        } else if (key === "gridSettings" && typeof value === "object") {
          // 处理 gridSettings 中的子section ID引用
          result[key] = {};
          for (const [device, settings] of Object.entries(value)) {
            result[key][device] = {};
            for (const [childId, gridData] of Object.entries(settings)) {
              const actualChildId =
                childId === "PLACEHOLDER_CHILD_ID" ? idGenerator() : childId;
              result[key][device][actualChildId] = gridData;
            }
          }
        } else {
          result[key] = generateIdsRecursively(value, idGenerator, idMapping);
        }
      }

      return result;
    }

    return obj;
  }

  // 单独处理dataSource的ID映射
  function processDataSourceIds(dataSource, idMapping) {
    const result = {};

    for (const [componentId, componentData] of Object.entries(dataSource)) {
      // 使用映射后的ID，如果没有映射则保持原ID
      const actualComponentId = idMapping.get(componentId) || componentId;

      result[actualComponentId] = {
        properties: {},
      };

      if (componentData.properties) {
        for (const [propKey, propValue] of Object.entries(
          componentData.properties
        )) {
          // 属性名保持原始名称，不生成新的ID
          result[actualComponentId].properties[propKey] = propValue;
        }
      }
    }

    return result;
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
      if (structuredData.structuredData && Array.isArray(structuredData.structuredData)) {
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

    // 创建全局ID映射表
    const globalIdMapping = new Map();

    // 处理每个section
    if (Array.isArray(parsedStructuredData)) {
      parsedStructuredData.forEach((sectionData, index) => {
        // 生成并替换所有ID，记录映射关系
        const processedSection = generateIdsRecursively(
          sectionData,
          getNextId,
          globalIdMapping
        );

        // 为 custom-component 设置默认网格位置
        if (
          processedSection.component === "custom-component" &&
          !processedSection.config?.gridSettings
        ) {
          processedSection.config = processedSection.config || {};
          processedSection.config.gridSettings = {
            desktop: {
              x: 0,
              y: index,
              w: 12,
              h: 1,
            },
          };
        }

        // 处理dataSource的ID映射并合并到全局dataSource
        if (processedSection.dataSource) {
          const processedDataSource = processDataSourceIds(
            processedSection.dataSource,
            globalIdMapping
          );
          Object.assign(pagesKitData.dataSource, processedDataSource);
          // 从 section 中移除 dataSource，因为它应该在顶层
          delete processedSection.dataSource;
        }

        // 添加处理后的 section 到主结构
        pagesKitData.sections.push(processedSection);
      });
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
