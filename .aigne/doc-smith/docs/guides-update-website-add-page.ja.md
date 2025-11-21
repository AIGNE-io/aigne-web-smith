使用 AIGNE WebSmith 可以轻松扩展您的网站。本指南介绍了如何使用 `aigne web add-page` 命令将新页面无缝集成到您的网站结构中，并自动更新内容和内部链接。

# 添加页面

`aigne web add-page` 命令提供了一种交互式的方式来扩展您的网站。它允许您用自然语言描述新页面，WebSmith 会处理创建页面、生成内容以及智能地更新现有页面以添加相关的新内容链接的过程。

## 命令用法

要开始添加页面，请导航到您项目的根目录并运行以下命令：

```sh aigne web add-page icon=lucide:terminal
aigne web add-page
```

或者，您也可以使用更短的别名 `add`：

```sh aigne web add icon=lucide:terminal
aigne web add
```

## 流程

当您运行 `add-page` 命令时，WebSmith 会启动一个全面的自动化工作流程。该过程分为以下几个步骤：

### 1. 添加新页面

该命令首先会打印出当前的站点地图，让您清楚地了解现有页面。然后，系统会提示您描述想要添加的页面，指明其标题和位置（例如，“在主服务页面下添加一个定价页面”）。您可以在一次会话中添加多个页面。每次添加后，工具都会显示更新后的结构，并提示您添加下一个页面。要完成页面添加，只需在空提示符下按 Enter 键。然后，WebSmith 会根据您项目的源材料为每个新页面生成内容。以下是添加页面的一个用例：

```text 添加“团队”和“招聘”页面
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]

You can add a new page.
  • e.g. 'add an FAQ page under the About Us page'

Press Enter to finish: add a 'Team' page under '/about'
- My SaaS Platform [/home]
  - Features [/features]
  - About Us [/about]
    - Team [/about/team]

You can continue adding pages, or press Enter to finish: add a 'Careers' page under '/about'
```

### 2. 审查页面以插入链接

新页面创建后，WebSmith 会分析您现有的内容，以确定在何处插入指向新内容的链接。这确保了无缝导航，并帮助用户发现新页面。系统会向您展示一个可以添加链接的页面列表，让您在应用更改前进行审查和确认。以下是审查页面以插入链接的一个用例：

```text 审查链接建议
? Select pages that need new links added (all selected by default, press Enter to confirm, or unselect all to skip):
  ◉ About Us (/about)
  ◯ My SaaS Platform (/home)

Do you want to proceed with these changes? (Y/n)
```

### 3. 输出摘要

当结构最终确定并插入链接后，会显示一份摘要报告。该报告列出了新创建的页面以及任何已更新并添加了新链接的现有页面。如果您的网站使用多种语言，新页面和更新的链接会自动包含在翻译工作流程中。以下是输出摘要的一个用例：

```text 最终摘要
---
📊 Summary

✨ Newly Generated Pages:
   Total: 2 page(s)

   1. /about/team
      Title: Our Team
      Description: Meet the dedicated team behind our project, driving innovation...

🔗 Pages Updated with New Links:
   Total: 1 page(s)

   1. /about
      Added links to: /about/team 

```

## 后续步骤

<x-cards data-columns="2">
  <x-card data-title="更新页面" data-icon="lucide:file-text" data-href="/guides/update-website/update-page">
    了解如何使用自然语言命令优化单个页面上的文本和细节。
  </x-card>
  <x-card data-title="删除页面" data-icon="lucide:file-minus" data-href="/guides/update-website/remove-page">
    了解如何从您的网站结构中删除现有页面。
  </x-card>
</x-cards>