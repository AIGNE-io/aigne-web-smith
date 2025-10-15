import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";
import { getMediaDescriptionCachePath } from "../../utils/file-utils.mjs";

const SIZE_THRESHOLD = 10 * 1024 * 1024; // 10MB

// Supported MIME types for Gemini AI
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const SUPPORTED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/mpeg",
  "video/mov",
  "video/avi",
  "video/x-flv",
  "video/mpg",
  "video/webm",
  "video/wmv",
  "video/3gpp",
]);

/**
 * Calculate hash for a media file
 * For files < 10MB: use file content
 * For files >= 10MB: use path + size + mtime to avoid memory issues
 * @param {string} absolutePath - The absolute path to the media file
 * @returns {Promise<string>} - The hash of the file
 */
async function calculateMediaHash(absolutePath) {
  const stats = await stat(absolutePath);

  if (stats.size < SIZE_THRESHOLD) {
    // Small file: use full content
    const content = await readFile(absolutePath);
    return createHash("sha256").update(content).digest("hex");
  }

  // Large file: use path + size + mtime
  const hashInput = `${absolutePath}:${stats.size}:${stats.mtimeMs}`;
  return createHash("sha256").update(hashInput).digest("hex");
}

/**
 * Load description from same-named .md file
 * @param {string} mediaFilePath - Absolute path to media file
 * @returns {Promise<string|null>} - Description from .md file or null
 */
async function loadDescriptionFromMarkdown(mediaFilePath) {
  const baseName = path.parse(mediaFilePath).name;
  const mdFile = path.join(path.dirname(mediaFilePath), `${baseName}.md`);

  try {
    const mdContent = await readFile(mdFile, "utf8");
    return mdContent.trim();
  } catch {
    // No metadata file
    return null;
  }
}

/**
 * Load media descriptions from cache and generate new ones if needed
 * @param {Object} input - Input parameters
 * @param {Array} input.mediaFiles - Array of media file objects from load-sources
 * @param {string} input.pagesDir - Base directory for pages
 * @param {Object} options - Agent options
 * @returns {Promise<Object>} - Updated assetsContent with media descriptions
 */
