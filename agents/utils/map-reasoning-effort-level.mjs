const DEFAULT_REASONING_EFFORT = 500;

export default function mapReasoningEffortLevel({ level }, options) {
  const g = REASONING_EFFORT_GROUPS[level] || REASONING_EFFORT_GROUPS["low"];

  return {
    reasoningEffort: g[options.context.userContext.reasoningEffort] ?? DEFAULT_REASONING_EFFORT,
  };
}

const REASONING_EFFORT_GROUPS = {
  minimal: {
    lite: 100,
    standard: 300,
    pro: 500,
  },
  low: {
    lite: 200,
    standard: 500,
    pro: 1000,
  },
  medium: {
    lite: 300,
    standard: 800,
    pro: 1500,
  },
  high: {
    lite: 500,
    standard: 1000,
    pro: 2000,
  },
};
