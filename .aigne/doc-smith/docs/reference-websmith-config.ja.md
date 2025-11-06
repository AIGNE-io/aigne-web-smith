# WebSmith 設定

## 設定ファイルとは？

### 基本

`config.yaml` は WebSmith のコア設定ファイルです。YAML 形式を使用し、WebSmith がウェブサイトを生成するために必要なすべてのパラメータを格納します。

**ファイル詳細**:
- **ファイル名**: `config.yaml` (固定名)
- **場所**: `.aigne/web-smith/config.yaml` (プロジェクトルートからの相対パス)
- **フォーマット**: YAML (UTF-8 エンコーディング)

---

## 設定ファイルの役割は？

### コア機能

設定ファイルは WebSmith の中心的なパラメータキャリアです。AI agent が `generate` コマンドを実行するたびに、このファイルを読み込み、その設定に従ってサイトの構造とコンテンツを生成します。

主な目的:
- サイトのタイプとターゲットオーディエンスを定義する
- コンテンツ生成戦略とライティングスタイルを制御する
- サイトの規模とページ構造を決定する
- 多言語サポートを設定する
- デプロイパラメータを設定する

### 機能グループ

フィールドは機能ごとに以下のようにグループ化されています:

#### グループ1: プロジェクトの基本情報

ブランディングとSEOのための基本的な識別子と表示情報。

フィールド: `projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

目的: 名前、説明、ロゴ、識別子などを定義します。ページのタイトル、ナビゲーションメニュー、SEOメタタグ、ソーシャルシェアリングに影響します。

#### グループ2: サイト戦略

サイトのタイプ、トーン、規模、生成戦略を定義します。これにより、AIがコンテンツをどのように生成するかが制御されます。

フィールド: `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

目的:
- `pagePurpose`: サイトのタイプ（例: ランディングページ、eコマース、SaaS）を定義し、コンポーネントとコンテンツ構成に影響します
- `targetAudienceTypes`: オーディエンス（例: エンドユーザー、開発者、ビジネスオーナー）を定義し、AIのトーン、複雑さ、使用例に影響します
- `websiteScale`: サイトの規模（単一ページか複数ページか）を定義し、ページ数を制御します
- `rules`: 構造、コンテンツ、スタイルに関する詳細なガイダンス

#### グループ3: 言語

多言語サイトをサポートするために言語バージョンを設定します。

フィールド: `locale`, `translateLanguages`

目的: プライマリ言語と翻訳対象を定義します。各言語で完全なサイト構造が生成されます。

#### グループ4: コンテンツソース

AIがページ生成のための資料や参照として分析するコンテンツソースを指定します。

フィールド: `sourcesPath`, `defaultDatasources`

目的:
- `sourcesPath`: AI分析用のディレクトリまたはファイル（Markdown、YAML、画像など）。これはコンテンツの品質、正確性、関連性を直接決定します。
- `defaultDatasources`: コマンド実行時にすべてのページに注入される共通のデータソース（例: 画像の場所と説明を含む `media.md`）

#### グループ5: 出力とデプロイ

出力パスとデプロイパラメータを設定します。

フィールド: `pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

目的:
- `pagesDir`: 生成されたページファイルが書き込まれる場所
- `appUrl`: デプロイされたサイトのURL。リンクやSEOに影響します
- `checkoutId`, `shouldSyncAll`, `navigationType`: 開発中に使用される一時的な変数。通常、管理する必要はありません

#### グループ6: メディアと表示

画質と関連する表示パラメータを設定します。

フィールド: `media.minImageWidth`, `lastGitHead`

目的:
- `media.minImageWidth`: 低品質なアセットを除外するための画像の最小幅
- `lastGitHead`: 差分更新に使用される最後のGitコミットID

---

## 設定ファイルの作成方法

### 生成方法

以下のコマンドを使用します:

```bash
aigne web init
```

このコマンドは、以下の項目を入力するための対話型ウィザードを起動します:

- サイトタイプ (`pagePurpose`): 主な目的（複数選択可）
- ターゲットオーディエンス (`targetAudienceTypes`): サイトの対象者（複数選択可）
- サイト規模 (`websiteScale`): ページ数
- プライマリ言語 (`locale`)
- 翻訳言語 (`translateLanguages`) (複数選択可)
- 出力ディレクトリ (`pagesDir`)
- ソースパス (`sourcesPath`) (複数入力可)
- カスタムルール (`rules`) (任意)

完了後、ファイルは `.aigne/web-smith/config.yaml` に保存されます。

### 実際の設定例

以下は AIGNE WebSmith プロジェクトの実際の設定です:

```yaml config.yaml icon=logos:yaml
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
  ### I. Core Messaging & Strategy: Foundational elements that define *what* you communicate to the user.
  1. Answer Critical Questions "Above the Fold": The very first screen a user sees must clearly and immediately answer:
    * What it is: A concise description of the product.
    * Who it's for: The specific target audience (e.g., solo founders, small teams).
    * Why it's different: Your unique value proposition (e.g., "open, composable, exportable code, agent workflow").
    * Primary Action: A single, clear Call to Action (CTA) that aligns with the user's main goal.
  2. Establish Credibility with Proof: Don't expect users to trust your claims. Show them proof early in the narrative.
    * Show, Don't Just Tell: The most powerful proof is a demo. Include a short (30-45s) silent video loop or a link to a real site built with the tool.
    * Use Social Proof: Before explaining "How it Works," insert tangible evidence like a customer logo, a compelling data point (e.g., "Used by 50+ teams"), or a strong user quote.
  3. Define a Clear Call to Action (CTA):
    * Align CTA with the Audience: The primary CTA should be the main action you want your target user to take (e.g., "Generate My Site").
    * Prioritize CTAs: Relegate secondary actions (like "See it on GitHub") to less prominent positions (tertiary buttons or footer links), especially for non-developer audiences.
    * Maintain a Persistent Mobile CTA: On mobile, a single primary CTA should always be visible.
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

