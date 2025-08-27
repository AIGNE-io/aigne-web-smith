# Agents

This directory contains all the AIGNE agents for WebSmith:

## Core Agents

- `structure-planning.yaml` - Website structure planning agent
- `content-detail-generator.yaml` - Content generation agent
- `page-template-generator.yaml` - Page template generation agent (WebSmith specific)
- `batch-content-detail-generator.yaml` - Batch content generation agent
- `content-generator.yaml` - Main orchestration agent

## Utility Agents

- `upload-template.mjs` - Pages Kit upload functionality
- `load-sources.mjs` - Source loading utilities
- `save-output.mjs` - Output saving utilities

## Agent Development

Each agent should follow the AIGNE framework conventions:
- Clear input/output schemas
- Proper error handling
- Comprehensive descriptions
