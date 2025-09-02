<example>
下面是一些优质的中间格式页面结构供你参考，涵盖了不同行业、不同规模的多样化场景。

<example_import_rule>
这些示例展示的是语义描述方法和内容组织思路，而非固定模板。请根据实际业务需求灵活组合 section，创造独特的页面结构，避免盲目复制示例的 section 组合。
</example_import_rule>

<example_item>
技术产品页面示例 - AI 可观察性工具：

```yaml
meta:
  title: 'AIGNE Observability'
  description: 'Trace, debug, and monitor every agent's decision. Built for developers to ship with confidence'
  image: 'e11ffbf596e6f6db12ccd69d52e824bc.webp'

sections:
  # Hero section - 英雄区域
  - name: 'hero'
    summary: '页面主标题区域，展示产品核心价值主张和主要行动按钮'
    title: 'See what your agents see. Understand what they do.'
    description: 'Trace, debug, and monitor every agent's decision. Built for developers to ship with confidence'
    image:
      src: 'ef1783fa15e13095badf1784efd3214b.webp'
      caption: 'AI agent execution visualization'
    action:
      text: 'View on Github'
      link: 'https://github.com/aigne'

  # Problem statement
  - name: 'content'
    summary: '问题陈述区域，解释开发者为什么需要AI可观察性，配图片说明'
    title: 'Why Developers Need Observability'
    description: 'LLM agents may not meet expectations. Visibility is your defense against failures and debugging. AIGNE Observability provides insights into every decision and tool run.'
    image:
      src: 'bd5b88e39c716621c7cb24a45c22750e.png'
      caption: 'Agent execution visualization dashboard'

  # Key Features
  - name: 'features'
    summary: '产品核心功能列表，详细介绍5个主要特性和优势'
    title: 'Key Features'
    list:
      - title: 'Visualize Every Agent Step'
        description: 'Follow your agent's real-time execution path. See every tool call, decision, and API request in an interactive graph'
      - title: 'Pinpoint Costs & Bottlenecks'
        description: 'Monitor token consumption and latency per run. Identify expensive steps and performance issues before they reach production'
      - title: 'Automatic Instrumentation'
        description: 'No extra code required. Import the library and traces are captured automatically'

  # How It Works
  - name: 'howItWorks'
    summary: '使用指南，展示3个步骤说明和代码示例，展示零配置使用流程'
    title: 'How It Works: Zero-Config Tracing'
    description: 'Observability is enabled by default in the AIGNE Framework.'
    list:
      - title: 'Run Your Agent'
        description: 'Simply run your agent as you normally would using the CLI. Traces are automatically collected in the background.'
        code:
          title: 'Execute Agent'
          language: 'bash'
          content: 'aigne run'
      - title: 'Launch the Dashboard'
        description: 'When you're ready to review a trace, start the local observability server.'
        code:
          title: 'Start Observability'
          language: 'bash'
          content: 'aigne observe'

  # Final CTA
  - name: 'cta'
    summary: '最终行动召唤区域，引导用户访问GitHub开始使用产品'
    title: 'Ready to See What Your AI Is Thinking?'
    description: 'Explore the AIGNE Observability on GitHub and start building more reliable, transparent AI agents today.'
    action:
      text: 'View on Github'
      link: 'https://github.com/aigne'
```

</example_item>

<example_item>
商业网站页面示例 - 奶茶店首页：

