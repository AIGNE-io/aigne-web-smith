import isEqual from "lodash/isEqual.js";
import YAML from "yaml";
import {
  getUpdateMetaInputJsonSchema,
  getUpdateMetaOutputJsonSchema,
  validateUpdateMetaInput,
} from "../../../types/page-detail-schema.mjs";
import { handleFailure, initializeFailureCount } from "../../../utils/retry-utils.mjs";

export default async function updateMeta(input, options) {
  initializeFailureCount(options);

  // Validate input using Zod schema
  const validation = validateUpdateMetaInput(input);
  if (!validation.success) {
    const errorMessage = `Cannot update meta: ${validation.error}`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail: input.pageDetail,
      error: { message: errorMessage },
    };
  }

  const { title, description } = validation.data;
  let pageDetail = options.context?.userContext?.currentPageDetail;

  if (!pageDetail) {
    pageDetail = input.pageDetail;
  }

  // Check for duplicate calls by comparing with last input
  const lastToolInputs = options.context?.userContext?.lastToolInputs || {};
  const currentInput = { title, description };

  if (lastToolInputs.updateMeta && isEqual(lastToolInputs.updateMeta, currentInput)) {
    const errorMessage = `Cannot update meta: This operation has already been processed. Please do not call updateMeta again with the same parameters.`;
    return {
      status: "error",
      pageDetail,
      error: { message: errorMessage },
    };
  }

  // Parse YAML string to object
  let parsedPageDetail;
  try {
    parsedPageDetail = YAML.parse(pageDetail);
  } catch (error) {
    const errorMessage = `Cannot update meta: Unable to parse page detail YAML - ${error.message}`;
    console.log(`⚠️  ${errorMessage}`);
    handleFailure(options);

    return {
      status: "error",
      pageDetail,
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

  // Save current input to prevent duplicate calls
  if (!options.context.userContext.lastToolInputs) {
    options.context.userContext.lastToolInputs = {};
  }
  options.context.userContext.lastToolInputs.updateMeta = currentInput;

  return {
    status: "success",
    pageDetail: latestPageDetail,
    message: successMessage,
  };
}

updateMeta.taskTitle = "Update page meta";
updateMeta.description = "Update page metadata including title and description fields";
updateMeta.inputSchema = getUpdateMetaInputJsonSchema();
updateMeta.outputSchema = getUpdateMetaOutputJsonSchema();
