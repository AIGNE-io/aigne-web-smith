/**
 * Pages Kit SDK - 组件处理和转换工具集
 * 基于 Pages Kit 项目的成熟架构，提供组件定义、Schema转换和验证功能
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import _ from "lodash";
import { nanoid } from "nanoid";
import { parse, stringify } from "yaml";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { LIST_KEY, SECTION_META_FIELDS } from "./constants.mjs";

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

// Extract fields using path format to represent nested fields
export function extractContentFields(obj, prefix = "") {
  const fields = new Set();

  Object.keys(obj).forEach((key) => {
    // skip meta fields
    if (SECTION_META_FIELDS.includes(key)) return;

    const currentPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (Array.isArray(value) && key === LIST_KEY) {
      value.forEach((_item, index) => {
        fields.add(`${currentPath}.${index}`);
      });
    } else if (typeof value === "object" && value !== null) {
      // recursive extract sub fields
      const subFields = extractContentFields(value, currentPath);

      subFields.forEach((field) => fields.add(field));
    } else {
      fields.add(currentPath);
    }
  });

  return Array.from(fields);
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
      console.error("parse all page content error:", error.message);
      return [];
    }
  }

  if (!parsedContent || !parsedContent.sections) {
    console.warn("all page content missing sections field");
    return [];
  }

  const results = [];

  parsedContent.sections.forEach((section, index) => {
    const fieldCombinations = extractContentFields(section);

    // 收集数组字段信息（用于参考，但不作为主要 fieldCombinations）
    const arrayFields = [];
    Object.keys(section).forEach((key) => {
      if (SECTION_META_FIELDS.includes(key)) return;
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
      sectionName: section.sectionName,
      sectionSummary: section.sectionSummary || "",
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
  return `${fieldCombinations.join(",")}`;
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

/**
 * Generate field usage constraints from builtin component library
 * @param {Array} componentLibrary - Array of component definitions
 * @throws {Error} Will not throw, returns empty string for invalid input
 * @returns {string} Formatted constraints text for LLM usage
 */
export function generateFieldConstraints(componentLibrary) {
  if (!componentLibrary || !Array.isArray(componentLibrary)) {
    console.warn("Invalid component library provided to generateFieldConstraints");
    return "";
  }

  // Extract atomic fields
  const atomicFields = componentLibrary.filter((comp) => comp.type === "atomic");

  // Extract composite field combinations
  const compositeFields = componentLibrary.filter((comp) => comp.type === "composite");

  // Build constraints text
  let constraints = "";

  const listKeyWithSymbol = `\`${LIST_KEY}\``;

  // Atomic fields section
  constraints += "<atomic_component_information>\n";
  const atomicComponentInfo = atomicFields.map((item) => {
    return {
      name: item.name,
      summary: item.summary,
    };
  });
  constraints += stringify(atomicComponentInfo, {
    aliasDuplicateObjects: false,
  });
  constraints += "</atomic_component_information>\n\n";

  // Composite combinations section
  constraints += "<allowed_field_combinations>\n";
  const allowedFieldCombinations = compositeFields.map((item) => {
    return {
      fieldCombinations: JSON.stringify(item.fieldCombinations),
      name: item.name,
      summary: item.summary,
    };
  });
  constraints += stringify(allowedFieldCombinations, {
    aliasDuplicateObjects: false,
  });
  constraints += "</allowed_field_combinations>\n\n";

  constraints += `- You can refer to the information in <atomic_component_information> to understand what each component defines
- Each section MUST strictly follow the item's \`fieldCombinations\` listed in <allowed_field_combinations>, this table is for validation only—do not emit a "fieldCombinations" key in any section instance.
    - The emitted field set of each section (excluding "sectionName" and "sectionSummary") must be exactly equal to the chosen combination—no extra or missing keys.
- Layout sections may include a ${listKeyWithSymbol} field **only if** the chosen combination includes \`${LIST_KEY}.N\`
    - Each ${listKeyWithSymbol} item is itself a section and MUST independently follow <allowed_field_combinations>
- This constraint applies recursively: all sections at any depth must strictly comply
- Zero-Tolerance List Misuse:
    - A ${listKeyWithSymbol} field is allowed only when the chosen combination **includes \`${LIST_KEY}.N\` (e.g., \`${LIST_KEY}.0\`, \`${LIST_KEY}.1\`)**; otherwise any presence of ${listKeyWithSymbol} invalidates the output and must be rejected.
- Strict List Rules:
    - Item Structure: Every ${listKeyWithSymbol} item MUST be an object (section), NOT a plain string/number, and SHOULD include \`sectionName\` and \`sectionSummary\`
    - Item Combination: All ${listKeyWithSymbol} items must share the same chosen combination from <allowed_field_combinations> and each item must follow it strictly—never mix different component combinations inside the same list
    - Count Match: The number of ${listKeyWithSymbol} items MUST equal that count.
    - Fail-Fast Fallback: If any item cannot be assigned a valid combination or counts don’t match, abandon the list-based combination and switch to a non-list compliant combination. Never emit downgraded string items like:
        ${LIST_KEY}:
          - "aaaa"   # disallowed
          - "bbbb"   # disallowed
`;

  constraints += `- Value-Level Downgrade (fallback when no exact match <allowed_field_combinations> exists):
    - What it does: Allows using the closest **allowed superset** combination so the **emitted field set still exactly equals** one entry in <allowed_field_combinations>, while hiding secondary UI elements at render time
    - How to apply: For an element you want hidden, set **all** of its field to the **empty string ""** (all empty). The template MUST NOT render that element or reserve space
    - Not for lists: \`${LIST_KEY}\` and its items MUST NOT use empty-value downgrade; lists still follow explicit \`\${LIST_KEY}.N\` presence and exact count-matching rules
    - Outcome: Field-set equality with <allowed_field_combinations> is preserved. External-link checks apply only to **non-empty** values; empty strings mean "hidden" and MUST NOT be replaced by placeholders, fake URLs, or \`null\`
`;

  constraints += `- How to use components correctly:
    - Any component whose name contains "Hero" must be used as a standalone section—never place it inside a \`${LIST_KEY}\` item, and Value-Level Downgrade cannot bypass this restriction
    - For any combination that includes \`${LIST_KEY}\`, every list item must reuse the exact same component combination so the list remains visually consistent—do not mix different components in the same list
    - If the shared component combination includes orientation-style fields (e.g., left/right layout options), you may vary those field values across list items to improve pacing—never swap to a different component, only adjust the orientation within the same combination
    - Keep button labels short, direct, and prefix/suffix-free—avoid decorative symbols like dashes so the action stays immediately clear
`;

  return constraints;
}