export default async function loadMediaDescription(input, options) {
  const { mediaFiles = [], pagesDir } = input;

  // Filter to get image and video files with supported MIME types
  const mediaFilesToProcess = mediaFiles.filter((file) => {
    if (file.type === "image") {
      return SUPPORTED_IMAGE_TYPES.has(file.mimeType);
    }
    if (file.type === "video") {
      return SUPPORTED_VIDEO_TYPES.has(file.mimeType);
    }
    return false;
  });

  // Path to media description cache file - use WEB_SMITH_DIR to avoid pagesDir changes
  const cacheFilePath = getMediaDescriptionCachePath();

  // Load existing cache
  let cache = {};
  if (existsSync(cacheFilePath)) {
    try {
      const cacheContent = await readFile(cacheFilePath, "utf8");
      const parsedCache = parse(cacheContent);
      cache = parsedCache?.descriptions || {};
    } catch (error) {
      console.warn("Failed to read media description cache:", error.message);
    }
  }

  // Find media files without descriptions
  const mediaToDescribe = [];
  const mediaHashMap = new Map();
  const manualDescriptions = new Map();

  const absolutePagesDir = path.resolve(process.cwd(), pagesDir);

  // Only process media files that need AI description
  for (const mediaFile of mediaFilesToProcess) {
    // Convert relative path to absolute path for consistent hashing
    // mediaFiles.path is relative to pagesDir
    // First resolve pagesDir to absolute path, then join with media path
    const absolutePath = path.join(absolutePagesDir, mediaFile.path);
    const mediaHash = await calculateMediaHash(absolutePath);
    mediaHashMap.set(mediaFile.path, mediaHash);

    // Check for manual description from .md file
    const manualDesc = await loadDescriptionFromMarkdown(absolutePath);
    if (manualDesc) {
      manualDescriptions.set(mediaFile.path, manualDesc);
      // Skip AI description if manual description exists
      continue;
    }

    if (!cache[mediaHash]) {
      mediaToDescribe.push({
        ...mediaFile,
        hash: mediaHash,
        path: mediaFile.path,
        mediaFile: [
          {
            type: "local",
            path: absolutePath,
            filename: mediaFile.name,
            mimeType: mediaFile.mimeType,
          },
        ],
      });
    }
  }

  // Generate descriptions for media files without cache - use team agent for concurrent processing
  const newDescriptions = {};
  if (mediaToDescribe.length > 0) {
    try {
      // Use batch team agent for concurrent processing
      const results = await options.context.invoke(
        options.context.agents["batchGenerateMediaDescription"],
        {
          mediaToDescribe,
        },
      );

      // Process results - results is an array of individual results
      if (Array.isArray(results?.mediaToDescribe)) {
        for (const result of results.mediaToDescribe) {
          if (result?.hash && result?.description) {
            newDescriptions[result.hash] = {
              path: result.path,
              description: result.description,
              generatedAt: new Date().toISOString(),
            };
          }
        }
      }

      // Merge new descriptions into cache
      Object.assign(cache, newDescriptions);

      // Save updated cache
      await mkdir(path.dirname(cacheFilePath), { recursive: true });
      const cacheYaml = stringify({
        descriptions: cache,
        lastUpdated: new Date().toISOString(),
      });
      await writeFile(cacheFilePath, cacheYaml, "utf8");

      console.log(`Generated descriptions for ${Object.keys(newDescriptions).length} media files`);
    } catch (error) {
      console.error("Failed to generate media descriptions:", error.message);
    }
  }

  // Build enhanced assetsContent with descriptions
  let enhancedAssetsContent = "# Available Media Assets for Website\n\n";

  if (mediaFiles.length > 0) {
    enhancedAssetsContent += "```yaml\n";
    enhancedAssetsContent += "assets:\n";

    for (const asset of mediaFiles) {
      enhancedAssetsContent += `  - name: "${asset.name}"\n`;
      enhancedAssetsContent += `    path: "${asset.path}"\n`;
      enhancedAssetsContent += `    type: "${asset.type}"\n`;
      enhancedAssetsContent += `    mediaKitPath: "${asset.mediaKitPath}"\n`;

      // Add description for images and videos
      if (asset.type === "image" || asset.type === "video") {
        // Priority: manual description from .md file > AI generated description
        const manualDesc = manualDescriptions.get(asset.path);
        if (manualDesc) {
          const escapedDesc = manualDesc.replace(/"/g, '\\"').replace(/\n/g, "\\n");
          enhancedAssetsContent += `    description: "${escapedDesc}"\n`;
        } else {
          const mediaHash = mediaHashMap.get(asset.path);
          const cachedDesc = cache[mediaHash];
          if (cachedDesc?.description) {
            enhancedAssetsContent += `    description: "${cachedDesc.description}"\n`;
          }
        }
      }

      // Add dimensions for images and videos
      if (asset.width && asset.height) {
        enhancedAssetsContent += `    width: ${asset.width}\n`;
        enhancedAssetsContent += `    height: ${asset.height}\n`;
      }
    }

    enhancedAssetsContent += "```\n";
  }

  return {
    ...input,
    assetsContent: enhancedAssetsContent,
  };
}

loadMediaDescription.input_schema = {
  type: "object",
  properties: {
    mediaFiles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          path: { type: "string" },
          type: { type: "string" },
          mediaKitPath: { type: "string" },
          width: { type: "number" },
          height: { type: "number" },
          mimeType: { type: "string" },
        },
      },
      description: "Array of media file objects (images/videos)",
    },
    pagesDir: {
      type: "string",
      description: "Base directory for pages",
    },
  },
  required: ["mediaFiles", "pagesDir"],
};

loadMediaDescription.output_schema = {
  type: "object",
  properties: {
    assetsContent: {
      type: "string",
      description: "Enhanced assets content with media descriptions",
    },
  },
};
