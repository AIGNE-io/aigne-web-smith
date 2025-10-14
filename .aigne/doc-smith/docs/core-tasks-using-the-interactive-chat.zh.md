# 使用交互式聊天

`chat` 命令提供了一个交互式、对话式的界面，用于构建和管理您的网站。您无需运行像 `generate` 或 `update` 这样的单个命令，而是可以用自然语言描述您的需求，AI 助手将引导您完成整个过程。对于偏好引导式体验的用户来说，这是一个理想的起点。

## 工作原理

交互式聊天会话由一个专用的 AI agent 驱动，该 agent 能够理解您的请求并使用其他 WebSmith 工具来执行任务。它会保留您的对话记忆，让您可以进行连续的更改并在之前的操作基础上继续构建。

总体工作流程遵循一个简单的对话循环：

```d2
direction: down

start: {
  label: "开始聊天会话"
  shape: oval
}

user_input: {
  label: "用户提供请求\n（例如，'创建一个网站'）"
}

ai_process: {
  label: "AI 助手分析请求"
}

execute_task: {
  label: "AI 执行适当的命令\n（generate, update, publish 等）"
  shape: diamond
}

show_result: {
  label: "助手显示结果\n并等待下一条指令"
}

end: {
  label: "结束聊天会话"
  shape: oval
}

start -> user_input
user_input -> ai_process
ai_process -> execute_task
execute_task -> show_result: "成功"
show_result -> user_input
execute_task -> user_input: "需要更多信息"
user_input -> end: "用户输入 'exit'"
```

## 开启交互式会话

要开始，请在您的终端中运行 `chat` 命令：

```bash
aigne web chat
```

这将启动助手，它会向您问好并等待您的指令。

## 您可以做什么

聊天助手可以执行 AIGNE WebSmith CLI 中可用的大多数核心任务。您可以直接要求它：

*   **生成新网站**：描述您的网站要求、目标受众和期望的风格。
*   **更新现有内容**：指定您想要更改的页面或部分，并提供新的详细信息。
*   **翻译页面**：请求将特定页面翻译成另一种语言。
*   **发布您的网站**：告诉助手您已准备好将网站发布到 Pages Kit。
*   **管理文件**：要求查看当前文件结构或特定页面的内容。

## 示例对话

以下是一个示例，展示了如何使用交互式聊天来创建、修改和发布一个简单的网站。

```bash Command Line icon=lucide:terminal
aigne web chat

> 欢迎使用 AIGNE WebSmith 交互式助手！
> 今天我能如何帮助您构建网站？

您：
我需要为一个新的 SaaS 产品创建一个网站，该产品帮助团队管理他们的项目。

> 当然。您能提供更多一些细节吗？
> - 产品的核心功能是什么？
> - 目标受众是谁？
> - 网站应该采用什么风格（例如，商务、现代、活泼）？

您：
主要功能是任务跟踪、团队协作和报告。目标受众是中小型企业主。我们采用现代商务风格吧。

> 谢谢。我已经有足够的信息来规划网站结构了。
> 我现在将生成以下页面：
> - 首页
> - 功能
> - 定价
> - 关于我们
> - 联系我们
> ...
> [生成过程开始]
> ...
> 网站生成完成。文件已保存到 'output' 目录。
> 接下来您想做什么？

您：
在首页上，添加一个客户评价部分。

> 明白了。我将在首页添加一个客户评价部分。
> [更新过程开始]
> ...
> 首页已更新。还有其他事吗？

您：
不，暂时就这些了。请发布网站。

> 我现在将把网站发布到您配置的 Pages Kit 项目。
> [发布过程开始]
> ...
> 您的网站已成功发布。
> 您现在可以输入 'exit' 退出聊天。

您：
exit

> 再见！
```

## 退出聊天

要在任何时候结束您的交互式会话，只需输入 `exit` 或 `quit` 并按回车键。

---

交互式聊天是管理整个网站生命周期的强大方式，无需记忆特定的命令和参数。如果需要更直接的控制，您可以随时使用后续章节中详述的标准命令。

### 延伸阅读

*   [生成网站](./core-tasks-generating-a-website.md)
*   [更新网站内容](./core-tasks-updating-website-content.md)
*   [发布您的网站](./core-tasks-publishing-your-website.md)