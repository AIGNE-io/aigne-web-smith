# ウェブサイトの生成

`aigne web generate` コマンドは、新しいウェブサイトを作成するためのコア機能です。AIを活用したプロセスを使用して、要件を解釈し、ウェブサイトの構造を計画し、必要なすべてのコンテンツとテンプレートファイルを生成します。プロセス全体は、サイトの目標と仕様を定義する設定ファイルによってガイドされます。

このガイドでは、`generate` コマンドの体系的な概要と、設定ファイルパラメータの詳細な解説を提供します。実践的なチュートリアルについては、[はじめてのウェブサイト](./getting-started-your-first-website.md) を参照してください。

## `generate` コマンド

生成プロセスは `generate` コマンドを使用して開始されます。その主な目的は、設定を読み取り、AI Agent と対話し、ローカルワークスペースにウェブサイトファイルをビルドすることです。

**使用法**

```bash コマンドライン icon=lucide:terminal
aigne web generate
```

**エイリアス**

利便性のために、より短いエイリアス `gen` または `g` を使用することもできます。

```bash コマンドライン icon=lucide:terminal
# これらのコマンドは 'aigne web generate' と同等です
aigne web gen
aigne web g
```

通常、入力ファイルを使用してコマンドに要件を渡します。これは `--input` フラグに続いて `@` 記号と設定ファイルのパスを指定して行います。

```bash コマンドライン icon=lucide:terminal
aigne web generate --input @my-website.yaml
```

## ウェブサイト設定ファイル

ウェブサイトを生成するには、YAML形式の設定ファイルを提供する必要があります。このファイルは設計図として機能し、ウェブサイトの目的、対象読者、スタイル、およびコンテンツ要件を定義します。AIはこの情報を使用して、サイトの構造、トーン、および機能について情報に基づいた決定を下します。

設定ファイルで利用可能なパラメータは次のとおりです：

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>作成したいウェブサイトの詳細な説明。これは最も重要なパラメータです。必要なページの種類（例：ホームページ、価格ページ、会社概要）、強調すべき主要な機能、スタイルやコンテンツに関する特定の要件など、明確で構造化された一連の指示を提供する必要があります。ルールが正確であるほど、AIはあなたのニーズに合わせてウェブサイトをより良く調整できます。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>ウェブサイトの対象読者の説明。例：`中小企業の経営者`、`ソフトウェア開発者`、`潜在的な投資家`。これはAIがコンテンツの言語、トーン、複雑さを適切に調整するのに役立ちます。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>ウェブサイトコンテンツの主要言語。現在サポートされている値は、英語の `en` と中国語の `zh` です。デフォルトは `zh` です。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>ウェブサイト全体の美観とトーンを定義します。例：`ビジネス`、`クリエイティブ`、`ミニマリスト`、`テクノロジー重視`。これはAIがレイアウト、画像、ライティングスタイルの選択に影響を与えます。</x-field-desc>
  </x-field>
  <x-field data-name="glossary" data-type="string" data-required="false">
    <x-field-desc markdown>ウェブサイト全体で一貫して使用すべき特定の用語、製品名、または専門用語のリスト。これにより、用語の正確性が保証されます。これを文字列として提供するか、`@<file-path>` 構文を使用してファイルから読み込むことができます。</x-field-desc>
  </x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>`true` に設定すると、コマンドは以前の生成で作成された既存のファイルをすべて無視し、すべてのページを最初から再生成します。これは、完全に新しく始めたい場合に便利です。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>Pages Kit インスタンスのプロジェクト ID。生成には必須ではありませんが、ここで提供することで、その後の公開プロセスを効率化できます。詳細は [ウェブサイトの公開](./core-tasks-publishing-your-website.md) を参照してください。</x-field-desc>
  </x-field>
</x-field-group>

## ステップバイステップの例

以下は、ウェブサイトを生成するための実践的なステップバイステップのプロセスです。

### ステップ1：設定ファイルの作成

まず、ウェブサイトを定義するための新しいYAMLファイルを作成します。この例では、`my-saas-website.yaml` という名前にします。

```yaml my-saas-website.yaml icon=lucide:file-text
rules: |
  Create a modern SaaS product website that includes:
  1. A homepage with product introduction and core features.
  2. A pricing page with a comparison table for different plans.
  3. A page for customer success stories and testimonials.
  4. A dedicated portal for technical documentation.
  5. A contact page with a support form and contact details.

  Requirements:
  - The style should be professional and business-oriented.
  - The content must highlight the product's advantages and unique selling points.
  - Include clear Call-to-Action (CTA) buttons to guide users toward a free trial.

targetAudience: Small to medium-sized business (SMB) owners and technical decision-makers.
locale: en
websiteStyle: business
```

### ステップ2：`generate` コマンドの実行

設定ファイルを保存したら、ターミナルを開き、`--input` フラグを使用してファイルへのパスを指定して `generate` コマンドを実行します。

```bash コマンドライン icon=lucide:terminal
aigne web generate --input @my-saas-website.yaml
```

これでAIが生成プロセスを開始します。ルールを分析し、サイト構造を計画し、各ページのコンテンツを作成します。ターミナルに進捗状況の更新が表示されます。このプロセスは、ページの数や要件の複雑さによって数分かかる場合があります。

### ステップ3：生成されたファイルの確認

コマンドが完了すると、生成されたウェブサイトファイルはプロジェクトのワークスペースに保存されます。これでファイルを調べて、AIによって作成された構造とコンテンツを確認できます。

## まとめ

`generate` コマンドは、テキストベースの簡単な要件一式を、完全に形成されたウェブサイトに変換する強力なツールです。成功の鍵は、YAML設定ファイルで明確かつ詳細な `rules` を定義することです。

ウェブサイトを生成した後、次の論理的なステップはそれを公開することです。その方法については、次のセクションに進んでください。

- **次へ**：[ウェブサイトの公開](./core-tasks-publishing-your-website.md)