import { parse } from "yaml";
import {
  calculateMiddleFormatHash,
  getAllFieldCombinations,
  getComponentLibraryData,
} from "../../../utils/generate-helper.mjs";

const USING_BUILTIN_COMPONENT_LIBRARY = true;
export default async function analyzeComponentLibrary(input, options) {
  const {
    componentList,
    componentLibraryData,
    middleFormatFiles,
    tmpDir,
    builtinComponentLibrary,
  } = input;

  // using base builtin component library
  // @FIXME remove generate component library workflow
  if (USING_BUILTIN_COMPONENT_LIBRARY && builtinComponentLibrary?.length) {
    return {
      componentLibraryData: {
        hash: "mock-hash",
        componentLibrary: builtinComponentLibrary,
      },
      componentLibrary: builtinComponentLibrary,
    };
  }

  try {
    const hash = calculateMiddleFormatHash(middleFormatFiles);

    // hash 不一样，说明内容有变化，需要重新分析
    if (componentLibraryData?.hash !== hash) {
      const allFieldCombinations = getAllFieldCombinations(middleFormatFiles);

      // 通过中间格式生成组件库
      await options.context.invoke(
        options.context.agents["generateComponentLibrary"],
        {
          ...input,
          middleFormatContent: middleFormatFiles
            .map((item) => {
              const { content, filePath } = item;
              const parsedContent = parse(content);
              return `# sourceFile: ${filePath}
${JSON.stringify(parsedContent)}
          `;
            })
            .join("\n"),
          componentList: componentList
            .map((item) => {
              const { content } = item;
              const { id, name, description, schema } = content;
              return `# ${name}(${id}): ${description}
${JSON.stringify(schema)}
              `;
            })
            .join("\n"),
          allFieldCombinations: `${allFieldCombinations
            .map((item, _index) => `${JSON.stringify(item)}`)
            .join("\n")}`,
        },
        {
          ...options,
          streaming: false,
        },
      );
    }

    // 解析是否需要 Parse 组件库
    await options.context.invoke(
      options.context.agents["parseComponentLibrary"],
      {
        ...input,
      },
      {
        ...options,
        streaming: false,
      },
    );

    // 重新读取组件库，保证数据最新
    const newComponentLibraryData = getComponentLibraryData(tmpDir);

    return {
      componentLibraryData: newComponentLibraryData,
      componentLibrary: newComponentLibraryData.componentLibrary,
    };
  } catch (error) {
    throw new Error(`Failed to analyze component library: ${error.message}`);
  }
}

analyzeComponentLibrary.taskTitle = "Analyze component library need generate or parse";
