import { homedir } from "node:os";
import { join } from "node:path";

export const ENABLE_LOGS = process.env.ENABLE_LOGS === "true";

// Define media file extensions
export const MEDIA_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".heic",
  ".heif",
  ".mp4",
  ".mpeg",
  ".mpg",
  ".mov",
  ".avi",
  ".flv",
  ".mkv",
  ".webm",
  ".wmv",
  ".m4v",
  ".3gpp",
];

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
  ecommerce: {
    name: "E-commerce / Online store",
    description: "Sell products or services online",
    content:
      "Optimizes for: Product catalogs, shopping cart, payment flow, customer reviews.\nSkips: Corporate information, technical documentation.",
  },
  portfolio: {
    name: "Portfolio / Showcase",
    description: "Display creative work, projects, or achievements",
    content:
      "Optimizes for: Visual presentations, project galleries, case studies.\nSkips: Complex navigation, text-heavy content.",
  },
  corporate: {
    name: "Corporate / Business",
    description: "Professional business website with company information",
    content:
      "Optimizes for: Company overview, services, team, contact information.\nSkips: Personal elements, informal content.",
  },
  blog: {
    name: "Blog / Content site",
    description: "Share articles, news, and regular content updates",
    content:
      "Optimizes for: Content organization, SEO, social sharing, archives.\nSkips: Complex interactions, e-commerce features.",
  },
  saas: {
    name: "SaaS / Software product",
    description: "Promote and onboard users to software services",
    content:
      "Optimizes for: Feature explanations, pricing, demos, user onboarding.\nSkips: Physical product details, offline services.",
  },
  nonprofit: {
    name: "Non-profit / Community",
    description: "Promote causes, accept donations, engage volunteers",
    content:
      "Optimizes for: Mission statements, donation flows, volunteer sign-ups.\nSkips: Commercial sales, profit-driven content.",
  },
  education: {
    name: "Educational / Learning",
    description: "Provide courses, tutorials, or educational content",
    content:
      "Optimizes for: Course listings, learning paths, progress tracking.\nSkips: Commercial sales, non-educational content.",
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
  customers: {
    name: "Customers / End users",
    description: "People who buy or use your products/services",
    content:
      "Writing: Clear benefits, simple language, trust signals.\nExamples: Success stories, testimonials, easy navigation.",
  },
  businessOwners: {
    name: "Business owners / Entrepreneurs",
    description: "People running businesses looking for solutions",
    content:
      "Writing: ROI-focused, time-saving benefits, professional tone.\nExamples: Case studies, pricing, business outcomes.",
  },
  marketers: {
    name: "Marketing teams",
    description: "People promoting products or managing campaigns",
    content:
      "Writing: Campaign-focused, metrics-driven, brand-aware.\nExamples: Marketing tools, analytics, content strategies.",
  },
  designers: {
    name: "Designers / Creative professionals",
    description: "People focused on visual design and user experience",
    content:
      "Writing: Visual-first, aesthetic considerations, inspiration-driven.\nExamples: Design showcases, visual tools, creative workflows.",
  },
  developers: {
    name: "Developers / Technical users",
    description: "People building or integrating technical solutions",
    content:
      "Writing: Code-first, technical accuracy, implementation-focused.\nExamples: APIs, documentation, technical specifications.",
  },
  investors: {
    name: "Investors / Stakeholders",
    description: "People evaluating business potential and growth",
    content:
      "Writing: Growth metrics, market opportunity, financial projections.\nExamples: Business plans, market data, investment highlights.",
  },
  jobSeekers: {
    name: "Job seekers / Potential employees",
    description: "People looking for career opportunities",
    content:
      "Writing: Culture-focused, career growth, benefits-oriented.\nExamples: Job listings, company culture, employee testimonials.",
  },
  students: {
    name: "Students / Learners",
    description: "People seeking educational content or resources",
    content:
      "Writing: Educational tone, step-by-step guidance, progress tracking.\nExamples: Tutorials, courses, learning materials.",
  },
  generalPublic: {
    name: "General public / Mixed audience",
    description: "Broad audience with varied interests and backgrounds",
    content:
      "Writing: Accessible language, multiple entry points, broad appeal.\nExamples: Clear navigation, varied content types, universal design.",
  },
};

