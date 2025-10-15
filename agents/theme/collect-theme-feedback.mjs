export default async function collectThemeFeedback({ feedback }, options) {
  // If feedback is already provided, return it
  if (feedback?.trim()) {
    return { feedback: feedback.trim() };
  }

  // Ask for feedback interactively
  const userFeedback = await options.prompts.input({
    message:
      "Specify any requirements or preferences for your new theme:\n" +
      "Examples:\n" +
      "  • Apply warmer colors to the website\n" +
      "  • Use more artistic fonts for headings\n" +
      "Press Enter to continue:",
  });

  // Return feedback if provided, otherwise return empty
  return {
    feedback: userFeedback?.trim() || "",
  };
}

collectThemeFeedback.taskRenderMode = "hide";

collectThemeFeedback.input_schema = {
  type: "object",
  properties: {
    feedback: {
      type: "string",
      description: "User feedback to refine",
    },
  },
};
