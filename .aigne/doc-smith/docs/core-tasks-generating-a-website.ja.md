# ウェブサイトの生成

AIGNE WebSmithの中核機能は、ソースコンテンツと定義された要件一式から、完全でプロフェッショナルなウェブサイトを生成することです。このプロセスは`generate`コマンドによって処理されます。このコマンドは、一連のAI Agentを連携させ、サイトの計画、作成、構造化を行います。

このガイドでは、`generate`コマンドについて詳述し、AIの主要な設計図として機能する`config.yaml`ファイルでウェブサイトの要件を定義する方法を説明します。

## `generate` コマンド

`aigne web generate`コマンドは、ウェブサイト作成プロセス全体を開始します。設定を読み込み、ソース資料を分析し、ウェブサイトの構造を計画し、各ページのコンテンツを生成し、最終的なファイルを組み立てます。

### 使用方法

生成プロセスを実行するには、ターミナルで次のコマンドを実行します。

```bash
aigne web generate
```

エイリアス `gen` または `g` も使用できます。

```bash
aigne web gen
```

### 生成プロセス

`generate`コマンドを実行すると、WebSmithは次の一連の操作を実行します。

1.  **設定の読み込み**: まず`config.yaml`ファイルを探して読み込み、高レベルの要件を理解します。このファイルが存在しない場合は、ガイド付きセットアップが自動的に開始され、ファイルが作成されます。
2.  **ソースの分析**: AIは、設定の`sourcesPath`で指定されたドキュメント、Markdownファイル、その他の資料をスキャンして、主題を理解します。
3.  **ウェブサイト構造の計画**: 目的、対象読者、ソースコンテンツに基づいて、AIはウェブサイトの論理的なサイトマップを提案し、すべてのページとその階層構造の概要を示します。コンテンツ生成が始まる前に、この構造を確認し承認するよう求められます。
4.  **ページコンテンツの生成**: 承認された構造の各ページについて、AIはタイトル、説明、ヒーローバナー、機能リスト、FAQなどのプロフェッショナルなコンポーネントで構成される詳細なコンテンツを生成します。
5.  **ウェブサイトファイルの保存**: 各ページの最終的な構造化されたコンテンツは、設定の`pagesDir`で指定されたディレクトリにYAMLファイルとして保存されます。これらのファイルは公開可能な状態になります。

### パラメータ

`generate`コマンドは、その動作をカスタマイズするためのいくつかのオプションパラメータを受け付けます。

<x-field-group>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>用語集ファイルへのパス（例：`@glossary.md`）を指定します。これにより、プロジェクト固有の用語が生成されたコンテンツ全体で一貫して使用されるようになります。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false">
    <x-field-desc markdown>`true`に設定すると、コマンドはすべてのページを最初から再生成し、以前に生成されたファイルを上書きします。これは、`config.yaml`ファイルやソースドキュメントに大幅な変更を加えた後に便利です。</x-field-desc>
  </x-field>
</x-field-group>

**パラメータ付きの例：**

```bash
# 用語集ファイルを使用してウェブサイト全体を再生成する
aigne web generate --forceRegenerate --glossary "@glossary.md"
```

## 設定ファイル（`config.yaml`）

`config.yaml`ファイルは、あなたのウェブサイトの設計図です。AIに、特定のニーズを満たすサイトを構築するために必要なコンテキストと制約を提供します。このファイルは、プロジェクト、サイトの目的と対象読者、言語設定、およびファイルの場所を定義します。

