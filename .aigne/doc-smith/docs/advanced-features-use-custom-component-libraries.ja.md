# カスタムコンポーネントライブラリの使用

AIGNE WebSmith によって生成されたウェブサイトは、コンポーネントと呼ばれる事前にデザインされた視覚要素のライブラリから構築されます。WebSmith には標準のコンポーネントセットが含まれていますが、Pages Kit プロジェクトを使用して**カスタムコンポーネントライブラリ**を定義および管理できます。これにより、ニーズに合わせたデザインや機能を実現できます。

このセクションでは、`component pull` コマンドを使用して、ローカルのコンポーネントライブラリを Pages Kit プロジェクトで定義されたライブラリと同期する方法について説明します。

## コンポーネントライブラリの概要

カスタムコンポーネントライブラリは、プロジェクトに合わせて調整された、標準化された再利用可能なページ要素のコレクションです。ウェブサイトを生成する際、WebSmith はカスタムコンポーネントを使用してページを構築し、ブランドの一貫性と独自のレイアウトを確保します。

ローカルライブラリを同期させておくことは、主に次の 2 つの理由から重要です。
1.  **新しいデザインへのアクセス**：新しいビジュアルコンポーネントがデザインされ、Pages Kit プロジェクトに追加されると、それらをローカルライブラリにプルすることで、AI が使用できるようになります。
2.  **バグ修正と改善**：アップデートには、既存のコンポーネントの改善や修正が含まれている場合があり、ウェブサイトの品質と外観が向上します。

## カスタムライブラリの同期

`aigne web component pull` コマンドは、Pages Kit プロジェクトから提供された特定の URL からコンポーネントライブラリの最新バージョンを取得します。

### コマンドの構文

最新のコンポーネントをプルするには、次のコマンド構造を使用します。

```bash Component Pull icon=lucide:terminal
aigne web component pull --url <your_component_pull_url>
```

エイリアス `comp` も使用できます。

```bash Component Pull (Alias) icon=lucide:terminal
aigne web comp pull --url <your_component_pull_url>
```

### パラメータ

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>Pages Kit プロジェクトからコンポーネントをプルするためのユニークな URL です。この URL には、必要なプロジェクト ID とセキュリティ認証情報が含まれています。通常、この URL は Pages Kit のプロジェクト設定ページ内にあります。</x-field-desc>
  </x-field>
</x-field-group>

### アップデートプロセス

コンポーネントライブラリの更新は、簡単ですが重要なプロセスです。以下の手順に注意深く従ってください。

#### ステップ 1: プルコマンドの実行

Pages Kit プロジェクトから提供された特定の URL を使用してコマンドを実行します。

```bash Component Pull icon=lucide:terminal
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

ツールは URL に接続し、最新のコンポーネントライブラリ定義をダウンロードします。

#### ステップ 2: 変更点の確認

ダウンロードが成功すると、WebSmith は変更点の概要を表示します。既存のライブラリと新しいライブラリの比較が表示され、「アトミック」（基本）コンポーネントと「コンポジット」（複合）コンポーネントの数が詳細に示されます。

出力の例は次のようになります。

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

この概要により、変更を適用する前に、入ってくる変更を確認できます。

#### ステップ 3: アップデートの確認

WebSmith は、ローカルファイルに永続的な変更を加える前に、確認を求めます。

```
Do you want to update (save) the built-in components file? (y/N)
```

-   `y` を押して `Enter` キーを押すと、アップデートが続行されます。
-   `n` を押すか `Enter` キーを押すと、操作がキャンセルされます。変更は行われません。
 
#### ステップ 4: ウェブサイトの再生成

アップデートを確定すると、WebSmith は 2 つの重要なアクションを実行します。

1.  **新しいライブラリの保存**: ローカルの `builtin-component-library.yaml` ファイルを新しいバージョンで上書きします。
2.  **生成されたコンテンツのクリア**: 新しいコンポーネントでウェブサイトが正しく再構築されるように、ワークスペースと出力ディレクトリから**以前に生成されたすべてのページファイルを削除**します。

プロセスが完了すると、確認メッセージと次のステップのリマインダーが表示されます。

```
💾 New components saved.
🧹 Cleaned previous generated content.
🚀 Next: please run below command to re-generate pages:

  `aigne web generate`
```

更新されたコンポーネントライブラリを使用してウェブサイトのページを作成するために、`generate` コマンドを実行する必要があります。

## まとめ

`component pull` コマンドは、ローカル環境の視覚的なビルディングブロックをカスタム Pages Kit リポジトリと同期させるための標準的な手順です。このプロセスには、最新のライブラリのプル、変更点の確認、アップデートの確定、そして最後に新しいコンポーネントを適用するためのウェブサイトの再生成が含まれます。

ページの作成に関する詳細については、[ウェブサイトの作成](./guides-create-website.md)セクションに進んでください。
