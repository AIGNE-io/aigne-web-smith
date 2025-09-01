// Default file patterns for inclusion and exclusion
export const DEFAULT_INCLUDE_PATTERNS = [
  // Python
  "*.py",
  "*.pyi",
  "*.pyx",
  // JavaScript/TypeScript
  "*.js",
  "*.jsx",
  "*.ts",
  "*.tsx",
  "*.mjs",
  "*.mts",
  // C/C++
  "*.c",
  "*.cc",
  "*.cpp",
  "*.cxx",
  "*.c++",
  "*.h",
  "*.hpp",
  "*.hxx",
  "*.h++",
  // JVM Languages
  "*.java",
  "*.kt",
  "*.scala",
  "*.groovy",
  "*.gvy",
  "*.gy",
  "*.gsh",
  "*.clj",
  "*.cljs",
  "*.cljx",
  // .NET Languages
  "*.cs",
  "*.vb",
  "*.fs",
  // Functional Languages
  "*.f",
  "*.ml",
  "*.sml",
  "*.lisp",
  "*.lsp",
  "*.cl",
  // Systems Programming
  "*.rs",
  "*.go",
  "*.nim",
  "*.asm",
  "*.s",
  // Web Technologies
  "*.html",
  "*.htm",
  "*.css",
  "*.php",
  // Scripting Languages
  "*.rb",
  "*.pl",
  "*.ps1",
  "*.lua",
  "*.tcl",
  // Mobile/Modern Languages
  "*.swift",
  "*.dart",
  "*.ex",
  "*.exs",
  "*.erl",
  "*.jl",
  // Data Science
  "*.r",
  "*.R",
  "*.m",
  // Other Languages
  "*.pas",
  "*.cob",
  "*.cbl",
  "*.pro",
  "*.prolog",
  "*.sql",
  // Page & Config
  "*.md",
  "*.rst",
  "*.json",
  "*.yaml",
  "*.yml",
  "*Dockerfile",
  "*Makefile",
  // Media files
  "*.jpg",
  "*.jpeg",
  "*.png",
  "*.gif",
  "*.bmp",
  "*.webp",
  "*.svg",
  "*.mp4",
  "*.mov",
  "*.avi",
  "*.mkv",
  "*.webm",
  "*.m4v",
];

export const DEFAULT_EXCLUDE_PATTERNS = [
  "**/aigne-pages/**",
  "**/web-smith/**",
  "**/.aigne/**",
  "**/data/**",
  "**/public/**",
  "**/static/**",
  "**/vendor/**",
  "**/temp/**",
  "**/*pages/**",
  "**/*page/**",
  "**/*venv/**",
  "*.venv/**",
  "*test*",
  "**/*test/**",
  "**/*tests/**",
  "**/*examples/**",
  "**/playgrounds/**",
  "v1/**",
  "**/dist/**",
  "**/*build/**",
  "**/*experimental/**",
  "**/*deprecated/**",
  "**/*misc/**",
  "**/*legacy/**",
  ".git/**",
  ".github/**",
  ".next/**",
  ".vscode/**",
  "**/*obj/**",
  "**/*bin/**",
  "**/*node_modules/**",
  "*.log",
  "**/*test.*",
  "**/pnpm-lock.yaml",
  "**/yarn.lock",
  "**/package-lock.json",
  "**/pnpm-lock.json",
  "**/bun.lockb",
  "**/bun.lock",
  "**/bun.lockb",
];

// Supported languages for pages
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English (en)", sample: "Hello" },
  { code: "zh", label: "简体中文 (zh)", sample: "你好" },
  { code: "zh-TW", label: "繁體中文 (zh-TW)", sample: "你好" },
  { code: "ja", label: "日本語 (ja)", sample: "こんにちは" },
  { code: "ko", label: "한국어 (ko)", sample: "안녕하세요" },
  { code: "es", label: "Español (es)", sample: "Hola" },
  { code: "fr", label: "Français (fr)", sample: "Bonjour" },
  { code: "de", label: "Deutsch (de)", sample: "Hallo" },
  { code: "pt", label: "Português (pt)", sample: "Olá" },
  { code: "ru", label: "Русский (ru)", sample: "Привет" },
  { code: "it", label: "Italiano (it)", sample: "Ciao" },
  { code: "ar", label: "العربية (ar)", sample: "مرحبا" },
];

