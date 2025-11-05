# 管理偏好设置

AIGNE WebSmith 会根据您的反馈进行学习，以优化其生成和更新网站的方式。这些学习到的指令会作为用户偏好设置进行存储。`prefs` 命令提供了一种查看、管理和清除这些已保存偏好设置的方法，让您能够完全控制 AI 的行为。

管理您的偏好设置可确保 AI 随着时间的推移，始终遵循您特定的风格指南、内容要求和结构约定。

## 列出偏好设置

要查看所有当前已保存的偏好设置，请使用 `list` 命令。该命令会显示一个包含所有偏好规则的表格，其中包括规则的 ID、激活状态、作用域以及规则本身。

```bash terminal icon=lucide:terminal
aigne web prefs list
```

您也可以使用别名 `ls`：

```bash terminal icon=lucide:terminal
aigne web prefs ls
```

### 示例输出

输出将是一个格式化的表格，便于您审查已保存的规则。

| ID         | Active | Scope     | Rule                                                               |
| :--------- | :----- | :-------- | :----------------------------------------------------------------- |
| pref_a1b2c3d4 | true   | page      | 以正式、专业的口吻写作。                              |
| pref_e5f6g7h8 | true   | structure | 不要为已过时的“旧版 API 参考”生成页面或章节。 |
| pref_i9j0k1l2 | false  | theme     | 医疗保健网站必须使用暖色调。                     |

## 切换偏好设置

如果您想临时禁用某个偏好设置而不永久删除它，可以使用 `toggle` 命令。该命令可以切换规则的 `active`（激活）状态。要切换特定规则，您必须使用 `--id` 参数提供其唯一 ID。

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id <PREFERENCE_ID>
```

您也可以使用别名 `t`：

```bash terminal icon=lucide:terminal
aigne web prefs t --id <PREFERENCE_ID>
```

### 示例

要停用上述示例中的主题偏好设置：

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id pref_i9j0k1l2
```

再次运行 `aigne web prefs list` 将会显示 `pref_i9j0k1l2` 的状态为 `false`。对同一个 ID 再次运行 toggle 命令会重新激活它。

## 移除偏好设置

要永久删除不再需要的偏好设置，请使用 `remove` 命令。此操作不可逆。您必须通过 `--id` 参数提供要删除规则的 ID 来指定它。

```bash terminal icon=lucide:terminal
aigne web prefs remove --id <PREFERENCE_ID>
```

您也可以使用别名 `rm`：

```bash terminal icon=lucide:terminal
aigne web prefs rm --id <PREFERENCE_ID>
```

### 示例

要永久移除上述示例中的页面偏好设置：

```bash terminal icon=lucide:terminal
aigne web prefs remove --id pref_a1b2c3d4
```

指定的偏好设置将从您的 `preferences.yml` 文件中移除。

## 理解偏好设置的作用域

偏好设置根据其分配的 `scope`（作用域）来应用，作用域决定了规则在何种上下文中被触发。

| Scope         | Description                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------ |
| **global**    | 适用于所有生成和内容优化的阶段。用于通用的风格或内容规则。   |
| **structure** | 仅在规划或更新网站结构（例如，添加、删除页面）时应用。          |
| **page**      | 在生成或优化单个页面的内容时应用。                                    |
| **translation** | 仅在内容翻译过程中应用。                                                    |
| **theme**     | 在生成或修改网站的视觉主题（如颜色和字体）时应用。              |

## 总结

`prefs` 命令是用于自定义和控制 AIGNE WebSmith 长期行为的重要工具。通过列出、切换和移除偏好设置，您可以维护一套简洁有效的规则，确保 AI 始终能生成符合您项目特定需求的结果。