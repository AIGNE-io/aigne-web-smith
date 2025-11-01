import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import {
  BUILTIN_COMPONENT_LIBRARY_NAME,
  COMPONENTS_DIR,
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_INCLUDE_PATTERNS,
} from "../../utils/constants.mjs";
import {
  isMediaFile,
  loadFilesFromSourcePaths,
  loadMediaFilesFromAssets,
} from "../../utils/file-utils.mjs";
import { propertiesToZodSchema, zodSchemaToJsonSchema } from "../../utils/generate-helper.mjs";
import { buildMediaItem } from "../../utils/media-utils.mjs";

const formatComponentContent = ({ content, moreContents = false }) => {
  const component = parse(content);

  if (component.properties && !component.properties._def) {
    // 基于属性结构生成 Zod Schema
    const zodSchema = propertiesToZodSchema(component.properties || {}, {
      // webSmith 的组件， 不需要检查是否需要生成， 默认都需要生成
      skipCheckNeedGenerate: true,
      llmConfig: component.llmConfig,
    });

    // 生成 JSON Schema 用于 AI 理解
    const jsonSchema = zodSchemaToJsonSchema(zodSchema);

    if (moreContents) {
      // propKeyToInfoMap, 用于映射属性key到id
      component.propKeyToInfoMap = {};
      Object.entries(component.properties || {}).forEach(([key, prop]) => {
        if (!prop.data) return;

        // 如果key未定义，使用id
        const propKey = prop.data.key || prop.data.id || key;
        const propId = prop.data.id;
        const type = prop.data.type;

        component.propKeyToInfoMap[propKey] = {
          id: propId,
          type,
          key: propKey,
        };
      });

      component.zodSchema = zodSchema;
    }

    // 添加元数据到组件中
    component.schema = jsonSchema;
  }

  if (!moreContents) {
    // 移除无用的信息
    delete component.renderer;
    delete component.llmConfig;
    delete component.properties;
    delete component.createdAt;
    delete component.updatedAt;
    delete component.version;
  }

  return component;
};

