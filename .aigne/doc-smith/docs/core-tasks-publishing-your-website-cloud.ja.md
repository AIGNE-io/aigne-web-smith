# WebSmith Cloud に公開する

このガイドでは、ウェブサイトを WebSmith Cloud に公開するための体系的な手順を説明します。このサービスは無料のホスティングを提供しており、独自のサーバーインフラを管理することなく、ウェブサイトを一般に公開できます。新規ユーザーにはこの方法から始めることをお勧めします。また、オープンソースプロジェクト、ポートフォリオ、またはコミュニティ中心のサイトにも適しています。

別のデプロイ先については、以下のガイドを参照してください。
- [既存のウェブサイトに公開する](./core-tasks-publishing-your-website-custom.md)
- [新しい専用ウェブサイトに公開する](./core-tasks-publishing-your-website-new-dedicated-website.md)

## 前提条件

公開プロセスに進む前に、ウェブサイトのページが生成済みであることを確認してください。このステップを完了していない場合は、次のコマンドを実行してください。

```bash
aigne web generate
```

## 公開手順

公開プロセスは単一のコマンドで開始されます。その後、システムが必要な選択と承認を案内します。

### ステップ 1: 公開コマンドの実行

ターミナルを開き、プロジェクトのルートディレクトリに移動して、`publish` コマンドを実行します。

```bash コマンドライン icon=lucide:terminal
aigne web publish
```

エイリアスの `pub` または `p` も使用できます。

### ステップ 2: 公開プラットフォームの選択

コマンドを実行すると、公開オプションのリストが表示されます。無料のクラウドホスティングを使用するには、最初のオプションを選択します。

矢印キーで以下の選択肢をハイライトし、Enter キーを押します。

```text
? Select platform to publish your pages:
❯ WebSmith Cloud (https://websmith.ai) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
  New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

### ステップ 3: AIGNE WebSmith の承認 (初回のみ)

WebSmith Cloud への公開が初めての場合、コマンドラインツールがあなたに代わって公開するための承認が必要です。これは一度限りのセキュリティ手順です。

1.  安全な認証 URL がデフォルトのウェブブラウザで自動的に開きます。
2.  アカウントにログインし、「AIGNE WebSmith」からの接続リクエストを承認するよう求められます。
3.  承認したら、ブラウザのタブを閉じてターミナルに戻ることができます。

ツールは承認情報を安全に保存するため、次回以降の公開でこのステップを繰り返す必要はありません。

### ステップ 4: 公開の待機

ここから、CLI が公開プロセス全体を自動的に処理します。これには以下が含まれます。
- ページとコンテンツファイルのバンドル。
- 関連するすべてのメディアアセットのアップロード。
- WebSmith Cloud サーバーへのファイルのデプロイ。

このプロセスは、ウェブサイトのサイズによって数分かかる場合があります。

## 公開されたウェブサイトの確認

正常に完了すると、CLI に確認メッセージが表示されます。このメッセージには、公開されたページとアセットの総数、および公開されたウェブサイトにアクセスするための直接の URL が含まれます。

```text
✅ Pages published successfully! (`10/10` pages, `25` media assets)

🔗 Live URLs:
   https://websmith.ai/your-project-slug/
   https://websmith.ai/your-project-slug/about
   https://websmith.ai/your-project-slug/services

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

これらの URL にウェブブラウザでアクセスして、公開されたウェブサイトを閲覧できます。

---

これで、ウェブサイトを WebSmith Cloud に正常に公開できました。変更が必要な場合は、コンテンツを修正して再度 `publish` コマンドを実行するか、より具体的な修正には `update` コマンドを使用できます。詳細については、[ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md) を参照してください。