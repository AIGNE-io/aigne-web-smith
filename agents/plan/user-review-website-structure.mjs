import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";

function formatWebsiteStructure(structure) {
  // Build a tree structure for better display
  const nodeMap = new Map();
  const rootNodes = [];

  // First pass: create node map
  structure.forEach((node) => {
    nodeMap.set(node.path, {
      ...node,
      children: [],
    });
  });

  // Second pass: build tree structure
  structure.forEach((node) => {
    if (node.parentId) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(nodeMap.get(node.path));
      } else {
        rootNodes.push(nodeMap.get(node.path));
      }
    } else {
      rootNodes.push(nodeMap.get(node.path));
    }
  });

  function printNode(node, depth = 0) {
    const INDENT_SPACES = "  ";
    const FOLDER_ICON = "  📁";
    const FILE_ICON = "  📄";
    const indent = INDENT_SPACES.repeat(depth);
    const prefix = depth === 0 ? FOLDER_ICON : FILE_ICON;

    console.log(`${indent}${prefix} ${node.title}`);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        printNode(child, depth + 1);
      });
    }
  }

  return { rootNodes, printNode };
}

function printWebsiteStructure(structure) {
  console.log(`\n  ${"-".repeat(50)}`);
  console.log("  Current Website Structure");
  console.log(`  ${"-".repeat(50)}`);

  const { rootNodes, printNode } = formatWebsiteStructure(structure);

  if (rootNodes.length === 0) {
    console.log("  No website structure found.");
  } else {
    rootNodes.forEach((node) => printNode(node));
  }
  console.log();
}

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
    const refineAgent = options.context.agents["generateWebsiteStructure"];
    if (!refineAgent) {
      console.log(
        "Unable to process your feedback - the structure refinement feature is unavailable.",
      );
      console.log("Please try again later or contact support if this continues.");
      break;
    }

    // Get user preferences
    const structureRules = getActiveRulesForScope("structure", []);
    const globalRules = getActiveRulesForScope("global", []);
    const allApplicableRules = [...structureRules, ...globalRules];
    const ruleTexts = allApplicableRules.map((rule) => rule.rule);
    const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";

    try {
      // Call generateWebsiteStructure agent with feedback
      const result = await options.context.invoke(refineAgent, {
        ...rest,
        feedback: feedback.trim(),
        originalWebsiteStructure: currentStructure,
        userPreferences,
      });

      if (result.websiteStructure) {
        currentStructure = result.websiteStructure;
      }

      // Check if feedback should be saved as user preference
      const feedbackRefinerAgent = options.context.agents["checkFeedbackRefiner"];
      if (feedbackRefinerAgent) {
        try {
          await options.context.invoke(feedbackRefinerAgent, {
            websiteStructureFeedback: feedback.trim(),
            stage: "structure_planning",
          });
        } catch (refinerError) {
          console.warn("Could not save feedback as user preference:", refinerError.message);
          console.warn("Your feedback was applied but not saved as a preference.");
        }
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

  return { websiteStructure: currentStructure };
}

userReviewWebsiteStructure.taskTitle = "User review and modify website structure";