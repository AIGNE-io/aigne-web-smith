# カスタムコンポーネントライブラリの使用

AIGNE WebSmith によって生成されるウェブサイトは、コンポーネントと呼ばれる事前に設計された視覚要素のライブラリから構築されます。WebSmith には標準のコンポーネントセットが含まれていますが、Pages Kit プロジェクトを使用して **カスタムコンポーネントライブラリ** を定義・管理できます。これにより、ニーズに合わせた特定のデザインや機能を実現できます。

このセクションでは、`component pull` コマンドを使用して、ローカルのコンポーネントライブラリを Pages Kit プロジェクトで定義されたものと同期する方法について説明します。

## コンポーネントライブラリの概要

カスタムコンポーネントライブラリは、プロジェクトに合わせて調整された、標準化された再利用可能なページ要素のコレクションです。ウェブサイトを生成する際、WebSmith はカスタムコンポーネントを使用してページを構築し、ブランドの一貫性と独自のレイアウトを確保します。

ローカルライブラリを同期させておくことは、主に2つの理由で重要です：
1.  **新しいデザインへのアクセス**: 新しいビジュアルコンポーネントが設計され、Pages Kit プロジェクトに追加されると、それらをローカルライブラリにプルすることで、AI が使用できるようになります。
2.  **バグ修正と改善**: アップデートには、既存のコンポーネントの改善や修正が含まれている場合があり、ウェブサイトの品質と外観が向上します。

## カスタムライブラリの同期

`aigne web component pull` コマンドは、Pages Kit プロジェクトから提供された特定の URL からコンポーネントライブラリの最新バージョンを取得します。

### コマンド構文

最新のコンポーネントをプルするには、次のコマンド構造を使用します：

```bash
aigne web component pull --url <your_component_pull_url>
```

エイリアス `comp` を使用することもできます：

```bash
aigne web comp pull --url <your_component_pull_url>
```

### パラメータ

<x-field-group>
  <x-field data-name="--url" data-type="string" data-required="true">
    <x-field-desc markdown>Pages Kit プロジェクトからコンポーネントをプルするためのユニークな URL です。この URL には、必要なプロジェクト ID とセキュリティ認証情報が含まれています。通常、この URL は Pages Kit のプロジェクト設定ページ内で見つけることができます。</x-field-desc>
  </x-field>
</x-field-group>

### 更新プロセス

コンポーネントライブラリの更新は、簡単ですが重要なプロセスです。以下の手順に注意深く従ってください。

#### ステップ1：プルコマンドの実行

Pages Kit プロジェクトから提供された特定の URL を使用してコマンドを実行します。

```bash
aigne web component pull --url "https://your-pages-kit/api/projects/your-project-id/components/pull?secret=your-secret&hash=your-hash"
```

ツールは URL に接続し、最新のコンポーネントライブラリ定義をダウンロードします。

#### ステップ2：変更の確認

ダウンロードが成功すると、WebSmith は変更の概要を表示します。既存のライブラリと新しいライブラリの比較が表示され、「アトミック」（基本）コンポーネントと「コンポジット」（複合）コンポーネントの数が詳細に示されます。

出力例は次のようになります：

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

この概要により、適用される前に受信した変更内容を確認できます。

#### ステップ3：更新の確認

その後、WebSmith はローカルファイルに永続的な変更を加える前に、確認を求めます。

```
Do you want to update (save) the built-in components file? (y/N)
```

-   `y` を押して `Enter` キーを押すと、更新が続行されます。
-   `n` を押すか、`Enter` キーを押すと、操作がキャンセルされます。変更は行われません。
 
#### ステップ4：ウェブサイトの再生成

更新を確認すると、WebSmith は2つの重要なアクションを実行します：

1.  **新しいライブラリの保存**: ローカルの `builtin-component-library.yaml` ファイルを新しいバージョンで上書きします。
2.  **生成されたコンテンツのクリア**: ウェブサイトが新しいコンポーネントで正しく再構築されるように、ワークスペースと出力ディレクトリから **以前に生成されたすべてのページファイルを削除** します。

プロセスが完了すると、確認メッセージと次のステップのリマインダーが表示されます。

```
💾 New components saved.
🧹 Cleaned previous generated content.
🚀 Next: please run below command to re-generate pages:

  `aigne web generate`
```

更新されたコンポーネントライブラリを使用してウェブサイトのページを作成するために、`generate` コマンドを実行する必要があります。

## まとめ

`component pull` コマンドは、ローカル環境の視覚的なビルディングブロックをカスタム Pages Kit リポジトリと同期させるための標準的な手順です。このプロセスには、最新のライブラリのプル、変更の確認、更新の承認、そして最後に新しいコンポーネントを適用するためのウェブサイトの再生成が含まれます。

ページの作成に関する詳細については、[ウェブサイトの生成](./core-tasks-generating-a-website.md)セクションに進んでください。