# トラブルシューティング

本ガイドは、AIGNE WebSmith の使用時に発生する一般的な問題の診断と修正を支援します。生成、公開、または設定中に問題が発生した場合は、以下のシナリオで解決策を確認してください。

---

## 設定の問題

### エラー 1: "Config file not found"

**エラーメッセージ：**
```
Config file not found: .aigne/web-smith/config.yaml
```

**原因：** 設定ファイルが予期される場所に存在しません。

**修正方法：** 
- `aigne web generate` を実行（設定を自動的に作成するようガイドされ、その後生成が開始されます）
- または `aigne web init` を実行（生成を開始せずに設定を作成するようガイドされます）

---

### エラー 2: "Error parsing config file"

**エラーメッセージ：**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因：** 設定ファイルに YAML 構文エラーがあります（例：インデントの誤り、コロンの誤り、引用符の欠落）。

**修正方法：**
1. エラーメッセージに記載されている行番号を確認
2. YAML 構文を検証（タブではなくスペースを使用、正しいコロン形式を使用）
3. YAML バリデーターを使用してファイルを検証
4. `aigne web generate` を再実行

---

### エラー 3: `standard` から `singlePage` への切り替えで `clear` を実行していない

**エラーメッセージ：**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因：** `websiteScale` を `standard` から `singlePage` に変更したが、先に `clear` を実行しなかったため、構造の競合が発生しました。

**修正方法：**
1. `aigne web clear` を実行して古い生成ファイルを削除
2. `aigne web generate` を実行して新しいスケールで再生成
3. **`websiteScale` を変更する際は、必ず `generate` の前に `clear` を実行してください**

---

### エラー 4: "Invalid locale code"

**エラーメッセージ：**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因：** `locale` または `translateLanguages` でサポートされていない言語コードを使用しました。

**修正方法：**
1. サポートされている言語コードのリストを確認
2. 有効な IETF 言語コードを使用（例：`en`、`zh`、`ja`）
3. 設定を更新してコマンドを再実行

---

### エラー 5: "No data sources found"

**エラーメッセージ：**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**原因：** `sourcesPath` が空であるか、指定されたすべてのパスが存在しないかアクセスできません。

**修復方法：**
1. `sourcesPath` 内のファイル/ディレクトリが存在することを確認
2. ファイルのアクセス権限を確認（ファイルが読み取り可能であることを確認）
3. `sourcesPath` に有効なパスを追加（例：`["./README.md", "./docs"]`）
4. `aigne web generate` を再実行

---

## 生成の問題

### 問題 1: 生成されたコンテンツが期待と異なる

**症状：**
- コンテンツのトーンが適切でない
- 構造が要件に従っていない
- 重要な情報が欠落している

**一般的な原因：**
1. 設定の `rules` が不十分または不明確
2. `targetAudienceTypes` が一致していない
3. `sourcesPath` が疎または無関係

**修正方法：**
1. **`rules` を充実させる：** `config.yaml` に詳細なガイダンスを追加：
   ```yaml
   rules: |
     ### ページ構造の要件
     1. ファーストビューには以下を含める必要があります：
        * 明確な製品見出し
        * 簡潔な説明
        * 主要な行動喚起
     
     ### コンテンツのトーン
     - ポジティブで自信に満ちた言葉を使用
     - 具体的なデータと例を含める
     - マーケティング用語を避ける
   ```

2. **オーディエンスを調整：** `targetAudienceTypes` が実際のオーディエンスと一致していることを確認：
   ```yaml
   targetAudienceTypes:
     - customers      # エンドユーザー向け
     - developers     # 技術的なオーディエンス向け
   ```

3. **より多くのソースを追加：** `sourcesPath` に関連ドキュメントを含める：
   ```yaml
   sourcesPath:
     - ./README.md
     - ./docs
     - ./CHANGELOG.md
   ```

---

### 問題 2: 画像の品質が低いまたは欠落している

**症状：**
- 生成されたページの画像の解像度が低い
- 期待される画像が表示されない

**原因：** `media.minImageWidth` のしきい値が画像をフィルタリングしています。

**修正方法：**
1. `config.yaml` の現在の設定を確認：
   ```yaml
   media:
     minImageWidth: 800  # 現在のしきい値
   ```

