# Installation

Before you can begin generating websites with AIGNE WebSmith, you must first install the AIGNE Command Line Interface (CLI). This tool provides the necessary commands to interact with the WebSmith framework. This section provides a step-by-step guide to the installation process.

## Prerequisites

To install and run the AIGNE CLI, your development environment must meet the following requirement:

*   **Node.js and npm**: The AIGNE CLI is distributed as an npm package, which requires Node.js. If you do not have Node.js installed, please download and install it from the [official Node.js website](https://nodejs.org/). Installing Node.js will also install npm (Node Package Manager).

## Installing the AIGNE CLI

The recommended method for installation is to install the CLI globally. This makes the `aigne` command accessible from any directory in your terminal.

To perform a global installation, run the following command in your terminal:

```bash
npm install -g @aigne/cli
```

### Alternative: Local Installation

Alternatively, you can install the AIGNE CLI as a local dependency within a specific project. This is suitable if you prefer to manage dependencies on a per-project basis.

To install locally, navigate to your project's root directory and run:

```bash
npm install @aigne/cli
```

When installed locally, you will need to use `npx aigne ...` or configure an npm script to run the commands.

## Next Steps

Once the installation is complete, you are ready to create your first website. Proceed to the next section to get started.

*   **[Preparing Your Content](./getting-started-preparing-your-content.md)**: Explains what kind of content and information you should have ready to help the AI generate the best possible website for your needs.