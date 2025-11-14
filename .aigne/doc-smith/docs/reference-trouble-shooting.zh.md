# 故障排除

本指南帮助你诊断和修复使用 AIGNE WebSmith 时的常见问题。如果在生成、发布或配置过程中遇到问题，请查看以下场景的解决方案。

---

## 配置问题

### 问题 1: 错误的 yaml 文件格式

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

**原因：** 配置文件中存在 YAML 语法错误（例如，缩进不正确、冒号错误、缺少引号）。

**修复方法：**
1. 检查错误消息中提到的行号
2. 验证 YAML 语法（使用空格而非制表符；使用正确的冒号格式）
3. 使用 YAML 验证器验证文件
4. 重新运行 `aigne web publish`

---

除了以上配置文件格式不正确的情况需要处理外，其他情况下，如果没有匹配到正确的参数，系统会使用默认参数生成资源。

## 生成问题

### 问题 2: 生成的内容不符合预期

**症状：**
- 内容语气不对
- 结构不符合要求
- 缺少关键信息

**常见原因：**
1. 配置中的 `rules` 不充分或不清晰
2. `targetAudienceTypes` 不匹配
3. `sourcesPath` 稀疏或不相关

**修复方法：**
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

**症状：**
- 生成页面中的图片分辨率低
- 预期的图片未出现

**原因：** `media.minImageWidth` 阈值过滤掉了图片。

**修复方法：**
1. 检查 `config.yaml` 中的当前设置：
   ```yaml
   media:
     minImageWidth: 800  # 当前阈值
   ```

2. 根据需求调整：
   - 较低（400-600）：更多图片，质量风险较低
   - 中等（600-800）：平衡质量/数量（推荐）
   - 较高（800-1000）：更高质量，图片较少

3. 应用更改：
   ```bash
   aigne web update
   ```

---

## 发布问题

### 问题 4: 缺少或无效的 `appUrl`

```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**修复方法：** 设置有效的部署 URL：
```yaml
# 写入正确的URL
appUrl: https://your-site.user.aigne.io

# 或者清理掉，通过 cli 修改
# appUrl: ""
```

### 问题 5: 授权已过期

```
❌ Failed to publish pages: bundle: not authorized
```

**修复方法：** 通过运行以下命令重新授权：
```bash
# 清理掉无效 token 后重新发布
aigne web clear
aigne web publish
```

---

## 恢复方法

### 方法 1: Git 回退

如果你使用版本控制，可以恢复到之前的工作配置：

```bash
git stash
```

然后重新生成：
```bash
aigne web generate
```

---

### 方法 2: 清理重新生成

清除所有生成的文件并从头重新生成：

```bash
aigne web clear && aigne web generate
```

这会恢复到干净状态并基于当前配置重新生成网站。

---

## 预防提示

1. **使用版本控制：** 使用 Git 跟踪配置更改
2. **进行备份：** 在重大编辑前复制配置
3. **验证更改：** 编辑后运行 `aigne web generate` 以尽早发现错误
4. **使用 YAML 验证器：** 在运行命令前检查语法
5. **从小开始：** 在添加复杂性之前先用最小配置测试
6. **记录更改：** 保持对更改内容和原因的记录

---

## 获取更多帮助

如果你尝试了上述解决方案但仍遇到问题：

1. **查看文档：** 查阅 [Config Reference](./reference-config.md) 指南了解详细的字段描述

2. **查看命令参考：** 参阅 [Command Reference](./reference-command.md) 了解详细的命令用法

3. **检查日志：** 查看终端输出中的特定错误消息

4. **使用可观测性工具：** 请参阅下文了解如何捕获详细追踪

5. **社区支持：** 访问 [AIGNE 社区](https://community.arcblock.io/discussions/boards/aigne) 寻求帮助

---

## 使用可观测性进行调试

当你需要报告问题或调试复杂问题时，WebSmith 的可观测性功能可以捕获详细的执行追踪，帮助诊断问题所在。

### 启动可观测性服务器

运行以下命令启动本地追踪服务器：

```bash 启动可观测性服务器 icon=lucide:terminal
aigne observe --port 8888
```

你会看到输出显示：
- 数据库路径：追踪数据存储位置
- 服务器 URL：访问可观测性仪表板的本地地址

![可观测性服务器运行中](../../../assets/images/web-smith-observe.png)

### 查看追踪记录

1. **打开仪表板：** 点击输出中显示的服务器 URL 或在浏览器中打开

2. **浏览追踪：** 仪表板显示所有 WebSmith 操作，包括：
   - 输入/输出令牌
   - 执行时间
   - 函数调用及其结果
   - 错误详情

![显示追踪记录的可观测性仪表板](../../../assets/images/web-smith-observe-dashboard.png)

### 使用追踪报告问题

向社区报告问题时：

1. **捕获追踪：** 在出现问题的操作期间保持可观测性服务器运行
2. **下载追踪数据：** 从仪表板导出相关的追踪记录
3. **报告问题：** 访问 [AIGNE 社区](https://community.arcblock.io/discussions/boards/aigne) 并附上：
   - 问题描述
   - 重现步骤
   - 下载的追踪文件
   - 你的配置（如相关）

**提示：** 追踪包含有关 WebSmith 执行的详细信息，使团队更容易诊断和修复问题。
