# 管理偏好

当您向 WebSmith 提供反馈时（例如，在 `update` 过程中），它会从您的指令中学习。为了让未来的生成结果更智能、更符合您的风格，WebSmith 可以将这些反馈保存为“偏好”。这些偏好是可重用的规则，会在将来自动应用。

`prefs` 命令是您用来管理这些已保存指令的工具。您可以查看所有已保存的偏好，暂时禁用它们，或永久移除它们。这确保了您可以完全控制 WebSmith 为您定制其行为的方式。

## 理解偏好

每个偏好规则都包含几个部分，用于定义其功能和应用时机。当您列出偏好时，您会看到它们以结构化格式显示。

以下是各部分的含义明细：

| 组件 | 说明 |
| :--- | :--- |
| **状态** | 指示规则是否生效。🟢 表示生效并将被使用。⚪ 表示未生效并将被忽略。 |
| **范围** | 决定规则何时应用。有四种范围：`global`、`structure`、`page` 和 `translation`。例如，`page` 范围的规则仅在优化页面内容时使用。 |
| **ID** | 偏好的唯一标识符（例如，`pref_a1b2c3d4`）。您可以使用此 ID 来切换或移除特定规则。 |
| **路径** | 如果规则仅限于特定文件，相关路径将在此处列出。如果是一般性规则，则此项为空白。 |
| **规则** | WebSmith 将遵循的实际指令。这是您所提供反馈的简明摘要。 |

## 列出所有偏好

要查看 WebSmith 为您保存的所有偏好，请使用 `--list` 标志。此命令提供了每个规则的完整概览，包括其状态、范围、ID 和指令本身。

```bash 命令 icon=lucide:terminal
websmith prefs --list
```

**示例输出：**

```text 示例输出
# 用户偏好

**格式说明：**
- 🟢 = 生效的偏好, ⚪ = 未生效的偏好
- [scope] = 偏好范围 (global, structure, page, translation)
- ID = 偏好唯一标识符
- Paths = 特定文件路径 (如果适用)

🟢 [page] pref_1a2b3c4d
   代码注释必须用英文书写。

⚪ [structure] pref_5e6f7g8h | Paths: /overview, /tutorials
   在概述和教程页面的末尾添加“后续步骤”部分。
```

## 切换偏好状态

如果您想暂时禁用某个偏好而不永久删除它，可以使用 `--toggle` 标志。切换偏好会将其状态在生效 (🟢) 和未生效 (⚪) 之间切换。

您可以通过 `--id` 选项提供偏好的 ID 来指定要切换的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --toggle --id pref_1a2b3c4d
```

如果您在运行命令时不带任何 ID，WebSmith 将进入交互模式，让您从列表中选择希望切换的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --toggle
```

这将显示您当前偏好的清单，供您选择。

## 移除偏好

当您不再需要某个偏好时，可以使用 `--remove` 标志将其永久删除。

要移除一个或多个特定偏好，请使用 `--id` 选项提供它们的 ID。

```bash 命令 icon=lucide:terminal
websmith prefs --remove --id pref_1a2b3c4d pref_5e6f7g8h
```

与切换类似，如果您在运行 `remove` 命令时未指定任何 ID，WebSmith 将启动一个交互式清单，您可以在其中选择要删除的偏好。

```bash 命令 icon=lucide:terminal
websmith prefs --remove
```

---

通过管理您的偏好，您可以随着时间的推移优化和引导 AI 的行为，确保生成的内容始终符合您的标准。有关如何创建偏好的更多信息，请参阅[更新网站内容](./core-tasks-updating-website-content.md)部分。