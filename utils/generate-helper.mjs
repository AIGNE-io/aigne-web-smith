/**
 * Pages Kit SDK - 组件处理和转换工具集
 * 基于 Pages Kit 项目的成熟架构，提供组件定义、Schema转换和验证功能
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import _ from "lodash";
import { nanoid } from "nanoid";
import { parse } from "yaml";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

/**
 * ID 生成工具
 */
export function generateRandomId(length = 16) {
  return nanoid(length);
}

/**
 * 从文本生成确定的16位16进制ID
 * 相同的文本内容总是产生相同的ID
 * @param {string} text - 输入文本
 * @returns {string} 16位16进制ID
 */
export function generateDeterministicId(text, length = 16) {
  if (typeof text !== "string") {
    if (typeof text === "object") {
      text = JSON.stringify(text);
    } else {
      text = String(text);
    }
  }

  return createHash("md5").update(text, "utf8").digest("hex").slice(0, length);
}

/**
 * LLM配置属性类型定义
 */
export const LLMConfigPropertySchema = z.object({
  key: z.string(),
  displayName: z.string().optional(),
  isNeedGenerate: z.boolean(),
  describe: z.string(),
  subProperties: z.record(z.lazy(() => LLMConfigPropertySchema)).optional(),
});

/**
 * 自定义组件属性类型定义
 */
export const CustomComponentPropertySchema = z.object({
  id: z.string(),
  type: z.string(),
  visible: z.boolean().optional(),
  key: z.string().optional(),
  subProperties: z.record(z.lazy(() => CustomComponentPropertySchema)).optional(),
});

