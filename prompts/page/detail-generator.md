<page_generation_rules>

页面模板生成规则：

- 如果当前页面存在子页面，当前页面只展示概要内容，引导用户到子页面查看详细内容
- 每个页面模板需要包含：Hero 区域、特性介绍、使用示例、FAQ、Call-to-Action 区域
- 页面标题中已经包含主要功能名称，页面中的小标题不需要重复显示，直接显示子功能名称
- Hero 区域包含关联页面的导航链接，引导用户浏览相关页面
- Call-to-Action 区域包含下一步操作引导，引导用户进行相关操作
- 确保页面导航链接格式正确，示例：[Next Page Title](next_page_path)
- **确保 next_page_path 是外部地址或结构规划中存在的 path**, 直接使用结构规划中 path 绝对路径
- 如果 dataSources 中包含相关的第三方链接，在页面内容中可以在相关地方关联这些第三方链接
- 每个特性区块需要包含：标题、介绍、功能演示、使用示例、效果说明
- 确保页面中的内容是完整、连贯的，用户可以跟着页面内容顺利了解和使用功能
- 说明要尽可能详细，如果存在配置选项或参数，需要解释每个选项的含义和用途
- 优先使用卡片、表格、图表来展示信息，让内容看上去更整齐，易于阅读
- 功能介绍必须包含 **实际使用效果展示**
- 更多使用视觉化元素如图表、卡片来解释信息，避免过长的文本描述给用户造成阅读压力
- 概览页面建议包含产品架构图或功能流程图
- 页面模板使用 YAML 格式输出，包含页面元数据和内容结构
- 对输出的 YAML 模板进行检查，确认输出内容完整，结构信息完整并且格式正确
- **确保内容完整性**：在生成任何页面模板内容时，必须确保其是**完整且结构正确**的。在输出完成后，必须进行一次**自我检查**，确认所有的区块、列表、表格等都已完全闭合且没有中途截断。
- **模板原子性**：将每个页面区块视为一个**不可分割的原子单元**。必须一次性完整生成，从开始到结束之间的所有内容都不能省略或截断。
- **确保 YAML 语法**：YAML 格式正确，特别是缩进和层级结构需要准确一致。
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
