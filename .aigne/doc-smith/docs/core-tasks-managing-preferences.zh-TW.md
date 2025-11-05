# 管理偏好設定

AIGNE WebSmith 會從您的回饋中學習，以改善其生成和更新網站的方式。這些學習到的指令會儲存為使用者偏好設定。`prefs` 指令提供了一種檢視、管理和清除這些已儲存偏好設定的方法，讓您完全控制 AI 的行為。

管理您的偏好設定可確保 AI 隨著時間的推移，始終遵循您特定的風格指南、內容要求和結構慣例。

## 列出偏好設定

若要檢視所有目前已儲存的偏好設定，請使用 `list` 指令。此指令會顯示一個包含所有偏好設定規則的表格，包括其 ID、啟用狀態、範圍以及規則本身。

```bash terminal icon=lucide:terminal
aigne web prefs list
```

您也可以使用別名 `ls`：

```bash terminal icon=lucide:terminal
aigne web prefs ls
```

### 範例輸出

輸出將會是一個格式化的表格，讓您能輕鬆檢視已儲存的規則。

| ID | Active | Scope | Rule |
| :--------- | :----- | :-------- | :----------------------------------------------------------------- |
| pref_a1b2c3d4 | true | page | 以正式、專業的語氣撰寫。 |
| pref_e5f6g7h8 | true | structure | 不要為過時的「舊版 API 參考」生成頁面或區塊。 |
| pref_i9j0k1l2 | false | theme | 醫療保健網站必須使用暖色調。 |

## 切換偏好設定

如果您想暫時停用某個偏好設定而不永久刪除它，您可以使用 `toggle` 指令。此指令會切換規則的 `active` 狀態。若要切換特定規則，您必須使用 `--id` 參數提供其唯一的 ID。

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id <PREFERENCE_ID>
```

您也可以使用別名 `t`：

```bash terminal icon=lucide:terminal
aigne web prefs t --id <PREFERENCE_ID>
```

### 範例

若要停用上述範例中的主題偏好設定：

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id pref_i9j0k1l2
```

再次執行 `aigne web prefs list` 會顯示 `pref_i9j0k1l2` 的狀態為 `false`。對同一個 ID 再次執行 toggle 指令會重新啟用它。

## 移除偏好設定

若要永久刪除不再需要的偏好設定，請使用 `remove` 指令。此操作不可逆。您必須透過 `--id` 參數提供其 ID 來指定要刪除的規則。

```bash terminal icon=lucide:terminal
aigne web prefs remove --id <PREFERENCE_ID>
```

您也可以使用別名 `rm`：

```bash terminal icon=lucide:terminal
aigne web prefs rm --id <PREFERENCE_ID>
```

### 範例

若要永久移除上述範例中的頁面偏好設定：

```bash terminal icon=lucide:terminal
aigne web prefs remove --id pref_a1b2c3d4
```

指定的偏好設定將會從您的 `preferences.yml` 檔案中移除。

## 了解偏好設定範圍

偏好設定會根據其指定的 `scope`（範圍）來應用，這決定了觸發規則的情境。

| Scope | Description |
| :------------ | :------------------------------------------------------------------------------------------------------ |
| **global** | 適用於所有生成和內容改善階段。用於通用的風格或內容規則。 |
| **structure** | 僅在規劃或更新網站結構時應用（例如，新增、移除頁面）。 |
| **page** | 在生成或改善個別頁面內容時應用。 |
| **translation** | 僅在內容翻譯過程中應用。 |
| **theme** | 在生成或修改網站的視覺主題時應用，例如顏色和字體。 |

## 總結

`prefs` 指令是客製化和控制 AIGNE WebSmith 長期行為的重要工具。透過列出、切換和移除偏好設定，您可以維護一套簡潔有效的規則，確保 AI 持續產出符合您專案特定需求的結果。