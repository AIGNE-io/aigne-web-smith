import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stringify } from "yaml";

import { calculateMiddleFormatHash, generateRandomId, getComponentLibraryDir } from "./sdk.mjs";

/**
 * 保存组件库定义到文件
 * @param {Object} input
 * @param {Object} input.componentLibrary - 组件库定义
 * @param {string} [input.tmpDir] - 输出目录
 * @returns {Promise<Object>}
 */
export default async function saveComponentLibrary({
  componentLibrary: _componentLibrary,
  middleFormatFiles,
  tmpDir,
  filePath,
}) {
  try {
    const componentLibraryDir = getComponentLibraryDir(tmpDir);

    await mkdir(componentLibraryDir, { recursive: true });

    const timestamp = new Date().toISOString();

    const componentLibraryPath = join(componentLibraryDir, filePath);

    // 检查文件是否存在
    let fileExists = false;
    try {
      await access(componentLibraryPath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    // 计算 middleFormatFiles 的 hash
    const middleFormatHash = calculateMiddleFormatHash(middleFormatFiles);

    const componentLibrary = _componentLibrary?.map((item) => {
      if (item.type === "composite") {
        return {
          ...item,
          // 如果组件没有ID，或者是第一次生成，则生成随机ID
          componentId: !item.componentId || !fileExists ? generateRandomId() : item.componentId,
        };
      }
      return item;
    });

    // 添加时间戳和 hash 到组件库定义
    const finalComponentLibrary = {
      generatedAt: timestamp,
      hash: middleFormatHash,
      componentLibrary,
    };

    // 保存组件库定义

    await writeFile(
      componentLibraryPath,
      stringify(finalComponentLibrary, {
        aliasDuplicateObjects: false, // 禁用锚点和别名
      }),
      "utf8",
    );

    return {
      componentLibrary: componentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to save component library: ${error.message}`);
  }
}

saveComponentLibrary.taskTitle = "Saving component library definition";
