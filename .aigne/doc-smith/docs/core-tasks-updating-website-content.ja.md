# ウェブサイトコンテンツの更新

ウェブサイトの初期バージョンを生成した後、生成されたコンテンツを調整または洗練させる必要が出てくるでしょう。`update` コマンドは、この反復的なプロセスのための主要なツールです。平易な英語でフィードバックを提供することで、ウェブサイトの構造や個々のページの内容を修正できます。

このコマンドは、AI を活用してリクエストを理解し、ウェブサイトファイルに直接適用することで、編集プロセスを効率化します。新しいページの追加、セクションの再編成、見出しの言い換えなど、どのような変更が必要であっても、`update` コマンドは設定ファイルを手動で編集することなく、これらの変更を対話的に行う方法を提供します。

このセクションでは、更新プロセスの概要を説明します。詳細なステップバイステップの手順については、各更新タイプの特定のガイドを参照してください：

<x-cards data-columns="2">
  <x-card data-title="ウェブサイト構造の更新" data-icon="lucide:layout-list" data-href="/core-tasks/updating-website-content/updating-website-structure">
    ウェブサイトのページを追加、削除、名前変更、再編成する方法を学びます。
  </x-card>
  <x-card data-title="ページコンテンツの更新" data-icon="lucide:file-text" data-href="/core-tasks/updating-website-content/updating-page-content">
    特定のページ内のテキスト、セクション、その他の要素を変更する方法を学びます。
  </x-card>
</x-cards>

## 更新ワークフロー

更新プロセスは、対話的で直感的に設計されています。以下に典型的なワークフローの概要を示します：

1.  **コマンドの開始**: プロジェクトディレクトリのターミナルから `aigne web update` コマンドを実行します。
2.  **ページの選択**: ツールが既存のウェブサイトページの一覧を表示します。修正したい特定のページを選択するよう求められます。
3.  **フィードバックの提供**: ページを選択した後、フィードバックを提供するよう求められます。ここで、自然言語で行いたい変更を記述します。例えば、「最初のセクションのタイトルを『私たちのコアバリュー』に変更する」や「ページの最後に新しいFAQセクションを追加する」のように記述できます。
4.  **AI による処理**: AI Agent がフィードバックを分析し、ページの構造やコンテンツに必要な修正を判断します。
5.  **確認と保存**: 変更が適用され、更新されたページコンテンツが保存されます。

## 基本的なコマンドの使用方法

更新プロセスを開始するには、プロジェクトのルートディレクトリに移動し、次のコマンドを実行します：

```bash CLI コマンド icon=lucide:terminal
aigne web update
```

このコマンドは、ページの選択とフィードバックの提供をガイドする対話的なセッションを開始します。

### パラメータ

コマンドは主に対話的ですが、パラメータを使用してプロセスを効率化することができます。

<x-field-group>
  <x-field data-name="feedback" data-type="string" data-required="false">
    <x-field-desc markdown>フィードバックをコマンドライン引数として直接提供し、対話的なフィードバックプロンプトをバイパスします。例：`aigne web update --feedback "Change the main title"`。</x-field-desc>
  </x-field>
  <x-field data-name="pages" data-type="array" data-required="false">
    <x-field-desc markdown>更新する1つ以上のページパスを指定します。これは、同じフィードバックを複数のページに適用したり、特定のページを非対話的にターゲットにする場合に便利です。</x-field-desc>
  </x-field>
</x-field-group>

## まとめ

`update` コマンドは、ウェブサイトの初期作成後にそれを洗練させ、改善するための柔軟なツールです。自然言語によるフィードバックを使用することで、サイト全体の構造と各ページの詳細なコンテンツの両方を効率的に修正できます。

より詳細な手順と例については、関連するサブセクションに進んでください：

*   **次へ**: [ウェブサイト構造の更新](./core-tasks-updating-website-content-updating-website-structure.md)または[ページコンテンツの更新](./core-tasks-updating-website-content-updating-page-content.md)について学びます。
*   **関連資料**: 更新を行った後、[更新履歴の表示](./core-tasks-viewing-update-history.md)で変更を確認できます。