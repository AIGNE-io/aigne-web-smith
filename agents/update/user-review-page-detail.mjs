import YAML from "yaml";
import { getActiveRulesForScope } from "../../utils/preferences-utils.mjs";

export default async function userReviewPageDetail({ content, ...rest }, options) {
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
      "Would you like to optimize the page detail?\n  You can edit sections, meta information, and content structure.",
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
      console.log(
        "Unable to process your feedback - the page detail update feature is unavailable.",
      );
      console.log("Please try again later or contact support if this continues.");
      break;
    }

    // Get user preferences
    const structureRules = getActiveRulesForScope("page", []);
    const globalRules = getActiveRulesForScope("global", []);
    const allApplicableRules = [...structureRules, ...globalRules];
    const ruleTexts = allApplicableRules.map((rule) => rule.rule);
    const userPreferences = ruleTexts.length > 0 ? ruleTexts.join("\n\n") : "";

    try {
      // Call updatePageDetail agent with feedback
      const result = await options.context.invoke(updateAgent, {
        ...rest,
        feedback: feedback.trim(),
        pageDetail: currentPageDetail,
        userPreferences,
      });

      if (result.pageDetail) {
        currentPageDetail = result.pageDetail;
      }

      // Check if feedback should be saved as user preference
      const feedbackRefinerAgent = options.context.agents["checkFeedbackRefiner"];
      if (feedbackRefinerAgent) {
        try {
          await options.context.invoke(feedbackRefinerAgent, {
            pageDetailFeedback: feedback.trim(),
            stage: "page_refine",
          });
        } catch (refinerError) {
          console.warn("Could not save feedback as user preference:", refinerError.message);
          console.warn("Your feedback was applied but not saved as a preference.");
        }
      }

      // Print updated page detail
      printPageDetail(currentPageDetail);
    } catch (error) {
      console.error("Error processing your feedback:");
      console.error(`Type: ${error.name}`);
      console.error(`Message: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
      console.log("\nPlease try rephrasing your feedback or continue with the current content.");
      break;
    }
  }

  return { content: YAML.stringify(currentPageDetail) };
}

function printPageDetail(pageDetail) {
  console.log("\n📄 Page Detail Content:");
  console.log("=".repeat(50));

  // Print meta information
  console.log(`\n📌 Meta Information:`);
  if (pageDetail.title) console.log(`   Title: ${pageDetail.title}`);
  if (pageDetail.description) console.log(`   Description: ${pageDetail.description}`);
  if (pageDetail.seoTitle) console.log(`   SEO Title: ${pageDetail.seoTitle}`);
  if (pageDetail.seoDescription) console.log(`   SEO Description: ${pageDetail.seoDescription}`);

  // Print sections
  if (pageDetail.sections && Array.isArray(pageDetail.sections)) {
    console.log(`\n📋 Sections (${pageDetail.sections.length}):`);
    pageDetail.sections.forEach((section, index) => {
      console.log(`\n   ${index + 1}. ${section.name || "Unnamed Section"}`);
      if (section.summary) console.log(`      Summary: ${section.summary}`);
      if (section.title) console.log(`      Title: ${section.title}`);
      if (section.description)
        console.log(
          `      Description: ${section.description.substring(0, 100)}${section.description.length > 100 ? "..." : ""}`,
        );
    });
  } else {
    console.log(`\n📋 Sections: None`);
  }

  console.log(`\n${"=".repeat(50)}`);
}

userReviewPageDetail.taskTitle = "User review and modify page detail content";
