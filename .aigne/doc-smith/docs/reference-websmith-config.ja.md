# WebSmith 設定

## 設定ファイルとは？

### 基本

`config.yaml` は WebSmith のコア設定ファイルです。YAML 形式を使用し、WebSmith がウェブサイトを生成、翻訳、公開するために必要なすべてのパラメータを保存します。

![.aigne/web-smith/config.yaml のガイド付きレビュー画面](../../../assets/images/web-smith-config.png)

**ファイル詳細**
- **ファイル名:** `config.yaml` (固定)
- **場所:** プロジェクトルートからの相対パスで `.aigne/web-smith/config.yaml`
- **フォーマット:** YAML (UTF-8)

---

## 設定ファイルは何をするのか？

### コア機能

設定ファイルは WebSmith の中心的なパラメータキャリアです。WebSmith が `generate` コマンドを実行するたびに、このファイルを読み込み、その設定に従ってサイトの構造とコンテンツを生成します。

主な目的：
- サイトのタイプとターゲットオーディエンスを定義する
- コンテンツ生成戦略とライティングスタイルを制御する
- サイトの規模とページ構造を決定する
- 多言語サポートを設定する
- デプロイメントパラメータを設定する

### 機能グループ

フィールドは機能ごとに次のようにグループ化されています：

#### グループ 1: プロジェクトの基本

ブランディングとSEOのための基本的な識別子と表示情報。

フィールド: `projectName`, `projectDesc`, `projectLogo`, `projectId`, `projectSlug`, `projectCover`

目的: 名前、説明、ロゴ、識別子などを定義します。ページタイトル、ナビゲーションメニュー、SEOメタタグ、ソーシャルシェアリングに影響します。

#### グループ 2: サイト戦略

サイトのタイプ、トーン、規模、生成戦略を定義します。これにより、WebSmith がどのようにコンテンツを生成するかが制御されます。

フィールド: `pagePurpose`, `targetAudienceTypes`, `websiteScale`, `rules`

目的:
- `pagePurpose`: サイトのタイプ（例: ランディングページ、eコマース、SaaS）を定義し、コンポーネントとコンテンツ編成に影響します
- `targetAudienceTypes`: オーディエンス（例: エンドユーザー、開発者、ビジネスオーナー）を定義し、WebSmith のトーン、複雑さ、例に影響します
- `websiteScale`: サイトの規模（単一ページ vs 複数ページ）を定義し、ページ数を制御します
- `rules`: 構造、コンテンツ、スタイルに関する詳細なガイダンス

#### グループ 3: 言語

多言語サイトをサポートするための言語バージョンを設定します。

フィールド: `locale`, `translateLanguages`

目的: プライマリ言語と翻訳ターゲットを定義します。各言語は完全なサイト構造を生成します。

#### グループ 4: データソース

WebSmith がページ生成の素材および参照として分析するデータソースを指定します。

フィールド: `sourcesPath`, `defaultDatasources`

目的:
- `sourcesPath`: WebSmith が分析するディレクトリまたはファイル（Markdown、YAML、画像など）。これはコンテンツの品質、正確性、関連性を直接決定します。
- `defaultDatasources`: コマンド実行時にすべてのページに注入される共通のデータソース（例: 画像の場所と説明を含む `media.md`）

#### グループ 5: 出力とデプロイメント

出力パスとデプロイメントパラメータを設定します。

フィールド: `pagesDir`, `appUrl`, `checkoutId`, `shouldSyncAll`, `navigationType`

目的:
- `pagesDir`: 生成されたページファイルが書き込まれる場所
- `appUrl`: デプロイされたサイトのURL、リンクとSEOに影響します
- `checkoutId`, `shouldSyncAll`, `navigationType`: 開発中に使用される一時的な変数。通常は管理する必要はありません。

#### グループ 6: メディアと表示

画質と関連する表示パラメータを設定します。

フィールド: `media.minImageWidth`, `lastGitHead`

目的:
- `media.minImageWidth`: 低品質のアセットをフィルタリングするための最小画像幅
- `lastGitHead`: 増分更新に使用された最後のGitコミットID

---

## 設定ファイルはどのように作成されるか？

### 生成方法

次のコマンドを使用します：

```bash Init icon=lucide:terminal
aigne web init
```

このコマンドは、以下の項目を入力するための対話型ウィザードを起動します：

