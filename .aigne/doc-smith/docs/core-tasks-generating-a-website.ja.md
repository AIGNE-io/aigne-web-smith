# ウェブサイトの生成

AIGNE WebSmithのコア機能は、ソースコンテンツと定義された一連の要件から、完全でプロフェッショナルなウェブサイトを生成することです。このプロセスは`generate`コマンドによって処理され、一連のAI Agentを連携させてサイトの計画、作成、構造化を行います。

このガイドでは、`generate`コマンドについて詳しく説明し、AIの主要な設計図として機能する`config.yaml`ファイルでウェブサイトの要件を定義する方法を解説します。

## `generate` コマンド

`aigne web generate`コマンドは、ウェブサイト作成プロセス全体を開始します。設定を読み込み、ソースマテリアルを分析し、ウェブサイトの構造を計画し、各ページのコンテンツを生成し、最終的なファイルを組み立てます。

### 使用方法

生成プロセスを実行するには、ターミナルで次のコマンドを実行します。

```bash
aigne web generate
```

エイリアス `gen` または `g` を使用することもできます。

```bash
aigne web gen
```

### 生成プロセス

`generate`コマンドを実行すると、WebSmithは以下の一連の操作を実行します。

1.  **設定の読み込み**: まず`config.yaml`ファイルを探して読み込み、高レベルの要件を理解します。このファイルが存在しない場合、ガイド付きセットアップが自動的に開始され、ファイルが作成されます。
2.  **ソースの分析**: AIは、設定の`sourcesPath`で指定されたドキュメント、Markdownファイル、その他のマテリアルをスキャンして、主題を理解します。
3.  **ウェブサイト構造の計画**: 目的、オーディエンス、ソースコンテンツに基づいて、AIはウェブサイトの論理的なサイトマップを提案し、すべてのページとその階層を概説します。コンテンツ生成が始まる前に、この構造を確認し、承認するよう求められます。
4.  **ページコンテンツの生成**: 承認された構造の各ページについて、AIはタイトル、説明、ヒーローバナー、機能リスト、FAQなどのプロフェッショナルなコンポーネントで構成されるセクションを含む詳細なコンテンツを生成します。
5.  **ウェブサイトファイルの保存**: 各ページの最終的な構造化されたコンテンツは、設定の`pagesDir`で指定されたディレクトリにYAMLファイルとして保存されます。これらのファイルは、公開の準備ができています。

### パラメータ

`generate`コマンドは、その動作をカスタマイズするためのいくつかのオプションパラメータを受け入れます。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>用語集ファイルへのパス（例：`@glossary.md`）を指定します。これにより、プロジェクト固有の用語が生成されたコンテンツ全体で一貫して使用されるようになります。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>`true`に設定すると、コマンドはすべてのページを最初から再生成し、以前に生成されたファイルを上書きします。これは、`config.yaml`ファイルやソースドキュメントに大幅な変更を加えた後に便利です。</x-field-desc>
  </x-field>
</x-field-group>

**パラメータを使用した例:**

```bash
# 用語集ファイルを使用してウェブサイト全体を再生成する
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 設定ファイル (`config.yaml`)

`config.yaml`ファイルは、ウェブサイトの設計図です。AIが特定のニーズに合ったサイトを構築するために必要なコンテキストと制約を提供します。このファイルは、プロジェクト、サイトの目的とオーディエンス、言語設定、およびファイルの場所を定義します。

以下は、`config.yaml`ファイル内の主要なプロパティの詳細な内訳です。

### 設定オプション

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>プロジェクトまたはウェブサイトの名前。メタデータや公開に使用されます。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="false">
    <x-field-desc markdown>プロジェクトの簡単な説明。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>プロジェクトのロゴへのURLまたはローカルパス。</x-field-desc>
  </x-field>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>ウェブサイトの主要な目標を定義する文字列の配列。例: `landingPage`、`ecommerce`、`portfolio`、`corporate`、`blog`、`saas`、`nonprofit`、`education`、`mixedPurpose`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>主要なオーディエンスを特定する文字列の配列。例: `customers`、`businessOwners`、`marketers`、`designers`、`developers`、`investors`、`jobSeekers`、`students`、`generalPublic`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>ウェブサイトの希望するサイズと複雑さを定義します。オプションには`singlePage`、`minimal`、`standard`、`comprehensive`、`aiDecide`が含まれます。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>声のトーン、除外するコンテンツ、強調する特定のポイントなど、生成中にAIが従うべきカスタムルールや特定の指示のためのフィールド。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>ウェブサイトコンテンツの主要言語。言語コード（例: `en`、`zh`、`es`）で指定します。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>ウェブサイトを翻訳する言語コードのリスト。例: `['zh', 'fr']`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>生成されたウェブサイトのページファイルが保存されるローカルディレクトリパス。</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>ソースコンテンツを指すファイルパスまたはglobパターンの配列。AIはこれらのファイルを分析してウェブサイトを生成します。</x-field-desc>
  </x-field>
</x-field-group>

### `config.yaml` の例

以下は、各セクションを説明するコメント付きの完全な`config.yaml`ファイルの例です。

```yaml config.yaml
# ページ公開のためのプロジェクト情報
projectName: AIGNE WebSmith
projectDesc: AI-driven website generation tool
projectLogo: https://www.aigne.io/image-bin/uploads/bc5afab4e6d282cc7f4aa444e9b9f7f4.svg
projectId: aigne-websmith-docs
projectSlug: aigne-websmith

