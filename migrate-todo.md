# AIGNE WebSmith 迁移计划

## 项目概述

AIGNE WebSmith 是基于 AIGNE 框架的 AI 驱动网站生成工具，目标是复用成熟的 DocSmith 架构，整合早期 WebSmith 的网站生成能力。

## 迁移策略

- **复用 DocSmith**: 项目结构、依赖、工具类、工程实践
- **提取 WebSmith**: 网站生成相关的提示词、Agent 逻辑、Pages Kit 集成
- **目标**: 构建稳定的网站生成和发布平台

---

## 📋 迁移任务清单

### 🔄 从 DocSmith 复用 (Reuse from DocSmith)

#### ✅ 已完成 (Completed)
- [x] 项目初始化 (README.md 已存在)
- [x] **项目结构复用**
  - [x] 复制基础项目文件 (`package.json`, `biome.json`) 
  - [x] 创建核心目录结构 (`agents/`, `prompts/`, `utils/`, `tests/`, `mock-inputs/`)
  - [x] 设置目录说明文档

- [x] **工具函数复用**
  - [x] `utils/file-utils.mjs` - 文件操作工具 (适配 WebSmith)
  - [x] `utils/utils.mjs` - 通用工具函数 (适配 WebSmith)  
  - [x] `utils/constants.mjs` - 常量定义 (适配网站生成)
  - [x] `utils/pages-kit-utils.mjs` - Pages Kit 专用工具 (新增)

#### ✅ 已完成 (Completed)
- [x] **依赖管理**
  - [x] 安装项目依赖 (`pnpm install`)
  - [x] 验证工具链配置 (Biome linter/formatter, AIGNE CLI 测试通过)

#### ✅ 已完成 (Completed)
- [x] **测试框架**
  - [x] 复制通用测试工具方法 (复用 DocSmith 中的文件系统、验证等工具函数)
  - [x] 创建 WebSmith 专用测试用例 (utils、pages-kit-utils、website-structure)
  - [x] 按模块组织测试结构 (tests/utils/, tests/agents/)
  - [x] 配置 Bun 测试运行器，32个测试全部通过

### 🏗️ 从早期 WebSmith 提取 (Extract from Early WebSmith)

#### ✅ 已完成 (Completed)
- [x] **核心 Agent 迁移**
  - [x] `structure-planning.yaml` - 网站结构规划 (使用 DocSmith 版本)
  - [x] `content-detail-generator.yaml` - 内容详细生成 (使用 DocSmith 版本)
  - [x] `page-template-generator.yaml` - 页面模板生成 ⭐ (WebSmith 特有)
  - [x] `upload-template.mjs` - Pages Kit 上传功能 ⭐ (WebSmith 特有，已增强)

- [x] **提示词模板迁移**
  - [x] `prompts/structure-planning.md` - 结构规划提示 (使用 DocSmith 版本)
  - [x] `prompts/page-template-generator.md` - 页面模板生成提示 ⭐ (关键)
  - [x] `prompts/content-detail-generator.md` - 内容生成提示 (使用 DocSmith 版本)

- [x] **Pages Kit 集成**
  - [x] `upload-template.mjs` - Pages Kit 上传功能，已增强错误处理
  - [x] `agents/schema/structure-plan.yaml` - 结构规划 schema

- [x] **示例和测试数据**
  - [x] `mock-inputs/input-example.yaml` - 测试输入示例
  - [x] `mock-inputs/component-list-example.md` - 组件列表配置

#### ✅ 已完成 (Completed)
- [x] **批量处理 Agent**
  - [x] `batch-content-detail-generator.yaml` - 批量内容生成 (已增强支持 Pages Kit)
  - [x] `content-generator.yaml` - 主协调 Agent (团队 Agent，完整 WebSmith 流程)
  - [x] `evaluation.yaml` - 网站结构规划评估 Agent
  - [x] `prompts/evaluation-prompt.md` - 评估提示词模板

### 🔧 架构适配 (Architecture Adaptation)

#### ✅ 已完成 (Completed)
- [x] **主配置文件**
  - [x] 创建 `aigne.yaml` (基于 DocSmith 结构)
  - [x] 配置核心 WebSmith agents
  - [x] 设置 CLI 入口配置

#### ⏳ 待开始 (Pending)
- [ ] **MCP 服务器配置**
  - [ ] 设置 WebSmith MCP 服务器配置

- [ ] **Agent 适配**
  - [ ] 将早期 WebSmith agents 适配到新的 AIGNE 版本
  - [ ] 统一 input/output schema 格式
  - [ ] 添加错误处理和验证

- [ ] **工具函数增强**
  - [ ] 创建 Pages Kit 相关工具函数
  - [ ] 网站生成专用工具 (SEO、组件处理等)

### 🆕 新功能开发 (New Features)

#### ⏳ 待开始 (Pending)
- [ ] **CLI 命令**
  - [ ] `aigne websmith generate` - 生成网站
  - [ ] `aigne websmith publish` - 发布到 Pages Kit
  - [ ] `aigne websmith init` - 初始化项目

- [ ] **MCP 服务器** (如果需要)
  - [ ] 网站内容搜索和管理
  - [ ] Pages Kit 集成服务

---

## 📁 目标目录结构

