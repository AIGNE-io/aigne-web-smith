import { z } from "zod";
import { TeamAgent, AIAgent, AIGNE, PromptBuilder } from "@aigne/core";
import { OpenAIChatModel } from "@aigne/openai";
import { getAllFieldCombinations } from "./sdk.mjs";
import fs, { readFileSync, readdirSync } from "node:fs";
import saveComponentLibrary from "./save-component-library.mjs";
import { join } from "node:path";
import { calculateMiddleFormatHash, getComponentLibraryDir } from "./sdk.mjs";
import { parse, stringify } from "yaml";

// 组件库的 Zod Schema
const getComponentZodSchema = ({ allFieldCombinations }) => {
  return z.object({
    componentLibrary: z
      .array(
        z.object({
          name: z.string().describe("组件名称"),
          summary: z
            .string()
            .describe(
              "组件的用途和特点，尽可能具体，如果是复合组件，需要说明布局特征"
            ),
          type: z
            .enum(["atomic", "composite"])
            .describe("组件类型 atomic（原子组件）或 composite（复合组件）"),
          componentId: z
            .string()
            .describe(
              "组件ID（原子组件需要记录真实的组件 ID，复合组件使用随机生成的 ID）"
            ),
          fieldCombinations: z.array(z.string()).describe("组件处理的字段组合"),
          relatedComponents: z
            .array(
              z.object({
                componentId: z.string().describe("关联的原子组件的 ID"),
                fieldCombinations: z
                  .array(z.string())
                  .describe("关联的原子组件使用的字段组合"),
              })
            )
            .default([])
            .describe(
              "关联的原子组件内容（仅复合组件需要，如果是原子组件则为 [] 空数组）"
            ),
        })
      )
      .default([])
      .describe(
        "组件库定义数组，如果复合组件中的 relatedComponents 中的 componentId，确保对应的原子组件记录在组件库中"
      ),
  });
};

