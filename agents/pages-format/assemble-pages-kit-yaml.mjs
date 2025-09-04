import { stringify } from "yaml";
import { generateRandomId } from "./sdk.mjs";

export default async function assemblePagesKitYaml(input) {
  const { structuredData, middleFormatContent, componentsList } = input;

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

  /**
   * 根据组件定义生成 LLM 配置
   * 支持处理复杂的 JSON Schema 数据结构
   */
  function generateLLMConfig(sectionData, componentDef) {
    const llmConfig = {};

    // 为每个数据字段生成对应的 LLM 配置
    Object.keys(sectionData).forEach((key) => {
      const propertyId = generateRandomId();
      
      // 如果组件定义中有 schema 信息，尝试从中获取描述
      let description = `${componentDef.name} 组件的 ${key} 属性`;
      
      if (componentDef.schema?.properties?.[key]?.description) {
        description = componentDef.schema.properties[key].description;
      }
      
      llmConfig[propertyId] = {
        key,
        displayName: key.charAt(0).toUpperCase() + key.slice(1),
        isNeedGenerate: true,
        describe: description,
      };
    });

    return llmConfig;
  }

  /**
   * 将 section 数据转换为 Pages Kit properties 格式
   * 支持处理符合 JSON Schema 的复杂数据结构
   */
  function convertSectionDataToProperties(
    sectionData,
    componentDef,
    idGenerator
  ) {
    const properties = {};

    Object.entries(sectionData).forEach(([key, value]) => {
      const propertyId = idGenerator();
      
      // 检查是否已经是符合 JSON Schema 的复杂结构
      if (isComplexSchemaData(value)) {
        // 直接使用复杂数据结构
        properties[propertyId] = {
          value: value,
        };
      } else {
        // 简单数据，直接赋值
        properties[propertyId] = {
          value: value,
        };
      }
    });

    return properties;
  }

  /**
   * 检查数据是否为符合 JSON Schema 的复杂结构
   */
  function isComplexSchemaData(value) {
    // 检查是否为复杂对象结构（包含 id, type, text 等字段）
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return (
        value.hasOwnProperty('id') ||
        value.hasOwnProperty('type') ||
        value.hasOwnProperty('text') ||
        value.hasOwnProperty('list') ||
        value.hasOwnProperty('style')
      );
    }
    
    // 检查是否为包含复杂对象的数组
    if (Array.isArray(value) && value.length > 0) {
      return value.some(item => 
        item && typeof item === 'object' && (
          item.hasOwnProperty('id') ||
          item.hasOwnProperty('type') ||
          item.hasOwnProperty('text') ||
          item.hasOwnProperty('variant') ||
          item.hasOwnProperty('url')
        )
      );
    }

    return false;
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

    // 处理sections - 基于新的结构化数据格式构建 Pages Kit sections
    if (Array.isArray(parsedStructuredData)) {
      parsedStructuredData.forEach((section, index) => {
        const sectionId = getNextId();

        // 查找对应的组件定义
        const componentDef = componentsList?.find(
          (comp) => comp.id === section.componentId
        );
        if (!componentDef) {
          console.warn(
            `Component with ID ${section.componentId} not found, skipping section`
          );
          return;
        }

        // 判断是否需要使用 layout-block（复合内容）
        const needsLayoutBlock = shouldUseLayoutBlock(section.data, section.name);

        if (needsLayoutBlock) {
          // 使用 layout-block + 嵌套的 custom-component
          const layoutSection = createLayoutBlockSection(
            sectionId, 
            section, 
            componentDef, 
            index, 
            getNextId
          );
          
          // 为 layout-block 的子组件添加 dataSource
          layoutSection.sections.forEach(childSection => {
            if (childSection.config?.componentId) {
              pagesKitData.dataSource[childSection.config.componentId] = {
                properties: convertSectionDataToProperties(
                  section.data,
                  componentDef,
                  getNextId
                ),
              };
            }
          });

          pagesKitData.sections.push(layoutSection);
        } else {
          // 使用单个 custom-component
          const pagesKitSection = {
            id: sectionId,
            name: section.name || `section_${index + 1}`,
            isTemplateSection: true,
            llmConfig: {
              properties: generateLLMConfig(section.data, componentDef),
            },
            component: "custom-component",
            config: {
              componentId: getNextId(), // 这将是 dataSource 中的组件ID
              componentName: componentDef.name,
              gridSettings: {
                desktop: {
                  x: 0,
                  y: index,
                  w: 12,
                  h: 1,
                },
              },
              padding: "large",
              gap: "medium",
              alignContent: "center",
            },
            sections: [],
          };

          // 生成对应的 dataSource 条目
          const componentDataId = pagesKitSection.config.componentId;

          pagesKitData.dataSource[componentDataId] = {
            properties: convertSectionDataToProperties(
              section.data,
              componentDef,
              getNextId
            ),
          };

          // 添加到主 sections 数组
          pagesKitData.sections.push(pagesKitSection);
        }
      });
    }

  /**
   * 判断是否需要使用 layout-block
   */
  function shouldUseLayoutBlock(sectionData, sectionName) {
    // 检查数据字段数量和复杂度
    const dataKeys = Object.keys(sectionData);
    const hasMultipleContentTypes = dataKeys.length > 2;
    
    // 特定 section 类型倾向于使用 layout-block
    const layoutSectionTypes = ['hero', 'feature', 'about', 'contact'];
    const isLayoutSection = layoutSectionTypes.includes(sectionName?.toLowerCase());
    
    // 检查是否有图片和文本的组合
    const hasImage = dataKeys.some(key => key.toLowerCase().includes('image'));
    const hasText = dataKeys.some(key => 
      key.toLowerCase().includes('title') || 
      key.toLowerCase().includes('description')
    );
    
    return (hasMultipleContentTypes && isLayoutSection) || (hasImage && hasText);
  }

  /**
   * 创建 layout-block section
   */
  function createLayoutBlockSection(sectionId, section, componentDef, index, getNextId) {
    const childComponentId = getNextId();
    
    return {
      id: sectionId,
      name: section.name || `section_${index + 1}`,
      isTemplateSection: true,
      component: "layout-block",
      config: {
        gridSettings: {
          desktop: {
            x: 0,
            y: index,
            w: 12,
            h: 1,
          },
        },
        padding: "large",
        gap: "medium",
        alignContent: "center",
      },
      sections: [
        {
          id: getNextId(),
          name: `${section.name || 'content'}_component`,
          component: "custom-component",
          config: {
            componentId: childComponentId,
            componentName: componentDef.name,
            gridSettings: {
              desktop: {
                x: 0,
                y: 0,
                w: 12,
                h: 1,
              },
            },
          },
          sections: [],
        }
      ]
    };
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