// Website scale - how many pages and sections should be generated?
export const WEBSITE_SCALE = {
  singlePage: {
    name: "Single Page (only 1 page)",
    description: "All content consolidated into 1 page",
    content:
      "Includes: All key information in one scrollable page with sections.\nBest for: Landing pages, simple portfolios, documentation sites.\n **Only 1 page with multiple sections.**",
    max: 1,
  },
  minimal: {
    name: "Minimal (2-6 pages)",
    description: "Core pages only - quick to launch",
    content:
      "Includes: Home, About, Services/Products, Contact.\nBest for: MVP, landing pages, simple business sites.\n ** Expected pages: 2-6 pages. **",
    max: 6,
  },
  standard: {
    name: "Standard (7-12 pages)",
    description: "Complete website with main sections [RECOMMENDED]",
    content:
      "Includes: All minimal pages plus portfolio/blog, team, FAQ, pricing.\nBest for: Professional business sites, portfolios, small e-commerce.\n ** Expected pages: 7-12 pages. **",
    max: 12,
  },
  comprehensive: {
    name: "Comprehensive (12+ pages)",
    description: "Full-featured website with detailed sections",
    content:
      "Includes: All standard pages plus detailed service pages, case studies, resources.\nBest for: Large businesses, complex products, content-rich sites.\n ** Expected pages: 12+ pages. **",
  },
  aiDecide: {
    name: "Let AI decide",
    description: "Analyze project complexity and suggest appropriate scale",
    content:
      "Scope: Adaptive based on website type, audience, and codebase analysis.\nAI considers: Business needs, content volume, maintenance capacity.",
  },
};

// Purpose to Website Scale mapping for default suggestions
export const PURPOSE_TO_SCALE_MAPPING = {
  landingPage: "singlePage", // Landing page → Single Page
  portfolio: "standard", // Portfolio → Standard
  corporate: "comprehensive", // Corporate → Comprehensive
  ecommerce: "comprehensive", // E-commerce → Comprehensive
};

// Website Scale recommendation logic
export const SCALE_RECOMMENDATION_LOGIC = {
  // Purpose-based recommendations (highest priority)
  purposes: {
    landingPage: "singlePage", // Landing page → Single Page
    portfolio: "standard", // Portfolio → Standard
    corporate: "comprehensive", // Corporate → Comprehensive
    ecommerce: "comprehensive", // E-commerce → Comprehensive
  },
  // Audience-based recommendations (medium priority)
  audiences: {
    customers: "standard", // Customers → Standard
    businessOwners: "comprehensive", // Business owners → Comprehensive
    investors: "comprehensive", // Investors → Comprehensive
  },
};

export const LINK_PROTOCOL = "link://";

export const RESOLVE_FILE_PROTOCOL = "@";

export const MEDIA_KIT_PROTOCOL = "mediakit://";

export const DEFAULT_APP_LOGO =
  "https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg";

// Default application URL for the document deployment website.
export const CLOUD_SERVICE_URL_PROD = "https://websmith.aigne.io";
export const CLOUD_SERVICE_URL_STAGING = "https://staging.websmith.aigne.io";

// Pages Kit DID for web-smith
export const PAGES_KIT_DID = "z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o";

export const MEDIA_KIT_DID = "z8ia1mAXo8ZE7ytGF36L5uBf9kD2kenhqFGp9";

// Pages Kit store URL
export const PAGES_KIT_STORE_URL =
  "https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o";

export const BLOCKLET_ADD_COMPONENT_PAGES =
  "https://www.arcblock.io/docs/blocklet-developer/en/7zbw0GQXgcD6sCcjVfwqqT2s";

// Environment variable name for the official API access token used for authentication
export const WEB_OFFICIAL_ACCESS_TOKEN = "WEB_OFFICIAL_ACCESS_TOKEN";

// Supported file extensions for content reading
export const SUPPORTED_FILE_EXTENSIONS = [".txt", ".md", ".json", ".yaml", ".yml"];

// Conflict rules configuration for page generation
export const CONFLICT_RULES = {
  // Internal conflicts within the same question (multi-select conflicts)
  internalConflicts: {
    // Note: Most conflicts can be resolved through intelligent page structure planning
    // Only keeping conflicts that represent fundamental incompatibilities
  },

  // Cross-question conflicts (conflicts between different questions)
  crossConflicts: [
    // Most conflicts are now resolved through intelligent page structure planning
    // Only keeping fundamental incompatibilities for web-focused configurations
  ],
};

