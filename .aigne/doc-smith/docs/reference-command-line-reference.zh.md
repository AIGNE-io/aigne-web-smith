# 命令行参考

本文档为 AIGNE WebSmith 命令行界面（CLI）中可用的所有命令提供了全面的参考。每个命令都详细说明了其用途、可用参数和实际使用示例。

本指南适用于需要详细信息以进行高级操作或自动化脚本的用户。

## 命令摘要

下表快速概述了所有可用的 `aigne web` 子命令。

| Command | Aliases | Description |
| :--- | :--- | :--- |
| `generate` | `gen`, `g` | 从一组需求生成一个完整的网站。 |
| `publish` | - | 将生成的网站内容发布到 Pages Kit。 |
| `update` | - | 根据新的反馈或需求更新现有网站内容。 |
| `translate` | - | 将现有网站页面翻译成不同语言。 |
| `chat` | - | 启动一个交互式聊天会话来构建和修改您的网站。 |
| `theme` | - | 管理网站视觉主题，包括生成和应用。 |
| `component` | `comp` | 管理用于构建网站的组件库。 |
| `prefs` | - | 管理从更新过程中的反馈中学习到的用户偏好。 |
| `history` | - | 显示对网站所做的所有先前更新的日志。 |
| `clear` | - | 移除生成的文件、工作区数据或配置。 |

---

## 主要命令

这些命令构成了使用 WebSmith 创建和管理网站的核心工作流程。

### generate

`generate` 命令是创建新网站的主要工具。它会协调一系列 AI agent 来规划网站结构、为每个页面编写内容并组合最终的数据文件。

**用法**

```bash
aigne web generate [options]
```

**参数**

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>网站需求、结构和内容的详细描述。可以作为字符串提供，也可以通过输入文件（例如 `--input @my-website.yaml`）提供。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>网站目标受众的描述。这有助于 AI 调整内容的语气和重点。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>网站内容的目标语言（例如，`en` 代表英语，`zh` 代表中文）。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>网站期望的视觉和文本风格（例如 `business`、`creative`、`minimalist`）。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>Pages Kit 项目 ID。提供此 ID 有助于定制生成的组件并为发布做准备。</x-field-desc>
  </x-field>
</x-field-group>

**示例**

此示例使用外部 YAML 文件来提供生成规则。

```bash title="使用输入文件生成网站"
aigne web generate --input @my-website.yaml
```

```yaml title="my-website.yaml"
rules: |
  创建一个现代化的 SaaS 产品网站，包括：
  1. 一个具有明确价值主张的主页。
  2. 一个详细介绍产品功能的功能页面。
  3. 一个包含多个订阅等级的定价页面。
  4. 一个带有表单的联系页面。
targetAudience: "中小型企业主"
locale: en
websiteStyle: business
```

### publish

`publish` 命令将生成的网站页面上传到您的 Pages Kit 项目，使其上线。

**用法**

```bash
aigne web publish [options]
```

**参数**

<x-field-group>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>您的 Pages Kit 项目的唯一标识符，网站将发布到该项目。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>指定要发布的网站的语言版本。如果未提供，将使用默认语言环境。</x-field-desc>
  </x-field>
  <x-field data-name="dryRun" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>如果设置为 `true`，该命令将模拟发布过程而不进行任何实际更改，并显示将要上传的内容。</x-field-desc>
  </x-field>
  <x-field data-name="overwrite" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>如果设置为 `true`，Pages Kit 上任何具有相同路径的现有页面都将被覆盖。请谨慎使用。</x-field-desc>
  </x-field>
</x-field-group>

**示例**

```bash title="发布网站的英文版本"
aigne web publish --projectId "your-project-id" --locale en --overwrite
```

### update

`update` 命令允许您优化现有的网站内容。您可以提供反馈或新指令来修改特定页面的结构或详细信息。

**用法**

```bash
aigne web update
```

此命令以交互模式运行，引导您完成选择页面和提供更新反馈的过程。

### translate

`translate` 命令可为您的现有网站页面生成新的语言版本。它会读取源语言环境的内容，并在目标语言中创建相应的页面。

