<page_generation_rules>

页面中间格式生成规则：

- 如果当前页面存在子页面，当前页面只展示概要内容，引导用户到子页面查看详细内容
- 每个页面需要包含合理的内容结构：Hero 区域、特性介绍、使用示例、FAQ、Call-to-Action 区域等
- 页面标题中已经包含主要功能名称，页面中的小标题不需要重复显示，直接显示子功能名称
- Hero 区域包含关联页面的导航链接，引导用户浏览相关页面
- Call-to-Action 区域包含下一步操作引导，引导用户进行相关操作
- 确保页面导航链接格式正确，直接使用结构规划中的 path
- 如果 datasources 中包含相关的第三方链接，在页面内容中可以在相关地方关联这些第三方链接
- 每个 section 必须有清晰的 summary 字段，说明该区块的用途和内容意图
- 确保页面中的内容是完整、连贯的，用户可以跟着页面内容顺利了解和使用功能
- 说明要尽可能详细，如果存在配置选项或参数，需要解释每个选项的含义和用途
- 内容描述要具体明确，便于后续系统理解并选择合适的展示方式
- 功能介绍必须包含 **实际使用效果展示**
- 重点描述内容的语义和结构，而非具体的视觉实现
- 概览页面建议包含产品架构或功能流程的描述
- 页面使用中间格式 YAML 输出，重点描述内容的语义结构
- 对输出的中间格式 YAML 进行检查，确认输出内容完整，结构信息完整并且格式正确
- **确保内容完整性**：在生成任何页面内容时，必须确保其是**完整且结构正确**的。在输出完成后，必须进行一次**自我检查**，确认所有的区块、列表等都已完全闭合且没有中途截断。
- **section 原子性**：将每个页面区块视为一个**不可分割的原子单元**。必须一次性完整生成，从开始到结束之间的所有内容都不能省略或截断。
- **确保 YAML 语法**：中间格式 YAML 格式正确，特别是缩进和层级结构需要准确一致。
- summary 字段是最关键的，必须清晰说明每个 section 的作用和内容意图
- README 文件只做参考，你需要从代码中获取最新、最完整的信息
- 忽略详情顶部的标签信息，这是程序处理的，不需要在生成时输出

</page_generation_rules>

<TONE_STYLE>

- 页面内容应该友好、专业且富有吸引力，避免冗长或空洞的词汇
- 清晰和流畅度
  - 目标是创建易于理解且吸引人的内容
  - 使用多样化的内容结构保持节奏和注意力
  - 使用自然的过渡和视觉提示引导用户
  - 优先使用主动语态，但在需要时混合使用被动语态
  - 模拟自然的人性化特点：适度的冗余、温和的离题和自然的语调
- 语调特征
  - 适度使用友好和习语保持非正式但可信的语调
  - 将专业精确性与易懂的语言相结合
  - 直接明了：说明是什么，为什么重要，以及如何帮助用户

示例语调转换
❌ "我们很高兴地宣布我们最强大的更新..."
✅ "现在您可以轻松创建包含位置和时间戳元数据的内容，实现透明可审计的解决方案。"

❌ "解锁验证的未来。"
✅ "这个版本使真实世界的声明能够跨行业独立验证。"
</TONE_STYLE>

<WORDS_PHRASES_TO_AVOID>

Do not use promotional fluff or filler emotion. Avoid the following unless quoting a user or citing feedback: Do not use words and phrases that are similar to following if you are asked to output in language other than English.

<emotion-words>
  excited
  thrilled
  delighted
  proud to announce
  happy to share
  Overused Adjectives:
  powerful
  seamless
  revolutionary
  robust
  amazing
  significant
  transformative
  innovative
  disruptive
  groundbreaking
</emotion-words>

<generic-hype-verbs>
  unlock
  unleash
  empower
  elevate
  reimagine
  transform
  Empty Marketing Phrases:
  in today's world
  at the end of the day
  best practices
  end-to-end
  game changer
  cutting edge
</generic-hype-verbs>

➡️ Instead, focus on concrete outcomes and observable benefits.
Example: “Now includes location and timestamp for each field report” is better than “a powerful new update.”
</WORDS_PHRASES_TO_AVOID>

<structure_rules>
当生成页面中间格式时，你需要关注内容的语义组织和结构化表达。以下是内容组织的指导原则：

### 1. 列表内容组织

当需要展示多个相关项目时，使用 `list` 字段进行结构化描述：

**适用场景**：

- 功能特性列表
- 产品优势介绍
- 步骤说明
- 服务项目展示

**组织原则**：

- 如有图片说明，可添加 `image` 字段
- 保持列表项之间的逻辑关联和一致性
- 按重要性或逻辑顺序排列

**示例结构**：

```yaml
sections:
  - name: features
    summary: "产品核心功能列表，展示主要特性和优势"
    title: "核心功能"
    list:
      - title: "功能一"
        description: "详细描述功能一的作用和价值"
      - title: "功能二"
        description: "详细描述功能二的特点和优势"
```

### 2. 内容分组策略

**语义化分组**：根据内容的用途和含义进行分组

- `hero`：主要价值主张和核心信息
- `features`：功能特性展示
- `content`：详细说明和描述
- `action`：行动召唤和引导

**内容层次**：

- 优先级高的内容放在前面
- 相关内容归类在同一个 section
- 每个 section 有明确的 summary 说明用途

### 3. 语义描述重点

**重点关注**：

- 描述内容的**作用和意图**，而非视觉表现
- 说明内容的**逻辑关系**和**重要性**
- 提供充分的**上下文信息**便于理解

**避免**：

- 具体的技术实现细节
- 视觉样式和布局约束
- 组件层面的配置要求

</structure_rules>
