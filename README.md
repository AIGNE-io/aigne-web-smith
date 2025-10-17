# AIGNE WebSmith

AIGNE WebSmith is a powerful, AI-driven website generation tool built on the [AIGNE Framework](https://www.aigne.io/en/framework). It automates the creation of professional, SEO-optimized websites with complete content and templates, and enables direct publishing to Pages Kit.

## ✨ Features

### 🤖 AI-Powered Website Generation

- **Intelligent Structure Planning**: Automatically analyzes requirements to generate an optimal website architecture.
- **Batch Content Generation**: Generates detailed content for all pages with a single command.
- **Professional SEO Optimization**: Includes built-in SEO best practices and provides optimization recommendations.
- **Multi-language Support**: Supports both Chinese and English content generation and localization.

### 🎨 Professional Template System

- **Pages Kit Integration**: Directly generates Pages Kit-compatible YAML templates.
- **Component-based Design**: Supports modern components like Hero, CTA, FAQ, and Content Cards.
- **Built-in Component Library**: Includes an integrated component library with validation and management.
- **Responsive Layout**: Automatically adapts for mobile and desktop displays.
- **Visual Editing**: Generated templates support visual editing.

### 📊 Quality Assurance

- **Structure Evaluation System**: Automatically assesses website architecture and user experience.
- **Content Quality Checks**: Ensures the accuracy and consistency of content.
- **Complete Test Coverage**: Includes over 32 test cases covering core functionality.
- **Code Quality Assurance**: Code is checked and formatted using Biome.

### 🚀 One-Click Publishing

- **Direct Publishing**: Enables one-click publishing to Pages Kit.
- **Batch Upload**: Supports batch publishing of multi-page websites.
- **Status Monitoring**: Provides detailed publishing status and error reporting.
- **Access Links**: Get public links to your website immediately after successful publishing.

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

- **🧠 Structure Planning**: Intelligently analyzes requirements to generate the website architecture.
- **📝 Content Generation**: Generates high-quality page content in batches.
- **🎨 Template Generation**: Creates Pages Kit-compatible templates.
- **🧩 Component Library**: Manages and validates the built-in component library.
- **📊 Quality Evaluation**: Evaluates website quality and user experience.
- **⚡ Batch Processing**: Provides an efficient system for batch processing.
- **🚀 Pages Kit Upload**: Enables one-click publishing to Pages Kit.

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
# Translate existing pages into different languages
aigne web translate

# Update existing website content
aigne web update

# Pull components
aigne web component --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"

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

### Development Environment Setup

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

1.  **Create Agent**: Add a new `.yaml` agent to the appropriate subdirectory within `agents/`.
2.  **Add Prompt**: Create a corresponding prompt in the `prompts/` directory.
3.  **Update Config**: Add the new agent to `aigne.yaml`.
4.  **Write Tests**: Add tests using the Bun test framework.
5.  **Update Docs**: Document the new functionality.

### Code Quality

- **Linting**: Uses Biome for code quality and formatting.
- **Testing**: Bun test runner with comprehensive coverage.
- **Type Safety**: JSDoc annotations are used to improve type safety and the development experience.
- **Git Hooks**: Pre-commit hooks ensure code quality.

## 📚 API Reference

### Main Commands

#### chat

Interactive chat interface for website generation and management.

**Features:**
- Interactive page generation assistant
- Memory-enabled conversations
- Access to all other agents (generate, update, publish, translate)

#### generate (aliases: gen, g)

Generates a complete website from user requirements.

**Parameters:**

- `config` (required): Configuration file path (automatically provided via `--input @file.yaml`).
- `glossary` (optional): A glossary of terms for consistent terminology. Use `@<file>` to read from a file.
- `forceRegenerate` (optional): Force regeneration of all pages (boolean).

#### publish (aliases: pub, p)

Publishes the generated website to Pages Kit.

**Parameters:**

- `appUrl` (optional): The target website URL where pages will be published.
- `with-navigations` (optional): Publish the website with navigations. Options: `flat` or `menu` (defaults to `menu`).
- `with-locales` (optional): Publish the website with locales (boolean).

#### translate

Translates existing website content into different languages.

**Parameters:**

- `glossary` (optional): A glossary of terms for consistent terminology. Use `@<file>` to read from a file.
- `pages` (optional): An array of page paths to translate.
- `langs` (optional): An array of language codes to translate to. Available languages: en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar.
- `feedback` (optional): Feedback for improving translations.

#### update (alias: up)

Updates existing website content based on new requirements.

**Parameters:**

- `glossary` (optional): A glossary of terms for consistent terminology. Use `@<file>` to read from a file.
- `pages` (optional): An array of page paths to update.
- `feedback` (optional): Feedback for content improvement.

#### theme

Manages website visual themes.

**Subcommands:**
- `generate` (alias: gen): Generates a theme based on the website design.
  - `name` (optional): A name for your theme.
  - `config` (optional): The configuration file location.
- `apply`: Applies a theme to the website.

#### component (alias: comp)

Manages the component library.

**Subcommands:**
- `pull`: Pulls components from a URL.
  - `url` (required): The URL to pull components from.

#### prefs

Manages user preferences learned from feedback.

**Parameters:**
- `--list`: Lists all preferences.
- `--remove`: Removes preferences.
- `--toggle`: Toggles the active status of preferences.
- `--id`: An array of preference IDs to manage.

#### history

Views the update history.

**Subcommands:**
- `view` (aliases: log, list): Views the update history in a compact format.

#### clear

Clears the workspace, generated pages, or configuration.

**Parameters:**
- `targets` (optional): An array of items to clear without prompting.
- `pagesDir` (optional): Overrides the pages directory root.
- `tmpDir` (optional): Overrides the workspace directory.
- `outputDir` (optional): Overrides the generated pages directory.
- `configPath` (optional): Overrides the configuration file path.

### MCP Server

WebSmith provides MCP server endpoints for integration:

- `get-pages-structure`: Retrieves the current website structure.
- `get-page-detail`: Gets the detailed content for a specific page.
- `pages-search`: Searches within the website content.
- `analyze-content-relevance`: Analyzes content relevance.
- `analyze-pages-relevance`: Analyzes the relevance of pages.
- `read-page-content`: Reads page content.

Start MCP server:

```bash
aigne web serve-mcp
```

## 📊 Performance

WebSmith is optimized for production use:

- **Fast Generation**: Parallel agent processing.
- **Efficient Templates**: Optimized Pages Kit integration.
- **Memory Management**: Streaming content processing.
- **Error Recovery**: Robust error handling and recovery.

Typical performance metrics:

- 5-page website: ~2-3 minutes
- 15-page website: ~5-8 minutes
- Template generation: ~10-20 seconds per page

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes and include tests.
4. Run quality checks: `npm run lint`.
5. Submit a pull request.

## 📄 License

This project is licensed under the Elastic License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- 🎨 [WebSmith Logo](https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg)
- 📖 [WebSmith Official Website](https://www.aigne.io/web-smith)
- 🌐 [AIGNE Framework](https://www.aigne.io/en/framework)
- 🎯 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)
- 💻 [GitHub Repo](https://github.com/AIGNE-io/aigne-web-smith)
- 🐛 [Report Issues](https://github.com/AIGNE-io/aigne-web-smith/issues)

---

**Built with ❤️ using the AIGNE Framework**
