# コマンドラインリファレンス

このドキュメントは、AIGNE WebSmith コマンドラインインターフェース（CLI）で利用可能なすべてのコマンドに関する包括的で事実に基づいたリファレンスを提供します。各エントリには、コマンドの機能の説明、利用可能なエイリアス、およびそのパラメータとサブコマンドの詳細なリストが含まれています。

CLI 操作の標準的な構文は次のとおりです：
```bash コマンドの実行 icon=lucide:terminal
aigne web <command> [subcommand] [parameters]
```

コマンドなしで `aigne web` を実行すると、インタラクティブモードが開始されます。

## メインコマンド

以下の表は、主要なコマンドをまとめたものです。各コマンドの詳細は、以下のセクションで説明します。

| コマンド | エイリアス | 説明 |
| :--- | :--- | :--- |
| [generate](#generate) | `gen`, `g` | 設定ファイルに基づいて完全なウェブサイトを生成します。 |
| [publish](#publish) | `pub`, `p` | 生成されたウェブサイトを Pages Kit インスタンスに公開します。 |
| [update](#update) | `up` | ユーザーのフィードバックに基づいて既存のウェブサイトコンテンツを修正します。 |
| [translate](#translate) | | ウェブサイトのページを異なる言語に翻訳します。 |
| [theme](#theme) | | ウェブサイトのビジュアルテーマ（生成と適用を含む）を管理します。 |
| [component](#component) | `comp` | ウェブサイトの構築に使用されるコンポーネントライブラリを管理します。 |
| [chat](#chat) | | ウェブサイト管理のためのインタラクティブモードを開始します（デフォルト）。 |
| [prefs](#prefs) | | フィードバックから学習した保存済みのユーザー設定を管理します。 |
| [history](#history) | | ウェブサイトに加えられた過去の更新ログを表示します。 |
| [clear](#clear) | | 生成されたファイル、ワークスペースデータ、または設定を削除します。 |

---

### generate
`generate` コマンドは、指定された設定ファイルに基づいて、サイト構造の計画からページコンテンツやテンプレートの生成まで、完全なウェブサイトの作成を統括します。

**エイリアス:** `gen`, `g`

**使用法:**
```bash ウェブサイトの生成 icon=lucide:terminal
aigne web generate
```

**パラメータ:**

<x-field-group>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="ウェブサイト設定のファイルパスを指定します。通常は自動的に提供されます。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="一貫した用語を保証するための用語集ファイルへのパス。@<file> の形式を使用します。"></x-field>
  <x-field data-name="forceRegenerate" data-type="boolean" data-required="false" data-desc="既存の生成済みコンテンツを上書きして、すべてのページを強制的に再生成します。"></x-field>
</x-field-group>

### publish
`publish` コマンドは、生成されたウェブサイトファイルを Pages Kit インスタンスにアップロードします。バッチアップロードプロセスを管理し、ステータスの監視を提供します。

**エイリアス:** `pub`, `p`

**使用法:**
```bash 公開 --appurl "https://example.com" icon=lucide:terminal
aigne web publish --appUrl "https://example.com"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="appUrl" data-type="string" data-required="false" data-desc="ページを公開する Pages Kit ウェブサイトのターゲットベース URL。"></x-field>
  <x-field data-name="with-navigations" data-type="string" data-required="false" data-default="menu" data-desc="ナビゲーションデータを公開します。受け入れられる値は 'flat' または 'menu' です。"></x-field>
  <x-field data-name="with-locales" data-type="boolean" data-required="false" data-desc="true に設定すると、ウェブサイトのロケールと言語設定を公開します。"></x-field>
</x-field-group>

### update
`update` コマンドは、ユーザーから提供されたフィードバックに基づいて、既存のウェブサイトのコンテンツを修正します。テキストの修正、セクションの追加や削除、ページ構造の変更に使用できます。

**エイリアス:** `up`

**使用法:**
```bash 更新 --pages "/about" --feedback "add A Mission Statement." icon=lucide:terminal
aigne web update --pages "/about" --feedback "Add a mission statement."
```

**パラメータ:**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="更新するページパスの配列（例：[\"/about-us\", \"/contact\"]）。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="指定されたページに必要な変更や改善点の説明。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="一貫した用語のための用語集ファイルへのパス。@<file> の形式を使用します。"></x-field>
</x-field-group>

### translate
`translate` コマンドは、既存のウェブサイトページのコンテンツを1つ以上の指定された言語に翻訳します。

**使用法:**
```bash 翻訳 --pages "/home" --langs "fr,de,es" icon=lucide:terminal
aigne web translate --pages "/home" --langs "fr,de,es"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="pages" data-type="array" data-required="false" data-desc="翻訳するページパスの配列。"></x-field>
  <x-field data-name="langs" data-type="array" data-required="false" data-desc="言語コードの配列。利用可能な言語：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="string" data-required="false" data-desc="翻訳の品質をガイドし、向上させるための具体的な指示。"></x-field>
  <x-field data-name="glossary" data-type="string" data-required="false" data-desc="一貫した翻訳のための用語集ファイルへのパス。@<file> の形式を使用します。"></x--field>
</x-field-group>

### theme
`theme` コマンドは、ウェブサイトのビジュアルテーマ（生成と適用を含む）を管理します。

#### サブコマンド

**`generate`**
ウェブサイトのデザインとユーザーの提案に基づいて新しいテーマを生成します。

**エイリアス:** `gen`

**使用法:**
```bash テーマの生成 --name "customtheme" icon=lucide:terminal
aigne web theme generate --name "CustomTheme"
```

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="false" data-desc="新しいテーマの名前。"></x-field>
  <x-field data-name="config" data-type="string" data-required="false" data-desc="テーマの基として使用するウェブサイト設定のファイルパス。"></x-field>
</x-field-group>

**`apply`**
以前に生成されたテーマをウェブサイトに適用します。

**エイリアス:** `a`

**使用法:**
```bash テーマの適用 icon=lucide:terminal
aigne web theme apply
```
このサブコマンドには特定のパラメータはありません。現在設定されているテーマを適用します。

### component
`component` コマンドは、ウェブサイトのコンポーネントライブラリを管理します。

**エイリアス:** `comp`

#### サブコマンド

**`pull`**
指定された URL からコンポーネントをプルして、ローカルのコンポーネントライブラリを更新します。

**使用法:**
```bash コンポーネントのプル --url "https://your-pages-kit/api/..." icon=lucide:terminal
aigne web component pull --url "https://your-pages-kit/api/..."
```
<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true" data-desc="コンポーネントライブラリをプルする完全な URL。"></x-field>
</x-field-group>

**`list`**
現在のライブラリで利用可能なコンポーネントをリスト表示します。

**エイリアス:** `ls`, `l`

**使用法:**
```bash コンポーネントのリスト表示 icon=lucide:terminal
aigne web component list
```
このサブコマンドはパラメータを取りません。

### chat
`chat` コマンドは、対話形式でウェブサイトを生成、更新、管理するためのインタラクティブセッションを開始します。これは、`aigne web` が他のコマンドを指定せずに実行された場合に実行されるデフォルトのコマンドです。

**使用法:**
```bash コマンド icon=lucide:terminal
aigne web
```
このコマンドはパラメータを取りません。

### prefs
`prefs` コマンドは、WebSmith がフィードバックから学習して AI の振る舞いをカスタマイズするためのユーザー設定を管理します。

#### サブコマンド
**`list`**
保存されているすべてのユーザー設定をリスト表示します。

**エイリアス:** `ls`

**使用法:**
```bash 設定のリスト表示 icon=lucide:terminal
aigne web prefs list
```
このサブコマンドはパラメータを取りません。

**`remove`**
指定された1つ以上の設定を削除します。

**エイリアス:** `rm`

**使用法:**
```bash 設定の削除 --id "pref_abc123" icon=lucide:terminal
aigne web prefs remove --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="削除する設定 ID の配列。"></x-field>
</x-field-group>

**`toggle`**
1つ以上の設定のアクティブ状態を切り替えます。

**エイリアス:** `t`

**使用法:**
```bash 設定の切り替え --id "pref_abc123" icon=lucide:terminal
aigne web prefs toggle --id "pref_abc123"
```
<x-field-group>
  <x-field data-name="id" data-type="array" data-required="true" data-desc="状態を切り替える設定 ID の配列。"></x-field>
</x-field-group>

### history
`history` コマンドは、ウェブサイトのコンテンツと構造の更新履歴を表示するために使用されます。

#### サブコマンド

**`view`**
更新履歴をコンパクトなログ形式で表示します。各エントリにはハッシュ、日付、操作、および関連するフィードバックが含まれます。

**エイリアス:** `log`, `list`

**使用法:**
```bash 更新履歴の表示 icon=lucide:terminal
aigne web history view
```
このサブコマンドはパラメータを取りません。

### clear
`clear` コマンドは、プロジェクトディレクトリから生成されたファイル、ワークスペースデータ、または設定を削除します。

**使用法:**
```bash クリア --targets "generatedpages" "websiteconfig" icon=lucide:terminal
aigne web clear --targets "generatedPages" "websiteConfig"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false" data-desc="プロンプトなしでクリアする項目の配列。有効な項目：websiteStructure, generatedPages, websiteConfig, deploymentConfig, authTokens, mediaDescription, translationCaches。"></x-field>
  <x-field data-name="pagesDir" data-type="string" data-required="false" data-desc="ソースページのデフォルトディレクトリパスを上書きします。"></x-field>
  <x-field data-name="tmpDir" data-type="string" data-required="false" data-desc="一時ワークスペースのデフォルトディレクトリパスを上書きします。"></x-field>
  <x-field data-name="outputDir" data-type="string" data-required="false" data-desc="生成されたページのデフォルトディレクトリパスを上書きします。"></x-field>
  <x-field data-name="configPath" data-type="string" data-required="false" data-desc="設定ファイルのデフォルトパスを上書きします。"></x-field>
</x-field-group>

---

## まとめ

このリファレンスガイドでは、AIGNE WebSmith CLI の主要なコマンドとパラメータについて詳しく説明しました。タスク指向の手順については、ドキュメントの[ガイド](./guides.md)セクションのガイドを参照してください。