### フィールドごとの詳細な説明

上記の実設定に基づき、各フィールドの役割を説明します:

#### プロジェクトの基本情報

`projectName`
- 目的: ページの `<title>`、ナビゲーション、サイトブランディングに表示される名前
- 現在の値: `AIGNE WebSmith`
- 型: string
- 影響:
  - 名前を変更すると、ページ全体のタイトルとナビゲーションラベルが更新されます
  - 読みやすさとSEOのため、50文字以内に簡潔に保ちます
- 適用方法: 変更後、`aigne web publish` を実行します

`projectDesc`
- 目的: SEOメタタグ (`<meta name="description">`) およびソーシャルシェアリング用のプロジェクト説明
- 現在の値: `"AI-powered website generation tool built on the AIGNE Framework"`
- 型: string
- 影響:
  - ページやソーシャルシェアのメタディスクリプションを更新します
  - 検索スニペットのため、約150文字以内に保ちます
  - SEOのために主要な用語を含めます
- 適用方法: 変更後、`aigne web publish` を実行します

`projectLogo`
- 目的: ヘッダーナビゲーション、ファビコン、ソーシャルサムネイル用のロゴ
- 現在の値: `https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- 型: string (URLまたはパス)
- 影響:
  - URL/パスを切り替えると、サイト全体のロゴが更新されます
  - サポート形式: HTTP/HTTPS URLまたは相対パス（例: `./assets/images/logo.svg`）
  - 鮮明な表示のためにPNGまたはSVGを推奨します
- 適用方法: 変更後、`aigne web publish` を実行します

`projectId`
- 目的: WebSmithサービスがデプロイ、履歴、データソースを関連付けるために使用する一意のプロジェクト識別子
- 現在の値: `pg4d0000-0000-4000-a000-000000000000` (UUID)
- 型: string (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- 影響:
  - 新しいUUIDに変更すると、システムにとってこれは新しいプロジェクトとなり、以下の可能性があります:
    - 以前のデプロイリンクとの関連付けが壊れる
    - プロジェクト履歴へのリンクが失われる
    - データソースの関連付けが失われる
- 適用方法: 変更後、`aigne web publish` を実行します

`projectSlug`
- 目的: デプロイパスと内部リンクに影響するURLパスプレフィックス
- 現在の値: `/` (ルート)
- 型: string (URLパス)
- 影響の例:
  - `/`: サイトはルートに配置されます。例: `https://example.com/`
  - `/portfolio`: サイトは `https://example.com/portfolio/` に配置されます
  - `/docs`: サイトは `https://example.com/docs/` に配置されます
  - 変更すると、すべての内部リンクとデプロイパスが更新されます
- 適用方法: 変更後、`aigne web publish` を実行します

`projectCover`
- 目的: プレビューやソーシャルシェアリング（Open Graph, Twitter Cardなど）用のサイトカバー画像
- 現在の値: `.aigne/web-smith/cover.png`
- 型: string (ファイルパス)
- 影響:
  - パスを変更すると、ソーシャルシェアリングのプレビュー画像が更新されます
  - 高品質な画像（少なくとも1200×630）を使用してください
  - フォーマット: PNG, JPG/JPEG, WebPなど
- 適用方法: 変更後、`aigne web publish` を実行します

#### サイト戦略

`pagePurpose`
- 目的: 主な目的を定義し、AI戦略とページ構造に直接影響します
- 現在の値: `[landingPage]` (配列)
- 型: array (複数選択可)
- オプションと効果:
  - `landingPage` (現在): コンバージョン重視のランディングページ。ヒーロー、機能、CTA、FAQなどを生成します。
  - `ecommerce`: オンラインストア。カタログ、カート、チェックアウト、レビューなどを生成します。
  - `saas`: SaaS製品サイト。機能、価格、デモ、オンボーディングなどを生成します。
  - `portfolio`: ポートフォリオサイト。ビジュアルレイアウト、ギャラリー、ケーススタディなどを生成します。
  - `corporate`: 企業サイト。会社概要、サービス、チーム、連絡先などを生成します。
  - `blog`: ブログ。コンテンツ構造、SEO、共有、アーカイブなどを生成します。
  - `nonprofit`: 非営利団体。ミッション、寄付フロー、ボランティア登録などを生成します。
  - `education`: 教育。コースリスト、学習パス、進捗追跡などを生成します。

