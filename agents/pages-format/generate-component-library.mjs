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

    const atomicComponentsParserAgents = atomicComponents.map((item, index) => {
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
    });

    const compositeComponents = componentLibrary.filter(
      (item) => item.type === "composite"
    );

    const compositeComponentsParserAgents = compositeComponents.map((item) => {
      const getGridSettingsSchema = () =>
        z.object({
          x: z.number(),
          y: z.number(),
          w: z.number(),
          h: z.number().default(1),
        });

      // 基于 relatedComponents 创建固定的对象结构
      const desktopGridSettings = {};
      const mobileGridSettings = {};

      item.relatedComponents.forEach((componentId) => {
        desktopGridSettings[componentId] = getGridSettingsSchema();
        mobileGridSettings[componentId] = getGridSettingsSchema();
      });

      // 定义输出 schema - config 对象
      const gridSettingsConfig =
        item.relatedComponents.length > 0
          ? {
              gridSettings: z
                .object({
                  desktop: z.object(desktopGridSettings),
                  mobile: z.object(mobileGridSettings),
                })
                .optional(),
            }
          : {};

      const configSchema = z.object({
        ...gridSettingsConfig,
        gap: z.string().optional(),
        padding: z.string().optional(),
        paddingX: z.string().optional(),
        paddingY: z.string().optional(),
        alignContent: z.string().optional(),
        justifyContent: z.string().optional(),
        background: z.string().optional(),
        backgroundFullWidth: z.boolean().optional(),
        ignoreMaxWidth: z.boolean().optional(),
        maxWidth: z.string().optional(),
        border: z.string().optional(),
        borderRadius: z.string().optional(),
        height: z.string().optional(),
      });

      console.warn(222222, configSchema);

      return AIAgent.from({
        name: `compositeComponentsParserAgent-${item.name}`,
        outputKey: item.componentId,
        outputSchema: z.object({
          [item.componentId]: configSchema,
        }),
        instructions: `
你是 Pages Kit composite 组件 config 生成器，请严格遵守 <rules> 中的规则，生成 layout-block 的配置对象。

<composite-component-info>
组件名称: ${item.name}
</composite-component-info>


<rules>
生成 layout-block 的 config 配置对象：

1. gridSettings 配置：
   - desktop: 每个相关组件一个键值对，键为组件ID，值为网格位置
   - mobile: 可选，移动端布局配置
   - 使用12列网格系统，h值固定为1
   - 上下布局：y值递增(0,1,2...)，不能跳跃
   - 左右布局：相同y值，不同x值

2. 布局配置枚举值：
   - gap/padding: "none|small|normal|large"
   - paddingX/paddingY: "none|small|normal|large|xl|custom:XXXpx"
   - alignContent/justifyContent: "start|center|end|space-between|space-around|space-evenly"
   - maxWidth: "full|none|sm|md|lg|xl|custom:XXXpx"
   - background: 背景图片路径或颜色值
   - backgroundFullWidth: boolean - 背景是否全宽显示
   - ignoreMaxWidth: boolean - 是否忽略最大宽度限制
   - border: "none|solid|dashed|dotted|chrome|safari|terminal|shadow-sm|shadow-md|shadow-lg|shadow-xl|shadow-max|macbook|phone|custom"
   - borderRadius: "none|small|medium|large|xl|rounded|custom"
   - height: "auto|100%|unset|inherit|initial|fit-content|max-content|min-content|custom:XXXpx"

</rules>

<examples>
输入 HeroSection (title, description, action):
输出:
{
  "gridSettings": {
    "desktop": {
      "xoHu0J44322kDYc-": {"x": 0, "y": 0, "w": 12, "h": 1},
      "a44r0SiGV9AFn2Fj": {"x": 0, "y": 1, "w": 12, "h": 1}
    },
    "mobile": {
      "xoHu0J44322kDYc-": {"x": 0, "y": 0, "w": 12, "h": 1},
      "a44r0SiGV9AFn2Fj": {"x": 0, "y": 1, "w": 12, "h": 1}
    }
  },
  "gap": "normal",
  "paddingX": "normal",
  "paddingY": "large",
  "alignContent": "center",
  "justifyContent": "center",
  "maxWidth": "lg"
}
</examples>
`,
      });
    });

    const parserComponentsTeamAgent = TeamAgent.from({
      type: "team",
      name: "parserComponentsTeamAgent",
      skills: [
        // ...atomicComponentsParserAgents,
        ...compositeComponentsParserAgents,
      ],
      mode: "parallel",
    });

    const parserComponentsTeamAgentResult = await options.context.invoke(
      parserComponentsTeamAgent,
      {}
    );

    //

    // 更新到 componentLibrary 里面
    const updatedComponentLibrary = componentLibrary.map((item) => {
      if (item.type === "atomic") {
        const template = parserComponentsTeamAgentResult[item.componentId];
        return {
          ...item,
          dataSourceTemplate: template,
        };
      } else if (item.type === "composite") {
        // const structuredData =
        //   parserComponentsTeamAgentResult[item.componentId];
        // return {
        //   ...item,
        //   structuredDataTemplate: structuredData,
        // };
      }
      return item;
    });

    console.warn(2222222222, parserComponentsTeamAgentResult);

    return {
      componentLibrary: updatedComponentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to generate component library: ${error.message}`);
  }
}

generateComponentLibrary.taskTitle = "Generating component library definition";
