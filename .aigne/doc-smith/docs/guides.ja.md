# ガイド

初期設定を完了し、最初のウェブサイトを生成したら、日常的な操作には主に一連のガイドを使用します。このハブでは、生成、公開、コンテンツの改良、ローカライズ、スタイルの調整といった最も一般的なワークフローをまとめており、必要なタスクに直接ジャンプできます。

各タスクは、簡単なコマンドライン操作で実行できるように設計されています。典型的なワークフローでは、初期サイトを生成し、そのコンテンツや構造を繰り返し更新してから、変更を公開します。

### 標準的なワークフロー

以下の図は、WebSmithでウェブサイトを作成および維持するための標準的で順次的なワークフローを示しています。

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

以下に、これらの各ワークフローに関する詳細なガイドがあります。

<x-cards data-columns="2">
  <x-card data-title="ウェブサイトの生成" data-icon="lucide:bot" data-href="/guides/generate-website">
    `generate` コマンドを使用して、要件をまとめた設定ファイルから完全なウェブサイトを作成する方法を学びます。
  </x-card>
  <x-card data-title="ウェブサイトの公開" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    無料の WebSmith Cloud から独自のカスタムドメインまで、ウェブサイトを公開するためのさまざまなオプションについて説明します。
  </x-card>
  <x-card data-title="ウェブサイトの更新" data-icon="lucide:file-pen-line" data-href="/guides-update-website">
    構造全体を更新する場合と単一ページを更新する場合の違いを理解し、各ワークフローの詳細ガイドに進みます。
  </x-card>
  <x-card data-title="ウェブサイトのローカライズ" data-icon="lucide:languages" data-href="/guides/localize-website">
    `translate` コマンドを使用して、ウェブサイトページの異なる言語バージョンを自動的に作成します。
  </x-card>
  <x-card data-title="テーマのカスタマイズ" data-icon="lucide:palette" data-href="/guides/customize-theme">
    `theme` コマンドを使用して、さまざまなビジュアルスタイルとカラースキームを生成し、ウェブサイトに適用する方法について説明します。
  </x-card>
  <x-card data-title="カスタムコンポーネントライブラリの使用" data-icon="lucide:cubes" data-href="/advanced-features/use-custom-component-libraries">
    `component` コマンドを使用して、ウェブサイトの構築に使用されるコンポーネントライブラリを取得および更新する方法を説明します。
  </x-card>
  <x-card data-title="インタラクティブチャットの使用 (ベータ版)" data-icon="lucide:message-square-plus" data-href="/guides/use-interactive-chat-beta">
    `chat` コマンドを使用して、対話形式でウェブサイトを構築および変更する方法を学びます。
  </x-card>
  <x-card data-title="設定の管理" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    `prefs` コマンドを使用して、保存されたユーザー設定を表示、管理、クリアして WebSmith の動作をカスタマイズする方法を説明します。
  </x-card>
  <x-card data-title="更新履歴の表示" data-icon="lucide:history" data-href="/guides/view-update-history">
    `history` コマンドを使用して、ウェブサイトのコンテンツと構造に加えられたすべての以前の更新ログを確認する方法を学びます。
  </x-card>
  <x-card data-title="ワークスペースのクリーンアップ" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    `clear` コマンドを使用して、生成されたファイル、ワークスペースデータ、または設定全体を安全に削除する方法を示します。
  </x-card>
</x-cards>

---

このセクションでは、ウェブサイトを管理するための基本的なコマンドについて説明します。利用可能なすべてのコマンドとそのパラメータの包括的なリストについては、[コマンドラインリファレンス](./reference-command-line-reference.md)を参照してください。