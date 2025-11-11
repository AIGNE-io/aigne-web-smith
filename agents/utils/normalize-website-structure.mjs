export default async function normalizeWebsiteStructure({ key = "websiteStructure", ...rest }) {
  if (!(key in rest)) {
    console.warn(`"${key}" not found in input; skipping normalize website structure.`);
    return {};
  }

  const value = rest[key];

  if (!Array.isArray(value)) {
    console.warn(`"${key}" is not an array; skipping normalize website structure.`);
    return {};
  }

  return {
    [key]: value.map((v) => ({
      title: v.title,
      description: v.description,
      path: v.path,
      navigation: v.navigation,
      parentId: v.parentId,
      sourceIds: v.sourceIds || "",
    })),
  };
}

normalizeWebsiteStructure.task_render_mode = "hide";
