# 新しい専用ウェブサイトに公開する

このガイドでは、コンテンツを新しい専用ウェブサイトに公開するための体系的なプロセスを説明します。このオプションは有料サービスで、プロジェクト用にフルマネージドのホスティング環境を提供します。カスタムドメインや専用リソースが必要なプロフェッショナルな用途に適しています。

このプロセスは自動化されています。コマンドを開始すると、AIGNE WebSmithが一度限りのセットアップと支払いプロセスを案内します。完了すると、ウェブサイトが作成され、コンテンツがそこに公開されます。

## プロセスの概要

新しい専用ウェブサイトへの公開には、`publish` コマンドによって処理される一連の自動化されたステップが含まれます。このコマンドはデプロイメントサービスと連携し、必要なすべてのリソースをプロビジョニングおよび設定します。

ワークフローは以下の通りです：
1.  **開始**: ユーザーが `aigne web publish` コマンドを実行します。
2.  **オプションの選択**: ユーザーは対話型プロンプトから「新しい専用ウェブサイト」オプションを選択します。
3.  **支払いとプロビジョニング**: ユーザーは安全なウェブページにリダイレクトされ、支払いを完了します。その後、システムが自動的にウェブサイトのホスティングと環境をセットアップします。
4.  **コンテンツのデプロイ**: AIGNE WebSmithが生成されたページを新しく作成されたウェブサイトにアップロードし、公開します。
5.  **確認**: ユーザーは新しいウェブサイトのライブURLを受け取ります。

## ステップバイステップの手順

ウェブサイトを公開するには、以下の手順に正確に従ってください。

### 1. 公開コマンドの開始

まず、`aigne web generate` コマンドを使用してウェブサイトのページが生成されていることを確認してください。出力ディレクトリにコンテンツの準備ができたら、ターミナルで次のコマンドを実行します。

```bash
aigne web publish
```

### 2. 公開オプションの選択

いくつかの公開オプションが表示されます。矢印キーを使用して「新しい専用ウェブサイト」オプションをハイライトし、選択してください。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
  Your existing website - Integrate and publish directly on your current site (setup required)
❯ New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

Enterキーを押して選択を確定します。

### 3. セットアップと支払いの完了

オプションを選択すると、自動セットアッププロセスが開始されます。

1.  **支払い**: ターミナルに支払いプロセスが開始されることを示すメッセージが表示されます。安全な支払いリンクがデフォルトのウェブブラウザで開かれます。

    ```text
    🚀 Starting deployment...
    ⏳ Step 1/4: Waiting for payment...
    🔗 Payment link: https://payment.example.com/session/checkout_12345
    ```

2.  **プロビジョニング**: ウェブページの指示に従って支払いを完了してください。その間、コマンドラインツールは待機します。支払いが確認されると、システムは自動的にセットアップを続行します。ターミナルに進捗状況の更新が表示されます。

    ```text
    📦 Step 2/4: Setting up your website...
    🚀 Step 3/4: Starting your website...
    🌐 Step 4/4: Getting your website URL...
    ```

3.  **完了**: セットアップが完了すると、ターミナルに新しいウェブサイトのURLとサブスクリプション管理用リンクを含む確認メッセージが表示されます。

    ```text
    🔗 Your website is ready at: https://your-new-site.example.com
    🔗 Manage your subscription at: https://billing.example.com/manage/sub_12345
    ```

### 4. コンテンツの自動公開

専用ウェブサイトが正常にプロビジョニングされると、AIGNE WebSmithは生成されたページとメディアアセットのアップロードを直ちに開始します。このプロセスは完全に自動です。

完了すると、公開されたページのライブURLをリストした最終確認メッセージが表示されます。

```text
✅ Pages published successfully! (`15/15` pages, `42` media assets)

🔗 Live URLs:
   https://your-new-site.example.com/
   https://your-new-site.example.com/about
   https://your-new-site.example.com/services
   ...

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## 未完了のセットアップを再開する

以前に専用ウェブサイトの作成が開始されたものの、完了しなかった場合（例：支払いプロセスが中断された）、システムはセッションの詳細を保存します。次回 `aigne web publish` を実行すると、プロセスを再開するための追加オプションが表示されます。

```text
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting...
  Your existing website - ...
❯ Resume previous website setup - Already paid. Continue where you left off. Your payment has already been processed.
  New dedicated website - Paid service...
```

この「再開」オプションを選択すると、支払いがすでに処理されている場合には、最初からやり直したり再度支払ったりすることなく、中断したところから続行できます。システムは保存された `checkoutId` を使用して前のセッションを復元し、ウェブサイトのセットアップを完了します。

## まとめ

これで、プロジェクトを新しい専用ウェブサイトに正常に公開できました。コンテンツは提供されたURLで公開され、アクセス可能です。変更を加えるには、`aigne web update` でコンテンツを更新するか、`aigne web generate` でサイト構造全体を再生成し、その後再度 `aigne web publish` コマンドを実行します。システムは保存された設定を使用して、同じウェブサイトに更新を公開します。