# ガイド

ウェブサイトの日常的な管理が必要ですか？このセクションでは、サイトの作成、更新の公開、翻訳の管理、外観のカスタマイズなど、一般的な操作についてステップバイステップのガイドを提供します。これらのチュートリアルに従って、ウェブサイトをスムーズに運営してください。

以下の図は、これらのコマンドを使用してウェブサイトを管理する一般的なライフサイクルを示しています：
```d2
direction: down

User: {
  shape: c4-person
}

Local-Workspace: {
  label: "ローカルワークスペース"
  shape: rectangle
  style.stroke-dash: 4

  websmith-create: {
    label: "1. websmith create"
  }

  Development-Cycle: {
    label: "2. 開発サイクル（反復）"
    shape: rectangle
    websmith-update: {
      label: "websmith update"
    }
    websmith-theme: {
      label: "websmith theme"
    }
    websmith-translate: {
      label: "websmith translate"
    }
  }

  websmith-publish: {
    label: "3. websmith publish"
  }
}

WebSmith-Cloud: {
  label: "WebSmith クラウド"
  shape: cylinder
}

User -> Local-Workspace.websmith-create: "サイトを初期化"
Local-Workspace.websmith-create -> Local-Workspace.Development-Cycle
Local-Workspace.Development-Cycle -> Local-Workspace.websmith-publish: "変更を最終化"
Local-Workspace.websmith-publish -> WebSmith-Cloud: "ウェブサイトをデプロイ"

```

<x-cards data-columns="2">
  <x-card data-title="ウェブサイトの作成" data-icon="lucide:plus-square" data-href="/guides/create-website">
    作成ワークフローを、設定フィールド、プロンプト、公開前に出力を検証する方法を含めて解説します。
  </x-card>
  <x-card data-title="ウェブサイトの更新" data-icon="lucide:file-pen-line" data-href="/guides/update-website">
    'update' コマンドを使用して、既存ページのコンテンツを変更したり、フィードバックを提供して洗練させる方法を学びます。
  </x-card>
  <x-card data-title="ウェブサイトの公開" data-icon="lucide:upload-cloud" data-href="/guides/publish-website">
    WebSmith Cloudから完全にカスタムなインフラストラクチャまで、すべての公開ターゲットについて、前提条件と検証のヒントを交えて説明します。
  </x-card>
  <x-card data-title="ウェブサイトのローカライズ" data-icon="lucide:languages" data-href="/guides/localize-website">
    'translate' コマンドを使用して、ウェブサイトページの異なる言語バージョンを自動的に作成する方法を説明します。
  </x-card>
  <x-card data-title="テーマのカスタマイズ" data-icon="lucide:palette" data-href="/guides/customize-theme">
    'theme' コマンドを使用して、異なるビジュアルスタイルやカラースキームを生成し、ウェブサイトに適用する方法をカバーします。
  </x-card>
  <x-card data-title="設定の管理" data-icon="lucide:settings-2" data-href="/guides/manage-preferences">
    'prefs' コマンドを使用して、保存されたユーザー設定を表示、管理、クリアし、WebSmithの動作をカスタマイズする方法を説明します。
  </x-card>
  <x-card data-title="ワークスペースのクリーンアップ" data-icon="lucide:trash-2" data-href="/guides/cleanup-workspace">
    'clear' コマンドを使用して、生成されたファイル、ワークスペースデータ、または設定全体を安全に削除する方法を示します。
  </x-card>
  <x-card data-title="インタラクティブモード（ベータ）" data-icon="lucide:bot" data-href="/guides/interactive-mode">
    インタラクティブモードを会話型の副操縦士として使用し、サイトを反復的に計画、編集、洗練させます。
  </x-card>
</x-cards>

## まとめ

これらのガイドは、ウェブサイトのライフサイクルを管理するための基本的なコマンドをカバーしています。より高度なトピックや完全なコマンドリストについては、[高度な機能](./advanced-features.md)および[リファレンス](./reference.md)セクションを参照してください。