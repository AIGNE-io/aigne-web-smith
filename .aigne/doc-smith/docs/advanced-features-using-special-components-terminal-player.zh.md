# 终端播放器

终端播放器是一个专用组件，用于在您的网站上显示可交互的、预先录制的终端会话。该组件是演示命令行指令、展示软件安装过程或以清晰、可回放的格式引导用户完成技术流程的有效工具。

该组件使用 `asciinema` 格式创建的录制文件，这确保了对终端输出进行轻量级的、基于文本的捕获。

## 流程概述

使用终端播放器的工作流程可以分解为一系列清晰、可管理的步骤。该过程始于开发者录制终端会话，并以最终用户在网站上查看交互式回放结束。

```d2
direction: down

Developer: {
  shape: c4-person
}

Terminal: {
  label: "终端\n（使用 asciinema CLI）"
  shape: rectangle
}

Cast-File: {
  label: "my-demo.cast"
  shape: rectangle
}

Online-Converter: {
  label: "ArcBlock 在线转换器"
  shape: rectangle
}

JSON-File: {
  label: "my-demo.json"
  shape: rectangle
}

Website-Project: {
  label: "网站项目"
  shape: rectangle

  Page-Config: {
    label: "页面 YAML 配置"
  }

  Terminal-Player-Component: {
    label: "TerminalPlayer 组件"
  }
}

Website-Visitor: {
  shape: c4-person
}

Developer -> Terminal: "1. 录制会话"
Terminal -> Cast-File: "2. 生成"
Cast-File -> Online-Converter: "3. 上传并转换"
Online-Converter -> JSON-File: "4. 下载"
JSON-File -> Website-Project.Page-Config: "5. 在配置中引用"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "配置"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 显示回放"
```

## 创建终端录制文件

要使用终端播放器，您必须首先创建一个录制文件。推荐的工具是 `asciinema`，它是一个用于录制和分享终端会话的开源命令行实用程序。

### 第 1 步：安装 `asciinema` CLI

首先，在您的本地计算机上安装 `asciinema` 工具。安装方法因您的操作系统而异。

```bash 安装 icon=lucide:download
# 在 macOS 上使用 Homebrew
brew install asciinema

# 在 Ubuntu/Debian 上使用 APT
sudo apt install asciinema

# 使用 pipx（跨平台）
pipx install asciinema
```

有关其他安装选项，请参阅官方 [asciinema 文档](https://docs.asciinema.org/)。

### 第 2 步：录制您的会话

安装 `asciinema` 后，您可以通过执行 `rec` 命令开始录制终端会话。

```bash 录制命令 icon=lucide:radio-tower
# 开始新的录制，文件将保存为 'my-demo.cast'
asciinema rec my-demo.cast
```

启动该命令后，在终端中执行您希望捕获的所有操作。要停止录制，请按 `Ctrl+D` 或键入 `exit` 命令。一个名为 `my-demo.cast` 的文件将保存在您的当前目录中。您可以通过运行 `asciinema play my-demo.cast` 在本地验证回放。

**重要注意事项：**
*   **规划您的步骤：** 录制会捕获所有操作，包括停顿和错误。建议事先准备好脚本。
*   **终端尺寸：** 播放器将复制录制时所用终端的列数和行数尺寸。请确保您的终端窗口大小适当，以防止在回放期间发生内容换行或截断。

### 第 3 步：将 `.cast` 文件转换为 JSON

Terminal Player 组件要求录制数据为特定的 JSON 格式。有一个在线转换器可以简化此转换过程。

1.  **访问转换器：** 在您的网络浏览器中打开 [ArcBlock 终端播放器转换器](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)。
2.  **上传您的文件：** 将您的 `.cast` 文件拖放到页面上。
3.  **预览和下载：** 该工具将生成您录制内容的实时预览。确认无误后，下载转换后的 `.json` 文件。
4.  **添加到项目：** 将下载的 JSON 文件放入您网站的媒体或资产目录中。

## 使用 Terminal Player 组件

创建并转换录制文件后，您可以通过在页面的配置文件中定义它，将 Terminal Player 集成到任何页面中。您需要指定录制文件的 JSON 文件路径，并可以根据需要配置其布局。

### 配置示例

以下是在页面的数据文件中配置 `TerminalPlayer` 组件的示例。

```yaml 页面配置示例 icon=lucide:file-cog
# 在您页面的 YAML 配置文件中（例如 page-name.yaml）

# ... 其他页面内容 ...

sections:
  - component: TerminalPlayer
    props:
      # 显示在终端播放器上方的标题
      title: "Live Demo"
      # 简要描述录制内容
      description: "This demo shows how to initialize a new AIGNE WebSmith project."
      # 您的录制文件的相对路径
      recording: "/assets/data/my-demo.json"
      # (可选) 组件的布局。默认为 'right'。
      layout: "left"

# ... 其他页面部分 ...
```

### 组件属性

`TerminalPlayer` 组件接受以下属性来自定义其外观和行为。

| 属性 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | 是 | 组件部分的标题。 |
| `description` | `string` | 否 | 与标题一同显示的简短描述。 |
| `recording` | `string` | 是 | JSON 录制文件的路径。 |
| `layout` | `string` | 否 | 决定文本内容相对于播放器的位置。可以是 `left` 或 `right`。默认为 `right`。 |

## 总结

Terminal Player 组件提供了一种可靠的方法来演示命令行工作流程。通过遵循使用 `asciinema` 录制、在线转换文件以及在页面数据中配置组件的流程，您可以为用户制作引人入胜且内容丰富的技术教程。

如需更多信息，请查阅 [asciinema 官方网站](https://asciinema.org/)。