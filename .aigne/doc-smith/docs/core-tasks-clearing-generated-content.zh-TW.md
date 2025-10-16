# 清除工作區與資料

`clear` 指令是一個用於管理您專案工作區（通常是 `./.websmith/tmp` 目錄）的工具。它允許您選擇性地移除生成的檔案、快取資料和設定。當您想重新開始一個全新的建置、重設您的設定或移除敏感的授權資料時，這個功能特別有用。

執行此指令可能是一個破壞性操作。請在繼續之前，確保您已備份所有重要資料。

## 互動式清除

使用此指令最簡單的方式是不帶任何參數直接執行。這將會啟動一個互動式提示，您可以在其中選擇希望清除的特定項目。

```bash Command Line icon=lucide:terminal
aigne web clear
```

這將會顯示一個可供移除的項目列表。您可以使用方向鍵導覽，用空白鍵選擇項目，並按 Enter 鍵確認您的選擇。

## 可清除的目標

下表詳細說明了可以清除的特定項目、它們包含的內容，以及直接清除它們的指令。

| 目標名稱 | 指令旗標 | 說明 |
| :--- | :--- | :--- |
| 網站結構 | `websiteStructure` | 從工作區中移除網站結構檔案（`website-structure.yaml`）。您原始的源內容不會受到影響。 |
| 生成的頁面 | `generatedPages` | 從工作區中刪除所有生成的頁面內容。此操作會保留網站結構檔案。 |
| 網站設定 | `websiteConfig` | 刪除主要的 `config.yaml` 檔案。**注意：** 此操作不可逆。您需要執行 `aigne web init` 來生成一個新的設定檔。 |
| 授權 | `authTokens` | 刪除儲存驗證權杖的 `.env.websmith` 檔案。清除後，您需要為發布等操作重新授權 CLI。 |
| 部署設定 | `deploymentConfig` | 僅從您的 `config.yaml` 檔案中移除 `appUrl` 金鑰。這在您想重設部署目標而不想刪除整個網站設定時很有用。 |
| 媒體檔案描述 | `mediaDescription` | 刪除為您的媒體資產快取的 AI 生成描述。這些描述將在下次執行 `generate` 指令時自動重新生成。 |

## 非互動式清除

若要繞過互動式提示，您可以使用 `--targets` 旗標，後面跟著一個或多個目標名稱。這對於編寫指令碼或自動化清理任務很有用。

### 清除單一目標
若要清除單一項目，請使用 `--targets` 旗標指定其名稱。

```bash Clear Website Structure icon=lucide:terminal
aigne web clear --targets websiteStructure
```

### 清除多個目標

您可以提供一個以空格分隔的目標列表，以一次性清除多個項目。以下範例同時清除了網站結構和生成的頁面。

```bash Clear Multiple Targets icon=lucide:terminal
aigne web clear --targets websiteStructure generatedPages
```

## 總結

`clear` 指令提供了一種安全且受控的方式來管理您專案生成的資產和設定。使用互動模式進行引導式清理，或使用 `--targets` 旗標進行直接的自動化控制。請務必謹慎操作，尤其是在清除 `websiteConfig` 時，以避免意外的資料遺失。

在清除您的工作區或生成的頁面後，您可能會想接著重新生成網站。更多詳情，請參閱 [生成網站](./core-tasks-generating-a-website.md)。