# =============================================================================
# ウェブサイト設定
# =============================================================================

# 目的: 読者に達成してほしい主な成果は何ですか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）:
#   landingPage     - ランディングページ / ホームページ: 訪問者をユーザーや顧客に転換する
#   ecommerce       - Eコマース / オンラインストア: オンラインで製品やサービスを販売する
#   portfolio       - ポートフォリオ / ショーケース: クリエイティブな作品、プロジェクト、実績を展示する
#   corporate       - コーポレート / ビジネス: 会社情報を含むプロフェッショナルなビジネスウェブサイト
#   blog            - ブログ / コンテンツサイト: 記事、ニュース、定期的なコンテンツ更新を共有する
#   saas            - SaaS / ソフトウェア製品: ソフトウェアサービスへのユーザーのプロモーションとオンボーディングを行う
#   nonprofit       - 非営利 / コミュニティ: 大義を推進し、寄付を受け付け、ボランティアを巻き込む
#   education       - 教育 / 学習: コース、チュートリアル、または教育コンテンツを提供する
#   mixedPurpose    - 多目的ウェブサイト: 複数のニーズをカバーする包括的なウェブサイト
pagePurpose:
  - saas

# ターゲットオーディエンス: 誰がこれを最も頻繁に読みますか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）:
#   customers        - 顧客 / エンドユーザー: 製品/サービスを購入または使用する人々
#   businessOwners   - ビジネスオーナー / 起業家: ソリューションを探しているビジネスを経営する人々
#   marketers        - マーケティングチーム: 製品をプロモーションしたり、キャンペーンを管理したりする人々
#   designers        - デザイナー / クリエイティブプロフェッショナル: ビジュアルデザインとユーザーエクスペリエンスに焦点を当てた人々
#   developers       - 開発者 / テクニカルユーザー: 技術的なソリューションを構築または統合する人々
#   investors        - 投資家 / ステークホルダー: ビジネスの可能性と成長を評価する人々
#   jobSeekers       - 求職者 / 潜在的な従業員: キャリアの機会を探している人々
#   students         - 学生 / 学習者: 教育コンテンツやリソースを求めている人々
#   generalPublic    - 一般大衆 / 混合オーディエンス: さまざまな興味や背景を持つ幅広いオーディエンス
targetAudienceTypes:
  - developers

# ウェブサイトの規模: ウェブサイトには何ページ必要ですか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）:
#   singlePage      - シングルページ（1ページのみ）: すべてのコンテンツを1ページに統合
#   minimal         - 最小限（2-6ページ）: コアページのみ - 迅速に立ち上げ可能
#   standard        - 標準（7-12ページ）: 主要セクションを含む完全なウェブサイト [推奨]
#   comprehensive   - 包括的（12ページ以上）: 詳細なセクションを持つフル機能のウェブサイト
#   aiDecide        - AIに決定させる: プロジェクトの複雑さを分析し、適切な規模を提案
websiteScale: standard

# カスタムルール: 特定のページ生成ルールと要件を定義する
rules: 'フォーマルで技術的なトーンを維持する。マーケティング用語は避ける。実践的でステップバイステップの指示に焦点を当てる。'

# 用語集: プロジェクト固有の用語と定義を定義する
# glossary: "@glossary.md"  # 用語集の定義を含むMarkdownファイルへのパス

locale: en
# translateLanguages:  # ページを翻訳する言語のリスト
#   - zh  # 例: 中国語翻訳
#   - en  # 例: 英語翻訳

pagesDir: ./aigne-web-smith/pages  # 生成されたページを保存するディレクトリ
sourcesPath:  # 分析するソースコードのパス
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # すべてのページに含まれるデフォルトのデータソース
  - ./media.md
# minImageWidth: この値（ピクセル単位）より広い画像のみがページ生成で使用されます
media:
  minImageWidth: 800
```

## 概要

`generate`コマンドと適切に定義された`config.yaml`ファイルを組み合わせることで、正確な仕様に合わせた完全なウェブサイトを効率的に作成できます。このプロセスは、サイト構造とコンテンツ作成の面倒な作業を自動化し、高品質のソースマテリアルの提供に集中できるようにします。

ウェブサイトを生成した後、次のステップはそれをオンラインで利用可能にすることです。

続きを読む:
*   [ウェブサイトの公開](./core-tasks-publishing-your-website.md)