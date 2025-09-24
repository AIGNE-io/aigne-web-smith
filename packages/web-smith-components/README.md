# Professional Component Studio Project

This is a professional component project created with Component Studio. This template provides a complete engineering design and development environment to help you quickly build high-quality components.

## Project Structure

```
{your-project-name}/
  ├── src/                       # Source code directory
  │   ├── components/            # common components directory
  |   ├── HelloWorld/            # Example component
  |       ├── index.tsx          # Component entry
  |       └── @metadata.json     # Component metadata
  |   ├── utils/                 # Utility functions
  ├── scripts/                   # Utility scripts
  │   └── bump-version.mjs       # Version update script
  ├── global.d.ts                # Global type declarations
  ├── package.json               # Project configuration and dependencies
  ├── tsconfig.json              # TypeScript configuration
  ├── biome.json                 # Biome configuration (code formatting)
  ├── .gitignore                 # Git ignore configuration
  └── README.md                  # Project documentation
```

## Features

- **TypeScript Support** - Complete type definitions and type checking
- **Engineering Design** - Project structure and toolchain following best practices
- **Component Metadata** - Auto-generated component documentation and property descriptions
- **Development Toolchain** - Hot reload development server and optimized build process
- **Code Quality Tools** - Code formatting and quality checking

## Quick Start

### Development Environment

Start development server:

```bash
blocklet component dev

# or

pnpm run dev
```

Update workspace and project dependencies:

```bash
blocklet component update
```

### Publish Component

1. Update version number

```bash
pnpm run bump-version
```

2. Build and publish

```bash
pnpm run build
pnpm publish
```

## Command List

- `pnpm run dev` - Start development server
- `pnpm run lint` - Run code checks
- `pnpm run format` - Format code
- `pnpm run bump-version` - Update version number

## Custom Configuration

You can customize the following configuration files as needed:

- `tsconfig.json` - TypeScript configuration
- `biome.json` - Code formatting rules
- `package.json` - Dependencies and script configuration

## License

MIT
