# 最新动态

“最新动态”组件提供了一种动态的方式，用于在您的网站上展示最新的新闻、博客文章或公告。它与博客系统 Discuss Kit 集成，可自动获取和显示内容，从而保持您的网站内容新颖，并展示持续的活跃度。

该组件特别适用于：
- 展示新功能、更新或技术文章。
- 提供“证明与势头”——即可见的、持续的进展。
- 增强品牌透明度和用户参与度。

## 如何使用

要实现“最新动态”部分，您必须准备一个数据源文件，然后在您网站的生成规则中引用它。这个过程非常简单，可以确保 AI 能够正确定位并渲染内容。

### 步骤 1：准备数据文件

首先，创建一个作为数据描述符的 YAML 文件，告诉 WebSmith 从哪里获取博客内容。

建议将此文件放置在 `src/blog-list-data.yaml`。

#### 数据文件示例

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "最新动态"
blogDescription: "在此处获取最新更新。"
blogUrl: "https://www.arcblock.io" # 或者是您的 Discuss Kit Blocklet URL
blogLabel: "did-domain"
blogMoreButtonText: "查看更多"
```

#### 字段说明

| 字段 | 说明 | 必需 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle` | 该部分显示的主标题。为清晰起见，建议保持在 60 个字符以内。 | 是 |
| `blogDescription` | 显示在标题下方的简要摘要，用于解释该部分的内容。 | 是 |
| `blogUrl` | 源 URL，通常是您的 Discuss Kit Blocklet。WebSmith 会自动提取标题、摘要、封面图片和日期。Discuss Kit API 必须可以公开访问。 | 是 |
| `blogLabel` | 一个可选的筛选标签，用于显示特定分类的内容。该值应从您的 Discuss Kit 网站获取（例如，URL 中的 `labels` 查询参数）。 | 否 |
| `blogMoreButtonText` | 可选的“查看更多”按钮的文本，该按钮可以链接到您的主博客或新闻页面。 | 否 |

### 步骤 2：注册数据源

创建数据文件后，您必须注册它，以便 WebSmith 能够找到并使用它。

将文件路径添加到您的 `config.yaml` 文件中的 `sourcesPath` 字段：

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

如果您正在更新现有网站，还必须将文件路径添加到 `.aigne/web-smith/pages/workspace/website-structure.yaml` 文件的 `sourceIds` 部分下。这可以确保 WebSmith 在执行 `update` 操作期间能够找到新的数据源。

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### 步骤 3：在生成规则中定义该部分

接下来，通过向您的 WebSmith `config.yaml` 文件添加一条规则，来指示 AI 如何使用该数据源。该规则应指定该部分的位置、组件类型和数据源。

#### 规则示例

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

此示例规则实现了以下目标：
*   **定位**：将“最新动态”组件放置为页面上的第二个部分。
*   **组件类型**：将该部分标识为“最新动态”或“博客列表”类型。
*   **数据源**：指向 `src/blog-list-data.yaml` 作为配置来源。

或者，在使用 `update` 命令时，您可以提供直接的提示，而无需编辑 `config.yaml` 文件：

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### 步骤 4：生成或更新您的网站

在数据文件和生成规则就绪后，运行相应的命令，让 AIGNE WebSmith 构建或刷新您的网站。如果是首次生成，请使用 `aigne web generate`。要向现有网站添加一个部分，请使用 `aigne web update` 并选择要添加该部分的文档。

现在，WebSmith 将自动加载您的 YAML 数据，从指定的 Discuss Kit URL 检索最新的帖子，并在您的网站上渲染“最新动态”部分。

## 总结

“最新动态”组件是一个强大的工具，可以使您的网站内容保持最新并富有吸引力。通过遵循创建数据文件和定义生成规则的简单步骤，您可以自动化在网站上直接显示新闻和博客文章的过程。

有关其他特殊组件的更多信息，请参阅关于[使用特殊组件](./advanced-features-using-special-components.md)的文档。
