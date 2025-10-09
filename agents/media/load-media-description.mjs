import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse, stringify } from "yaml";
import { WEB_SMITH_DIR } from "../../utils/constants.mjs";

/**
 * Calculate hash for a media file using absolute path
 * @param {string} absolutePath - The absolute path to the media file
 * @returns {string} - The hash of the file path
 */
function calculateMediaHash(absolutePath) {
  return createHash("sha256").update(absolutePath).digest("hex");
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

  // Filter to get image and video files
  const mediaFilesToProcess = mediaFiles.filter((file) => file.type === "image" || file.type === "video");

  if (mediaFilesToProcess.length === 0) {
    return {};
  }

  // Path to media description cache file - use WEB_SMITH_DIR to avoid pagesDir changes
  const cacheFilePath = path.join(process.cwd(), WEB_SMITH_DIR, "media-description.yaml");

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

  for (const mediaFile of mediaFilesToProcess) {
    // Convert relative path to absolute path for consistent hashing
    // mediaFiles.path is relative to pagesDir
    // First resolve pagesDir to absolute path, then join with media path
    const absolutePagesDir = path.resolve(process.cwd(), pagesDir);
    const absolutePath = path.join(absolutePagesDir, mediaFile.path);
    const mediaHash = calculateMediaHash(absolutePath);
    mediaHashMap.set(mediaFile.path, mediaHash);

    if (!cache[mediaHash]) {
      mediaToDescribe.push({
        ...mediaFile,
        hash: mediaHash,
        path: mediaFile.path,
        mediaFile: [{
          type: 'local',
          path: absolutePath,
          filename: mediaFile.name,
          mimeType: mediaFile.mimeType,
        }]
      });
    }
  }
  // Generate descriptions for media files without cache - use team agent for concurrent processing
  const newDescriptions = {};
  if (mediaToDescribe.length > 0) {
    try {
      const descAgent =  options.context.agents["generateMediaDescription"];
      descAgent.inputFileKey = "mediaFile";
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
        const mediaHash = mediaHashMap.get(asset.path);
        const cachedDesc = cache[mediaHash];
        if (cachedDesc?.description) {
          enhancedAssetsContent += `    description: "${cachedDesc.description}"\n`;
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

