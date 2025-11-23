# 設定リファレンス

`config.yaml` ファイルは、ウェブサイト生成の中心的なコントロールパネルです。この設定を理解することで、ページ構造からコンテンツのトーンまで、AI の出力のあらゆる側面をカスタマイズできます。このガイドでは、サイトを正確に変更するための、フィールドごとの完全なリファレンスを提供します。

## 概要

`config.yaml` ファイルは、AIGNE WebSmith の主要な設定ソースです。YAML 形式を使用して、AI Agent がウェブサイトを生成するために必要なすべてのパラメータを保存します。`generate` や `update` のようなコマンドを実行するたびに、WebSmith はこのファイルを読み取り、要件を理解します。

-   **ファイル名:** `config.yaml`
-   **場所:** `.aigne/web-smith/config.yaml` (プロジェクトのルートディレクトリからの相対パス)
-   **フォーマット:** YAML (UTF-8)

このファイルは、ウェブサイトの目的、ターゲットオーディエンス、コンテンツ生成ルール、ページ構造、多言語サポート、およびデプロイ設定を制御します。

### 設定の作成と更新

`config.yaml` ファイルは、初めて WebSmith を使用するときに自動的に作成されます。

**作成:**

ファイルは2つの方法で作成できます。

1.  **最初の生成時:** 新しいプロジェクトで `aigne web generate` を実行すると、対話型のウィザードが起動し、生成プロセスを開始する前に `config.yaml` ファイルを作成します。
2.  **個別:** `aigne web init` を実行すると、同じウィザードが起動し、サイトをすぐに生成することなく設定ファイルを作成します。

```sh aigne web init icon=lucide:terminal
aigne web init
```

![AIGNE WebSmith 設定ウィザード](../../../assets/images/web-smith-config.png)

**更新:**

設定は2つの方法のいずれかを使用して更新できます。

1.  **ファイルを直接編集:** テキストエディタで `.aigne/web-smith/config.yaml` を開き、フィールドを変更します。
2.  **対話型ウィザードを使用:** `aigne web init` を再度実行します。ウィザードは既存の設定を読み込み、更新をガイドします。

## 設定パラメータ

`config.yaml` のフィールドは、機能的なグループに整理されています。以下のセクションでは、各パラメータの詳細な説明を提供します。

### プロジェクトの基本情報

このグループは、プロジェクトのアイデンティティを定義します。これは、ブランディング、SEO、ソーシャルメディア共有に使用されます。

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true">
    <x-field-desc markdown>プロジェクトの表示名です。ページタイトル (`<title>`)、ナビゲーションバー、その他のブランディング要素に表示されます。読みやすさのため、50文字以内にしてください。</x-field-desc>
  </x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true">
    <x-field-desc markdown>SEO のメタディスクリプション (`<meta name="description">`) やソーシャル共有のプレビューに使用されるプロジェクトの簡単な説明です。150文字以内を目指してください。</x-field-desc>
  </x-field>
  <x-field data-name="projectLogo" data-type="string" data-required="false">
    <x-field-desc markdown>プロジェクトのロゴへの URL またはローカルパスです。サイトヘッダー、ファビコン、ソーシャルメディアのサムネイルに使用されます。完全な URL または相対パス (例: `./assets/logo.png`) をサポートします。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>WebSmith サービス内でプロジェクトを識別する一意の UUID です。自動的に生成され、変更すべきではありません。変更すると、プロジェクトがデプロイ履歴から切り離されてしまいます。</x-field-desc>
  </x-field>
  <x-field data-name="projectSlug" data-type="string" data-default="/" data-required="false">
    <x-field-desc markdown>サイトのデプロイ用の URL パスプレフィックスです。例えば、`/docs` というスラッグはサイトを `https://example.com/docs/` にデプロイします。</x-field-desc>
  </x-field>
  <x-field data-name="projectCover" data-type="string" data-required="false">
    <x-field-desc markdown>ソーシャルメディアのプレビュー (例: Open Graph) に使用されるカバー画像へのパスです。推奨サイズが 1200×630 ピクセルの高品質な画像を使用してください。</x-field-desc>
  </x-field>
</x-field-group>

### サイト戦略

これらのフィールドは、AI のための高レベルな戦略を定義し、サイトの目的、コンテンツのトーン、および全体的な構造に影響を与えます。

