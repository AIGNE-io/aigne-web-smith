# 概要

専門的なウェブサイトを立ち上げたいけれど、コーディングの時間も開発チームを雇う余裕もないですか？AIGNE WebSmithはプロセス全体を自動化し、あなたの製品概要を、魅力的なコンテンツ、モダンなデザイン、SEO最適化を備えた完全なマルチページウェブサイトへと、たった一つのコマンドで変えます。

AIGNE WebSmithは、あなたのビジョンと要件からプロフェッショナルなウェブサイトを自動的に作成するAI駆動のツールです。[AIGNE Framework](https://www.aigne.io/framework)上に構築され、[Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)コンポーネントを活用して、本番環境に対応したレスポンシブなウェブサイトを生成します。

このツールは、ウェブサイト制作における一般的な課題、すなわち、構築に時間がかかる、技術的な専門知識が必要、複数のページにわたってコンテンツの品質を維持するのが難しい、といった問題に対処します。このプロセスを自動化することで、WebSmithはあなたのウェブサイトがプロフェッショナルで一貫性を保ち、数週間ではなく数時間で公開できる状態にすることを支援します。

## 主な特徴

AIGNE WebSmithは、一連のインテリジェントな機能でウェブサイト制作プロセス全体を簡素化します。

<x-cards data-columns="3">
  <x-card data-title="AIによる生成" data-icon="lucide:brain-circuit">
    WebSmithはAIを使用して、ウェブサイトの構造をインテリジェントに計画し、各ページに魅力的で関連性の高いコンテンツを生成し、最初から検索エンジンに最適化されていることを保証します。
  </x-card>
  <x-card data-title="プロフェッショナルなテンプレート" data-icon="lucide:layout-template">
    あなたのウェブサイトは、モダンでプロフェッショナルにデザインされたコンポーネントのライブラリを使用して構築されます。最終的なテンプレートは完全にレスポンシブで、デスクトップ、タブレット、モバイルデバイスで見栄えが良くなるようにします。
  </x-card>
  <x-card data-title="ワンクリック公開" data-icon="lucide:rocket">
    ウェブサイトが生成されたら、一つのコマンドで公開できます。WebSmithがプロセス全体を処理し、すぐに世界と共有できるライブURLを提供します。
  </x-card>
</x-cards>

## コア機能

WebSmithは、コンセプトから公開までのウェブサイトのライフサイクル全体を処理するための包括的な機能セットを提供します。

*   **AIによる生成**: あなたの要件を分析し、論理的なウェブサイト構造を提案し、ターゲットオーディエンスにメッセージを効果的に伝えるコンテンツを生成します。
*   **多言語対応**: あなたのウェブサイトを英語、中国語（簡体字）、日本語を含む12の言語に翻訳します。翻訳プロセスは文脈を認識し、ブランドの声と技術的な正確性を維持します。
*   **LLMとの統合**: さまざまな大規模言語モデル（LLM）と接続します。デフォルトでは[AIGNE Hub](https://www.aigne.io/hub)を使用します。これは、Google GeminiやOpenAI GPTのようなモデルを個別のAPIキーなしで切り替えられるサービスです。プロバイダーへの直接アクセスのために、独自のAPIキーを設定することもできます。
*   **Pages Kitによるプロフェッショナルなデザイン**: モダンでレスポンシブなコンポーネントのライブラリである[Pages Kit](https://store.blocklet.dev/blocklets/z8iZiDFg3vkkrPwsiba1TLXy3H9XHzFERsP8o)を使用してウェブサイトを生成します。すべてのセクションは本番環境に対応した見た目であり、デスクトップ、タブレット、モバイルデバイスでシームレスに動作します。
*   **スマートアップデート**: 要件の変更を検出し、ウェブサイトの対応するページを更新します。生成されたコンテンツを洗練させるために、特定のフィードバックを提供することもできます。
*   **公開オプション**: 一つのコマンドでウェブサイトを公開します。WebSmith Cloudまたは独自のカスタムドメインにデプロイでき、デプロイ設定を完全に制御できます。

## 仕組み

WebSmithは、あなたの要件を分析してビジョン、ターゲットオーディエンス、および望ましい機能を理解することによって動作します。この分析に基づき、ナビゲーション構造から詳細なページコンテンツやスタイリングまで、完全なウェブサイトセットを生成します。

```d2
direction: down

Requirements: {
  label: "製品概要と要件"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  shape: rectangle
  style: {
    stroke: "#888"
    stroke-width: 2
    stroke-dash: 4
  }

  Planning-Engine: {
    label: "プランニングエンジン"
    shape: rectangle
  }

  Generation-Engine: {
    label: "生成エンジン"
    shape: rectangle
  }

  Theme-Engine: {
    label: "テーマエンジン"
    shape: rectangle
  }

  LLMs: {
    label: "大規模言語モデル"
    shape: rectangle

    AIGNE-Hub: {
      label: "AIGNE Hub"
    }

    Direct-Access: {
      label: "直接アクセス"
      shape: rectangle
      Google-Gemini: {}
      OpenAI-GPT: {}
    }
  }
}

Pages-Kit: {
  label: "Pages Kit コンポーネント"
  shape: rectangle
}

Published-Website: {
  label: "公開されたウェブサイト"
  shape: rectangle

  WebSmith-Cloud: {
    label: "WebSmith Cloud"
  }

  Custom-Domain: {
    label: "カスタムドメイン"
  }
}

Requirements -> AIGNE-WebSmith.Planning-Engine: "分析する"
AIGNE-WebSmith.Planning-Engine -> AIGNE-WebSmith.Generation-Engine: "計画する"
AIGNE-WebSmith.Generation-Engine <-> AIGNE-WebSmith.LLMs: "利用する"
AIGNE-WebSmith.Generation-Engine -> AIGNE-WebSmith.Theme-Engine: "生成する"
AIGNE-WebSmith.Theme-Engine -> Pages-Kit: "適用する"
Pages-Kit -> Published-Website: "公開する"
```

1.  **ウェブサイトを記述する**: まず、ウェブサイトの目的、ターゲットオーディエンス、必要なページを概説した簡単なファイルを作成します。これは、新しいSaaS製品、個人のポートフォリオ、または技術ドキュメントのハブのためかもしれません。
2.  **コマンドで生成する**: `aigne web generate` コマンドを実行します。AIがあなたの要件を分析し、最適なサイト構造を計画し、すべてのコンテンツを書き、プロフェッショナルなデザインコンポーネントを使用してページを組み立てます。
3.  **即座に公開する**: 準備ができたら、`aigne web publish` コマンドを実行します。WebSmithが必要なすべてのファイルをアップロードし、新しいウェブサイトのライブURLを提供します。

## 利用可能なコマンド

WebSmithはコマンドラインインターフェースを通じて操作されます。以下の表は、主要なコマンドとその機能の概要です。

| コマンド | 説明 |
| :--- | :--- |
| `generate` | 要件とコンテンツ概要から新しいウェブサイトを作成します。 |
| `update` | フィードバックや要件の変更に基づいて既存のページを修正します。 |
| `translate` | サポートされている12の言語のうち1つ以上にウェブサイトを翻訳します。 |
| `publish` | ウェブサイトをライブのアクセス可能なURLにデプロイします。 |
| `theme` | ウェブサイトのビジュアルテーマとスタイリングを生成または更新します。 |
| `history` | ウェブサイトに加えられた更新の履歴を表示します。 |
| `chat` | ウェブサイトを生成および管理するための対話モードセッションを開始します。 |
| `clear` | 生成されたファイル、設定、キャッシュデータを削除します。 |
| `init` | 対話的なプロセスを通じて、初期設定ファイルの作成をガイドします。 |
| `prefs` | ウェブサイト生成のために保存された設定や構成を管理します。 |

## WebSmithは誰のためのものか？

AIGNE WebSmithは、高品質なウェブサイトを迅速に作成する必要があるすべての人にとって理想的です。これには以下が含まれます：

- **中小企業のオーナー**: 顧客を引き付けるためのプロフェッショナルなウェブプレゼンスを立ち上げます。
- **開発者とスタートアップ**: マーケティングサイト、ランディングページ、製品ショーケースを迅速に作成します。
- **マーケター**: 開発チームに頼らずにキャンペーンサイトやコンテンツハブを展開します。
- **代理店**: クライアントのウェブサイトを迅速にプロトタイプ化し、一貫した品質で提供します。

## 次のステップ

最初のウェブサイトを作成する準備はできましたか？包括的なガイドに従って始めましょう。

<x-cards>
  <x-card data-title="はじめに" data-icon="lucide:rocket" data-href="/getting-started">
    ステップバイステップガイドに従って、AIGNE WebSmithをインストールし、AIGNE Hubに接続し、30分以内に最初のプロフェッショナルなウェブサイトを生成しましょう。
  </x-card>
</x-cards>