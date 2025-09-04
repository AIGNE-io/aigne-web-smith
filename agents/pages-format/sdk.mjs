/**
 * Pages Kit SDK - 组件处理和转换工具集
 * 基于 Pages Kit 项目的成熟架构，提供组件定义、Schema转换和验证功能
 */
import { z } from "zod";
import { nanoid } from "nanoid";

// 从 Pages Kit 迁移的核心转换工具

/**
 * ID 生成工具
 */
export function generateRandomId(length = 16) {
  return nanoid(length);
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
  subProperties: z
    .record(z.lazy(() => CustomComponentPropertySchema))
    .optional(),
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
        url: z.string().nullable(),
        mediaKitUrl: z.string().nullable(),
        width: z.number().nullable(),
        height: z.number().nullable(),
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
    array: (
      properties,
      { skipAnyType, addZodDescribe, propLLMConfig } = {}
    ) => {
      const { subProperties } = properties;
      if (subProperties && Object.keys(subProperties)?.length > 0) {
        return z.array(
          propertiesToZodSchema(subProperties, {
            skipAnyType,
            addZodDescribe,
            llmConfig: propLLMConfig?.subProperties,
          })
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
  return z.toJSONSchema(schema);
}

/**
 * 根据组件ID列表生成组合的 Zod Schema
 * @param {Array} sections - section 配置数组
 * @param {Array} componentsList - 解析后的组件定义数组
 */
export function getSchemaByComponentIds(sections, componentsList) {
  const schemaObject = {};

  sections.forEach((section) => {
    const component = componentsList.find(
      (comp) => comp.id === section.componentId
    );
    if (component) {
      schemaObject[section.sectionName] = component.properties;
    }
  });

  return z.object(schemaObject);
}

/**
 * 生成组件的完整元数据信息
 * 包含 JSON Schema，供 AI 理解组件的具体属性结构
 * @param {Array} componentsList - 解析后的组件定义数组
 */
export function getComponentsMetadata(componentsList) {
  return componentsList
    .map((component) => {
      const jsonSchema = zodSchemaToJsonSchema(component.properties);
      return `
    ------------------------------------------------------------
     组件名称：${component.name}
     组件ID：${component.id}
     组件描述(适用场景)：${component.description}
     组件属性结构：${JSON.stringify(jsonSchema, null, 2)}
    ------------------------------------------------------------`;
    })
    .filter(Boolean)
    .join("\n");
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
  } = {}
) {
  const schemaObj = {};

  Object.entries(properties || {}).forEach(([key, prop]) => {
    if (!prop.data) return;

    // 如果key未定义，使用id
    const propKey = prop.data.key || prop.data.id || key;

    // prop llmConfig
    const propLLMConfig =
      llmConfig?.properties?.[prop.data.id] || llmConfig?.[prop.data.id];

    // 是否不需要 LLM 处理
    if (
      propLLMConfig &&
      !skipCheckNeedGenerate &&
      !propLLMConfig.isNeedGenerate
    ) {
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
      // array 类型生成的 jsonschema 存在 anyof ，LLM 格式校验会报错
      if (propType !== "array") {
        schemaObj[propKey] = schemaObj[propKey].nullable();
      }
    }

    let propDescribe = propLLMConfig?.describe;

    if (propDescribe) {
      schemaObj[propKey] = schemaObj[propKey].describe(propDescribe);
    }
  });

  return z.object(schemaObj);
}
