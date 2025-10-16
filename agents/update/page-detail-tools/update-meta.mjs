import YAML from "yaml";
import {
  getUpdateMetaInputJsonSchema,
  getUpdateMetaOutputJsonSchema,
  validateUpdateMetaInput,
} from "../../../types/page-detail-schema.mjs";

export default async function updateMeta(input, options) {
  // Validate input using Zod schema
  const validation = validateUpdateMetaInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update meta: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    return {
      pageDetail: input.pageDetail,
      message: errorMessage,
      error: { message: errorMessage },
    };
  }

  const { title, description } = validation.data;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

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
      error: { message: errorMessage },
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

  const successMessage = `updateMeta executed successfully.
  Successfully updated page meta: ${updatedFields.join(", ")}.
  Check if the latest version of pageDetail meets user feedback, if so, all operations have been successfully executed.`;

  const latestPageDetail = YAML.stringify(updatedPageDetail, {
    quotingType: '"',
    defaultStringType: "QUOTE_DOUBLE",
    lineWidth: 0,
  });
  // update shared page detail
  options.context.userContext.currentPageDetail = latestPageDetail;

  return {
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

updateMeta.taskTitle = "Update page meta";
updateMeta.description = "Update page metadata including title and description fields";
updateMeta.inputSchema = getUpdateMetaInputJsonSchema();
updateMeta.outputSchema = getUpdateMetaOutputJsonSchema();
