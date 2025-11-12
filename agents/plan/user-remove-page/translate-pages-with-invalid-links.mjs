// - type: transform
//     jsonata: |
//       $merge([
//         $,
//         {
//           "selectedPages": pagesWithInvalidLinks
//         }
//       ])
//   - url: ../../translate/page-detail/batch-translate-page-detail.yaml
//     default_input:
//       skipIfExists: false

export default async function translatePagesWithInvalidLinks({ pagesWithInvalidLinks, ...rest }, options) {
  if (!Array.isArray(pagesWithInvalidLinks) || pagesWithInvalidLinks.length === 0) {
    return {}
  }

  const batchTranslatePageDetail = options.context.agents['batchTranslatePageDetail']
  const selectedPages = [...pagesWithInvalidLinks]

  await options.context.invoke(
    batchTranslatePageDetail,
    {
      ...rest,
      skipIfExists: false,
      selectedPages,
    },
    {
      ...options,
      streaming: false,
    },
  )

  return {}
}

// translatePagesWithInvalidLinks.task_render_mode = 'hide'
translatePagesWithInvalidLinks.description = 'Translate pages with invalid links'