// Predefined page generation styles based on primary purpose
export const PAGE_STYLES = {
  landingPage: {
    name: "Landing page / Homepage",
    description: "Convert visitors into users or customers",
    content:
      "Optimizes for: Clear value proposition, compelling CTAs, social proof.\nSkips: Technical details, lengthy explanations.",
  },
  productShowcase: {
    name: "Product showcase",
    description: "Highlight features and benefits of your product",
    content:
      "Optimizes for: Feature demonstrations, use cases, visual examples.\nSkips: Implementation details, getting started guides.",
  },
  servicePages: {
    name: "Service pages",
    description: "Explain what you offer and how it helps customers",
    content:
      "Optimizes for: Service descriptions, benefits, pricing, testimonials.\nSkips: Technical specifications, detailed processes.",
  },
  aboutCompany: {
    name: "About / Company pages",
    description: "Build trust and tell your company story",
    content:
      "Optimizes for: Company story, team, values, achievements.\nSkips: Product details, technical information.",
  },
  blogContent: {
    name: "Blog / Content pages",
    description: "Engage audience with valuable content and insights",
    content:
      "Optimizes for: Engaging content, SEO optimization, shareability.\nSkips: Sales pitches, technical pages.",
  },
  contactSupport: {
    name: "Contact / Support pages",
    description: "Help visitors get in touch or find help",
    content:
      "Optimizes for: Clear contact methods, FAQ, support resources.\nSkips: Marketing content, detailed explanations.",
  },
  mixedPurpose: {
    name: "Multi-purpose website",
    description: "Comprehensive website covering multiple needs",
    content:
      "Optimizes for: Balanced coverage, multiple user journeys.\nTrade-off: More complex navigation, requires good structure.",
  },
};

// Predefined target audiences based on who will visit the pages most often
export const TARGET_AUDIENCES = {
  endUsers: {
    name: "End users (non-technical)",
    description: "People who use the product but don't code",
    content:
      "Writing: Plain language, UI-focused, avoid technical terms.\nExamples: Screenshots, step-by-step clicks, business outcomes.",
  },
  developers: {
    name: "Developers integrating your product/API",
    description: "Engineers adding this to their projects",
    content:
      "Writing: Code-first, copy-paste ready, technical accuracy.\nExamples: SDK usage, API calls, configuration snippets.",
  },
  devops: {
    name: "DevOps / SRE / Infrastructure teams",
    description: "Teams deploying, monitoring, maintaining systems",
    content:
      "Writing: Operations-focused, troubleshooting emphasis.\nExamples: Deployment configs, monitoring setup, scaling guides.",
  },
  decisionMakers: {
    name: "Technical decision makers",
    description: "Architects, leads evaluating or planning implementation",
    content:
      "Writing: High-level first, drill-down details available.\nExamples: Architecture diagrams, comparison tables, trade-offs.",
  },
  supportTeams: {
    name: "Support teams",
    description: "People helping others use the product",
    content:
      "Writing: Diagnostic-focused, common issues prominent.\nExamples: Troubleshooting flows, FAQ format, escalation paths.",
  },
  mixedTechnical: {
    name: "Mixed technical audience",
    description: "Developers, DevOps, and technical users",
    content:
      "Writing: Layered complexity, multiple entry points.\nExamples: Progressive disclosure, role-based navigation.",
  },
};

