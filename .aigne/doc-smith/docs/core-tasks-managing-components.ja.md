# コンポーネントの管理

AIGNE WebSmith によって生成されるウェブサイトは、コンポーネントと呼ばれる事前にデザインされた視覚要素のライブラリから構築されます。これらのコンポーネントは、ヒーローセクション、機能リスト、料金表、FAQアコーディオンなど、ページの構成要素です。`component` コマンドを使用すると、このライブラリを管理・更新して、ウェブサイトが最新のデザインと機能にアクセスできるようにします。

このセクションでは、`component pull` コマンドを使用して、ローカルのコンポーネントライブラリを Pages Kit プロジェクトで定義されたものと同期する方法について説明します。

## コンポーネントライブラリの概要

コンポーネントライブラリは、標準化され、再利用可能なページ要素のコレクションです。ウェブサイトを生成する際、WebSmith はこのライブラリから最適なコンポーネントを選択・設定してページを構築します。

このライブラリを最新の状態に保つことは、主に2つの理由から重要です。
1.  **新しいデザインへのアクセス**: 新しいビジュアルコンポーネントがデザインされ、Pages Kit プロジェクトに追加されると、それらをローカルライブラリにプルすることで、AIが使用できるようになります。
2.  **バグ修正と改善**: アップデートには、既存のコンポーネントの改善や修正が含まれている場合があり、ウェブサイトの品質と外観を向上させます。

## コンポーネントのプルと更新

`aigne web component pull` コマンドは、Pages Kit プロジェクトから提供された特定のURLから、コンポーネントライブラリの最新バージョンを取得します。

### コマンド構文

最新のコンポーネントをプルするには、次のコマンド構造を使用します。

```bash
aigne web component pull --url <your_component_pull_url>
```

エイリアス `comp` を使用することもできます。

```bash
aigne web comp pull --url <your_component_pull_url>
```

### パラメータ

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>Pages Kit プロジェクトからコンポーネントをプルするためのユニークなURLです。このURLには、必要なプロジェクトIDとセキュリティ認証情報が含まれています。通常、このURLは Pages Kit のプロジェクト設定ページ内で見つけることができます。</x-field-desc>
  </x-field>
</x-field-group>

### 更新プロセス

コンポーネントライブラリの更新は、簡単ですが重要なプロセスです。以下の手順に注意深く従ってください。

#### ステップ1：プルコマンドの実行

Pages Kit プロジェクトから提供された特定のURLを使用してコマンドを実行します。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

ツールはURLに接続し、最新のコンポーネントライブラリ定義をダウンロードします。

#### ステップ2：変更の確認

ダウンロードが成功すると、WebSmith は変更の概要を表示します。既存のライブラリと新しいライブラリの比較が表示され、「atomic」（基本）コンポーネントと「composite」（複合）コンポーネントの数が詳述されます。

出力例は次のようになります。

```
✅ Pull Components successfully (not saved yet)!
📊 New Components Statistics:
  🔹 Atomic components: 10 (9 → 10)
    • LogoV1 - A component to display a heading and a list of logos...
    • RichText - A RichText component primarily displays the title...
    • NewFeatureCard - A brand new card for features...
  🧩 Composite components: 22 (22 → 22)
    • Logo Wall - Structure - Optional section title...
    • User Review - Structure (top → bottom) - Review Content/Quote...
```

この概要により、適用される前に変更内容を確認することができます。

#### ステップ3：更新の確定

次に、WebSmith はローカルファイルに永続的な変更を加える前に、確認を求めます。

```
Do you want to update (save) the built-in components file? (y/N)
```

-   `y` を押して `Enter` を押すと、更新が続行されます。
-   `n` を押すか、`Enter` を押すと、操作はキャンセルされます。変更は行われません。

#### ステップ4：ウェブサイトの再生成

更新を確定すると、WebSmith は2つの重要なアクションを実行します。

1.  **新しいライブラリの保存**: ローカルの `builtin-component-library.yaml` ファイルを新しいバージョンで上書きします。
2.  **生成されたコンテンツのクリア**: ウェブサイトが新しいコンポーネントで正しく再構築されるように、ワークスペースと出力ディレクトリから **以前に生成されたすべてのページファイルを削除** します。

プロセスが完了すると、確認メッセージと次のステップへのリマインダーが表示されます。

```
💾 New components saved.
🧹 Cleaned previous generated content.
🚀 Next: please run below command to re-generate pages:

  `aigne web generate`
```

次に、`generate` コマンドを実行して、更新されたコンポーネントライブラリを使用してウェブサイトのページを作成する必要があります。

## まとめ

`component pull` コマンドは、ウェブサイトの視覚的な構成要素を中央の Pages Kit リポジトリと同期させるための標準的な手順です。このプロセスには、最新のライブラリのプル、変更の確認、更新の確定、そして最後に新しいコンポーネントを適用するためのウェブサイトの再生成が含まれます。

ページの作成に関する詳細については、[ウェブサイトの生成](./core-tasks-generating-a-website.md) のセクションに進んでください。