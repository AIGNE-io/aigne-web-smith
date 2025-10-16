# 终端播放器

终端播放器是一个专用组件，用于在您的网站上显示可交互的、预先录制的终端会话。该组件是一个有效的工具，可以清晰且可回放地演示命令行指令、展示软件安装过程或引导用户完成技术流程。

该组件使用 `asciinema` 格式创建的录制文件，这种格式可以确保对终端输出进行轻量级的、基于文本的捕获。

## 流程概述

使用终端播放器的工作流程可以分解为一系列清晰、可管理的步骤。该过程始于开发者录制终端会话，并以最终用户在网站上观看交互式回放结束。

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

## 创建终端录制

要使用终端播放器，您必须首先创建一个录制文件。推荐的工具是 `asciinema`，这是一个用于录制和分享终端会话的开源命令行实用工具。

### 第 1 步：安装 asciinema CLI

首先，在您的本地机器上安装 `asciinema` 工具。安装方法因您的操作系统而异。

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
# 开始新的录制，将保存到 'my-demo.cast'
asciinema rec my-demo.cast
```

启动命令后，在您的终端中执行所有您希望捕获的操作。要停止录制，请按 `Ctrl+D` 或输入 `exit` 命令。一个名为 `my-demo.cast` 的文件将保存在您当前的目录中。您可以通过运行 `asciinema play my-demo.cast` 在本地验证回放。

**重要注意事项：**
*   **规划您的步骤：** 录制会捕获所有操作，包括暂停和错误。建议事先准备一个脚本。
*   **终端尺寸：** 播放器将复制用于录制的终端的列数和行数尺寸。请确保您的终端窗口大小适当，以防止在回放期间内容换行或被截断。

### 第 3 步：将 .cast 文件转换为 JSON

终端播放器组件要求录制数据为特定的 JSON 格式。有一个在线转换器可以简化此转换过程。

1.  **导航至转换器：** 在您的网络浏览器中打开 [ArcBlock 终端播放器转换器](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)。
2.  **上传您的文件：** 将您的 `.cast` 文件拖放到页面上。
3.  **预览和下载：** 该工具将生成您录制的实时预览。确认无误后，下载转换后的 `.json` 文件。
4.  **添加到项目：** 将下载的 JSON 文件放入您网站的媒体或资产目录中。
 
## 使用录制文件
 
一旦 JSON 录制文件被放置在您项目的媒体或资产目录中，它就可以被 AI 使用。无需在 YAML 文件中手动配置该组件。
 
只需在您的内容源文件中描述需要一个终端演示。当您运行 `aigne web generate` 或 `aigne web update` 时，AI 将自动找到相关的 `.json` 录制文件，并使用终端播放器组件将其显示在您的网站上。
 
```bash AIGNE CLI 命令 icon=lucide:terminal
# 从头开始生成网站
aigne web generate
 
# 使用您的更改更新网站
aigne web update
```
 
有关录制的更多信息，您可以查阅官方 [asciinema 网站](https://asciinema.org/)。