basic-component-list:
  - id: layout-block
    name: Section Layout
    component: layout-block
    description: 布局容器组件，提供灵活的页面结构化布局，可嵌套其他组件

custom-component-list:
  - id: bKJH63vdZlE8pQrX
    name: Discuss Kit Blog List
    description: 显示博客列表的组件，只需要配置标题、描述，组件内会显示博客列表
    properties:
      - id: gs1rn5jmxfvpxptx
        key: title
        type: string
        description: 组件标题，默认值：最新博客
      - id: 9ajrz12ik7esfk1z
        key: description
        type: string
        description: 组件描述
        
  - id: 5TKT1CQ0V8GYltq2
    name: Hero Block
    description: 英雄块组件, 展示标题、描述，和图片
    properties:
      - id: gs1rn5jmxfvpxptx
        key: title
        type: json
        description: "Hero 区域的标题"
        subProperties:
          text:
            id: jpnzxm4544511frv
            key: text
            type: string
            description: ""
      - id: YPtORA1dsA_2HBSl
        key: backgroundImage
        type: url
        description: "Hero 区域的背景图片"
      - id: 5iKS0KmFAoxaza-x
        key: rightContent
        type: url
        description: "Hero 区域的右侧内容, 可以配置图片 url"
      - id: zgltlox4ngxtiwfk
        key: backgroundColor
        type: color
        description: "Hero 区域的背景色, 可以使用 css 颜色值"
      - id: 5b24apv8ophnq7ob
        key: simlpleDescription
        type: json
        description: "Hero 区域的描述"
        subProperties:
          text:
            id: vwgcygnovm1rtrgj
            key: text
            type: string
            description: ""
            
  - id: 5HwMAd73anM8MwXH
    name: Content Cards Block
    description: |
      这是一个可配置的卡片列表组件，支持明暗两种主题，四种布局，而且卡片列表是可选的，可以通过灵活的配置来满足不同的需求。
      - 可以只配置标题、描述、按钮，不配置卡片列表，显示为 CTA 组件
      - 在一个页面中可重复使用，通过切换主题和布局，避免样式重复
    properties:
      - id: gs1rn5jmxfvpxptx
        key: title
        type: string
        description: 标题
      - id: 9ajrz12ik7esfk1z
        key: description
        type: string
        description: 描述
      - id: tquwqv8t7svabmwk
        key: cards
        type: array
        description: 卡片列表
        subProperties:
          title:
            id: njy3bhsanotnfnbo
            key: title
            type: string
            description: 卡片标题
          description:
            id: 4yqdty1cj2b6j0cf
            key: description
            type: string
            description: 卡片描述
          image:
            id: 26hj5g5d4u41seof
            key: image
            type: url
            description: 图片
      - id: n44a1rovulmx6nee
        key: layoutType
        type: string
        description: 布局类型，支持："grid" | "horizontal" | "feature" | "compact"
      - id: 0hyqs3rin5nq97ab
        key: theme
        type: string
        description: 主题, 支持："light" | "dark"
        
  - id: a1b2c3d4e5f6g7h8
    name: CTA Block
    component: cta-block
    description: 行动号召组件，展示标题、描述，和行动的按钮
    properties:
      - id: h2k4l6m8n0p2q4r6
        key: heading
        type: json
        description: ""
        subProperties:
          text:
            id: text
            key: text
            type: string
            description: ""
      - id: s5t7u9v1w3x5y7z9
        key: description
        type: json
        description: ""
        subProperties:
          text:
            id: text
            key: text
            type: string
            description: ""
      - id: b1d3f5h7j9l1n3p5
        key: buttons
        type: array
        description: ""
        subProperties:
          text:
            id: r7t9v1x3z5b7d9f1
            key: text
            type: string
            description: ""
          link:
            id: h3j5l7n9p1r3t5v7
            key: link
            type: string
            description: ""
            
  - id: ZaGmarrkQs310Azn
    name: FAQ Block
    component: faq-block
    description: 常见问题组件, 展示常见问题列表，和答案
    properties:
      - id: gs1rn5jmxfvpxptx
        key: title
        type: json
        description: ""
        subProperties:
          text:
            id: x3kzu4wqf4xcirgh
            key: text
            type: string
            description: ""
      - id: 4221qi1bxy322mf4
        key: faqs
        type: array
        description: ""
        subProperties:
          title:
            id: 2aomv8m3rho8kdo8
            key: title
            type: string
            description: ""
          answer:
            id: v65kure0krm7e6q3
            key: answer
            type: string
            description: ""