import { join } from "node:path";
import { AIAgent, PromptBuilder, TeamAgent } from "@aigne/core";
import _ from "lodash";
import { z } from "zod";
import {
  getChildFieldCombinationsKey,
  getComponentLibraryData,
} from "../../../utils/generate-helper.mjs";
import saveComponentLibrary from "./save-component-library.mjs";

export default async function parseComponentLibrary(input, options) {
  const { moreContentsComponentList, middleFormatFiles, tmpDir } = input;

  try {
    // Further parse each component library
    const tempComponentLibraryData = getComponentLibraryData(tmpDir);
    const { componentLibrary } = tempComponentLibraryData;

    const atomicComponentsNeedParse = [];
    const compositeComponentsNeedParse = [];

    // Extract components that need to be parsed from component library
    componentLibrary.forEach((item) => {
      if (item.type === "atomic" && !item.dataSourceTemplate) {
        atomicComponentsNeedParse.push(item);
      } else if (item.type === "composite" && !item.configTemplate) {
        compositeComponentsNeedParse.push(item);
      }
    });

    // No components need parsing, return directly
    if (atomicComponentsNeedParse.length === 0 && compositeComponentsNeedParse.length === 0) {
      return {
        componentLibraryData: tempComponentLibraryData,
        componentLibrary,
      };
    }

    // Build componentId map to reduce lookup complexity
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

      const fieldCombinationsWithMustache = item.fieldCombinations
        ?.filter((item) => {
          const [, index] = item.split(".");
          // Atomic components should not support array index fieldCombinations
          if (!_.isNil(index) && !Number.isNaN(Number(index))) {
            return false;
          }
          return true;
        })
        ?.map(wrapperFieldName);

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

      // Extract related component information
      const relatedComponentsInfo = item.relatedComponents
        ?.filter((item) => item?.componentId)
        ?.map((relatedComponentItem) => {
          const { componentId } = relatedComponentItem;
          const atomicComponent = componentLibraryIdMap[componentId];
          const component = moreContentsComponentMap[componentId];
          return {
            componentId,
            name: atomicComponent?.name || component?.content?.name || "Unknown",
            summary: atomicComponent?.summary || "No description",
          };
        });

      const getGridSettingsSchema = () =>
        z.object({
          x: z
            .number()
            .describe(
              "Horizontal position, starting from 0, the starting column in a 12-column grid",
            ),
          y: z
            .number()
            .describe(
              "Vertical position, starting from 0, y value increases in vertical layout (0,1,2...), cannot skip",
            ),
          w: z
            .number()
            .describe(
              "Width, number of columns occupied, in a 12-column grid system, x + w cannot exceed 12",
            ),
          h: z
            .number()
            .default(1)
            .describe(
              "Height, always fixed at 1, cannot be modified, actual component height is calculated automatically by content",
            ),
        });

      // Create fixed object structure based on relatedComponents
      const desktopGridSettings = {};
      const mobileGridSettings = {};

      // Handle layout of relatedComponents
      item.relatedComponents?.forEach(({ fieldCombinations }) => {
        const key = getChildFieldCombinationsKey(fieldCombinations);
        desktopGridSettings[key] = getGridSettingsSchema();
        mobileGridSettings[key] = getGridSettingsSchema();
      });

      // Define output schema - config object
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
          .describe("Layout spacing"),
        paddingX: z
          .string()
          .default("none")
          .describe(
            "Horizontal padding, enum type none|small|normal|large|xl, also supports custom:XXXpx format",
          ),
        paddingY: z
          .string()
          .default("none")
          .describe(
            "Vertical padding, enum type none|small|normal|large|xl, also supports custom:XXXpx format",
          ),
        alignContent: z
          .enum(["start", "center", "end", "space-between", "space-around", "space-evenly"])
          .default("center")
          .describe("Content alignment"),
        justifyContent: z
          .enum(["start", "center", "end", "space-between", "space-around", "space-evenly"])
          .default("start")
          .describe("Content justification"),
        background: z
          .string()
          .default("transparent")
          .describe("Background image path or color value, default transparent")
          .nullable(),
        backgroundFullWidth: z
          .boolean()
          .default(false)
          .describe("Whether background is full width, default false"),
        ignoreMaxWidth: z
          .boolean()
          .default(false)
          .describe("Whether to ignore max width to make background maximum"),
        maxWidth: z
          .string()
          .default("full")
          .describe("Maximum width, supports custom:XXXpx format"),
        border: z
          .enum([
            "none",
            "solid",
            "dashed",
            "dotted",
            "custom",
            "chrome",
            "safari",
            "macbook",
            "phone",
            "terminal",
            "shadow-sm",
            "shadow-md",
            "shadow-lg",
            "shadow-xl",
            "shadow-max",
          ])
          .default("none")
          .describe(
            "Border frame type, supports border styles, browser frames, device frames, terminal frame, and shadow frames",
          ),
        borderRadius: z
          .enum(["none", "small", "medium", "large", "xl", "rounded", "custom"])
          .default("none")
          .describe("Border radius, enum type none|small|medium|large|xl|rounded|custom"),
        height: z
          .string()
          .default("100%")
          .describe("Component height, supports custom:XXXpx format, default 100%")
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
          .replace("{{componentSummary}}", item.summary || "No description")
          .replace("{{fieldCombinations}}", JSON.stringify(item.fieldCombinations))
          .replace("{{relatedComponents}}", JSON.stringify(item.relatedComponents))
          .replace(
            "{{relatedComponentsInfo}}",
            relatedComponentsInfo
              .map(
                (comp) =>
                  `Component ID: ${comp?.componentId}\nComponent Name: ${comp?.name}\nComponent Description: ${comp?.summary}`,
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

      // Update to componentLibrary
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
