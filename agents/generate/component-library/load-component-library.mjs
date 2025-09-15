import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { getComponentLibraryData } from "../../utils/generate-helper.mjs";

export default async function loadComponentLibrary(input) {
  const { tmpDir, locale } = input;

  try {
    const middleFormatFiles = [];
    const middleFormatDir = join(tmpDir, locale);

    // 加载中间格式文件
    const files = await readdir(middleFormatDir);
    const yamlFiles = files.filter((file) => file.endsWith(".yaml") && !file.startsWith("_"));

    for (const file of yamlFiles) {
      try {
        const filePath = join(middleFormatDir, file);
        const content = await readFile(filePath, "utf8");

        // 验证是中间格式文件（含有sections字段）
        const parsed = parse(content);
        if (parsed?.sections && Array.isArray(parsed.sections)) {
          middleFormatFiles.push({
            filePath: file,
            content: content,
          });
        }
      } catch (_error) {
        // 忽略读取错误的文件
      }
    }

    const componentLibraryData = getComponentLibraryData(tmpDir);

    return {
      middleFormatFiles,
      componentLibraryData,
      componentLibrary: componentLibraryData?.componentLibrary || [],
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadComponentLibrary.taskTitle = "Load component library";
