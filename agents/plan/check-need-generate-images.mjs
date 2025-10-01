import path from "node:path";
import chalk from "chalk";
import { copyGeneratedImages } from "../../utils/file-utils.mjs";

export default async function checkNeedGenerateImages(
  { needsAdditionalImages, imageRequirements = [] },
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
        name: `${req.imageName} - ${req.imageDescription} (${req.priority} priority)`,
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

    return {
      imageGenerated: true,
      generatedImages: processedImages,
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
