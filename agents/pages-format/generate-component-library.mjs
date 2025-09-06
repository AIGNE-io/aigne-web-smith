import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { TeamAgent, AIAgent } from "@aigne/core";

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

    const atomicComponentsTeamAgent = TeamAgent.from({
      type: "team",
      name: "atomicComponentsParserTeamAgent",
      skills: atomicComponents.map((item, index) => {
        const { componentId } = item;
        const component = moreContentsComponentList.find(
          (item) => item.content.id === componentId
        );

        const wrapperFieldName = (fieldName) => `<%= ${fieldName} %>`;

        const fieldCombinationsWithMustache =
          item.fieldCombinations.map(wrapperFieldName);

        const titleFieldName = wrapperFieldName("title");
        const descriptionFieldName = wrapperFieldName("description");
        const codeFieldName = wrapperFieldName("code");

        return AIAgent.from({
          name: `atomicComponentsParserAgent-${item.name}`,
          outputKey: item.componentId,
          outputSchema: z.object({
            [item.componentId]: component.content.zodSchema,
          }),
          instructions: `
你是 Pages Kit 组件 dataSource 模板生成器，请严格遵守 <rules> 中的规则，帮助用户生成合理的 dataSource 模板。

<component-props-json-schema>
${JSON.stringify(component.content.schema || {})}
</component-props-json-schema>

<field-combinations>
${JSON.stringify(fieldCombinationsWithMustache || [])}
</field-combinations>

<rules>
根据 <component-props-json-schema> 生成完整的 dataSource 模板：
- 包含 <component-props-json-schema> 中所有字段，保持数据结构完整性
- 将 dataSource 模板中与 <field-combinations> 相关的字段替换为 value 值，替换详情请参考示例 <examples>
  - 在后续使用中，会使用 lodash 的 _.template 包裹 dataSource 模板，把 {[fileName]: value} 中的 value 值替换到 dataSource 模板中，value 会是个简单类型，如 string, number, boolean 等
  - 必须保证 <field-combinations> 里面所有字段都在 dataSource 模板中
- 其他字段使用合理默认值
</rules>

<examples>
输入: field-combinations ["${titleFieldName}", "${descriptionFieldName}"]
输出: {"title":{"text":"${titleFieldName}","style":{"color":"common.black"}},"description":{"list":[{"type":"text","text":"${descriptionFieldName}"}]},"align":"center"}

输入: field-combinations ["${codeFieldName}"] 
输出: {"code":"${codeFieldName}","filename":"example.js","showLineNumbers":true}
</examples>

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