- サイトタイプ (`pagePurpose`): 主な目的（複数選択）
- ターゲットオーディエンス (`targetAudienceTypes`): サイトの対象者（複数選択）
- サイト規模 (`websiteScale`): ページ数
- プライマリ言語 (`locale`)
- 翻訳言語 (`translateLanguages`)（複数選択）
- 出力ディレクトリ (`pagesDir`)
- ソースパス (`sourcesPath`)（複数入力）
- カスタムルール (`rules`)（オプション）

完了後、ファイルは `.aigne/web-smith/config.yaml` に保存されます。

### 実際の設定例

以下は、AIGNE WebSmith プロジェクトの実際の設定です：

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

### フィールドごとの説明

上記の実設定に基づき、各フィールドの役割を説明します：

#### プロジェクトの基本

`projectName`
- 目的: ページの `<title>`、ナビゲーション、サイトブランディングに表示される名前
- 現在の値: `AIGNE WebSmith`
- タイプ: string
- 影響:
  - 名前を変更すると、ページ全体のタイトルとナビゲーションラベルが更新される
  - 読みやすさとSEOのため、50文字未満に簡潔に保つ
- 適用方法: 変更後に `aigne web publish` を実行

`projectDesc`
- 目的: SEOメタ (`<meta name="description">`) とソーシャルシェアリング用のプロジェクト説明
- 現在の値: `"AI-powered website generation tool built on the AIGNE Framework"`
- タイプ: string
- 影響:
  - ページやソーシャルシェアのメタディスクリプションを更新する
  - 検索スニペットのため、約150文字未満に保つ
  - SEOのためにキーワードを含める
- 適用方法: 変更後に `aigne web publish` を実行

`projectLogo`
- 目的: ヘッダーナビゲーション、ファビコン、ソーシャルサムネイル用のロゴ
- 現在の値: `https://www.arcblock.io/content/uploads/2e5edbac4a7d5310c117d09601811c.png`
- タイプ: string (URLまたはパス)
- 影響:
  - URL/パスを切り替えると、サイト全体のロゴが更新される
  - サポート形式: HTTP/HTTPS URLまたは相対パス (例: `./assets/images/logo.svg`)
  - 鮮明な表示のため、PNGまたはSVGを推奨
- 適用方法: 変更後に `aigne web publish` を実行

