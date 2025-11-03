import { join } from 'node:path'
import chalk from 'chalk'
import {
  addFeedbackToItems,
  fileNameToFlatPath,
  findItemByFlatName,
  findItemByPath,
  getActionText,
  getMainLanguageFiles,
  processSelectedFiles,
} from '../../utils/pages-finder-utils.mjs'

/**
 * Create file choice with title display
 * @param {string} fileName - File name
 * @param {Array} websiteStructureResult - Website structure data
 * @returns {Object} Choice object with name and value
 */
function createFileChoice(fileName, websiteStructureResult) {
  const flatName = fileNameToFlatPath(fileName)
  const foundItem = findItemByFlatName(websiteStructureResult, flatName)

  if (foundItem?.title) {
    // Show title with path for context: "Home"
    const displayName = foundItem.title
    return {
      name: displayName,
      value: fileName,
    }
  }

  // Fallback to filename if no title found
  return {
    name: fileName,
    value: fileName,
  }
}

/**
 * Choose pages for processing
 * @param {Object} params
 * @param {Array} params.pages - List of pages to choose from
 * @param {Object} params.websiteStructureResult - Website structure data
 * @param {string} params.projectId - Project identifier
 * @param {string} params.tmpDir - Temporary directory path
 * @param {boolean} params.isTranslate - Translation mode flag
 * @param {string} params.feedback - User feedback
 * @param {string} params.locale - Locale identifier
 * @param {boolean} [params.requiredFeedback=true] - Whether feedback is required
 * @param {boolean} [params.multipleSelection=true] - Whether to allow multiple page selection
 * @param {Object} options - Additional options
 */

export default async function choosePages(
  {
    pages,
    websiteStructureResult,
    projectId,
    tmpDir,
    isTranslate,
    feedback,
    locale,
    requiredFeedback = true,
    multipleSelection = true,
    title,
  },
  options,
) {
  let foundItems = []
  let selectedFiles = []

  const mainFileTmpDir = join(tmpDir, locale)

  // If pages is empty or not provided, let user select multiple pages
  if (!pages || pages.length === 0) {
    try {
      // Get all main language page files in tmpDir
      const mainLanguageFiles = await getMainLanguageFiles(mainFileTmpDir, locale, websiteStructureResult)

      if (mainLanguageFiles.length === 0) {
        console.log(
          `It seems that the pages does not generated. \nPlease generate the pages as needed using ${chalk.yellow(
            'aigne web generate',
          )} \n`,
        )
        process.exit(0)
      }

      // Generate choices once outside the source function
      const choices = mainLanguageFiles.map((file) => createFileChoice(file, websiteStructureResult))

      // Let user select files (single or multiple based on multipleSelection parameter)
      if (multipleSelection) {
        selectedFiles = await options.prompts.checkbox({
          message: title || getActionText(isTranslate, 'Select pages to {action}:'),
          source: (term) => {
            if (!term) return choices

            return choices.filter((choice) => choice.name.toLowerCase().includes(term.toLowerCase()))
          },
          validate: (answer) => {
            if (answer.length === 0) {
              return 'Please select at least one page'
            }
            return true
          },
        })
      } else {
        const selectedFile = await options.prompts.search({
          message: title || getActionText(isTranslate, 'Select page to {action}:'),
          source: (term) => {
            if (!term) return choices

            return choices.filter((choice) => choice.name.toLowerCase().includes(term.toLowerCase()))
          },
        })
        selectedFiles = [selectedFile]
      }

      if (!selectedFiles || selectedFiles.length === 0) {
        throw new Error('No pages selected')
      }

      // Process selected files and convert to found items
      foundItems = await processSelectedFiles(selectedFiles, websiteStructureResult, mainFileTmpDir)
    } catch (error) {
      console.error(error)
      throw new Error(getActionText(isTranslate, 'Please provide a pages parameter to specify which pages to {action}'))
    }
  } else {
    // Process the provided pages array
    for (const pagePath of pages) {
      const foundItem = await findItemByPath(websiteStructureResult, pagePath, projectId, mainFileTmpDir, locale)

      if (!foundItem) {
        console.warn(`⚠️  Item with path "${pagePath}" not found in websiteStructureResult`)
        continue
      }

      foundItems.push({
        ...foundItem,
      })
    }

    if (foundItems.length === 0) {
      throw new Error('None of the specified page paths were found in websiteStructureResult')
    }
  }

  // Prompt for feedback if not provided
  let userFeedback = feedback
  if (!userFeedback && requiredFeedback) {
    const feedbackMessage = isTranslate
      ? 'Any specific translation preferences or instructions? (Press Enter to skip):'
      : 'How would you like to improve this page? (Press Enter to skip):'

    userFeedback = await options.prompts.input({
      message: feedbackMessage,
    })
  }

  // Add feedback to all results if provided
  foundItems = addFeedbackToItems(foundItems, userFeedback)

  return {
    selectedPages: foundItems,
    feedback: userFeedback,
    selectedPaths: foundItems.map((item) => item.path),
  }
}
