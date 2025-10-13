# 管理偏好

当你向 WebSmith 提供反馈时（例如，在 `update` 过程中），它会从你的指令中学习。为了让未来的生成内容更智能、更符合你的风格，WebSmith 可以将这些反馈保存为“偏好”。这些偏好是可重用的规则，会在未来自动应用。

`prefs` 命令是你管理这些已保存指令的工具。你可以查看所有已保存的偏好，暂时禁用它们，或永久删除它们。这确保了你能够完全控制 WebSmith 如何为你定制其行为。

## 理解偏好

每个偏好规则都包含几个部分，用以定义其功能和应用时机。当你列出偏好时，它们会以结构化格式显示。

以下是各部分的含义明细：

| 组件 | 描述 |
| :--- | :--- |
| **状态** | 指示规则是否激活。🟢 表示已激活并将被使用。⚪ 表示未激活并将被忽略。 |
| **范围** | 决定规则何时应用。有四种范围：`global`、`structure`、`page` 和 `translation`。例如，`page` 范围的规则仅在优化页面内容时使用。 |
| **ID** | 偏好的唯一标识符（例如，`pref_a1b2c3d4`）。你可以使用此 ID 来切换或删除特定规则。 |
| **路径** | 如果规则仅限于特定文件，相关路径会在此列出。如果是通用规则，则此项为空。 |
| **规则** | WebSmith 将遵循的实际指令。这是你所提供反馈的简明摘要。 |

## 列出所有偏好

要查看 WebSmith 为你保存的所有偏好，请使用 `--list` 标志。此命令提供了每个规则的完整概览，包括其状态、范围、ID 和指令本身。

```bash 命令 icon=lucide:terminal
websmith prefs --list
```

**输出示例：**

```text 输出示例
# 用户偏好

**格式说明：**
- 🟢 = 已激活的偏好，⚪ = 未激活的偏好
- [scope] = 偏好范围 (global, structure, page, translation)
- ID = 偏好唯一标识符
- Paths = 特定文件路径 (如果适用)

🟢 [page] pref_1a2b3c4d
   代码注释必须用英文书写。

⚪ [structure] pref_5e6f7g8h | Paths: /overview, /tutorials
   在概述和教程页面末尾添加“后续步骤”部分。
```

## 切换偏好状态

如果你想暂时禁用某个偏好而不是永久删除它，可以使用 `--toggle` 标志。切换偏好会将其状态在激活 (🟢) 和非激活 (⚪) 之间转换。

你可以通过 `--id` 选项提供偏好的 ID 来指定要切换的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --toggle --id pref_1a2b3c4d
```

如果你运行该命令时不带任何 ID，WebSmith 将进入交互模式，允许你从列表中选择希望切换的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --toggle
```

这将显示一个当前偏好的清单，供你选择。

## 删除偏好

当你不再需要某个偏好时，可以使用 `--remove` 标志将其永久删除。

要删除一个或多个特定偏好，请使用 `--id` 选项提供它们的 ID。

```bash 命令 icon=lucide:terminal
websmith prefs --remove --id pref_1a2b3c4d pref_5e6f7g8h
```

与切换类似，如果你运行 `remove` 命令时未指定任何 ID，WebSmith 将启动一个交互式清单，你可以在其中选择要删除的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --remove
```

---

通过管理你的偏好，你可以随着时间的推移不断优化和引导 AI 的行为，确保生成的内容始终符合你的标准。有关如何创建偏好的更多信息，请参阅[更新网站内容](./core-tasks-updating-website-content.md)部分。