# 故障排除

本指南帮助你诊断和修复使用 AIGNE WebSmith 时的常见问题。如果在生成、发布或配置过程中遇到问题，请查看以下场景的解决方案。

---

## 配置问题

### 错误 1: "Config file not found"

**错误消息：**
```
Config file not found: .aigne/web-smith/config.yaml
```

**原因：** 配置文件在预期位置不存在。

**修复方法：** 
- 运行 `aigne web generate`（它会引导你自动创建配置，然后开始生成）
- 或运行 `aigne web init`（它会引导你创建配置但不开始生成）

---

### 错误 2: "Error parsing config file"

**错误消息：**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因：** 配置文件中存在 YAML 语法错误（例如，缩进不正确、冒号错误、缺少引号）。

**修复方法：**
1. 检查错误消息中提到的行号
2. 验证 YAML 语法（使用空格而非制表符；使用正确的冒号格式）
3. 使用 YAML 验证器验证文件
4. 重新运行 `aigne web generate`

---

### 错误 3: 从 `standard` 切换到 `singlePage` 但未运行 `clear`

**错误消息：**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因：** 将 `websiteScale` 从 `standard` 改为 `singlePage` 但未先运行 `clear`，导致结构冲突。

**修复方法：**
1. 运行 `aigne web clear` 删除旧的生成文件
2. 运行 `aigne web generate` 使用新规模重新生成
3. **在更改 `websiteScale` 时，始终在 `generate` 之前运行 `clear`**

---

### 错误 4: "Invalid locale code"

**错误消息：**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因：** 在 `locale` 或 `translateLanguages` 中使用了不支持的语言代码。

**修复方法：**
1. 检查支持的语言代码列表
2. 使用有效的 IETF 语言代码（例如 `en`、`zh`、`ja`）
3. 更新配置并重新运行命令

---

### 错误 5: "No data sources found"

**错误消息：**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**原因：** `sourcesPath` 为空，或所有指定的路径不存在或无法访问。

**修复方法：**
1. 验证 `sourcesPath` 中的文件/目录是否存在
2. 检查文件权限（确保文件可读）
3. 向 `sourcesPath` 添加有效路径（例如 `["./README.md", "./docs"]`）
4. 重新运行 `aigne web generate`

---

## 生成问题

### 问题 1: 生成的内容不符合预期

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

### 问题 2: 图片质量低或缺失

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

### 问题 3: 发布失败

**症状：**
- 发布命令失败
- 发布后网站无法访问
- 授权错误

**常见原因：**

**原因 1: 缺少或无效的 `appUrl`**
```yaml
appUrl: ""  # 空或无效
```
**修复方法：** 设置有效的部署 URL：
```yaml
appUrl: https://your-site.user.aigne.io
```

**原因 2: 授权已过期**
**修复方法：** 通过运行以下命令重新授权：
```bash
aigne web publish
```
按照浏览器提示重新进行身份验证。

**原因 3: 网络连接问题**
**修复方法：**
1. 检查你的互联网连接
2. 验证目标 URL 是否可访问
3. 几分钟后再试

---

## 翻译问题

### 问题 4: 翻译不正确或不完整

**症状：**
- 缺少翻译页面
- 翻译质量差
- 输出中语言混杂

**修复方法：**

**对于缺少的翻译：**
1. 验证配置中的 `translateLanguages`：
   ```yaml
   translateLanguages:
     - zh
     - ja
   ```

2. 运行翻译命令：
   ```bash
   aigne web translate
   ```

**对于质量差的问题：**
1. 确保在翻译前源内容（`locale` 语言）已完成
2. 使用术语表确保术语一致性
3. 如需要，手动审查和改进翻译

---

## 性能问题

### 问题 5: 生成时间过长

**症状：**
- `aigne web generate` 运行时间过长
- 系统变得无响应

**常见原因：**

**原因 1: 数据源过多**
**修复方法：** 将 `sourcesPath` 减少到仅包含必要文件：
```yaml
sourcesPath:
  - ./README.md
  - ./docs
  # 删除: ./node_modules（不必要）
  # 删除: ./dist（生成的文件）
```

**原因 2: 网站规模过大**
**修复方法：** 从较小的规模开始：
```yaml
websiteScale: minimal  # 或 singlePage
```

**原因 3: 图片过多**
**修复方法：** 提高 `minImageWidth` 以过滤更多图片：
```yaml
media:
  minImageWidth: 1000  # 更高的阈值
```

---

## 恢复方法

### 方法 1: Git 回退

如果你使用版本控制，可以恢复到之前的工作配置：

```bash
git revert HEAD
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

### 方法 3: 从备份恢复

如果你有备份配置：

```bash
cp config-backup.yaml .aigne/web-smith/config.yaml
aigne web generate
```

---

### 方法 4: 重新创建配置

如果配置严重损坏：

1. 备份当前配置：
   ```bash
   cp .aigne/web-smith/config.yaml config-broken.yaml
   ```

2. 使用初始化向导重新创建：
   ```bash
   aigne web init
   ```

3. 如需要，从备份合并任何自定义值

---

## 常见 YAML 格式错误

### 错误: 全角（中文）冒号

**错误：**
```yaml
projectName： "My Project"  # 全角冒号
```

**正确：**
```yaml
projectName: "My Project"  # ASCII 冒号
```

---

### 错误: 缩进问题

**错误：**
```yaml
pagePurpose:
- landingPage  # 缺少缩进
```

**正确：**
```yaml
pagePurpose:
  - landingPage  # 两个空格缩进
```

---

### 错误: 值类型错误

**错误：**
```yaml
pagePurpose: landingPage  # 字符串而非数组
```

**正确：**
```yaml
pagePurpose:
  - landingPage  # 数组格式
```

---

### 错误: 特殊字符缺少引号

**错误：**
```yaml
projectDesc: AI-powered tool: generates websites  # 冒号未加引号
```

**正确：**
```yaml
projectDesc: "AI-powered tool: generates websites"  # 已加引号
```

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

---

## 常见问题

**问：更改未生效**
- **原因：** 文件未保存、YAML 错误，或需要重新生成
- **修复：** 保存文件、修复 YAML、运行 `aigne web generate`、验证输出

**问：如何添加语言？**
- 运行 `aigne web translate` 并按照提示操作
- 该命令会自动更新配置中的 `translateLanguages`

**问：如何修复格式错误？**
- **常见问题：** 全角冒号、缩进不一致、数组格式错误
- **修复：** 遵循上面的 YAML 格式示例，如需要可从备份恢复

**问：网站未发布到预期 URL？**
- **检查：** 验证配置中的 `appUrl` 与你的预期目标匹配
- **修复：** 更新 `appUrl` 并运行 `aigne web publish`

