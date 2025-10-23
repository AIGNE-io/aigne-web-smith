import { readFile } from "node:fs/promises";
import path from "node:path";
import { MEDIA_KIT_PROTOCOL } from "../../../utils/constants.mjs";
import { copyGeneratedImages, getFileType } from "../../../utils/file-utils.mjs";

/**
 * Beautify application screenshots with enhanced visual presentation.
 *
 * This tool transforms raw application screenshots into polished, visually appealing images
 * suitable for website presentation. It enhances screenshots while maintaining their original
 * content, making them more engaging for website visitors.
 *
 * The beautified images are saved to the assets/screenshot directory with a '-beautified' suffix,
 * and should be preferred over original screenshots when building page content.
 */
export default async function beautifyScreenshot(
  { imageRequirements = [], mediaFiles = [], pagesDir },
  options,
) {
  // If no images to save, exit early
  if (!imageRequirements || imageRequirements.length === 0) {
    return {
      message: "No images to beautify, nothing to save",
    };
  }

  // Prepare images for batch processing
  const imagesToBeautify = [];

  for (const requirement of imageRequirements) {
    // Find the image in mediaFiles by mediaKitPath
    const mediaFile = mediaFiles.find((file) => file.mediaKitPath === requirement.mediaKitPath);

    if (!mediaFile) {
      console.warn(`Image not found for mediaKitPath: ${requirement.mediaKitPath}`);
      continue;
    }
    const absolutePath = path.resolve(process.cwd(), pagesDir, mediaFile.path);

    imagesToBeautify.push({
      mediaFile: [
        {
          type: "local",
          path: absolutePath,
          filename: mediaFile.name,
          mimeType: mediaFile.mimeType,
        },
      ],
      imagePrompt:
        "Using the provided image, place the provided user interface screenshot on a gradient background. Ensure that the features of the user interface screenshot remain completely unchanged. The added background should be generated using random gradient colors inspired by these color pairs (#EBEFFD, #F9F8FF) and (#FCEFF0, #FEFBF1). Make sure that the longer side of the user screenshot is no more than 24px away from the edge of the background.",
    });
  }

  if (imagesToBeautify.length === 0) {
    return {
      message: "No valid images found to beautify",
    };
  }

  // Call generateWithImage agent with the array of images
  const { mediaFiles: results } = await options.context.invoke(options.context.agents["batchGenerateWithImage"], {
    mediaFiles: imagesToBeautify,
  });

  if (results.length === 0) {
    return {
      message: "No images were beautified",
    };
  }

  // Prepare data for copying images (merge imageRequirements with AI generated image results)
  const imagesToCopy = results.map((result, index) => {
    const originalName = imageRequirements[index].imageName;
    // Add suffix to avoid duplicate filenames
    const beautifiedName = `${originalName}-beautified`;

    return {
      imageName: beautifiedName,
      imageDescription: `Beautified version of the application screenshot "${originalName}". This image displays the original screenshot with enhanced visual presentation. When using application screenshots, prefer this beautified version for better visual appeal.`,
      images: result.images,
    };
  });

  // Define assets/screenshot directory path
  const screenshotDir = path.join(process.cwd(), ".aigne", "web-smith", "assets", "screenshot");

  // Copy images from temp directory to assets/screenshot directory
  const processedImages = await copyGeneratedImages(imagesToCopy, screenshotDir);

  if (processedImages.length === 0) {
    return {
      message: "Images were beautified but failed to save",
    };
  }

  // Build assets content in YAML format
  let message = `# Beautified Application Screenshots\n\n`;
  message += `These are beautified versions of application screenshots with enhanced visual presentation.\n`;
  message += `**Important**: When using application screenshots in your website, prefer these beautified versions over the original screenshots.\n\n`;
  message += "```yaml\n";
  message += "beautifiedScreenshots:\n";

  for (const processedImage of processedImages) {
    for (const image of processedImage.images) {
      const fileName = path.basename(image.path);
      const relativePath = path.relative(process.cwd(), image.path);

      // Read context from metadata file
      let description = "";
      try {
        const mdContent = await readFile(image.metadataPath, "utf8");
        description = mdContent;
      } catch {
        // No metadata file
      }

      message += `  - name: "${fileName}"\n`;
      message += `    path: "${relativePath}"\n`;
      message += `    type: "${getFileType(image.path)}"\n`;
      message += `    mediaKitPath: "${MEDIA_KIT_PROTOCOL}${fileName}"\n`;

      if (description) {
        const descriptionLines = description
          .split("\n")
          .map((line) => `      ${line}`)
          .join("\n");
        message += `    description: |\n${descriptionLines}\n`;
      }
    }
  }

  message += "```\n";

  return {
    message,
  };
}

beautifyScreenshot.description =
  "Beautify application screenshots with enhanced visual presentation. Transforms raw screenshots into polished, visually appealing images suitable for website use. Beautified images are saved with '-beautified' suffix and should be preferred over originals.";

beautifyScreenshot.inputSchema = {
  type: "object",
  properties: {
    imageRequirements: {
      type: "array",
      items: {
        type: "object",
        description: "The image requirements to beautify",
        properties: {
          imageName: {
            type: "string",
            description: "The name of the original screenshot (without extension)",
          },
          mediaKitPath: {
            type: "string",
            description:
              "The mediakit path of the screenshot to beautify (e.g., mediakit://screenshot-name.png)",
          },
        },
        required: ["imageName", "mediaKitPath"],
      },
    },
  },
  required: ["imageRequirements"],
};

beautifyScreenshot.outputSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      description:
        "YAML formatted information about the beautified screenshots in available_media_assets format",
    },
  },
};