`targetAudienceTypes`
- 目的: ターゲットオーディエンスを定義し、トーン、複雑さ、使用例の選択に直接影響します
- 現在の値: `[customers]` (配列)
- 型: array (複数選択可)
- オプションと効果:
  - `customers` (現在): エンドユーザー/顧客。平易な言葉で、使いやすさと成果を強調します。信頼性のシグナルとユーザーストーリーを追加します。
  - `businessOwners`: ビジネスオーナー/創業者。ROIとビジネス価値に焦点を当てます。プロフェッショナルなトーンで、ビジネスケースやリターン分析を含みます。
  - `marketers`: マーケティングチーム。KPI主導でブランドに焦点を当てます。マーケティングツールや分析を含みます。
  - `designers`: デザイナー。ビジュアルを重視し、デザインショーケースを提供します。美学とインスピレーション。デザインケースやビジュアルツールを含みます。
  - `developers`: 開発者/技術ユーザー。技術的な詳細、コード例、APIドキュメント。正確性と実装に焦点を当てます。
  - `investors`: 投資家/ステークホルダー。成長指標、市場機会、財務見通し。事業計画と市場データ。
  - `jobSeekers`: 求職者。文化、成長、福利厚生に焦点を当てます。求人情報と企業文化。
  - `students`: 学生/学習者。教育的なトーン、ステップバイステップのガイダンス、進捗追跡。チュートリアルと教材。
  - `generalPublic`: 一般/混合オーディエンス。分かりやすい言葉、複数のエントリーポイント、幅広いアピール。
- 適用方法: 変更後、`aigne web clear && aigne web generate` を実行します

`websiteScale`
- 目的: サイトの規模を定義し、ページ数とナビゲーションの複雑さを制御します
- 現在の値: `singlePage`
- 型: string (単一選択)
- オプションと効果:
  - `singlePage` (現在): 1ページのサイト。すべてのセクションが単一のスクロール可能なページにあります（ヒーロー、機能、FAQ、CTAなど）。迅速な立ち上げ/MVPに適しています。
  - `minimal`: 2〜6ページ。ホーム、会社概要、サービス/製品、お問い合わせなど。小規模ビジネス/シンプルなサイト。
  - `standard`: 7〜12ページ。minimalの内容に加え、ポートフォリオ/ブログ、チーム、FAQ、価格など。プロフェッショナルなサイト、ポートフォリオ、小規模eコマース（推奨）。
  - `comprehensive`: 12ページ以上。standardの内容に加え、詳細なサービスページ、ケーススタディ、リソースセンターなど。大規模/複雑/コンテンツ豊富なサイト。
  - `aiDecide`: AIがタイプ、オーディエンス、リポジトリ分析に基づいて規模を決定します。ビジネスニーズ、コンテンツ量、メンテナンス能力を考慮します。
- 適用方法: 変更後、`aigne web clear && aigne web generate` を実行します

`rules`
- 目的: 構造、コンテンツ、スタイルに関する詳細な生成ガイダンス（Markdown）。これはAIにとって最も重要なガイダンスであり、品質とUXに直接影響します。
- 現在の値: 詳細なガイダンスを含む複数行のブロック（上記の例を参照）。内容は以下の通りです:
  - コアメッセージングと戦略
  - ファーストビューで重要な質問に答える
  - 証明による信頼性の確立
  - 明確なコールトゥアクションの定義
- 型: 複数行の文字列 (Markdownサポート)
- 影響:
  - rulesが空またはまばらな場合: AIはデフォルトにフォールバックし、ニーズに合わない可能性があります
  - rulesが詳細な場合: AIはあなたのガイダンスに従って構造、構成、トーンを決定します
  - 変更: AIは新しいルールに基づいて再生成し、セクションや表現に影響します
- 適用方法: 変更後、`aigne web clear && aigne web generate` または `aigne web update` を実行します

#### 言語

`locale`
- 目的: 基本コンテンツ生成に使用されるプライマリサイト言語
- 現在の値: `en`
- 型: string
- サポートされている言語コード: `en`, `zh`, `zh-TW`, `ja`, `ko`, `fr`, `de`, `es`, `pt`, `ru`, `it`, `ar`などの標準IETFコード
- 適用方法: 変更後、`aigne web clear && aigne web generate` を実行します

`translateLanguages`
- 目的: 翻訳対象言語のリスト。各言語が完全なサイト構造になります
- 現在の値: `[zh, zh-TW, ja]`
- 型: array (複数選択可)
- サポートされているコード: `locale`と同じセット（`locale`自体を含んではいけません）
- 言語ごとの効果:
  - `zh`: 完全な簡体字中国語サイトを生成します
  - `zh-TW`: 完全な繁体字中国語サイトを生成します
  - `ja`: 完全な日本語サイトを生成します
  - その他も同様に動作し、それぞれが別のサイト構造を生成します
- 適用方法: 変更後、`aigne web translate` を実行します

#### コンテンツソース

`sourcesPath`
- 目的: WebSmith AI agent が分析するディレクトリ/ファイル（配列）。AIはこれらをサイトコンテンツ生成の唯一の参照として使用します。これは品質、正確性、関連性を直接決定します。
- 現在の値:
  ```yaml
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
  ```
- 型: array (パス)
- 重要性:
  - コンテンツ品質の主要な決定要因: これらのソースのみが参照として使用されます
  - 推奨事項:
    - 主要なドキュメントとreadmeを含める
    - 重要なプロジェクト情報源を含める
    - ソースを正確かつ最新の状態に保つ
    - プロジェクトの状態に合わせて定期的に更新する