**用法**

```bash
aigne web translate
```

此命令以交互模式运行，提示您选择源页面和目标翻译语言。

### chat

`chat` 命令会启动一个交互式的对话会话来构建或修改您的网站。此模式允许您以自然语言发出指令，AI 将执行相应的操作，例如创建新页面、修改内容或规划网站结构。

**用法**

```bash
aigne web chat
```

## 管理命令

这些命令用于管理与您的网站项目相关的资产、配置和历史记录。

### theme

`theme` 命令组用于管理您网站的视觉样式。

#### theme generate

根据您的设计要求创建一个新的主题配置。

**用法**

```bash
aigne web theme generate --name "My Custom Theme"
```

**参数**

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="true">
    <x-field-desc markdown>您正在创建的新主题的唯一名称。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>如果需要覆盖默认设置，则为配置文件的路径。</x-field-desc>
  </x-field>
</x-field-group>

#### theme apply

将先前生成的主题应用于您的网站。

**用法**

```bash
aigne web theme apply
```

此命令以交互方式运行，允许您选择要应用的主题。

### component

`component` 命令组管理用于构建您网站页面的视觉组件库（例如 Hero、FAQ、CTA）。

#### component pull

从指定的 Pages Kit 项目 URL 拉取组件库。这能确保您的本地项目拥有用于页面生成的最新可用组件。

**用法**

```bash
aigne web component pull --url "your-pages-kit-url"
```

**参数**

<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true">
    <x-field-desc markdown>指向您的 Pages Kit 项目的组件拉取端点的完整 URL。此 URL 包含必要的项目 ID 和身份验证密钥。</x-field-desc>
  </x-field>
</x-field-group>

### prefs

`prefs` 命令允许您查看和管理 WebSmith 在内容更新期间从您的反馈中学到的用户偏好。这些偏好有助于 AI 在未来的操作中更好地与您的风格保持一致。

**用法**

```bash
aigne web prefs [action] [options]
```

**操作与参数**

<x-field-group>
  <x-field data-name="--list" data-type="boolean" data-required="false">
    <x-field-desc markdown>显示所有已保存的偏好，并指明其状态（活动/非活动）、范围和内容。</x-field-desc>
  </x-field>
  <x-field data-name="--remove" data-type="boolean" data-required="false">
    <x-field-desc markdown>移除一个或多个偏好。可与 `--id` 一起使用，如果未提供 ID，则以交互方式进行。</x-field-desc>
  </x-field>
  <x-field data-name="--toggle" data-type="boolean" data-required="false">
    <x-field-desc markdown>切换一个或多个偏好的活动状态。可与 `--id` 一起使用，或以交互方式进行。</x-field-desc>
  </x-field>
  <x-field data-name="--id" data-type="array" data-required="false">
    <x-field-desc markdown>为 `--remove` 或 `--toggle` 操作指定要操作的偏好的唯一 ID。</x-field-desc>
  </x-field>
</x-field-group>

**示例**

```bash title="列出所有已保存的偏好"
aigne web prefs --list
```

```bash title="通过 ID 移除特定偏好"
aigne web prefs --remove --id "pref_abc123"
```

### history

`history` 命令组提供对您网站所做更改日志的访问。

#### history view

以紧凑的、类似 git-log 的格式显示更新历史。每个条目包括一个唯一的哈希值、更改日期、执行的操作以及引发更新的反馈。

**用法**

```bash
aigne web history view
```

### clear

`clear` 命令用于移除生成的内容并重置部分工作区。这对于重新开始或清理磁盘空间很有用。

**用法**

```bash
aigne web clear
```

默认情况下，此命令以交互模式运行，允许您选择要清除的项目。您也可以直接指定目标。

**参数**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false">
    <x-field-desc markdown>一个无需提示即可清除的项目数组。有效值为 `workspace`、`generatedPages` 和 `websiteConfig`。</x-field-desc>
  </x-field>
</x-field-group>

**示例**

```bash title="非交互式地清除工作区和生成的页面"
aigne web clear --targets workspace generatedPages
```