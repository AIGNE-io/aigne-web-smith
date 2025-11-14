# ウェブサイトを公開する

ローカルでページの表示が問題ないことを確認したら、`aigne web publish` を実行して公開します。このコマンドは毎回同じフローを使用します。公開先を選択し、一度認証すると、WebSmithがすべてのページとアセットをアップロードします。

## 最速の方法（WebSmith Cloud）

公開URLが必要なだけの場合は、以下の手順に従ってください。

1. **コマンドを実行する**  
   ```bash クイック公開 icon=lucide:terminal
   aigne web publish
   ```  
   エイリアス `aigne web pub` および `aigne web p` も同様に機能します。
2. **WebSmith Cloudを選択する**  
   プロンプトが表示されたら、**WebSmith Cloud**（デフォルトオプション）を選択してEnterキーを押します。
3. **一度だけ認証する**  
   ターミナルがブラウザを開くので、サインインして公開アクセスを承認します。この一度きりの手順の後、認証情報はローカルにキャッシュされます。
4. **デプロイを待つ**  
   WebSmithは生成されたファイルを圧縮し、メディアをアップロードし、完了すると公開URLを出力します。後で同じコマンドを再実行すると、更新が公開されます。公開先を変更しない限り、追加のプロンプトは表示されません。

> **ヒント：** デプロイをスクリプト化したり、プロンプトをスキップしたりするには、`--appUrl https://your-site.com` を追加します。ターミナルコマンドは最後に公開したURLを記憶しているため、次回の実行は完全に自動化されます。

## 他のオプションを使用する場合

ホスティング戦略に合った公開先を選択してください。以下の各カードは、それぞれに特化したウォークスルーにリンクしています。

<x-cards data-columns="3">
  <x-card data-title="WebSmith Cloudへ" data-icon="lucide:cloud" data-href="/guides/publish-website/cloud">
    サイトをオンラインにする最も手軽な方法です。無料の公開ホスティングサービスをご利用ください。このオプションは、テスト、オープンソースプロジェクト、またはコミュニティでの共有に最適です。
  </x-card>
  <x-card data-title="既存のウェブサイトへ" data-icon="lucide:server" data-href="/guides/publish-website/custom">
    すでにArcBlockプラットフォーム上にウェブサイトを構築しているユーザー向けです。このガイドでは、新しく生成したページを既存のインフラストラクチャに統合して公開する方法を説明します。
  </x-card>
  <x-card data-title="新しい専用ウェブサイトへ" data-icon="lucide:globe" data-href="/guides/publish-website/new-dedicated-website">
    カスタムドメインとホスティング機能を備えた新しい専用ウェブサイトを作成する有料サービスです。プロフェッショナルおよび商用利用に推奨される選択肢です。
  </x-card>
</x-cards>

WebSmith Cloudから別の公開先（またはその逆）に移動したい場合は、`aigne web clear --targets deploymentConfig` を実行してキャッシュされたデプロイターゲットをリセットし、再度 `aigne web publish` を実行して新しい公開先を選択します。