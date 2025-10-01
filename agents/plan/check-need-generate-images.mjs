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

export default async function checkNeedGenerateImages(
  { needsAdditionalImages, imageRequirements = [], assetsContent = "", mediaFiles = [] },
  options,
) {
  // If no additional images are needed, exit early
  if (!needsAdditionalImages) {
    console.log(chalk.green("No additional images needed for the website"));
    return {
      imageGenerated: false,
      message: "No additional images needed",
    };
  }

  // If no specific image requirements provided, exit early
  if (!imageRequirements || imageRequirements.length === 0) {
    console.log(chalk.yellow("Images needed but no specific requirements provided"));
    return {
      imageGenerated: false,
      message: "Images needed but no requirements specified",
    };
  }

  console.log(
    chalk.blue(`Found ${imageRequirements.length} image(s) that could enhance your website`),
  );

  // Let user select which images to generate
  const selectedImages = await options.prompts.checkbox({
    message: "Select images to generate:",
    source: (term) => {
      const choices = imageRequirements.map((req) => ({
        name: req.imageName,
        description: req.imageDescription,
        value: req,
        disabled: false,
      }));

      if (!term) return choices;

      return choices.filter((choice) => choice.name.toLowerCase().includes(term.toLowerCase()));
    },
    validate: () => {
      // Allow empty selection (user can choose not to generate any images)
      return true;
    },
  });

  // If user didn't select any images, exit
  if (!selectedImages || selectedImages.length === 0) {
    return {
      imageGenerated: false,
      message: "User chose not to generate any images",
    };
  }

  try {
    // Invoke the image generation team with selected images
    const result = await options.context.invoke(options.context.agents["generateImageTeam"], {
      imageRequirements: selectedImages,
    });

    console.log(chalk.green(`Successfully generated ${selectedImages.length} image(s)`));

    // Process the result: copy images from temp directory to .aigne/web-smith/assets
    const assetsDir = path.join(process.cwd(), ".aigne", "web-smith", "assets");

    const processedImages = result?.imageRequirements
      ? await copyGeneratedImages(result.imageRequirements, assetsDir)
      : [];

    // Update assetsContent and mediaFiles with new images
    let updatedAssetsContent = assetsContent;
    const updatedMediaFiles = [...mediaFiles];

    if (processedImages.length > 0) {
      for (const processedImage of processedImages) {
        for (const image of processedImage.images) {
          const fileName = path.basename(image.path);
          const relativePath = path.relative(process.cwd(), image.path);

          // Read metadata from .md file
          let context = "";
          try {
            const mdContent = await readFile(image.metadataPath, "utf8");
            context = mdContent;
          } catch {
            // No metadata file
          }

          const mediaItem = {
            name: fileName,
            path: relativePath,
            type: getFileType(image.path),
            mediaKitPath: `${MEDIA_KIT_PROTOCOL}${fileName}`,
          };

          if (context) {
            mediaItem.context = context;
          }

          updatedMediaFiles.push(mediaItem);
        }
      }

      // Regenerate assetsContent
      if (updatedMediaFiles.length > 0) {
        updatedAssetsContent = "# Available Media Assets for Website\n\n";
        updatedAssetsContent += "```yaml\n";
        updatedAssetsContent += "assets:\n";

        updatedMediaFiles.forEach((asset) => {
          updatedAssetsContent += `  - name: "${asset.name}"\n`;
          updatedAssetsContent += `    path: "${asset.path}"\n`;
          updatedAssetsContent += `    type: "${asset.type}"\n`;
          updatedAssetsContent += `    mediaKitPath: "${asset.mediaKitPath}"\n`;
          if (asset.context) {
            const contextLines = asset.context
              .split("\n")
              .map((line) => `      ${line}`)
              .join("\n");
            updatedAssetsContent += `    context: |\n${contextLines}\n`;
          }
        });

        updatedAssetsContent += "```\n";
      }
    }

    return {
      imageGenerated: true,
      generatedImages: processedImages,
      assetsContent: updatedAssetsContent,
      mediaFiles: updatedMediaFiles,
      message: `Successfully generated ${selectedImages.length} images`,
    };
  } catch (error) {
    console.error(chalk.red(`Failed to generate images: ${error.message}`));
    return {
      imageGenerated: false,
      error: error.message,
      message: `Failed to generate images: ${error.message}`,
    };
  }
}

checkNeedGenerateImages.taskTitle = "Check if need to generate images and handle user selection";
