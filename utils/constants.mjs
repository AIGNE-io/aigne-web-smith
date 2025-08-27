// Default file patterns for inclusion and exclusion
export const DEFAULT_INCLUDE_PATTERNS = [
  // JavaScript/TypeScript
  "*.js",
  "*.jsx",
  "*.ts",
  "*.tsx",
  "*.mjs",
  "*.mts",
  // Web Technologies
  "*.html",
  "*.htm",
  "*.css",
  // Documentation & Config
  "*.md",
  "*.rst",
  "*.json",
  "*.yaml",
  "*.yml",
  "*Dockerfile",
  "*Makefile",
  // Python
  "*.py",
  "*.pyi",
  // Other common languages
  "*.java",
  "*.go",
  "*.rs",
  "*.php",
  "*.rb",
  "*.swift",
];

export const DEFAULT_EXCLUDE_PATTERNS = [
  "**/aigne-web-smith/**",
  "**/web-smith/**",
  "**/.aigne/**",
  "**/assets/**",
  "**/data/**",
  "**/images/**",
  "**/public/**",
  "**/static/**",
  "**/vendor/**",
  "**/temp/**",
  "*test*",
  "**/*test/**",
  "**/*tests/**",
  "**/*examples/**",
  "**/playgrounds/**",
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
];

// Supported languages for website generation
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

// Website generation styles based on purpose
export const WEBSITE_STYLES = {
  business: {
    name: "Business Website",
    description: "Professional business website with conversion focus",
    content:
      "Focus on: Clear value proposition, call-to-actions, trust signals, services/products showcase",
  },
  portfolio: {
    name: "Portfolio Website",
    description: "Personal or creative portfolio showcasing work",
    content:
      "Focus on: Work showcase, about section, contact info, visual appeal, personal branding",
  },
  blog: {
    name: "Blog/Content Website",
    description: "Content-focused website with regular updates",
    content:
      "Focus on: Content organization, readability, social sharing, archive structure",
  },
  ecommerce: {
    name: "E-commerce Website",
    description: "Online store with product catalog and purchasing",
    content:
      "Focus on: Product showcase, shopping cart, payment integration, user accounts",
  },
  landing: {
    name: "Landing Page",
    description: "Single-page conversion focused site",
    content:
      "Focus on: Single conversion goal, minimal navigation, strong CTA, social proof",
  },
  corporate: {
    name: "Corporate Website",
    description: "Large company or organization website",
    content:
      "Focus on: Company info, services, team, news, investor relations, compliance",
  },
};

// Target audiences for website generation
export const TARGET_AUDIENCES = {
  consumers: {
    name: "General Consumers",
    description: "End users looking for products or services",
    content:
      "Language: Simple, benefit-focused, emotional appeal. Design: Clean, intuitive, mobile-first.",
  },
  businesses: {
    name: "Businesses (B2B)",
    description: "Companies looking for business solutions",
    content:
      "Language: Professional, ROI-focused, case studies. Design: Trust-building, data-driven, detailed.",
  },
  developers: {
    name: "Developers/Technical Users",
    description: "Technical professionals and developers",
    content:
      "Language: Technical accuracy, code examples, API docs. Design: Functional, documentation-rich.",
  },
  investors: {
    name: "Investors/Stakeholders",
    description: "Potential investors and business stakeholders",
    content:
      "Language: Data-driven, growth metrics, market opportunity. Design: Professional, chart/graph heavy.",
  },
  customers: {
    name: "Existing Customers",
    description: "Current users looking for support or updates",
    content:
      "Language: Helpful, solution-oriented, clear instructions. Design: Self-service focused, searchable.",
  },
  mixed: {
    name: "Mixed Audience",
    description: "Multiple audience types with varied needs",
    content:
      "Language: Layered complexity, multiple entry points. Design: Flexible navigation, role-based content.",
  },
};

// Pages Kit related constants
export const PAGES_KIT_API_BASE = process.env.PAGES_KIT_API_BASE;

// Supported file extensions for content reading
export const SUPPORTED_FILE_EXTENSIONS = [
  ".txt",
  ".md",
  ".json",
  ".yaml",
  ".yml",
];

// Common SEO and conversion optimization patterns
export const SEO_PATTERNS = {
  titleLength: { min: 30, max: 60 },
  descriptionLength: { min: 120, max: 160 },
  headingStructure: ["h1", "h2", "h3", "h4", "h5", "h6"],
  keywordDensity: { min: 0.5, max: 3.0 },
};

// Common website component types
export const COMPONENT_CATEGORIES = {
  hero: ["Hero Block", "Banner", "Intro Section"],
  content: ["Content Cards Block", "Feature List", "Text Block"],
  navigation: ["Menu", "Breadcrumb", "Pagination"],
  forms: ["Contact Form", "Newsletter Signup", "Search"],
  social: ["Social Media Links", "Share Buttons", "Testimonials"],
  cta: ["CTA Block", "Button", "Call-to-Action"],
  media: ["Image Gallery", "Video Player", "Carousel"],
  info: ["FAQ Block", "Pricing Table", "Team"],
};
