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
 * @param {string} [input.outputDir] - 输出目录路径，用于检查缓存
 * @returns {Promise<Object>}
 */
export default async function loadMiddleFormatsForAnalysis(input, options) {
  const { pagesDir, outputDir } = input;

  try {
    const middleFormatFiles = [];

    // 加载中间格式文件
    const files = await readdir(pagesDir);
    const yamlFiles = files.filter(
      (file) => file.endsWith(".yaml") && !file.startsWith("_")
    );

    for (const file of yamlFiles) {
      try {
        const filePath = join(pagesDir, file);
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
    const componentLibraryPath = join(outputDir, "component-library.yaml");

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
          componentLibrary: existingLibrary.componentLibrary,
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
      componentLibrary: generateResult.componentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadMiddleFormatsForAnalysis.taskTitle =
  "Loading middle format files for component analysis";
