<example>
下面是一些优质的中间格式页面结构供你参考：

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
  title: '悠然茶语 - 精选手作奶茶 | 新鲜现调'
  description: '悠然茶语专注手作奶茶，选用优质茶叶和新鲜食材，为您带来独特的味蕾体验。营业时间10:00-22:00，欢迎品尝。'
  image: 'bubble-tea-hero.jpg'

sections:
  # Hero section
  - name: 'hero'
    summary: '首页主视觉区域，展示品牌特色和核心卖点，吸引顾客注意'
    title: '悠然茶语，每一口都是用心调制'
    description: '精选优质茶叶，新鲜现调，为您带来独特的味蕾体验'
    image:
      src: 'hero-bubble-tea.jpg'
      caption: '手作奶茶制作现场'
    action:
      text: '查看菜单'
      link: '/menu'

  # 产品特色
  - name: 'features'
    summary: '产品特色介绍，突出奶茶店的三大优势和卖点'
    title: '为什么选择悠然茶语'
    list:
      - title: '精选茶叶'
        description: '甄选台湾高山茶叶，每日新鲜冲泡，确保茶香浓郁'
        image:
          src: 'premium-tea-leaves.jpg'
          caption: '优质茶叶展示'
      - title: '新鲜食材'
        description: '严选新鲜牛奶、当季水果，绝不使用隔夜食材'
        image:
          src: 'fresh-ingredients.jpg'
          caption: '新鲜食材准备'
      - title: '手工调制'
        description: '每杯奶茶都由经验丰富的调茶师手工制作，口感层次丰富'
        image:
          src: 'handcrafted-process.jpg'
          caption: '手工调制过程'

  # 招牌产品
  - name: 'products'
    summary: '招牌产品展示区域，介绍店内最受欢迎的特色饮品'
    title: '招牌特色'
    list:
      - title: '招牌奶茶'
        description: '经典港式奶茶，茶香浓郁，奶香四溢，是我们的招牌之选 - ¥18'
      - title: '芝士莓果'
        description: '新鲜草莓搭配浓郁芝士奶盖，酸甜清香，颜值与口感并存 - ¥25'
      - title: '抹茶拿铁'
        description: '日式抹茶粉与香醇牛奶完美融合，苦甜平衡，回味悠长 - ¥22'

  # 店铺信息
  - name: 'storeInfo'
    summary: '门店基本信息展示，包括地址、营业时间、联系方式等'
    title: '门店信息'
    description: '欢迎来店品尝，我们期待为您服务'
    list:
      - title: '营业时间'
        description: '周一至周日 10:00 - 22:00，无休息日'
      - title: '店铺地址'
        description: '上海市徐汇区淮海中路123号，地铁1号线黄陂南路站A出口步行5分钟'
      - title: '联系电话'
        description: '021-1234-5678，支持电话预约和外送服务'

  # 行动召唤
  - name: 'cta'
    summary: '最终行动召唤，鼓励用户到店体验或联系咨询'
    title: '立即体验悠然茶语'
    description: '来店品尝我们的手作奶茶，感受不一样的茶香世界'
    action:
      text: '立即到店'
      link: 'tel:021-1234-5678'
```
</example_item>

<guidelines>
中间格式要点：
- 每个 section 必须有清晰的 summary 字段说明用途
- name 字段使用语义化的英文标识，如 hero、features、content、cta
- 内容描述要具体明确，便于后续系统理解
- 重点描述"做什么"（语义）而不是"怎么做"（实现）
- 适用于不同行业：技术产品、商业服务、个人展示等
</guidelines>
</example>