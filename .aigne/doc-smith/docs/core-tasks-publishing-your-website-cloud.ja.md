# WebSmith Cloudに公開する

このガイドでは、あなたのウェブサイトをWebSmith Cloudに公開するための体系的な手順を説明します。このサービスは無料のホスティングを提供し、あなた自身でサーバーインフラを管理することなく、ウェブサイトを一般に公開できるようにします。これは新規ユーザーに推奨される出発点であり、オープンソースプロジェクト、ポートフォリオ、またはコミュニティ中心のサイトに適しています。

## 前提条件

公開プロセスに進む前に、ウェブサイトのページがすでに生成されていることを確認してください。このステップを完了していない場合は、以下のコマンドを実行して完了させてください。

```bash
aigne web generate
```

## 公開手順

公開プロセスは単一のコマンドで開始されます。その後、システムが必要な選択と承認を案内します。

### ステップ1：公開コマンドの実行

ターミナルを開き、プロジェクトのルートディレクトリに移動して、`publish` コマンドを実行します。

```bash Command Line icon=lucide:terminal
aigne web publish
```

エイリアス `pub` または `p` も使用できます。

### ステップ2：公開プラットフォームの選択

コマンドを実行すると、公開オプションのリストが表示されます。無料のクラウドホスティングを使用するには、最初のオプションを選択してください。

矢印キーを使って以下の選択肢をハイライトし、Enterキーを押してください。

```text
? Select platform to publish your pages:
❯ WebSmith Cloud (https://websmith.aigne.io) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
  New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

### ステップ3：AIGNE WebSmithの承認（初回設定が必要）

WebSmith Cloudに初めて公開する場合、コマンドラインツールがあなたに代わって公開するための承認を受ける必要があります。これは一度きりのセキュリティ手順です。

1.  安全な認証URLがデフォルトのウェブブラウザで自動的に開きます。
2.  アカウントにログインし、「AIGNE WebSmith」からの接続要求を承認するよう求められます。
3.  承認したら、ブラウザのタブを閉じてターミナルに戻ることができます。

ツールはあなたの認証情報を安全に保存するため、その後の公開でこのステップを繰り返す必要はありません。

### ステップ4：公開を待つ

CLIが公開プロセス全体を自動的に処理します。これには以下が含まれます：

- ページとコンテンツファイルのバンドル。
- 関連するすべてのメディアアセットのアップロード。
- WebSmith Cloudサーバーへのファイルのデプロイ。

このプロセスは、ウェブサイトのサイズによって数分かかる場合があります。

## 公開されたウェブサイトの確認

正常に完了すると、CLIは確認メッセージを表示します。このメッセージには、公開されたページとアセットの総数、および公開されたウェブサイトにアクセスするための直接URLが含まれます。

```text
✅ Pages published successfully! (`10/10` pages, `25` media assets)

🔗 Live URLs:
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

これらのURLをウェブブラウザで開いて、公開されたウェブサイトを閲覧できます。

---

これで、あなたのウェブサイトはWebSmith Cloudに正常に公開されました。変更を加える必要がある場合は、コンテンツを修正して再度 `publish` コマンドを実行するか、より具体的な修正には `update` コマンドを使用できます。詳細については、[ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md)を参照してください。

別のデプロイ先については、以下のガイドを参照してください：

- [自身のウェブサイトに公開する](./core-tasks-publishing-your-website-custom.md)
- [新しい専用ウェブサイトに公開する](./core-tasks-publishing-your-website-new-dedicated-website.md)