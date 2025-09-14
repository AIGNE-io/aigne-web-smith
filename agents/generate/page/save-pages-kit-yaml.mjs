import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { getFileName } from "../../utils/utils.mjs";

export default async function savePagesKitYaml(input) {
  const { path, pagesKitYaml, outputDir } = input;

  // 构建输出文件路径
  const flatName = path.replace(/^\//, "").replace(/\//g, "-");
  const fileFullName = getFileName({
    fileName: flatName,
  });

  const outputPath = join(outputDir, fileFullName);

  // ensure dir exists
  try {
    await mkdir(dirname(outputPath), { recursive: true });
  } catch (_error) {
    // ignore error
  }

  try {
    // 保存 Pages Kit 格式文件
    await writeFile(outputPath, pagesKitYaml, "utf8");

    return {
      ...input,
      pagesKitFilePath: outputPath,
      $message: `save pages kit format success ${outputPath}`,
    };
  } catch (error) {
    throw new Error(`save pages kit format failed ${outputPath}: ${error.message}`);
  }
}

savePagesKitYaml.taskTitle = "Save Pages Kit format for '{{ path }}'";
