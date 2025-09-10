import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { calculateMiddleFormatHash } from "../../sdk/hash-utils.mjs";
import { TeamAgent, AIGNE } from "@aigne/core";
import { getAllFieldCombinations } from "./sdk.mjs";
import { OpenAIChatModel } from "@aigne/openai";

/**
 * 加载所有中间格式文件用于组件模式分析
 * @param {Object} input
 * @param {string} input.pagesDir - pages目录路径
 * @param {string} [input.tmpDir] - 输出目录路径，用于检查缓存
 * @returns {Promise<Object>}
 */
// 格式化组件库，合并 base-component-library.yaml 的内容
const formatComponentLibrary = async (componentLibrary, tmpDir) => {
  try {
    const baseLibraryPath = join(tmpDir, "base-component-library.yaml");
    const baseLibraryContent = await readFile(baseLibraryPath, "utf8");
    const baseLibrary = parse(baseLibraryContent);

    if (
      baseLibrary &&
      baseLibrary.componentLibrary &&
      Array.isArray(baseLibrary.componentLibrary)
    ) {
      // 创建一个 componentId 到基础组件的映射
      const baseComponentMap = new Map();
      baseLibrary.componentLibrary.forEach((component) => {
        if (component.type === "atomic" && component.componentId) {
          baseComponentMap.set(component.componentId, component);
        }
      });

      // 替换现有组件库中的原子组件
      const updatedLibrary = componentLibrary.map((component) => {
        if (
          component.type === "atomic" &&
          component.componentId &&
          baseComponentMap.has(component.componentId)
        ) {
          return baseComponentMap.get(component.componentId);
        }
        return component;
      });

      // 添加不存在的新原子组件
      const existingComponentIds = new Set(
        componentLibrary
          .filter(
            (component) => component.type === "atomic" && component.componentId
          )
          .map((component) => component.componentId)
      );

      baseLibrary.componentLibrary.forEach((component) => {
        if (
          component.type === "atomic" &&
          component.componentId &&
          !existingComponentIds.has(component.componentId)
        ) {
          updatedLibrary.push(component);
        }
      });

      return updatedLibrary;
    }
  } catch (error) {
    // 如果读取失败，返回原始组件库
    console.warn("Failed to load base-component-library.yaml:", error.message);
  }

  return componentLibrary;
};

export default async function loadComponentLibrary(input, options) {
  const { tmpDir, locale } = input;

  try {
    const middleFormatFiles = [];

    const middleFormatDir = join(tmpDir, locale);

    // 加载中间格式文件
    const files = await readdir(middleFormatDir);
    const yamlFiles = files.filter(
      (file) => file.endsWith(".yaml") && !file.startsWith("_")
    );

    for (const file of yamlFiles) {
      try {
        const filePath = join(middleFormatDir, file);
        const content = await readFile(filePath, "utf8");

        // 验证是中间格式文件（含有sections字段）
        const parsed = parse(content);
        if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
          middleFormatFiles.push({
            filePath: file,
            content: content,
          });
        }
      } catch (error) {
        // console.warn(
        //   `Failed to read middle format file ${file}:`,
        //   error.message
        // );
      }
    }

    // 计算当前 middleFormatFiles 的 hash
    const currentHash = calculateMiddleFormatHash(middleFormatFiles);

    let existingLibrary;
    // 检查是否存在缓存文件
    const componentLibraryPath = join(tmpDir, "component-library.yaml");

    let existingLibraryShouldRegenerate = true;
    let existingLibraryShouldParsed = true;
    try {
      await access(componentLibraryPath);

      // 读取已存在的组件库文件
      const existingContent = await readFile(componentLibraryPath, "utf8");
      existingLibrary = parse(existingContent);

      existingLibraryShouldRegenerate =
        !existingLibrary || existingLibrary?.hash !== currentHash;

      existingLibraryShouldParsed = !existingLibrary?.componentLibrary?.every(
        (item) => {
          return (
            (item.type === "atomic" && item.dataSourceTemplate) ||
            (item.type === "composite" && item.configTemplate)
          );
        }
      );

      if (!existingLibraryShouldRegenerate && !existingLibraryShouldParsed) {
        return {
          middleFormatFiles,
          componentLibrary: await formatComponentLibrary(
            existingLibrary.componentLibrary,
            tmpDir
          ),
        };
      }
    } catch (error) {
      // ignore error
      // throw error;
    }

    const allFieldCombinations = getAllFieldCombinations(middleFormatFiles);

    // 如果组件库有变化， 重新分析处理
    const analyzeTeamAgent = TeamAgent.from({
      name: "generateComponentLibraryTeam",
      skills: [
        existingLibraryShouldRegenerate &&
          options.context.agents["analyzeComponentPatterns"],
        existingLibraryShouldParsed &&
          options.context.agents["saveComponentLibrary"],
      ].filter(Boolean),
    });

    const analyzeResult = await options.context.invoke(analyzeTeamAgent, {
      ...input,
      middleFormatFiles,
      componentLibrary: existingLibrary?.componentLibrary,
      allFieldCombinations,
    });

    const generateTeamAgent = TeamAgent.from({
      name: "generateComponentLibraryTeam",
      skills: [
        options.context.agents["generateComponentLibrary"],
        options.context.agents["saveComponentLibrary"],
      ],
    });

    // @FIXME: 临时使用 OpenAI，后续需要改成 AIGNEHub
    const openaiModel = new OpenAIChatModel({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini", // Optional, defaults to "gpt-4o-mini"
    });

    const engine = new AIGNE({
      model: openaiModel,
    });

    // gemini model 的处理 output schema 的功能很差 400 [{"error":{"code":400,"message":"The specified schema produces a constraint that has too many states for serving. Typical causes of this error are schemas with lots of text (for example, very long property or enum names), schemas with long array length limits (especially when nested), or schemas using complex value matchers (for example, integers or numbers with minimum/maximum bounds or strings with complex formats like date-time)","status":"INVALID_ARGUMENT"}}])
    // 换成 gpt 处理
    const generateResult = await engine.invoke(generateTeamAgent, {
      ...input,
      middleFormatFiles,
      componentLibrary: analyzeResult?.componentLibrary,
      allFieldCombinations,
    });

    return {
      middleFormatFiles,
      componentLibrary: await formatComponentLibrary(
        generateResult.componentLibrary,
        tmpDir
      ),
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadComponentLibrary.taskTitle = "Loading component library";
