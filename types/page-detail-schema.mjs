import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Add section schemas
export const addSectionInputSchema = z.object({
  section: z.string().min(1, "Section content is required"),
  position: z.union([z.number(), z.string()]).optional(),
});

export const addSectionOutputSchema = z.object({
  pageDetail: z.string(),
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Delete section schemas
export const deleteSectionInputSchema = z.object({
  name: z.string().min(1, "Section name is required"),
});

export const deleteSectionOutputSchema = z.object({
  pageDetail: z.string(),
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Move section schemas
export const moveSectionInputSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  position: z.union([z.number(), z.string()]),
});

export const moveSectionOutputSchema = z.object({
  pageDetail: z.string(),
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Update meta schemas
export const updateMetaInputSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    message: "At least one field (title or description) must be provided for update",
  });

export const updateMetaOutputSchema = z.object({
  pageDetail: z.string(),
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Update section schemas
export const updateSectionInputSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  updates: z.string().min(1, "Section updates are required"),
});

export const updateSectionOutputSchema = z.object({
  pageDetail: z.string(),
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// JSON Schema conversion functions
export const getAddSectionInputJsonSchema = () => {
  const schema = zodToJsonSchema(addSectionInputSchema);
  if (schema.properties) {
    schema.properties.section.description =
      "YAML string containing the section content to add (must include a 'sectionName' property)";
    schema.properties.position.description =
      "Position to insert the section (index number or section name to insert after, **index number starts from 0**)";
  }
  return schema;
};

export const getAddSectionOutputJsonSchema = () => {
  const schema = zodToJsonSchema(addSectionOutputSchema);
  if (schema.properties) {
    schema.properties.pageDetail.description =
      "Updated page detail YAML string with the new section added";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getDeleteSectionInputJsonSchema = () => {
  const schema = zodToJsonSchema(deleteSectionInputSchema);
  if (schema.properties) {
    schema.properties.name.description = "Name of the section to delete";
  }
  return schema;
};

export const getDeleteSectionOutputJsonSchema = () => {
  const schema = zodToJsonSchema(deleteSectionOutputSchema);
  if (schema.properties) {
    schema.properties.pageDetail.description =
      "Updated page detail YAML string with the section removed";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getMoveSectionInputJsonSchema = () => {
  const schema = zodToJsonSchema(moveSectionInputSchema);
  if (schema.properties) {
    schema.properties.name.description = "Name of the section to move";
    schema.properties.position.description =
      "New position for the section (index number or section name to insert after, **index number starts from 0**)";
  }
  return schema;
};

export const getMoveSectionOutputJsonSchema = () => {
  const schema = zodToJsonSchema(moveSectionOutputSchema);
  if (schema.properties) {
    schema.properties.pageDetail.description =
      "Updated page detail YAML string with the section moved";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getUpdateMetaInputJsonSchema = () => {
  const schema = zodToJsonSchema(updateMetaInputSchema);
  if (schema.properties) {
    schema.properties.title.description = "New page title (optional)";
    schema.properties.description.description = "New page description (optional)";
  }
  schema.anyOf = [{ required: ["title"] }, { required: ["description"] }];
  return schema;
};

export const getUpdateMetaOutputJsonSchema = () => {
  const schema = zodToJsonSchema(updateMetaOutputSchema);
  if (schema.properties) {
    schema.properties.pageDetail.description =
      "Updated page detail YAML string with modified meta information";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getUpdateSectionInputJsonSchema = () => {
  const schema = zodToJsonSchema(updateSectionInputSchema);
  if (schema.properties) {
    schema.properties.name.description = "Name of the section to update";
    schema.properties.updates.description =
      "YAML string containing the updates to apply to the section";
  }
  return schema;
};

export const getUpdateSectionOutputJsonSchema = () => {
  const schema = zodToJsonSchema(updateSectionOutputSchema);
  if (schema.properties) {
    schema.properties.pageDetail.description =
      "Updated page detail YAML string with the section modified";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

// Validation helper functions
export const validateAddSectionInput = (input) => {
  try {
    return {
      success: true,
      data: addSectionInputSchema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        error.message,
    };
  }
};

export const validateDeleteSectionInput = (input) => {
  try {
    return {
      success: true,
      data: deleteSectionInputSchema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        error.message,
    };
  }
};

export const validateMoveSectionInput = (input) => {
  try {
    return {
      success: true,
      data: moveSectionInputSchema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        error.message,
    };
  }
};

export const validateUpdateMetaInput = (input) => {
  try {
    return {
      success: true,
      data: updateMetaInputSchema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        error.message,
    };
  }
};

export const validateUpdateSectionInput = (input) => {
  try {
    return {
      success: true,
      data: updateSectionInputSchema.parse(input),
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") ||
        error.message,
    };
  }
};