- 影響:
  - パスを追加: AIがより多くの資料を分析し、品質が向上することが多い
  - パスを削除: AIはその分析を停止し、情報を見逃す可能性がある
  - パスの種類:
    - ディレクトリ（例: `./assets/documents`）: 再帰的に分析されます
    - ファイル（例: `./README.md`）: 直接分析されます
    - サポートされているタイプ: `.md`, `.yaml`/`.yml`, `.json`, `.txt`など
    - 画像ディレクトリ: 画像は分析されませんが、参照できます
- 適用方法: 変更後、`aigne web clear && aigne web generate` または `aigne web update` を実行します

`defaultDatasources`
- 目的: すべてのページコンテキストに自動的に注入されるデータソース（例: メディア、連絡先情報）。これらはコマンドが実行されるたびに追加されますが、すべてのリソースが完全にインライン化されるわけではなく、`media.md`のようなリソースの説明に適しています。
- 現在の値: `[./media.md]`
- 型: array (ファイルパス)
- 影響:
  - 追加: 新しく含まれる共通コンテンツ（ブランド情報、共有スニペットなど）
  - 削除: 注入されなくなります
  - 適しているもの: `media.md`（画像の場所と説明）、共有の連絡先/ブランド情報
  - サポート形式: `.md`, `.yaml`/`.yml`, `.json`
- 適用方法: 変更後、`aigne web clear && aigne web generate` または `aigne web update` を実行します

#### 出力とデプロイ

`pagesDir`
- 目的: 生成されたサイトファイル（例: `page.yaml`, `_navigations.yaml`）の出力ディレクトリ
- 現在の値: `.aigne/web-smith/pages`
- 型: string (パス)
- 影響:
  - 変更（例: `./output/pages`へ）すると、将来の出力がそこに移動します
  - 移植性のために相対パスを推奨します
  - ディレクトリが存在しない場合は自動的に作成されます
- 適用方法: 将来の生成は新しいディレクトリに書き込まれます

`appUrl`
- 目的: サイトのデプロイURL。サイトがどこに公開されるかを決定します
- 現在の値: `https://mhevtaeg.user.aigne.io`
- 型: string (URL)
- 影響:
  - 別のURLに変更すると、新しいターゲットに公開されます
  - プロトコルを含める必要があります。ない場合は `https://` が自動的に追加されます
  - 変更を避けるため、最終的なドメインがわかってから設定してください
- 適用方法: `aigne web publish` でのみ使用されます。他のコマンドはこれを無視します

`checkoutId`
- 目的: 一時的な開発変数。便宜上保存されるだけです
- 現在の値: `""`
- 型: string
- 注意: システムによって管理されます。通常、設定する必要はありません

`shouldSyncAll`
- 目的: 一時的な開発変数。便宜上保存されるだけです
- 現在の値: `""`
- 型: string (`"true"` または `""`)
- 注意: システムによって管理されます。通常、設定する必要はありません

`navigationType`
- 目的: 一時的な開発変数。便宜上保存されるだけです
- 現在の値: `""`
- 型: string
- 注意: システムによって管理されます。通常、設定する必要はありません

#### メディアと表示

`media.minImageWidth`
- 目的: 低品質の画像をフィルタリングするための画像の最小幅（px）。これより幅の広い画像のみが使用されます
- 現在の値: `600`
- 型: integer (ピクセル)
- 効果:
  - 低い (400–600): より多くの画像が許可されますが、品質が低くなるリスクがあります。迅速な立ち上げ向け。
  - 中程度 (600–800): 品質と量のバランスが取れています。デフォルトの推奨値。
  - 高い (800–1000): 高品質ですが、使用できる画像は少なくなります。ポートフォリオ/プレミアムブランド向け。
  - 非常に高い (1000+): 最高のビジュアル品質ですが、使用可能な画像は非常に少なくなります。
- 適用方法: 変更後、`aigne web clear && aigne web generate` または `aigne web update` を実行します

#### その他の設定

(現在、追加のフィールドはありません。)

