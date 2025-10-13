# コマンドラインリファレンス

このドキュメントは、AIGNE WebSmith コマンドラインインターフェース（CLI）で利用可能なすべてのコマンドに関する包括的なリファレンスを提供します。各エントリには、コマンドの機能の説明、利用可能なエイリアス、およびそのパラメータとオプションの詳細なリストが含まれています。

すべてのコマンドの一般的な構文は次のとおりです：
```bash
aigne web <command> [subcommand] [options]
```

## メインコマンド

次の表は、AIGNE WebSmith CLI で利用可能な主要なコマンドの概要を示しています。

| コマンド | 説明 |
| :--- | :--- |
| [generate](#generate) | 設定ファイルに基づいて完全なウェブサイトを生成します。 |
| [publish](#publish) | Pages Kit プラットフォームに生成されたウェブサイトのコンテンツを公開します。 |
| [update](#update) | 新しいフィードバックや要件に基づいて既存のウェブサイトのコンテンツを修正します。 |
| [translate](#translate) | 既存のウェブサイトページを異なる言語に翻訳します。 |
| [theme](#theme) | ウェブサイトのビジュアルテーマを管理します。これには生成と適用が含まれます。 |
| [component](#component) | ウェブサイトの構築に使用されるコンポーネントライブラリを管理します。 |
| [chat](#chat) | 対話形式でウェブサイトを構築・修正するためのインタラクティブなチャットセッションを開始します。 |
| [prefs](#prefs) | WebSmith の動作をカスタマイズする、保存されたユーザー設定を管理します。 |
| [history](#history) | ウェブサイトに加えられたすべての過去の更新ログを表示します。 |
| [clear](#clear) | 生成されたファイル、ワークスペースデータ、または設定を削除します。 |

---

### generate
ユーザーが提供した設定ファイルから完全なウェブサイトを生成します。このコマンドは、サイト構造の計画からページコンテンツやテンプレートの生成まで、プロセス全体を統括します。

**エイリアス:** `gen`, `g`

**使用方法:**
```bash
aigne web generate --input @path/to/your/config.yaml
```

**パラメータ:**

<x-field-group>
  <x-field data-name="config" data-type="String" data-required="true" data-desc="ウェブサイトの設定ファイルへのパス。通常、--input フラグを介して提供されます。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="生成されるコンテンツ全体で一貫した用語を保証するための用語集を含むファイル。@<file> の形式を使用します。"></x-field>
  <x-field data-name="forceRegenerate" data-type="Boolean" data-required="false" data-desc="true に設定すると、ページが既に存在する場合でも、すべてのページを強制的に再生成します。"></x-field>
</x-field-group>

### publish
生成されたウェブサイトファイルを Pages Kit インスタンスに公開します。このコマンドはバッチアップロードを処理し、ステータスの監視を提供します。

**エイリアス:** `pub`, `p`

**使用方法:**
```bash
aigne web publish --appUrl "https://your-pages-kit-url.com"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="appUrl" data-type="String" data-required="false" data-desc="ページの公開先となるターゲット Pages Kit ウェブサイトのベース URL。"></x-field>
  <x-field data-name="with-navigations" data-type="Boolean" data-required="false" data-desc="true に設定すると、ページとともにウェブサイトのナビゲーションデータも公開します。"></x-field>
  <x-field data-name="with-locales" data-type="Boolean" data-required="false" data-desc="true に設定すると、ウェブサイトのロケールと言語設定も公開します。"></x-field>
</x-field-group>

### update
ユーザーのフィードバックに基づいて既存のウェブサイトのコンテンツを更新します。このコマンドは、テキストの洗練、新しいセクションの追加、またはページ構造の変更に使用できます。

**エイリアス:** `up`

**使用方法:**
```bash
aigne web update --pages "/about-us" --feedback "Add a new section for team members."
```

**パラメータ:**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="更新するページパスの配列（例：/about-us, /contact）。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="コンテンツに必要な変更や改善に関する詳細な説明。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="一貫性を保つための用語集を含むファイル。@<file> の形式を使用します。"></x-field>
</x-field-group>

### translate
既存のウェブサイトページのコンテンツを、指定された1つ以上の言語に翻訳します。

**使用方法:**
```bash
aigne web translate --pages "/home" --langs "fr,de,es"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="pages" data-type="Array" data-required="false" data-desc="翻訳するページパスの配列。"></x-field>
  <x-field data-name="langs" data-type="Array" data-required="false" data-desc="コンテンツを翻訳する先の言語コードの配列。利用可能なコード：en, zh, zh-TW, ja, fr, de, es, it, ru, ko, pt, ar。"></x-field>
  <x-field data-name="feedback" data-type="String" data-required="false" data-desc="翻訳の品質を向上させるための具体的な指示やフィードバック。"></x-field>
  <x-field data-name="glossary" data-type="String" data-required="false" data-desc="一貫した翻訳のための用語集を含むファイル。@<file> の形式を使用します。"></x-field>
</x-field-group>

### theme
ウェブサイトのビジュアルテーマを管理します。デザインの好みに基づいて新しいテーマを生成し、サイトに適用できます。

#### サブコマンド

**`generate`** (エイリアス: `gen`)
ウェブサイトのデザインに基づいて新しいテーマ設定を生成します。

**使用方法:**
```bash
aigne web theme generate --name "MyCustomTheme" --config @path/to/config.yaml
```

**パラメータ:**

<x-field-group>
  <x-field data-name="name" data-type="String" data-required="false" data-desc="新しいテーマの一意の名前。"></x-field>
  <x-field data-name="config" data-type="String" data-required="false" data-desc="テーマの基となるウェブサイトの設定ファイルへのパス。"></x-field>
</x-field-group>

**`apply`**
以前に生成されたテーマをウェブサイトに適用します。

**使用方法:**
```bash
aigne web theme apply
```

### component
ウェブサイトのコンポーネントライブラリを管理します。

**エイリアス:** `comp`

#### サブコマンド

**`pull`**
指定されたURLから更新されたコンポーネントライブラリを取得します。これにより、ウェブサイトが最新のビジュアルコンポーネントで構築されることが保証されます。

**使用方法:**
```bash
aigne web component pull --url "https://your-pages-kit/api/..."
```

**パラメータ:**

<x-field-group>
  <x-field data-name="url" data-type="String" data-required="true" data-desc="コンポーネントライブラリを取得するために Pages Kit インスタンスから提供される完全な URL。"></x-field>
</x-field-group>

### chat
対話形式でウェブサイトを生成、更新、管理できるインタラクティブなチャットセッションを開始します。チャット Agent は他のすべてのコマンドにアクセスできます。

**使用方法:**
```bash
aigne web chat
```

このコマンドはパラメータを取りません。ターミナルでインタラクティブなプロンプトが開きます。

### prefs
WebSmith が時間とともにフィードバックから学習するユーザー設定を管理します。これらの設定は、AI の出力を特定のニーズに合わせて調整するのに役立ちます。

**使用方法:**
```bash
# 保存されているすべての設定を一覧表示
aigne web prefs --list

# ID で特定の設定を削除
aigne web prefs --remove --id "pref_abc123"
```

**パラメータ:**

<x-field-group>
  <x-field data-name="--list" data-type="Flag" data-required="false" data-desc="保存されているすべてのユーザー設定をフォーマットされたリストで表示します。"></x-field>
  <x-field data-name="--remove" data-type="Flag" data-required="false" data-desc="1つ以上の設定を削除します。--id パラメータが必要か、選択を求めるプロンプトが表示されます。"></x-field>
  <x-field data-name="--toggle" data-type="Flag" data-required="false" data-desc="1つ以上の設定のアクティブ状態を切り替えます。--id が必要か、プロンプトが表示されます。"></x-field>
  <x-field data-name="--id" data-type="Array" data-required="false" data-desc="管理対象（削除または切り替え）の設定 ID の配列。非インタラクティブに --remove または --toggle を使用する場合にのみ必要です。"></x-field>
</x-field-group>

### history
ウェブサイトのコンテンツと構造の更新履歴を表示します。

#### サブコマンド

**`view`** (エイリアス: `log`, `list`)
`git log` に似た、コンパクトなログ形式で更新履歴を表示します。各エントリには、一意のハッシュ、更新日、実行された操作、および提供されたフィードバックが含まれます。

**使用方法:**
```bash
aigne web history view
```

このコマンドはパラメータを取りません。

### clear
生成されたファイル、ワークスペースデータ、または設定を安全に削除します。これは、最初からやり直したり、プロジェクトディレクトリをクリーンアップしたりするのに便利です。

**使用方法:**
```bash
# プロンプトなしで一時的なワークスペースと生成されたページをクリア
aigne web clear --targets workspace generatedPages
```

**パラメータ:**

<x-field-group>
  <x-field data-name="targets" data-type="Array" data-required="false" data-desc="プロンプトなしでクリアするアイテムの配列。指定可能な値：workspace, generatedPages, websiteConfig, deploymentConfig, authTokens, mediaDescription。"></x-field>
  <x-field data-name="pagesDir" data-type="String" data-required="false" data-desc="ソースページのデフォルトのディレクトリパスを上書きします。"></x-field>
  <x-field data-name="tmpDir" data-type="String" data-required="false" data-desc="一時ワークスペースのデフォルトのディレクトリパスを上書きします。"></x-field>
  <x-field data-name="outputDir" data-type="String" data-required="false" data-desc="生成されたページのデフォルトのディレクトリパスを上書きします。"></x-field>
  <x-field data-name="configPath" data-type="String" data-required="false" data-desc="設定ファイルのデフォルトパスを上書きします。"></x-field>
</x-field-group>

## まとめ

このリファレンスガイドは、AIGNE WebSmith CLI の主要なコマンドとそのパラメータをカバーしています。より詳細なタスク指向の説明については、[コアタスク](./core-tasks.md)セクションのガイドを参照してください。