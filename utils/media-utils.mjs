import { readFile } from "node:fs/promises";
import path from "node:path";
import imageSize from "image-size";
import { MEDIA_KIT_PROTOCOL } from "./constants.mjs";
import { getFileType, getMimeType } from "./file-utils.mjs";

/**
 * Build a media item object with metadata
 * @param {string} filePath - Full path to the media file
 * @param {string} basePath - Base path for calculating relative path
 * @param {object} [options] - Optional configuration
 * @param {string} [options.metadataPath] - Path to metadata file
 * @param {number} [options.minImageWidth] - Minimum image width filter (returns null if below)
 * @returns {Promise<object|null>} Media item object or null if filtered out
 */
export async function buildMediaItem(filePath, basePath, options = {}) {
  const { metadataPath = null, minImageWidth = 0 } = options;
  const fileName = path.basename(filePath);
  const relativePath = path.relative(basePath, filePath);

  const mediaItem = {
    name: fileName,
    path: relativePath,
    type: getFileType(filePath),
    mediaKitPath: `${MEDIA_KIT_PROTOCOL}${fileName}`,
    mimeType: getMimeType(filePath),
  };

  // For image files, get dimensions
  if (mediaItem.type === "image") {
    try {
      const buffer = await readFile(filePath);
      const dimensions = imageSize(buffer);
      mediaItem.width = dimensions.width;
      mediaItem.height = dimensions.height;

      // Filter out images with width less than minImageWidth
      if (minImageWidth > 0 && dimensions.width < minImageWidth) {
        console.log(
          `Filtered image: ${fileName} (${dimensions.width}x${dimensions.height}px < ${minImageWidth}px minimum)`,
        );
        return null;
      }
    } catch (err) {
      console.warn(`⚠️  Failed to get dimensions for ${fileName}: ${err.message}`);
    }
  }

  // Read metadata/description if provided
  if (metadataPath) {
    try {
      const description = await readFile(metadataPath, "utf8");
      if (description) {
        mediaItem.description = description;
      }
    } catch {
      // No metadata file or failed to read
    }
  }

  return mediaItem;
}

/**
 * Generate YAML content for assets
 * @param {Array<object>} mediaFiles - Array of media file objects
 * @returns {string} YAML formatted assets content
 */
export function generateAssetsContent(mediaFiles) {
  if (!mediaFiles || mediaFiles.length === 0) {
    return "";
  }

  let content = "# Available Media Assets for Website\n\n";
  content += "```yaml\n";
  content += "assets:\n";

  mediaFiles.forEach((asset) => {
    content += `  - name: "${asset.name}"\n`;
    content += `    path: "${asset.path}"\n`;
    content += `    type: "${asset.type}"\n`;
    content += `    mediaKitPath: "${asset.mediaKitPath}"\n`;
    content += `    mimeType: "${asset.mimeType}"\n`;
    if (asset.width && asset.height) {
      content += `    width: ${asset.width}\n`;
      content += `    height: ${asset.height}\n`;
    }
    if (asset.description) {
      const descriptionLines = asset.description
        .split("\n")
        .map((line) => `      ${line}`)
        .join("\n");
      content += `    description: |\n${descriptionLines}\n`;
    }
  });

  content += "```\n";

  return content;
}
