# 清除工作區與資料

`clear` 指令是一個用於管理您專案工作區（通常是 `./.websmith/tmp` 目錄）的工具。它允許您選擇性地移除產生的檔案、快取資料和組態設定。當您想要開始一個全新的建置、重設您的組態或移除敏感的授權資料時，這個指令特別有用。

執行此指令可能是一個破壞性操作。在繼續之前，請確保您已備份所有重要資料。

## 互動式清除

使用此指令最簡單的方式是不帶任何參數執行。這將啟動一個互動式提示，您可以在其中選擇您希望清除的特定項目。

```bash 命令列 icon=lucide:terminal
aigne web clear
```

這將會顯示一個可供移除的項目清單。您可以使用方向鍵導覽，使用空白鍵選取項目，並按下 Enter 鍵確認您的選擇。

## 可清除的目標

下表詳細說明了可以清除的具體項目、它們包含的內容以及直接清除它們的指令。

| 目標名稱 | 指令旗標 | 說明 |
| :--- | :--- | :--- |
| 網站結構 | `websiteStructure` | 從工作區中移除網站結構檔案 (`website-structure.yaml`)。您原始的來源內容不會受到影響。 |
| 產生的頁面 | `generatedPages` | 從工作區中刪除所有產生的頁面內容。這會保留網站結構檔案。 |
| 網站組態 | `websiteConfig` | 刪除主要的 `config.yaml` 檔案。**注意：** 此操作不可逆。您需要執行 `aigne web init` 來產生一個新的組態檔案。 |
| 授權 | `authTokens` | 刪除儲存驗證權杖的 `.env.websmith` 檔案。清除後，您需要為發布等操作重新授權 CLI。 |
| 部署組態 | `deploymentConfig` | 僅從您的 `config.yaml` 檔案中移除 `appUrl` 金鑰。這對於重設您的部署目標而不刪除整個網站組態很有用。 |
| 媒體檔案描述 | `mediaDescription` | 刪除您媒體資產的 AI 生成快取描述。這些描述將在下次執行 `generate` 指令時自動重新產生。 |
| 翻譯快取 | `translationCaches` | 刪除 AI 生成的翻譯快取。這些快取將在下次發布時自動重新產生。 |

## 非互動式清除

若要繞過互動式提示，您可以使用 `--targets` 旗標，後面跟著一個或多個目標名稱。這對於編寫腳本或自動化清理任務很有用。

### 清除單一目標
若要清除單一項目，請使用 `--targets` 旗標指定其名稱。

```bash 清除網站結構 icon=lucide:terminal
aigne web clear --targets websiteStructure
```

### 清除多個目標

您可以提供一個以空白分隔的目標清單，以一次清除多個項目。以下範例會同時清除網站結構和產生的頁面。

```bash 清除多個目標 icon=lucide:terminal
aigne web clear --targets websiteStructure generatedPages
```

## 總結

`clear` 指令提供了一個安全且可控的方式來管理您專案產生的資產和組態。使用互動模式進行引導式清理，或使用 `--targets` 旗標進行直接、自動化的控制。務必謹慎，特別是在清除 `websiteConfig` 時，以避免意外的資料遺失。

清除您的工作區或產生的頁面後，您可能會想再次產生網站。更多詳情，請參閱[產生網站](./core-tasks-generating-a-website.md)。