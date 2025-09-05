import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { stringify } from "yaml";
import { calculateMiddleFormatHash } from "../../sdk/hash-utils.mjs";

/**
 * 保存组件库定义到文件
 * @param {Object} input
 * @param {Object} input.componentLibrary - 组件库定义
 * @param {string} [input.outputDir] - 输出目录
 * @returns {Promise<Object>}
 */
export default async function saveComponentLibrary({
  componentLibrary,
  middleFormatFiles,
  outputDir,
}) {
  try {
    // 确保输出目录存在
    await mkdir(outputDir, { recursive: true });

    const timestamp = new Date().toISOString();

    // 计算 middleFormatFiles 的 hash
    const middleFormatHash = calculateMiddleFormatHash(middleFormatFiles);

    // 添加时间戳和 hash 到组件库定义
    const finalComponentLibrary = {
      generatedAt: timestamp,
      hash: middleFormatHash,
      componentLibrary,
    };

    // 保存组件库定义
    const componentLibraryPath = join(outputDir, "component-library.yaml");
    await writeFile(
      componentLibraryPath,
      stringify(finalComponentLibrary),
      "utf8"
    );

    return {
      componentLibraryPath,
      componentLibrary: finalComponentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to save component library: ${error.message}`);
  }
}

saveComponentLibrary.taskTitle = "Saving component library definition";
