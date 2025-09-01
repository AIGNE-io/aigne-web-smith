
<document_rules>

文档类信息生成规则：
- 如果当前部分是存在子文档，当前文档只展示简要的内容，引导用户到子文档中查看详细的内容
- 每个部分文档需要包含：标题、开头介绍、多个 section 介绍、结尾总结
- 文档标题中已经主题 API 名称，文档中的小标题不需要重复显示，直接显示子 API 名称
- 开头介绍包含关联文档的链接，使用 markdown 的 link 格式，引导用户阅读相关的文档
- 结尾总结中包含下一步阅读文档的链接，使用 markdown 的 link 格式，引导用户阅读相关的文档
- 确保 markdown 链接格式正确，示例：[Next Chapter Title](next_chapter_path)
- **确保 next_chapter_path 是外部地址或结构规划中存在的 path**, 直接使用结构规划中 path 绝对路径
- 如果 dataSources 中包含相关的第三方链接，在文档详情中可以在相关的地方关联这些第三方链接
- 每个 section 需要包含：标题、介绍、代码示例、响应数据示例、示例说明，示例说明跟在示例代码后描述，不需要‘示例说明’这样的小标题
- 确保文档中的内容是完整、连贯的，用户可以跟着文档一步步顺利执行
- 说明要尽可能的详细，如果存在配置项或参数，需要解释每个配置项或参数的含义，如果参数有多个可选值，每种可选值需要解释其含义，并尽可能配上代码示例
- 参数优先使用 markdown 中的 table 来展示，让内容看上去更整齐，容易阅读
- 接口/方法调用的说明必须包含 **响应数据示例**
- 更多的使用 table、d2 图表来解释信息，过长的文本描述会让用户阅读有压力
- 概览部分，建议包含 d2 图表展示产品架构图
{% include "d2-chart/rules.md" %}
- 对输出的 markdown 进行检查，确认输出内容完整，table、d2 信息完整并且格式正确
- **确保内容完整性**：在生成任何文档内容，特别是代码块（如 d2、JSON、代码等）时，必须确保其是**完整且语法正确**的。在输出完成后，必须进行一次**自我检查**，确认所有的代码块、列表、表格等都已完全闭合且没有中途截断。
- **代码块原子性**：将每个代码块（例如 ```d2 ... ```）视为一个**不可分割的原子单元**。必须一次性完整生成，从开始标记（```d2）到结束标记（```）之间的所有内容都不能省略或截断。
- **确保 Markdown 语法**：Markdown 格式正确，特别是表格的分隔线（例如 `|---|---|---|`），需要与表格数据列数一致。
- README 文件只做参考，你需要从代码中获取最新、最完整的信息
- 忽略详情顶部的标签信息，这是程序处理的，不需要在生成时输出

</document_rules>

<TONE_STYLE>
- Documentation should be plain, rigorous and accurate, avoiding grandiose or empty vocabulary
- You are writing for humans, not algorithms
- Clarity and Flow
  - Target a Flesch Reading Ease score near 80
  - Vary sentence length to maintain rhythm and attention
  - Use natural transitions and rhetorical cues to guide the reader
  - Favor active voice, but mix in passive when needed
  - Mimic natural human quirks: slight redundancy, mild digressions, and spontaneous tone
- Voice Characteristics
  - Use contractions and idioms sparingly to maintain an informal, yet credible tone
  - Blend technical precision with relatable language
  - Be direct: say what happened, why it matters, and how it helps

Example Tone Transformations
❌ "We’re thrilled to announce our most powerful update yet…"
✅ "You can now include location and timestamp metadata for each claim, enabling audit-ready transparency."

❌ "Unlock the future of verification."
✅ "This release makes real-world claims independently verifiable across sectors."
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
