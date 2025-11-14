# 故障排除

本指南協助你診斷和修復使用 AIGNE WebSmith 時的常見問題。如果在生成、發布或設定過程中遇到問題，請查看以下場景的解決方案。

---

## 設定問題

### 問題 1: 設定檔格式錯誤

**錯誤訊息：**
```
Error: Failed to parse config file: Implicit map keys need to be followed by map values at line 112, column 1:

lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
appUrl: https://staging.websmith.aigne.io
```

```
Error: Failed to parse config file: Map keys must be unique at line 116, column 1:

projectCover: .aigne/web-smith/cover.png
appUrl: https://staging.websmith.aigne.io
^
```

**可能的原因：** 設定檔中的 YAML 語法有誤，常見問題包括：
- 縮排使用了定位字元而不是空格
- 使用了中文冒號（：）而不是英文冒號（:）
- 缺少必要的引號
- 重複的設定項

**解決方法：**
1. 查看錯誤提示中的行號，定位問題位置
2. 檢查該行的縮排是否正確（使用空格，不要用 Tab）
3. 確認冒號是英文半形冒號（:），不是中文全形冒號（：）
4. 使用線上 YAML 驗證工具檢查語法
5. 修復後重新執行 `aigne web publish`

---

> **提示：** 除了設定檔格式錯誤需要修復外，如果某些參數未正確設定，系統會自動使用預設值，不會影響基本功能。

## 生成問題

### 問題 2: 產生的內容不符合預期

**你可能會遇到：**
- 產生的內容語氣不符合你的要求
- 頁面結構與你期望的不一致
- 缺少一些重要的資訊

**可能的原因：**
1. 設定中的 `rules` 描述不夠詳細或不夠清晰
2. `targetAudienceTypes` 設定與實際目標受眾不匹配
3. `sourcesPath` 中的參考文件太少或不夠相關

**如何解決：**
1. **豐富 `rules`：** 在 `config.yaml` 中新增詳細指導：
   ```yaml
   rules: |
     ### 頁面結構要求
     1. 首屏必須包含：
        * 清晰的產品標題
        * 簡潔的描述
        * 主要行動號召
     
     ### 內容語氣
     - 使用積極、自信的語言
     - 包含具體資料和範例
     - 避免行銷術語
   ```

2. **調整受眾：** 確保 `targetAudienceTypes` 與實際受眾匹配：
   ```yaml
   targetAudienceTypes:
     - customers      # 面向最終使用者
     - developers     # 面向技術受眾
   ```

3. **新增更多來源：** 在 `sourcesPath` 中包含相關文件：
   ```yaml
   sourcesPath:
     - ./README.md
     - ./docs
     - ./CHANGELOG.md
   ```

---

### 問題 3: 圖片品質低或缺失

**你可能會遇到：**
- 產生的頁面中圖片清晰度不夠
- 期望出現的圖片沒有顯示出來

**原因：** 這是因為 `media.minImageWidth` 設定的值太高，過濾掉了一些圖片。

**如何解決：**
1. 開啟 `config.yaml` 檔案，找到 `media` 設定項：
   ```yaml
   media:
     minImageWidth: 800  # 目前閾值
   ```

2. 根據你的需求調整這個值：
   - **400-600**：會包含更多圖片，但可能有一些品質較低的圖片
   - **600-800**：品質和數量比較平衡（建議設定）
   - **800-1000**：只保留高品質圖片，數量會減少

3. 儲存檔案後執行更新命令：
   ```bash
   aigne web update
   ```

---

## 發布問題

### 問題 4: 發布時提示 URL 無效

**錯誤提示：**
```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**原因：** 設定中的 `appUrl` 為空或指向了一個無效的網站位址。

**如何解決：**
在 `config.yaml` 中設定正確的部署位址：
```yaml
# 填入你的網站位址
appUrl: https://your-site.user.aigne.io

# 如果暫時沒有網站，可以先清空這個設定
# appUrl: ""
```

### 問題 5: 發布時提示授權已過期

**錯誤提示：**
```
❌ Failed to publish pages: bundle: not authorized
```

**原因：** 你的登入憑證已過期，需要重新授權。

**如何解決：**
按順序執行以下命令：
```bash
# 先清理舊的授權資訊
aigne web clear

