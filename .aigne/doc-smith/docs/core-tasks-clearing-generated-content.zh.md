# 清理工作空间和数据

`clear` 命令提供了一种安全便捷的方式来移除生成的内容、临时工作空间文件或整个网站配置。当您想从一个全新的状态开始生成过程、释放磁盘空间或重置项目设置时，此功能尤其有用。

您可以交互式地运行该命令以选择要移除的特定项目，也可以直接指定目标以进行自动化清理。

## 命令用法

要在您的终端中启动清理过程，请运行以下命令：

```bash
aigne clear
```

当不带任何特定目标执行时，该命令会进入交互模式。它将扫描您的项目以查找可移除的项目，并向您呈现一个清单。这是大多数用例的推荐方法，因为它允许您审查将要删除的内容。

```text
? 选择要清理的项目：
❯ ◉ 工作空间
  ◯ 生成的页面
  ◯ 网站配置
```

## 可清理的目标

`clear` 命令可以移除几种类型的数据，每种数据都有特定的用途。

| 目标名称 | 描述 |
| :--- | :--- |
| `workspace` | 移除临时文件和中间数据，例如 AI 生成的网站结构。在重新生成网站之前清理此项通常很有用，以确保不使用任何旧数据。 |
| `generatedPages` | 删除包含最终生成的网站页面和资产的输出目录。 |
| `websiteConfig` | 移除主 `config.yaml` 文件。**请谨慎使用此选项**，因为你需要运行 `aigne web init` 来创建新配置，然后才能再次生成网站。 |

## 清理特定目标

对于脚本或非交互式使用，您可以通过将项目名称作为参数传递给命令来指定要清理的项目。您可以提供一个或多个目标。

该命令将绕过交互式提示，并立即移除指定的项目。

### 示例：清理工作空间和页面

要移除临时工作空间和先前生成的页面而不出现提示，请使用以下命令：

```bash title="Terminal"
aigne clear workspace generatedPages
```

输出将确认哪些项目已被清理，哪些已为空。

```text
✅ 清理成功！

- 🧹 已清理工作空间 (./.tmp)
- 🧹 已清理生成的页面 (./dist)
```

### 示例：清理所有内容

要完全重置您的项目，您可以清理所有可用的目标。

```bash title="Terminal"
aigne clear workspace generatedPages websiteConfig
```

运行此命令后，您将需要重新初始化您的项目。

```text
✅ 清理成功！

- 🧹 已清理工作空间 (./.tmp)
- 🧹 已清理生成的页面 (./dist)
- 🧹 已清理网站配置 (./config.yaml)

👉 运行 `aigne web init` 来生成一个新的配置文件。
```

## 参数

`clear` 命令接受几个可选参数以覆盖默认路径，从而可以对清理过程进行更高级的控制。

<x-field-group>
  <x-field data-name="targets" data-type="array">
    <x-field-desc markdown="true">一个字符串数组，用于指定无需提示即可清理的项目。有效选项为 `workspace`、`generatedPages` 和 `websiteConfig`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string">
    <x-field-desc markdown="true">覆盖源页面的默认目录，这有助于定位 `config.yaml` 文件。</x-field-desc>
  </x-field>
  <x-field data-name="tmpDir" data-type="string">
    <x-field-desc markdown="true">覆盖临时工作空间目录（`.tmp`）的默认路径。</x-field-desc>
  </x-field>
  <x-field data-name="outputDir" data-type="string">
    <x-field-desc markdown="true">覆盖生成的页面输出目录的默认路径。</x-field-desc>
  </x-field>
  <x-field data-name="configPath" data-type="string">
    <x-field-desc markdown="true">提供网站配置文件的直接路径，覆盖任何推断的位置。</x-field-desc>
  </x-field>
</x-field-group>