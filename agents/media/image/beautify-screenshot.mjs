import path from "node:path";

export default async function beautifyScreenshot({imageRequirements = [], mediaFiles = [], pagesDir}, options) {
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
      mediaFile: {
        type: "local",
        path: absolutePath,
        filename: mediaFile.name,
        mimeType: mediaFile.mimeType,
      },
      imagePrompt: "Display what I provide against a dark gradient background",
    });
  }

  if (imagesToBeautify.length === 0) {
    return {
      message: "No valid images found to beautify",
    };
  }

  // Call generateWithImage agent with the array of images
  const results = await options.callAgent(options.context.agents["batchGenerateWithImage"], {
    mediaFiles: imagesToBeautify,
  });

  if (results.length === 0) {
    return {
      message: "No images were beautified",
    };
  }

  return {
    message: `Successfully beautified ${results.length} image(s)`,
    results,
  };
}

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
            description: "The name of the image to save",
          },
          imageDescription: {
            type: "string",
            description: "The description of the image to save",
          },
          mediaKitPath: {
            type: "string",
            description: "The mediakit path of the image to beautify",
          },
        },
        required: ["imageName", "imageDescription", "imageMediaKitPath"],
      },
    },
  },
};

beautifyScreenshot.outputSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
      description: "The message from the beautify screenshot",
    },
  },
};