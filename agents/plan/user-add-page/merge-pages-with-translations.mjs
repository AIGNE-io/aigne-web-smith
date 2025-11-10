export default function mergePagesWithTranslations({
  pagesWithNewLinks,
  newPages,
  translateLanguages = [],
}) {
  const selectedPages = [
    ...pagesWithNewLinks,
    newPages.map((v) => ({
      ...v,
      translates: translateLanguages.map((lang) => ({ language: lang })),
    })),
  ];

  return {
    selectedPages,
  };
}
