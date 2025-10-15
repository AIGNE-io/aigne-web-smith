# ウェブサイトの公開

ウェブサイトが生成されたら、次のステップはインターネット上でアクセス可能にすることです。このプロセスは公開として知られています。AIGNE WebSmith は、`aigne web publish` という単一のコマンドを提供することでこのタスクを簡素化します。このコマンドは、手軽な無料ホスティングからプロフェッショナルなカスタムドメインまで、さまざまなニーズに合わせて複数の公開先オプションを提供します。

このセクションでは、利用可能な公開選択肢の概要を説明します。各オプションについては、それぞれのガイドで明確かつステップバイステップの手順が詳述されています。

### 公開オプション

WebSmith は、ウェブサイトを公開するための3つの主要な方法を提供しています。あなたのプロジェクトの要件に最も合ったものを選択してください。

<x-cards data-columns="3">
  <x-card data-title="WebSmith Cloud に公開" data-icon="lucide:cloud" data-href="/core-tasks/publishing-your-website/cloud">
    サイトをオンラインにする最も手軽な方法です。私たちの無料の公開ホスティングサービスをご利用ください。このオプションは、テスト、オープンソースプロジェクト、またはコミュニティでの共有に最適です。
  </x-card>
  <x-card data-title="自身のウェブサイトに公開" data-icon="lucide:server" data-href="/core-tasks/publishing-your-website/custom">
    ArcBlock プラットフォーム上にすでにウェブサイトを構築しているユーザー向けです。このガイドでは、新しく生成されたページを既存のインフラストラクチャに統合し、公開する方法を説明します。
  </x-card>
  <x-card data-title="新規専用ウェブサイトに公開" data-icon="lucide:globe" data-href="/core-tasks/publishing-your-website/new-dedicated-website">
    カスタムドメインとホスティング機能を備えた新しい専用ウェブサイトを作成する有料サービスです。これは、プロフェッショナルおよび商用利用に推奨される選択肢です。
  </x-card>
</x-cards>

### 公開プロセス

公開プロセスは `aigne web publish` コマンドによって処理されます。事前の設定なしで初めてこのコマンドを実行すると、WebSmith は対話型プロンプトを起動し、上記で説明したオプションのいずれかを選択するように案内します。

一般的なワークフローは以下の通りです：

```d2
direction: down

user: {
  shape: c4-person
  label: "ユーザー"
}

cli: {
  label: "AIGNE CLI"
}

interactive-prompt: {
  label: "公開先の選択"
  shape: diamond
}

websmith-cloud: {
  label: "WebSmith Cloud"
  shape: cylinder
}

existing-website: {
  label: "既存のウェブサイト"
  shape: cylinder
}

new-website: {
  label: "新規専用ウェブサイト"
  shape: cylinder
}

user -> cli: "`aigne web publish` を実行"
cli -> interactive-prompt: "対話型プロンプトを起動"
interactive-prompt -> websmith-cloud: "'WebSmith Cloud' を選択"
interactive-prompt -> existing-website: "'既存のウェブサイト' を選択"
interactive-prompt -> new-website: "'新規専用ウェブサイト' を選択"
```

### はじめに

始めるには、ターミナルで公開コマンドを実行するだけです。

```bash
aigne web publish
```

これが初めての公開である場合、公開先を選択するよう求められます。各オプションの詳細な手順については、上記でリンクされている特定のガイドを参照してください。

### まとめ

WebSmith は、さまざまなデプロイメントシナリオに対応する柔軟な公開システムを提供します。無料のクラウドホスティングから始めて、ニーズの進化に応じて後からカスタムまたは専用のウェブサイトに移行することができます。

次に進むには、上記のオプションから公開ガイドの1つを選択してください。手軽で簡単な初回デプロイメントのために、[WebSmith Cloud に公開](./core-tasks-publishing-your-website-cloud.md) から始めることをお勧めします。