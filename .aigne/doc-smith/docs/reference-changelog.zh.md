# 更新日志

本文档全面记录了 AIGNE WebSmith 的所有更新。内容包括新功能、错误修复和其他变更，并按版本以降序时间顺序排列。

## [1.4.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.1-beta...v1.4.1-beta.1) (2025-10-08)

### 错误修复

*   调整了提示并更新了组件库 ([#104](https://github.com/AIGNE-io/aigne-web-smith/issues/104))。

## [1.4.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0...v1.4.1-beta) (2025-10-08)

### 错误修复

*   优化了页面组合步骤中匹配数据字段的逻辑 ([#102](https://github.com/AIGNE-io/aigne-web-smith/issues/102))。

## [1.4.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.8...v1.4.0) (2025-10-05)

此版本为 1.4.0 正式版。

## [1.4.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.7...v1.4.0-beta.8) (2025-10-04)

### 功能

*   新增了对简单和基于 git 的更新历史跟踪的支持 ([#98](https://github.com/AIGNE-io/aigne-web-smith/issues/98))。

## [1.4.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.6...v1.4.0-beta.7) (2025-10-03)

### 错误修复

*   媒体文件现在会自动包含在页面数据源中 ([#92](https://github.com/AIGNE-io/aigne-web-smith/issues/92))。

## [1.4.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.5...v1.4.0-beta.6) (2025-10-03)

### 错误修复

*   调整了内容更新 Agent 的提示以提高性能 ([#95](https://github.com/AIGNE-io/aigne-web-smith/issues/95))。

## [1.4.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.4...v1.4.0-beta.5) (2025-10-03)

### 错误修复

*   **core:** 实现了一个更稳定的网站生成工作流 ([#89](https://github.com/AIGNE-io/aigne-web-smith/issues/89))。

## [1.4.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.4...v1.4.0-beta.4) (2025-10-03)

### 功能

*   新增了智能源建议功能，以减少 token 消耗和生成时间 ([#87](https://github.com/AIGNE-io/aigne-web-smith/issues/87))。

## [1.3.1-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.3...v1.3.1-beta.4) (2025-10-02)

### 错误修复

*   **ux:** 实现了一个共享上下文，以加快网站结构和页面内容的调整速度 ([#85](https://github.com/AIGNE-io/aigne-web-smith/issues/85))。

## [1.3.1-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.2...v1.3.1-beta.3) (2025-10-02)

### 错误修复

*   **ux:** 调整了发布成功消息的措辞，使其更清晰。

## [1.3.1-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.1...v1.3.1-beta.2) (2025-10-02)

### 错误修复

*   **ux:** 调整了生成成功消息的措辞，使其更清晰 ([#54](https://github.com/AIGNE-io/aigne-web-smith/issues/54))。

## [1.3.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.0...v1.3.1-beta.1) (2025-10-02)

### 错误修复

*   **core:** 为页面详情添加了 YAML 模式验证，以防止配置错误 ([#52](https://github.com/AIGNE-io/aigne-web-smith/issues/52))。

## [1.3.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.7...v1.3.0-beta.8) (2025-10-01)

### 功能

*   更新了内置组件库并增强了模板处理能力 ([#48](https://github.com/AIGNE-io/aigne-web-smith/issues/48))。

## [1.3.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.6...v1.3.0-beta.7) (2025-10-01)

### 功能

*   在网站初始化流程中增加了用于自定义规则的输入项 ([#44](https://github.com/AIGNE-io/aigne-web-smith/issues/44))。
*   集成了一个付费网站部署服务 ([#42](https://github.com/AIGNE-io/aigne-web-smith/issues/42))。
*   **auth:** 为发布授权添加了用户角色要求 ([#46](https://github.com/AIGNE-io/aigne-web-smith/issues/46))。
*   在 `theme` 和 `component` 命令中增加了对嵌套子命令的支持 ([#45](https://github.com/AIGNE-io/aigne-web-smith/issues/45))。

### 错误修复

*   **ux:** 改进了网站创建失败时的错误消息 ([#47](https://github.com/AIGNE-io/aigne-web-smith/issues/47))。

## [1.3.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.5...v1.3.0-beta.6) (2025-09-30)

### 错误修复

*   **generate:** 允许组件匹配回退到字段超集，以提供更大的灵活性 ([#40](https://github.com/AIGNE-io/aigne-web-smith/issues/40))。

## [1.3.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2025-09-27)

### 功能

*   **core:** 更新了网站内容生成并改进了 UI 组件 ([#39](https://github.com/AIGNE-io/aigne-web-smith/issues/39))。

### 错误修复

*   改进了主题 Agent 的交互流程 ([#34](https://github.com/AIGNE-io/aigne-web-smith/issues/34))。
*   更新了区块管理工具，以正确处理 YAML 字符串输入 ([#37](https://github.com/AIGNE-io/aigne-web-smith/issues/37))。

## [1.3.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2025-09-26)

### 错误修复

*   **core:** 修复了 CLI 中缺少 `clear` 命令的错误。

## [1.3.0-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2025-09-26)

### 错误修复

*   **core:** 修复了 CLI 中缺少 `component` 命令的错误。
*   **main:** 移除了组件库 UI 中不必要的内边距。

## [1.3.0-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta.1...v1.3.0-beta.1) (2025-09-24)

### 功能

*   新增了对主题 Agent 的支持，以实现主题生成和管理 ([#28](https://github.com/AIGNE-io/aigne-web-smith/issues/28))。

## [1.2.2-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta...v1.2.2-beta.1) (2025-09-24)

### 错误修复

*   新增了供用户审查和修改网站结构的工具 ([#29](https://github.com/AIGNE-io/aigne-web-smith/issues/29))。

## [1.2.2-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.1-beta...v1.2.2-beta) (2025-09-23)

### 功能

*   **core:** 在 Agent 提示中加入了 MBTI 人格，以优化 AI 生成的内容风格 ([#26](https://github.com/AIGNE-io/aigne-web-smith/issues/26))。

## [1.2.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.0-beta...v1.2.1-beta) (2025-09-22)

### 功能

*   新增了 `clear` 命令，用于移除生成的文件和数据。

### 错误修复

*   修复了一个与发布网站相关的错误。

## [1.2.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.5-beta...v1.2.0-beta) (2025-09-19)

### 功能

*   **core:** 新增了对内置组件库的支持 ([#21](https://github.com/AIGNE-io/aigne-web-smith/issues/21))。

## [1.1.5-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.4-beta...v1.1.5-beta) (2025-09-19)

### 错误修复

*   **core:** 修复了页面数据组合中的一个错误，并解决了页面缓存问题。

## [1.1.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.0...v1.1.1-beta) (2025-09-16)

### 错误修复

*   **ci:** 实现了对发布 Beta 版本的支持 ([#14](https://github.com/AIGNE-io/aigne-web-smith/issues/14))。

## [1.1.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.6...v1.1.0) (2025-09-15)

### 功能

*   优化了网站发布逻辑 ([#11](https://github.com/AIGNE-io/aigne-web-smith/issues/11))。

## [1.0.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.4...v1.0.6) (2025-09-15)

### 功能

*   允许在不要求 `projectId` 的情况下发布网站。

### 错误修复

*   **cli:** 为组件解析器添加了错误处理，以防止崩溃。

## [1.0.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.3...v1.0.4) (2025-09-12)

### 错误修复

*   **cli:** 解决了配置中存在重复 `temperature` 键的错误。

## [1.0.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.2...v1.0.3) (2025-09-12)

### 错误修复

*   **cli:** 修复了一个 ESLint 错误并解决了一个“名称未定义”的错误。

## [1.0.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.1...v1.0.2) (2025-09-11)

### 错误修复

*   **cli:** 解决了生成过程中的一个内容错误。

## [1.0.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.0...v1.0.1) (2025-09-11)

### 错误修复

*   **ci:** 修复了发布到 npmjs 时发生的错误。

## [1.0.0](https://github.com/AIGNE-io/aigne-web-smith) (2025-09-11)

### 功能

*   初始仓库设置和首次公开发布。