`lastGitHead`
- 目的: 生成時の最後のGitコミットID（差分更新用）
- 現在の値: `c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- 型: string (Gitコミットハッシュ)
- 効果:
  - 各生成後に自動的に維持されます
  - 変更されたファイルを検出するために使用されます。手動での編集は差分更新の動作に影響する可能性があります
- 注意: 通常はシステム管理です。必要な場合にのみ、有効なハッシュで編集してください

---

## フィールド一覧

| フィールド | 型 | デフォルト | 例 | 適用コマンド |
|---|---|---|---|---|
| `projectName` | string | `""` | `"My Project"` | `publish` |
| `projectDesc` | string | `""` | `"AI-powered website tool"` | `publish` |
| `projectLogo` | string | `""` | `"https://example.com/logo.png"` | `publish` |
| `projectId` | string | UUID | `"pg4d0000-0000-4000-a000-000000000000"` | `publish` |
| `projectSlug` | string | `"/"` | `"/"` | `publish` |
| `projectCover` | string | `""` | `"./assets/cover.png"` | `publish` |
| `pagePurpose` | array | `[]` | `["landingPage"]` | `clear && generate` |
| `targetAudienceTypes` | array | `[]` | `["customers"]` | `clear && generate` |
| `websiteScale` | string | `"standard"` | `"standard"` | `clear && generate` |
| `rules` | string | `""` | `"### Page Structure\n1. Hero section"` | `update` |
| `locale` | string | `"en"` | `"en"` | `clear && generate` |
| `translateLanguages` | array | `[]` | `["zh", "ja"]` | `translate` |
| `pagesDir` | string | `"./aigne/web-smith/pages"` | `"./aigne/web-smith/pages"` | `generate` |
| `sourcesPath` | array | `[]` | `["./README.md", "./docs"]` | `generate` |
| `defaultDatasources` | array | `["./media.md"]` | `["./media.md"]` | `update` |
| `media.minImageWidth` | integer | `800` | `800` | `update` |
| `appUrl` | string | `""` | `"https://example.com"` | `publish` |
| `lastGitHead` | string | `""` | `"c4a4d3db..."` | 自動 |
| `checkoutId` | string | `""` | `""` | 内部 |
| `shouldSyncAll` | string | `""` | `""` | 内部 |
| `navigationType` | string | `""` | `""` | 内部 |

**注:** 許可される値と詳細な説明については、以下の[フィールドごとの詳細な説明](#field-by-field-explanation)セクションを参照してください。

---

## コピー＆ペースト用サンプル

### 最小構成例: 単一ページ、英語のみ

単一ページの英語ウェブサイトのための最小構成です:

```yaml
configVersion: 1
projectName: My Project
projectDesc: "A simple landing page"
projectLogo: ""
projectId: pg4d1000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: ""
locale: en
translateLanguages: []
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: ""
```

**コマンドシーケンス:**
```bash
aigne web generate
```

---

### 標準例: 複数ページ、英語 + 日本語

英語と日本語の複数ページウェブサイトのための標準構成です:

```yaml
configVersion: 1
projectName: My Project
projectDesc: "AI-powered website generation tool"
projectLogo: https://example.com/logo.png
projectId: pg4d2000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
  - saas
targetAudienceTypes:
  - customers
  - developers
websiteScale: standard
rules: |
  ### Page Structure Requirements
  1. Hero section must include clear value proposition
  2. Use positive, confident tone
  3. Include concrete case data
locale: en
translateLanguages:
  - ja
pagesDir: ./aigne/web-smith/pages
sourcesPath:
  - ./README.md
  - ./docs
  - ./CHANGELOG.md
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 800
appUrl: https://example.com
```

**コマンドシーケンス:**
```bash
aigne web generate
aigne web translate
aigne web publish
```

**注:** バージョンは破壊的変更があった場合に上がります。その際は移行ノートが提供されます。

---

## 問題が発生した場合

ウェブサイトの生成に失敗したり、予期しない結果になったりした場合は、以下の復旧方法を使用してください:

- **Git revert:** バージョン管理を使用している場合は、以前の正常な設定に戻します:
  ```bash
  git revert HEAD
  ```

- **クリーンな再生成:** 生成されたすべてのファイルをクリアし、ゼロから再生成します:
  ```bash
  aigne web clear && aigne web generate
  ```

これにより、クリーンな状態に戻し、現在の設定に基づいてウェブサイトを再生成します。

---

## 設定ファイルを変更するタイミング

### 機能の調整

シナリオ: 単一ページから複数ページへのアップグレード
- トリガー: 単一ページから本格的なサイトに拡張する必要がある
- フィールド: `websiteScale`
- 例:
```yaml
# 変更前
websiteScale: singlePage

# 変更後
websiteScale: standard
```
- 適用:
  - まだ何も生成していない場合: `aigne web generate` を実行
  - すでに生成済みの場合: `aigne web clear` を実行してから `aigne web generate` を実行

シナリオ: サイトタイプの変更
- トリガー: 製品のポジショニングが変わる（例: SaaS → eコマース）
- フィールド: `pagePurpose`
- 例:
```yaml
# 変更前
pagePurpose:
  - saas

# 変更後
pagePurpose:
  - ecommerce
```
- 適用: シナリオ1と同じ

シナリオ: ターゲットオーディエンスの調整
- トリガー: オーディエンスがシフトする（例: 消費者 → ビジネス）
- フィールド: `targetAudienceTypes`
- 例:
```yaml
# 変更前
targetAudienceTypes:
  - customers

# 変更後
targetAudienceTypes:
  - businessOwners
  - developers
```
- 適用: シナリオ1と同じ

### 適応

シナリオ: 新しいコンテンツソースの追加
- トリガー: AIが分析すべき新しいドキュメントやコンテンツが追加された。パスが追加されないと、後の `aigne web generate` 実行時にそれを読み取ることができません。
- フィールド: `sourcesPath`
- 例:
```yaml
# 変更前
sourcesPath:
  - ./assets/documents

# 変更後: 新しいソースを追加
sourcesPath:
  - ./assets/documents
  - ./docs/api
  - ./content/blog
```
- 適用: プロンプトが入力される際に `aigne web generate` 中に読み込まれます

### 修正

シナリオ: 画像の品質が不十分
- トリガー: 出力に低品質の画像が表示される
- フィールド: `media.minImageWidth`
- 例:
```yaml
# 変更前: 最小600px
media:
  minImageWidth: 600