// Reader knowledge level - what do readers typically know when they arrive?
export const READER_KNOWLEDGE_LEVELS = {
  completeBeginners: {
    name: "Is a total beginner, starting from scratch",
    description: "New to this domain/technology entirely",
    content:
      "Content: Define terms, explain concepts, assume nothing.\nStructure: Linear progression, prerequisite checks.\nTone: Patient, educational, confidence-building.",
  },
  domainFamiliar: {
    name: "Has used similar tools before",
    description: "Know the problem space, new to this specific solution",
    content:
      'Content: Focus on differences, migration, unique features.\nStructure: Comparison-heavy, "coming from X" sections.\nTone: Efficient, highlight advantages, skip basics.',
  },
  experiencedUsers: {
    name: "Is an expert trying to do something specific",
    description: "Regular users needing reference/advanced topics",
    content:
      "Content: Dense information, edge cases, performance tips.\nStructure: Reference-style, searchable, task-oriented.\nTone: Concise, technical precision, assume competence.",
  },
  emergencyTroubleshooting: {
    name: "Emergency/troubleshooting",
    description: "Something's broken, need to fix it quickly",
    content:
      "Content: Symptom → diagnosis → solution format.\nStructure: Problem-first, solution-prominent, escalation paths.\nTone: Clear, actionable, confidence-inspiring.",
  },
  exploringEvaluating: {
    name: "Is evaluating this tool against others",
    description: "Trying to understand if this fits their needs",
    content:
      "Content: Use cases, comparisons, getting started quickly.\nStructure: Multiple entry points, progressive commitment.\nTone: Persuasive but honest, show value quickly.",
  },
};

// Page content depth - how comprehensive should the page content be?
export const PAGE_CONTENT_DEPTH = {
  essentialOnly: {
    name: "Essential only",
    description: "Cover the 80% use cases, keep it concise",
    content:
      "Scope: Core features, happy paths, common patterns.\nLength: Shorter sections, key examples only.\nMaintenance: Easier to keep current.",
  },
  balancedCoverage: {
    name: "Balanced coverage",
    description: "Good depth with practical examples [RECOMMENDED]",
    content:
      "Scope: Most features, some edge cases, multiple examples.\nLength: Moderate sections, varied example types.\nMaintenance: Reasonable update burden.",
  },
  comprehensive: {
    name: "Comprehensive",
    description: "Cover all features, edge cases, and advanced scenarios",
    content:
      "Scope: Everything, all parameters, extensive examples.\nLength: Detailed sections, comprehensive coverage.\nMaintenance: Higher update complexity.",
  },
  aiDecide: {
    name: "Let AI decide",
    description: "Analyze code complexity and suggest appropriate depth",
    content:
      "Scope: Adaptive based on codebase analysis.\nAI considers: API surface area, complexity, existing patterns.",
  },
};

// Purpose to Knowledge Level mapping for default suggestions
export const PURPOSE_TO_KNOWLEDGE_MAPPING = {
  getStarted: "completeBeginners", // Get started → Complete beginners
  findAnswers: "experiencedUsers", // Find answers → Experienced users
  solveProblems: "emergencyTroubleshooting", // Solve problems → Emergency/troubleshooting
  exploringEvaluating: "exploringEvaluating", // Exploring → Exploring/evaluating
};

// Page Content Depth recommendation logic
export const DEPTH_RECOMMENDATION_LOGIC = {
  // Purpose-based recommendations (highest priority)
  purposes: {
    getStarted: "essentialOnly", // Get started → Essential
  },
  // Audience-based recommendations (medium priority)
  audiences: {
    decisionMakers: "balancedCoverage", // Decision makers → Balanced
  },
  // Knowledge level-based recommendations (lowest priority)
  knowledgeLevels: {
    experiencedUsers: "comprehensive", // Experienced users → Comprehensive
  },
};

// Component mount point ID for Pages Kit (需要更新为实际的 Pages Kit DID)
export const PAGES_KIT_DID = "z8ia1WEiBZ7hxURf6LwH21Wpg99vophFwSJdu";

// Discuss Kit DID for web-smith
export const DISCUSS_KIT_DID = "z8ia1WEiBZ7hxURf6LwH21Wpg99vophFwSJdu";

