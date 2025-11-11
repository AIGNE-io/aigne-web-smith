# Installation

Before you can begin generating websites with AIGNE WebSmith, you must first install the AIGNE Command Line Interface (CLI). This tool provides the necessary commands to interact with the WebSmith framework. This section provides a step-by-step guide to the installation process.

## System Requirements

*   **Node.js >=20**: AIGNE WebSmith requires Node.js version 20 or higher
*   **npm**: npm (Node Package Manager) is installed automatically with Node.js

If you do not have Node.js installed, please download and install it from the [official Node.js website](https://nodejs.org/).

## Installation

Run the following command in your terminal:

```bash
npm install -g @aigne/cli
```

## Advanced Installation Options

### Beta Version

To install the beta version for testing the latest features:

```bash
npm install -g @aigne/cli@beta
aigne web upgrade --beta
```

### Local Installation

To install the CLI as a project dependency:

```bash
npm install @aigne/cli
```

When installed locally, use `npx aigne ...` to run commands.

## Next Steps

Once the installation is complete, you are ready to create your first website. Proceed to the next section to get started.

*   **[Preparing Your Content](./getting-started-preparing-your-content.md)**: Explains what kind of content and information you should have ready to help the AI generate the best possible website for your needs.