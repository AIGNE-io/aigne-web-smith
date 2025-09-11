# AIGNE WebSmith

AIGNE WebSmith is a powerful, AI-driven website generation tool built on the [AIGNE Framework](https://www.aigne.io/en/framework). It automates the creation of professional, SEO-optimized websites with complete content, templates, and direct publishing to Pages Kit.

## ✨ Features

### 🤖 AI-Powered Website Generation

- **Intelligent Structure Planning**: Automatically analyze requirements and generate optimal website architecture
- **Batch Content Generation**: Generate detailed content for all pages with one command
- **Professional SEO Optimization**: Built-in SEO best practices and optimization recommendations
- **Multi-language Support**: Support for Chinese and English content generation and localization

### 🎨 Professional Template System

- **Pages Kit Integration**: Direct generation of Pages Kit-compatible YAML templates
- **Component-based Design**: Support for modern components like Hero, CTA, FAQ, Content Cards
- **Responsive Layout**: Automatic adaptation for mobile and desktop displays
- **Visual Editing**: Generated templates support visual editing and adjustments

### 📊 Quality Assurance

- **Structure Evaluation System**: Automatic assessment of website architecture and user experience
- **Content Quality Checks**: Ensure accuracy and consistency of content
- **Complete Test Coverage**: 32+ test cases covering core functionality
- **Code Quality Assurance**: Code checking and formatting using Biome

### 🚀 One-Click Publishing

- **Direct Publishing**: One-click publishing to Pages Kit platform
- **Batch Upload**: Support for batch publishing of multi-page websites
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
- **📊 Quality Evaluation**: Evaluate website quality and user experience
- **⚡ Batch Processing**: Efficient batch processing system
- **🚀 Pages Kit Upload**: One-click publishing to Pages Kit

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aigne-web-smith.git
cd aigne-web-smith

# Install dependencies
pnpm install

# Make CLI executable
chmod +x aigne.yaml
```

### Basic Usage

#### 1. Generate a Website

```bash
# Interactive website generation
./aigne.yaml run websmith-generate

# Or with parameters
./aigne.yaml run websmith-generate \
  --input rules="Create an AI technology enterprise website with product introduction, technical advantages, customer cases and other pages" \
  --input targetAudience="Enterprise decision makers" \
  --input locale="en"
```

#### 2. Publish to Pages Kit

```bash
# Publish generated website
./aigne.yaml run websmith-publish \
  --input projectId="your-pages-kit-project-id"

# Dry run (preview without publishing)
./aigne.yaml run websmith-publish \
  --input projectId="your-pages-kit-project-id" \
  --input dryRun=true
```

#### 3. Generate Individual Components

```bash
# Structure planning only
./aigne.yaml run structure-planning

# Content generation for specific page
./aigne.yaml run content-detail-generator

# Template generation
./aigne.yaml run page-template-generator
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
./aigne.yaml run content-generator --input @my-website.yaml
```

## 📁 Project Structure

```
aigne-web-smith/
├── agents/                 # Core AI agents
│   ├── structure-planning.yaml
│   ├── content-detail-generator.yaml
│   ├── evaluation.yaml
│   ├── batch-content-detail-generator.yaml
│   ├── content-generator.yaml        # Main workflow
│   ├── websmith-generate.yaml        # CLI command
│   ├── websmith-publish.yaml         # CLI command
│   └── upload-template.mjs           # Pages Kit integration
├── prompts/                # AI prompts and templates
├── utils/                  # Utility functions
│   ├── utils.mjs          # General utilities
│   ├── pages-kit-utils.mjs # Pages Kit integration
│   └── constants.mjs      # Configuration constants
├── web-mcp/               # MCP server agents
├── tests/                 # Test suite (32+ tests)
├── examples/inputs/           # Example inputs and configurations
└── aigne.yaml            # Main configuration
```

## 🧪 Testing

WebSmith includes comprehensive test coverage:

```bash
# Run all tests
bun test

# Run specific test suite
bun test tests/utils/
bun test tests/agents/

# Run with verbose output
bun test --verbose
```

Test coverage includes:

- ✅ 12 utility function tests
- ✅ 13 Pages Kit integration tests
- ✅ 7 website structure tests
- ✅ File system and error handling tests

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
npm run test:watch
```

### Adding New Components

1. **Create Agent**: Add new `.yaml` agent in `agents/`
2. **Add Prompt**: Create corresponding prompt in `prompts/`
3. **Update Config**: Add agent to `aigne.yaml`
4. **Write Tests**: Add tests in appropriate `tests/` subdirectory
5. **Update Docs**: Document the new functionality

### Code Quality

- **Linting**: Uses Biome for code quality and formatting
- **Testing**: Bun test runner with comprehensive coverage
- **Type Safety**: JSDoc annotations for better development experience
- **Git Hooks**: Pre-commit hooks ensure code quality

## 📚 API Reference

### Main Commands

#### websmith-generate

Generate a complete website from user requirements.

**Parameters:**

- `rules` (required): Website requirements description
- `targetAudience`: Target audience description
- `locale`: Website language (default: "zh")
- `websiteStyle`: Website style (default: "business")
- `projectId`: Pages Kit project ID for publishing

#### websmith-publish

Publish generated website to Pages Kit.

**Parameters:**

- `projectId` (required): Pages Kit project ID
- `locale`: Website language
- `dryRun`: Preview without publishing
- `overwrite`: Overwrite existing pages

### MCP Server

WebSmith provides MCP server endpoints for integration:

- `get-website-structure`: Retrieve current website structure
- `get-page-detail`: Get detailed content for specific page
- `website-search`: Search within website content

Start MCP server:

```bash
./aigne.yaml serve-mcp
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- 🌐 [AIGNE Framework](https://www.aigne.io/en/framework)
- 📖 [Documentation](https://docs.aigne.io)
- 🎯 [Pages Kit](https://pages.arcblock.io)
- 🐛 [Report Issues](https://github.com/yourusername/aigne-web-smith/issues)

---

**Built with ❤️ using the AIGNE Framework**
