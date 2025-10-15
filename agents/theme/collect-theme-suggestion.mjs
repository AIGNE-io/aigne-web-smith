export default async function collectThemeSuggestion({ suggestion }, options) {
  // If user suggestions are already provided, return them
  if (suggestion?.trim()) {
    return { suggestion: suggestion.trim() }
  }

  // Ask for suggestions interactively
  const userInput = await options.prompts.input({
    message:
      'Specify any suggestions for your new theme:\n' +
      'Examples:\n' +
      '  • Apply warmer colors to the website\n' +
      '  • Use more artistic fonts for headings\n' +
      'Press Enter to continue:',
  })

  // Return user suggestions if provided, otherwise return empty
  return {
    suggestion: userInput?.trim() || '',
  }
}

collectThemeSuggestion.taskRenderMode = 'hide'

collectThemeSuggestion.input_schema = {
  type: 'object',
  properties: {
    suggestion: {
      type: 'string',
      description: 'User suggestions for theme generation',
    },
  },
}
