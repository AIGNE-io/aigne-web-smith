import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Navigation schema - represents navigation metadata
export const navigationSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Page item schema - represents a single page in the structure
export const pageItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  path: z.string().startsWith("/", 'Path must start with "/"'),
  navigation: navigationSchema,
  parentId: z.string().nullable().optional(),
  sourceIds: z.array(z.string()).min(1, "At least one source ID is required"),
});

// Website structure schema - represents the entire website structure array
export const websiteStructureSchema = z.array(pageItemSchema);

// Add page schemas
export const addPageInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  path: z.string().startsWith("/", 'Path must start with "/"'),
  navigation: navigationSchema,
  parentId: z.string().nullable().optional(),
  sourceIds: z.array(z.string()).min(1, "At least one source ID is required"),
});

export const addPageOutputSchema = z.object({
  websiteStructure: websiteStructureSchema,
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Delete page schemas
export const deletePageInputSchema = z.object({
  path: z.string().min(1, "Path is required"),
  recursive: z.boolean().optional().default(false),
});

export const deletePageOutputSchema = z.object({
  websiteStructure: websiteStructureSchema,
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Move page schemas
export const movePageInputSchema = z.object({
  path: z.string().min(1, "Path is required"),
  newParentId: z.string().nullable().optional(),
  newPath: z.string().startsWith("/", 'New path must start with "/"'),
});

export const movePageOutputSchema = z.object({
  websiteStructure: websiteStructureSchema,
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// Update page schemas
export const updatePageInputSchema = z
  .object({
    path: z.string().min(1, "Path is required"),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    navigation: navigationSchema.optional(),
    sourceIds: z.array(z.string()).min(1).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.navigation !== undefined ||
      data.sourceIds !== undefined,
    {
      message:
        "At least one field (title, description, navigation, or sourceIds) must be provided for update",
    },
  );

export const updatePageOutputSchema = z.object({
  websiteStructure: websiteStructureSchema,
  message: z.string().optional(),
  error: z
    .object({
      message: z.string(),
    })
    .optional(),
});

// JSON Schema conversion functions using zodToJsonSchema
export const getAddPageInputJsonSchema = () => {
  const schema = zodToJsonSchema(addPageInputSchema);
  // Add custom descriptions
  if (schema.properties) {
    schema.properties.title.description = "Title of the new page";
    schema.properties.description.description = "Description of the new page";
    schema.properties.path.description =
      "URL path for the new page. Must start with '/'. No language prefix. Homepage uses '/home'";
    schema.properties.navigation.description = "Navigation metadata shown to users";
    if (schema.properties.navigation.properties) {
      schema.properties.navigation.properties.title.description =
        "Short navigation label (**10–18 characters, 2–3 words**)";
      schema.properties.navigation.properties.description.description =
        "User-facing action summary (**20–40 characters**) describing what visitors can do";
    }
    schema.properties.parentId.description = "Parent page path. Use null for top-level pages";
    schema.properties.sourceIds.description =
      "Associated sourceIds from datasources, cannot be empty. For each page, you must include as sourceIds the files that contain media resource descriptions or screenshot information.";
  }
  return schema;
};

export const getAddPageOutputJsonSchema = () => {
  const schema = zodToJsonSchema(addPageOutputSchema);
  if (schema.properties) {
    schema.properties.websiteStructure.description =
      "Updated website structure array with the new page added";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getDeletePageInputJsonSchema = () => {
  const schema = zodToJsonSchema(deletePageInputSchema);
  if (schema.properties) {
    schema.properties.path.description = "URL path of the page to delete";
    schema.properties.recursive.description =
      "If true, recursively delete all child pages before deleting the parent page";
  }
  return schema;
};

export const getDeletePageOutputJsonSchema = () => {
  const schema = zodToJsonSchema(deletePageOutputSchema);
  if (schema.properties) {
    schema.properties.websiteStructure.description =
      "Updated website structure array with the page removed";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getMovePageInputJsonSchema = () => {
  const schema = zodToJsonSchema(movePageInputSchema);
  if (schema.properties) {
    schema.properties.path.description = "URL path of the page to move";
    schema.properties.newParentId.description =
      "Path of the new parent page (leave empty for top-level)";
    schema.properties.newPath.description =
      "New URL path for the page. Path must be updated to match the new parent path";
  }
  return schema;
};

export const getMovePageOutputJsonSchema = () => {
  const schema = zodToJsonSchema(movePageOutputSchema);
  if (schema.properties) {
    schema.properties.websiteStructure.description =
      "Updated website structure array with the page moved";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

export const getUpdatePageInputJsonSchema = () => {
  const schema = zodToJsonSchema(updatePageInputSchema);
  if (schema.properties) {
    schema.properties.path.description = "URL path of the page to update";
    schema.properties.title.description = "New title for the page (optional)";
    schema.properties.description.description = "New description for the page (optional)";
    schema.properties.navigation.description = "New navigation metadata for the page (optional)";
    if (schema.properties.navigation.properties) {
      schema.properties.navigation.properties.title.description =
        "Short navigation label (10–18 characters, 2–3 words)";
      schema.properties.navigation.properties.description.description =
        "User-facing action summary (20–40 characters) describing what visitors can do";
    }
    schema.properties.sourceIds.description =
      "New source references for the page (optional). If provided, array cannot be empty";
  }
  // Add anyOf constraint for at least one update field
  schema.anyOf = [
    { required: ["title"] },
    { required: ["description"] },
    { required: ["navigation"] },
    { required: ["sourceIds"] },
  ];
  return schema;
};

export const getUpdatePageOutputJsonSchema = () => {
  const schema = zodToJsonSchema(updatePageOutputSchema);
  if (schema.properties) {
    schema.properties.websiteStructure.description =
      "Updated website structure array with the page modified";
    schema.properties.message.description = "Detailed description of the operation result";
  }
  return schema;
};

// Validation helper functions
export const validateAddPageInput = (input) => {
  try {
    return {
      success: true,
      data: addPageInputSchema.parse(input),
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

export const validateDeletePageInput = (input) => {
  try {
    return {
      success: true,
      data: deletePageInputSchema.parse(input),
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

export const validateMovePageInput = (input) => {
  try {
    return {
      success: true,
      data: movePageInputSchema.parse(input),
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

export const validateUpdatePageInput = (input) => {
  try {
    return {
      success: true,
      data: updatePageInputSchema.parse(input),
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

// Type inference helpers for better IDE support
export const createPageItem = (data) => pageItemSchema.parse(data);
export const createWebsiteStructure = (data) => websiteStructureSchema.parse(data);