// Pages Kit related URLs (需要更新为实际的 Pages Kit URLs)
export const PAGES_KIT_STORE_URL =
  "https://store.blocklet.dev/blocklets/z8ia1WEiBZ7hxURf6LwH21Wpg99vophFwSJdu";

// Discuss Kit store URL
export const DISCUSS_KIT_STORE_URL =
  "https://store.blocklet.dev/blocklets/z8ia1WEiBZ7hxURf6LwH21Wpg99vophFwSJdu";

export const BLOCKLET_ADD_COMPONENT_PAGES =
  "https://www.arcblock.io/docs/blocklet-developer/en/7zbw0GQXgcD6sCcjVfwqqT2s";

// Supported file extensions for content reading
export const SUPPORTED_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".json",
  ".yaml",
  ".yml",
];

// Conflict rules configuration for page generation
export const CONFLICT_RULES = {
  // Internal conflicts within the same question (multi-select conflicts)
  internalConflicts: {
    // Note: Most conflicts can be resolved through intelligent page structure planning
    // Only keeping conflicts that represent fundamental incompatibilities
  },

  // Cross-question conflicts (conflicts between different questions)
  crossConflicts: [
    {
      conditions: {
        pagePurpose: ["getStarted"],
        readerKnowledgeLevel: ["experiencedUsers"],
      },
      severity: "severe",
      reason:
        "Quick start tutorials are not suitable for experienced users who need advanced features and best practices",
      action: "filter",
      conflictingOptions: {
        readerKnowledgeLevel: ["experiencedUsers"],
      },
    },
    {
      conditions: {
        pagePurpose: ["findAnswers"],
        readerKnowledgeLevel: ["completeBeginners"],
      },
      severity: "severe",
      reason:
        "API reference pages skips beginner explanations and is not suitable for complete beginners",
      action: "filter",
      conflictingOptions: {
        readerKnowledgeLevel: ["completeBeginners"],
      },
    },
    {
      conditions: {
        pagePurpose: ["understandSystem"],
        readerKnowledgeLevel: ["emergencyTroubleshooting"],
      },
      severity: "severe",
      reason:
        "System architecture explanations are not suitable for emergency troubleshooting scenarios",
      action: "filter",
      conflictingOptions: {
        readerKnowledgeLevel: ["emergencyTroubleshooting"],
      },
    },
    {
      conditions: {
        targetAudienceTypes: ["endUsers"],
        readerKnowledgeLevel: ["experiencedUsers"],
      },
      severity: "severe",
      reason:
        "Non-technical users are typically not experienced technical users",
      action: "filter",
      conflictingOptions: {
        readerKnowledgeLevel: ["experiencedUsers"],
      },
    },
    {
      conditions: {
        targetAudienceTypes: ["decisionMakers"],
        readerKnowledgeLevel: ["emergencyTroubleshooting"],
      },
      severity: "severe",
      reason:
        "Decision makers typically do not directly handle emergency technical failures",
      action: "filter",
      conflictingOptions: {
        readerKnowledgeLevel: ["emergencyTroubleshooting"],
      },
    },
  ],
};

// Conflict resolution rules - defines how to handle conflicts when users select conflicting options
export const CONFLICT_RESOLUTION_RULES = {
  // Page purpose conflicts that can be resolved through structure planning
  pagePurpose: [
    {
      conflictItems: ["getStarted", "findAnswers"],
      strategy: "layered_structure",
      description:
        "Quick start and API reference conflict, resolved through layered structure",
    },
    {
      conflictItems: ["getStarted", "understandSystem"],
      strategy: "separate_sections",
      description:
        "Quick start and system understanding conflict, resolved through separate sections",
    },
    {
      conflictItems: ["completeTasks", "understandSystem"],
      strategy: "concepts_then_practice",
      description:
        "Task guidance and system understanding conflict, resolved through concepts-then-practice structure",
    },
    {
      conflictItems: ["findAnswers", "solveProblems"],
      strategy: "reference_with_troubleshooting",
      description:
        "API reference and problem solving conflict, resolved through reference with troubleshooting",
    },
  ],

  // Target audience conflicts that can be resolved through structure planning
  targetAudienceTypes: [
    {
      conflictItems: ["endUsers", "developers"],
      strategy: "separate_user_paths",
      description:
        "End users and developers conflict, resolved through separate user paths",
    },
    {
      conflictItems: ["endUsers", "devops"],
      strategy: "role_based_sections",
      description:
        "End users and DevOps conflict, resolved through role-based sections",
    },
    {
      conflictItems: ["developers", "decisionMakers"],
      strategy: "progressive_disclosure",
      description:
        "Developers and decision makers conflict, resolved through progressive disclosure",
    },
  ],
};

