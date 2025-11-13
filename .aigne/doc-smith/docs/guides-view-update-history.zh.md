# 查看更新历史

本指南将指导您如何查询 `aigne web history`、解读日志格式以及筛选或检查单个更新。

AIGNE WebSmith 会自动为您的网站所做的每一项更改保留详细的日志。无论您是更新单个页面的内容还是重组整个网站结构，每个操作都会被记录下来。这份历史记录提供了一个清晰、按时间顺序排列的记录，让您可以跟踪进度并回顾过去的修改。

`aigne web history` 命令是访问此日志的主要工具。它允许您以类似于 Git 等版本控制系统的格式查看所有已记录更新的列表。

## 查看历史日志

要查看完整的更新列表，请使用 `aigne web history view` 命令。此命令会显示从最新到最旧的所有条目。

```bash 查看更新历史 icon=lucide:terminal
aigne web history view
```

### 理解输出

该命令将生成一个列表，其中每一行代表一次更新。其格式设计得既简洁又信息丰富。

**示例输出：**

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
| **哈希值 (Hash)** | 一个唯一的 7 位字符代码（`e5c7a91`），用于标识特定的更新。 |
| **日期 (Date)** | 一个相对时间戳，指示更新发生的时间（例如，“5 minutes ago”）。 |
| **操作 (Operation)** | 发生更改的类型。这可能是 `structure_update`（针对全站更改）或 `page_update`（针对特定页面的内容编辑）。 |
| **页面路径 (Page Path)** | 如果操作是 `page_update`，则会以括号形式显示被修改页面的路径（例如，`(about-us)`）。 |
| **反馈 (Feedback)** | 您在运行 `update` 命令时提供的描述性消息。此文本解释了更改的目的。 |

### 命令别名

为方便起见，`aigne web history` 命令接受 `view` 的多个别名。以下命令是等效的，并将产生相同的输出：

-   `aigne web history log`
-   `aigne web history list`

选择您最容易记住的一个即可。

## 总结

`aigne web history` 命令是跟踪您网站演变过程的重要工具。通过查看日志，您可以轻松回忆起过去更改的细节，了解它们发生的时间，并看到其背后的原因。

有关创建这些历史记录条目的操作的更多信息，请参阅以下部分：
-   [更新网站](./guides-update-website.md)
-   [更新网站结构](./guides-update-website-update-structure.md)