# 変更後: 最小1000px
media:
  minImageWidth: 1000
```
- 適用: `aigne web update` または `aigne web generate`

シナリオ: 生成されたコンテンツが期待と異なる
- トリガー: トーン/構造が希望通りでない
- フィールド: `rules`
- 例:
```yaml
# 変更前: 空またはまばら
rules: ""

# 変更後: 詳細なガイダンス
rules: |
  ### ページ構造の要件
  1. ファーストビューには以下を含めること:
     * 明確な製品ヘッドライン
     * 簡潔な説明（2文以内）
     * 主要なコールトゥアクション

  2. コンテンツの構成:
     * ポジティブで自信のあるトーン
     * 具体的なケースデータを含める
     * 過度なマーケティング専門用語を避ける
```
- 適用:
  - `aigne web update` によって読み込まれます
  - プロンプトが入力される際に `aigne web generate` 中に読み込まれます
  - 注: rulesは各プロンプトと共に送信されます

### 多言語対応

シナリオ: 新しい言語の追加
- フィールド: `translateLanguages`
- 例:
```yaml
# 変更前: 中国語 + 英語のみ
locale: zh
translateLanguages:
  - en

# 変更後: フランス語とドイツ語を追加
locale: zh
translateLanguages:
  - en
  - fr
  - de
```
- 適用: `aigne web translate` または `aigne web update`

シナリオ: プライマリ言語の変更
- フィールド: `locale`
- 例:
```yaml
# 変更前: 中国語がプライマリ
locale: zh
translateLanguages:
  - en

# 変更後: 英語がプライマリ
locale: en
translateLanguages:
  - zh
```
- 適用: `aigne web clear` を実行してから `aigne web generate` を実行

### 基本情報の変更

シナリオ: プロジェクトの基本情報を更新
- フィールド: `projectName`, `projectDesc`, `projectLogo`, `projectCover`
- 例:
```yaml
# 変更前
projectName: "Old Project Name"
projectDesc: "Old description"
projectLogo: "Old Logo URL"

# 変更後
projectName: "New Project Name"
projectDesc: "New description"
projectLogo: "New Logo URL"
projectCover: "./assets/images/new-cover.png"
```
- 適用: `aigne web publish` (他のコマンドはこれらを無視します)

シナリオ: 外部デプロイメントとの統合
- フィールド: `appUrl`
- 例:
```yaml
# 変更前
appUrl: ""

# 変更後
appUrl: https://your-app.user.aigne.io
```
- 適用: `aigne web publish` のみ。`appUrl` がターゲットプラットフォームを決定します

### 変更の確認

- 生成されたページファイルをチェックして、更新された値が存在することを確認します。例えば、`projectName` を変更した後、新しい名前が期待される場所に表示されていることを確認してください。

---

## ファイルが壊れた場合

### YAMLフォーマットエラー

シナリオ: 全角（中国語）コロンの使用
```yaml
projectName： "My Project"  # 誤り: 全角コロン
```
正しい形式:
```yaml
projectName: "My Project"  # 正しい: 半角コロン
```
影響:
- YAMLの解析に失敗し、`aigne web generate` がエラーを表示します
- コマンドは中止され、サイトは生成されません
復旧:
1. すべての全角コロンを半角の `:` に置き換えます
2. `aigne web generate` を再実行します

シナリオ: 存在しないフィールド
```yaml
projectName: "My Project"
unknownField: "some value"
```
影響:
- CLIは認識されないフィールドをエラーなしで無視します
- ファイルは解析されますが、フィールドは無視され、生成には影響しません
- 出力が期待通りか確認する必要があります
復旧:
1. 生成された出力を確認します
2. このガイドで有効なフィールド名を確認します
3. 不明なフィールドを削除します

シナリオ: インデントエラー
```yaml
pagePurpose:
- landingPage  # 誤り: インデントがありません
targetAudienceTypes:
  - customers  # 正しい: 2スペースのインデント
```
正しい形式:
```yaml
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
```
影響:
- YAMLの解析に失敗し、構造が誤って読み取られます
- 値が失われたり、誤解釈されたりする可能性があります
復旧:
1. スペースのみを使用し（タブは使用しない）、一貫したインデント（通常は2スペース）を使用します
2. 配列が正しいインデントで `-` を使用していることを確認します

シナリオ: 主要なフィールドの削除
```yaml
# 誤ってprojectNameを削除
projectDesc: "Description"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
影響:
- タイトルが空になるか、デフォルト値が使用される可能性があります
- 一部の機能が意図通りに動作しない可能性があります
- 解析は成功しますが、出力の品質が低下します
復旧:
1. 可能であればGit履歴から復元します
2. `aigne web init` を実行して再生成し、その後カスタマイズをマージします
3. このガイドに従って、不足している必須フィールドを埋めます

