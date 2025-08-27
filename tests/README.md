# WebSmith Tests

This directory contains test files for AIGNE WebSmith.

## Test Framework

WebSmith 使用 Bun 作为测试运行器

## Test Structure

```
tests/
├── README.md
├── utils/                  # 工具函数测试
│   ├── utils.test.mjs      # 通用工具函数
│   └── pages-kit-utils.test.mjs  # Pages Kit 专用工具
└── agents/                 # Agent 相关测试
    └── website-structure.test.mjs  # 网站结构测试
```

## Test Files

### utils/utils.test.mjs

测试通用工具函数的功能：

- 文件路径处理
- 系统语言检测
- 基础工具函数

### utils/pages-kit-utils.test.mjs

测试 Pages Kit 专用工具函数：

- SEO 优化工具
- 组件数据生成
- YAML 模板验证

### agents/website-structure.test.mjs

测试网站结构相关功能：

- 网站结构规划验证
- 页面路径生成
- 多语言支持

## 运行所有测试

```bash
# 运行所有测试
bun test

# 运行测试并显示详细输出
bun test --verbose

# 运行特定测试文件
bun test tests/utils-test.mjs
```

## 测试覆盖

测试重点关注：

- ✅ 工具函数正确性
- ✅ Pages Kit 集成
- ✅ 网站生成核心逻辑
- ✅ 错误处理和边界情况

## 测试数据

测试使用 `mock-inputs/` 目录中的示例数据，确保测试的一致性和可重复性。
