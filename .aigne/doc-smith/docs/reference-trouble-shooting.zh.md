# 故障排除

本指南帮助你诊断和修复使用 AIGNE WebSmith 时的常见问题。如果在生成、发布或配置过程中遇到问题，请查看以下场景的解决方案。

---

## 配置问题

### 问题 1: 配置文件格式错误

**错误消息：**
```
Error: Failed to parse config file: Implicit map keys need to be followed by map values at line 112, column 1:

lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
appUrl： https://staging.websmith.aigne.io
```

```
Error: Failed to parse config file: Map keys must be unique at line 116, column 1:

projectCover: .aigne/web-smith/cover.png
appUrl: https://staging.websmith.aigne.io
^
```

**可能的原因：** 配置文件中的 YAML 语法有误，常见问题包括：
- 缩进使用了制表符而不是空格
- 使用了中文冒号（：）而不是英文冒号（:）
- 缺少必要的引号
- 重复的配置项

**解决方法：**
1. 查看错误提示中的行号，定位问题位置
2. 检查该行的缩进是否正确（使用空格，不要用 Tab）
3. 确认冒号是英文半角冒号（:），不是中文全角冒号（：）
4. 使用在线 YAML 验证工具检查语法
5. 修复后重新运行 `aigne web publish`

---

> **提示：** 除了配置文件格式错误需要修复外，如果某些参数未正确配置，系统会自动使用默认值，不会影响基本功能。

## 生成问题

### 问题 2: 生成的内容不符合预期

**你可能会遇到：**
- 生成的内容语气不符合你的要求
- 页面结构与你期望的不一致
- 缺少一些重要的信息

**可能的原因：**
1. 配置中的 `rules` 描述不够详细或不够清晰
2. `targetAudienceTypes` 设置与实际目标受众不匹配
3. `sourcesPath` 中的参考文档太少或不够相关

**如何解决：**
1. **丰富 `rules`：** 在 `config.yaml` 中添加详细指导：
   ```yaml
   rules: |
     ### 页面结构要求
     1. 首屏必须包含：
        * 清晰的产品标题
        * 简洁的描述
        * 主要行动号召
     
     ### 内容语气
     - 使用积极、自信的语言
     - 包含具体数据和示例
     - 避免营销术语
   ```

2. **调整受众：** 确保 `targetAudienceTypes` 与实际受众匹配：
   ```yaml
   targetAudienceTypes:
     - customers      # 面向最终用户
     - developers     # 面向技术受众
   ```

3. **添加更多来源：** 在 `sourcesPath` 中包含相关文档：
   ```yaml
   sourcesPath:
     - ./README.md
     - ./docs
     - ./CHANGELOG.md
   ```

---

### 问题 3: 图片质量低或缺失

**你可能会遇到：**
- 生成的页面中图片清晰度不够
- 期望出现的图片没有显示出来

**原因：** 这是因为 `media.minImageWidth` 设置的值太高，过滤掉了一些图片。

**如何解决：**
1. 打开 `config.yaml` 文件，找到 `media` 配置项：
   ```yaml
   media:
     minImageWidth: 800  # 当前阈值
   ```

2. 根据你的需求调整这个值：
   - **400-600**：会包含更多图片，但可能有一些质量较低的图片
   - **600-800**：质量和数量比较平衡（推荐设置）
   - **800-1000**：只保留高质量图片，数量会减少

3. 保存文件后运行更新命令：
   ```bash
   aigne web update
   ```

---

## 发布问题

### 问题 4: 发布时提示 URL 无效

**错误提示：**
```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**原因：** 配置中的 `appUrl` 为空或指向了一个无效的网站地址。

**如何解决：**
在 `config.yaml` 中设置正确的部署地址：
```yaml
# 填入你的网站地址
appUrl: https://your-site.user.aigne.io

# 如果暂时没有网站，可以先清空这个配置
# appUrl: ""
```

### 问题 5: 发布时提示授权已过期

**错误提示：**
```
❌ Failed to publish pages: bundle: not authorized
```

**原因：** 你的登录凭证已过期，需要重新授权。

**如何解决：**
按顺序运行以下命令：
```bash
# 先清理旧的授权信息
aigne web clear

