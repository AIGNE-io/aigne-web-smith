import {
  printWebsiteStructure,
  updateWebsiteScaleIfNeeded,
} from "../../utils/website-structure-utils.mjs";

export default async function userReviewWebsiteStructure({ websiteStructure, ...rest }, options) {
  // Check if website structure exists
  if (!websiteStructure || !Array.isArray(websiteStructure) || websiteStructure.length === 0) {
    console.log("No website structure was generated to review.");
    return { websiteStructure };
  }

  // Print current website structure in a user-friendly format
  printWebsiteStructure(websiteStructure);

  // Ask user if they want to review the website structure
  const needReview = await options.prompts.select({
    message:
      "Would you like to optimize the website structure?\n  You can edit titles, reorganize pages.",
    choices: [
      {
        name: "Looks good - proceed with current structure",
        value: "no",
      },
      {
        name: "Yes, optimize the structure",
        value: "yes",
      },
    ],
  });

  if (needReview === "no") {
    return { websiteStructure };
  }

  let currentStructure = websiteStructure;

  const MAX_ITERATIONS = 100;
  let iterationCount = 0;
  while (iterationCount < MAX_ITERATIONS) {
    iterationCount++;

    // Ask for feedback
    const feedback = await options.prompts.input({
      message:
        "How would you like to improve the structure?\n" +
        "  • Rename, reorganize, add, or remove pages\n\n" +
        "  Press Enter to finish reviewing:",
    });

    // If no feedback, break the loop
    if (!feedback?.trim()) {
      break;
    }

    // Get the generateWebsiteStructure agent
    const refineAgent = options.context.agents["updateWebsiteStructure"];
    if (!refineAgent) {
      console.log(
        "Unable to process your feedback - the structure refinement feature is unavailable.",
      );
      console.log("Please try again later or contact support if this continues.");
      break;
    }

    try {
      // Call updateWebsiteStructure agent with feedback
      const result = await options.context.invoke(refineAgent, {
        ...rest,
        feedback: feedback.trim(),
        websiteStructure: currentStructure,
      });

      if (result.websiteStructure) {
        currentStructure = result.websiteStructure;
      }

      // Print current website structure in a user-friendly format
      printWebsiteStructure(currentStructure);
    } catch (error) {
      console.error("Error processing your feedback:");
      console.error(`Type: ${error.name}`);
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
      console.log("\nPlease try rephrasing your feedback or continue with the current structure.");
      break;
    }
  }

  const updatedWebsiteScale = await updateWebsiteScaleIfNeeded(
    rest.websiteScale,
    currentStructure.length,
  );
  return { websiteStructure: currentStructure, websiteScale: updatedWebsiteScale };
}

userReviewWebsiteStructure.taskTitle = "User review and modify website structure";