// Resolution strategy descriptions
export const RESOLUTION_STRATEGIES = {
  layered_structure: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" purpose conflict. Resolution strategy: Create layered page structure
- Quick start section: Uses "get started" style - optimizes for speed, key steps, working examples, skips complex edge cases
- API reference section: Uses "find answers" style - comprehensive coverage, searchability, rich examples, skips narrative flow
- Ensure sections complement rather than conflict with each other`,

  separate_sections: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" purpose conflict. Resolution strategy: Create separate sections
- Quick start section: Uses "get started" style - focuses on practical operations, completable within 30 minutes
- System understanding section: Uses "understand system" style - dedicated to explaining architecture, concepts, design decision rationale
- Meet different depth needs through clear section separation`,

  concepts_then_practice: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" purpose conflict. Resolution strategy: Use progressive "concepts-then-practice" structure
- Concepts section: Uses "understand system" style - first explains core concepts and architecture principles
- Practice section: Uses "complete tasks" style - then provides specific step guidance and practical scenarios
- Ensure smooth transition between theory and practice`,

  reference_with_troubleshooting: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" purpose conflict. Resolution strategy: Integrate troubleshooting into API reference
- API reference section: Uses "find answers" style - comprehensive feature pages and parameter descriptions
- Troubleshooting section: Uses "solve problems" style - add common issues and diagnostic methods for each feature
- Create dedicated problem diagnosis index for quick location`,

  separate_user_paths: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" audience conflict. Resolution strategy: Create separate user paths
- User guide path: Uses "end users" style - simple language, UI operations, screenshot instructions, business outcome oriented
- Developer guide path: Uses "developers" style - code-first, technical precision, SDK examples, configuration snippets
- Provide clear path navigation for users to choose appropriate entry point`,

  role_based_sections: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" audience conflict. Resolution strategy: Organize content by role
- Create dedicated sections for different roles, each section uses corresponding audience style
- Ensure content depth and expression precisely match the needs and background of corresponding audience
- Provide cross-references between sections to facilitate collaborative understanding between roles`,

  progressive_disclosure: (items) =>
    `Detected "${items.join(
      '" and "'
    )}" audience conflict. Resolution strategy: Use progressive information disclosure
- Overview level: Uses "decision makers" style - high-level architecture diagrams, decision points, business value
- Detail level: Uses "developers" style - technical implementation details, code examples, best practices
- Ensure smooth transition from strategic to tactical`,
};

export const D2_CONFIG = `vars: {
  d2-config: {
    layout-engine: elk
    theme-id: 0
    theme-overrides: {
      N1: "#2AA7A1"
      N2: "#73808C"

      N4: "#FFFFFF"
      N5: "#FAFBFC"

      N7: "#ffffff"

      B1: "#8EDDD9"
      B2: "#C9DCE6"
      B3: "#EEF9F9"
      B4: "#F7F8FA"
      B5: "#FCFDFD"
      B6: "#E3E9F0"


      AA2: "#9EB7C5"
      AA4: "#E3EBF2"
      AA5: "#F6FAFC"

      AB4: "#B8F1F6"
      AB5: "#E3F8FA"
    }
  }
}`;

export const KROKI_CONCURRENCY = 5;
export const FILE_CONCURRENCY = 3;
export const TMP_DIR = ".tmp";
export const TMP_PAGES_DIR = "pages";

export const TMP_ASSETS_DIR = "assets";
