import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
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
          instructions: `
这是一个原子组件，需要输出这个组件的属性
${JSON.stringify(component)}          
`,
          outputSchema: component.schema,
          outputKey: `atomicComponents.${index}`,
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
