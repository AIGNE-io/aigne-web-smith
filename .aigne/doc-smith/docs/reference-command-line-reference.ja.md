# コマンドラインリファレンス

このドキュメントは、AIGNE WebSmith コマンドラインインターフェース（CLI）で利用可能なすべてのコマンドに関する包括的なリファレンスを提供します。各コマンドについて、その目的、利用可能なパラメータ、および実用的な使用例を詳述しています。

このガイドは、高度な操作や自動化スクリプトのために詳細な情報を必要とするユーザーを対象としています。

## コマンドの概要

以下の表は、利用可能なすべての `aigne web` サブコマンドの概要をまとめたものです。

| コマンド | エイリアス | 説明 |
| :--- | :--- | :--- |
| `generate` | `gen`, `g` | 一連の要件から完全なウェブサイトを生成します。 |
| `publish` | - | 生成されたウェブサイトのコンテンツを Pages Kit に公開します。 |
| `update` | - | 新しいフィードバックや要件に基づいて、既存のウェブサイトのコンテンツを更新します。 |
| `translate` | - | 既存のウェブサイトのページを異なる言語に翻訳します。 |
| `chat` | - | ウェブサイトを構築・修正するための対話型チャットセッションを開始します。 |
| `theme` | - | ウェブサイトのビジュアルテーマ（生成と適用を含む）を管理します。 |
| `component` | `comp` | ウェブサイトの構築に使用されるコンポーネントライブラリを管理します。 |
| `prefs` | - | 更新時のフィードバックから学習したユーザー設定を管理します。 |
| `history` | - | ウェブサイトに行われたすべての過去の更新ログを表示します。 |
| `clear` | - | 生成されたファイル、ワークスペースデータ、または設定を削除します。 |

---

## メインコマンド

これらのコマンドは、WebSmith を使用してウェブサイトを作成・管理するためのコアワークフローを形成します。

### generate

`generate` コマンドは、新しいウェブサイトを作成するための主要なツールです。一連の AI Agent を組織化して、サイト構造を計画し、各ページのコンテンツを作成し、最終的なデータファイルを構成します。

**使用法**

```bash
aigne web generate [options]
```

**パラメータ**

<x-field-group>
  <x-field data-name="rules" data-type="string" data-required="true">
    <x-field-desc markdown>ウェブサイトの要件、構造、コンテンツに関する詳細な説明。これは文字列として、または入力ファイル（例：`--input @my-website.yaml`）を介して提供できます。</x-field-desc>
  </x-field>
  <x-field data-name="targetAudience" data-type="string" data-required="false">
    <x-field-desc markdown>ウェブサイトの対象読者の説明。これにより、AI はコンテンツのトーンと焦点を調整しやすくなります。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-default="zh" data-required="false">
    <x-field-desc markdown>ウェブサイトコンテンツのターゲット言語（例：英語の場合は `en`、中国語の場合は `zh`）。</x-field-desc>
  </x-field>
  <x-field data-name="websiteStyle" data-type="string" data-default="business" data-required="false">
    <x-field-desc markdown>ウェブサイトに希望する視覚的およびテキストのスタイル（例：`business`、`creative`、`minimalist`）。</x-field-desc>
  </x-field>
  <x-field data-name="projectId" data-type="string" data-required="false">
    <x-field-desc markdown>Pages Kit のプロジェクトID。これを指定すると、生成されるコンポーネントの調整や公開準備に役立ちます。</x-field-desc>
  </x-field>
</x-field-group>

**例**

この例では、外部のYAMLファイルを使用して生成ルールを提供します。

```bash title="入力ファイルを使用してウェブサイトを生成する"
aigne web generate --input @my-website.yaml
```

```yaml title="my-website.yaml"
rules: |
  Create a modern SaaS product website that includes:
  1. A homepage with a clear value proposition.
  2. A features page detailing the product's capabilities.
  3. A pricing page with multiple subscription tiers.
  4. A contact page with a form.
targetAudience: "Small to medium-sized business owners"
locale: en
websiteStyle: business
```

### publish

`publish` コマンドは、生成されたウェブサイトのページを Pages Kit プロジェクトにアップロードし、公開します。

**使用法**

```bash
aigne web publish [options]
```

**パラメータ**

<x-field-group>
  <x-field data-name="projectId" data-type="string" data-required="true">
    <x-field-desc markdown>ウェブサイトが公開される Pages Kit プロジェクトの一意の識別子。</x-field-desc>
  </x-field>
  <x-field data-name="locale" data-type="string" data-required="false">
    <x-field-desc markdown>公開するサイトの言語バージョンを指定します。指定しない場合、デフォルトのロケールが使用されます。</x-field-desc>
  </x-field>
  <x-field data-name="dryRun" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>`true` に設定すると、コマンドは実際の変更を行わずに公開プロセスをシミュレートし、何がアップロードされるかを表示します。</x-field-desc>
  </x-field>
  <x-field data-name="overwrite" data-type="boolean" data-default="false" data-required="false">
    <x-field-desc markdown>`true` に設定すると、Pages Kit 上の同じパスを持つ既存のページは上書きされます。注意して使用してください。</x-field-desc>
  </x-field>
</x-field-group>

**例**

```bash title="サイトの英語版を公開する"
aigne web publish --projectId "your-project-id" --locale en --overwrite
```

### update

`update` コマンドを使用すると、既存のウェブサイトのコンテンツを洗練させることができます。フィードバックや新しい指示を提供して、特定のページの構造や詳細を変更できます。