2. ニーズに応じて調整：
   - 低め（400-600）：より多くの画像、品質リスクは低め
   - 中程度（600-800）：品質/数量のバランス（推奨）
   - 高め（800-1000）：より高品質、画像は少なめ

3. 変更を適用：
   ```bash
   aigne web update
   ```

---

## 公開の問題

### 問題 3: 公開が失敗する

**症状：**
- 公開コマンドが失敗する
- 公開後にウェブサイトにアクセスできない
- 認証エラー

**一般的な原因：**

**原因 1: `appUrl` が欠落または無効**
```yaml
appUrl: ""  # 空または無効
```
**修正方法：** 有効なデプロイ URL を設定：
```yaml
appUrl: https://your-site.user.aigne.io
```

**原因 2: 認証の期限切れ**
**修正方法：** 以下のコマンドを実行して再認証：
```bash
aigne web publish
```
ブラウザのプロンプトに従って再認証してください。

**原因 3: ネットワーク接続の問題**
**修正方法：**
1. インターネット接続を確認
2. ターゲット URL がアクセス可能であることを確認
3. 数分後に再試行

---

## 翻訳の問題

### 問題 4: 翻訳が不正確または不完全

**症状：**
- 翻訳されたページが欠落している
- 翻訳品質が低い
- 出力に言語が混在している

**修正方法：**

**翻訳が欠落している場合：**
1. 設定の `translateLanguages` を確認：
   ```yaml
   translateLanguages:
     - zh
     - ja
   ```

2. 翻訳コマンドを実行：
   ```bash
   aigne web translate
   ```

**品質が低い場合：**
1. 翻訳前にソースコンテンツ（`locale` 言語）が完成していることを確認
2. 用語の一貫性を確保するために用語集を使用
3. 必要に応じて、翻訳を手動でレビューおよび改善

---

## パフォーマンスの問題

### 問題 5: 生成に時間がかかりすぎる

**症状：**
- `aigne web generate` の実行時間が長すぎる
- システムが応答しなくなる

**一般的な原因：**

**原因 1: データソースが多すぎる**
**修正方法：** `sourcesPath` を必須ファイルのみに削減：
```yaml
sourcesPath:
  - ./README.md
  - ./docs
  # 削除: ./node_modules（不要）
  # 削除: ./dist（生成されたファイル）
```

**原因 2: ウェブサイトのスケールが大きすぎる**
**修正方法：** より小さなスケールから始める：
```yaml
websiteScale: minimal  # または singlePage
```

**原因 3: 画像が多すぎる**
**修正方法：** `minImageWidth` を増やしてより多くの画像をフィルタリング：
```yaml
media:
  minImageWidth: 1000  # より高いしきい値
```

---

## 復旧方法

### 方法 1: Git リバート

バージョン管理を使用している場合、以前の動作する設定に復元できます：

```bash
git revert HEAD
```

その後、再生成：
```bash
aigne web generate
```

---

### 方法 2: クリーンな再生成

すべての生成されたファイルをクリアして、最初から再生成：

```bash
aigne web clear && aigne web generate
```

これにより、クリーンな状態に復元され、現在の設定に基づいてウェブサイトが再生成されます。

---

### 方法 3: バックアップから復元

バックアップ設定がある場合：

```bash
cp config-backup.yaml .aigne/web-smith/config.yaml
aigne web generate
```

---

### 方法 4: 設定を再作成

設定がひどく破損している場合：

1. 現在の設定をバックアップ：
   ```bash
   cp .aigne/web-smith/config.yaml config-broken.yaml
   ```

2. 初期化ウィザードで再作成：
   ```bash
   aigne web init
   ```

3. 必要に応じて、バックアップからカスタム値をマージ

---

## 一般的な YAML 形式エラー

### エラー: 全角（中国語）コロン

**誤り：**
```yaml
projectName： "My Project"  # 全角コロン
```

**正しい：**
```yaml
projectName: "My Project"  # ASCII コロン
```

---

### エラー: インデントの問題

**誤り：**
```yaml
pagePurpose:
- landingPage  # インデント不足
```

**正しい：**
```yaml
pagePurpose:
  - landingPage  # 2 スペースのインデント
```

---

### エラー: 値の型の誤り

**誤り：**
```yaml
pagePurpose: landingPage  # 配列ではなく文字列
```

