# 故障排除

本指南協助你診斷和修復使用 AIGNE WebSmith 時的常見問題。如果在生成、發布或設定過程中遇到問題，請查看以下場景的解決方案。

---

## 設定問題

### 問題 1: 錯誤的 YAML 檔案格式

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

**原因：** 設定檔中存在 YAML 語法錯誤（例如，縮排不正確、冒號錯誤、缺少引號）。

**修復方法：**
1. 檢查錯誤訊息中提到的行號
2. 驗證 YAML 語法（使用空格而非定位字元；使用正確的冒號格式）
3. 使用 YAML 驗證器驗證檔案
4. 重新執行 `aigne web publish`

---

除了以上設定檔格式不正確的情況需要處理外，其他情況下，如果沒有匹配到正確的參數，系統會使用預設參數生成資源。

## 生成問題

### 問題 2: 產生的內容不符合預期

**症狀：**
- 內容語氣不對
- 結構不符合要求
- 缺少關鍵資訊

**常見原因：**
1. 設定中的 `rules` 不充分或不清晰
2. `targetAudienceTypes` 不匹配
3. `sourcesPath` 稀疏或不相關

**修復方法：**
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

**症狀：**
- 產生頁面中的圖片解析度低
- 預期的圖片未出現

**原因：** `media.minImageWidth` 閾值過濾掉了圖片。

**修復方法：**
1. 檢查 `config.yaml` 中的目前設定：
   ```yaml
   media:
     minImageWidth: 800  # 目前閾值
   ```

2. 根據需求調整：
   - 較低（400-600）：更多圖片，品質風險較低
   - 中等（600-800）：平衡品質/數量（建議）
   - 較高（800-1000）：更高品質，圖片較少

3. 套用變更：
   ```bash
   aigne web update
   ```

---

## 發布問題

### 問題 4: 缺少或無效的 `appUrl`

```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**修復方法：** 設定有效的部署 URL：
```yaml
# 寫入正確的URL
appUrl: https://your-site.user.aigne.io

# 或者清理掉，透過 cli 修改
# appUrl: ""
```

### 問題 5: 授權已過期

```
❌ Failed to publish pages: bundle: not authorized
```

**修復方法：** 透過執行以下命令重新授權：
```bash
# 清理掉無效 token 後重新發布
aigne web clear
aigne web publish
```

---

## 恢復方法

### 方法 1: Git 回退

如果你使用版本控制，可以恢復到之前的工作設定：

```bash
git stash
```

然後重新生成：
```bash
aigne web generate
```

---

### 方法 2: 清理重新生成

清除所有產生的檔案並從頭重新生成：

```bash
aigne web clear && aigne web generate
```

這會恢復到乾淨狀態並基於目前設定重新生成網站。

---

## 預防提示

1. **使用版本控制：** 使用 Git 追蹤設定變更
2. **進行備份：** 在重大編輯前複製設定
3. **驗證變更：** 編輯後執行 `aigne web generate` 以儘早發現錯誤
4. **使用 YAML 驗證器：** 在執行命令前檢查語法
5. **從小開始：** 在新增複雜性之前先用最小設定測試
6. **記錄變更：** 保持對變更內容和原因的記錄

---

## 取得更多協助

如果你嘗試了上述解決方案但仍遇到問題：

1. **查看文件：** 查閱 [Config Reference](./reference-config.md) 指南了解詳細的欄位描述

2. **查看命令參考：** 參閱 [Command Reference](./reference-command.md) 了解詳細的命令用法

3. **檢查記錄：** 查看終端輸出中的特定錯誤訊息

4. **使用可觀測性工具：** 請參閱下文了解如何擷取詳細追蹤

5. **社群支援：** 造訪 [AIGNE 社群](https://community.arcblock.io/discussions/boards/aigne) 尋求協助

---

## 使用可觀測性進行偵錯

當你需要回報問題或偵錯複雜問題時，WebSmith 的可觀測性功能可以擷取詳細的執行追蹤，協助診斷問題所在。

### 啟動可觀測性伺服器

執行以下命令啟動本機追蹤伺服器：

```bash 啟動可觀測性伺服器 icon=lucide:terminal
aigne observe --port 8888
```

你會看到輸出顯示：
- 資料庫路徑：追蹤資料儲存位置
- 伺服器 URL：存取可觀測性儀表板的本機位址

![可觀測性伺服器執行中](../../../assets/images/web-smith-observe.png)

### 檢視追蹤記錄

1. **開啟儀表板：** 點選輸出中顯示的伺服器 URL 或在瀏覽器中開啟

2. **瀏覽追蹤：** 儀表板顯示所有 WebSmith 操作，包括：
   - 輸入/輸出權杖
   - 執行時間
   - 函式呼叫及其結果
   - 錯誤詳情

![顯示追蹤記錄的可觀測性儀表板](../../../assets/images/web-smith-observe-dashboard.png)

### 使用追蹤回報問題

向社群回報問題時：

1. **擷取追蹤：** 在出現問題的操作期間保持可觀測性伺服器執行
2. **下載追蹤資料：** 從儀表板匯出相關的追蹤記錄
3. **回報問題：** 造訪 [AIGNE 社群](https://community.arcblock.io/discussions/boards/aigne) 並附上：
   - 問題描述
   - 重現步驟
   - 下載的追蹤檔案
   - 你的設定（如相關）

**提示：** 追蹤包含有關 WebSmith 執行的詳細資訊，使團隊更容易診斷和修復問題。