```yaml
meta:
  title: "悠然茶语 - 精选手作奶茶 | 新鲜现调"
  description: "悠然茶语专注手作奶茶，选用优质茶叶和新鲜食材，为您带来独特的味蕾体验。营业时间10:00-22:00，欢迎品尝。"
  image: "bubble-tea-hero.jpg"

sections:
  # Hero section
  - name: "hero"
    summary: "首页主视觉区域，展示品牌特色和核心卖点，吸引顾客注意"
    title: "悠然茶语，每一口都是用心调制"
    description: "精选优质茶叶，新鲜现调，为您带来独特的味蕾体验"
    image:
      src: "hero-bubble-tea.jpg"
      caption: "手作奶茶制作现场"
    action:
      text: "查看菜单"
      link: "/menu"

  # 产品特色
  - name: "features"
    summary: "产品特色介绍，突出奶茶店的三大优势和卖点"
    title: "为什么选择悠然茶语"
    list:
      - title: "精选茶叶"
        description: "甄选台湾高山茶叶，每日新鲜冲泡，确保茶香浓郁"
        image:
          src: "premium-tea-leaves.jpg"
          caption: "优质茶叶展示"
      - title: "新鲜食材"
        description: "严选新鲜牛奶、当季水果，绝不使用隔夜食材"
        image:
          src: "fresh-ingredients.jpg"
          caption: "新鲜食材准备"
      - title: "手工调制"
        description: "每杯奶茶都由经验丰富的调茶师手工制作，口感层次丰富"
        image:
          src: "handcrafted-process.jpg"
          caption: "手工调制过程"

  # 招牌产品
  - name: "products"
    summary: "招牌产品展示区域，介绍店内最受欢迎的特色饮品"
    title: "招牌特色"
    list:
      - title: "招牌奶茶"
        description: "经典港式奶茶，茶香浓郁，奶香四溢，是我们的招牌之选 - ¥18"
      - title: "芝士莓果"
        description: "新鲜草莓搭配浓郁芝士奶盖，酸甜清香，颜值与口感并存 - ¥25"
      - title: "抹茶拿铁"
        description: "日式抹茶粉与香醇牛奶完美融合，苦甜平衡，回味悠长 - ¥22"

  # 店铺信息
  - name: "storeInfo"
    summary: "门店基本信息展示，包括地址、营业时间、联系方式等"
    title: "门店信息"
    description: "欢迎来店品尝，我们期待为您服务"
    list:
      - title: "营业时间"
        description: "周一至周日 10:00 - 22:00，无休息日"
      - title: "店铺地址"
        description: "上海市徐汇区淮海中路123号，地铁1号线黄陂南路站A出口步行5分钟"
      - title: "联系电话"
        description: "021-1234-5678，支持电话预约和外送服务"

  # 行动召唤
  - name: "cta"
    summary: "最终行动召唤，鼓励用户到店体验或联系咨询"
    title: "立即体验悠然茶语"
    description: "来店品尝我们的手作奶茶，感受不一样的茶香世界"
    action:
      text: "立即到店"
      link: "tel:021-1234-5678"
```

</example_item>

<example_item>
个人品牌页面示例 - 自由设计师：

