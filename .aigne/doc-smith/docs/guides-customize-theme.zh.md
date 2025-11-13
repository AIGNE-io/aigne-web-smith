# 自定义主题

统一的颜色、字体和间距能让您的网站显得更专业。本指南将详细介绍如何借助 AI 生成新的 WebSmith 主题，并将其应用到您的线上网站。

AIGNE WebSmith 通过两个子命令简化了主题管理：

- **`theme generate`** – 捕捉您的设计方向并将其保存为 YAML 主题文件。
- **`theme apply`** – 将任何已保存的主题上传到您的线上网站。

请按照以下步骤完成主题的创建和应用全过程。

## 生成新主题

1. **启动生成器**

   ```bash 运行命令 icon=lucide:terminal
   aigne web theme generate
   ```
   _别名：`aigne web theme gen`_

2. **描述外观和风格**  
   终端会要求您提供名称、调色板、字体和氛围。请提供具体的提示（例如“深色背景、霓虹色点缀、圆角标题”），以便 AI 能够塑造设计。
3. **查看预览列表**  
   生成后，主题会出现在本地的 `themes` 目录中，并附带元数据（主色、字体），如下所示。如果您想微调 token，可以编辑 YAML 文件。

![主题生成提示，显示了带有元数据的已保存主题列表](../../../assets/images/web-smith-theme.png)

## 应用主题

生成一个或多个主题后，您可以使用 `theme apply` 命令选择一个已保存的主题并将其应用到您的网站。该命令会读取您本地的主题文件，以列表形式呈现它们，并在您确认后，将所选主题上传到您的网站，使更改生效。

### 流程

1.  **运行命令**：在终端中执行 `aigne web theme apply`。
2.  **选择主题**：该工具会扫描 `themes` 目录，并显示您已生成的所有可用主题列表。该列表包含主题名称、主色和字体等详细信息，以帮助您进行选择。
3.  **审查与确认**：系统将显示目标网站 URL、当前活动主题以及您选择的新主题。在进行任何更改之前，系统会要求您进行最终确认。
4.  **应用至网站**：确认后，主题将被上传并应用到您的网站。一条成功消息将提示该过程已完成。

### 用法

要应用现有主题，请使用以下命令。

```sh
aigne web theme apply
```

您也可以直接将网站 URL 作为参数指定。如果省略，将使用您 `config.yaml` 文件中的 `appUrl`。

```sh
aigne web theme apply --appUrl https://your-website.com
```

### 参数

`apply` 命令接受以下参数：

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>您的网站的完整 URL。如果您未提供此项，该命令将使用您 `config.yaml` 配置文件中定义的 `appUrl`。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>您的配置文件的位置。默认为标准的 `config.yaml` 路径。</x-field-desc>
  </x-field>
</x-field-group>

### 处理主题锁定

为防止网站的线上主题被意外更改，Blocklet 应用程序包含一个“主题锁定”功能。如果主题被锁定，任何从终端应用新主题的尝试都将被阻止。

当您尝试将主题应用到已锁定的网站时，您会遇到 `403 Forbidden` 错误：

```
Failed to apply theme: Failed to upload theme data: 403 Forbidden
{"code":"internal_server_error","error":"Theme is locked and cannot be modified"}
```

要解决此问题，您必须通过网站的管理界面解锁主题：

1.  **登录**到您网站的管理后台。
2.  在管理菜单中导航至**网站 > 主题**。
3.  点击**解锁按钮**以移除主题锁定。
4.  再次运行 `aigne web theme apply`。

![解锁主题按钮界面](../../../assets/images/unlock-theme.webp)

---

通过遵循这些步骤，您可以有效地管理您网站的视觉形象。更新主题后的下一步，您可能需要查看如何[发布您的网站](./guides-publish-website.md)。