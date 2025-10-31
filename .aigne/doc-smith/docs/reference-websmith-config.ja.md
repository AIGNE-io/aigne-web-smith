# WebSmith 設定ファイル

このガイドでは、`.aigne/web-smith/config.yaml` ファイルのすべての設定について詳しく解説します。このファイルは、WebSmith がサイトを計画、生成、デプロイする方法に関する信頼できる唯一の情報源です。プロジェクトのメッセージング、ターゲットオーディエンス、データソース、ローカライゼーション、公開の詳細を定義し、AI Agent は `generate` または `update` コマンドを実行するたびにこれらの情報に依存します。

**主要原則**

*   **安定したメタデータ**: `projectName`、`projectId`、`projectSlug` などの必須メタデータは一貫性を保ってください。下流のサービスはこれらの識別子に依存します。
*   **戦略主導のコンテンツ**: 戦略に関するフィールド（`pagePurpose`、`targetAudienceTypes`、`rules`）は、AI のナラティブスタイルを指示します。製品やマーケティング戦略が変更された場合は、まずこれらを更新してください。
*   **明示的なデータソース**: `sourcesPath` と `defaultDatasources` リストは、WebSmith が分析するコンテンツを制御します。新しいデータファイルは、生成前にここで登録する必要があります。
*   **制御されたデプロイ**: デプロイ設定（`appUrl`、`checkoutId`）は、生成されたウェブサイトがどのように公開されるかに影響します。

```d2
direction: down

# Actors
developer: {
  label: "開発者"
  shape: c4-person
}

# Core Components
websmith-engine: {
  label: "AIGNE WebSmith エンジン"
  shape: rectangle
  style: {
    fill: "#f0f4ff"
    stroke: "#b3c7f2"
  }
}

# Artifacts & Data
config-file: {
  label: "config.yaml"
  shape: rectangle
  grid-columns: 2
  grid-gap: 40

  metadata: {
    label: "1. プロジェクトメタデータ"
    shape: rectangle
    projectName
    projectDesc
    projectId
  }

  strategy: {
    label: "2. ウェブサイト戦略"
    shape: rectangle
    pagePurpose
    targetAudienceTypes
    rules
  }

  localization: {
    label: "3. ローカライゼーション"
    shape: rectangle
    locale
    translateLanguages
  }

  sources: {
    label: "4. コンテンツソース"
    shape: rectangle
    sourcesPath
  }

  media: {
    label: "5. メディアとアセット"
    shape: rectangle
    minImageWidth
    projectCover
  }

  deployment: {
    label: "6. デプロイ"
    shape: rectangle
    appUrl
    checkoutId
  }
}

content-sources: {
  label: "コンテンツソース\n(.md, .yaml)"
  shape: cylinder
}

repository: {
  label: "Git リポジトリ"
  shape: cylinder
  
  generated-site: {
    label: "生成されたウェブサイト\n(Markdown/HTML)"
    shape: cylinder
    style.fill: "#e6ffed"
  }
}

# Workflow Connections
developer -> config-file: "1. 設定の変更"
developer -> content-sources: "2. 新しいソースの追加"
developer -> websmith-engine: "3. `aigne generate` の実行"

config-file -> websmith-engine: "読み込み"
content-sources -> websmith-engine: "分析"

websmith-engine -> repository.generated-site: "生成/更新"

developer -> repository: "4. レビューとコミット"
```

## 設定の構造

設定はいくつかの論理的なセクションに整理されています。以下に各パラメータの詳細な内訳を示します。

### プロジェクト公開メタデータ

このセクションでは、プロジェクトの核となるアイデンティティを定義します。この情報は、生成されたページ、レポート、SEO メタデータで使用されます。

<x-field-group>
  <x-field data-name="projectName" data-type="string" data-required="true" data-desc="人間が読みやすいプロジェクトのタイトル。ページのタイトルやレポートに表示されます。"></x-field>
  <x-field data-name="projectDesc" data-type="string" data-required="true" data-desc="SEO メタデータや内部の AI プロンプトに使用される短いマーケティング用の説明。"></x-field>
  <x-field data-name="projectLogo" data-type="URL" data-required="false" data-desc="プロジェクトのロゴへの絶対 URL またはアクセス可能な CDN パス。ヘッダーやソーシャルメディアカードで使用されます。"></x-field>
  <x-field data-name="projectId" data-type="UUID" data-required="true" data-desc="WebSmith サービスの一意の識別子。これは自動的に生成されるため、プロジェクト間で変更したり再利用したりしないでください。"></x-field>
  <x-field data-name="projectSlug" data-type="string" data-required="false" data-desc="プロジェクトのデフォルト URL セグメント（例: /my-site）。デプロイターゲットと同期させてください。"></x-field>
</x-field-group>

### ウェブサイト戦略とナラティブ

これらのフィールドは、ウェブサイトコンテンツのナラティブ、トーン、構造について AI をガイドします。

<x-field-group>
  <x-field data-name="pagePurpose" data-type="list" data-required="true">
    <x-field-desc markdown>サイトの主要な目的を宣言します（例: `landingPage`, `portfolio`, `documentation`）。複数の目的をリストアップして、ストーリーテリングのアプローチを組み合わせることができます。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudienceTypes" data-type="list" data-required="false">
    <x-field-desc markdown>トーンと CTA (Call-to-Action) の指針となります。有効なオプションには `customers`、`developers`、`investors` などがあります。関連するすべてのオーディエンスを含めてください。</x-field-desc>
  </x-field>
  <x-field data-name="websiteScale" data-type="enum" data-required="false">
    <x-field-desc markdown>サイトの意図する規模と複雑さを示します（例: `singlePage`, `standard`, `aiDecide`）。</x-field-desc>
  </x-field>
  <x-field data-name="rules" data-type="string" data-required="false">
    <x-field-desc markdown>構造、物語の流れ、トーンに関する AI への優先度の高い指示。WebSmith は Markdown 形式（見出し、リスト）を文字通りのコピーとしてではなく、ガイダンスとして解釈します。</x-field-desc>
  </x-field>
  <x-field data-name="pagesDir" data-type="path" data-required="false" data-desc="生成されたウェブサイトページの出力ディレクトリ。WebSmith はここに最終的なファイルを書き込みます。"></x-field>
