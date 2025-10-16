# 命令行参考

本文档为 AIGNE WebSmith 命令行界面（CLI）中所有可用命令提供了全面的参考。每个条目都包括命令功能的描述、其可用的别名以及其参数和选项的详细列表。

所有命令的通用语法是：
```bash
aigne web <command> [subcommand] [options]
```

运行不带命令的 `aigne web` 会启动一个交互式聊天会话。

## 主要命令

下表概述了 AIGNE WebSmith CLI 中可用的主要命令。

| 命令 | 描述 |
| :--- | :--- |
| [generate](#generate) | 根据配置文件生成一个完整的网站。 |
| [publish](#publish) | 将生成的网站内容发布到 Pages Kit 平台。 |
| [update](#update) | 根据新的反馈或需求修改现有网站的内容。 |
| [translate](#translate) | 将现有网站页面翻译成不同的语言。 |
| [theme](#theme) | 管理网站的视觉主题，包括生成和应用。 |
| [component](#component) | 管理用于构建网站的组件库。 |
| [chat](#chat) | 启动一个交互式聊天会话（默认），以对话方式构建和修改您的网站。 |
| [prefs](#prefs) | 管理已保存的用户偏好，这些偏好可以自定义 WebSmith 的行为。 |
| [history](#history) | 显示对网站所做的所有先前更新的日志。 |
| [clear](#clear) | 删除生成的文件、工作区数据或配置设置。 |

---

### generate
根据用户提供的配置文件生成一个完整的网站。此命令协调整个过程，从规划网站结构到生成页面内容和模板。

**别名:** `gen`, `g`

**用法:**
```bash
aigne web generate
```

**参数:**

<x-field-group>
  <x-field data-name="config" data-type="String" data-required="false" data-desc="网站配置文件的路径。如果未提供，WebSmith 将在当前目录中查找默认配置文件。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含术语表的文件，以确保在生成的内容中术语的一致性。使用格式 @<file>。"></x-field>
  <x-field data-name="forceRegenerate" data-type="Boolean" data-required="false" data-desc="如果设置为 true，将强制重新生成所有页面，即使它们已经存在。"></x-field>
</x-field-group>

### publish
将生成的网站文件发布到 Pages Kit 实例。此命令处理批量上传并提供状态监控。

**别名:** `pub`, `p`

**用法:**
```bash
aigne web publish --appUrl "https://your-pages-kit-url.com"
```

**参数:**

<x-field-group>
  <x-field data-name="appUrl" data-type="String" data-required="false" data-desc="将要发布页面的目标 Pages Kit 网站的基本 URL。"></x-field>
  <x-field data-name="with-navigations" data-type="Boolean" data-required="false" data-desc="如果设置为 true，将在发布页面的同时发布网站导航数据。"></x-field>
  <x-field data-name="with-locales" data-type="Boolean" data-required="false" data-desc="如果设置为 true，将发布网站的区域设置和语言设置。"></x-field>
</x-field-group>

### update
根据用户反馈更新现有网站的内容。此命令可用于优化文本、添加新部分或修改页面结构。

**别名:** `up`

**用法:**
```bash
aigne web update --pages "/about-us" --feedback "Add a new section for team members."
```

**参数:**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="要更新的页面路径数组（例如，/about-us, /contact）。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="对内容所需的更改或改进的详细描述。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含术语表的文件，以确保一致性。使用格式 @<file>。"></x-field>
</x-field-group>

### translate
将现有网站页面的内容翻译成一种或多种指定语言。

**用法:**
```bash
aigne web translate --pages /home --langs fr de es
```

**参数:**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="要翻译的页面路径数组。"></x-field>
  <x-field data-name="langs" data-type="Array" data-required="false" data-desc="一个以空格分隔的语言代码列表，用于将内容翻译成这些语言。可用代码包括：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="为提高翻译质量而提供的具体说明或反馈。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="包含术语表的文件，以确保翻译的一致性。使用格式 @<file>。"></x-field>
</x-field-group>

### theme
管理您网站的视觉主题。您可以根据您的设计偏好生成新主题并将其应用于您的网站。

#### 子命令

**`generate`** (别名: `gen`)
根据您网站的设计生成一个新的主题配置。

**用法:**
```bash
aigne web theme generate --name "MyCustomTheme" --config @path/to/config.yaml
```

**参数:**

<x-field-group>
  <x-field data-name="name" data-type="String" data-required="false" data-desc="新主题的唯一名称。"></x-field>
  <x-field data-name="config" data-type="String" data-required="false" data-desc="用于生成主题的网站配置文件的路径。"></x-field>
</x-field-group>

**`apply`**
将先前生成的主题应用于网站。

**用法:**
```bash
aigne web theme apply --appUrl "https://your-pages-kit-url.com"
```

**参数:**

<x-field-group>
  <x-field data-name="appUrl" data-type="String" data-required="false" data-desc="将应用主题的目标 Pages Kit 网站的基本 URL。"></x-field>
</x-field-group>

### component
管理您网站的组件库。

**别名:** `comp`

#### 子命令

**`pull`**
从指定的 URL 拉取更新的组件库。这确保您的网站使用最新的视觉组件构建。

**用法:**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```

**参数:**

<x-field-group>
  <x-field data-name="url" data-type="String" data-required="true" data-desc="由您的 Pages Kit 实例提供的用于拉取组件库的完整 URL。"></x-field>
</x-field-group>

### chat
启动一个交互式聊天会话，允许您以对话方式生成、更新和管理您的网站。如果未指定其他命令，这是**默认命令**。聊天 Agent 可以访问所有其他命令。

**用法:**
```bash
aigne web
```

此命令不接受任何参数。它会在您的终端中打开一个交互式提示符。

### prefs
管理 WebSmith 随着时间的推移从您的反馈中学习到的用户偏好。这些偏好有助于根据您的特定需求定制 AI 的输出。

**用法:**
```bash
# 列出所有已保存的偏好
aigne web prefs --list

# 通过 ID 删除特定的偏好
aigne web prefs --remove --id "pref_abc123"
```

**参数:**

<x-field-group>
  <x-field data-name="--list" data-type="Flag" data-required="false" data-desc="显示所有已保存用户偏好的格式化列表。"></x-field>
  <x-field data-name="--remove" data-type="Flag" data-required="false" data-desc="删除一个或多个偏好。需要 --id 参数，否则将提示进行选择。"></x-field>
  <x-field data-name="--toggle" data-type="Flag" data-required="false" data-desc="切换一个或多个偏好的活动状态。需要 --id 或将提示。"></x-field>
  <x-field data-name="--id" data-type="Array" data-required="false" data-desc="要管理的偏好 ID 数组（删除或切换）。仅在非交互式使用 --remove 或 --toggle 时需要。"></x-field>
</x-field-group>

### history
提供您网站内容和结构更新历史的视图。

#### 子命令

**`view`** (别名: `log`, `list`)
以紧凑的日志样式格式显示更新历史，类似于 `git log`。每个条目包括一个唯一的哈希值、更新日期、执行的操作以及提供的反馈。

**用法:**
```bash
aigne web history view
```

此命令不接受任何参数。

### clear
安全地删除生成的文件、工作区数据或配置设置。这对于重新开始或清理项目目录很有用。

**用法:**
```bash
# 无需提示即可清除网站结构和生成的页面
aigne web clear --targets websiteStructure generatedPages
```

**参数:**

<x-field-group>
  <x-field data-name="targets" data-type="Array" data-required="false" data-desc="无需提示即可清除的项目数组。可能的值：websiteStructure, generatedPages, websiteConfig, deploymentConfig, authTokens, mediaDescription。"></x-field>
  <x-field data-name="pagesDir" data-type="String" data-required="false" data-desc="覆盖源页面的默认目录路径。"></x-field>
  <x-field data-name="tmpDir" data-type="String" data-required="false" data-desc="覆盖临时工作区的默认目录路径。"></x-field>
  <x-field data-name="outputDir" data-type="String" data-required="false" data-desc="覆盖生成页面的默认目录路径。"></x-field>
  <x-field data-name="configPath" data-type="String" data-required="false" data-desc="覆盖配置文件的默认路径。"></x-field>
</x-field-group>

## 总结

本参考指南涵盖了 AIGNE WebSmith CLI 的主要命令及其参数。有关更详细、面向任务的说明，请参阅[核心任务](./core-tasks.md)部分中的指南。