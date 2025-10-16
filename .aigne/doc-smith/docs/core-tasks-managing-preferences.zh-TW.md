# 管理偏好設定

當您向 WebSmith 提供回饋時（例如，在 `update` 過程中），它會從您的指令中學習。為了讓未來的生成結果更智能、更符合您的風格，WebSmith 可以將這些回饋儲存為「偏好設定」。這些偏好設定是可重複使用的規則，會在未來自動套用。

`prefs` 指令是您用來管理這些已儲存指令的工具。您可以檢視所有已儲存的偏好設定、暫時停用它們，或永久移除它們。這確保您能完全控制 WebSmith 為您客製化其行為的方式。

## 了解偏好設定

每個偏好設定規則都包含幾個部分，用以定義其功能和套用時機。當您列出偏好設定時，會看到它們以結構化格式顯示。

以下是各個部分的含義說明：

| 元件 | 說明 |
| :--- | :--- |
| **狀態** | 表示規則是否啟用。🟢 表示啟用並將被使用。⚪ 表示未啟用並將被忽略。 |
| **範圍** | 決定規則應在何時套用。共有四種範圍：`global`、`structure`、`page` 和 `translation`。例如，`page` 範圍的規則僅在優化頁面內容時使用。 |
| **ID** | 偏好設定的唯一識別碼（例如，`pref_a1b2c3d4`）。您可以使用此 ID 來切換或移除特定規則。 |
| **路徑** | 如果規則僅限於特定檔案，相關路徑會在此列出。如果是通用規則，此處將為空白。 |
| **規則** | WebSmith 將遵循的實際指令。這是您所提供回饋的簡潔摘要。 |

## 列出所有偏好設定

若要查看 WebSmith 為您儲存的所有偏好設定，請使用 `--list` 旗標。此指令提供了每個規則的完整概覽，包括其狀態、範圍、ID 和指令本身。

```bash 指令 icon=lucide:terminal
aigne web prefs --list
```

**輸出範例：**

```text 輸出範例
# 使用者偏好設定

**格式說明：**
- 🟢 = 啟用中的偏好設定，⚪ = 未啟用的偏好設定
- [scope] = 偏好設定範圍 (global, structure, page, translation)
- ID = 唯一的偏好設定識別碼
- Paths = 特定檔案路徑（如適用）

🟢 [page] pref_1a2b3c4d
   程式碼註解必須以英文撰寫。

⚪ [structure] pref_5e6f7g8h | Paths: /overview, /tutorials
   在概覽和教學頁面的末尾新增一個「後續步驟」章節。
```

## 切換偏好設定的狀態

如果您想暫時停用某個偏好設定而不永久刪除它，可以使用 `--toggle` 旗標。切換偏好設定會將其狀態在啟用（🟢）和未啟用（⚪）之間轉換。

您可以透過 `--id` 選項提供其 ID，以指定要切換的偏好設定。

```bash 指令 icon=lucide:terminal
aigne web prefs --toggle --id pref_1a2b3c4d
```

如果您執行此指令時未提供任何 ID，WebSmith 將進入互動模式，讓您從列表中選擇要切換的偏好設定。

```bash 指令 icon=lucide:terminal
aigne web prefs --toggle
```

這將會顯示您目前偏好設定的清單，供您勾選選擇。

## 移除偏好設定

當您不再需要某個偏好設定時，可以使用 `--remove` 旗標將其永久刪除。

若要移除一個或多個特定的偏好設定，請使用 `--id` 選項提供其 ID。

```bash 指令 icon=lucide:terminal
aigne web prefs --remove --id pref_1a2b3c4d pref_5e6f7g8h
```

與切換狀態類似，如果您在執行 `remove` 指令時未指定任何 ID，WebSmith 將啟動一個互動式清單，您可以在其中選擇要刪除的偏好設定。

```bash 指令 icon=lucide:terminal
aigne web prefs --remove
```

---

透過管理您的偏好設定，您可以隨著時間的推移，不斷優化並引導 AI 的行為，確保生成的內容始終符合您的標準。有關如何建立偏好設定的更多資訊，請參閱 [更新網站內容](./core-tasks-updating-website-content.md) 章節。