import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";
import { calculateMiddleFormatHash } from "../../sdk/hash-utils.mjs";
import { TeamAgent } from "@aigne/core";
import { getAllFieldCombinations } from "./sdk.mjs";

// 格式化组件库，合并 base-component-library.yaml 的内容
const formatComponentLibrary = async (componentLibrary, tmpDir) => {
  try {
    const baseLibraryPath = join(tmpDir, "base-component-library.yaml");
    const baseLibraryContent = await readFile(baseLibraryPath, "utf8");
    const baseLibrary = parse(baseLibraryContent);

    if (
      baseLibrary &&
      baseLibrary.componentLibrary &&
      Array.isArray(baseLibrary.componentLibrary)
    ) {
      // 创建一个 componentId 到基础组件的映射
      const baseComponentMap = new Map();
      baseLibrary.componentLibrary.forEach((component) => {
        if (component.type === "atomic" && component.componentId) {
          baseComponentMap.set(component.componentId, component);
        }
      });

      // 处理新格式的组件库
      let atomicComponents = componentLibrary.atomic || [];
      let compositeComponents = componentLibrary.composite || [];

      // 替换现有组件库中的原子组件
      const updatedAtomicComponents = atomicComponents.map((component) => {
        if (
          component.componentId &&
          baseComponentMap.has(component.componentId)
        ) {
          return baseComponentMap.get(component.componentId);
        }
        return component;
      });

      // 添加不存在的新原子组件
      const existingComponentIds = new Set(
        atomicComponents
          .map((component) => component.componentId)
          .filter(Boolean)
      );

      baseLibrary.componentLibrary.forEach((component) => {
        if (
          component.type === "atomic" &&
          component.componentId &&
          !existingComponentIds.has(component.componentId)
        ) {
          updatedAtomicComponents.push(component);
        }
      });

      return {
        atomic: updatedAtomicComponents,
        composite: compositeComponents,
      };
    }
  } catch (error) {
    // 如果读取失败，返回原始组件库
    console.warn("Failed to load base-component-library.yaml:", error.message);
  }

  return componentLibrary;
};

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

    // 计算当前 middleFormatFiles 的 hash
    const currentHash = calculateMiddleFormatHash(middleFormatFiles);

    // 检查是否存在缓存文件
    const componentLibraryPath = join(tmpDir, "component-library.yaml");
    let existingLibrary;
    let shouldRegenerate = true;

    try {
      await access(componentLibraryPath);
      const existingContent = await readFile(componentLibraryPath, "utf8");
      existingLibrary = parse(existingContent);

      // 检查 hash 是否匹配
      shouldRegenerate =
        !existingLibrary || existingLibrary?.hash !== currentHash;

      // 检查组件是否需要重新解析（是否有完整的模板）
      if (!shouldRegenerate && existingLibrary?.componentLibrary) {
        const { atomic = [], composite = [] } =
          existingLibrary.componentLibrary;
        const allComponents = [...atomic, ...composite];

        const needsParsing = allComponents.some(
          (item) =>
            (item.type === "atomic" && !item.dataSourceTemplate) ||
            (item.type === "composite" && !item.configTemplate)
        );

        if (!needsParsing) {
          // 缓存有效，直接返回
          return {
            middleFormatFiles,
            componentLibrary: await formatComponentLibrary(
              existingLibrary.componentLibrary,
              tmpDir
            ),
          };
        }
      }
    } catch (error) {
      // 缓存文件不存在或读取失败，需要重新生成
    }

    // 生成组件库
    const generateTeamAgent = TeamAgent.from({
      name: "generateComponentLibraryTeam",
      skills: [
        options.context.agents["generateComponentLibrary"],
        options.context.agents["saveComponentLibrary"],
      ],
    });

    // 传入 middleFormatFiles 直接生成组件库
    const generateResult = await options.context.invoke(generateTeamAgent, {
      ...input,
      middleFormatFiles,
    });

    return {
      middleFormatFiles,
      componentLibrary: await formatComponentLibrary(
        generateResult.componentLibrary,
        tmpDir
      ),
    };
  } catch (error) {
    throw new Error(`Failed to load middle format files: ${error.message}`);
  }
}

loadComponentLibrary.taskTitle = "Loading component library";
