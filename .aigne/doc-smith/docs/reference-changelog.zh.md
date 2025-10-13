# 变更日志

本文档全面记录了 AIGNE WebSmith 的所有更新。它包括新特性、错误修复和其他变更，按版本以降序排列。

## [1.4.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.1-beta...v1.4.1-beta.1) (2025-10-08)

### 修复

*   调整了提示词并更新了组件库 ([#104](https://github.com/AIGNE-io/aigne-web-smith/issues/104))。

## [1.4.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0...v1.4.1-beta) (2025-10-08)

### 修复

*   优化了页面组合步骤中数据字段的匹配逻辑 ([#102](https://github.com/AIGNE-io/aigne-web-smith/issues/102))。

## [1.4.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.8...v1.4.0) (2025-10-05)

此版本为 1.4.0 正式版。

## [1.4.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.7...v1.4.0-beta.8) (2025-10-04)

### 新特性

*   增加了对简单更新历史和基于 git 的更新历史跟踪的支持 ([#98](https://github.com/AIGNE-io/aigne-web-smith/issues/98))。

## [1.4.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.6...v1.4.0-beta.7) (2025-10-03)

### 修复

*   媒体文件现在会自动包含在页面数据源中 ([#92](https://github.com/AIGNE-io/aigne-web-smith/issues/92))。

## [1.4.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.5...v1.4.0-beta.6) (2025-10-03)

### 修复

*   调整了内容更新 Agent 的提示词以提高性能 ([#95](https://github.com/AIGNE-io/aigne-web-smith/issues/95))。

## [1.4.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.4...v1.4.0-beta.5) (2025-10-03)

### 修复

*   **core:** 实现了一个更稳定的网站生成工作流 ([#89](https://github.com/AIGNE-io/aigne-web-smith/issues/89))。

## [1.4.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.4...v1.4.0-beta.4) (2025-10-03)

### 新特性

*   增加了智能源建议功能，以减少 token 消耗和生成时间 ([#87](https://github.com/AIGNE-io/aigne-web-smith/issues/87))。

## [1.3.1-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.3...v1.3.1-beta.4) (2025-10-02)

### 修复

*   **ux:** 实现了共享上下文，以加快网站结构和页面内容的调整速度 ([#85](https://github.com/AIGNE-io/aigne-web-smith/issues/85))。

## [1.3.1-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.2...v1.3.1-beta.3) (2025-10-02)

### 修复

*   **ux:** 调整了发布成功消息的措辞，使其更清晰。

## [1.3.1-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.1...v1.3.1-beta.2) (2025-10-02)

### 修复

*   **ux:** 调整了生成成功消息的措辞，使其更清晰 ([#54](https://github.com/AIGNE-io/aigne-web-smith/issues/54))。

## [1.3.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.0...v1.3.1-beta.1) (2025-10-02)

### 修复

*   **core:** 为页面详情添加了 YAML 结构验证，以防止配置错误 ([#52](https://github.com/AIGNE-io/aigne-web-smith/issues/52))。

## [1.3.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.7...v1.3.0-beta.8) (2025-10-01)

### 新特性

*   更新了内置组件库并增强了模板处理能力 ([#48](https://github.com/AIGNE-io/aigne-web-smith/issues/48))。

## [1.3.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.6...v1.3.0-beta.7) (2025-10-01)

### 新特性

*   在网站初始化流程中增加了自定义规则的输入项 ([#44](https://github.com/AIGNE-io/aigne-web-smith/issues/44))。
*   集成了一个付费网站部署服务 ([#42](https://github.com/AIGNE-io/aigne-web-smith/issues/42))。
*   **auth:** 为发布授权增加了用户角色要求 ([#46](https://github.com/AIGNE-io/aigne-web-smith/issues/46))。
*   在 `theme` 和 `component` 命令中增加了对嵌套子命令的支持 ([#45](https://github.com/AIGNE-io/aigne-web-smith/issues/45))。

### 修复

*   **ux:** 改进了网站创建失败时的错误消息 ([#47](https://github.com/AIGNE-io/aigne-web-smith/issues/47))。

## [1.3.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.5...v1.3.0-beta.6) (2025-09-30)

### 修复

*   **generate:** 允许组件匹配回退到字段超集，以提供更大的灵活性 ([#40](https://github.com/AIGNE-io/aigne-web-smith/issues/40))。

## [1.3.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2025-09-27)

### 新特性

*   **core:** 更新了网站内容生成并改进了 UI 组件 ([#39](https://github.com/AIGNE-io/aigne-web-smith/issues/39))。

### 修复

*   改进了主题 Agent 的交互流程 ([#34](https://github.com/AIGNE-io/aigne-web-smith/issues/34))。
*   更新了区块管理工具，以正确处理 YAML 字符串输入 ([#37](https://github.com/AIGNE-io/aigne-web-smith/issues/37))。

## [1.3.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2025-09-26)

### 修复

*   **core:** 修复了 CLI 中缺少 `clear` 命令的错误。

## [1.3.0-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2025-09-26)

### 修复

*   **core:** 修复了 CLI 中缺少 `component` 命令的错误。
*   **main:** 移除了组件库 UI 中不必要的内边距。

## [1.3.0-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta.1...v1.3.0-beta.1) (2025-09-24)

### 新特性

*   增加了对主题 Agent 的支持，实现了主题的生成和管理 ([#28](https://github.com/AIGNE-io/aigne-web-smith/issues/28))。

## [1.2.2-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta...v1.2.2-beta.1) (2025-09-24)

### 修复

*   增加了供用户审查和修改网站结构的工具 ([#29](https://github.com/AIGNE-io/aigne-web-smith/issues/29))。

## [1.2.2-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.1-beta...v1.2.2-beta) (2025-09-23)

### 新特性

*   **core:** 在 Agent 提示词中加入了 MBTI 人格，以优化 AI 生成内容的风格 ([#26](https://github.com/AIGNE-io/aigne-web-smith/issues/26))。

## [1.2.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.0-beta...v1.2.1-beta) (2025-09-22)

### 新特性

*   增加了 `clear` 命令，用于移除生成的文件和数据。

### 修复

*   修复了一个与发布网站相关的错误。

## [1.2.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.5-beta...v1.2.0-beta) (2025-09-19)

### 新特性

*   **core:** 增加了对内置组件库的支持 ([#21](https://github.com/AIGNE-io/aigne-web-smith/issues/21))。

## [1.1.5-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.4-beta...v1.1.5-beta) (2025-09-19)

### 修复

*   **core:** 修复了页面数据组合中的一个错误，并解决了一个页面缓存问题。

## [1.1.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.0...v1.1.1-beta) (2025-09-16)

### 修复

*   **ci:** 实现了对发布 beta 版本的支持 ([#14](https://github.com/AIGNE-io/aigne-web-smith/issues/14))。

## [1.1.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.6...v1.1.0) (2025-09-15)

### 新特性

*   优化了网站发布逻辑 ([#11](https://github.com/AIGNE-io/aigne-web-smith/issues/11))。

## [1.0.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.4...v1.0.6) (2025-09-15)

### 新特性

*   允许在没有 `projectId` 的情况下发布网站。

### 修复

*   **cli:** 为组件解析器增加了错误处理，以防止崩溃。

## [1.0.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.3...v1.0.4) (2025-09-12)

### 修复

*   **cli:** 解决了一个配置中存在重复 `temperature` 键的错误。

## [1.0.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.2...v1.0.3) (2025-09-12)

### 修复

*   **cli:** 修复了一个 ESLint 错误，并解决了一个“名称未定义”的错误。

## [1.0.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.1...v1.0.2) (2025-09-11)

### 修复

*   **cli:** 解决了生成过程中的一个内容错误。

## [1.0.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.0...v1.0.1) (2025-09-11)

### 修复

*   **ci:** 修复了发布到 npmjs 时发生的一个错误。

## [1.0.0](https://github.com/AIGNE-io/aigne-web-smith) (2025-09-11)

### 新特性

*   初始化仓库并首次公开发布。