シナリオ: 値の型が間違っている
`pagePurpose` は文字列ではなく、配列でなければなりません:
```yaml
# 誤り
pagePurpose: landingPage

# 正しい
pagePurpose:
  - landingPage
```
`translateLanguages` は文字列ではなく、配列でなければなりません:
```yaml
# 誤り
translateLanguages: en

# 正しい
translateLanguages:
  - en
```
影響:
- 型が間違っている場合、デフォルト値が使用されることがあります
- AIが値を正しく読み取れない可能性があります
- 出力が期待と一致しない可能性があります
復旧:
1. このガイドで正しいフォーマットを確認します
2. `-` を使用した適切なYAML配列構文を使用します
3. 再生成して確認します

### 検出と復旧

方法1: 生成中に検出
- 編集後、`aigne web generate` を実行します
- システムはYAML/フォーマットエラーを役立つメッセージと共に報告します

方法2: バックアップから復元
- Gitを使用している場合は、履歴から復元します
- 手動バックアップを使用している場合:
```bash
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

方法3: ファイルの再生成
- 修復できない場合は、`aigne web init` を実行して再作成します。カスタム値をマージできるように、古い `config.yaml` を先にバックアップしてください。

### 製品の堅牢性

WebSmithの動作に基づくと:
1. ファイルが見つからない場合: `aigne web init` を実行するよう、明確なエラーとガイダンスが表示されます
2. YAML解析失敗: クラッシュすることなく、分かりやすいエラーが表示されます
3. 不明なフィールド: 静かに無視され、生成は続行されます。結果は手動で確認してください
4. 値の型が間違っている場合: デフォルト値が使用される可能性があり、解析は続行されます
5. オプションのフィールドがない場合: デフォルト値が適用されます（例: `locale` は "en" がデフォルト）

### 予防策

1. 設定ファイルにバージョン管理を使用する
2. 大規模な編集の前にバックアップを作成する
3. CLI (`aigne web init`) による編集を優先し、手動でのフォーマットエラーを減らす
4. 編集後に `aigne web generate` を実行して変更を検証する

---

## デフォルト値と優先順位

### 明示的なデフォルト値

以下のフィールドには明示的なデフォルト値があります:

- `locale`: デフォルトは `"en"` (英語)
- `websiteScale`: デフォルトは `"standard"` (7-12ページ)
- `pagesDir`: デフォルトは `"./aigne/web-smith/pages"`
- `translateLanguages`: デフォルトは `[]` (空の配列、翻訳なし)
- `media.minImageWidth`: デフォルトは `800` (ピクセル)

### 優先順位のルール

設定の優先順位は以下の順序に従います:

1. **明示的な設定値**が最も高い優先度を持ちます
2. **`rules` は指定された場合、デフォルトを上書きします**。`rules` が空の場合、AIはデフォルトにフォールバックします
3. **値がない場合はデフォルトにフォールバックします**。フィールドが指定されていないか空の場合、システムはそのデフォルト値を使用します

### i18nのフォールバック動作

多言語サイトを生成する場合:

- **プライマリ言語 (`locale`)**: 常にコンテンツ生成の基本言語として使用されます
- **翻訳言語 (`translateLanguages`)**: コンテンツはプライマリ言語から各ターゲット言語に翻訳されます
- **翻訳が見つからない場合のフォールバック**: 翻訳が失敗した場合、システムはプライマリ言語のコンテンツにフォールバックします
- **i18nの無効化**: 国際化を無効にするには、`translateLanguages` を空の配列 `[]` に設定します

---

## トラブルシューティング

### エラー1: "Config file not found" (設定ファイルが見つかりません)

**エラーメッセージ:**
```
Config file not found: .aigne/web-smith/config.yaml
Please run 'aigne web init' to create the config file.
```

**原因:** 設定ファイルが期待される場所に存在しません。

**修正:** `aigne web init` を実行して、対話形式で設定ファイルを作成します。

---

### エラー2: "Error parsing config file" (設定ファイルの解析エラー)

**エラーメッセージ:**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因:** 設定ファイルにYAML構文エラーがあります（例: 不正なインデント、間違ったコロン、引用符の欠落）。

**修正:**
1. エラーで言及されている行番号を確認します
2. YAML構文を確認します（タブではなくスペースを使用、正しいコロン形式を使用）
3. YAMLバリデータを使用してファイルを検証します
4. `aigne web generate` を再実行します

---

### エラー3: `clear` なしで `standard` から `singlePage` に切り替える

**エラーメッセージ:**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因:** `clear` を実行せずに `websiteScale` を `standard` から `singlePage` に変更したため、構造の競合が発生しました。

**修正:**
1. `aigne web clear` を実行して古い生成ファイルを削除します
2. `aigne web generate` を実行して新しい規模で再生成します
3. **`websiteScale` を変更する際は、`generate` の前に必ず `clear` を実行してください**

---

### エラー4: "Invalid locale code" (無効なロケールコード)

**エラーメッセージ:**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因:** `locale` または `translateLanguages` でサポートされていない言語コードを使用しました。

**修正:**
1. サポートされている言語コードのリストを確認します
2. 有効なIETF言語コード（例: `en`, `zh`, `ja`）を使用します
3. 設定を更新し、コマンドを再実行します

---

### エラー5: "No content sources found" (コンテンツソースが見つかりません)

**エラーメッセージ:**
```
Warning: No content sources found in sourcesPath. Generated content may be generic.
```

**原因:** `sourcesPath` が空であるか、指定されたすべてのパスが存在しないか、アクセスできません。

**修正:**
1. `sourcesPath` 内のファイル/ディレクトリが存在することを確認します
2. ファイルのパーミッションを確認します（ファイルが読み取り可能であることを確認）
3. `sourcesPath` に有効なパスを追加します（例: `["./README.md", "./docs"]`）
4. `aigne web generate` を再実行します

---

## ベストプラクティス

### `sourcesPath` のベストプラクティス

**良いフォルダレイアウト:**

```
project/
├── README.md           # ✅ 含める
├── docs/               # ✅ 含める
│   ├── getting-started.md
│   └── api-reference.md
├── CHANGELOG.md        # ✅ 含める
└── assets/
    ├── images/         # ✅ 含める (画像参照用)
    └── recordings/     # ❌ スキップ (必要なければ)
