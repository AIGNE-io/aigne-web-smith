# トラブルシューティング

このガイドは、AIGNE WebSmith を使用する際の一般的な問題を診断して修正するのに役立ちます。生成、公開、または設定中に問題が発生した場合は、以下のシナリオの解決策を確認してください。

---

## 設定の問題

### 問題 1: YAML ファイル形式の誤り

**エラーメッセージ：**
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

**原因：** 設定ファイルに YAML 構文エラーがあります（例：インデントが正しくない、コロンが間違っている、引用符が欠けている）。

**修正方法：**
1. エラーメッセージに記載されている行番号を確認
2. YAML 構文を検証（タブではなくスペースを使用；正しいコロン形式を使用）
3. YAML バリデーターを使用してファイルを検証
4. `aigne web publish` を再実行

---

上記の設定ファイル形式が正しくない場合を除き、他の場合では、正しいパラメータが一致しない場合、システムはデフォルトパラメータを使用してリソースを生成します。

## 生成の問題

### 問題 2: 生成されたコンテンツが期待通りでない

**症状：**
- コンテンツのトーンが合わない
- 構造が要件に従っていない
- 重要な情報が欠けている

**一般的な原因：**
1. 設定内の `rules` が不十分または不明確
2. `targetAudienceTypes` が一致しない
3. `sourcesPath` が少ないまたは無関係

**修正方法：**
1. **`rules` を充実させる：** `config.yaml` に詳細なガイダンスを追加：
   ```yaml
   rules: |
     ### ページ構造要件
     1. ファーストビューには以下を含める必要があります：
        * 明確な製品見出し
        * 簡潔な説明
        * 主要な行動喚起
     
     ### コンテンツのトーン
     - 積極的で自信のある言語を使用
     - 具体的なデータと例を含める
     - マーケティング用語を避ける
   ```

2. **オーディエンスを調整：** `targetAudienceTypes` が実際のオーディエンスと一致することを確認：
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

### 問題 3: 画像の品質が低い、または欠落している

**症状：**
- 生成されたページの画像解像度が低い
- 期待される画像が表示されない

**原因：** `media.minImageWidth` のしきい値が画像をフィルタリングしています。

**修正方法：**
1. `config.yaml` の現在の設定を確認：
   ```yaml
   media:
     minImageWidth: 800  # 現在のしきい値
   ```

2. ニーズに応じて調整：
   - 低い（400-600）：より多くの画像、品質リスクが低い
   - 中程度（600-800）：品質/数量のバランス（推奨）
   - 高い（800-1000）：より高品質、画像が少ない

3. 変更を適用：
   ```bash
   aigne web update
   ```

---

## 公開の問題

### 問題 4: `appUrl` が欠落している、または無効

```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**修正方法：** 有効なデプロイ URL を設定：
```yaml
# 正しいURLを書き込む
appUrl: https://your-site.user.aigne.io

# またはクリアして、CLI経由で変更
# appUrl: ""
```

### 問題 5: 認証が期限切れ

```
❌ Failed to publish pages: bundle: not authorized
```

**修正方法：** 以下のコマンドを実行して再認証：
```bash
# 無効なトークンをクリアして再公開
aigne web clear
aigne web publish
```

---

## 復旧方法

### 方法 1: Git の戻し

バージョン管理を使用している場合、以前の作業設定に復元できます：

```bash
git stash
```

その後、再生成：
```bash
aigne web generate
```

---

### 方法 2: クリーン再生成

生成されたすべてのファイルをクリアし、最初から再生成：

```bash
aigne web clear && aigne web generate
```

これにより、クリーンな状態に復元され、現在の設定に基づいてウェブサイトが再生成されます。

---

## 予防のヒント

1. **バージョン管理を使用：** Git で設定変更を追跡
2. **バックアップを作成：** 大きな編集前に設定をコピー
3. **変更を検証：** 編集後に `aigne web generate` を実行してエラーを早期に発見
4. **YAML バリデーターを使用：** コマンドを実行する前に構文を確認
5. **小さく始める：** 複雑さを追加する前に最小設定でテスト
6. **変更を記録：** 変更内容と理由の記録を保持

---

## さらなるヘルプの取得

上記の解決策を試しても問題が解決しない場合：

1. **ドキュメントを確認：** [Config Reference](./reference-config.md) ガイドを参照して詳細なフィールド説明を確認

2. **コマンドリファレンスを確認：** [Command Reference](./reference-command.md) を参照して詳細なコマンドの使用方法を確認

3. **ログを確認：** ターミナル出力で特定のエラーメッセージを確認

4. **可観測性ツールを使用：** 詳細なトレースをキャプチャする方法については以下を参照

5. **コミュニティサポート：** [AIGNE コミュニティ](https://community.arcblock.io/discussions/boards/aigne) にアクセスしてヘルプを求める

---

## 可観測性を使用したデバッグ

問題を報告したり、複雑な問題をデバッグする必要がある場合、WebSmith の可観測性機能は詳細な実行トレースをキャプチャし、問題の診断に役立ちます。

### 可観測性サーバーの起動

以下のコマンドを実行してローカルトレースサーバーを起動：

```bash 可観測性サーバーを起動 icon=lucide:terminal
aigne observe --port 8888
```

出力には以下が表示されます：
- データベースパス：トレースデータの保存場所
- サーバー URL：可観測性ダッシュボードにアクセスするローカルアドレス

![可観測性サーバー実行中](../../../assets/images/web-smith-observe.png)

### トレースレコードの表示

1. **ダッシュボードを開く：** 出力に表示されているサーバー URL をクリックするか、ブラウザで開く

2. **トレースを閲覧：** ダッシュボードには、以下のようなすべての WebSmith 操作が表示されます：
   - 入力/出力トークン
   - 実行時間
   - 関数呼び出しとその結果
   - エラー詳細

![トレースレコードを表示する可観測性ダッシュボード](../../../assets/images/web-smith-observe-dashboard.png)

### トレースを使用した問題の報告

コミュニティに問題を報告する場合：

1. **トレースをキャプチャ：** 問題が発生している操作中に可観測性サーバーを実行し続ける
2. **トレースデータをダウンロード：** ダッシュボードから関連するトレースレコードをエクスポート
3. **問題を報告：** [AIGNE コミュニティ](https://community.arcblock.io/discussions/boards/aigne) にアクセスし、以下を添付：
   - 問題の説明
   - 再現手順
   - ダウンロードしたトレースファイル
   - 設定（該当する場合）

**ヒント：** トレースには WebSmith の実行に関する詳細情報が含まれており、チームが問題を診断して修正しやすくなります。
