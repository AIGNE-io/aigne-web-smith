# 概要

AIGNE WebSmith は、プロフェッショナルでコンテンツ豊富なウェブサイトの作成を自動化するために設計された AI 駆動のツールです。ウェブサイトの構造計画、コンテンツの執筆から、最終的なページの生成、オンラインでの公開まで、すべてを処理します。これにより、単純なアイデアから、最小限の労力と技術的な専門知識なしで、SEO に最適化された稼働中のウェブサイトを構築できます。

[AIGNE Framework](https://www.aigne.io/framework) 上に構築された AIGNE WebSmith は、あなたの自動化されたウェブ開発チームとして機能します。あなたがウェブサイトのビジョンを提供すれば、AI Agent が面倒な作業を行い、オーディエンスに届ける準備ができた高品質な成果を保証します。

## 主な機能

AIGNE WebSmith は、一連のインテリジェントな機能でウェブサイト作成プロセス全体を簡素化します。

<x-cards data-columns="3">
  <x-card data-title="AI による生成" data-icon="lucide:brain-circuit">
    WebSmith は AI を使用して、ウェブサイトの構造をインテリジェントに計画し、すべてのページに関連性の高い魅力的なコンテンツを生成し、最初から検索エンジン向けに最適化されていることを保証します。
  </x-card>
  <x-card data-title="プロフェッショナルなテンプレート" data-icon="lucide:layout-template">
    あなたのウェブサイトは、モダンでプロフェッショナルにデザインされたコンポーネントのライブラリを使用して構築されます。最終的なテンプレートは完全に応答性があり、デスクトップ、タブレット、モバイルデバイスで見栄えが良くなります。
  </x-card>
  <x-card data-title="ワンクリック公開" data-icon="lucide:rocket">
    ウェブサイトが生成されたら、1 つのコマンドで公開できます。WebSmith はプロセス全体を処理し、すぐに世界と共有できる稼働中の URL を提供します。
  </x-card>
</x-cards>

## 仕組み

このプロセスは、簡単で効率的になるように設計されています。複雑な一連の技術的な手順の代わりに、簡単なコマンドと説明を通じてシステムと対話します。

```d2
direction: down

User: {
  shape: c4-person
  label: "あなた"
}

Define-Requirements: {
  label: "1. ウェブサイトを定義する"
  style.fill: "#f0f9ff"
}

AI-Generation: {
  label: "2. AI がサイトを生成する"
  style.fill: "#f0f9ff"

  sub-process: {
    direction: right
    Plan-Structure: "構造を計画"
    Write-Content: "コンテンツを執筆"
    Build-Pages: "ページを構築"
  }
}

Publish: {
  label: "3. オンラインで公開"
  style.fill: "#f0f9ff"
}

Live-Website: {
  label: "稼働中のウェブサイト"
  shape: cylinder
  style.fill: "#ecfdf5"
}

User -> Define-Requirements: "あなたのニーズを\n簡単な説明で提供"
Define-Requirements -> AI-Generation: "'aigne web generate'"
AI-Generation -> Publish: "生成されたファイル"
Publish -> Live-Website: "'aigne web publish'"
```

1.  **ウェブサイトを説明する**: まず、ウェブサイトの概要、ターゲットオーディエンス、必要なページを概説する簡単なファイルを作成します。これは、新しい SaaS 製品、個人のポートフォリオ、または技術ドキュメントのハブのためのものかもしれません。
2.  **コマンドで生成する**: `aigne web generate` コマンドを実行します。AI があなたの要件を分析し、最適なサイト構造を計画し、すべてのコンテンツを執筆し、プロのデザインコンポーネントを使用してページを組み立てます。
3.  **即座に公開する**: 準備ができたら、`aigne web publish` コマンドを実行します。WebSmith は必要なすべてのファイルをアップロードし、新しいウェブサイトの稼働中の URL を提供します。

## WebSmith の対象者

AIGNE WebSmith は、高品質なウェブサイトを迅速に作成する必要があるすべての人に最適です。以下のような方々が含まれます。

- **中小企業の経営者**: 顧客を引き付けるためのプロフェッショナルなウェブプレゼンスを立ち上げます。
- **開発者とスタートアップ**: 製品のマーケティングサイト、ブログ、またはドキュメントを迅速に作成します。
- **マーケター**: 開発チームに頼らずにランディングページやコンテンツハブを展開します。
- **クリエイター**: 個人のブランドやポートフォリオサイトを簡単に構築します。

## 次のステップ

AIGNE WebSmith が何をするものかについて大まかに理解できたので、最初のウェブサイトを作成する準備ができました。

- **[はじめに](./getting-started.md)**: ガイドに従って必要なツールをインストールし、30 分以内に最初のウェブサイトを生成します。