import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod/v3";
import { TeamAgent, AIAgent, TransformAgent } from "@aigne/core";

/**
 * 生成组件库 - 基于中间格式文件分析和现有组件列表
 * @param {Object} input
 * @param {Object} input.componentLibrary - 现有组件库定义
 * @param {Array} input.middleFormatFiles - 中间格式文件数组
 * @returns {Promise<Object>}
 */

export default async function generateComponentLibrary(input, options) {
  const { componentLibrary, middleFormatFiles, moreContentsComponentList } =
    input;
  try {
    // 分析中间格式文件，提取组件模式
    // const analysisResult = await analyzeMiddleFormatFiles(middleFormatFiles);

    // console.warn(2222, componentLibrary, moreContentsComponentList);

    const atomicComponents = componentLibrary.filter(
      (item) => item.type === "atomic"
    );

    const compositeComponents = componentLibrary.filter(
      (item) => item.type === "composite"
    );

    const atomicComponentsSchema = z.object({
      template: z
        .record(z.any())
        .describe("模板对象，包含所有 propId 作为 key"),
    });

    const atomicComponentsTeamAgent = TeamAgent.from({
      type: "team",
      name: "atomicComponentsParserTeamAgent",
      skills: atomicComponents.map((item, index) => {
        const { componentId } = item;
        const component = moreContentsComponentList.find(
          (item) => item.content.id === componentId
        );

        return AIAgent.from({
          name: `atomicComponentsParserAgent-${item.name}`,
          outputKey: `atomicComponents.${index}`,
          // outputSchema: atomicComponentsSchema,
          instructions: `
你是一个 Pages Kit 组件 dataSource 生成器。你需要完成两个步骤：

## 第一步：根据 JSON Schema 生成完整的 dataSource 结构

组件名称: ${item.name}
JSON Schema: ${JSON.stringify(component.content.schema || {}, null, 2)}

请根据 JSON Schema 生成一个完整且合理的 dataSource 对象，包含：
- 所有必需的 propId 字段
- 符合 schema 定义的数据类型和结构
- 合理的示例值（文本内容、样式配置等）

## 第二步：根据 fieldCombinations 替换为模板语法

fieldCombinations: ${JSON.stringify(item.fieldCombinations)}

在第一步生成的 dataSource 中，找到与 fieldCombinations 语义相关的文本字段，将其替换为胡子语法 {{fieldName}}：

- 如果 fieldCombinations 包含 "title"，找到标题相关的文本字段，替换为 {{title}}
- 如果 fieldCombinations 包含 "description"，找到描述相关的文本字段，替换为 {{description}}  
- 如果 fieldCombinations 包含 "code"，找到代码相关的文本字段，替换为 {{code}}

## 输出要求

直接输出最终的 dataSource，不要包装在代码块中，不要添加解释文字。

示例输出格式：
{"propId1": {"text": "{{title}}", "style": {...}}, "propId2": {"value": "{{description}}"}}
`,
        });
      }),

      mode: "parallel",
    });

    const result = await options.context.invoke(atomicComponentsTeamAgent, {});

    console.warn(2222222222, result);

    return {};
  } catch (error) {
    throw new Error(`Failed to generate component library: ${error.message}`);
  }
}

generateComponentLibrary.taskTitle = "Generating component library definition";
