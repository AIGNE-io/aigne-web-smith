import { parse } from "yaml";
import { z } from "zod";

// 简化的递归 Section Schema，兼容 Zod 4.x
const createSectionSchema = () => {
  const baseSection = z.object({
    id: z.string().min(1, "Section ID is required"),
    name: z.string().min(1, "Section name is required"),
    llmConfig: z.record(z.unknown()).optional(),
    component: z.string().min(1, "Component type is required"),
    config: z.record(z.unknown()).optional(),
  });

  // 添加可选的递归 sections 字段
  const SectionSchema = baseSection.extend({
    sections: z.lazy(() => z.array(SectionSchema)).optional(),
  });

  return SectionSchema;
};

const SectionSchema = createSectionSchema();

// Pages Kit YAML Schema - 兼容 Zod 4.x
const pagesKitSchema = z.object({
  // 必需的顶级字段
  id: z.string().min(1, "Page ID is required"),
  createdAt: z.string().min(1, "createdAt is required"),
  updatedAt: z.string().min(1, "updatedAt is required"),
  isPublic: z.boolean(),

  // 可选的顶级字段
  publishedAt: z.string().optional(),
  // templateConfig: z.object({
  //   isTemplate: z.boolean(),
  //   dataSourceParameters: z.record(z.unknown()).optional(),
  //   enabledGenerate: z.boolean().optional(),
  // }).optional(),

  // meta 对象
  meta: z
    .object({
      backgroundColor: z.string().optional(),
      style: z.record(z.unknown()).optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      header: z.record(z.unknown()).optional(),
    })
    .optional(),

  // sections 数组
  sections: z.array(SectionSchema),

  // dataSource 对象
  dataSource: z.record(
    z.object({
      properties: z.record(
        z.object({
          value: z.unknown(), // 使用 z.unknown() 替代 z.any()
        }),
      ),
    }),
  ),
});

export default async function validatePagesData(input) {
  const { pagesKitYaml } = input;

  try {
    // Step 1: 解析YAML语法
    let parsedData;
    try {
      parsedData = parse(pagesKitYaml);
    } catch (parseError) {
      return {
        ...input,
        isValid: false,
        validationFeedback: `YAML syntax error: ${parseError.message}`,
        errors: [
          {
            path: "yaml_syntax",
            message: `Invalid YAML syntax: ${parseError.message}`,
            code: "YAML_SYNTAX_ERROR",
          },
        ],
      };
    }

    // Step 2: Zod Schema 校验
    try {
      const validationResult = pagesKitSchema.safeParse(parsedData);

      if (validationResult.success) {
        // 校验成功
        return {
          ...input,
          isValid: true,
          validationFeedback: "Pages YAML format validation passed",
          parsedData: validationResult.data,
        };
      } else {
        // 校验失败 - 安全地收集所有错误
        const zodError = validationResult.error;
        const zodErrors = zodError?.errors || zodError?.issues || [];

        const errors = zodErrors.map((error) => ({
          path: Array.isArray(error.path) ? error.path.join(".") : String(error.path || "unknown"),
          message: error.message || "Validation failed",
          code: error.code || "VALIDATION_ERROR",
        }));

        // 生成用户友好的反馈
        const errorSummary =
          errors.length === 1
            ? `Found 1 validation error:`
            : `Found ${errors.length} validation errors:`;

        const errorDetails = errors
          .map((error, index) => `${index + 1}. ${error.path}: ${error.message}`)
          .join("\n");

        return {
          ...input,
          isValid: false,
          validationFeedback: `${errorSummary}\n${errorDetails}`,
          errors,
          errorCount: errors.length,
        };
      }
    } catch (zodError) {
      // Zod 内部错误
      return {
        ...input,
        isValid: false,
        validationFeedback: `Zod validation error: ${zodError.message}`,
        errors: [
          {
            path: "zod_internal",
            message: zodError.message || "Zod internal error",
            code: "ZOD_ERROR",
          },
        ],
      };
    }
  } catch (error) {
    // 未预期的错误
    return {
      ...input,
      isValid: false,
      validationFeedback: `Validation failed with unexpected error: ${error.message}`,
      errors: [
        {
          path: "validation_system",
          message: error.message,
          code: "SYSTEM_ERROR",
        },
      ],
    };
  }
}

validatePagesData.taskTitle = "Validate Pages Data";
