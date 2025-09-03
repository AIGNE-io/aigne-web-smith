import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getFileName } from "../../utils/utils.mjs";

export default async function savePagesKitFormat(input) {
  const { path, locale, pagesDir, pagesKitYaml, conversionNotes } = input;

  // 构建输出文件路径
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({
    locale,
    fileName: `@pages-kit-${flatName}`,
  });
  const outputPath = join(pagesDir, fileFullName);

  try {
    // 保存 Pages Kit 格式文件
    await writeFile(outputPath, pagesKitYaml, "utf8");

    return {
      ...input,
      pagesKitFilePath: outputPath,
      $message: `save pages kit format success ${outputPath}\n\nconversion notes: ${conversionNotes}`,
    };
  } catch (error) {
    throw new Error(
      `save pages kit format failed ${outputPath}: ${error.message}`
    );
  }
}

savePagesKitFormat.taskTitle = "Save Pages Kit format for '{{ path }}'";
