import path from "node:path";
import chalk from "chalk";
import { copyGeneratedImages, getCoverImagePath } from "../../../utils/file-utils.mjs";

export default async function saveCover({ aiPrompt, ...coverImageData }) {
  // Check if image was generated
  if (!coverImageData || !coverImageData.images || coverImageData.images.length === 0) {
    return {
      message: "No cover image was generated to save",
    };
  }

  try {
    // Define cover directory path
    const coverPath = getCoverImagePath();
    const coverDir = path.dirname(coverPath);

    // Prepare image requirement for single cover image
    const imageRequirement = {
      imageName: "cover",
      ...coverImageData,
    };

    // Copy image from temp directory to cover directory
    const processedImages = await copyGeneratedImages([imageRequirement], coverDir);

    if (
      processedImages.length === 0 ||
      !processedImages[0].images ||
      processedImages[0].images.length === 0
    ) {
      console.log(chalk.yellow("No cover image was successfully saved"));
      return {
        message: "Failed to save cover image: No valid images were processed",
      };
    }

    const message = "Cover image has been successfully generated and saved to website assets";

    return {
      message,
    };
  } catch (error) {
    const errorMessage = `Failed to save cover image: ${error.message}`;
    console.error(chalk.red(errorMessage));
    return {
      message: errorMessage,
      error: error.message,
    };
  }
}

saveCover.taskTitle = "Save generated cover image";
saveCover.taskRenderMode = "hide";
