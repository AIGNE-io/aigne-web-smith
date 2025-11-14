# 互动模式

> **注意：** 互动模式功能目前处于测试阶段。虽然功能齐全，但您可能会遇到意外行为。在我们不断改进此体验的过程中，感谢您的反馈。

本指南将指导您启动 `aigne web chat`，用自然语言与 WebSmith 对话，并让助手代表您触发生成/更新/发布操作。

`chat` 命令提供了一个交互式的对话界面，用于构建和管理您的网站。您无需运行像 `generate` 或 `update` 这样的单个命令，而是可以用简单的语言描述您的需求，AI 助手将引导您完成整个过程。对于喜欢更有指导性体验的用户来说，这是一个理想的起点。

## 工作原理

互动模式会话由一个专用的 AI agent 提供支持，该 agent 能够理解您的请求并使用其他 WebSmith 工具来执行任务。它会保留您的对话记忆，让您可以进行顺序更改并在先前的操作基础上继续构建。

总体工作流程遵循一个简单的对话循环：

```d2
direction: down

start: {
  label: "开始互动模式会话"
  shape: oval
}

user_input: {
  label: "用户提供请求\n（例如，‘创建一个网站’）"
}

ai_process: {
  label: "AI 助手分析请求"
}

execute_task: {
  label: "AI 执行适当的命令\n（生成、更新、发布等）"
  shape: diamond
}

show_result: {
  label: "助手显示结果\n并等待下一条指令"
}

end: {
  label: "结束互动模式会话"
  shape: oval
}

start -> user_input
user_input -> ai_process
ai_process -> execute_task
execute_task -> show_result: "成功"
show_result -> user_input
execute_task -> user_input: "需要更多信息"
user_input -> end: "用户输入 ‘exit’"
```

## 启动交互式会话

首先，在您的终端中运行 `chat` 命令：

```bash 命令 icon=lucide:terminal
aigne web
```

这将启动助手，它会向您问好并等待您的指令。

## 您可以做什么

互动模式助手可以执行 AIGNE WebSmith CLI 中可用的大多数核心任务。您可以直接要求它：

*   **生成一个新网站**：描述您的网站要求、目标受众和期望的风格。
*   **更新现有内容**：指定您想要更改的页面或部分，并提供新的详细信息。
*   **翻译页面**：请求将特定页面翻译成另一种语言。
*   **发布您的网站**：告诉助手您准备好将网站发布到 Pages Kit。
*   **管理文件**：要求查看当前的文件结构或特定页面的内容。

## 示例对话

以下是一个示例，展示了如何使用互动模式来创建、修改和发布一个简单的网站。

```bash 命令行 icon=lucide:terminal
aigne web

> Welcome to the AIGNE WebSmith interactive assistant!
> How can I help you build your website today?

You:
我需要为一个新的 SaaS 产品创建一个网站，该产品帮助团队管理他们的项目。

> Of course. Could you please provide a few more details?
> - What are the core features of the product?
> - Who is the target audience?
> - What style should the website have (e.g., business, modern, playful)?

You:
主要功能是任务跟踪、团队协作和报告。目标受众是中小型企业主。我们采用现代商务风格吧。

> Thank you. I have enough information to plan the website structure.
> I will now generate the following pages:
> - Home
> - Features
> - Pricing
> - About Us
> - Contact
> ...
> [Generation process starts]
> ...
> Website generation is complete. The files have been saved to the 'output' directory.
> What would you like to do next?

You:
在主页上，添加一个客户评价部分。

> Understood. I will add a customer testimonials section to the homepage.
> [Update process starts]
> ...
> The homepage has been updated. Is there anything else?

You:
不，暂时就这些。请发布网站。

> I will now publish the website to your configured Pages Kit project.
> [Publishing process starts]
> ...
> Your website has been successfully published.
> You can now exit the chat by typing 'exit'.

You:
exit

> Goodbye!
```

## 退出互动模式

要随时结束您的交互式会话，只需输入 `exit` 或 `quit` 并按 Enter 键。

---

互动模式是管理整个网站生命周期的强大方式，无需记住特定的命令和参数。如果需要更直接的控制，您可以随时使用后续章节中详细介绍的标准命令。

### 进一步阅读

*   [创建网站](./guides-create-website.md)
*   [更新网站](./guides-update-website.md)
*   [发布网站](./guides-publish-website.md)
