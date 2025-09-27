import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import {
  BUILTIN_COMPONENT_LIBRARY_NAME,
  COMPONENTS_DIR,
  DEFAULT_EXCLUDE_PATTERNS,
  DEFAULT_INCLUDE_PATTERNS,
  MEDIA_KIT_PROTOCOL,
} from "../../utils/constants.mjs";
import { getFilesWithGlob, loadGitignore } from "../../utils/file-utils.mjs";
import { propertiesToZodSchema, zodSchemaToJsonSchema } from "../../utils/generate-helper.mjs";
import {
  getCurrentGitHead,
  getModifiedFilesBetweenCommits,
  isGlobPattern,
} from "../../utils/utils.mjs";

const getFileType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return "media";
};

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
  lastGitHead,
} = {}) {
  let files = Array.isArray(sources) ? [...sources] : [];

  if (sourcesPath) {
    const paths = Array.isArray(sourcesPath) ? sourcesPath : [sourcesPath];

    // @FIXME: 强制添加 components，后续需要修改为通过远程加载
    paths.push(path.join(import.meta.dirname, "../../", COMPONENTS_DIR));

    let allFiles = [];

    for (const dir of paths) {
      try {
        if (typeof dir !== "string") {
          console.warn(`Invalid source path: ${dir}`);
          continue;
        }

        // First try to access as a file or directory
        const stats = await stat(dir);

        if (stats.isFile()) {
          // If it's a file, add it directly without filtering
          allFiles.push(dir);
        } else if (stats.isDirectory()) {
          // If it's a directory, use the existing glob logic
          // Load .gitignore for this directory
          const gitignorePatterns = await loadGitignore(dir);

          // Prepare patterns
          let finalIncludePatterns = null;
          let finalExcludePatterns = null;

          if (useDefaultPatterns) {
            // Merge with default patterns
            const userInclude = includePatterns
              ? Array.isArray(includePatterns)
                ? includePatterns
                : [includePatterns]
              : [];
            const userExclude = excludePatterns
              ? Array.isArray(excludePatterns)
                ? excludePatterns
                : [excludePatterns]
              : [];

            finalIncludePatterns = [...DEFAULT_INCLUDE_PATTERNS, ...userInclude];
            finalExcludePatterns = [...DEFAULT_EXCLUDE_PATTERNS, ...userExclude];
          } else {
            // Use only user patterns
            if (includePatterns) {
              finalIncludePatterns = Array.isArray(includePatterns)
                ? includePatterns
                : [includePatterns];
            }
            if (excludePatterns) {
              finalExcludePatterns = Array.isArray(excludePatterns)
                ? excludePatterns
                : [excludePatterns];
            }
          }

          // Get files using glob
          const filesInDir = await getFilesWithGlob(
            dir,
            finalIncludePatterns,
            finalExcludePatterns,
            gitignorePatterns,
          );
          allFiles = allFiles.concat(filesInDir);
        }
      } catch (err) {
        if (err.code === "ENOENT") {
          // Path doesn't exist as file or directory, try as glob pattern
          try {
            // Check if it looks like a glob pattern
            const isGlobPatternResult = isGlobPattern(dir);

            if (isGlobPatternResult) {
              // Use glob to find matching files from current working directory
              const { glob } = await import("glob");
              const matchedFiles = await glob(dir, {
                absolute: true,
                nodir: true, // Only files, not directories
                dot: false, // Don't include hidden files
              });

              if (matchedFiles.length > 0) {
                allFiles = allFiles.concat(matchedFiles);
              }
            }
          } catch (globErr) {
            console.warn(`Failed to process glob pattern "${dir}": ${globErr.message}`);
          }
        } else {
          throw err;
        }
      }
    }

    files = files.concat(allFiles);
  }

  files = [...new Set(files)];

  // Define media file extensions
  const mediaExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".mp4",
    ".mov",
    ".avi",
    ".mkv",
    ".webm",
    ".m4v",
  ];

  // Separate source files from media files
  const sourceFiles = [];
  const mediaFiles = [];
  const componentFiles = [];
  const moreContentsComponentFiles = [];
  const builtinComponentLibrary = [];
  let allSources = "";

  await Promise.all(
    files.map(async (file) => {
      const ext = path.extname(file).toLowerCase();

      if (mediaExtensions.includes(ext)) {
        // This is a media file
        const relativePath = path.relative(pagesDir, file);
        const fileName = path.basename(file);
        const description = path.parse(fileName).name;

        mediaFiles.push({
          name: fileName,
          path: relativePath,
          type: getFileType(relativePath),
          mediaKitPath: `${MEDIA_KIT_PROTOCOL}${fileName}`,
          description,
        });
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

  // Get the last structure plan result
  let originalWebsiteStructure;
  const websiteStructurePath = path.join(tmpDir, "website-structure.yaml");
  try {
    await access(websiteStructurePath);
    const websiteStructureResult = await readFile(websiteStructurePath, "utf8");
    if (websiteStructureResult) {
      try {
        originalWebsiteStructure = parse(websiteStructureResult);
      } catch (err) {
        console.error(`Failed to parse website-structure.yaml: ${err.message}`);
      }
    }
  } catch {
    // The file does not exist, originalWebsiteStructure remains undefined
  }

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
  let modifiedFiles = [];
  let currentGitHead = null;

  if (lastGitHead) {
    try {
      currentGitHead = getCurrentGitHead();
      if (currentGitHead && currentGitHead !== lastGitHead) {
        modifiedFiles = getModifiedFilesBetweenCommits(lastGitHead, currentGitHead);
        console.log(`Detected ${modifiedFiles.length} modified files since last generation`);
      }
    } catch (error) {
      console.warn("Failed to detect git changes:", error.message);
    }
  }

  // Generate assets content from media files
  let assetsContent = "# Available Media Assets for Website\n\n";

  if (mediaFiles.length > 0) {
    // Helper function to determine file type from extension

    const mediaYaml = mediaFiles;

    assetsContent += "```yaml\n";
    assetsContent += "assets:\n";
    mediaYaml.forEach((asset) => {
      assetsContent += `  - name: "${asset.name}"\n`;
      assetsContent += `    path: "${asset.path}"\n`;
      assetsContent += `    type: "${asset.type}"\n`;
      assetsContent += `    mediaKitPath: "${asset.mediaKitPath}"\n`;
    });
    assetsContent += "```\n";
  }

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

  return {
    datasourcesList: sourceFiles,
    datasources: allSources,
    componentList: componentFiles,
    moreContentsComponentList: moreContentsComponentFiles,
    builtinComponentLibrary,
    content,
    originalWebsiteStructure,
    files,
    modifiedFiles,
    totalWords,
    totalLines,
    assetsContent,
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
    assetsContent: {
      type: "string",
      description: "Markdown content for available media assets",
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
        },
      },
    },
  },
};

loadSources.task_render_mode = "hide";
