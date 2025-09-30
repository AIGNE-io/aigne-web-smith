import YAML from "yaml";
import {
  getUpdateMetaInputJsonSchema,
  getUpdateMetaOutputJsonSchema,
  validateUpdateMetaInput,
} from "../../../types/page-detail-schema.mjs";

export default async function updateMeta(input) {
  // Validate input using Zod schema
  const validation = validateUpdateMetaInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update meta: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail: input.pageDetail,
      message: errorMessage,
    };
  }

  const { pageDetail, title, description } = validation.data;

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot update meta: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail,
      message: errorMessage,
    };
  }

  // Create updated page detail object
  const updatedPageDetail = {
    ...parsedPageDetail,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };

  const updatedFields = [];
  if (title !== undefined) updatedFields.push(`title to '${title}'`);
  if (description !== undefined) updatedFields.push("description");

  const successMessage = `Successfully updated page meta: ${updatedFields.join(", ")}.\nCheck if the latest version of pageDetail meets user feedback, if so, return the latest version directly.`;

  return {
    pageDetail: YAML.stringify(updatedPageDetail, {
      quotingType: '"',
      defaultStringType: "QUOTE_DOUBLE",
    }),
    message: successMessage,
  };
}

updateMeta.taskTitle = "Update page meta";
updateMeta.description = "Update page meta information including title and description";
updateMeta.inputSchema = getUpdateMetaInputJsonSchema();
updateMeta.outputSchema = getUpdateMetaOutputJsonSchema();
