import YAML from "yaml";
import { SECTION_META_FIELDS } from "../../utils/constants.mjs";
import { generateFieldConstraints } from "../../utils/generate-helper.mjs";
import { recordUpdate } from "../../utils/history-utils.mjs";

export default async function userReviewPageDetail(
  { content, componentLibrary, ...rest },
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
      "Review the content above. Do you want to make changes?",
    choices: [
      {
        name: "No, looks good",
        value: "no",
      },
      {
        name: "Yes, edit content (sections, metadata, content structure)",
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

  const yamlOptions = {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
  };

  // share current page detail with updatePageDetail agent
  options.context.userContext.currentPageDetail = YAML.stringify(currentPageDetail, yamlOptions);
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

    const fieldConstraints = generateFieldConstraints(componentLibrary);

    try {
      // Call updatePageDetail agent with feedback
      await options.context.invoke(updateAgent, {
        ...rest,
        feedback: feedback.trim(),
        pageDetail: YAML.stringify(currentPageDetail, yamlOptions),
        fieldConstraints,
      });

      currentPageDetail = YAML.parse(options.context.userContext.currentPageDetail);

      // Record the update (both YAML + Git)
      recordUpdate({
        operation: "page_update",
        feedback: feedback.trim(),
        pagePath: rest.path,
      });

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
    content: YAML.stringify(currentPageDetail, yamlOptions),
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

  // Print all fields except 'sectionName' and 'sectionSummary' with recursive handling
  const content = [];

  Object.keys(section)
    .filter((key) => !SECTION_META_FIELDS.includes(key))
    .forEach((key) => {
      const value = section[key];
      const displayText = formatFieldValue(key, value);
      if (displayText) {
        content.push(displayText);
      }
    });

  // Show content in a compact format
  if (content.length > 0) {
    const contentLine = content.join("\n   ");
    console.log(`   ${contentLine}`);
  }
}

function formatFieldValue(key, value, indent = "") {
  if (value === null || value === undefined) {
    return null;
  }

  const displayName = getDisplayName(key);

  if (typeof value === "string") {
    // Special handling for code fields - just show existence
    if (key.toLowerCase().includes("code") || key.toLowerCase().includes("snippet")) {
      const prefix = displayName ? `${displayName}` : "💻 Code";
      return `${indent}${prefix}`;
    }

    const prefix = displayName ? `${displayName}: ` : "";
    return `${indent}${prefix}${truncateText(value, 80)}`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    const prefix = displayName ? `${displayName}: ` : "";
    return `${indent}${prefix}${value}`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      const prefix = displayName ? `${displayName}: ` : "";
      return `${indent}${prefix}[]`;
    }

    const listHeader = displayName
      ? `${displayName} (${value.length} items):`
      : `List (${value.length} items):`;
    const listItems = value
      .map((item, index) => {
        if (typeof item === "string") {
          return `${indent}     ${index + 1}. ${truncateText(item, 80)}`;
        } else if (typeof item === "object" && item !== null) {
          const subContent = Object.keys(item)
            .filter((subKey) => !SECTION_META_FIELDS.includes(subKey))
            .map((subKey) => formatFieldValue(subKey, item[subKey], "       "))
            .filter(Boolean)
            .join("\n");
          return `${indent}     ${index + 1}. \n${subContent || "Item"}`;
        } else {
          return `${indent}     ${index + 1}. ${truncateText(String(item), 80)}`;
        }
      })
      .join("\n");

    return `${indent}📋 ${listHeader}\n${listItems}`;
  }

  if (typeof value === "object") {
    // Special handling for code objects - just show existence
    if (key.toLowerCase().includes("code") || key.toLowerCase().includes("snippet")) {
      const prefix = displayName ? `${displayName}` : "💻 Code";
      return `${indent}${prefix}`;
    }

    const subContent = Object.keys(value)
      .filter((subKey) => !SECTION_META_FIELDS.includes(subKey))
      .map((subKey) => formatFieldValue(subKey, value[subKey], `${indent}   `))
      .filter(Boolean)
      .join("\n");

    if (subContent) {
      const prefix = displayName ? `${displayName}:` : "Object:";
      return `${indent}${prefix}\n${subContent}`;
    } else {
      const prefix = displayName ? `${displayName}: ` : "";
      return `${indent}${prefix}{}`;
    }
  }

  const prefix = displayName ? `${displayName}: ` : "";
  return `${indent}${prefix}${truncateText(String(value), 80)}`;
}

const fieldMappings = [
  // Title related - ordered by priority
  { pattern: "title", display: "Title" },
  { pattern: "heading", display: "Title" },
  { pattern: "header", display: "Title" },

  // Description related
  { pattern: "description", display: "Description" },
  { pattern: "desc", display: "Description" },
  { pattern: "content", display: "Content" },
  { pattern: "text", display: "Text" },
  { pattern: "body", display: "Content" },

  // Media related
  { pattern: "image", display: "🖼️ Image" },
  { pattern: "img", display: "🖼️ Image" },
  { pattern: "picture", display: "🖼️ Image" },
  { pattern: "photo", display: "🖼️ Photo" },
  { pattern: "video", display: "🎥 Video" },
  { pattern: "audio", display: "🔊 Audio" },

  // Interactive elements
  { pattern: "action", display: "🔘 Action" },
  { pattern: "button", display: "🔘 Button" },
  { pattern: "link", display: "🔗 Link" },
  { pattern: "url", display: "🔗 URL" },
  { pattern: "href", display: "🔗 Link" },

  // Code related
  { pattern: "code", display: "💻 Code" },
  { pattern: "snippet", display: "💻 Code" },
  { pattern: "script", display: "💻 Script" },

  // List related
  { pattern: "list", display: "List" },
  { pattern: "items", display: "Items" },
  { pattern: "options", display: "Options" },

  // Common properties
  { pattern: "id", display: "ID" },
  { pattern: "type", display: "Type" },
  { pattern: "style", display: "Style" },
  { pattern: "class", display: "Class" },
  { pattern: "value", display: "Value" },
  { pattern: "placeholder", display: "Placeholder" },
  { pattern: "label", display: "Label" },
];
function getDisplayName(fieldName) {
  const lowerField = fieldName.toLowerCase();

  // Check for partial matches - find first matching pattern
  for (const { pattern, display } of fieldMappings) {
    if (lowerField.includes(pattern.toLowerCase())) {
      return display;
    }
  }

  // If no match found, return null to show value without field name
  return null;
}

function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength - 3)}...` : text;
}

userReviewPageDetail.taskTitle = "User review and modify page detail content";