**使用法**

```bash
aigne web update
```

このコマンドは対話モードで実行され、ページの選択と更新のためのフィードバック提供のプロセスをガイドします。

### translate

`translate` コマンドは、既存のウェブサイトページの新しい言語バージョンを生成します。ソースロケールのコンテンツを読み取り、ターゲット言語で対応するページを作成します。

**使用法**

```bash
aigne web translate
```

このコマンドは対話モードで実行され、翻訳元のページとターゲット言語を選択するよう促します。

### chat

`chat` コマンドは、ウェブサイトを構築または修正するための対話型の会話セッションを開始します。このモードでは、自然言語で指示を出すことができ、AI は新しいページの作成、コンテンツの変更、サイト構造の計画など、対応するアクションを実行します。

**使用法**

```bash
aigne web chat
```

## 管理コマンド

これらのコマンドは、ウェブサイトプロジェクトに関連するアセット、設定、履歴の管理に使用されます。

### theme

`theme` コマンドグループは、ウェブサイトの視覚的なスタイリングを管理するために使用されます。

#### theme generate

デザイン要件に基づいて新しいテーマ設定を作成します。

**使用法**

```bash
aigne web theme generate --name "My Custom Theme"
```

**パラメータ**

<x-field-group>
  <x-field data-name="name" data-type="string" data-required="true">
    <x-field-desc markdown>作成する新しいテーマの一意の名前。</x-field-desc>
  </x-field>
  <x-field data-name="config" data-type="string" data-required="false">
    <x-field-desc markdown>デフォルト設定を上書きする必要がある場合の設定ファイルへのパス。</x-field-desc>
  </x-field>
</x-field-group>

#### theme apply

以前に生成されたテーマをウェブサイトに適用します。

**使用法**

```bash
aigne web theme apply
```

このコマンドは対話形式で実行され、適用するテーマを選択できます。

### component

`component` コマンドグループは、ウェブサイトのページを構築するために使用されるビジュアルコンポーネント（例：Hero、FAQ、CTA）のライブラリを管理します。

#### component pull

指定された Pages Kit プロジェクトのURLからコンポーネントライブラリを取得します。これにより、ローカルプロジェクトがページ生成のために利用可能な最新のコンポーネントを持つことが保証されます。

**使用法**

```bash
aigne web component pull --url "your-pages-kit-url"
```

**パラメータ**

<x-field-group>
  <x-field data-name="url" data-type="string" data-required="true">
    <x-field-desc markdown>Pages Kit プロジェクトのコンポーネント取得エンドポイントへの完全なURL。このURLには、必要なプロジェクトIDと認証シークレットが含まれています。</x-field-desc>
  </x-field>
</x-field-group>

### prefs

`prefs` コマンドを使用すると、コンテンツ更新時のフィードバックから WebSmith が学習したユーザー設定を表示および管理できます。これらの設定は、将来の操作で AI があなたのスタイルにより良く合わせるのに役立ちます。

**使用法**

```bash
aigne web prefs [action] [options]
```

**アクションとパラメータ**

<x-field-group>
  <x-field data-name="--list" data-type="boolean" data-required="false">
    <x-field-desc markdown>保存されているすべての設定を表示し、そのステータス（アクティブ/非アクティブ）、スコープ、内容を示します。</x-field-desc>
  </x-field>
  <x-field data-name="--remove" data-type="boolean" data-required="false">
    <x-field-desc markdown>1つ以上の設定を削除します。`--id` と一緒に使用するか、IDが指定されていない場合は対話形式で使用できます。</x-field-desc>
  </x-field>
  <x-field data-name="--toggle" data-type="boolean" data-required="false">
    <x-field-desc markdown>1つ以上の設定のアクティブステータスを切り替えます。`--id` と一緒に使用するか、対話形式で使用できます。</x-field-desc>
  </x-field>
  <x-field data-name="--id" data-type="array" data-required="false">
    <x-field-desc markdown>`--remove` または `--toggle` アクションで操作対象となる設定の一意のIDを指定します。</x-field-desc>
  </x-field>
</x-field-group>

**例**

```bash title="保存されているすべての設定を一覧表示する"
aigne web prefs --list
```

```bash title="IDで特定の設定を削除する"
aigne web prefs --remove --id "pref_abc123"
```

### history

`history` コマンドグループは、ウェブサイトに加えられた変更のログへのアクセスを提供します。

#### history view

更新履歴をコンパクトな git-log スタイルの形式で表示します。各エントリには、一意のハッシュ、変更日、実行された操作、および更新を促したフィードバックが含まれます。

**使用法**

```bash
aigne web history view
```

### clear

`clear` コマンドは、生成されたコンテンツを削除し、ワークスペースの一部をリセットするために使用されます。これは、新規に開始したり、ディスクスペースをクリーンアップしたりするのに役立ちます。

**使用法**

```bash
aigne web clear
```

このコマンドはデフォルトで対話モードで実行され、クリアする項目を選択できます。ターゲットを直接指定することもできます。

**パラメータ**

<x-field-group>
  <x-field data-name="targets" data-type="array" data-required="false">
    <x-field-desc markdown>プロンプトなしでクリアする項目の配列。有効な値は `workspace`、`generatedPages`、および `websiteConfig` です。</x-field-desc>
  </x-field>
</x-field-group>

**例**

```bash title="ワークスペースと生成されたページを非対話形式でクリアする"
aigne web clear --targets workspace generatedPages
```