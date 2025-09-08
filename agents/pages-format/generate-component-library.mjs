import { z } from "zod";
import { TeamAgent, AIAgent } from "@aigne/core";

export default async function generateComponentLibrary(input, options) {
  const { componentLibrary, moreContentsComponentList } = input;
  try {
    const atomicComponents =
      componentLibrary?.filter((item) => item.type === "atomic") || [];

    const atomicComponentsNeedParse =
      atomicComponents?.filter((item) => !item.dataSourceTemplate) || [];

    const atomicComponentsParserAgents = atomicComponentsNeedParse.map(
      (item, index) => {
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
      }
    );

    const compositeComponents =
      componentLibrary?.filter((item) => item.type === "composite") || [];

    const compositeComponentsNeedParse =
      compositeComponents?.filter((item) => !item.configTemplate) || [];

    // 构建 componentId map 减少查找复杂度
    const componentIdMap = {};
    componentLibrary.forEach((comp) => {
      componentIdMap[comp.componentId] = comp;
    });

    const moreContentsComponentMap = {};
    moreContentsComponentList.forEach((comp) => {
      moreContentsComponentMap[comp.content.id] = comp;
    });

    const compositeComponentsParserAgents = compositeComponents.map((item) => {
      // 提取相关组件信息
      const relatedComponentsInfo = item.relatedComponents.map(
        (componentId) => {
          const atomicComponent = componentIdMap[componentId];
          const component = moreContentsComponentMap[componentId];
          return {
            componentId,
            name:
              atomicComponent?.name || component?.content?.name || "Unknown",
            summary: atomicComponent?.summary || "无描述",
          };
        }
      );

      const getGridSettingsSchema = () =>
        z.object({
          x: z.number().describe("水平位置，从0开始，在12列网格中的起始列"),
          y: z
            .number()
            .describe(
              "垂直位置，从0开始，上下布局时y值递增(0,1,2...)，不能跳跃"
            ),
          w: z
            .number()
            .describe("宽度，占用的列数，在12列网格系统中，x + w 不能超过12"),
          h: z
            .number()
            .default(1)
            .describe(
              "高度，永远固定为1，不可修改，组件实际高度由内容自动计算"
            ),
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
              gridSettings: z.object({
                desktop: z.object(desktopGridSettings),
                mobile: z.object(mobileGridSettings),
              }),
            }
          : {};

      const configSchema = z.object({
        ...gridSettingsConfig,
        gap: z
          .enum(["none", "small", "normal", "large"])
          .default("none")
          .describe("布局间距"),
        paddingX: z
          .string()
          .default("none")
          .describe(
            "水平内边距，枚举类型 none|small|normal|large|xl， 同时支持 custom:XXXpx 格式"
          ),
        paddingY: z
          .string()
          .default("none")
          .describe(
            "垂直内边距，枚举类型 none|small|normal|large|xl， 同时支持 custom:XXXpx 格式"
          ),
        alignContent: z
          .enum([
            "start",
            "center",
            "end",
            "space-between",
            "space-around",
            "space-evenly",
          ])
          .default("center")
          .describe("内容对齐方式"),
        justifyContent: z
          .enum([
            "start",
            "center",
            "end",
            "space-between",
            "space-around",
            "space-evenly",
          ])
          .default("start")
          .describe("内容对齐方式"),
        background: z
          .string()
          .default("transparent")
          .describe("背景图片路径或颜色值，默认 transparent")
          .nullable(),
        backgroundFullWidth: z
          .boolean()
          .default(false)
          .describe("是否背景全宽，默认 false"),
        ignoreMaxWidth: z
          .boolean()
          .default(false)
          .describe("是否忽略最大宽度，使得背景最大"),
        maxWidth: z
          .string()
          .default("full")
          .describe("最大宽度，支持 custom:XXXpx 格式"),
        border: z.string().default("none").describe("边框样式"),
        borderRadius: z
          .enum(["none", "small", "medium", "large", "xl", "rounded", "custom"])
          .default("none")
          .describe(
            "边框圆角，枚举类型 none|small|medium|large|xl|rounded|custom"
          ),
        height: z
          .string()
          .default("100%")
          .describe("组件高度，支持 custom:XXXpx 格式，默认 100%"),
      });

      return AIAgent.from({
        name: `compositeComponentsParserAgent-${item.name}`,
        outputKey: item.componentId,
        outputSchema: z.object({
          [item.componentId]: configSchema,
        }),
        instructions: `
你是 Pages Kit composite 组件 config 生成器，请严格遵守 <rules> 中的规则，生成复合组件的 layout-block 的配置内容。

<composite-component-info>
组件名称: ${item.name}
组件描述: ${item.summary || "无描述"}
字段组合: ${JSON.stringify(item.fieldCombinations)}
相关组件: ${JSON.stringify(item.relatedComponents)}
</composite-component-info>

<related-components>
${relatedComponentsInfo
  .map(
    (comp) =>
      `组件ID: ${comp.componentId}
组件名称: ${comp.name}
组件描述: ${comp.summary}`
  )
  .join("\n\n---------\n")}
</related-components>

<rules>
- 请根据 <composite-component-info> 生成合理的 layout-block 配置内容
- 在生成过程中，需要参考 <related-components> 中的子组件信息，确保 layout-block 的配置内容合理，尤其是 gridSettings 的配置
  - gridSettings 的配置，需要考虑在 desktop 和 mobile 两个设备尺寸下的布局，确保布局合理
- 需要仔细思考什么样的配置是最合理的，<examples> 中的示例仅供参考，不要盲目照搬
</rules>

<examples>
输入:
- HeroSection，字段组合: ['title', 'description', 'action']，需要展示标题、描述和行动按钮
- 相关组件信息: ['xoHu0J44322kDYc-', 'a44r0SiGV9AFn2Fj']
- 思考：应该采取上下布局，标题和描述在上，行动按钮在下，并且保持宽度一致

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
  "background": "transparent",
  "backgroundFullWidth": false,
  "ignoreMaxWidth": false,
  "maxWidth": "lg",
  "border": "none",
  "borderRadius": "none",
  "height": "100%"
}
</examples>
`,
      });
    });

    const skills = [
      ...atomicComponentsParserAgents,
      ...compositeComponentsParserAgents,
    ];

    if (skills.length === 0) {
      return {
        componentLibrary,
      };
    }

    const parserComponentsTeamAgent = TeamAgent.from({
      type: "team",
      name: "parserComponentsTeamAgent",
      skills,
      mode: "parallel",
    });

    const parserComponentsTeamAgentResult = await options.context.invoke(
      parserComponentsTeamAgent,
      {}
    );

    // 更新到 componentLibrary 里面
    const updatedComponentLibrary = componentLibrary.map((item) => {
      if (
        item.type === "atomic" &&
        item.componentId in parserComponentsTeamAgentResult
      ) {
        const template = parserComponentsTeamAgentResult[item.componentId];
        return {
          ...item,
          dataSourceTemplate: template,
        };
      } else if (
        item.type === "composite" &&
        item.componentId in parserComponentsTeamAgentResult
      ) {
        const configTemplate =
          parserComponentsTeamAgentResult[item.componentId];
        return {
          ...item,
          configTemplate: configTemplate,
        };
      }
      return item;
    });

    return {
      componentLibrary: updatedComponentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to generate component library: ${error.message}`);
  }
}

generateComponentLibrary.taskTitle = "Generating component library definition";
