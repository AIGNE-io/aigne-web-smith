import { getActiveRulesForScope } from "../../../utils/preferences-utils.mjs";
import { printWebsiteStructure } from "../../../utils/website-structure-utils.mjs";

export default async function addPagesToStructure(input = {}, options = {}) {
  const { originalWebsiteStructure = [] } = input;
  const analyzeStructureFeedbackIntent =
    options.context?.agents?.["analyzeStructureFeedbackIntent"];
  const updateWebsiteStructure = options.context?.agents?.["updateWebsiteStructure"];
  const allFeedback = [];
  let currentStructure = [...originalWebsiteStructure];
  let isFirstAdd = true;

  printWebsiteStructure(originalWebsiteStructure);

  // update website structure
  if (!options.context.userContext) {
    options.context.userContext = {};
  }

  // Add page
  while (true) {
    let feedback = await options.prompts.input({
      message: isFirstAdd
        ? "You can add a new page.\n" +
          "  • e.g. 'add an FAQ page under the About page'\n\n" +
          "Press Enter to finish:"
        : "You can continue adding pages, or press Enter to finish:",
    });

    feedback = feedback.trim();

    // end the loop
    if (!feedback) {
      break;
    }

    try {
      // validate feedback
      const { intentType } = await options.context.invoke(analyzeStructureFeedbackIntent, {
        feedback,
      });

      if (intentType !== "add") {
        console.log(`⚠️  You can only add pages at this stage.`);
        continue;
      }
      options.context.userContext.currentStructure = currentStructure;
      options.context.userContext.lastToolInputs = {};

      const structureRules = getActiveRulesForScope("structure", []);
      const globalRules = getActiveRulesForScope("global", []);
      const allApplicableRules = [...structureRules, ...globalRules];
      const userPreferences = allApplicableRules.map((rule) => rule.rule).join("\n\n");

      await options.context.invoke(updateWebsiteStructure, {
        ...input,
        feedback,
        websiteStructure: currentStructure,
        userPreferences,
      });

      allFeedback.push(feedback);

      currentStructure = options.context.userContext.currentStructure;
      printWebsiteStructure(currentStructure);
      isFirstAdd = false;
    } catch (error) {
      console.error("Error processing feedback:", {
        type: error.name,
        message: error.message,
      });
      process.exit(0);
    }
  }

  if (currentStructure.length > originalWebsiteStructure.length) {
    const originalPaths = new Set(originalWebsiteStructure.map((page) => page.path));
    const newPages = currentStructure.filter((page) => !originalPaths.has(page.path));

    return {
      websiteStructure: currentStructure,
      newPages,
      allFeedback,
    };
  } else {
    console.log("No pages were added");
    process.exit(0);
  }
}
