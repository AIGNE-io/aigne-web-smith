<datasources>
// sourceId: README.md
# AIGNE WebSmith

AIGNE WebSmith is a powerful, AI-driven website generation tool built on the [AIGNE Framework](https://www.aigne.io/en/framework). It automates the creation of professional, SEO-optimized websites with complete content, templates, and direct publishing to Pages Kit.

## ✨ Features

### 🤖 AI-Powered Website Generation

- **Intelligent Structure Planning**: Automatically analyze requirements and generate optimal website architecture
- **Batch Content Generation**: Generate detailed content for all pages with one command
- **Professional SEO Optimization**: Built-in SEO best practices and optimization recommendations
- **Multi-language Support**: Supports Chinese and English content generation and localization

### 🎨 Professional Template System

- **Pages Kit Integration**: Direct generation of Pages Kit-compatible YAML templates
- **Component-based Design**: Supports modern components like Hero, CTA, FAQ, Content Cards
- **Builtin Component Library**: Integrated component library with validation and management
- **Responsive Layout**: Automatic adaptation for mobile and desktop displays
- **Visual Editing**: Generated templates support visual editing and adjustments

### 📊 Quality Assurance

- **Structure Evaluation System**: Automatic assessment of website architecture and user experience
- **Content Quality Checks**: Ensure accuracy and consistency of content
- **Complete Test Coverage**: 32+ test cases covering core functionality
- **Code Quality Assurance**: Code checking and formatting using Biome

### 🚀 One-Click Publishing

- **Direct Publishing**: One-click publishing to Pages Kit platform
- **Batch Upload**: Supports batch publishing of multi-page websites
- **Status Monitoring**: Detailed publishing status and error reporting
- **Access Links**: Get accessible website links immediately after successful publishing

## 🏗️ Architecture

WebSmith is built on the AIGNE framework using an Agent-based architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Structure      │    │  Content        │    │  Template       │
│  Planning       │───▶│  Generation     │───▶│  Generation     │
│  Agent          │    │  Agent          │    │  Agent          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Evaluation     │    │  Batch          │    │  Upload         │
│  Agent          │    │  Processing     │    │  Agent          │
│                 │    │  Agent          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

- **🧠 Structure Planning**: Intelligently analyze requirements and generate website architecture
- **📝 Content Generation**: Batch generate high-quality page content
- **🎨 Template Generation**: Create Pages Kit compatible templates
- **🧩 Component Library**: Built-in component library management and validation
- **📊 Quality Evaluation**: Evaluate website quality and user experience
- **⚡ Batch Processing**: Efficient batch processing system
- **🚀 Pages Kit Upload**: One-click publishing to Pages Kit

## 🚀 Quick Start

### Installation

```bash
# Install AIGNE CLI
npm install -g @aigne/cli

# Or install locally
npm install @aigne/cli
```

### Basic Usage

#### 1. Generate a Website

```bash
# Generate pages
aigne web generate
```

#### 2. Publish to Pages Kit

```bash
# Publish generated pages
aigne web publish
```

#### 3. Additional Commands

```bash
# Translate existing pages to different language
aigne web translate

# Update existing website content
aigne web update

```

### Example Input

Create an input file `my-website.yaml`:

```yaml
rules: |
  Create a modern SaaS product website that includes:
  1. Product introduction and core features
  2. Pricing plan comparison
  3. Customer success stories
  4. Technical documentation portal
  5. Contact and support pages

  Requirements:
  - Professional business style
  - Highlight product advantages and differentiation
  - Include clear CTA to guide users to trial

targetAudience: SMB owners and technical decision makers
locale: en
websiteStyle: business
projectId: your-pages-kit-project-id
```

Then run:

```bash
aigne web generate --input @my-website.yaml
```

## 📁 Project Structure

```
aigne-web-smith/
├── agents/                 # Core AI agents
│   ├── chat/              # Interactive chat interface
│   ├── generate/          # Website generation workflows
│   │   ├── component-library/  # Component library management
│   │   ├── page-detail/        # Page content generation
│   │   └── page-data/          # Page data composition
│   ├── plan/              # Website structure planning
│   ├── publish/           # Pages Kit publishing
│   ├── translate/         # Multi-language support
│   ├── update/            # Content update workflows
│   └── utils/             # Utility functions and helpers
├── prompts/               # AI prompts and templates
│   ├── chat/, generate/, plan/, translate/
├── utils/                 # Core utility functions
│   ├── constants.mjs          # Component definitions and constants
│   ├── generate-helper.mjs    # Website generation utilities
│   ├── auth-utils.mjs         # Authentication handling
│   ├── pages-finder-utils.mjs # Page discovery and management
│   └── upload-files.mjs       # File upload utilities
├── pages-mcp/             # MCP server implementation
│   ├── get-pages-structure.mjs
│   └── get-page-detail.mjs
└── aigne.yaml            # Main CLI configuration
```

## 🧪 Testing

WebSmith includes comprehensive test coverage:

```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage --coverage-reporter=lcov --coverage-reporter=text

# Run with verbose output
bun test --verbose
```

Test coverage includes:

- ✅ Utility function tests
- ✅ Pages Kit integration tests
- ✅ Website structure tests
- ✅ File system and error handling tests
- ✅ Component library validation tests

## 🔧 Development

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Run code quality checks
npm run lint

# Auto-fix formatting issues
npm run lint:fix

# Watch mode for tests
bun test --watch
```

### Adding New Components

1. **Create Agent**: Add new `.yaml` agent in appropriate `agents/` subdirectory
2. **Add Prompt**: Create corresponding prompt in `prompts/`
3. **Update Config**: Add agent to `aigne.yaml`
4. **Write Tests**: Add tests using Bun test framework
5. **Update Docs**: Document the new functionality

### Code Quality

- **Linting**: Uses Biome for code quality and formatting
- **Testing**: Bun test runner with comprehensive coverage
- **Type Safety**: JSDoc annotations for better development experience
- **Git Hooks**: Pre-commit hooks ensure code quality

## 📚 API Reference

### Main Commands

#### chat

Interactive chat interface for website generation.

#### generate (aliases: gen, g)

Generate a complete website from user requirements.

**Parameters:**

- `rules` (required): Website requirements description
- `targetAudience`: Target audience description
- `locale`: Website language (default: "zh")
- `websiteStyle`: Website style (default: "business")
- `projectId`: Pages Kit project ID for publishing

#### publish

Publish generated website to Pages Kit.

**Parameters:**

- `projectId` (required): Pages Kit project ID
- `locale`: Website language
- `dryRun`: Preview without publishing
- `overwrite`: Overwrite existing pages

#### translate

Translate existing website content to different languages.

#### update

Update existing website content with new requirements.

### MCP Server

WebSmith provides MCP server endpoints for integration:

- `get-pages-structure`: Retrieve current website structure
- `get-page-detail`: Get detailed content for specific page
- `pages-search`: Search within website content

Start MCP server:

```bash
aigne web serve-mcp
```

## 📊 Performance

WebSmith is optimized for production use:

- **Fast Generation**: Parallel agent processing
- **Efficient Templates**: Optimized Pages Kit integration
- **Memory Management**: Streaming content processing
- **Error Recovery**: Robust error handling and recovery

Typical performance metrics:

- 5-page website: ~2-3 minutes
- 15-page website: ~5-8 minutes
- Template generation: ~10-20 seconds per page

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run quality checks: `npm run lint`
5. Submit a pull request

## 📄 License

This project is licensed under the Elastic License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- 🌐 [AIGNE Framework](https://www.aigne.io/en/framework)
- 📖 [WebSmith Official Website](https://www.aigne.io/web-smith)
- 🎯 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)
- 🐛 [Report Issues](https://github.com/AIGNE-io/aigne-web-smith/issues)

---

**Built with ❤️ using the AIGNE Framework**

// sourceId: package.json
{
"name": "@aigne/web-smith",
"version": "1.2.1-beta",
"description": "",
"publishConfig": {
"access": "public"
},
"main": "index.js",
"scripts": {
"test": "bun test",
"test:coverage": "bun test --coverage --coverage-reporter=lcov --coverage-reporter=text",
"test:watch": "bun test --watch",
"lint": "biome check",
"update:deps": "npx -y taze major -r -w -f -n '/@abtnode|@aigne|@arcblock|@blocklet|@did-connect|@did-pay|@did-space|@nft-store|@nft-studio|@ocap/' && pnpm install && pnpm run deduplicate",
"deduplicate": "pnpm dedupe",
"lint:fix": "biome check --write"
},
"type": "module",
"bin": "aigne.yaml",
"keywords": [],
"author": "AIGNE <blocklet@arcblock.io> https://github.com/AIGNE-io",
"license": "Elastic License 2.0",
"dependencies": {
"@aigne/aigne-hub": "^0.9.2",
"@aigne/anthropic": "^0.13.2",
"@aigne/cli": "^1.46.1",
"@aigne/core": "^1.60.1",
"@aigne/gemini": "^0.13.2",
"@aigne/openai": "^0.15.2",
"chalk": "^5.5.0",
"dompurify": "^3.2.6",
"fs-extra": "^11.3.1",
"glob": "^11.0.3",
"jsdom": "^26.1.0",
"lodash": "^4.17.21",
"mermaid": "^11.9.0",
"nanoid": "^5.1.5",
"open": "^10.2.0",
"p-limit": "^7.1.1",
"p-map": "^7.0.3",
"p-retry": "^7.0.0",
"remark-gfm": "^4.0.1",
"remark-lint": "^10.0.1",
"remark-parse": "^11.0.0",
"slugify": "^1.6.6",
"terminal-link": "^4.0.0",
"transliteration": "^2.3.5",
"ufo": "^1.6.1",
"unified": "^11.0.5",
"unist-util-visit": "^5.0.0",
"vfile": "^6.0.3",
"yaml": "^2.8.0",
"zod": "^3.25.76",
"zod-to-json-schema": "^3.24.6"
},
"devDependencies": {
"@biomejs/biome": "^2.1.4"
}
}

// sourceId: aigne.yaml
#!/usr/bin/env aigne

chat_model:
provider: google
name: gemini-2.5-pro
temperature: 0.8

# name: gemini-2.5-flash

# provider: openai

# name: gpt-5-nano

# temperature: 1

agents:

# chat

- ./agents/chat/index.yaml

# clear

- ./agents/clear/index.yaml

# generate

- ./agents/generate/index.yaml

# generate component library

- ./agents/generate/component-library/load-component-library.mjs
- ./agents/generate/component-library/analyze-component-library.mjs
- ./agents/generate/component-library/generate-component-library.yaml
- ./agents/generate/component-library/parse-component-library.mjs
- ./agents/generate/component-library/save-component-library.mjs
- ./agents/generate/component-library/validate-component-library.mjs

# generate page detail

- ./agents/generate/page-detail/batch-generate-page-detail.yaml
- ./agents/generate/page-detail/generate-page-detail.yaml
- ./agents/generate/page-detail/generate-page-detail-team.yaml
- ./agents/generate/page-detail/analyze-page-detail.mjs

# generate page data

- ./agents/generate/page-data/compose-pages-data.mjs
- ./agents/generate/page-data/save-pages-data.mjs
- ./agents/generate/page-data/validate-pages-data.mjs

# init

- ./agents/init/index.mjs

# plan

- ./agents/plan/index.yaml
- ./agents/plan/analyze-website-structure.mjs
- ./agents/plan/generate-website-structure.yaml
- ./agents/plan/validate-website-structure.yaml

# prefs

- ./agents/prefs/index.mjs

# publish

- ./agents/publish/index.yaml
- ./agents/publish/publish-website.mjs

# translate

- ./agents/translate/index.yaml
- ./agents/translate/translate-page-detail.yaml
- ./agents/translate/choose-language.mjs
- ./agents/translate/translate-page-detail-team.yaml
- ./agents/translate/batch-translate-page-detail.yaml
- ./agents/translate/analyze-translate-page-detail.mjs

# update

- ./agents/update/index.yaml

# utils

- ./agents/utils/check-detail-result.mjs
- ./agents/utils/check-feedback-refiner.mjs
- ./agents/utils/choose-pages.mjs
- ./agents/utils/exit.mjs
- ./agents/utils/feedback-refiner.yaml
- ./agents/utils/find-item-by-path.mjs
- ./agents/utils/find-user-preferences-by-path.mjs
- ./agents/utils/transform-website-structure.yaml
- ./agents/utils/format-website-structure.mjs
- ./agents/utils/fs.mjs
- ./agents/utils/load-config.mjs
- ./agents/utils/load-sources.mjs
- ./agents/utils/pages-fs-actor.yaml
- ./agents/utils/save-output.mjs
- ./agents/utils/save-pages.mjs
- ./agents/utils/save-single-page.mjs
- ./agents/utils/transform-detail-datasources.mjs

cli:
chat: ./agents/chat/index.yaml
agents: - ./agents/init/index.mjs - ./agents/generate/index.yaml - ./agents/update/index.yaml - ./agents/publish/index.yaml - ./agents/translate/index.yaml - ./agents/prefs/index.mjs
mcp_server:
agents: - ./pages-mcp/get-pages-structure.mjs - ./pages-mcp/get-page-detail.mjs

// sourceId: CHANGELOG.md

# Changelog

## [1.2.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.0-beta...v1.2.1-beta) (2025-09-22)

### Features

- add clear command ([f47c4f0](https://github.com/AIGNE-io/aigne-web-smith/commit/f47c4f02b89239069956c0de16d03d3195618609))

### Bug Fixes

- publish website bug ([4b78416](https://github.com/AIGNE-io/aigne-web-smith/commit/4b7841672514f6c246d929241f4467766923e8e1))

### Miscellaneous Chores

- release 1.2.1-beta ([2539006](https://github.com/AIGNE-io/aigne-web-smith/commit/2539006477de0218764d43d8393dbfa0941278dd))

## [1.2.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.5-beta...v1.2.0-beta) (2025-09-19)

### Features

- **core:** support builtin component library ([#21](https://github.com/AIGNE-io/aigne-web-smith/issues/21)) ([6a7b69a](https://github.com/AIGNE-io/aigne-web-smith/commit/6a7b69a3b915dd32968be3e8675347db66654941))

## [1.1.5-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.4-beta...v1.1.5-beta) (2025-09-19)

### Bug Fixes

- **core:** compose page data error and page cache ([2b70d0d](https://github.com/AIGNE-io/aigne-web-smith/commit/2b70d0d8d7275419f5de0957f778cf02b89f4052))

## [1.1.4-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.3-beta...v1.1.4-beta) (2025-09-19)

### Miscellaneous Chores

- release 1.1.4-beta ([b6a77a6](https://github.com/AIGNE-io/aigne-web-smith/commit/b6a77a64b24246877e0e9f062e2ade2452411ba8))

## [1.1.3-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.2-beta...v1.1.3-beta) (2025-09-19)

### Miscellaneous Chores

- release 1.1.3-beta ([818aaf1](https://github.com/AIGNE-io/aigne-web-smith/commit/818aaf18ec83c9ab9606beb4d6ec6f9880d8b512))

## [1.1.2-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.1-beta...v1.1.2-beta) (2025-09-18)

### Miscellaneous Chores

- release 1.1.2-beta ([14e8a8c](https://github.com/AIGNE-io/aigne-web-smith/commit/14e8a8cc460a098b0c0e343329c7bc1eeca2f06a))

## [1.1.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.0...v1.1.1-beta) (2025-09-16)

### Bug Fixes

- **ci:** support publish beta releases ([#14](https://github.com/AIGNE-io/aigne-web-smith/issues/14)) ([19fe484](https://github.com/AIGNE-io/aigne-web-smith/commit/19fe48495f4ecf35903ea23d4a92da057e903478))

## [1.1.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.6...v1.1.0) (2025-09-15)

### Features

- optimize website publish logic ([#11](https://github.com/AIGNE-io/aigne-web-smith/issues/11)) ([54952c8](https://github.com/AIGNE-io/aigne-web-smith/commit/54952c8885eb57b20c14a58983e0859b1ece6ee0))

## [1.0.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.4...v1.0.6) (2025-09-15)

### Features

- allow publish website without projectId ([737aaf3](https://github.com/AIGNE-io/aigne-web-smith/commit/737aaf34822f861d2d6d9dc3baddf8f03336b288))
- allow publish website without projectId ([5c9a2e2](https://github.com/AIGNE-io/aigne-web-smith/commit/5c9a2e225f400dc5aed21ca50ae3491f50fcdc74))

### Bug Fixes

- **cli:** add error handling for component parser ([22a5752](https://github.com/AIGNE-io/aigne-web-smith/commit/22a575228023a08270815cf92edf37a7a6c17d83))
- **cli:** ignore component parser error ([005d78f](https://github.com/AIGNE-io/aigne-web-smith/commit/005d78fa0883c2ae30a8c345803281e47f592ac1))

### Miscellaneous Chores

- release 1.0.6 ([b9a7d82](https://github.com/AIGNE-io/aigne-web-smith/commit/b9a7d82ad273fd4eb93d16b64cca790faef1c4fe))

## [1.0.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.4...v1.0.5) (2025-09-13)

### Bug Fixes

- **cli:** ignore component parser error ([005d78f](https://github.com/AIGNE-io/aigne-web-smith/commit/005d78fa0883c2ae30a8c345803281e47f592ac1))

## [1.0.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.3...v1.0.4) (2025-09-12)

### Bug Fixes

- **cli:** resolve the bug of duplicate temperature key ([9288905](https://github.com/AIGNE-io/aigne-web-smith/commit/928890579f8238cdfa0644ada77a67161ceb0509))

## [1.0.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.2...v1.0.3) (2025-09-12)

### Bug Fixes

- **cli:** eslint error ([7efd1d6](https://github.com/AIGNE-io/aigne-web-smith/commit/7efd1d63adc791803b2ee940c0a6776e7852f5ff))
- **cli:** resolve the bug of name not defined ([966e86d](https://github.com/AIGNE-io/aigne-web-smith/commit/966e86d81172476a73e1aa6d3d18fdc51baee1d2))

## [1.0.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.1...v1.0.2) (2025-09-11)

### Bug Fixes

- **cli:** resolve the bug of content error ([28b61e7](https://github.com/AIGNE-io/aigne-web-smith/commit/28b61e7ad95ddcc0ce113a6cb177471f9f12b330))

## [1.0.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.0...v1.0.1) (2025-09-11)

### Bug Fixes

- **ci:** publish npmjs error ([251ff28](https://github.com/AIGNE-io/aigne-web-smith/commit/251ff2880682fdd57a7bd8cb65e9660c2ae98e71))

## 1.0.0 (2025-09-11)

### Features

- init repo ([b559448](https://github.com/AIGNE-io/aigne-web-smith/commit/b559448c43030a8a73608a1194918da386608d5b))

// sourceId: agents/translate/index.yaml
type: team
name: translate
description: Translate page content to chosen languages
skills:

- url: ../init/index.mjs
  default_input:
  skipIfExists: true
- ../utils/load-config.mjs
- ../utils/load-sources.mjs
- ../utils/transform-website-structure.yaml
- url: ../utils/choose-pages.mjs
  default_input:
  isTranslate: true
- ./choose-language.mjs
- type: team
  name: batchTranslatePageDetail
  skills:
  - ./translate-page-detail-team.yaml
  - url: ../utils/save-single-page.mjs
    default_input:
    isTranslate: true
    iterate_on: selectedPages
    concurrency: 10
- url: ../utils/check-feedback-refiner.mjs
  default_input:
  stage: translation_refine
  input_schema:
  type: object
  properties:
  glossary:
  type: string
  description: Glossary of terms for consistent terminology, use @<file> to read from a file
  pages:
  type: array
  items:
  type: string
  description: Page paths to translate
  langs:
  type: array
  items:
  type: string
  description: "Languages to translate to, available languages are: en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar"
  feedback:
  type: string
  description: Feedback for translation improvement
  mode: sequential

// sourceId: agents/chat/index.yaml
type: ai
name: chat
description: Start interactive page generation assistant
instructions:
url: ../../prompts/chat/index.md
input_key: message
memory: true
skills:

- ../init/index.mjs
- ../generate/index.yaml
- ../update/index.yaml
- ../publish/index.yaml
- ../translate/index.yaml
- ../utils/pages-fs-actor.yaml
- ../utils/exit.mjs

// sourceId: agents/plan/index.yaml
type: team
name: plan
alias:

- plan
- p
  description: A team of agents that generate the website structure
  skills:
- url: ../init/index.mjs
  default_input:
  skipIfExists: true
- ../utils/load-config.mjs
- ../utils/load-sources.mjs
- ./analyze-website-structure.mjs
- url: ../utils/save-output.mjs
  default_input:
  saveKey: websiteStructure
  savePath:
  $get: tmpDir
  fileName: website-structure.yaml
- ../utils/transform-website-structure.yaml
- ../utils/format-website-structure.mjs
  task_title: Generate the website structure

// sourceId: agents/generate/index.yaml
type: team
name: generate
alias:

- gen
- g
  description: Automatically generates comprehensive website pages
  skills:
- url: ../init/index.mjs
  default_input:
  skipIfExists: true
- ../utils/load-config.mjs
- ../utils/load-sources.mjs
- ../plan/analyze-website-structure.mjs
- url: ../utils/save-output.mjs
  default_input:
  saveKey: websiteStructure
  savePath:
  $get: tmpDir
  fileName: website-structure.yaml
- ../utils/transform-website-structure.yaml
- ../utils/format-website-structure.mjs
- ../generate/page-detail/batch-generate-page-detail.yaml
- url: ../utils/check-feedback-refiner.mjs
  default_input:
  stage: structure_planning
- ./component-library/load-component-library.mjs
- type: team
  name: analyzeComponentLibrary and batchTranslatePageDetail
  model: openai/gpt-5
  skills:
  - ../translate/batch-translate-page-detail.yaml
  - ./component-library/analyze-component-library.mjs
    mode: parallel
- ./page-data/compose-pages-data.mjs
- ../utils/save-pages.mjs

input_schema:
type: object
properties:
glossary:
type: string
description: Glossary of terms for consistent terminology, use @<file> to read from a file
feedback:
type: string
description: Feedback for structure planning adjustments
forceRegenerate:
type: boolean
description: Force regenerate all pages
required: - config
mode: sequential

// sourceId: agents/publish/index.yaml
type: team
name: publish
alias:

- pub
- p
  description: Publish the pages to website
  skills:
- url: ../init/index.mjs
  default_input:
  skipIfExists: true
- ../utils/load-config.mjs
- ../utils/load-sources.mjs
- ../utils/format-website-structure.mjs
- ./publish-website.mjs
  input_schema:
  type: object
  properties:
  appUrl:
  type: string
  description: target website URL where the pages will be published (optional - if not provided, will prompt for interactive input)

<available_media_assets>

# Available Media Assets for Documentation

</available_media_assets>

<structure_plan>

This is the website structure. You can refer to it to understand where the current page fits within the website structure.

- title: AIGNE WebSmith | AI-Powered Website Generation
  path: /home
  parentId: ""
  description: "A comprehensive single-page landing site for AIGNE WebSmith, an AI-driven website generation tool. The
  page guides users from initial discovery to action, featuring key sections: a Hero section with the core value
  proposition, a Features overview (AI Generation, Template System, Quality Assurance, One-Click Publishing), an
  Architecture showcase, a Quick Start guide with installation and usage commands, and a final Call to Action."
  linkPath: link:///home

</structure_plan>

</datasources>

** Sections Constraints（VERY IMPORTANT）:**

<fields_information>

- `title`: Page main title, configured as large heading style: string
- `description`: Page description text, supports long text display: string
- `code`: Code example display with syntax highlighting and line numbers: { content: string; filename: string }
- `image`: Image media display with responsive image rendering: string
- `action`: Interactive button with text and link navigation: { text: string; link: string }
  </fields_information>

<allowed_field_combinations>

<field_combination_constraints>

- `["title","description"]`: - **TitleDescription** Most basic text content block, suitable for various content displays
- `["title","description","action"]`: - **HeroSection** Classic hero section layout, ideal for page headers
- `["title","description","image","action"]`: - **HeroWithImage** Hero section layout with image, perfect for product introduction pages
- `["title","description","image"]`: - **FeatureBlock** Feature introduction block, ideal for showcasing product features
- `["title","description","code"]`: - **CodeWithDescription** Code example display block, perfect for technical documentation and tutorials
- `["image","description"]`: - **ImageWithDescription** Image with description block, suitable for product or feature introductions
- `["title","description","list.0","list.1","list.2"]`: - **TextWithList3** Feature introduction with key points list, ideal for feature highlights
- `["title","description","list.0","list.1","list.2","list.3"]`: - **TextWithList4** Feature introduction with detailed list, perfect for comprehensive feature displays
- `["list.0","list.1","list.2","list.3"]`: - **List4Grid** Pure list item display, ideal for product features, metrics, and parallel content
- `["list.0","list.1","list.2"]`: - **List3Grid** Pure list item display, suitable for service items, core advantages, and parallel content
- `["title","list.0","list.1"]`: - **TitleWithList2** Title with dual list items, 2-column layout on desktop, vertical arrangement on mobile
- `["title","list.0","list.1","list.2"]`: - **TitleWithList3** Title with three list items, 3-column layout on desktop, vertical arrangement on mobile
- `["title","list.0","list.1","list.2","list.3"]`: - **TitleWithList4** Title with four list items, 4-column layout on desktop, vertical arrangement on mobile
- `["list.0","list.1"]`: - **List2Grid** Pure list item display, ideal for comparison displays and side-by-side content
- `["list.0","list.1","list.2","list.3","list.4"]`: - **List5Grid** Pure list item display, desktop: 3 items first row + 2 items second row, mobile: vertical arrangement
- `["title","list.0","list.1","list.2","list.3","list.4"]`: - **TitleWithList5** Title with detailed list items, perfect for comprehensive feature list displays
  </allowed_field_combinations>

- You can refer to the information in <fields_information> to understand what each field defines
- Each section MUST strictly follow the field combinations listed in <allowed_field_combinations>
  - DO NOT use any other field combinations

</field_combination_constraints>
