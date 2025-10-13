# 概要

AIGNE WebSmithは、AIを活用して、コンテンツが豊富でプロフェッショナルなウェブサイトの作成を自動化するツールです。ウェブサイトの構造計画やコンテンツ作成から、最終的なページの生成、オンラインでの公開まで、すべてを処理します。これにより、簡単なアイデアから、最小限の労力で、技術的な専門知識を必要とせずに、SEOに最適化されたウェブサイトを公開できます。

強力な [AIGNE Framework](https://www.aigne.io/framework) 上に構築されたWebSmithは、自動化されたウェブ開発チームとして機能します。あなたがウェブサイトのビジョンを提供すれば、AI Agentが面倒な作業をこなし、高品質な成果物を保証し、オーディエンスに公開できる状態にします。

## 主な機能

WebSmithは、一連のインテリジェントな機能で、ウェブサイト作成プロセス全体を簡素化します。

<x-cards data-columns="3">
  <x-card data-title="AIによる生成" data-icon="lucide:brain-circuit">
    WebSmithはAIを使用して、ウェブサイトの構造をインテリジェントに計画し、各ページに魅力的で関連性の高いコンテンツを生成し、最初から検索エンジンに最適化されるようにします。
  </x-card>
  <x-card data-title="プロフェッショナルなテンプレート" data-icon="lucide:layout-template">
    あなたのウェブサイトは、モダンでプロフェッショナルにデザインされたコンポーネントのライブラリを使用して構築されます。最終的なテンプレートは完全レスポンシブで、デスクトップ、タブレット、モバイルデバイスで見栄えが良くなるようにします。
  </x-card>
  <x-card data-title="ワンクリック公開" data-icon="lucide:rocket">
    ウェブサイトが生成されたら、1つのコマンドで公開できます。WebSmithがプロセス全体を処理し、すぐに世界と共有できる公開URLを提供します。
  </x-card>
</x-cards>

## 仕組み

プロセスは、簡単で効率的になるように設計されています。複雑な一連の技術的な手順の代わりに、簡単なコマンドと説明を通じてシステムと対話します。

```d2
direction: down

User: {
  shape: c4-person
  label: "あなた"
}

Define-Requirements: {
  label: "1. ウェブサイトの定義"
  style.fill: "#f0f9ff"
}

AI-Generation: {
  label: "2. AIがサイトを生成"
  style.fill: "#f0f9ff"

  sub-process: {
    direction: right
    Plan-Structure: "構造の計画"
    Write-Content: "コンテンツの作成"
    Build-Pages: "ページの構築"
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

User -> Define-Requirements: "ニーズに関する簡単な\n説明を提供"
Define-Requirements -> AI-Generation: "'aigne web generate'"
AI-Generation -> Publish: "生成されたファイル"
Publish -> Live-Website: "'aigne web publish'"
```

1.  **ウェブサイトの説明**: まず、ウェブサイトの概要、ターゲットオーディエンス、必要なページを概説する簡単なファイルを作成します。これは、新しいSaaS製品、個人のポートフォリオ、または技術ドキュメントハブのためのものです。
2.  **コマンドで生成**: `aigne web generate` コマンドを実行します。AIが要件を分析し、最適なサイト構造を計画し、すべてのコンテンツを作成し、プロフェッショナルなデザインコンポーネントを使用してページを組み立てます。
3.  **すぐに公開**: 準備ができたら、`aigne web publish` コマンドを実行します。WebSmithが必要なすべてのファイルをアップロードし、新しいウェブサイトの公開URLを提供します。

## WebSmithの対象ユーザー

AIGNE WebSmithは、高品質なウェブサイトを迅速に作成する必要があるすべての人に最適です。以下のような方々が含まれます:

*   **中小企業の経営者**: 顧客を引き付けるためのプロフェッショナルなウェブサイトを立ち上げます。
*   **開発者とスタートアップ**: 製品のマーケティングサイト、ブログ、ドキュメントを迅速に作成します。
*   **マーケター**: 開発チームに頼ることなく、ランディングページやコンテンツハブを展開します。
*   **クリエイター**: 個人のブランドやポートフォリオサイトを簡単に構築します。

## 次のステップ

AIGNE WebSmithの機能を大まかに理解したところで、最初のウェブサイトを作成する準備が整いました。

*   **[はじめに](./getting-started.md)**: ガイドに従って必要なツールをインストールし、30分以内に最初のウェブサイトを生成しましょう。