以下に、`config.yaml`ファイル内の主要なプロパティの詳細な内訳を示します。

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
    <x-field-desc markdown>ウェブサイトの主要な目標を定義する文字列の配列。例：`productDocumentation`、`marketingLandingPage`、`blog`、`apiReference`。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>主要な対象読者を特定する文字列の配列。例：`developers`、`businessUsers`、`endUsers`、`dataScientists`。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-required="true">
    <x-field-desc markdown>ウェブサイトの希望するサイズと複雑さを定義します。オプションには、`small`（いくつかの主要ページ）、`standard`（包括的なサイト）、`large`（広範なコンテンツを持つ大規模サイト）が含まれます。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>AIが生成中に従うべきカスタムルールや特定の指示のためのフィールド。例えば、トーン＆マナー、除外するコンテンツ、または強調すべき特定のポイントなど。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="true">
    <x-field-desc markdown>ウェブサイトコンテンツの主要言語。言語コード（例：`en`、`zh`、`es`）で指定します。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>ウェブサイトを翻訳する言語コードのリスト。例：`['zh', 'fr']`。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="true">
    <x-field-desc markdown>生成されたウェブサイトのページファイルが保存されるローカルディレクトリのパス。</x-field-desc>
  </x-field>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>ソースコンテンツを指すファイルパスまたはグロブパターンの配列。AIはこれらのファイルを分析してウェブサイトを生成します。</x-field-desc>
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

# 目的：読者に達成してほしい主な成果は何ですか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）：
#   productDocumentation - 製品ドキュメント：詳細なガイド、チュートリアル、APIリファレンス。
#   marketingLandingPage - マーケティングランディングページ：製品を紹介し、訪問者をコンバージョンさせる。
#   companyIntroduction - 会社紹介：会社のビジョンとチームを紹介する。
#   blog              - ブログ：記事、更新情報、業界の洞察。
#   caseStudies       - ケーススタディ：顧客の成功事例とユースケース。
#   knowledgeBase     - ナレッジベース：FAQとトラブルシューティング記事。
#   apiReference      - APIリファレンス：APIの詳細なドキュメント。
#   mixedPurpose      - 複合目的：複数の目標の組み合わせ。
pagePurpose:
  - productDocumentation

# 対象読者：誰がこれを最も頻繁に読みますか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）：
#   developers        - 開発者：あなたの製品で構築する技術的なユーザー。
#   businessUsers     - ビジネスユーザー：ビジネス価値に焦点を当てた非技術的なユーザー。
#   endUsers          - エンドユーザー：最終製品を使用する一般の視聴者。
#   dataScientists    - データサイエンティスト：データと分析に焦点を当てたユーザー。
#   investors         - 投資家：会社の可能性に関心のある利害関係者。
#   jobSeekers        - 求職者：あなたの会社を調べている潜在的な従業員。
targetAudienceTypes:
  - developers

# ウェブサイトの規模：ウェブサイトには何ページあるべきですか？
# 利用可能なオプション（必要に応じてコメントを解除し、変更してください）：
#   small                - 小規模：3〜5の主要ページからなる簡潔なウェブサイト。
#   standard             - 標準：5〜10ページからなる包括的なサイト。
#   large                - 大規模：10ページ以上の広範なサイト。
websiteScale: standard

# カスタムルール：特定のページ生成ルールと要件を定義します
rules: 'フォーマルで技術的なトーンを維持する。マーケティング用語は避ける。実践的でステップバイステップの説明に焦点を当てる。'

# 用語集：プロジェクト固有の用語と定義を定義します
# glossary: "@glossary.md"  # 用語集の定義を含むMarkdownファイルへのパス

locale: en
# translateLanguages:  # ページを翻訳する言語のリスト
#   - zh  # 例：中国語翻訳
#   - en  # 例：英語翻訳

pagesDir: ./aigne-web-smith/pages  # 生成されたページを保存するディレクトリ
sourcesPath:  # 分析するソースコードのパス
  - ./docs/**/*.md
  - ./README.md
defaultDatasources:  # すべてのページに含まれるデフォルトのデータソース
  - ./media.md
# minImageWidth: この値（ピクセル単位）より幅の広い画像のみがページ生成に使用されます
media:
  minImageWidth: 800
```

## まとめ

`generate`コマンドと適切に定義された`config.yaml`ファイルを組み合わせることで、あなたの正確な仕様に合わせた完全なウェブサイトを効率的に作成できます。このプロセスは、サイト構造とコンテンツ作成の大変な作業を自動化するため、あなたは高品質なソース素材の提供に集中できます。

ウェブサイトを生成したら、次のステップはそれをオンラインで利用可能にすることです。

参考文献：
*   [ウェブサイトの公開](./core-tasks-publishing-your-website.md)