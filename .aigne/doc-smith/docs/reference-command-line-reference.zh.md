# 命令行参考

本文档为 AIGNE WebSmith 命令行界面（CLI）中所有可用命令提供了全面、客观的参考。每个条目都包括命令功能的描述、可用别名以及其参数和子命令的详细列表。

CLI 操作的标准语法如下：
```bash
aigne web <command> [subcommand] [parameters]
```

执行不带命令的 `aigne web` 将启动一个交互式聊天会话。

## 主要命令

下表总结了主要命令。每个命令的详细信息将在下文各节中介绍。

| Command | Aliases | Description |
| :--- | :--- | :--- |
| [generate](#generate) | `gen`, `g` | 根据配置文件生成一个完整的网站。 |
| [publish](#publish) | `pub`, `p` | 将生成的网站发布到 Pages Kit 实例。 |
| [update](#update) | `up` | 根据用户反馈修改现有网站内容。 |
| [translate](#translate) | | 将网站页面翻译成不同语言。 |
| [theme](#theme) | | 管理网站视觉主题，包括生成和应用。 |
| [component](#component) | `comp` | 管理用于构建网站的组件库。 |
| [chat](#chat) | | 启动用于网站管理的交互式聊天会话（默认）。 |
| [prefs](#prefs) | | 管理从反馈中学习到的已保存用户偏好。 |
| [history](#history) | | 显示对网站所做的先前更新的日志。 |
| [clear](#clear) | | 移除生成的文件、工作区数据或配置设置。 |

---

### generate
`generate` 命令负责协调整个网站的创建过程，从规划网站结构到根据指定的配置文件生成页面内容和模板。

**别名：** `gen`, `g`

**用法：**
```bash
aigne web generate
```

**参数：**

<x-field-group>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="指定网站配置文件的路径。这通常是自动提供的。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向术语表文件的路径，以确保术语一致性。使用 @<file> 格式。"></x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false" data-desc="强制重新生成所有页面，覆盖任何已存在的生成内容。"></x-field>
</x-field-group>

### publish
`publish` 命令将生成的网站文件上传到 Pages Kit 实例。它管理批量上传过程并提供状态监控。

**别名：** `pub`, `p`

**用法：**
```bash
aigne web publish --appUrl "https://example.com"
```

**参数：**

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="页面将要发布到的 Pages Kit 网站的目标基础 URL。"></x-field>
  <x-field data-name="with-navigations" data-type="string" data-required="false" data-default="menu" data-desc="发布导航数据。可接受的值为 'flat' 或 'menu'。"></x-field>
  <x-field data-name="with-locales" data-type="boolean" data-required="false" data-desc="设置为 true 时，发布网站的区域设置和语言设置。"></x-field>
</x-field-group>

### update
`update` 命令根据用户提供的反馈修改现有网站的内容。它可用于优化文本、添加或删除版块，或更改页面结构。

**别名：** `up`

**用法：**
```bash
aigne web update --pages "/about" --feedback "Add a mission statement."
```

**参数：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="需要更新的页面路径数组（例如：[\"/about-us\", \"/contact\"]）。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="对指定页面所需更改或改进的描述。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向术语表文件的路径，以确保术语一致性。使用 @<file> 格式。"></x-field>
</x-field-group>

### translate
`translate` 命令将现有网站页面的内容翻译成一种或多种指定语言。

**用法：**
```bash
aigne web translate --pages "/home" --langs "fr,de,es"
```

**参数：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="需要翻译的页面路径数组。"></x-field>
  <x-field data-name="langs" data-type="array" data-required="false" data-desc="语言代码数组。可用语言：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="用于指导和提高翻译质量的具体说明。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="指向术语表文件的路径，以确保翻译一致性。使用 @<file> 格式。"></x-field>
</x-field-group>

### theme
`theme` 命令管理网站的视觉主题，包括其生成和应用。

#### 子命令

**`generate`**
根据网站设计和用户建议生成一个新主题。

**别名：** `gen`

**用法：**
```bash
aigne web theme generate --name "CustomTheme"
```

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="false" data-desc="新主题的名称。"></x-field>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="用作主题基础的网站配置文件的路径。"></x-field>
</x-field-group>

**`apply`**
将先前生成的主题应用到网站。

**别名：** `a`

**用法：**
```bash
aigne web theme apply
```
该子命令没有任何特定参数。它会应用当前配置的主题。

### component
`component` 命令管理网站的组件库。

**别名：** `comp`

#### 子命令

**`pull`**
从指定 URL 拉取组件以更新本地组件库。

**用法：**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```
<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true" data-desc="用于拉取组件库的完整 URL。"></x-field>
</x-field-group>

**`list`**
列出当前库中可用的组件。

**别名：** `ls`, `l`

**用法：**
```bash
aigne web component list
```
该子命令不接受任何参数。

### chat
`chat` 命令启动一个交互式会话，以对话方式生成、更新和管理网站。这是在未指定其他命令的情况下运行 `aigne web` 时执行的默认命令。

**用法：**
```bash
aigne web
```
该命令不接受任何参数。

### prefs
`prefs` 命令管理 WebSmith 从反馈中学习到的用户偏好，以定制 AI 行为。

#### 子命令
**`list`**
列出所有已保存的用户偏好。

**别名：** `ls`

**用法：**
```bash
aigne web prefs list
```
该子命令不接受任何参数。

**`remove`**
移除一个或多个指定的偏好。

**别名：** `rm`

**用法：**
```bash
aigne web prefs remove --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="需要移除的偏好 ID 数组。"></x-field>
</x-field-group>

**`toggle`**
切换一个或多个偏好的激活状态。

**别名：** `t`

**用法：**
```bash
aigne web prefs toggle --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="需要切换状态的偏好 ID 数组。"></x-field>
</x-field-group>

### history
`history` 命令用于查看网站内容和结构的更新历史。

#### 子命令

**`view`**
以紧凑的日志样式格式显示更新历史。每个条目包括一个哈希值、日期、操作以及相关的反馈。

**别名：** `log`, `list`

**用法：**
```bash
aigne web history view
```
该子命令不接受任何参数。

### clear
`clear` 命令从项目目录中移除生成的文件、工作区数据或配置设置。

**用法：**
```bash
aigne web clear --targets "generatedPages" "websiteConfig"
```

**参数：**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false" data-desc="一个无需提示即可清除的项目数组。有效项目包括：websiteStructure, generatedPages, websiteConfig, deploymentConfig, authTokens, mediaDescription, translationCaches。"></x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="false" data-desc="覆盖源页面的默认目录路径。"></x-field>
  <x-field data-name="tmpDir" data-type="string" data-required="false" data-desc="覆盖临时工作区的默认目录路径。"></x-field>
  <x-field data-name="outputDir" data-type="string" data-required="false" data-desc="覆盖生成页面的默认目录路径。"></x-field>
  <x-field data-name="configPath" data-type="string" data-required="false" data-desc="覆盖配置文件的默认路径。"></x-field>
</x-field-group>

---

## 总结

本参考指南详细介绍了 AIGNE WebSmith CLI 的主要命令和参数。有关面向任务的说明，请参阅文档中[核心任务](./core-tasks.md)部分的指南。