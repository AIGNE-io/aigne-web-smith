import { join } from "node:path";
import { AIAgent, PromptBuilder, TeamAgent } from "@aigne/core";
import { z } from "zod";
import {
  getChildFieldCombinationsKey,
  getComponentLibraryData,
} from "../../utils/generate-helper.mjs";
import saveComponentLibrary from "./save-component-library.mjs";

export default async function parseComponentLibrary(input, options) {
  const { moreContentsComponentList, middleFormatFiles, tmpDir } = input;

  try {
    // 进一步 parser 每个组件库
    const tempComponentLibraryData = getComponentLibraryData(tmpDir);
    const { componentLibrary } = tempComponentLibraryData;

    const atomicComponentsNeedParse = [];
    const compositeComponentsNeedParse = [];

    // 提取组件库需要解析的组件
    componentLibrary.forEach((item) => {
      if (item.type === "atomic" && !item.dataSourceTemplate) {
        atomicComponentsNeedParse.push(item);
      } else if (item.type === "composite" && !item.configTemplate) {
        compositeComponentsNeedParse.push(item);
      }
    });

    // 没有需要解析的组件，直接返回
    if (atomicComponentsNeedParse.length === 0 && compositeComponentsNeedParse.length === 0) {
      return {
        componentLibraryData: tempComponentLibraryData,
        componentLibrary,
      };
    }

    // 构建 componentId map 减少查找复杂度
    const componentLibraryIdMap = {};
    componentLibrary.forEach((comp) => {
      componentLibraryIdMap[comp.componentId] = comp;
    });

    const moreContentsComponentMap = {};
    moreContentsComponentList.forEach((comp) => {
      if (!comp?.content?.id) {
        return;
      }
      moreContentsComponentMap[comp?.content?.id] = comp;
    });

    const atomicComponentsParserAgents = atomicComponentsNeedParse.map((item) => {
      const { componentId } = item;
      const component = moreContentsComponentList.find((item) => item?.content?.id === componentId);

      const wrapperFieldName = (fieldName) => `<%= ${fieldName} %>`;

      const fieldCombinationsWithMustache = item.fieldCombinations?.map(wrapperFieldName);

      if (!component || !fieldCombinationsWithMustache) {
        return;
      }

      const { instructions } = PromptBuilder.from({
        path: join(
          import.meta.dirname,
          "../../../prompts/generate/component-library/parse-atomic-component.md",
        ),
      });

      return AIAgent.from({
        name: `atomicComponentsParserAgent-${item.name}`,
        outputKey: item.componentId,
        outputSchema: z.object({
          [item.componentId]: component?.content?.zodSchema,
        }),
        instructions: instructions
          .replace("{{componentSchema}}", JSON.stringify(component?.content?.schema || {}))
          .replace("{{fieldCombinations}}", JSON.stringify(fieldCombinationsWithMustache || [])),
      });
    });

    const compositeComponentsParserAgents = compositeComponentsNeedParse.map((item) => {
      if (!item?.relatedComponents?.length) {
        return;
      }

      // 提取相关组件信息
      const relatedComponentsInfo = item.relatedComponents?.map((relatedComponentItem) => {
        const { componentId } = relatedComponentItem;
        const atomicComponent = componentLibraryIdMap[componentId];
        const component = moreContentsComponentMap[componentId];
        return {
          componentId,
          name: atomicComponent?.name || component?.content?.name || "Unknown",
          summary: atomicComponent?.summary || "无描述",
        };
      });

      const getGridSettingsSchema = () =>
        z.object({
          x: z.number().describe("水平位置，从0开始，在12列网格中的起始列"),
          y: z.number().describe("垂直位置，从0开始，上下布局时y值递增(0,1,2...)，不能跳跃"),
          w: z.number().describe("宽度，占用的列数，在12列网格系统中，x + w 不能超过12"),
          h: z
            .number()
            .default(1)
            .describe("高度，永远固定为1，不可修改，组件实际高度由内容自动计算"),
        });

      // 基于 relatedComponents 创建固定的对象结构
      const desktopGridSettings = {};
      const mobileGridSettings = {};

      // 处理 relatedComponents 的布局
      item.relatedComponents?.forEach(({ fieldCombinations }) => {
        const key = getChildFieldCombinationsKey(fieldCombinations);
        desktopGridSettings[key] = getGridSettingsSchema();
        mobileGridSettings[key] = getGridSettingsSchema();
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
        gap: z.enum(["none", "small", "normal", "large"]).default("none").describe("布局间距"),
        paddingX: z
          .string()
          .default("none")
          .describe("水平内边距，枚举类型 none|small|normal|large|xl， 同时支持 custom:XXXpx 格式"),
        paddingY: z
          .string()
          .default("none")
          .describe("垂直内边距，枚举类型 none|small|normal|large|xl， 同时支持 custom:XXXpx 格式"),
        alignContent: z
          .enum(["start", "center", "end", "space-between", "space-around", "space-evenly"])
          .default("center")
          .describe("内容对齐方式"),
        justifyContent: z
          .enum(["start", "center", "end", "space-between", "space-around", "space-evenly"])
          .default("start")
          .describe("内容对齐方式"),
        background: z
          .string()
          .default("transparent")
          .describe("背景图片路径或颜色值，默认 transparent")
          .nullable(),
        backgroundFullWidth: z.boolean().default(false).describe("是否背景全宽，默认 false"),
        ignoreMaxWidth: z.boolean().default(false).describe("是否忽略最大宽度，使得背景最大"),
        maxWidth: z.string().default("full").describe("最大宽度，支持 custom:XXXpx 格式"),
        border: z.string().default("none").describe("边框样式"),
        borderRadius: z
          .enum(["none", "small", "medium", "large", "xl", "rounded", "custom"])
          .default("none")
          .describe("边框圆角，枚举类型 none|small|medium|large|xl|rounded|custom"),
        height: z
          .string()
          .default("100%")
          .describe("组件高度，支持 custom:XXXpx 格式，默认 100%")
          .nullable(),
      });

      const { instructions } = PromptBuilder.from({
        path: join(
          import.meta.dirname,
          "../../../prompts/generate/component-library/parse-composite-component.md",
        ),
      });

      return AIAgent.from({
        name: `compositeComponentsParserAgent-${item.name}`,
        outputKey: item.componentId,
        outputSchema: z.object({
          [item.componentId]: configSchema,
        }),
        instructions: instructions
          .replace("{{componentName}}", item.name)
          .replace("{{componentSummary}}", item.summary || "无描述")
          .replace("{{fieldCombinations}}", JSON.stringify(item.fieldCombinations))
          .replace("{{relatedComponents}}", JSON.stringify(item.relatedComponents))
          .replace(
            "{{relatedComponentsInfo}}",
            relatedComponentsInfo
              .map(
                (comp) =>
                  `组件ID: ${comp?.componentId}\n组件名称: ${comp?.name}\n组件描述: ${comp?.summary}`,
              )
              .join("\n\n---------\n"),
          ),
      });
    });

    const parserComponentsAgents = [
      ...atomicComponentsParserAgents,
      ...compositeComponentsParserAgents,
    ].filter(Boolean);

    if (parserComponentsAgents.length) {
      const parseComponentsTeamAgent = TeamAgent.from({
        type: "team",
        name: "parseComponentsTeamAgent",
        skills: parserComponentsAgents,
        mode: "parallel",
      });

      const parseComponentsTeamAgentResult = await options.context.invoke(
        parseComponentsTeamAgent,
        { ...input },
        {
          ...options,
          streaming: false,
        },
      );

      // 更新到 componentLibrary 里面
      const updatedComponentLibrary = componentLibrary.map((item) => {
        if (item.type === "atomic" && item.componentId in parseComponentsTeamAgentResult) {
          const template = parseComponentsTeamAgentResult[item.componentId];
          return {
            ...item,
            dataSourceTemplate: template,
          };
        } else if (
          item.type === "composite" &&
          item.componentId in parseComponentsTeamAgentResult
        ) {
          const configTemplate = parseComponentsTeamAgentResult[item.componentId];
          return {
            ...item,
            configTemplate: configTemplate,
          };
        }
        return item;
      });

      await saveComponentLibrary({
        componentLibrary: updatedComponentLibrary,
        tmpDir,
        middleFormatFiles: middleFormatFiles,
      });
    }

    const newComponentLibraryData = getComponentLibraryData(tmpDir);

    return {
      componentLibraryData: newComponentLibraryData,
      componentLibrary: newComponentLibraryData.componentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to parse component library: ${error.message}`);
  }
}

parseComponentLibrary.taskTitle = "Parse component library";