<x-field-group>
  <x-field data-name="pagePurpose" data-type="array" data-required="true">
    <x-field-desc markdown>ウェブサイトの主要な目標を定義し、ページ構造や使用されるコンポーネントに影響を与えます。可能な値には `landingPage`、`ecommerce`、`saas`、`portfolio`、`corporate`、`blog`、`nonprofit`、`education` が含まれます。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="array" data-required="true">
    <x-field-desc markdown>ターゲットオーディエンスを指定し、AI のトーン、複雑さ、および例に影響を与えます。可能な値には `customers`、`businessOwners`、`marketers`、`designers`、`developers`、`investors`、`jobSeekers`、`students`、`generalPublic` が含まれます。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="string" data-default="standard" data-required="false">
    <x-field-desc markdown>ページ数とナビゲーションの複雑さを制御します。オプションは次のとおりです: `singlePage` (1つのスクロール可能なページ)、`minimal` (2-6ページ)、`standard` (7-12ページ、推奨)、`comprehensive` (12ページ以上)、または `aiDecide` (AIに選択させる)。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>コンテンツの構造、トーン、スタイルに関する詳細な複数行の指示を AI に提供します。これは、特定の要件に合わせて生成プロセスを導くための重要なフィールドです。Markdown 形式をサポートします。</x-field-desc>
  </x-field>
</x-field-group>

### 言語

主要言語と翻訳用の追加言語を設定します。

<x-field-group>
  <x-field data-name="locale" data-type="string" data-default="en" data-required="false">
    <x-field-desc markdown>ウェブサイトのベースコンテンツの主要言語で、IETF 言語コード (例: `en`, `zh`, `ja`) を使用して指定します。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="array" data-required="false">
    <x-field-desc markdown>サイトを翻訳するための追加の言語コードのリストです。各言語コードは、サイト構造の完全に翻訳されたバージョンを生成します。</x-field-desc>
  </x-field>
</x-field-group>

### データソース

これらのフィールドは、AI Agent が参照資料として使用するコンテンツとデータを指定します。

<x-field-group>
  <x-field data-name="sourcesPath" data-type="array" data-required="true">
    <x-field-desc markdown>AI が分析するためのローカルディレクトリとファイルパスの配列です。**これはコンテンツ品質にとって最も重要なフィールドです**。AI はこれらのソースのみを参照として使用するためです。ドキュメント、README、その他の主要なプロジェクトファイルを含めてください。</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="array" data-required="false">
    <x-field-desc markdown>すべてのページのコンテキストに挿入されるファイルパスの配列です。これは、画像の場所と説明をリストした `media.md` ファイルのような共有データに便利です。</x-field-desc>
  </x-field>
</x-field-group>

### 出力とデプロイ

出力ディレクトリとデプロイ URL を設定します。

<x-field-group>
  <x-field data-name="pagesDir" data-type="string" data-default="./aigne/web-smith/pages" data-required="false">
    <x-field-desc markdown>生成されたサイトファイル (例: `page.yaml`) が保存される出力ディレクトリです。</x-field-desc>
  </x-field>
  <x-field data-name="appUrl" data-type="string" data-required="false">
    <x-field-desc markdown>ウェブサイトの最終的なデプロイ URL です。これは `publish` コマンドがデプロイターゲットを決定するために使用します。</x-field-desc>
  </x-field>
</x-field-group>

### メディアと表示

これらの設定は、画像などのメディアアセットの処理方法を制御します。

<x-field-group>
  <x-field data-name="media.minImageWidth" data-type="integer" data-default="800" data-required="false">
    <x-field-desc markdown>ウェブサイトで使用されると見なされる画像の最小幅 (ピクセル単位)。これにより、低品質または小さな画像を除外するのに役立ちます。</x-field-desc>
  </x-field>
</x-field-group>

### システム管理フィールド

これらのフィールドは通常 WebSmith によって管理され、手動で編集する必要はありません。

<x-field-group>
  <x-field data-name="lastGitHead" data-type="string" data-required="false">
    <x-field-desc markdown>最後の生成の Git コミットハッシュで、増分更新に使用されます。</x-field-desc>
  </x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false">
    <x-field-desc markdown>開発中に使用される一時変数です。</x-field-desc>
  </x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>開発中に使用される一時変数です。</x-field-desc>
  </x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false">
    <x-field-desc markdown>開発中に使用される一時変数です。</x-field-desc>
  </x-field>
</x-field-group>

## 変更の適用