# 然后重新发布，系统会提示你重新登录
aigne web publish
```

---

## 如何恢复

### 方法 1: 使用 Git 恢复

如果你使用 Git 管理代码，可以快速恢复到之前正常工作的配置：

```bash
# 暂存当前更改
git stash
```

然后重新生成网站：
```bash
aigne web generate
```

> **提示：** 如果之后想恢复刚才暂存的更改，可以运行 `git stash pop`

---

### 方法 2: 清理后重新生成

如果遇到无法定位的问题，可以清除所有生成的文件，然后从头开始重新生成：

```bash
# 清理所有生成的文件，然后重新生成
aigne web clear && aigne web generate
```

> **注意：** 这会删除所有已生成的内容，但不会影响你的配置文件。执行后系统会基于当前配置重新生成网站。

---

## 使用建议

以下是一些实用的建议，可以帮助你避免常见问题：

1. **保存修改历史：** 如果使用 Git，每次修改配置文件后记得提交，这样出问题时可以轻松回到之前的版本
2. **修改前先备份：** 在修改重要配置前，先复制一份配置文件作为备份，以防万一
3. **修改后立即测试：** 每次修改配置后，马上运行 `aigne web generate` 测试一下，有问题可以及时发现
4. **检查格式是否正确：** 修改 YAML 文件后，可以用在线工具检查一下格式有没有错误
5. **从简单开始：** 刚开始时使用最简单的配置，确认一切正常后，再慢慢添加更复杂的功能
6. **记录你的修改：** 简单记录一下每次修改了什么、为什么修改，以后遇到问题时更容易找到原因

---

## 获取更多帮助

如果以上方法都无法解决你的问题，可以尝试：

1. **查阅配置文档：** 查看 [Config Reference](./reference-config.md) 了解每个配置项的详细说明

2. **查看命令文档：** 参考 [Command Reference](./reference-command.md) 了解命令的详细用法

3. **查看错误日志：** 仔细阅读终端中显示的错误信息，通常会有具体的提示

4. **使用 AIGNE Observability：** 使用下文介绍的 AIGNE Observability 工具，获取详细的执行记录

5. **寻求社区帮助：** 访问 [AIGNE 社区](https://community.arcblock.io/discussions/boards/aigne) 提问，其他用户或开发者可能会帮助你

---

## 使用 AIGNE Observability 排查问题

当你遇到复杂问题需要深入排查，或者要向社区报告问题时，可以使用 **AIGNE Observability**。它会详细记录每一步的执行过程，帮助你或技术支持人员快速找到问题所在。

### 启动 Observability 服务器

运行以下命令启动本地 Observability 服务器：

```bash 启动 Observability 服务器 icon=lucide:terminal
aigne observe
```

你会看到输出显示：
- 数据库路径：追踪数据保存的位置
- 服务器地址：在浏览器中打开这个地址可以查看 Observability 仪表板

![Observability 服务器运行中](../../../assets/images/web-smith-observe.png)

### 查看执行记录

1. **打开仪表板：** 点击输出中显示的服务器地址，或在浏览器中打开

2. **查看操作记录：** 仪表板会显示所有 WebSmith 的操作，包括：
   - 输入和输出的数据
   - 每一步花费的时间
   - 执行的操作步骤和结果
   - 详细的错误信息

![显示执行记录的 Observability 仪表板](../../../assets/images/web-smith-observe-dashboard.png)

### 使用 Observability 报告问题

向社区报告问题时：

1. **捕获追踪：** 在出现问题的操作期间保持 Observability 服务器运行
2. **导出追踪数据：** 从仪表板导出相关的执行记录
3. **报告问题：** 访问 [AIGNE 社区](https://community.arcblock.io/discussions/boards/aigne) 并附上：
   - 问题描述
   - 重现步骤
   - 导出的追踪文件
   - 你的配置（如相关）

> **提示：** 追踪记录包含了 WebSmith 执行的完整信息，包括每一步的操作和结果。将这些信息提供给技术支持或社区，可以大大提高问题解决的效率。