export default async function loadSources({
  sources = [],
  sourcesPath = [],
  includePatterns,
  excludePatterns,
  tmpDir,
  pagesDir,
  pagePath,
  projectId,
  useDefaultPatterns = true,
  media,
} = {}) {
  let files = Array.isArray(sources) ? [...sources] : [];
  const { minImageWidth } = media || { minImageWidth: 800 };

  if (sourcesPath) {
    const paths = Array.isArray(sourcesPath) ? sourcesPath : [sourcesPath];

    // @FIXME: 强制添加 components，后续需要修改为通过远程加载
    paths.push(path.join(import.meta.dirname, "../../", COMPONENTS_DIR));

    const allFiles = await loadFilesFromSourcePaths(paths, {
      includePatterns,
      excludePatterns,
      useDefaultPatterns,
      defaultIncludePatterns: DEFAULT_INCLUDE_PATTERNS,
      defaultExcludePatterns: DEFAULT_EXCLUDE_PATTERNS,
    });

    files = files.concat(allFiles);
  }

  files = [...new Set(files)];

  // Separate source files from media files
  const sourceFiles = [];
  const mediaFiles = [];
  const componentFiles = [];
  const moreContentsComponentFiles = [];
  const builtinComponentLibrary = [];
  let allSources = "";

  // Load generated media files from .aigne/web-smith/assets if exists
  const assetsDir = path.join(process.cwd(), ".aigne", "web-smith", "assets");
  const assetMediaFiles = await loadMediaFilesFromAssets(assetsDir);
  files.push(...assetMediaFiles);

  let filteredImageCount = 0;

  await Promise.all(
    files.map(async (file) => {
      if (isMediaFile(file)) {
        // This is a media file
        const mediaItem = await buildMediaItem(file, pagesDir, { minImageWidth });

        // If filtered out (null), skip
        if (!mediaItem) {
          filteredImageCount++;
          return;
        }

        mediaFiles.push(mediaItem);
      } else {
        // This is a source file
        const content = await readFile(file, "utf8");
        const relativePath = path.relative(process.cwd(), file);

        // if it is components, format it and enhance with structured data
        if (relativePath.includes(COMPONENTS_DIR)) {
          // ignore _component
          if (path.basename(file).startsWith("_")) {
            return;
          }

          // handle builtin-component-library.yaml separately
          if (path.basename(file) === BUILTIN_COMPONENT_LIBRARY_NAME) {
            const builtinComponentLibraryContent = parse(content);
            const { atomic, composite } = builtinComponentLibraryContent;
            atomic.forEach((item) => {
              builtinComponentLibrary.push({
                ...item,
                type: "atomic",
              });
            });
            composite.forEach((item) => {
              builtinComponentLibrary.push({
                ...item,
                type: "composite",
              });
            });
            return;
          }

          // componentFiles to ai
          const simpleContent = formatComponentContent({
            content,
          });

          componentFiles.push({
            sourceId: relativePath,
            content: simpleContent, // json content
          });

          // moreContentsComponentFiles to js sdk
          const moreContentsComponentFile = formatComponentContent({
            content,
            moreContents: true,
          });

          moreContentsComponentFiles.push({
            sourceId: relativePath,
            content: moreContentsComponentFile,
          });

          return;
        }

        allSources += `// sourceId: ${relativePath}\n${content}\n\n`;

        sourceFiles.push({
          sourceId: relativePath,
          content,
        });
      }
    }),
  );

  // Log summary of filtered images
  if (filteredImageCount > 0) {
    console.log(
      `\nTotal ${filteredImageCount} low-resolution image(s) filtered for better web display quality (minimum width: ${minImageWidth}px)\n`,
    );
  }

  // Get the last structure plan result
  const { loadWebsiteStructureResult } = await import("../../utils/pages-finder-utils.mjs");
  const originalWebsiteStructure = await loadWebsiteStructureResult(tmpDir);

  // Get the last output result of the specified path
  let content;
  if (pagePath) {
    let fileFullName;

    // First try direct path matching (original format)
    const flatName = pagePath.replace(/^\//, "").replace(/\//g, "-");
    fileFullName = `${flatName}.md`;
    let filePath = path.join(pagesDir, fileFullName);

    try {
      await access(filePath);
      content = await readFile(filePath, "utf8");
    } catch {
      // If not found and projectId is provided, try projectId-flattenedPath format
      if (projectId && pagePath.startsWith(`${projectId}-`)) {
        // Extract the flattened path part after projectId-
        const flattenedPath = pagePath.substring(projectId.length + 1);
        fileFullName = `${flattenedPath}.md`;
        filePath = path.join(pagesDir, fileFullName);

        try {
          await access(filePath);
          content = await readFile(filePath, "utf8");
        } catch {
          // The file does not exist, content remains undefined
        }
      }
    }
  }

  // Get git change detection data
  const modifiedFiles = [];

  // Count words and lines in allSources
  let totalWords = 0;
  let totalLines = 0;

  for (const source of Object.values(allSources)) {
    if (typeof source === "string") {
      // Count English words (simple regex for words containing a-zA-Z)
      const words = source.match(/[a-zA-Z]+/g) || [];
      totalWords += words.length;

      // Count lines (excluding empty lines)
      totalLines += source.split("\n").filter((line) => line.trim() !== "").length;
    }
  }

  const componentLibrary = builtinComponentLibrary;

  if (!componentLibrary.length) {
    throw new Error("❌ Component library is empty, please check the component library exists.");
  }

  const componentLibraryData = {
    hash: "mock-hash",
    componentLibrary,
  };

  return {
    datasourcesList: sourceFiles,
    datasources: allSources,
    componentList: componentFiles,
    moreContentsComponentList: moreContentsComponentFiles,
    componentLibrary,
    componentLibraryData,
    content,
    originalWebsiteStructure,
    files,
    modifiedFiles,
    totalWords,
    totalLines,
    mediaFiles,
  };
}

loadSources.input_schema = {
  type: "object",
  properties: {
    sources: {
      type: "array",
      items: { type: "string" },
      description: "Array of paths to the sources files",
    },
    sourcesPath: {
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description: "Directory or directories to recursively read files from",
    },
    includePatterns: {
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description: "Glob patterns to filter files by path or filename. If not set, include all.",
    },
    excludePatterns: {
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
      description: "Glob patterns to exclude files by path or filename. If not set, exclude none.",
    },
    useDefaultPatterns: {
      type: "boolean",
      description: "Whether to use default include/exclude patterns. Defaults to true.",
    },
    pagePath: {
      type: "string",
      description: "The page path to load content for",
    },
    projectId: {
      type: "string",
      description: "The project ID for projectId-flattenedPath format matching",
    },
    lastGitHead: {
      type: "string",
      description: "The git HEAD from last generation for change detection",
    },
    media: {
      minImageWidth: {
        type: "number",
        description: "Minimum image width in pixels to include",
      },
    },
  },
  required: [],
};

loadSources.output_schema = {
  type: "object",
  properties: {
    datasources: {
      type: "string",
    },
    datasourcesList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceId: { type: "string" },
          content: { type: "string" },
        },
      },
    },
    componentList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceId: { type: "string" },
          content: { type: "object" },
        },
      },
      description: "Array of simplified component definitions for AI",
    },
    moreContentsComponentList: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceId: { type: "string" },
          content: { type: "object" },
        },
      },
      description: "Array of full component definitions for JS SDK",
    },
    builtinComponentLibrary: {
      type: ["array", "null"],
      description: "Parsed base component library configuration",
    },
    files: {
      type: "array",
      items: { type: "string" },
      description: "Array of file paths that were loaded",
    },
    modifiedFiles: {
      type: "array",
      items: { type: "string" },
      description: "Array of modified files since last generation",
    },
    mediaFiles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          path: { type: "string" },
          type: { type: "string" },
          mediaKitPath: { type: "string" },
          height: { type: "number" },
          width: { type: "number" },
          mimeType: { type: "string" },
        },
      },
    },
  },
};

loadSources.task_render_mode = "hide";
