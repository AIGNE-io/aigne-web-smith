import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { TeamAgent } from "@aigne/core";

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
        // 忽略读取错误的文件
      }
    }

    // 生成组件库
    const analyzeAndGenerateComponentLibraryTeamAgent = TeamAgent.from({
      name: "analyzeAndGenerateComponentLibraryTeam",
      skills: [options.context.agents["analyzeAndGenerateComponentLibrary"]],
    });

    // 传入 middleFormatFiles 直接生成组件库
    const generateResult = await options.context.invoke(
      analyzeAndGenerateComponentLibraryTeamAgent,
      {
        ...input,
        middleFormatFiles,
      }
      // options
    );

    return {
      middleFormatFiles,
      componentLibraryMap: generateResult.componentLibraryMap,
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadComponentLibrary.taskTitle = "Loading component library";
