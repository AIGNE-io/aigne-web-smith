# 命令行参考

本文档为 AIGNE WebSmith 命令行界面（CLI）中所有可用命令提供了全面、详实的参考。每个条目都包含对命令功能的描述、其可用别名以及其参数和子命令的详细列表。

CLI 操作的标准语法如下：
```bash 运行命令 icon=lucide:terminal
aigne web <command> [subcommand] [parameters]
```

执行不带命令的 `aigne web` 会启动互动模式。

## 主要命令

下表总结了主要命令。每个命令在下文中都有更详细的说明。

| 命令 | 别名 | 描述 |
| :--- | :--- | :--- |
| [generate](#generate) | `gen`, `g` | 根据配置文件生成一个完整的网站。 |
| [publish](#publish) | `pub`, `p` | 将生成的网站发布到 Pages Kit 实例。 |
| [update](#update) | `up` | 根据用户反馈修改现有网站内容。 |
| [translate](#translate) | | 将网站页面翻译成不同语言。 |
| [theme](#theme) | | 管理网站视觉主题，包括生成和应用。 |
| [component](#component) | `comp` | 管理用于构建网站的组件库。 |
| [chat](#chat) | | 启动一个用于网站管理的互动模式（默认）。 |
| [prefs](#prefs) | | 管理从反馈中学习到的已保存的用户偏好。 |
| [history](#history) | | 显示对网站所做先前更新的日志。 |
| [clear](#clear) | | 移除生成的文件、工作区数据或配置设置。 |

---

### generate
`generate` 命令负责协调一个完整网站的创建，从规划网站结构到根据指定的配置文件生成页面内容和模板。

**别名：** `gen`, `g`

**用法：**
```bash 生成网站 icon=lucide:terminal
aigne web generate
```

**参数：**

<x-field-group>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="指定网站配置文件的路径。这通常是自动提供的。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="术语表文件的路径，以确保术语一致。使用 @<file> 格式。"></x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false" data-desc="强制重新生成所有页面，覆盖任何现有的已生成内容。"></x-field>
</x-field-group>

### publish
`publish` 命令将生成的网站文件上传到一个 Pages Kit 实例。它管理批量上传过程并提供状态监控。

**别名：** `pub`, `p`

**用法：**
```bash 发布 --appurl "https://example.com" icon=lucide:terminal
aigne web publish --appUrl "https://example.com"
```

**参数：**

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="将要发布页面的目标 Pages Kit 网站的基础 URL。"></x-field>
  <x-field data-name="with-navigations" data-type="string" data-required="false" data-default="menu" data-desc="发布导航数据。接受的值为 'flat' 或 'menu'。"></x-field>
  <x-field data-name="with-locales" data-type="boolean" data-required="false" data-desc="设置为 true 时，发布网站的区域设置和语言设置。"></x-field>
</x-field-group>

### update
`update` 命令根据用户提供的反馈修改现有网站的内容。它可用于优化文本、添加或删除版块或更改页面结构。

**别名：** `up`

**用法：**
```bash 更新 --pages "/about" --feedback "add A Mission Statement." icon=lucide:terminal
aigne web update --pages "/about" --feedback "Add a mission statement."
```

**参数：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="一个要更新的页面路径数组（例如，[\"/about-us\", \"/contact\"]）。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="对指定页面所需更改或改进的描述。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="术语表文件的路径，以确保术语一致。使用 @<file> 格式。"></x-field>
</x-field-group>

### translate
`translate` 命令将现有网站页面的内容翻译成一种或多种指定语言。

**用法：**
```bash 翻译 --pages "/home" --langs "fr,de,es" icon=lucide:terminal
aigne web translate --pages "/home" --langs "fr,de,es"
```

**参数：**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="一个要翻译的页面路径数组。"></x-field>
  <x-field data-name="langs" data-type="array" data-required="false" data-desc="一个语言代码数组。可用语言：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="用于指导和提高翻译质量的具体说明。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="术语表文件的路径，以确保翻译一致。使用 @<file> 格式。"></x-field>
</x-field-group>

### theme
`theme` 命令管理网站的视觉主题，包括其生成和应用。

#### 子命令

**`generate`**
根据网站的设计和用户建议生成一个新主题。

**别名：** `gen`

**用法：**
```bash 主题生成 --name "customtheme" icon=lucide:terminal
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
```bash 应用主题 icon=lucide:terminal
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
```bash 组件拉取 --url "https://your-pages-kit/api/..." icon=lucide:terminal
aigne web component pull --url "https://your-pages-kit/api/..."
```
<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true" data-desc="用于拉取组件库的完整 URL。"></x-field>
</x-field-group>

**`list`**
列出当前库中可用的组件。

**别名：** `ls`, `l`

**用法：**
```bash 组件列表 icon=lucide:terminal
aigne web component list
```
该子命令不接受任何参数。

### chat
`chat` 命令启动一个交互式会话，以对话方式生成、更新和管理网站。当运行 `aigne web` 而未指定其他命令时，这是执行的默认命令。

**用法：**
```bash 命令 icon=lucide:terminal
aigne web
```
此命令不接受任何参数。

### prefs
`prefs` 命令管理用户偏好，WebSmith 通过反馈学习这些偏好以自定义 AI 行为。

#### 子命令
**`list`**
列出所有已保存的用户偏好。

**别名：** `ls`

**用法：**
```bash 列出偏好 icon=lucide:terminal
aigne web prefs list
```
该子命令不接受任何参数。

**`remove`**
移除一个或多个指定的偏好。

**别名：** `rm`

**用法：**
```bash 移除偏好 --id "pref_abc123" icon=lucide:terminal
aigne web prefs remove --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="要移除的偏好 ID 数组。"></x-field>
</x-field-group>

**`toggle`**
切换一个或多个偏好的激活状态。

**别名：** `t`

**用法：**
```bash 切换偏好 --id "pref_abc123" icon=lucide:terminal
aigne web prefs toggle --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="将要切换状态的偏好 ID 数组。"></x-field>
</x-field-group>

### history
`history` 命令用于查看网站内容和结构的更新历史。

#### 子命令

**`view`**
以紧凑的日志样式格式显示更新历史。每个条目包括一个哈希值、日期、操作和相关的反馈。

**别名：** `log`, `list`

**用法：**
```bash 管理更新历史 icon=lucide:terminal
aigne web history view
```
该子命令不接受任何参数。

### clear
`clear` 命令从项目目录中移除生成的文件、工作区数据或配置设置。

**用法：**
```bash 清除 --targets "generatedpages" "websiteconfig" icon=lucide:terminal
aigne web clear --targets "generatedPages" "websiteConfig"
```

**参数：**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false" data-desc="一个无需提示即可清除的项目数组。有效项目包括：websiteStructure、generatedPages、websiteConfig、deploymentConfig、authTokens、mediaDescription、translationCaches。"></x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="false" data-desc="覆盖源页面的默认目录路径。"></x-field>
  <x-field data-name="tmpDir" data-type="string" data-required="false" data-desc="覆盖临时工作区的默认目录路径。"></x-field>
  <x-field data-name="outputDir" data-type="string" data-required="false" data-desc="覆盖生成页面的默认目录路径。"></x-field>
  <x-field data-name="configPath" data-type="string" data-required="false" data-desc="覆盖配置文件的默认路径。"></x-field>
</x-field-group>

---

## 总结

本参考指南详细介绍了 AIGNE WebSmith CLI 的主要命令和参数。如需面向任务的说明，请参考文档的[指南](./guides.md)部分。