# 然後重新發布，系統會提示你重新登入
aigne web publish
```

---

## 如何恢復

### 方法 1: 使用 Git 恢復

如果你使用 Git 管理程式碼，可以快速恢復到之前正常工作的設定：

```bash
# 暫存目前更改
git stash
```

然後重新生成網站：
```bash
aigne web generate
```

> **提示：** 如果之後想恢復剛才暫存的更改，可以執行 `git stash pop`

---

### 方法 2: 清理後重新生成

如果遇到無法定位的問題，可以清除所有產生的檔案，然後從頭開始重新生成：

```bash
# 清理所有產生的檔案，然後重新生成
aigne web clear && aigne web generate
```

> **注意：** 這會刪除所有已產生的內容，但不會影響你的設定檔。執行後系統會基於目前設定重新生成網站。

---

## 使用建議

以下是一些實用的建議，可以幫助你避免常見問題：

1. **儲存修改歷史：** 如果使用 Git，每次修改設定檔後記得提交，這樣出問題時可以輕鬆回到之前的版本
2. **修改前先備份：** 在修改重要設定前，先複製一份設定檔作為備份，以防萬一
3. **修改後立即測試：** 每次修改設定後，馬上執行 `aigne web generate` 測試一下，有問題可以及時發現
4. **檢查格式是否正確：** 修改 YAML 檔案後，可以用線上工具檢查一下格式有沒有錯誤
5. **從簡單開始：** 剛開始時使用最簡單的設定，確認一切正常後，再慢慢新增更複雜的功能
6. **記錄你的修改：** 簡單記錄一下每次修改了什麼、為什麼修改，以後遇到問題時更容易找到原因

---

## 取得更多協助

如果以上方法都無法解決你的問題，可以嘗試：

1. **查閱設定文件：** 查看 [Config Reference](./reference-config.md) 了解每個設定項的詳細說明

2. **查看命令文件：** 參考 [Command Reference](./reference-command.md) 了解命令的詳細用法

3. **查看錯誤記錄：** 仔細閱讀終端中顯示的錯誤資訊，通常會有具體的提示

4. **使用 AIGNE Observability：** 使用下文介紹的 AIGNE Observability 工具，取得詳細的執行記錄

5. **尋求社群協助：** 造訪 [AIGNE 社群](https://community.arcblock.io/discussions/boards/aigne) 提問，其他使用者或開發者可能會幫助你

---

## 使用 AIGNE Observability 排查問題

當你遇到複雜問題需要深入排查，或者要向社群回報問題時，可以使用 **AIGNE Observability**。它會詳細記錄每一步的執行過程，幫助你或技術支援人員快速找到問題所在。

### 啟動 Observability 伺服器

執行以下命令啟動本機 Observability 伺服器：

```bash 啟動 Observability 伺服器 icon=lucide:terminal
aigne observe
```

你會看到輸出顯示：
- 資料庫路徑：追蹤資料儲存的位置
- 伺服器位址：在瀏覽器中開啟這個位址可以查看 Observability 儀表板

![Observability 伺服器執行中](../../../assets/images/web-smith-observe.png)

### 查看執行記錄

1. **開啟儀表板：** 點選輸出中顯示的伺服器位址，或在瀏覽器中開啟

2. **查看操作記錄：** 儀表板會顯示所有 WebSmith 的操作，包括：
   - 輸入和輸出的資料
   - 每一步花費的時間
   - 執行的操作步驟和結果
   - 詳細的錯誤資訊

![顯示執行記錄的 Observability 儀表板](../../../assets/images/web-smith-observe-dashboard.png)

### 使用 Observability 回報問題

向社群回報問題時：

1. **擷取追蹤：** 在出現問題的操作期間保持 Observability 伺服器執行
2. **匯出追蹤資料：** 從儀表板匯出相關的執行記錄
3. **回報問題：** 造訪 [AIGNE 社群](https://community.arcblock.io/discussions/boards/aigne) 並附上：
   - 問題描述
   - 重現步驟
   - 匯出的追蹤檔案
   - 你的設定（如相關）

> **提示：** 追蹤記錄包含了 WebSmith 執行的完整資訊，包括每一步的操作和結果。將這些資訊提供給技術支援或社群，可以大大提高問題解決的效率。
