import YAML from "yaml";
import { generateFieldConstraints } from "../../utils/generate-helper.mjs";
import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";

export default async function userReviewPageDetail(
  { content, builtinComponentLibrary, ...rest },
  options,
) {
  // Check if page detail content exists
  if (!content) {
    console.log("No page detail content was provided to review.");
    return { content };
  }

  // Parse the YAML content
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(content);
  } catch {
    console.log("Invalid YAML format in page detail content.");
    return { content };
  }

  // Print current page detail in a user-friendly format
  printPageDetail(parsedPageDetail);

  // Ask user if they want to review the page detail
  const needReview = await options.prompts.select({
    message:
      "Would you like to optimize this page?\n  You can edit sections, metadata, and content structure.",
    choices: [
      {
        name: "Looks good - proceed with current content",
        value: "no",
      },
      {
        name: "Yes, optimize the content",
        value: "yes",
      },
    ],
  });

  if (needReview === "no") {
    return { content };
  }

  let currentPageDetail = parsedPageDetail;

  const MAX_ITERATIONS = 100;
  let iterationCount = 0;
  while (iterationCount < MAX_ITERATIONS) {
    iterationCount++;

    // Ask for feedback
    const feedback = await options.prompts.input({
      message:
        "How would you like to improve the page detail?\n" +
        "  • Update meta information (title, description)\n" +
        "  • Add, remove, update, or reorder sections\n" +
        "  Press Enter to finish reviewing:",
    });

    // If no feedback, break the loop
    if (!feedback?.trim()) {
      break;
    }

    // Get the updatePageDetail agent
    const updateAgent = options.context.agents["updatePageDetail"];
    if (!updateAgent) {
      console.log("Unable to process feedback: page detail update feature unavailable.");
      console.log("Please try again later or contact support if the issue persists.");
      break;
    }

    // Get user preferences
    const structureRules = getActiveRulesForScope("page", []);
    const globalRules = getActiveRulesForScope("global", []);
    const allApplicableRules = [...structureRules, ...globalRules];
    const ruleTexts = allApplicableRules.map((rule) => rule.rule);
    const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";
    const fieldConstraints = generateFieldConstraints(builtinComponentLibrary);

    try {
      // Call updatePageDetail agent with feedback
      const result = await options.context.invoke(updateAgent, {
        ...rest,
        feedback: feedback.trim(),
        pageDetail: YAML.stringify(currentPageDetail),
        userPreferences,
        fieldConstraints,
      });

      if (result.pageDetail) {
        // Parse the returned YAML string back to object
        if (typeof result.pageDetail === "string") {
          currentPageDetail = YAML.parse(result.pageDetail);
        } else {
          currentPageDetail = result.pageDetail;
        }
      }

      // Check if feedback should be saved as user preference
      const feedbackRefinerAgent = options.context.agents["checkFeedbackRefiner"];
      if (feedbackRefinerAgent) {
        try {
          await options.context.invoke(feedbackRefinerAgent, {
            feedback: feedback.trim(),
            stage: "page_refine",
            selectedPaths: [rest.path],
          });
        } catch (refinerError) {
          console.warn(`Failed to save user preference: ${refinerError.message}`);
          console.warn("Feedback applied but not saved as preference.");
        }
      }

      // Print updated page detail
      printPageDetail(currentPageDetail);
    } catch (error) {
      console.error("Error processing feedback:", {
        type: error.name,
        message: error.message,
        stack: error.stack,
      });
      console.log("\nPlease rephrase feedback or continue with current content.");
      break;
    }
  }

  return {
    content: YAML.stringify(currentPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
  };
}

function printPageDetail(pageDetail) {
  console.log("\n📄 Page Detail:");
  console.log("=".repeat(60));

  // Print meta information
  console.log(`\n📌 Meta Information:`);
  if (pageDetail.meta?.title) console.log(`   Title: ${pageDetail.meta.title}`);
  if (pageDetail.meta?.description) console.log(`   Description: ${pageDetail.meta.description}`);

  // Print sections with simplified preview
  if (pageDetail.sections && Array.isArray(pageDetail.sections)) {
    console.log(`\n🌐 Website Preview (${pageDetail.sections.length} sections):`);
    console.log("-".repeat(60));

    pageDetail.sections.forEach((section, index) => {
      printSectionSimple(section, index + 1);
    });
  } else {
    console.log(`\n📋 Sections: None`);
  }

  console.log(`\n${"=".repeat(60)}`);
}

function printSectionSimple(section, index) {
  console.log(`\nSection ${index}`);

  // Extract and display key content fields
  const content = [];

  // FIXME: Update this function when new properties are added to built-in components.
  // Currently supported properties must be manually added to the content array below.
  if (section.title) content.push(`Title: ${truncateText(section.title, 80)}`);
  if (section.description) content.push(`Description: ${truncateText(section.description, 80)}`);
  if (section.image) content.push(`🖼️ Image`);
  if (section.code) content.push(`💻 Code`);
  if (section.action) {
    const actionText = typeof section.action === "object" ? section.action.text : section.action;
    content.push(`🔘 ${truncateText(actionText || "Button", 30)}`);
  }
  if (section.list && Array.isArray(section.list)) {
    const listDetails = section.list
      .map((item, index) => {
        if (typeof item === "string") {
          return `${index + 1}. ${truncateText(item, 40)}`;
        } else if (typeof item === "object" && item !== null) {
          const itemTitle = item.title || item.name || item.text || "Item";
          const itemDesc = item.description || item.summary || "";
          return `${index + 1}. ${truncateText(itemTitle, 25)}${itemDesc ? ` - ${truncateText(itemDesc, 50)}` : ""}`;
        }
        return `${index + 1}. ${truncateText(String(item), 40)}`;
      })
      .join("\n     ");
    content.push(`📋 List (${section.list.length} items):\n     ${listDetails}`);
  }

  // Show content in a compact format
  if (content.length > 0) {
    const contentLine = content.join("\n   ");
    console.log(`   ${contentLine}`);
  }

  // Show any custom fields
  const customFields = Object.keys(section).filter(
    (key) =>
      !["name", "summary", "title", "description", "image", "code", "action", "list"].includes(key),
  );

  if (customFields.length > 0) {
    const customText = customFields
      .map((key) => `${key}: ${truncateText(String(section[key]), 15)}`)
      .join(" • ");
    console.log(`   📎 ${truncateText(customText, 50)}`);
  }
}

function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;
}

userReviewPageDetail.taskTitle = "User review and modify page detail content";
