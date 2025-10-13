# 更新页面内容

本文档提供了修改单个网页内容的说明。完成此任务的主要方法是使用 `aigne update` 命令，该命令允许您通过提供简单的基于文本的反馈来优化页面细节。

此过程与修改整个网站地图不同。有关添加、删除或重组页面的说明，请参阅 [更新网站结构](./core-tasks-updating-website-content-updating-website-structure.md) 指南。

## 更新流程

`update` 命令会启动一个交互式流程，AI 会根据您的具体指令对页面进行更改。该系统旨在解释自然语言反馈以执行有针对性的修改。

操作流程如下：

1.  **启动命令**：在您的终端中运行 `aigne update`。
2.  **选择页面**：系统将显示所有现有页面的列表。选择您希望修改的单个页面。
3.  **提供反馈**：系统将提示您输入反馈。这是一个关于您想做的更改的纯文本描述。
4.  **AI 修改**：AI 会分析您的反馈，并使用一套内容修改工具来更新页面的内容结构。
5.  **审查并保存**：更新后的页面内容将被保存，流程完成。

### 命令示例

要在项目的根目录中开始更新流程，请执行以下命令：

```bash Aigne CLI icon=lucide:terminal
aigne update
```

然后，系统将提示您为所选页面提供反馈。例如：

```text 反馈提示
? Please provide your feedback for improving the page content: (Press Enter to skip) › Change the title of the hero section to "Welcome to AIGNE WebSmith".
```

## 支持的内容修改

AI 可以对页面的各个部分执行多种类型的内容修改。“部分”是指页面上一个独立的内容块，例如首屏大图、功能列表或联系表单。

下表概述了支持的操作以及触发这些操作的反馈类型。

| 操作 | 描述 | 反馈示例 |
| :--- | :--- | :--- |
| **更新部分** | 修改现有部分的属性，例如其标题、文本或其他属性。 | “在‘关于我们’部分，将标题更改为‘我们的使命’。” |
| **添加部分** | 在页面的指定位置添加一个新部分。 | “在引言之后添加一个包含三列功能列表的新部分。” |
| **删除部分** | 根据名称从页面中删除整个部分。 | “删除‘客户评价’部分。” |
| **移动部分** | 更改页面上各个部分的顺序。 | “将‘联系我们’部分移动到页面的最后。” |

## 实践示例

### 示例 1：更新部分的标题

-   **目标**：更改“主页”页面上的主标题。
-   **要选择的页面**：`/home`
-   **反馈**：`Change the hero section's title to "Creative Solutions for Modern Business".`

AI 将识别首屏大图部分并更新其标题属性，页面上的所有其他内容保持不变。

### 示例 2：添加新部分

-   **目标**：在“服务”页面添加一个常见问题解答（FAQ）部分。
-   **要选择的页面**：`/services`
-   **反馈**：`Add a new FAQ section after the 'Our Process' section. Include questions about pricing, timelines, and support.`

AI 将生成一个包含所请求内容的新部分，并将其插入到页面的指定位置。

### 示例 3：删除部分

-   **目标**：从“定价”页面删除一个过时的“促销”部分。
-   **要选择的页面**：`/pricing`
-   **反馈**：`Delete the 'Current Promotions' section.`

AI 将定位名为“当前促销”的部分，并将其从页面布局中完全删除。

### 示例 4：重排部分顺序

-   **目标**：在“关于”页面上，将“团队”部分移动到“招聘”部分之前。
-   **要选择的页面**：`/about`
-   **反馈**：`Move the 'Our Team' section to be right before the 'Careers' section.`

AI 将调整页面上各个部分的顺序以匹配您的请求。

---

这种由反馈驱动的方法可以实现精确直观的内容更新，而无需直接编辑配置文件。对于涉及多个页面的更复杂的结构性更改，请参阅 [更新网站结构](./core-tasks-updating-website-content-updating-website-structure.md) 指南。