**正しい：**
```yaml
pagePurpose:
  - landingPage  # 配列形式
```

---

### エラー: 特殊文字に引用符がない

**誤り：**
```yaml
projectDesc: AI-powered tool: generates websites  # コロンが引用符なし
```

**正しい：**
```yaml
projectDesc: "AI-powered tool: generates websites"  # 引用符付き
```

---

## 予防のヒント

1. **バージョン管理を使用：** Git で設定の変更を追跡
2. **バックアップを作成：** 大きな編集の前に設定をコピー
3. **変更を検証：** 編集後に `aigne web generate` を実行して早期にエラーを発見
4. **YAML バリデーターを使用：** コマンドを実行する前に構文を確認
5. **小さく始める：** 複雑さを追加する前に最小限の設定でテスト
6. **変更を文書化：** 何を変更し、なぜ変更したかのメモを保持

---

## さらなるヘルプの取得

上記の解決策を試しても問題が解決しない場合：

1. **ドキュメントを確認：** [Config Reference](./reference-config.md) ガイドで詳細なフィールドの説明を確認

2. **コマンドリファレンスを確認：** [Command Reference](./reference-command.md) で詳細なコマンドの使用方法を確認

3. **ログを調査：** ターミナル出力で特定のエラーメッセージを確認

4. **オブザーバビリティツールを使用：** 詳細なトレースをキャプチャする方法については以下を参照

5. **コミュニティサポート：** [AIGNE コミュニティ](https://community.arcblock.io/discussions/boards/aigne) でヘルプを求める

---

## デバッグのためのオブザーバビリティの使用

問題を報告したり、複雑な問題をデバッグしたりする必要がある場合、WebSmith のオブザーバビリティ機能は、何が問題だったかを診断するのに役立つ詳細な実行トレースをキャプチャします。

### オブザーバビリティサーバーの起動

次のコマンドを実行してローカルトレースサーバーを起動します：

```bash オブザーバビリティサーバーの起動 icon=lucide:terminal
aigne observe --port 8888
```

以下が表示される出力が表示されます：
- データベースパス：トレースデータが保存される場所
- サーバー URL：オブザーバビリティダッシュボードにアクセスするためのローカルアドレス

![オブザーバビリティサーバー実行中](../../../assets/images/web-smith-observe.png)

### トレース記録の表示

1. **ダッシュボードを開く：** 出力に表示されたサーバー URL をクリックするか、ブラウザで開く

2. **トレースを閲覧：** ダッシュボードには、以下を含むすべての WebSmith 操作が表示されます：
   - 入力/出力トークン
   - 実行時間
   - 関数呼び出しとその結果
   - エラーの詳細

![トレース記録を表示するオブザーバビリティダッシュボード](../../../assets/images/web-smith-observe-dashboard.png)

### トレースで問題を報告

コミュニティに問題を報告する際：

1. **トレースをキャプチャ：** 問題のある操作中にオブザーバビリティサーバーを実行し続ける
2. **トレースデータをダウンロード：** ダッシュボードから関連するトレース記録をエクスポート
3. **問題を報告：** [AIGNE コミュニティ](https://community.arcblock.io/discussions/boards/aigne) にアクセスして以下を添付：
   - 問題の説明
   - 再現手順
   - ダウンロードしたトレースファイル
   - あなたの設定（関連する場合）

**ヒント：** トレースには WebSmith の実行に関する詳細情報が含まれているため、チームが問題を診断して修正することがはるかに容易になります。

---

## よくある質問

**Q: 変更が反映されない**
- **原因：** ファイルが保存されていない、YAML エラー、または再生成が必要
- **修正：** ファイルを保存、YAML を修正、`aigne web generate` を実行、出力を確認

**Q: 言語を追加するには？**
- `aigne web translate` を実行してプロンプトに従う
- コマンドは設定の `translateLanguages` を自動的に更新します

**Q: 形式エラーを修正するには？**
- **一般的な問題：** 全角コロン、インデントの不一致、配列の形式が正しくない
- **修正：** 上記の YAML 形式の例に従い、必要に応じてバックアップから復元

**Q: サイトが期待した URL に公開されない？**
- **確認：** 設定の `appUrl` が意図したターゲットと一致していることを確認
- **修正：** `appUrl` を更新して `aigne web publish` を実行

