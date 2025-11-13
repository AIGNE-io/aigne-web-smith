# WebSmith Cloud へ

このガイドでは、`aigne web publish` を使用して、無料の WebSmith Cloud ホスティングオプションに公開する方法を、コマンドの実行から初回認証、ライブ URL の確認まで説明します。

このガイドでは、ウェブサイトを WebSmith Cloud に公開するための体系的な手順を説明します。このサービスは無料のホスティングを提供し、独自のサーバーインフラを管理することなく、ウェブサイトを一般に公開できます。これは新規ユーザーに推奨される出発点であり、オープンソースプロジェクト、ポートフォリオ、またはコミュニティ中心のサイトに適しています。

## 前提条件

公開プロセスに進む前に、ウェブサイトのページが既に生成されていることを確認してください。このステップを完了していない場合は、次のコマンドを実行してください。

```bash Generate Website icon=lucide:terminal
aigne web generate
```

## 公開手順

公開プロセスは単一のコマンドで開始されます。その後、システムが必要な選択と認証を案内します。

### ステップ 1: 公開コマンドの実行

ターミナルを開き、プロジェクトのルートディレクトリに移動して、`publish` コマンドを実行します。

```bash Publish Website icon=lucide:terminal
aigne web publish
```

エイリアス `pub` または `p` も使用できます。

### ステップ 2: 公開プラットフォームの選択

コマンドを実行すると、公開オプションのリストが表示されます。無料のホスティングオプションを使用するには、**WebSmith Cloud** を選択します。

![Prompt showing WebSmith Cloud selected as the publish destination](../../../assets/images/web-smith-publish-cloud.png)

### ステップ 3: AIGNE WebSmith の認証（初回セットアップが必要）

WebSmith Cloud に初めて公開する場合、コマンドラインツールがあなたに代わって公開するための認証を受ける必要があります。これは一度限りのセキュリティ手順です。

1.  安全な認証 URL がデフォルトのウェブブラウザで自動的に開きます。
2.  アカウントにログインし、「AIGNE WebSmith」からの接続リクエストを承認するよう求められます。
3.  承認したら、ブラウザのタブを閉じてターミナルに戻ることができます。

ツールは認証情報を安全に保存するため、その後の公開でこのステップを繰り返す必要はありません。

![Browser window requesting authorization for the WebSmith Cloud deployment](../../../assets/images/web-smith-publish-cloud-auth.png)

### ステップ 4: 公開を待つ

ターミナルは、公開プロセス全体を自動的に処理します。これには以下が含まれます。

- ページとコンテンツファイルのバンドル。
- 関連するすべてのメディアアセットのアップロード。
- WebSmith Cloud サーバーへのファイルのデプロイ。

このプロセスは、ウェブサイトのサイズに応じて数分かかる場合があります。

## ライブウェブサイトの確認

正常に完了すると、ターミナルに確認メッセージが表示されます。このメッセージには、公開されたページとアセットの総数、およびライブウェブサイトにアクセスするための直接 URL が含まれています。

```text
✅ Pages published successfully! (`10/10` pages, `25` media assets)

🔗 Live URLs:
   https://websmith.aigne.io/your-project-slug/
   https://websmith.aigne.io/your-project-slug/about
   https://websmith.aigne.io/your-project-slug/services

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

これらの URL をウェブブラウザで開いて、公開されたウェブサイトを表示できます。

---

これで、WebSmith Cloud にウェブサイトが正常に公開されました。変更を加える必要がある場合は、コンテンツを修正して再度 `publish` コマンドを実行するか、より具体的な修正には `update` コマンドを使用できます。詳細については、[ウェブサイトの更新](./guides-update-website.md) を参照してください。

代替のデプロイ先については、次のガイドを参照してください。

- [既存のウェブサイトへ](./guides-publish-website-to-existing-website.md)
- [新しい専用ウェブサイトへ](./guides-publish-website-to-new-dedicated-website.md)