`projectId`
- 目的: WebSmith サービスがデプロイメント、履歴、データソースを関連付けるために使用する一意のプロジェクト識別子
- 現在の値: `pg4d0000-0000-4000-a000-000000000000` (UUID)
- タイプ: string (UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- 影響:
  - 新しいUUIDに変更すると、システムにとっては新しいプロジェクトとなり、以下の可能性があります：
    - 以前のデプロイメントリンクとの関連付けが壊れる
    - プロジェクト履歴へのリンクが失われる
    - データソースの関連付けが失われる
- 適用方法: 変更後に `aigne web publish` を実行

`projectSlug`
- 目的: デプロイメントパスと内部リンクに影響するURLパスプレフィックス
- 現在の値: `/` (ルート)
- タイプ: string (URLパス)
- 影響の例:
  - `/`: サイトがルートに、例: `https://example.com/`
  - `/portfolio`: サイトが `https://example.com/portfolio/` に
  - `/docs`: サイトが `https://example.com/docs/` に
  - 変更すると、すべての内部リンクとデプロイメントパスが更新される
- 適用方法: 変更後に `aigne web publish` を実行

`projectCover`
- 目的: プレビューやソーシャルシェアリング（Open Graph、Twitter Cardなど）用のサイトカバー画像
- 現在の値: `.aigne/web-smith/cover.png`
- タイプ: string (ファイルパス)
- 影響:
  - パスを変更すると、ソーシャルシェアリング時のプレビュー画像が更新される
  - 高品質の画像（少なくとも1200×630）を使用する
  - フォーマット: PNG, JPG/JPEG, WebPなど
- 適用方法: 変更後に `aigne web publish` を実行

#### サイト戦略

`pagePurpose`
- 目的: 主な目的を定義し、生成戦略とページ構造に直接影響を与える
- 現在の値: `[landingPage]` (配列)
- タイプ: array (複数選択)
- オプションと効果:
  - `landingPage` (現在): コンバージョン重視のランディングページ。ヒーロー、機能、CTA、FAQなどを生成
  - `ecommerce`: オンラインストア。カタログ、カート、チェックアウト、レビューなどを生成
  - `saas`: SaaS製品サイト。機能、価格、デモ、オンボーディングなどを生成
  - `portfolio`: ポートフォリオサイト。ビジュアルレイアウト、ギャラリー、ケーススタディなどを生成
  - `corporate`: 企業サイト。会社概要、サービス、チーム、連絡先などを生成
  - `blog`: ブログ。コンテンツ構造、SEO、共有、アーカイブなどを生成
  - `nonprofit`: 非営利団体。ミッション、寄付フロー、ボランティア登録などを生成
  - `education`: 教育。コースリスト、学習パス、進捗追跡などを生成

`targetAudienceTypes`
- 目的: ターゲットオーディエンスを定義し、トーン、複雑さ、例の選択に直接影響を与える
- 現在の値: `[customers]` (配列)
- タイプ: array (複数選択)
- オプションと効果:
  - `customers` (現在): エンドユーザー/顧客。簡単な言葉、使いやすさと成果を強調。信頼性のシグナルとユーザーストーリーを追加
  - `businessOwners`: ビジネスオーナー/創業者。ROIとビジネス価値に焦点。プロフェッショナルなトーン。ビジネスケースとリターン分析を含む
  - `marketers`: マーケティングチーム。KPI駆動でブランドに焦点。マーケティングツールと分析を含む
  - `designers`: デザイナー。ビジュアルを重視し、デザインを紹介。美学とインスピレーション。デザインケースとビジュアルツールを含む
  - `developers`: 開発者/技術ユーザー。技術的な詳細、コード例、APIドキュメント。正確性と実装に焦点
  - `investors`: 投資家/ステークホルダー。成長指標、市場機会、財務見通し。事業計画と市場データ
  - `jobSeekers`: 求職者。文化、成長、福利厚生に焦点。求人情報と企業文化
  - `students`: 学生/学習者。指導的なトーン、ステップバイステップのガイダンス、進捗追跡。チュートリアルとコース教材
  - `generalPublic`: 一般/混合オーディエンス。分かりやすい言葉、複数のエントリーポイント、幅広いアピール
- 適用方法: 変更後に `aigne web clear && aigne web generate` を実行

`websiteScale`
- 目的: サイト規模を定義し、ページ数とナビゲーションの複雑さを制御する
- 現在の値: `singlePage`
- タイプ: string (単一選択)
- オプションと効果:
  - `singlePage` (現在): 1ページのサイト。すべてのセクションが単一のスクロール可能なページにある（ヒーロー、機能、FAQ、CTAなど）。迅速な立ち上げ/MVPに適している
  - `minimal`: 2～6ページ。ホーム、会社概要、サービス/製品、連絡先など。小規模ビジネス/シンプルなサイト
  - `standard`: 7～12ページ。minimal + ポートフォリオ/ブログ、チーム、FAQ、価格など。プロフェッショナルなサイト、ポートフォリオ、小規模eコマース（推奨）
  - `comprehensive`: 12ページ以上。standard + 詳細なサービスページ、ケーススタディ、リソースセンターなど。大規模/複雑/コンテンツ豊富なサイト
  - `aiDecide`: WebSmith がタイプ、オーディエンス、リポジトリ分析に基づいて規模を決定。ビジネスニーズ、コンテンツ量、メンテナンス能力を考慮
- 適用方法: 変更後に `aigne web clear && aigne web generate` を実行

`rules`
- 目的: 構造、コンテンツ、スタイルに関する詳細な生成ガイダンス（Markdown）。これは WebSmith にとって最も重要なガイダンスであり、品質とUXに直接影響します。
- 現在の値: 詳細なガイダンスを含む複数行のブロック（上記の例を参照）、内容：
  - コアメッセージングと戦略
  - 重要な質問に「ファーストビュー」で答える
  - 証拠で信頼性を確立する
  - 明確なコールトゥアクションを定義する
- タイプ: 複数行の文字列 (Markdownサポート)
- 影響:
  - 空または不十分なルール: WebSmith はデフォルトにフォールバックし、ニーズに合わない可能性がある
  - 詳細なルール: WebSmith は構造、構成、トーンに関するガイダンスに従う
  - 変更: WebSmith は新しいルールに基づいて再生成し、セクションや表現に影響を与える
- 適用方法: 変更後に `aigne web clear && aigne web generate` または `aigne web update` を実行

#### 言語

`locale`
- 目的: ベースコンテンツ生成に使用されるプライマリサイト言語
- 現在の値: `en`
- タイプ: string
- サポートされる言語コード: `en`, `zh`, `zh-TW`, `ja`, `ko`, `fr`, `de`, `es`, `pt`, `ru`, `it`, `ar` などの標準IETFコード
- 適用方法: 変更後に `aigne web clear && aigne web generate` を実行

`translateLanguages`
- 目的: 翻訳する言語のリスト。それぞれが完全なサイト構造になる
- 現在の値: `[zh, zh-TW, ja]`
- タイプ: array (複数選択)
- サポートされるコード: `locale` と同じセット（`locale` 自体を含んではいけない）
- 言語ごとの効果:
  - `zh`: 完全な簡体字中国語サイトを生成
  - `zh-TW`: 完全な繁体字中国語サイトを生成
  - `ja`: 完全な日本語サイトを生成
  - その他も同様に動作し、それぞれが別のサイト構造を生成
- 適用方法: 変更後に `aigne web translate` を実行

#### データソース

`sourcesPath`
- 目的: WebSmith の WebSmith エンジンによって分析されるディレクトリ/ファイル（配列）。WebSmith はこれらをサイトコンテンツ生成の唯一の参照として使用します。これは品質、正確性、関連性を直接決定します。
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
- タイプ: array (パス)
- 重要性:
  - コンテンツ品質の主要な決定要因: これらのソースのみが参照として使用される
  - 推奨事項:
    - 主要なドキュメントとREADMEを含める
    - 重要なプロジェクト情報源を含める
    - ソースを正確かつ最新の状態に保つ
    - プロジェクトの状態に合わせて定期的に更新する
- 影響:
  - パスを追加: WebSmith がより多くの資料を分析し、品質が向上することが多い
  - パスを削除: WebSmith はそれらの分析を停止し、情報を見逃す可能性がある
  - パスの種類:
    - ディレクトリ (例: `./assets/documents`): 再帰的に分析される
    - ファイル (例: `./README.md`): 直接分析される
    - サポートされるタイプ: `.md`, `.yaml`/`.yml`, `.json`, `.txt` など
    - 画像ディレクトリ: 画像は分析されないが、参照可能
- 適用方法: 変更後に `aigne web clear && aigne web generate` または `aigne web update` を実行

`defaultDatasources`
- 目的: すべてのページコンテキストに自動的に注入されるデータソース（例: メディア、連絡先情報）。これらはコマンドが実行されるたびに追加されますが、すべてのリソースが完全にインライン化されるわけではありません。`media.md` のようなリソース記述に適しています。
- 現在の値: `[./media.md]`
- タイプ: array (ファイルパス)
- 影響:
  - 追加: 新しく含まれる共通コンテンツ（ブランド情報、共有スニペットなど）
  - 削除: もはや注入されない
  - 適しているもの: `media.md`（画像の場所と説明）、共有の連絡先/ブランド情報
  - サポート形式: `.md`, `.yaml`/`.yml`, `.json`
- 適用方法: 変更後に `aigne web clear && aigne web generate` または `aigne web update` を実行

#### 出力とデプロイメント

`pagesDir`
- 目的: 生成されたサイトファイル（例: `page.yaml`, `_navigations.yaml`）の出力ディレクトリ
- 現在の値: `.aigne/web-smith/pages`
- タイプ: string (パス)
- 影響:
  - 変更（例: `./output/pages` へ）すると、将来の出力がそこへ移動する
  - 移植性のために相対パスを推奨
  - ディレクトリが存在しない場合は自動的に作成される
- 適用方法: 将来の生成は新しいディレクトリに書き込まれる

`appUrl`
- 目的: サイトのデプロイメントURL。サイトがどこに公開されるかを決定する
- 現在の値: `https://mhevtaeg.user.aigne.io`
- タイプ: string (URL)
- 影響:
  - 別のURLに変更すると、新しいターゲットに公開される
  - プロトコルを含める必要があり、ない場合は `https://` が自動的に追加される
  - 混乱を避けるため、最終的なドメインがわかってから設定する
- 適用方法: `aigne web publish` のみで使用され、他のコマンドは無視する

`checkoutId`
- 目的: 一時的な開発変数。便宜上保存されるだけ
- 現在の値: `""`
- タイプ: string
- 注意: システムによって管理されるため、通常は設定する必要はない

`shouldSyncAll`
- 目的: 一時的な開発変数。便宜上保存されるだけ
- 現在の値: `""`
- タイプ: string (`"true"` または `""`)
- 注意: システムによって管理されるため、通常は設定する必要はない

`navigationType`
- 目的: 一時的な開発変数。便宜上保存されるだけ
- 現在の値: `""`
- タイプ: string
- 注意: システムによって管理されるため、通常は設定する必要はない

#### メディアと表示

`media.minImageWidth`
- 目的: 低品質の画像をフィルタリングするための最小画像幅（px）。これより幅の広い画像のみが使用される
- 現在の値: `600`
- タイプ: integer (ピクセル)
- 効果:
  - 低（400–600）: より多くの画像が許可されるが、品質リスクは高まる。迅速な立ち上げ向け
  - 中（600–800）: 品質と量のバランスが取れている。デフォルトの推奨
  - 高（800–1000）: 高品質だが、画像は少なくなる。ポートフォリオ/プレミアムブランド向け
  - 非常に高い（1000+）: 最高のビジュアル品質だが、使用可能な画像は非常に少なくなる
- 適用方法: 変更後に `aigne web clear && aigne web generate` または `aigne web update` を実行

#### その他の設定

（現在、追加のフィールドはありません。）

`lastGitHead`
- 目的: 生成時の最後のGitコミットID（増分更新用）
- 現在の値: `c4a4d3db4bf230e2c6873419e26b6654c39613a5`
- タイプ: string (Gitコミットハッシュ)
- 効果:
  - 各生成後に自動的に維持される
  - 変更されたファイルを検出するために使用される。手動での編集は増分動作に影響する可能性がある
- 注意: 通常はシステム管理。必要な場合にのみ有効なハッシュで編集する

---

## フィールド一覧

| フィールド | タイプ | デフォルト | 例 | 適用コマンド |
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

**注意:** 許可される値と詳細な説明については、以下の[フィールドごとの説明](#field-by-field-explanation)セクションを参照してください。

---

## コピー＆ペースト例

### 最小限の例: 単一ページ、英語のみ

単一ページの英語ウェブサイトのための最小限の設定：

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
```bash ウェブサイトを生成 icon=lucide:terminal
aigne web generate
```

---

### 標準的な例: 複数ページ、英語 + 日本語

英語と日本語の複数ページウェブサイトのための標準的な設定：

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
```bash ウェブサイトを生成 icon=lucide:terminal
aigne web generate
aigne web translate
aigne web publish
```

**注意:** バージョンは破壊的変更と共に上がります。マイグレーションノートが提供されます。

---

## 問題が発生した場合

ウェブサイトの生成に失敗した場合や予期しない結果になった場合は、これらの回復方法を使用してください：

- **Git revert:** バージョン管理を使用している場合は、以前の動作していた設定を復元します：
  ```bash コマンドを実行 icon=lucide:terminal
  git revert HEAD
  ```

- **クリーンな再生成:** すべての生成されたファイルをクリアし、最初から再生成します：
  ```bash コマンドを実行 icon=lucide:terminal
  aigne web clear && aigne web generate
  ```

これにより、クリーンな状態が復元され、現在の設定に基づいてウェブサイトが再生成されます。

---

## いつ変更すべきか？

### 機能の調整

シナリオ: 単一ページから複数ページへアップグレード
- トリガー: 単一ページから完全なサイトに拡張する必要がある
- フィールド: `websiteScale`
- 例:
```yaml
# 変更前
websiteScale: singlePage

# 変更後
websiteScale: standard
```
- 適用:
  - まだ何も生成されていない場合: `aigne web generate` を実行
  - すでに生成されている場合: `aigne web clear` の後 `aigne web generate` を実行

シナリオ: サイトタイプを変更
- トリガー: 製品のポジショニングが変更（例: SaaS → eコマース）
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
- 適用: シナリオ1と同様

シナリオ: ターゲットオーディエンスを調整
- トリガー: オーディエンスがシフト（例: 消費者 → ビジネス）
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
- 適用: シナリオ1と同様

### 適応

シナリオ: 新しいデータソースを追加
- トリガー: WebSmith が分析する必要がある新しいドキュメントやコンテンツが追加された。パスが追加されないと、後の `aigne web generate` 実行ではそれを読み取れない。
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
- 適用: プロンプトが入力される際の `aigne web generate` 時に読み込まれる

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

シナリオ: 生成されたコンテンツが期待と合わない
- トリガー: トーン/構造が望み通りでない
- フィールド: `rules`
- 例:
```yaml
# 変更前: 空または内容が薄い
rules: ""

# 変更後: 詳細なガイダンス
rules: |
  ### Page Structure Requirements
  1. Above the fold must include:
     * Clear product headline
     * Concise description (≤ 2 sentences)
     * Primary call‑to‑action

  2. Content organization:
     * Positive, confident tone
     * Include concrete case data
     * Avoid excessive marketing jargon
```
- 適用:
  - `aigne web update` によって読み込まれる
  - プロンプトが入力される際の `aigne web generate` 時に読み込まれる
  - 注意: ルールは各プロンプトと共に送信される

### 多言語対応

シナリオ: 新しい言語を追加
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

シナリオ: プライマリ言語を変更
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
- 適用: `aigne web clear` の後 `aigne web generate` を実行

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
- 適用: `aigne web publish` (他のコマンドはこれらを無視)

シナリオ: 外部デプロイメントを統合
- フィールド: `appUrl`
- 例:
```yaml
# 変更前
appUrl: ""

# 変更後
appUrl: https://your-app.user.aigne.io
```
- 適用: `aigne web publish` のみ。`appUrl` がターゲットプラットフォームを決定する

### 変更の確認

- 生成されたページファイルをチェックし、更新された値が存在することを確認します。例えば、`projectName` を変更した後、新しい名前が期待される場所に表示されていることを確認してください。

---

## ファイルが壊れた場合

### YAMLフォーマットエラー

シナリオ: 全角（中国語）コロンを使用
```yaml
projectName： "My Project"  # 間違い: 全角コロン
```
正しい形式:
```yaml
projectName: "My Project"  # 正しい: ASCIIコロン
```
影響:
- YAMLパース失敗。`aigne web generate` はエラーを表示
- コマンドは中止され、サイトは生成されない
回復:
1. すべての全角コロンをASCIIの `:` に置き換える
2. `aigne web generate` を再実行

シナリオ: 存在しないフィールド
```yaml
projectName: "My Project"
unknownField: "some value"
```
影響:
- CLIは認識されないフィールドをエラーなしで無視する
- ファイルはパースされるが、フィールドは無視され、生成には影響しない
- 出力が期待通りか確認する必要がある
回復:
1. 生成された出力を確認する
2. 有効なフィールド名についてはこのガイドを参照する
3. 不明なフィールドを削除する

シナリオ: インデントエラー
```yaml
pagePurpose:
- landingPage  # 間違い: インデントがない
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
- YAMLパース失敗。構造が誤って読み取られる
- 値が失われたり、誤解釈されたりする可能性がある
回復:
1. スペースのみを使用（タブは使用しない）し、一貫したインデント（通常は2スペース）を使用する
2. 配列が正しいインデントで `-` を使用していることを確認する

シナリオ: 主要なフィールドを削除
```yaml
# 誤ってprojectNameを削除
projectDesc: "Description"
projectId: "pg4d0000-0000-4000-a000-000000000000"
```
影響:
- タイトルが空になるか、デフォルト値になる可能性がある
- 一部の機能が意図通りに動作しない可能性がある
- パースは成功するが出力品質が低下する
回復:
1. 可能であればGit履歴から復元する
2. `aigne web init` を実行して再生成し、カスタマイズをマージする
3. このガイドに従って、不足している必須フィールドを埋める

シナリオ: 間違った値の型
`pagePurpose` は文字列ではなく配列でなければなりません：
```yaml
# 間違い
pagePurpose: landingPage

# 正しい
pagePurpose:
  - landingPage
```
`translateLanguages` は文字列ではなく配列でなければなりません：
```yaml
# 間違い
translateLanguages: en

# 正しい
translateLanguages:
  - en
```
影響:
- 型が間違っているとデフォルト値が使用される可能性がある
- WebSmith が値を正しく読み取れない可能性がある
- 出力が期待と一致しない可能性がある
回復:
1. このガイドで正しいフォーマットを確認する
2. `-` を使って適切なYAML配列構文を使用する
3. 再生成して確認する

### 検出と回復

方法1: 生成中に検出
- 編集後、`aigne web generate` を実行
- システムは役立つメッセージと共にYAML/フォーマットエラーを報告する

方法2: バックアップから復元
- Gitを使用している場合は、履歴から復元
- 手動バックアップを使用している場合:
```bash Cp Config-backup-20240101.yaml .aigne/web-smith/config.yaml icon=lucide:terminal
cp config-backup-20240101.yaml .aigne/web-smith/config.yaml
```

方法3: ファイルを再生成
- 修復できない場合は、`aigne web init` を実行して再作成します。カスタム値をマージできるように、古い `config.yaml` を先にバックアップしてください。

### 製品の堅牢性

WebSmith の動作による：
1. ファイルが見つからない場合: 明確なエラーと `aigne web init` を実行するようガイダンスが表示される
2. YAMLパース失敗: クラッシュせずに親切なエラーが表示される
3. 不明なフィールド: 静かに無視され、生成は続行される。結果は手動で確認する必要がある
4. 間違った値の型: デフォルトが使用される可能性があり、パースは続行される
5. オプションのフィールドが欠落: デフォルトが適用される（例: `locale` は "en" がデフォルト）

### 予防策

1. 設定ファイルにバージョン管理を使用する
2. 大規模な編集の前にバックアップを作成する
3. CLI (`aigne web init`) を介した編集を優先し、手動でのフォーマットエラーを減らす
4. 編集後に `aigne web generate` を実行して変更を検証する

---

## デフォルトと優先順位

### 明示的なデフォルト

以下のフィールドには明示的なデフォルト値があります：

- `locale`: デフォルトは `"en"` (英語)
- `websiteScale`: デフォルトは `"standard"` (7-12ページ)
- `pagesDir`: デフォルトは `"./aigne/web-smith/pages"`
- `translateLanguages`: デフォルトは `[]` (空の配列、翻訳なし)
- `media.minImageWidth`: デフォルトは `800` (ピクセル)

### 優先順位のルール

設定の優先順位は次の順序に従います：

1. **明示的な設定値**が最も高い優先度を持つ
2. **`rules` は指定された場合、デフォルトを上書き**します。`rules` が空の場合、WebSmith はデフォルトにフォールバックします
3. **欠落している値はデフォルトにフォールバック**します。フィールドが指定されていないか空の場合、システムはデフォルト値を使用します

### i18nフォールバックの動作

多言語サイトを生成する場合：

- **プライマリ言語 (`locale`)**: 常にコンテンツ生成のベース言語として使用される
- **翻訳言語 (`translateLanguages`)**: コンテンツはプライマリ言語から各ターゲット言語に翻訳される
- **翻訳が見つからない場合のフォールバック**: 翻訳に失敗した場合、システムはプライマリ言語のコンテンツにフォールバックする
- **i18nの無効化**: 国際化を無効にするには、`translateLanguages` を空の配列 `[]` に設定する

---

## トラブルシューティング

### エラー1: 「設定ファイルが見つかりません」

**エラーメッセージ:**
```
Config file not found: .aigne/web-smith/config.yaml
Please run 'aigne web init' to create the config file.
```

**原因:** 設定ファイルが期待される場所に存在しません。

**修正:** `aigne web init` を実行して対話形式で設定ファイルを作成します。

---

### エラー2: 「設定ファイルの解析エラー」

**エラーメッセージ:**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**原因:** 設定ファイルにYAML構文エラーがあります（例: 不正なインデント、間違ったコロン、引用符の欠落）。

**修正:**
1. エラーで言及されている行番号を確認する
2. YAML構文を確認する（タブではなくスペースを使用、正しいコロン形式を使用）
3. YAMLバリデータを使用してファイルを検証する
4. `aigne web generate` を再実行する

---

### エラー3: `clear` なしで `standard` から `singlePage` に切り替える

**エラーメッセージ:**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**原因:** `clear` を実行せずに `websiteScale` を `standard` から `singlePage` に変更したため、構造の競合が発生しました。

**修正:**
1. `aigne web clear` を実行して古い生成ファイルを削除する
2. `aigne web generate` を実行して新しいスケールで再生成する
3. **`websiteScale` を変更する際は、`generate` の前に必ず `clear` を実行してください**

---

### エラー4: 「無効なロケールコード」

**エラーメッセージ:**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**原因:** `locale` または `translateLanguages` でサポートされていない言語コードを使用しました。

**修正:**
1. サポートされている言語コードのリストを確認する
2. 有効なIETF言語コードを使用する（例: `en`, `zh`, `ja`）
3. 設定を更新し、コマンドを再実行する

---

### エラー5: 「データソースが見つかりません」

**エラーメッセージ:**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**原因:** `sourcesPath` が空であるか、指定されたすべてのパスが存在しないかアクセスできません。

**修正:**
1. `sourcesPath` 内のファイル/ディレクトリが存在することを確認する
2. ファイルのパーミッションを確認する（ファイルが読み取り可能であることを確認）
3. 有効なパスを `sourcesPath` に追加する（例: `["./README.md", "./docs"]`）
4. `aigne web generate` を再実行する

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
    └── recordings/     # ❌ スキップ (不要な場合)
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
   - `docs` ディレクトリ (ドキュメント)
   - `CHANGELOG.md` (バージョン履歴)

2. **プロジェクト設定を含める:**
   - `aigne.yaml` (プロジェクト設定)
   - プロジェクトに関連する設定ファイル

3. **画像ディレクトリを含める:**
   - `assets/images/` (画像参照用)
   - 注意: 画像は分析されませんが、参照できます

4. **大きなディレクトリを避ける:**
   - `node_modules/` (大きすぎて不要)
   - `dist/` または `build/` (生成されたファイル)
   - `.git/` (バージョン管理)

5. **グロブパターンのサポート:**
   - **グロブパターンは現在 `sourcesPath` でサポートされていません**
   - 明示的なファイルパスまたはディレクトリパスを使用してください
   - 例: `["./README.md", "./docs"]` ✅
   - 例: `["./docs/**/*.md"]` ❌ (サポートされていません)

6. **ファイルの無視:**
   - **`.aigneignore` は現在サポートされていません**
   - 不要なファイル/ディレクトリを `sourcesPath` から手動で除外してください

---

### `rules` のベストプラクティス

**6箇条のランディングページスケルトン:**

このスケルトンを `rules` フィールドにコピーしてカスタマイズしてください：

```yaml
rules: |
  ### I. コアメッセージングと戦略
  1. ファーストビューで答えるべきこと: それは何か、誰のためか、何が違うか、主要なアクション
  2. 証拠で信頼性を確立: デモを見せる、ソーシャルプルーフ、顧客ロゴ
  3. 明確なCTAを定義: オーディエンスに合わせた主要なアクション、永続的なモバイルCTA
  
  ### II. コンテンツ構成
  4. ポジティブで自信のあるトーンを使用: マーケティング用語を避け、利点に焦点を当てる
  5. 具体的なデータを含める: ケーススタディ、指標、実際の例
  6. 一貫性を保つ: 製品名、用語、構造
```

**トーンのガイダンス:**

- **顧客向け:** 明確な利点、簡単な言葉、信頼性のシグナル
- **開発者向け:** 技術的な正確さ、コード例、APIリファレンス
- **ビジネスオーナー向け:** ROIに焦点、時間節約の利点、プロフェッショナルなトーン

**CTAのガイダンス:**

- **プライマリCTA:** ユーザーに取ってほしい主要なアクション（例: 「私のサイトを生成」）
- **セカンダリCTA:** 目立たない位置に配置する（例: 「GitHubで見る」）
- **モバイル:** 永続的なプライマリCTAを表示し続ける

**ベストプラクティス:**

1. **具体的にする:** 曖昧な提案ではなく、具体的な要件を含める
2. **構造を使用する:** 見出しや箇条書きでルールを整理する
3. **オーディエンスに合わせる:** `targetAudienceTypes` にトーンを合わせる
4. **成果に焦点を当てる:** 達成方法ではなく、何を望むかを記述する
5. **焦点を絞る:** 過度に長いルールを避ける（パフォーマンスのため < 2KB を目指す）
6. **テストと反復:** 生成されたコンテンツの品質に基づいてルールを洗練させる

---

## FAQ

Q1: 変更が反映されない
- 考えられる原因: ファイルが保存されていない、YAMLエラー、または再生成が必要
- 修正: 保存し、YAMLを修正し、`aigne web generate` を実行し、出力に更新された値が含まれていることを確認する

Q2: 言語を追加する方法は？
- 手順:
  1. `translateLanguages` の下にコードを追加
  2. `aigne web generate` を実行
  3. `.aigne/web-smith/pages/workspace/{lang}/` を確認
- 例:
```yaml
locale: zh
translateLanguages:
  - en
  - ja
  - fr  # 新しくフランス語を追加
```

Q3: 生成されたコンテンツが期待と合わない
- 原因: `rules` が不十分、`targetAudienceTypes` がずれている、または `sourcesPath` が手薄
- 修正: `rules` を充実させ、オーディエンスを調整し、より多くのソースを追加する

Q4: フォーマットエラーを修正する方法は？
- よくあるエラー: 全角コロン、一貫性のないインデント、不正な配列。
- 修正: セクション6のガイダンスに従い、必要に応じてバックアップから復元し、再生成して確認する。