export default async function analyzeAndGenerateComponentLibrary(
  input,
  options
) {
  const {
    moreContentsComponentList,
    componentList,
    middleFormatFiles,
    tmpDir,
  } = input;

  const componentLibraryDir = getComponentLibraryDir(tmpDir);

  // 使用 OpenAI 引擎
  const openaiModel = new OpenAIChatModel({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini",
  });

  const engine = new AIGNE({
    model: openaiModel,
  });

  try {
    const analyzeComponentLibraryAgentSkills = middleFormatFiles
      .map((item, index) => {
        const { content, filePath } = item;
        const allFieldCombinations = getAllFieldCombinations([item]);
        const componentLibraryPath = join(componentLibraryDir, filePath);
        const hash = calculateMiddleFormatHash([item]);

        // 尝试读取组件库文件
        let componentLibraryContent = {};
        try {
          componentLibraryContent = readFileSync(componentLibraryPath, "utf8");
          componentLibraryContent = parse(componentLibraryContent);
        } catch (error) {
          // ignore error
        }

        if (componentLibraryContent?.hash === hash) {
          return;
        }

        return AIAgent.from({
          name: `analyzeComponentLibraryAgent-${filePath}`,
          inputKey: filePath,
          outputKey: filePath,
          outputSchema: z.object({
            [filePath]: getComponentZodSchema({
              allFieldCombinations,
            }),
          }),
          instructions: PromptBuilder.from({
            path: join(
              // 当前文件的目录
              import.meta.dirname,
              "../../prompts/pages-format/analyze-component-library.md"
            ),
          })
            .instructions.replace(
              "{{middleFormatContent}}",
              JSON.stringify(parse(content))
            )
            .replace(
              "{{componentList}}",
              componentList
                .map((item) => {
                  const { content } = item;
                  const { id, name, description, schema } = content;
                  return `// ${name}(${id}): ${description}
<component-${id}>
${JSON.stringify(schema)}
</component-${id}>
              `;
                })
                .join("\n")
            )
            .replace(
              "{{allFieldCombinations}}",
              `${allFieldCombinations
                .map((item, index) => `${JSON.stringify(item)}`)
                .join("\n")}`
            ),
        });
      })
      .filter(Boolean);

    // 如果需要分析组件库，则进行分析
    if (analyzeComponentLibraryAgentSkills.length > 0) {
      const analyzeComponentLibraryAgent = TeamAgent.from({
        name: "analyzeComponentLibraryAgent",
        skills: analyzeComponentLibraryAgentSkills,
        mode: "parallel",
      });

      const analyzeMiddleFormatComponentResult = await engine.invoke(
        analyzeComponentLibraryAgent,
        {}
      );

      // 保存组件库
      await Promise.all(
        Object.entries(analyzeMiddleFormatComponentResult).map(
          async ([filePath, { componentLibrary }]) => {
            return await saveComponentLibrary({
              componentLibrary,
              tmpDir,
              filePath,
              middleFormatFiles: middleFormatFiles.filter(
                (item) => item.filePath === filePath
              ),
            });
          }
        )
      );
    }

    // 进一步 parser 每个组件库
    const componentLibraryFiles = readdirSync(componentLibraryDir);

    // 解析组件库
    const parserComponentLibraryResult = await Promise.all(
      componentLibraryFiles.map(async (filePath) => {
        const componentLibraryPath = join(componentLibraryDir, filePath);
        const componentLibraryContent = readFileSync(
          componentLibraryPath,
          "utf8"
        );
        const { componentLibrary } = parse(componentLibraryContent);

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
              instructions: PromptBuilder.from({
                path: join(
                  import.meta.dirname,
                  "../../prompts/pages-format/atomic-component-parser.md"
                ),
              })
                .instructions.replace(
                  "{{componentSchema}}",
                  JSON.stringify(component.content.schema || {})
                )
                .replace(
                  "{{fieldCombinations}}",
                  JSON.stringify(fieldCombinationsWithMustache || [])
                )
                .replace("{{titleFieldName}}", titleFieldName)
                .replace("{{descriptionFieldName}}", descriptionFieldName)
                .replace("{{codeFieldName}}", codeFieldName),
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

        const compositeComponentsParserAgents =
          compositeComponentsNeedParse.map((item) => {
            // 提取相关组件信息
            const relatedComponentsInfo = item.relatedComponents.map(
              (relatedComponentItem) => {
                const { componentId, fieldCombinations } = relatedComponentItem;
                const atomicComponent = componentIdMap[componentId];
                const component = moreContentsComponentMap[componentId];
                return {
                  componentId,
                  name:
                    atomicComponent?.name ||
                    component?.content?.name ||
                    "Unknown",
                  summary: atomicComponent?.summary || "无描述",
                };
              }
            );

            const getGridSettingsSchema = () =>
              z.object({
                x: z
                  .number()
                  .describe("水平位置，从0开始，在12列网格中的起始列"),
                y: z
                  .number()
                  .describe(
                    "垂直位置，从0开始，上下布局时y值递增(0,1,2...)，不能跳跃"
                  ),
                w: z
                  .number()
                  .describe(
                    "宽度，占用的列数，在12列网格系统中，x + w 不能超过12"
                  ),
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

            // 处理 relatedComponents 的布局
            item.relatedComponents.forEach(({ componentId }) => {
              desktopGridSettings[componentId] = getGridSettingsSchema();
              mobileGridSettings[componentId] = getGridSettingsSchema();
            });

            // 处理 list 的布局
            item.fieldCombinations.forEach((fieldCombination) => {
              const [key, index] = fieldCombination.split(".");
              if (Number.isNaN(Number(index))) return;
              desktopGridSettings[`${key}.${index}`] = getGridSettingsSchema();
              mobileGridSettings[`${key}.${index}`] = getGridSettingsSchema();
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
                .enum([
                  "none",
                  "small",
                  "medium",
                  "large",
                  "xl",
                  "rounded",
                  "custom",
                ])
                .default("none")
                .describe(
                  "边框圆角，枚举类型 none|small|medium|large|xl|rounded|custom"
                ),
              height: z
                .string()
                .default("100%")
                .describe("组件高度，支持 custom:XXXpx 格式，默认 100%")
                .nullable(),
            });

            return AIAgent.from({
              name: `compositeComponentsParserAgent-${item.name}`,
              outputKey: item.componentId,
              outputSchema: z.object({
                [item.componentId]: configSchema,
              }),
              instructions: PromptBuilder.from({
                path: join(
                  import.meta.dirname,
                  "../../prompts/pages-format/composite-component-parser.md"
                ),
              })
                .instructions.replace("{{componentName}}", item.name)
                .replace("{{componentSummary}}", item.summary || "无描述")
                .replace(
                  "{{fieldCombinations}}",
                  JSON.stringify(item.fieldCombinations)
                )
                .replace(
                  "{{relatedComponents}}",
                  JSON.stringify(item.relatedComponents)
                )
                .replace(
                  "{{relatedComponentsInfo}}",
                  relatedComponentsInfo
                    .map(
                      (comp) =>
                        `组件ID: ${comp.componentId}\n组件名称: ${comp.name}\n组件描述: ${comp.summary}`
                    )
                    .join("\n\n---------\n")
                ),
            });
          });

        const skills = [
          ...atomicComponentsParserAgents,
          ...compositeComponentsParserAgents,
        ];

        // 都生成过了，直接返回
        if (skills.length === 0) {
          return {
            filePath,
            componentLibrary,
          };
        }

        const parserComponentsTeamAgent = TeamAgent.from({
          type: "team",
          name: "parserComponentsTeamAgent",
          skills,
          mode: "parallel",
        });

        const parserComponentsTeamAgentResult = await engine.invoke(
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

        await saveComponentLibrary({
          componentLibrary: updatedComponentLibrary,
          tmpDir,
          filePath,
          middleFormatFiles: middleFormatFiles.filter(
            (item) => item.filePath === filePath
          ),
        });

        return {
          filePath,
          componentLibrary: updatedComponentLibrary,
        };
      })
    );

    const componentLibraryMap = {};

    parserComponentLibraryResult.forEach(({ filePath, componentLibrary }) => {
      componentLibraryMap[filePath] = componentLibrary;
    });

    return {
      componentLibraryMap,
    };
  } catch (error) {
    throw new Error(`Failed to generate component library: ${error.message}`);
  }
}

analyzeAndGenerateComponentLibrary.taskTitle =
  "Analyzing and generating component library definition";
