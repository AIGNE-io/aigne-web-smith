# 最新动态

“最新动态”组件提供了一种动态方式，用于在您的网站上展示最新新闻、博客文章或公告。它与博客系统 Discuss Kit 集成，可自动获取和显示内容，保持您的网站内容新颖，并展示持续的活跃度。

该组件特别适用于：
- 宣布新功能、产品更新或技术文章。
- 为进展和发展势头提供切实证明。
- 提高品牌透明度和用户参与度。

## 配置指南

要实现“最新动态”部分，您必须准备一个数据源文件，然后在您网站的生成规则中引用它。这个过程简单明了，能确保 AI 正确找到并呈现内容。

### 第 1 步：准备数据文件

首先，创建一个 YAML 文件，用于指定更新的来源和呈现方式。该文件充当数据描述符，告知 WebSmith 从何处获取博客内容。

建议将此文件放置在 `src/blog-list-data.yaml`。

#### 数据文件示例

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # 您的 Discuss Kit Blocklet URL
blogLabel: "japan" # 可选的筛选标签
blogMoreButtonText: "See More"
```

#### 字段说明

下表详细说明了数据文件中的可配置字段。

| 字段 | 说明 | 是否必需 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle` | 该部分显示的主标题。为清晰起见，建议长度不超过 60 个字符。 | 是 |
| `blogDescription` | 显示在标题下方的简要摘要，用于解释该部分的内容。 | 是 |
| `blogUrl` | 内容所在的源 URL。这应该是您的 Discuss Kit Blocklet 的 URL。WebSmith 会自动提取文章标题、摘要、封面图片和发布日期。 | 是 |
| `blogLabel` | 用于筛选文章的可选标签。这使您可以显示来自特定类别的内容，例如某个产品、功能或地区。 | 否 |
| `blogMoreButtonText` | 可选的“查看更多”按钮的文本，该按钮可以链接到您的主博客或新闻页面。 | 否 |

### 第 2 步：在生成规则中定义该部分

创建数据文件后，您需要指示 AI 如何使用它。这通过在您的 WebSmith `config.yaml` 文件中添加一条规则来完成。该规则应指定该部分的位置、组件类型和数据源。

#### 规则示例

```yaml config.yaml icon=yaml
Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum. Connect each featured post to a specific ArcBlock capability or outcome.
```

此示例规则完成以下操作：
*   **定位：** 将“最新动态”组件放置为页面上的第二个部分。
*   **组件类型：** 将该部分标识为“博客列表”类型。
*   **数据源：** 指向 `src/blog-list-data.yaml` 作为配置源。

### 第 3 步：生成或更新您的网站

数据文件和生成规则就绪后，运行相应命令，让 AIGNE WebSmith 构建或刷新您的网站。如果是首次生成，请使用 `aigne web generate`。要向现有网站添加部分，请使用 `aigne web update` 并选择要添加该部分的文档。

现在，WebSmith 将自动加载您的 YAML 数据，从指定的 Discuss Kit URL 检索最新文章，并在您的网站上渲染“最新动态”部分。

## 高级用法

对于更复杂的网站，您可以使用 `blogLabel` 字段在不同页面上创建多个独立的更新部分，每个部分都按特定主题进行筛选。

## 总结

“最新动态”组件是一个功能强大的工具，可让您的网站内容保持最新并富有吸引力。通过遵循创建数据文件和定义生成规则的简单步骤，您可以自动化在网站上直接显示新闻和博客文章的过程。

有关其他特殊组件的更多信息，请参阅[使用特殊组件](./advanced-features-using-special-components.md)的文档。