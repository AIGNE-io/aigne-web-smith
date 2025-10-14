# 自身のウェブサイトに公開する

このガイドでは、生成されたウェブサイトのコンテンツを、既存の自身のウェブサイトインフラストラクチャに直接公開するための体系的な手順を説明します。この方法は、自身のArcBlock搭載ウェブサイトを管理し、AIGNE WebSmithによって生成されたコンテンツを統合したいユーザーを対象としています。

カスタムウェブサイトへの公開により、ホスティングと統合を完全に制御できます。続行する前に、既存のウェブサイトに互換性があり、適切に設定されていることを確認してください。

## 前提条件

自身のウェブサイトに正常に公開するには、以下の条件を満たす必要があります。

1.  **生成済みのウェブサイト：** `aigne web generate` コマンドを使用して、ウェブサイトのページをすでに生成している必要があります。生成されたコンテンツは、プロジェクトの出力ディレクトリに存在している必要があります。
2.  **ArcBlock搭載のウェブサイト：** 公開先のウェブサイトは、実行中のBlockletアプリケーションである必要があります。AIGNE WebSmithは、Blocklet Server環境と直接統合します。
3.  **必要なコンポーネント：** **Pages Kit** コンポーネントが、公開先のウェブサイトにインストールされ、実行中である必要があります。このコンポーネントは、AIGNE WebSmithがコンテンツをアップロードおよび管理するために必要なAPIを提供します。

ウェブサイトがまだセットアップされていない場合は、Blocklet Storeから必要なコンポーネントを入手できます。
*   [ウェブサイトにPages Kitをインストールする](https://store.blocklet.dev/blocklets/z8ia29UsENBg6tLZUKi2HABj38Cw1LmHZocbQ)

## 公開プロセス

公開プロセスには、コマンドの実行、適切なオプションの選択、ウェブサイトのURLの入力、そしてAIGNE WebSmith CLIがサイトに接続するための承認が含まれます。

### ステップ1：公開コマンドの開始

プロジェクトディレクトリからターミナルで `publish` コマンドを実行して、プロセスを開始します。

```bash コマンドライン icon=lucide:terminal
aigne web publish
```

### ステップ2：公開オプションの選択

いくつかの公開オプションが表示されます。矢印キーを使用して **"Your existing website"** をハイライトし、選択してください。

```text 公開オプション
? Select platform to publish your pages:
  WebSmith Cloud (https://websmith.ai) – Free hosting. Your pages will be public accessible. Best for open-source projects or community sharing.
❯ Your existing website - Integrate and publish directly on your current site (setup required)
  New dedicated website - Paid service. Create a new website with custom domain and hosting for professional use.
```

### ステップ3：ウェブサイトURLの入力

カスタムオプションを選択すると、ウェブサイトのURLを入力するよう求められます。

```text URLの入力
? Please enter your website URL:
› https://my-awesome-site.com
```

Pages Kitコンポーネントがインストールされているウェブサイトの完全なURLを入力し、Enterキーを押します。

### ステップ4：CLIの承認

新しいウェブサイトへの初回接続では、CLIがコンテンツを公開するために承認が必要です。これはウェブサイトごとに一度だけ行う設定プロセスです。

1.  **ブラウザ認証：** デフォルトのウェブブラウザが自動的にページを開き、CLIの接続と承認を求めます。
2.  **ログイン：** DIDウォレットを使用してウェブサイトにログインするよう求められます。
3.  **接続の承認：** ログイン後、「AIGNE WebSmith」からのサイトへのアクセスリクエストを承認する必要があります。このリクエストでは、ページの管理権限が要求されます。

承認されると、セキュアなアクセストークンが生成され、ホームディレクトリ（`~/.aigne/web-smith-connected.yaml`）にローカルで保存されます。このトークンは、この特定のURLへの後続のすべての公開操作で使用されるため、承認ステップを繰り返す必要はありません。

### ステップ5：確認を待つ

承認後、CLIは以下の処理に進みます。
1.  生成されたページファイルとアセットをバンドルします。
2.  参照されているすべてのメディアファイルをアップロードします。
3.  ページコンテンツをウェブサイトに公開します。

正常に完了すると、新しく公開されたページのライブURLを含む確認メッセージがターミナルに表示されます。

```text 成功メッセージ
✅ Pages published successfully! (`5/5` pages, `12` media assets)

🔗 Live URLs:
   https://my-awesome-site.com/docs/
   https://my-awesome-site.com/docs/introduction
   https://my-awesome-site.com/docs/getting-started
   https://my-awesome-site.com/docs/api-reference
   https://my-awesome-site.com/docs/contact

💡 Optional: Update specific pages (`aigne web update`) or refine website structure (`aigne web generate`)
```

## トラブルシューティング

公開プロセス中にエラーが発生した場合は、以下の一般的な問題を参照してください。

*   **エラー： "The provided URL is not a valid website on ArcBlock platform"**
    *   **原因：** 入力したURLが、有効なBlockletアプリケーションを指していません。
    *   **解決策：** URLが正しく、ウェブサイトが実行中であることを確認してください。正しいプロトコル（例：`https://`）が含まれていることを確認してください。

*   **エラー： "This website does not have required components for publishing"**
    *   **原因：** 公開先のウェブサイトは有効なBlockletですが、必要な「Pages Kit」コンポーネントがありません。
    *   **解決策：** ウェブサイトにPages Kitコンポーネントをインストールしてください。手順は[こちら](https://www.arcblock.io/docs/blocklet-development/en/add-components)で確認できます。

*   **エラー： "Unable to connect" or "Failed to obtain access token"**
    *   **原因：** これは通常、ネットワークの問題、または公開先サーバーが利用不可であることを示します。ブラウザで承認リクエストを拒否した場合にも発生することがあります。
    *   **解決策：** インターネット接続を確認し、ウェブサイトのURLが正しくアクセス可能であることを確認してから、`aigne web publish` コマンドを再実行し、承認リクエストを必ず承認してください。

---

正常に公開した後、コンテンツをさらに管理できます。既存のページに変更を加えるには、[ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md)を参照してください。