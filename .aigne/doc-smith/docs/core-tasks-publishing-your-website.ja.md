# ウェブサイトを公開する

ウェブサイトが生成されたら、次のステップはインターネット上でアクセスできるようにすることです。このプロセスは公開として知られています。AIGNE WebSmith は、`aigne web publish` という単一のコマンドを提供することでこのタスクを簡素化します。このコマンドは、迅速な無料ホスティングからプロフェッショナルなカスタムドメインまで、さまざまなニーズに合わせた複数の公開先オプションを提供します。

このセクションでは、利用可能な公開選択肢の概要を説明します。各オプションは、明確でステップバイステップの手順を提供するために、それぞれ専用のガイドで詳しく説明されています。

### 公開オプション

WebSmith は、ウェブサイトを公開するための3つの主要な方法を提供しています。プロジェクトの要件に最も適したものを選択してください。

<x-cards data-columns="3">
  <x-card data-title="WebSmith Cloud に公開" data-icon="lucide:cloud" data-href="/core-tasks/publishing-your-website/cloud">
    サイトをオンラインにする最も迅速な方法です。当社の無料の公開ホスティングサービスをご利用ください。このオプションは、テスト、オープンソースプロジェクト、またはコミュニティでの共有に最適です。
  </x-card>
  <x-card data-title="ご自身のウェブサイトに公開" data-icon="lucide:server" data-href="/core-tasks/publishing-your-website/custom">
    すでに ArcBlock プラットフォーム上にウェブサイトを構築しているユーザー向けです。このガイドでは、新しく生成されたページを既存のインフラストラクチャに統合して公開する方法を説明します。
  </x-card>
  <x-card data-title="新しい専用ウェブサイトに公開" data-icon="lucide:globe" data-href="/core-tasks/publishing-your-website/new-dedicated-website">
    カスタムドメインとホスティング機能を備えた新しい専用ウェブサイトを作成する有料サービスです。これは、プロフェッショナルおよび商用利用におすすめの選択肢です。
  </x-card>
</x-cards>

### 公開プロセス

公開プロセスは `aigne web publish` コマンドによって処理されます。事前の設定なしでこのコマンドを初めて実行すると、WebSmith はインタラクティブなプロンプトを起動し、上記のオプションのいずれかを選択するよう案内します。

一般的なワークフローは次のとおりです。

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
  label: "インタラクティブプロンプト"
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
  label: "新しい専用ウェブサイト"
  shape: cylinder
}

user -> cli: "`aigne web publish` を実行"
cli -> interactive-prompt: "公開先は設定済みか？"

interactive-prompt -> websmith-cloud: "いいえ -> 'WebSmith Cloud' を選択"
interactive-prompt -> existing-website: "いいえ -> '既存のウェブサイト' を選択"
interactive-prompt -> new-website: "いいえ -> '新しいウェブサイト' を選択"
interactive-prompt -> existing-website: "はい"
```

### はじめに

開始するには、ターミナルで公開コマンドを実行するだけです。

```bash
aigne web publish
```

初めて公開する場合は、公開先を選択するよう求められます。各オプションの詳細な手順については、上記でリンクされている特定のガイドを参照してください。

### まとめ

WebSmith は、さまざまなデプロイシナリオに対応するための柔軟な公開システムを提供しています。無料のクラウドホスティングから始めて、ニーズの進化に合わせて後からカスタムまたは専用のウェブサイトに移行できます。

続行するには、上記のオプションから公開ガイドのいずれかを選択してください。迅速で簡単な初期デプロイメントのために、[WebSmith Cloud に公開](./core-tasks-publishing-your-website-cloud.md)から始めることをお勧めします。