# 查看更新历史

AIGNE WebSmith 会自动为您对网站所做的每一次更改维护详细的日志。无论您是更新单个页面的内容还是重新组织整个网站结构，每个操作都会被记录下来。这个历史记录提供了一个清晰、按时间顺序排列的记录，让您可以跟踪进度并回顾过去的修改。

`web history` 命令是访问此日志的主要工具。它允许您以类似于 Git 等版本控制系统的格式查看所有已记录更新的列表。

## 查看历史日志

要查看完整的更新列表，请使用 `web history view` 命令。该命令会显示从最新到最旧的所有条目。

```bash Terminal icon=lucide:terminal
aigne web history view
```

### 理解输出

该命令将生成一个列表，其中每一行代表一次更新。其格式设计得简洁明了。

**输出示例：**

```bash
📜 Update History

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

日志中的每个条目都包含几个关键信息。以下是各组成部分的分解说明：

| 组件 | 描述 |
| :--- | :--- |
| **哈希值** | 一个唯一的 7 位字符代码（`e5c7a91`），用于标识特定的更新。 |
| **日期** | 一个相对时间戳，指示更新发生的时间（例如，“5 minutes ago”）。 |
| **操作** | 发生更改的类型。这可能是 `structure_update`（针对全站更改）或 `page_update`（针对特定页面的内容编辑）。 |
| **页面路径** | 如果操作是 `page_update`，则会用括号显示被修改页面的路径（例如，`(about-us)`）。 |
| **反馈** | 您在运行 `update` 命令时提供的描述性消息。此文本解释了更改的目的。 |

### 命令别名

为方便起见，`web history` 命令接受 `view` 的几个别名。以下命令是等效的，并将产生相同的输出：

-   `aigne web history log`
-   `aigne web history list`

选择您最容易记住的一个即可。

## 总结

`web history` 命令是跟踪您网站演变的重要工具。通过查看日志，您可以轻松回忆起过去更改的细节，了解它们是何时进行的，并看到其背后的原因。

有关创建这些历史条目的操作的更多信息，请参阅以下部分：
-   [更新网站内容](./core-tasks-updating-website-content.md)
-   [更新网站结构](./core-tasks-updating-website-content-updating-website-structure.md)