`config.yaml` ファイルへの変更は自動的に適用されません。変更を反映させるには、適切なコマンドを実行する必要があります。必要なコマンドは、変更したフィールドによって異なります。

| フィールド                                                                  | 変更を適用するコマンド                                | 注記                                                                 |
| :-------------------------------------------------------------------------- | :----------------------------------------------------- | :------------------------------------------------------------------- |
| `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `locale`              | `aigne web clear && aigne web generate`                | これらはサイトを正しく再構築するために完全な再生成が必要です。          |
| `rules`, `media.minImageWidth`, `defaultDatasources`                        | `aigne web update`                                     | 完全な再生成なしに既存のコンテンツを更新します。                      |
| `sourcesPath`                                                               | `aigne web clear && aigne web generate` または `aigne web update` | 新しいソースは更新中にコンテンツを改善するために分析されます。       |
| `translateLanguages`                                                        | `aigne web translate`                                  | 更新されたリストに基づいて新しい言語バージョンを追加します。            |
| `projectName`, `projectDesc`, `projectLogo`, `projectCover`, `appUrl` | `aigne web publish`                                    | これらのフィールドは主に公開プロセス中に使用されます。                |

## 完全な設定例

以下は、AIGNE WebSmith プロジェクト自体の完全な `config.yaml` ファイルで、実際の構成例を示しています。

```yaml config.yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. コアメッセージング & 戦略: ユーザーに *何を* 伝えるかを定義する基礎的な要素。
  1. 重要な質問に「ファーストビュー」で答える: ユーザーが最初に目にする画面で、以下の質問に明確かつ即座に答えなければならない:
    * それは何か: 製品の簡潔な説明。
    * 誰のためのものか: 特定のターゲットオーディエンス (例: 個人創業者、小規模チーム)。
    * 何が違うのか: 独自の価値提案 (例: 「オープンで構成可能、エクスポート可能なコード、Agent ワークフロー」)。
    * 主要なアクション: ユーザーの主な目標に沿った、単一で明確なコールトゥアクション (CTA)。
  2. 証拠で信頼を築く: ユーザーがあなたの主張を信頼することを期待してはいけない。物語の早い段階で証拠を示すこと。
    * ただ語るのではなく、見せる: 最も強力な証拠はデモです。短い (30-45秒) 無音のビデオ ループや、このツールで構築された実際のサイトへのリンクを含めること。
    * 社会的証明を利用する: 「仕組み」を説明する前に、顧客のロゴ、説得力のあるデータポイント (例: 「50以上のチームが使用」)、または強力なユーザーの引用など、具体的な証拠を挿入すること。
  3. 明確なコールトゥアクション (CTA) を定義する:
    * オーディエンスに合わせて CTA を調整する: プライマリ CTA は、ターゲットユーザーに取ってもらいたい主要なアクションであるべきです (例: 「私のサイトを生成する」)。
    * CTA の優先順位付け: 二次的なアクション (「GitHubで見る」など) は、特に非開発者オーディエンスに対しては、目立たない位置 (三次ボタンやフッターリンク) に配置すること。
    * モバイルでの持続的な CTA を維持する: モバイルでは、単一のプライマリ CTA が常に表示されるようにすること。
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
pagesDir: .aigne/web-smith/pages
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 600
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
checkoutId: ""
projectCover: .aigne/web-smith/cover.png
shouldSyncAll: ""
navigationType: ""
appUrl: https://mhevtaeg.user.aigne.io
```

## まとめ

`config.yaml` ファイルをマスターすることで、ウェブサイトの生成プロセスを完全に制御できます。プロジェクトの基本情報、サイト戦略、データソースを慎重に定義することで、高品質で関連性の高い、カスタマイズされたウェブサイトを生成するように AI を導くことができます。

より実践的なガイダンスについては、以下のガイドを参照してください。

<x-cards data-columns="3">
  <x-card data-title="ウェブサイトの作成" data-icon="lucide:rocket" data-href="/guides/create-website">最初のサイトをゼロから生成するための完全なワークフローを学びます。</x-card>
  <x-card data-title="資料の準備" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">最良の結果を得るためにソースドキュメントを準備する方法を理解します。</x-card>
  <x-card data-title="トラブルシューティング" data-icon="lucide:wrench" data-href="/reference/trouble-shooting">一般的な設定や生成の問題に対する解決策を見つけます。</x-card>
</x-cards>