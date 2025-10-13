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
- **Built-in Component Library**: Integrated component library with validation and management
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

Interactive chat interface for website generation and management.

**Features:**
- Interactive page generation assistant
- Memory-enabled conversations
- Access to all other agents (generate, update, publish, translate)

#### generate (aliases: gen, g)

Generate a complete website from user requirements.

**Parameters:**

- `config` (required): Configuration file path (automatically provided via `--input @file.yaml`)
- `glossary` (optional): Glossary of terms for consistent terminology, use `@<file>` to read from a file
- `forceRegenerate` (optional): Force regenerate all pages (boolean)

#### publish (aliases: pub, p)

Publish generated website to Pages Kit.

**Parameters:**

- `appUrl` (optional): Target website URL where pages will be published
- `with-navigations` (optional): Publish to website with navigations (boolean)
- `with-locales` (optional): Publish to website with locales (boolean)

#### translate

Translate existing website content to different languages.

**Parameters:**

- `glossary` (optional): Glossary of terms for consistent terminology, use `@<file>` to read from a file
- `pages` (optional): Array of page paths to translate
- `langs` (optional): Array of language codes to translate to (available: en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar)
- `feedback` (optional): Feedback for translation improvement

#### update (alias: up)

Update existing website content with new requirements.

**Parameters:**

- `glossary` (optional): Glossary of terms for consistent terminology, use `@<file>` to read from a file
- `pages` (optional): Array of page paths to update
- `feedback` (optional): Feedback for content improvement

#### theme

Manage website visual themes.

**Subcommands:**
- `generate` (alias: gen): Generate theme based on website design
  - `name` (optional): Name for your theme
  - `config` (optional): Configuration file location
- `apply`: Apply theme to website

#### component (alias: comp)

Manage component library.

**Subcommands:**
- `pull`: Pull components from URL
  - `url` (required): Target pull component URL

#### prefs

Manage user preferences learned from feedback.

**Parameters:**
- `--list`: List all preferences
- `--remove`: Remove preferences
- `--toggle`: Toggle preferences active status
- `--id`: Array of preference IDs to manage

#### history

View update history.

**Subcommands:**
- `view` (aliases: log, list): View update history in compact format

#### clear

Clear workspace, generated pages, or configuration.

**Parameters:**
- `targets` (optional): Array of items to clear without prompting
- `pagesDir` (optional): Override the pages directory root
- `tmpDir` (optional): Override the workspace directory
- `outputDir` (optional): Override the generated pages directory
- `configPath` (optional): Override the configuration file path

### MCP Server

WebSmith provides MCP server endpoints for integration:

- `get-pages-structure`: Retrieve current website structure
- `get-page-detail`: Get detailed content for specific page
- `pages-search`: Search within website content
- `analyze-content-relevance`: Analyze content relevance
- `analyze-pages-relevance`: Analyze pages relevance
- `read-page-content`: Read page content

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

- 🎨 [WebSmith Logo](https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg)
- 📖 [WebSmith Official Website](https://www.aigne.io/web-smith)
- 🌐 [AIGNE Framework](https://www.aigne.io/en/framework)
- 🎯 [Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)
- 💻 [GitHub Repo](https://github.com/AIGNE-io/aigne-web-smith)
- 🐛 [Report Issues](https://github.com/AIGNE-io/aigne-web-smith/issues)

---

**Built with ❤️ using the AIGNE Framework**
