# はじめに

このガイドでは、AIGNE WebSmithを使い始めるための基本的な手順を説明します。これらの指示に従うことで、インストールから最初のウェブサイトの生成と表示までを30分以内に行うことができます。このプロセスは3つの論理的な段階に分かれており、明確で効率的なセットアップを保証します。

プロセスを視覚的に理解しやすくするために、これから行う手順の簡単なフローチャートを以下に示します。

```d2
direction: down

Install: {
  label: "1. AIGNE CLIのインストール"
  shape: rectangle
}

Prepare: {
  label: "2. コンテンツの準備"
  shape: rectangle
}

Generate: {
  label: "3. 最初のウェブサイトの生成"
  shape: rectangle
}

View: {
  label: "4. ウェブサイトの表示"
  shape: oval
}

Install -> Prepare -> Generate -> View
```

スムーズで成功したスタートを切るために、以下のガイドを順番に従ってください。

<x-cards data-columns="3">
  <x-card data-title="インストール" data-icon="lucide:download-cloud" data-href="/getting-started/installation">
    WebSmithを使用するために必要なAIGNE CLIのインストール方法をステップバイステップで説明します。
  </x-card>
  <x-card data-title="コンテンツの準備" data-icon="lucide:folder-check" data-href="/getting-started/preparing-your-content">
    AIがあなたのニーズに最適なウェブサイトを生成するために、どのようなコンテンツや情報を準備すべきかを説明します。
  </x-card>
  <x-card data-title="最初のウェブサイト" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
    簡単な設定ファイルを作成し、単一のコマンドで完全なウェブサイトを生成する手順を実践的に解説するクイックチュートリアルです。
  </x-card>
</x-cards>

このセクションを完了すると、AIGNE WebSmithによって生成された機能的なウェブサイトが手に入ります。基本的なワークフローを理解し、サイトを管理・強化するためのより高度な機能を探求する準備が整います。

日常的な操作の詳細については、[コアタスク](./core-tasks.md)のセクションに進んでください。