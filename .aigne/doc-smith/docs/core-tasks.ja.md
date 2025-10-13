# コアタスク

初期設定を完了し、最初のウェブサイトを生成したら、日常の運用では主に一連のコアコマンドを使用することになります。このセクションでは、サイトの生成、更新の公開、コンテンツの改良、翻訳の管理など、これらの重要なタスクの実践的な概要を説明します。

各タスクは、簡単なコマンドライン操作として設計されています。典型的なワークフローは、初期サイトの生成、そのコンテンツや構造の反復的な更新、そして変更の公開という流れになります。

### 標準的なワークフロー

以下の図は、WebSmith を使用してウェブサイトを作成し、維持するための標準的なシーケンシャルワークフローを示しています。

```d2
direction: down

config: {
  label: "1. 要件を定義\n(例: my-website.yaml)"
  shape: rectangle
}

generate: {
  label: "2. ウェブサイトを生成\n`aigne web generate`"
  shape: rectangle
}

update: {
  label: "3. コンテンツを改良\n`aigne web update`"
  shape: rectangle
}

publish: {
  label: "4. ウェブサイトを公開\n`aigne web publish`"
  shape: rectangle
}

live_site: {
  label: "公開中のウェブサイト"
  shape: cylinder
}

config -> generate: "初期作成"
generate -> update: "レビューと改良"
update -> update: "反復的な変更"
update -> publish: "変更をデプロイ"
publish -> live_site: "公開"
```

以下に、これらの各コアタスクの詳細なガイドを示します。

<x-cards data-columns="2">
  <x-card data-title="ウェブサイトの生成" data-icon="lucide:bot" data-href="/core-tasks/generating-a-website">
    `generate` コマンドを使用して、要件をまとめた設定ファイルから完全なウェブサイトを作成する方法を学びます。
  </x-card>
  <x-card data-title="ウェブサイトの公開" data-icon="lucide:upload-cloud" data-href="/core-tasks/publishing-your-website">
    無料の WebSmith Cloud から独自のカスタムドメインまで、ウェブサイトを公開するためのさまざまなオプションを調べます。
  </x-card>
  <x-card data-title="ウェブサイトコンテンツの更新" data-icon="lucide:file-pen-line" data-href="/core-tasks/updating-website-content">
    `update` コマンドを使用して、既存ページのコンテンツを改良するための変更やフィードバックを提供する方法を理解します。
  </x-card>
  <x-card data-title="コンテンツの翻訳" data-icon="lucide:languages" data-href="/core-tasks/translating-your-content">
    `translate` コマンドを使用して、ウェブサイトページのさまざまな言語バージョンを自動的に作成します。
  </x-card>
  <x-card data-title="テーマの管理" data-icon="lucide:palette" data-href="/core-tasks/managing-themes">
    `theme` コマンドを使用して、ウェブサイトにさまざまなビジュアルスタイルやカラースキームを生成し、適用する方法について説明します。
  </x-card>
  <x-card data-title="コンポーネントの管理" data-icon="lucide:cubes" data-href="/core-tasks/managing-components">
    `component` コマンドを使用して、ウェブサイトの構築に使用されるコンポーネントライブラリを取得し、更新する方法を説明します。
  </x-card>
  <x-card data-title="インタラクティブチャットの使用" data-icon="lucide:message-square-plus" data-href="/core-tasks/using-the-interactive-chat">
    `chat` コマンドを使用して、対話形式でウェブサイトをインタラクティブに構築および修正する方法を学びます。
  </x-card>
  <x-card data-title="設定の管理" data-icon="lucide:settings-2" data-href="/core-tasks/managing-preferences">
    `prefs` コマンドを使用して、保存されたユーザー設定を表示、管理、クリアし、WebSmith の動作をカスタマイズする方法を説明します。
  </x-card>
  <x-card data-title="更新履歴の表示" data-icon="lucide:history" data-href="/core-tasks/viewing-update-history">
    `history` コマンドを使用して、ウェブサイトのコンテンツと構造に加えられたすべての以前の更新のログを確認する方法を学びます。
  </x-card>
  <x-card data-title="ワークスペースとデータのクリア" data-icon="lucide:trash-2" data-href="/core-tasks/clearing-generated-content">
    `clear` コマンドを使用して、生成されたファイル、ワークスペースデータ、または設定全体を安全に削除する方法を示します。
  </x-card>
</x-cards>

---

このセクションでは、ウェブサイトを管理するための基本的なコマンドについて説明しました。利用可能なすべてのコマンドとそのパラメータの包括的なリストについては、[コマンドラインリファレンス](./reference-command-line-reference.md) を参照してください。