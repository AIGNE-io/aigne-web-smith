import { readFile } from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { MEDIA_KIT_PROTOCOL } from "../../utils/constants.mjs";
import { copyGeneratedImages } from "../../utils/file-utils.mjs";

const getFileType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];
  const videoExts = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];

  if (imageExts.includes(ext)) return "image";
  if (videoExts.includes(ext)) return "video";
  return "media";
};

export default async function saveImages({ imageRequirements = [] }) {
  // If no images to save, exit early
  if (!imageRequirements || imageRequirements.length === 0) {
    return {
      message: "No images generated, nothing to save",
    };
  }

  try {
    // Define assets directory path
    const assetsDir = path.join(process.cwd(), ".aigne", "web-smith", "assets");

    // Copy images from temp directory to assets directory
    const processedImages = await copyGeneratedImages(imageRequirements, assetsDir);

    if (processedImages.length === 0) {
      console.log(chalk.yellow("No images were successfully saved"));
      return {
        message: "Failed to save any images",
      };
    }

    // Build assets content in YAML format (similar to load-sources.mjs)
    let message = `# Newly Available Media Assets for Website\n\n`;
    message += "```yaml\n";
    message += "savedImages:\n";

    for (const processedImage of processedImages) {
      for (const image of processedImage.images) {
        const fileName = path.basename(image.path);
        const relativePath = path.relative(process.cwd(), image.path);

        // Read context from metadata file
        let context = "";
        try {
          const mdContent = await readFile(image.metadataPath, "utf8");
          context = mdContent;
        } catch {
          // No metadata file
        }

        message += `  - name: "${fileName}"\n`;
        message += `    path: "${relativePath}"\n`;
        message += `    type: "${getFileType(image.path)}"\n`;
        message += `    mediaKitPath: "${MEDIA_KIT_PROTOCOL}${fileName}"\n`;

        if (context) {
          const contextLines = context
            .split("\n")
            .map((line) => `      ${line}`)
            .join("\n");
          message += `    context: |\n${contextLines}\n`;
        }
      }
    }

    message += "```\n";

    return {
      message,
    };
  } catch (error) {
    const errorMessage = `Failed to save images: ${error.message}`;
    console.error(chalk.red(errorMessage));
    return {
      message: errorMessage,
      error: error.message,
    };
  }
}

saveImages.taskTitle = "Save generated images to assets directory";
saveImages.taskRenderMode = "hide";
