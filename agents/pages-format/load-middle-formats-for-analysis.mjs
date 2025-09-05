import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { calculateMiddleFormatHash } from "../../sdk/hash-utils.mjs";
import { TeamAgent } from "@aigne/core";

/**
 * 加载所有中间格式文件用于组件模式分析
 * @param {Object} input
 * @param {string} input.pagesDir - pages目录路径
 * @param {string} [input.outputDir] - 输出目录路径，用于检查缓存
 * @returns {Promise<Object>}
 */
export default async function loadMiddleFormatsForAnalysis({
  pagesDir,
  componentList,
  outputDir = "./aigne-pages/analysis",
}) {
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
        console.warn(
          `Failed to read middle format file ${file}:`,
          error.message
        );
      }
    }

    // 计算当前 middleFormatFiles 的 hash
    const currentHash = calculateMiddleFormatHash(middleFormatFiles);

    // 检查是否存在缓存文件
    const componentLibraryPath = join(outputDir, "component-library.yaml");
    try {
      await access(componentLibraryPath);

      // 读取已存在的组件库文件
      const existingContent = await readFile(componentLibraryPath, "utf8");
      const existingLibrary = parse(existingContent);

      // 检查 hash 是否匹配
      if (existingLibrary && existingLibrary.hash === currentHash) {
        const teamAgent = TeamAgent.from({
          name: "generateComponentLibrary",
          skills: [options.context.agents["generateComponentLibrary"]],
        });

        const result = await options.context.invoke(teamAgent, {
          componentLibraryPath: componentLibraryPath,
          componentLibrary: {
            componentLibrary: existingLibrary.componentLibrary,
          },
          middleFormatFiles,
        });

        return result;
      }
    } catch (error) {
      // ignore error
    }

    return {
      middleFormatFiles,
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadMiddleFormatsForAnalysis.taskTitle =
  "Loading middle format files for component analysis";