```yaml
meta:
  title: "李晓雯 - UI/UX 设计师 | 用设计创造价值"
  description: "专业UI/UX设计师，5年经验，专注用户体验设计和品牌视觉。为初创公司和中小企业提供设计咨询服务。"
  image: "designer-portfolio-hero.jpg"

sections:
  # 个人介绍
  - name: "hero"
    summary: "个人品牌首页主视觉，展示设计师专业形象和核心服务，建立第一印象"
    title: "用设计点亮用户体验"
    description: "我是李晓雯，一名专注用户体验的UI/UX设计师。5年来，我帮助30+企业通过优秀设计提升产品价值。"
    image:
      src: "designer-hero-photo.jpg"
      caption: "李晓雯工作照"
    action:
      text: "查看作品集"
      link: "/portfolio"

  # 专业能力
  - name: "skills"
    summary: "专业技能展示区域，突出设计师的核心能力和工具使用经验"
    title: "专业技能"
    list:
      - title: "UI/UX 设计"
        description: "移动端和Web端界面设计，用户研究，交互原型设计"
      - title: "品牌视觉"
        description: "Logo设计，VI系统，品牌指南，营销物料设计"
      - title: "工具精通"
        description: "Figma, Sketch, Adobe Creative Suite, Principle, InVision"

  # 作品展示
  - name: "portfolio"
    summary: "精选作品展示，通过具体案例证明设计能力和项目经验"
    title: "精选作品"
    list:
      - title: "FinTech App 重设计"
        description: "为某金融科技公司重新设计移动应用，用户留存率提升40%"
        image:
          src: "portfolio-fintech.jpg"
          caption: "FinTech应用界面设计"
      - title: "电商平台UI升级"
        description: "优化购物流程，减少用户流失，转化率提升25%"
        image:
          src: "portfolio-ecommerce.jpg"
          caption: "电商平台界面优化"
      - title: "初创品牌VI设计"
        description: "从零开始打造品牌视觉识别系统，获得红点设计奖提名"
        image:
          src: "portfolio-branding.jpg"
          caption: "品牌VI设计展示"

  # 客户评价
  - name: "testimonials"
    summary: "客户评价区域，通过真实反馈建立信任和专业权威"
    title: "客户评价"
    list:
      - title: "张总 - 科技创业公司CEO"
        description: "晓雯的设计不仅美观，更重要的是真正理解用户需求，帮我们的产品脱颖而出。"
      - title: "王经理 - 电商平台产品总监"
        description: "合作过程专业高效，设计方案总能超出预期，强烈推荐。"

  # 服务流程
  - name: "process"
    summary: "工作流程介绍，让客户了解合作步骤和专业流程"
    title: "合作流程"
    list:
      - title: "1. 需求沟通"
        description: "深入了解项目背景、目标用户和业务需求"
      - title: "2. 研究分析"
        description: "竞品分析、用户研究、设计策略制定"
      - title: "3. 设计执行"
        description: "概念设计、原型制作、视觉设计、交互优化"
      - title: "4. 交付优化"
        description: "设计交付、开发跟进、后期优化支持"

  # 联系方式
  - name: "contact"
    summary: "联系信息和咨询入口，方便潜在客户主动联系"
    title: "开始合作"
    description: "让我们一起用设计创造更大价值"
    list:
      - title: "微信咨询"
        description: "designerlee2024（请备注项目咨询）"
      - title: "邮箱联系"
        description: "hello@lixiaowen.design"
      - title: "工作时间"
        description: "周一至周六 9:00-18:00，24小时内回复"
    action:
      text: "立即咨询"
      link: "mailto:hello@lixiaowen.design"
```

</example_item>

<guidelines>
重要指导原则：

避免模板化思维：

- 以上示例仅供参考结构和语义描述方式，切勿生搬硬套
- 不要因为示例都有 hero 就认为必须有 hero，不要因为示例有 cta 就一定要加 cta
- 根据实际需求和内容特点灵活组合 section，每个页面都应该是独特的

section 选择原则：

- hero：仅当需要强烈的第一印象时使用，不是必需的
- cta：仅当有明确行动目标时使用，纯信息展示页面可能不需要
- 优先考虑内容本身的逻辑结构，而非套用固定模板

中间格式核心要点：

- 每个 section 必须有清晰的 summary 字段说明用途和意图
- name 字段使用最能表达内容语义的标识，可以是：hero, about, services, features, team, portfolio, process, pricing, testimonials, news, events, contact, stats, timeline, comparison, faq 等
- summary 描述要具体明确，重点说明该 section"为什么存在"和"要达成什么目的"
- 重点描述"做什么"（语义和意图）而不是"怎么做"（技术实现）
- 内容结构应该服务于业务目标，而非模仿示例结构

创新 section 建议：

- 技术产品：architecture, integrations, roadmap, changelog
- 服务业务：methodology, workflow, case-studies, industries
- 个人品牌：philosophy, experience, approach, values
- 社区媒体：guidelines, events, featured-content, user-stories
- 电商产品：catalog, comparison, reviews, shipping, warranty
  </guidelines>
  </example>
