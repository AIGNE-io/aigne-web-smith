import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getFileName } from "../../utils/utils.mjs";

export default async function loadMiddleFormat(input) {
  const { path, locale, pagesDir } = input;

  // 构建中间格式文件路径
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({ locale, fileName: flatName });
  const filePath = join(pagesDir, fileFullName);

  try {
    // 读取中间格式文件内容
    const middleFormatContent = await readFile(filePath, "utf8");

    return {
      ...input,
      middleFormatContent,
      middleFormatFilePath: filePath,
      $message: `load middle format success ${filePath}`,
    };
  } catch (error) {
    throw new Error(`load middle format failed ${filePath}: ${error.message}`);
  }
}

loadMiddleFormat.taskTitle = "Load middle format for '{{ path }}'";
