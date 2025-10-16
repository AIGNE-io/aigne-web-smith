# 概要

AIGNE WebSmithは、プロフェッショナルでコンテンツが豊富なウェブサイトの作成を自動化するために設計されたAI駆動のツールです。ウェブサイトの構造計画からコンテンツの執筆、最終的なページの生成、オンラインでの公開まで、すべてを処理します。これにより、簡単なアイデアから、最小限の労力で専門知識を必要とせずに、SEOに最適化された公開ウェブサイトを立ち上げることができます。

強力な [AIGNE フレームワーク](https://www.aigne.io/framework) 上に構築された AIGNE WebSmith は、あなたの自動化されたウェブ開発チームとして機能します。あなたがウェブサイトのビジョンを提供すれば、AI Agent が面倒な作業をすべて行い、オーディエンスに届ける準備ができた高品質な結果を保証します。

## 主な機能

AIGNE WebSmithは、一連のインテリジェントな機能でウェブサイト作成プロセス全体を簡素化します。

<x-cards data-columns="3">
  <x-card data-title="AIによる生成" data-icon="lucide:brain-circuit">
    WebSmithはAIを使用して、ウェブサイトの構造をインテリジェントに計画し、各ページに関連性の高い魅力的なコンテンツを生成し、最初から検索エンジンに最適化されるようにします。
  </x-card>
  <x-card data-title="プロフェッショナルなテンプレート" data-icon="lucide:layout-template">
    あなたのウェブサイトは、モダンでプロフェッショナルにデザインされたコンポーネントのライブラリを使用して構築されます。最終的なテンプレートは完全レスポンシブ対応で、デスクトップ、タブレット、モバイルデバイスでも美しく表示されます。
  </x-card>
  <x-card data-title="ワンクリック公開" data-icon="lucide:rocket">
    ウェブサイトが生成されたら、コマンド1つで公開できます。WebSmithがプロセス全体を処理し、すぐに世界と共有できる公開URLを提供します。
  </x-card>
</x-cards>

## 仕組み

このプロセスは、わかりやすく効率的に設計されています。複雑な一連の技術的なステップの代わりに、簡単なコマンドと説明を通じてシステムと対話します。

```d2
direction: down

User: {
  shape: c4-person
  label: "あなた"
}

Define-Requirements: {
  label: "1. ウェブサイトを定義"
  style.fill: "#f0f9ff"
}

AI-Generation: {
  label: "2. AIがサイトを生成"
  style.fill: "#f0f9ff"

  sub-process: {
    direction: right
    Plan-Structure: "構造を計画"
    Write-Content: "コンテンツを作成"
    Build-Pages: "ページを構築"
  }
}

Publish: {
  label: "3. オンラインで公開"
  style.fill: "#f0f9ff"
}

Live-Website: {
  label: "公開されたウェブサイト"
  shape: cylinder
  style.fill: "#ecfdf5"
}

User -> Define-Requirements: "ニーズに関する簡単な説明\nを提供する"
Define-Requirements -> AI-Generation: "'aigne web generate'"
AI-Generation -> Publish: "生成されたファイル"
Publish -> Live-Website: "'aigne web publish'"
```

1.  **ウェブサイトを説明する**: まず、ウェブサイトの概要、ターゲットオーディエンス、必要なページについて概説した簡単なファイルを作成します。これは、新しいSaaS製品、個人のポートフォリオ、または技術ドキュメントのハブなど、どのようなものでも構いません。
2.  **コマンドで生成する**: `aigne web generate` コマンドを実行します。AIがあなたの要件を分析し、最適なサイト構造を計画し、すべてのコンテンツを執筆し、プロフェッショナルなデザインコンポーネントを使用してページを組み立てます。
3.  **すぐに公開する**: 準備ができたら、`aigne web publish` コマンドを実行します。WebSmithが必要なファイルをすべてアップロードし、新しいウェブサイトの公開URLを提供します。

## WebSmithの対象ユーザー

AIGNE WebSmithは、高品質なウェブサイトを迅速に作成する必要があるすべての人に最適です。

- **中小企業の経営者**: プロフェッショナルなウェブサイトを立ち上げ、顧客を引きつけます。
- **開発者とスタートアップ**: 製品のマーケティングサイト、ブログ、ドキュメントを迅速に作成します。
- **マーケター**: 開発チームに頼らずに、ランディングページやコンテンツハブを展開します。
- **クリエイター**: 個人のブランドサイトやポートフォリオサイトを簡単に構築します。

## 次のステップ

AIGNE WebSmithが何をするものか、大まかに理解できたところで、最初のウェブサイトを作成する準備が整いました。

- **[スタートガイド](./getting-started.md)**: ガイドに従って必要なツールをインストールし、30分以内に最初のウェブサイトを生成しましょう。