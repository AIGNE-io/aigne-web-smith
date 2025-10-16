# 清除工作区和数据

`clear` 命令是一个用于管理项目工作区（通常是 `./.websmith/tmp` 目录）的实用工具。它允许您有选择地移除生成的文件、缓存数据和配置设置。当您想要重新开始构建、重置配置或移除敏感的授权数据时，此命令特别有用。

执行该命令可能是一个破坏性操作。在继续之前，请确保您已备份所有重要数据。

## 交互式清除

使用该命令最简单的方法是在不带任何参数的情况下运行它。这将启动一个交互式提示，您可以在其中选择希望清除的特定项目。

```bash 命令行 icon=lucide:terminal
aigne web clear
```

这将显示一个可移除项目的列表。您可以使用方向键进行导航，使用空格键选择项目，并通过按 Enter 键确认您的选择。

## 可清除的目标

下表详细说明了可以清除的特定项目、它们包含的内容以及直接清除它们的命令。

| 目标名称 | 命令标志 | 描述 |
| :--- | :--- | :--- |
| 网站结构 | `websiteStructure` | 从工作区中移除网站结构文件（`website-structure.yaml`）。您的原始源内容不受影响。 |
| 生成的页面 | `generatedPages` | 从工作区中删除所有生成的页面内容。此操作会保留网站结构文件。 |
| 网站配置 | `websiteConfig` | 删除主 `config.yaml` 文件。**注意：** 此操作不可逆。您需要运行 `aigne web init` 来生成新的配置文件。 |
| 授权 | `authTokens` | 删除存储身份验证令牌的 `.env.websmith` 文件。清除后，您需要为发布等操作重新授权 CLI。 |
| 部署配置 | `deploymentConfig` | 仅从您的 `config.yaml` 文件中移除 `appUrl` 键。这在不删除整个网站配置的情况下重置部署目标时非常有用。 |
| 媒体文件描述 | `mediaDescription` | 删除缓存的、由 AI 生成的媒体资产描述。这些描述将在下次运行 `generate` 命令时自动重新生成。 |

## 非交互式清除

要绕过交互式提示，您可以使用 `--targets` 标志，后跟一个或多个目标名称。这对于编写脚本或自动化清理任务非常有用。

### 清除单个目标
要清除单个项目，请使用 `--targets` 标志指定其名称。

```bash 清除网站结构 icon=lucide:terminal
aigne web clear --targets websiteStructure
```

### 清除多个目标

您可以提供一个以空格分隔的目标列表来一次性清除多个项目。以下示例同时清除了网站结构和生成的页面。

```bash 清除多个目标 icon=lucide:terminal
aigne web clear --targets websiteStructure generatedPages
```

## 总结

`clear` 命令提供了一种安全可控的方式来管理您项目的生成资产和配置。使用交互模式进行引导式清理，或使用 `--targets` 标志进行直接的自动化控制。务必谨慎操作，尤其是在清除 `websiteConfig` 时，以避免意外的数据丢失。

清除工作区或生成的页面后，您可能希望继续重新生成网站。有关更多详细信息，请参阅[生成网站](./core-tasks-generating-a-website.md)。