export default async function translatePagesWithInvalidLinks(input, options) {
  const { selectedPages = [] } = input;

  // skip translation
  if (selectedPages.length === 0) {
    return {};
  }

  const batchTranslatePageDetail = options.context?.agents?.["batchTranslatePageDetail"];
  const result = await options.context.invoke(batchTranslatePageDetail, {
    ...input,
    options,
  });

  return result;
}