// 属性类型到 Zod Schema 的映射关系
export const PROPERTIES_TYPE_SCHEMA = {
  propertyToZod: {
    string: () => z.string(),
    multiline: () => z.string(),
    number: () => z.number(),
    decimal: () => z.number(),
    boolean: () => z.boolean(),
    color: () => z.string(),
    url: () =>
      z.object({
        url: z.string().optional(),
        mediaKitUrl: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    json: (properties, { skipAnyType, addZodDescribe, propLLMConfig } = {}) => {
      const { subProperties } = properties;
      if (subProperties && Object.keys(subProperties)?.length > 0) {
        return propertiesToZodSchema(subProperties, {
          skipAnyType,
          addZodDescribe,
          llmConfig: propLLMConfig?.subProperties,
        });
      }
      if (skipAnyType) return null;
      return z.object({});
    },
    yaml: (properties, { skipAnyType, addZodDescribe, propLLMConfig } = {}) => {
      const { subProperties } = properties;
      if (subProperties && Object.keys(subProperties)?.length > 0) {
        return propertiesToZodSchema(subProperties, {
          skipAnyType,
          addZodDescribe,
          llmConfig: propLLMConfig?.subProperties,
        });
      }
      return z.object({});
    },
    array: (properties, { skipAnyType, addZodDescribe, propLLMConfig } = {}) => {
      const { subProperties } = properties;
      if (subProperties && Object.keys(subProperties)?.length > 0) {
        return z.array(
          propertiesToZodSchema(subProperties, {
            skipAnyType,
            addZodDescribe,
            llmConfig: propLLMConfig?.subProperties,
          }),
        );
      }
      if (skipAnyType) return null;
      return z.array(z.unknown());
    },
    component: ({ skipAnyType } = {}) => {
      if (skipAnyType) return null;
      return z.unknown();
    },
    custom: ({ skipAnyType } = {}) => {
      if (skipAnyType) return null;
      return z.unknown();
    },
    default: () => z.string(),
  },
};

/**
 * 从 Zod schema 生成 JSON Schema
 * 支持 Zod 4.x 的 toJSONSchema 方法
 */
export function zodSchemaToJsonSchema(schema) {
  // @ts-ignore zod 4.x support toJSONSchema
  if (typeof z?.toJSONSchema === "function") {
    // @ts-ignore
    return z.toJSONSchema(schema, {
      target: "draft-7",
    });
  }

  return zodToJsonSchema(schema, { $refStrategy: "none" });
}

/**
 * 根据组件ID列表生成组合的 Zod Schema
 * @param {Array} sections - section 配置数组
 * @param {Array} componentList - 解析后的组件定义数组
 */
export function getSchemaByComponentIds(sections, componentList) {
  const schemaObject = {};

  sections.forEach((section) => {
    const component = componentList.find((comp) => comp.id === section.componentId);
    if (component) {
      schemaObject[section.sectionName] = component.properties;
    }
  });

  return z.object(schemaObject);
}

/**
 * 从 Properties 对象创建 Zod schema
 */
export function propertiesToZodSchema(
  properties,
  {
    // 是否跳过 any 类型
    skipAnyType = false,
    // skip need generate
    skipCheckNeedGenerate = true,
    addZodDescribe = false,
    // 这个目前来说都是可选的，避免用户在使用的过程中疯狂报错，并且目前 setting 中没有必填标识符
    isOptional = true,
    llmConfig,
  } = {},
) {
  const schemaObj = {};

  Object.entries(properties || {}).forEach(([key, prop]) => {
    if (!prop.data) return;

    const propId = prop.data.id;
    const propKey = prop.data.key || propId || key;

    // prop llmConfig
    const propLLMConfig = llmConfig?.properties?.[propId] || llmConfig?.[propId];

    // 是否不需要 LLM 处理
    if (propLLMConfig && !skipCheckNeedGenerate && !propLLMConfig.isNeedGenerate) {
      return;
    }

    const propType = prop.data.type;

    const getSchemaFn =
      propType in PROPERTIES_TYPE_SCHEMA.propertyToZod
        ? PROPERTIES_TYPE_SCHEMA.propertyToZod[propType]
        : PROPERTIES_TYPE_SCHEMA.propertyToZod.default;

    const schema = getSchemaFn(prop.data, {
      skipAnyType,
      addZodDescribe,
      propLLMConfig,
    });

    if (!schema) {
      return;
    }

    schemaObj[propKey] = schema;

    if (isOptional) {
      // WebSmith 现在不太需要这个逻辑，会导致 gemini
      // array 类型生成的 jsonschema 存在 anyof ，LLM 格式校验会报错
      if (propType !== "array") {
        schemaObj[propKey] = schemaObj[propKey].optional();
      }
    }

    const propDescribe = propLLMConfig?.describe;

    if (propDescribe) {
      schemaObj[propKey] = schemaObj[propKey].describe(propDescribe);
    }

    // schemaObj[propKey] = schemaObj[propKey].meta({
    //   propId: propId,
    //   propKey: propKey,
    // });
  });

  return z.object(schemaObj);
}

/**
 * 从中间格式文件中提取每个section的fieldCombinations
 * 基于现有的字段提取规则：只提取非数组、非元数据字段
 * @param {Object|string} middleFormatContent - 中间格式文件内容（对象或YAML字符串）
 * @returns {Array} 每个section的字段组合信息
 */
export function extractFieldCombinations(middleFormatContent) {
  // 如果是字符串，先解析为对象
  let parsedContent = middleFormatContent;
  if (typeof middleFormatContent === "string") {
    try {
      // 假设是YAML格式，需要在调用处先解析
      parsedContent = parse(middleFormatContent);
    } catch (error) {
      console.error("parse middle format content error:", error.message);
      return [];
    }
  }

  if (!parsedContent || !parsedContent.sections) {
    console.warn("middle format content missing sections field");
    return [];
  }

  const metaFields = ["name", "summary"];
  const results = [];

  parsedContent.sections.forEach((section, index) => {
    // 提取字段，使用路径格式表示嵌套字段
    function extractContentFields(obj, prefix = "") {
      const fields = new Set();

      Object.keys(obj).forEach((key) => {
        if (metaFields.includes(key)) return;

        const currentPath = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (Array.isArray(value)) {
          // 数组字段：只包含数组字段本身的路径
          // fields.add(`${currentPath}`);
          value.forEach((_item, index) => {
            fields.add(`${currentPath}.${index}`);
          });
        } else if (typeof value === "object" && value !== null) {
          // 对象字段：递归提取子字段，使用路径格式
          const subFields = extractContentFields(value, currentPath);
          subFields.forEach((field) => fields.add(field));
        } else {
          // 普通字段（string、number、boolean等）
          fields.add(currentPath);
        }
      });

      return Array.from(fields);
    }

    const fieldCombinations = extractContentFields(section);

    // 收集数组字段信息（用于参考，但不作为主要 fieldCombinations）
    const arrayFields = [];
    Object.keys(section).forEach((key) => {
      if (metaFields.includes(key)) return;
      const value = section[key];
      if (Array.isArray(value)) {
        arrayFields.push({
          fieldName: key,
          // 分析数组中item的字段类型，使用统一的字段提取逻辑
          fieldCombinationsList: value.map((item) =>
            typeof item === "object" && item !== null ? extractContentFields(item) : [],
          ),
        });
      }
    });

    results.push({
      sectionIndex: index,
      sectionName: section.name,
      summary: section.summary || "",
      // 主要的字段组合（用于组件匹配）
      fieldCombinations,
      // 数组字段信息（用于参考）
      arrayFields,
      // 原始section引用
      originalSection: section,
    });
  });

  return results;
}

/**
 * 从多个中间格式文件中获取所有唯一的fieldCombinations
 * @param {Array} middleFormatFiles - 中间格式文件数组 [{content: string|object}, ...]
 * @returns {Array} 去重后的所有字段组合数组
 */
export function getAllFieldCombinations(middleFormatFiles, { includeArrayFields = true } = {}) {
  if (!Array.isArray(middleFormatFiles)) {
    console.warn("middleFormatFiles should be an array");
    return [];
  }

  const allFields = [];

  // 处理每个文件
  middleFormatFiles.forEach((file) => {
    const sectionsAnalysis = extractFieldCombinations(file.content);

    sectionsAnalysis.forEach((sectionAnalysis) => {
      // 收集每个section的字段组合
      if (sectionAnalysis.fieldCombinations && sectionAnalysis.fieldCombinations.length > 0) {
        allFields.push(sectionAnalysis.fieldCombinations);
      }

      // 收集数组字段中的字段组合
      if (includeArrayFields) {
        sectionAnalysis.arrayFields?.forEach((arrayField) => {
          arrayField.fieldCombinationsList?.forEach((itemFields) => {
            allFields.push(itemFields);
          });
        });
      }
    });
  });

  // 使用lodash深度去重（基于数组内容而不是引用）并排序
  return _.uniqWith(allFields, _.isEqual);
}

/**
 * 计算中间格式文件的 hash 值
 * 基于字段组合模式而不是文件内容，避免不相关的变化导致重新生成
 * @param {Array} middleFormatFiles - 中间格式文件数组
 * @returns {string} - MD5 hash 值
 */
export function calculateMiddleFormatHash(middleFormatFiles) {
  // 获取所有字段组合模式
  const fieldCombinations = getAllFieldCombinations(middleFormatFiles);

  // 基于字段组合计算哈希
  return createHash("md5")
    .update(JSON.stringify(fieldCombinations, null, 0))
    .digest("hex");
}

export function getComponentLibraryDataPath(tmpDir) {
  return join(tmpDir, "component-library.yaml");
}

export const getChildFieldCombinationsKey = (fieldCombinations) => {
  return `FIELD_COMBINATIONS:${fieldCombinations.join(",")}`;
};

export const getComponentLibraryData = (tmpDir) => {
  const componentLibraryPath = join(tmpDir, "component-library.yaml");

  try {
    const content = readFileSync(componentLibraryPath, "utf8");
    return parse(content);
  } catch (_error) {
    return { componentLibrary: [] };
  }
};