```
aigne-web-smith/
├── README.md ✅
├── package.json ⏳
├── aigne.yaml ⏳
├── biome.json ⏳
├── agents/ ⏳
│   ├── structure-planning.yaml
│   ├── content-detail-generator.yaml
│   ├── page-template-generator.yaml
│   ├── batch-content-detail-generator.yaml
│   ├── content-generator.yaml
│   └── upload-template.mjs
├── prompts/ ⏳
│   ├── structure-planning.md
│   ├── page-template-generator.md
│   └── content-detail-generator.md
├── utils/ ⏳
│   ├── file-utils.mjs
│   ├── utils.mjs
│   ├── constants.mjs
│   └── pages-kit-utils.mjs
├── tests/ ⏳
│   └── README.md
└── mock-inputs/ ⏳
    ├── component-list.md
    └── example-inputs/
```

---

## 🎯 关键差异点

### DocSmith vs WebSmith
| 功能 | DocSmith | WebSmith |
|------|----------|----------|
| **输出格式** | Markdown | YAML (Pages Kit) |
| **发布目标** | Discuss Kit | Pages Kit |
| **内容类型** | 技术文档 | 网站页面 |
| **组件系统** | ❌ | Hero, CTA, FAQ 等 |
| **SEO 优化** | 基础 | 专业网站 SEO |

---

## ⚠️ 风险和注意事项

- **AIGNE 版本兼容性**: 早期 WebSmith 基于旧版本，需要适配新版本
- **API 变更**: Pages Kit API 可能已更新，需要验证
- **依赖冲突**: 确保新旧依赖兼容
- **测试覆盖**: 确保迁移后功能正常

---

## 🚀 里程碑

### Phase 1: 基础架构 (1-2 天)
- [ ] 项目结构和依赖迁移
- [ ] 基础 Agent 配置

### Phase 2: 核心功能 (3-4 天)
- [ ] 结构规划和内容生成
- [ ] 页面模板生成

### Phase 3: 集成和发布 (2-3 天)
- [ ] Pages Kit 集成
- [ ] CLI 命令和测试

### Phase 4: 优化和文档 (1-2 天)
- [ ] 性能优化
- [ ] 文档完善

---

## 📊 当前状态

**总体进度**: 70% (14/20 主要任务)
**下一步**: MCP 服务器配置和 CLI 命令开发

---

## 🔧 重构改动记录 (Refactoring Changes)

### 已完成的重构 (Completed Refactoring)

#### 项目配置适配
- **package.json**: 从 `@aigne/doc-smith` 改为 `@aigne/web-smith`
- **依赖优化**: 移除文档相关依赖 (dompurify, jsdom, mermaid, remark-*, unified, vfile)
- **保留核心**: AIGNE 框架包、基础工具包 (chalk, glob, open, yaml 等)

#### 工具函数适配  
- **constants.mjs**: 
  - 文档样式 → 网站样式 (WEBSITE_STYLES)
  - 文档受众 → 网站受众 (TARGET_AUDIENCES) 
  - 新增 SEO_PATTERNS, COMPONENT_CATEGORIES
  - 新增 PAGES_KIT_API_BASE 常量
  
- **utils.mjs**:
  - saveDocWithTranslations → savePageWithTranslations (支持 YAML)
  - 配置路径: `.aigne/doc-smith` → `.aigne/web-smith`
  - 移除文档特有的处理逻辑

- **file-utils.mjs**: 简化为核心文件操作，移除复杂的文档处理

#### 新增 WebSmith 专用功能
- **pages-kit-utils.mjs**: 全新工具文件
  - uploadPageTemplate(): Pages Kit API 集成
  - validatePageYaml(): YAML 结构验证
  - generateSlug(): SEO 友好路径生成
  - optimizeMetaData(): 元数据 SEO 优化
  - Component 相关工具函数

#### 目录结构优化
- 创建完整的目录结构和说明文档
- 为每个目录添加 README.md 说明用途和规范

#### 新增功能完成 (Latest Additions)
- **批量处理 Agent 迁移**:
  - `batch-content-detail-generator.yaml`: 支持批量处理网站页面生成
  - `content-generator.yaml`: 完整的 WebSmith 主协调流程 (结构规划 → 评估 → 批量生成 → Pages Kit 发布)
  - `evaluation.yaml`: 专业的网站结构评估 Agent，支持 SEO 和用户体验评估
  - `prompts/evaluation-prompt.md`: WebSmith 专用评估提示词

- **开发工具链配置完成**:
  - 依赖安装和配置验证 (pnpm install, Biome linter)
  - AIGNE CLI 测试通过，支持所有新迁移的 agents
  - 代码质量检查和自动格式化配置完成

- **测试框架迁移完成**:
  - 复用 DocSmith 通用测试工具方法 (文件系统操作、验证逻辑等)
  - 创建 WebSmith 专用测试套件 (32个测试，覆盖工具函数、Pages Kit 集成、网站结构)
  - 按模块组织测试结构: tests/utils/, tests/agents/
  - 配置 Bun 测试运行器，所有测试通过，支持持续集成

### 设计决策 (Design Decisions)

1. **保持兼容性**: 尽可能复用 DocSmith 的成熟模式，减少学习成本
2. **专业化**: 针对网站生成场景优化，添加 SEO、组件、Pages Kit 等专用功能  
3. **模块化**: 功能按模块拆分，便于维护和扩展
4. **标准化**: 遵循 AIGNE 框架规范，确保一致性
5. **团队协作**: 完整的批量处理和评估流程，支持复杂网站生成项目

---

*最后更新: 2025-08-27*