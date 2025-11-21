ウェブサイトが生成されたら、最後のステップはオンラインでアクセスできるようにすることです。このガイドでは、AIGNE WebSmith を使用してサイトを公開するためのさまざまな方法について説明し、技術的要件や予算要件に最も適したオプションを選択できるようにします。

`aigne web publish` コマンドは、生成されたウェブサイトファイルをデプロイするための主要なツールです。ニーズに応じて、無料の WebSmith Cloud にデプロイしたり、既存のインフラストラクチャと統合したり、新しい専用ウェブサイトをセットアップしたりできます。

### 公開先

WebSmith は 3 つの異なる公開ターゲットを提供します。各オプションの詳細な手順については、それぞれのガイドを参照してください。

<x-cards data-columns="3">
  <x-card data-title="To WebSmith Cloud" data-icon="lucide:cloud" data-href="/guides/publish-website/to-websmith-cloud">無料のマネージドホスティングプラットフォームに公開します。オープンソースプロジェクト、個人サイト、またはコミュニティでの共有に最適です。</x-card>
  <x-card data-title="To Existing Website" data-icon="lucide:server" data-href="/guides/publish-website/to-existing-website">生成されたページを、現在自己管理しているウェブサイトのインフラストラクチャに直接統合してデプロイします。</x-card>
  <x-card data-title="To New Dedicated Website" data-icon="lucide:globe" data-href="/guides/publish-website/to-new-dedicated-website">カスタムドメインとプロフェッショナルなホスティングを備えた、新しい完全マネージドウェブサイトを作成して公開します。これは有料サービスです。</x-card>
</x-cards>

### 一般的なプロセス

公開先に関わらず、公開プロセスは単一のコマンドで開始されます。その後、ツールが必要な認証や設定手順を案内します。

1.  **ウェブサイトの生成**: 公開する前に、`aigne web generate` コマンドを使用してウェブサイトが作成されていることを確認してください。
2.  **公開コマンドの実行**: ターミナルで次のコマンドを実行します。
    ```sh aigne web publish icon=lucide:upload-cloud
    aigne web publish
    ```
3.  **対話型プロンプトに従う**: CLI が利用可能な公開オプションを提示します。ターゲットを指定していない場合は、いずれかを選択するよう求められます。サービスへの初回接続時には、認証のためにブラウザウィンドウが開きます。

    ![WebSmith Publish Options](../../../assets/images/web-smith-publish-resume.png)

4.  **デプロイメントの検証**: コマンドが完了すると、確認メッセージと公開されたページのライブURLが出力されます。これらのリンクにアクセスして、デプロイが成功し、ウェブサイトが期待どおりに表示されることを確認することをお勧めします。

    ![Successful Publish Output](../../../assets/images/web-smith-publish-success.png)

### まとめ

ウェブサイトの公開は `aigne web publish` コマンドによって処理される簡単なプロセスです。複数のデプロイメントターゲットを提供することで、WebSmith はさまざまなユースケースに対応する柔軟性を確保します。

各公開方法の具体的な手順については、詳細なガイドを参照してください。

-   [To WebSmith Cloud](./guides-publish-website-to-websmith-cloud.md)
-   [To Existing Website](./guides-publish-website-to-existing-website.md)
-   [To New Dedicated Website](./guides-publish-website-to-new-dedicated-website.md)