// Conflict resolution rules - defines how to handle conflicts when users select conflicting options
export const CONFLICT_RESOLUTION_RULES = {
  // Page purpose conflicts that can be resolved through structure planning
  pagePurpose: [
    {
      conflictItems: ["getStarted", "findAnswers"],
      strategy: "layered_structure",
      description: "Quick start and API reference conflict, resolved through layered structure",
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
      description: "End users and developers conflict, resolved through separate user paths",
    },
    {
      conflictItems: ["endUsers", "devops"],
      strategy: "role_based_sections",
      description: "End users and DevOps conflict, resolved through role-based sections",
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
    `Detected "${items.join('" and "')}" purpose conflict. Resolution strategy: Create layered page structure
- Quick start section: Uses "get started" style - optimizes for speed, key steps, working examples, skips complex edge cases
- API reference section: Uses "find answers" style - comprehensive coverage, searchability, rich examples, skips narrative flow
- Ensure sections complement rather than conflict with each other`,

  separate_sections: (items) =>
    `Detected "${items.join('" and "')}" purpose conflict. Resolution strategy: Create separate sections
- Quick start section: Uses "get started" style - focuses on practical operations, completable within 30 minutes
- System understanding section: Uses "understand system" style - dedicated to explaining architecture, concepts, design decision rationale
- Meet different depth needs through clear section separation`,

  concepts_then_practice: (items) =>
    `Detected "${items.join(
      '" and "',
    )}" purpose conflict. Resolution strategy: Use progressive "concepts-then-practice" structure
- Concepts section: Uses "understand system" style - first explains core concepts and architecture principles
- Practice section: Uses "complete tasks" style - then provides specific step guidance and practical scenarios
- Ensure smooth transition between theory and practice`,

  reference_with_troubleshooting: (items) =>
    `Detected "${items.join(
      '" and "',
    )}" purpose conflict. Resolution strategy: Integrate troubleshooting into API reference
- API reference section: Uses "find answers" style - comprehensive feature pages and parameter descriptions
- Troubleshooting section: Uses "solve problems" style - add common issues and diagnostic methods for each feature
- Create dedicated problem diagnosis index for quick location`,

  separate_user_paths: (items) =>
    `Detected "${items.join('" and "')}" audience conflict. Resolution strategy: Create separate user paths
- User guide path: Uses "end users" style - simple language, UI operations, screenshot instructions, business outcome oriented
- Developer guide path: Uses "developers" style - code-first, technical precision, SDK examples, configuration snippets
- Provide clear path navigation for users to choose appropriate entry point`,

  role_based_sections: (items) =>
    `Detected "${items.join('" and "')}" audience conflict. Resolution strategy: Organize content by role
- Create dedicated sections for different roles, each section uses corresponding audience style
- Ensure content depth and expression precisely match the needs and background of corresponding audience
- Provide cross-references between sections to facilitate collaborative understanding between roles`,

  progressive_disclosure: (items) =>
    `Detected "${items.join('" and "')}" audience conflict. Resolution strategy: Use progressive information disclosure
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

// Page file extension
export const PAGE_FILE_EXTENSION = ".yaml";

export const PAGES_OUTPUT_DIR = "output";

export const PAGES_TMP_DIR = "workspace";

export const COMPONENTS_DIR = "assets/components";

export const BUILTIN_COMPONENT_LIBRARY_NAME = "builtin-component-library.yaml";

export const LIST_KEY = "list";

export const SECTION_META_FIELDS = ["sectionName", "sectionSummary", "fieldCombinations"];

export const DEFAULT_PAGE_STYLE = {
  maxWidth: "custom:1440px",
  paddingY: "normal",
  paddingX: "normal",
};

export const EMPTY_VALUE = "___EMPTY_VALUE___";

export const KEEP_CONFIG_KEYS = ["paddingX", "paddingY", "borderRadius", "border", "background"];

export const BUNDLE_FILENAME = "publish-bundle.json";

export const WEB_SMITH_DIR = ".aigne/web-smith";
export const WEB_SMITH_CONFIG_PATH = `./${WEB_SMITH_DIR}/config.yaml`;

export const DEFAULT_PROJECT_ID = "pg4d0000-0000-4000-a000-000000000000";
export const DEFAULT_PROJECT_SLUG = "/";

export const NAVIGATIONS_FILE_NAME = "_navigations.yaml";
export const WEB_SMITH_ENV_FILE = join(homedir(), ".aigne", "web-smith-connected.yaml");