```

**悪いフォルダレイアウト:**

```
project/
├── node_modules/       # ❌ 含めない (大きすぎる)
├── dist/               # ❌ 含めない (生成されたファイル)
├── .git/               # ❌ 含めない (バージョン管理)
└── test/               # ❌ 含めない (テストファイル)
```

**ベストプラクティス:**

1. **重要なドキュメントを含める:**
   - `README.md` (プロジェクト概要)
   - `docs/` ディレクトリ (ドキュメント)
   - `CHANGELOG.md` (バージョン履歴)

2. **プロジェクト設定を含める:**
   - `aigne.yaml` (プロジェクト設定)
   - プロジェクトに関連する設定ファイル

3. **画像ディレクトリを含める:**
   - `assets/images/` (画像参照用)
   - 注: 画像は分析されませんが、参照できます

4. **大きなディレクトリを避ける:**
   - `node_modules/` (大きすぎ、不要)
   - `dist/` または `build/` (生成されたファイル)
   - `.git/` (バージョン管理)

5. **Globパターンのサポート:**
   - **Globパターンは現在 `sourcesPath` でサポートされていません**
   - 明示的なファイルパスまたはディレクトリパスを使用してください
   - 例: `["./README.md", "./docs"]` ✅
   - 例: `["./docs/**/*.md"]` ❌ (サポートされていません)

6. **ファイルの無視:**
   - **`.aigneignore` は現在サポートされていません**
   - `sourcesPath` から不要なファイル/ディレクトリを手動で除外してください

---

### `rules` のベストプラクティス

**6つの箇条書きによるランディングページのスケルトン:**

このスケルトンを `rules` フィールドにコピーしてカスタマイズしてください:

```yaml
rules: |
  ### I. Core Messaging & Strategy
  1. Above the fold must answer: What it is, Who it's for, Why it's different, Primary action
  2. Establish credibility with proof: Show demo, social proof, customer logos
  3. Define clear CTA: Primary action aligned with audience, persistent mobile CTA
  
  ### II. Content Organization
  4. Use positive, confident tone: Avoid marketing jargon, focus on benefits
  5. Include concrete data: Case studies, metrics, real examples
  6. Maintain consistency: Product naming, terminology, structure
```

**トーンのガイダンス:**

- **顧客向け:** 明確なメリット、平易な言葉、信頼のシグナル
- **開発者向け:** 技術的な正確さ、コード例、APIリファレンス
- **ビジネスオーナー向け:** ROI重視、時間節約のメリット、プロフェッショナルなトーン

**CTAのガイダンス:**

- **プライマリCTA:** ユーザーに取ってほしい主要なアクション（例: "Generate My Site"）
- **セカンダリCTA:** 目立たない位置に配置（例: "See it on GitHub"）
- **モバイル:** 常に表示されるプライマリCTAを維持

**ベストプラクティス:**

1. **具体的に:** 曖昧な提案ではなく、具体的な要件を含める
2. **構造を使用する:** 見出しと箇条書きでルールを整理する
3. **オーディエンスに合わせる:** `targetAudienceTypes` にトーンを合わせる
4. **成果に焦点を当てる:** 達成方法ではなく、何を望むかを記述する
5. **焦点を絞る:** 長すぎるルールは避ける（パフォーマンスのため2KB未満を目指す）
6. **テストと反復:** 生成されたコンテンツの品質に基づいてルールを改良する

---

## よくある質問

Q1: 変更が反映されない
- 考えられる原因: ファイルが保存されていない、YAMLエラー、または再生成が必要
- 修正: 保存し、YAMLを修正し、`aigne web generate` を実行し、出力に更新された値が含まれていることを確認する

Q2: 言語を追加する方法は？
- 手順:
  1. `translateLanguages` の下にコードを追加する
  2. `aigne web generate` を実行する
  3. `.aigne/web-smith/pages/workspace/{lang}/` を確認する
- 例:
```yaml
locale: zh
translateLanguages:
  - en
  - ja
  - fr  # 新しくフランス語を追加
```

Q3: 生成されたコンテンツが期待と一致しない
- 原因: `rules` が不十分、`targetAudienceTypes` がずれている、または `sourcesPath` がまばら
- 修正: `rules` を充実させ、オーディエンスを調整し、より多くのソースを追加する

Q4: フォーマットエラーを修正する方法は？
- 一般的なエラー: 全角コロン、一貫性のないインデント、不正な配列
- 修正: セクション6のガイダンスに従い、必要であればバックアップから復元し、再生成して確認する