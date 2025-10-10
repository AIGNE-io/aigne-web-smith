import { recordUpdate } from "../../utils/history-utils.mjs";
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
    message: "Review the structure above. Do you want to make changes?",
    choices: [
      {
        name: "No, looks good",
        value: "no",
      },
      {
        name: "Yes, edit structure (titles, pages, organization)",
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

  // share current structure with updateWebsiteStructure agent
  options.context.userContext.currentStructure = currentStructure;
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
      await options.context.invoke(refineAgent, {
        ...rest,
        feedback: feedback.trim(),
        websiteStructure: currentStructure,
      });

      currentStructure = options.context.userContext.currentStructure;

      // Record the update (both YAML + Git)
      recordUpdate({
        operation: "structure_update",
        feedback: feedback.trim(),
      });

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