</x-field-group>

### ローカライゼーションと言語

ウェブサイトコンテンツの言語を設定します。

<x-field-group>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>コンテンツ生成の主要言語。IETF 言語コードを使用して指定します（例: `en`, `en-US`, `zh-TW`）。</x-field-desc>
  </x-field>
  <x-field data-name="translateLanguages" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith がコンテンツを翻訳すべき追加の IETF 言語コードのリスト。</x-field-desc>
  </x-field>
</x-field-group>

### コンテンツソースとデータソース

WebSmith がコンテンツを見つける場所を定義します。

<x-field-group>
  <x-field data-name="sourcesPath" data-type="list" data-required="false">
    <x-field-desc markdown>WebSmith がコンテキストを分析するためのディレクトリまたはファイルパスのリスト。生成前に新しいデータファイル（例: `.yaml`, `.md`）をここに追加します。</x-field-desc>
  </x-field>
  <x-field data-name="defaultDatasources" data-type="list" data-required="false">
    <x-field-desc markdown>すべてのページに自動的に挿入されるデータソースパスのリスト。メディアカタログのようなグローバルに利用可能なデータに便利です。</x-field-desc>
  </x-field>
</x-field-group>

### メディアとビジュアルアセット

画像やその他の視覚要素の取り扱いを制御します。

<x-field-group>
  <x-field data-name="media" data-type="object" data-required="false">
    <x-field data-name="minImageWidth" data-type="integer" data-required="false" data-desc="生成されるレイアウト内の画像の最小許容幅（ピクセル単位）。"></x-field>
  </x-field>
  <x-field data-name="projectCover" data-type="path" data-required="false" data-desc="ヒーローセクションやソーシャルメディアのプレビューに使用されるカバー画像のパス。"></x-field>
</x-field-group>

### デプロイと統合

これらのフィールドには、ウェブサイトの公開に関連する設定が含まれています。

<x-field-group>
  <x-field data-name="appUrl" data-type="URL" data-required="false" data-desc="ウェブサイトの主要なデプロイ URL。カノニカルリンクやその他の参照に使用されます。"></x-field>
  <x-field data-name="navigationType" data-type="string" data-required="false" data-desc="ナビゲーションスタイルを任意で上書きするための設定。"></x-field>
  <x-field data-name="checkoutId" data-type="string" data-required="false" data-desc="ArcBlock のデプロイ/チェックアウトサービスの識別子。"></x-field>
  <x-field data-name="shouldSyncAll" data-type="string" data-required="false">
    <x-field-desc markdown>公開ステップですべてのアーティファクトをプッシュするかどうかを制御します。完全な同期を行うには `"true"` に設定します。</x-field-desc>
  </x-field>
  <x-field data-name="lastGitHead" data-type="string" data-required="false" data-desc="最後の生成時の Git コミット SHA。WebSmith が自動的に更新します。"></x-field>
</x-field-group>

## 設定例

以下は、典型的なセットアップを示す `config.yaml` ファイルのサンプルです。

```yaml config.yaml icon=logos:yaml
# 1. プロジェクト公開メタデータ
projectName: "AIGNE WebSmith Docs"
projectDesc: "The official documentation for AIGNE WebSmith."
projectLogo: "https://example.com/logo.png"
projectId: "a1b2c3d4-e5f6-7890-1234-567890abcdef"
projectSlug: "websmith-docs"

# 2. ウェブサイト戦略とナラティブ
pagePurpose:
  - documentation
  - landingPage
targetAudienceTypes:
  - developers
websiteScale: "standard"
rules: |
  - Focus on clarity and practical examples.
  - Maintain a professional but approachable tone.
  - Ensure all code snippets are accurate and easy to copy.
pagesDir: "src/pages"

# 3. ローカライゼーションと言語
locale: "en"
translateLanguages:
  - "zh-TW"

# 4. コンテンツソースとデータソース
sourcesPath:
  - "src/content"
  - "src/data/features.yaml"
defaultDatasources:
  - "src/data/site-metadata.yaml"

# 5. メディアとビジュアルアセット
media:
  minImageWidth: 600
projectCover: "src/assets/cover-image.png"

# 6. デプロイと統合
appUrl: "https://docs.aigne.com/websmith"
checkoutId: "chk_12345"
shouldSyncAll: "false"
lastGitHead: ""
```

## 一般的な更新ワークフロー

設定ファイルを使用してウェブサイトに変更を適用するには、次の手順に従います。

1.  **設定の変更**: 必要に応じて `config.yaml` の戦略、メタデータ、その他のフィールドを調整します。
2.  **新しいソースの登録**: 新しいデータファイルがある場合は、`sourcesPath` に登録し、必要であれば `defaultDatasources` にも登録します。
3.  **WebSmith の実行**: 完全に新しいビルドを行うには `aigne run generate` を、既存のページのコンテンツを更新するには `aigne run update` を使用します。
4.  **レビューとコミット**: 生成されたコンテンツをレビューして変更が反映されていることを確認し、更新されたファイルをリポジトリにコミットします。

この設定ファイルをプロジェクトの目標やコンテンツソースと一致させておくことで、WebSmith が一貫して高品質でブランドに合ったウェブサイトを生成することを保証します。