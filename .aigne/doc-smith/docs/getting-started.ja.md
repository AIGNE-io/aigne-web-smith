# はじめに

このガイドでは、AIGNE WebSmith を使用して、初めての本格的で完成されたウェブサイトを生成するための手順をステップバイステップで解説します。全体のプロセスは30分未満で完了するように設計されており、事前のコーディング知識は一切不要です。

この手順に従うことで、必要なツールをインストールし、ウェブサイトの要件を定義し、たった一つのコマンドで全てのページとコンテンツを自動生成することができます。

### プロセスの概要

コンセプトからウェブサイト公開までの道のりは、主に3つのステージで構成されています。各ステージは前のステージを基にした論理的なステップであり、スムーズで予測可能な結果を保証します。

```d2
direction: down

step1: {
  label: "1. インストール"
  shape: oval
}

step2: {
  label: "2. コンテンツの準備"
  shape: oval
}

step3: {
  label: "3. 初めてのウェブサイト作成"
  shape: oval
}

result: {
  label: "完成したウェブサイト"
  shape: rectangle
  style.fill: "#D5E8D4"
}

step1 -> step2: "CLIツールのインストール"
step2 -> step3: "ウェブサイトの目標を定義"
step3 -> result: "ワンコマンドで生成"
```

### 新しいウェブサイト作成への道筋

まずは、以下のセクションを順番に進めてください。各セクションには、プロセス各段階の詳細な手順が記載されています。

<x-cards>
  <x-card data-title="インストール" data-icon="lucide:download" data-href="/getting-started/installation">
    WebSmithの使用に不可欠なツールであるAIGNEコマンドラインインターフェース（CLI）のインストール方法を、明確にステップバイステップで説明します。
  </x-card>
  <x-card data-title="コンテンツの準備" data-icon="lucide:clipboard-list" data-href="/getting-started/preparing-your-content">
    準備しておくべき主要な情報やコンテンツのアイデアについて説明します。適切な準備をすることで、AIがあなたのニーズに最適なウェブサイトを生成する手助けとなります。
  </x-card>
  <x-card data-title="初めてのウェブサイト作成" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
    簡単な設定ファイルを作成し、1つのコマンドで完全なマルチページウェブサイトを生成するまでをガイドする、実践的なチュートリアルです。
  </x-card>
</x-cards>

### まとめ

このセクションで説明した手順を完了すると、新しいウェブサイトが正常に生成されているはずです。次のステップは、サイトの管理、更新、公開方法を学ぶことです。

サイトのクラウドへの公開、コンテンツの更新、その他の一般的なタスクの実行に関する詳細なガイドについては、[コアタスク](./core-tasks.md)のセクションに進んでください。