import { stringify } from "yaml";

export default async function assemblePagesKitYaml(input) {
  const { structuredData, middleFormatContent } = input;

  // 生成16位随机ID的函数
  function generateRandomId() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

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

  // 估算需要的ID数量（页面ID + sections + 组件 + 属性）
  function estimateIdCount(structuredData) {
    let count = 1; // 页面ID

    if (Array.isArray(structuredData)) {
      count += structuredData.length * 8; // 每个section平均需要8个ID
    }

    return Math.min(count, 100); // 限制最大ID数量
  }

  try {
    // 解析结构化数据
    let parsedStructuredData;
    if (typeof structuredData === "string") {
      parsedStructuredData = JSON.parse(structuredData);
    } else {
      parsedStructuredData = structuredData;
    }

    // 估算并生成所需ID
    const idCount = estimateIdCount(parsedStructuredData);
    const ids = generateUniqueIds(idCount);
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
      templateConfig: {
        isTemplate: true,
        dataSourceParameters: {},
        enabledGenerate: false,
      },
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

    // 处理sections - 这里需要根据structuredData构建复杂的嵌套结构
    if (Array.isArray(parsedStructuredData)) {
      parsedStructuredData.forEach((section, index) => {
        const sectionId = getNextId();

        // 构建section结构（简化版，需要根据实际需求完善）
        const pagesKitSection = {
          id: sectionId,
          name: section.name || `Section${index + 1}`,
          isTemplateSection: true,
          llmConfig: {},
          component: section.component || "layout-block",
          config: {
            gridSettings: {
              desktop: {},
            },
            padding: "large",
            gap: "none",
            alignContent: "start",
          },
          sections: [],
        };

        // 添加到sections
        pagesKitData.sections.push(pagesKitSection);

        // 构建dataSource - 根据section内容
        if (section.content) {
          const componentId = getNextId();
          const propertyId = getNextId();

          pagesKitData.dataSource[componentId] = {
            properties: {
              [propertyId]: {
                value: section.content,
              },
            },
          };
        }
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
