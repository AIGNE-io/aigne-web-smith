# ページの削除

ウェブサイトの構造を整理する必要がありますか？このガイドでは、`aigne web remove-page` コマンドを使用して安全にページを削除し、これにより生じるリンク切れを自動的に検出し、影響を受けるコンテンツを再生成してサイトの整合性を維持する方法について説明します。

## 概要

`remove-page` コマンドは、ウェブサイトから1つ以上のページを対話形式で削除する方法を提供します。このコマンドの重要な機能は、ページの削除によって発生する内部リンクのリンク切れを検出して修復する能力です。ページを削除すると、WebSmith は残りのコンテンツを自動的にスキャンし、削除されたページを指していたリンクを探します。その後、影響を受けるページを再生成するように促し、サイトのナビゲーションの一貫性を保ち、エラーがないようにします。

このプロセスにより、ユーザーがリンク切れに遭遇するのを防ぎ、クリーンでプロフェッショナルなウェブサイトを維持するのに役立ちます。

## プロセス

プロセスを開始するには、ターミナルで次のコマンドを実行します。

```sh aigne web remove-page icon=lucide:terminal
aigne web remove-page
```

エイリアス `remove` または `rm` も使用できます。

```sh aigne web rm icon=lucide:terminal
aigne web rm
```

### ステップ1：削除するページを選択

コマンドを実行すると、現在のウェブサイト構造内のすべてのページのリストが表示されます。矢印キーを使用してこのリストを移動し、スペースバーを押して削除したいページを選択できます。

```text 削除するページを選択
? Select pages to remove (Press Enter with no selection to finish):
❯ ◯ Smart Video Streaming Credit Service [/home]
  ◉ About the Project [/about]
  ◯ Frequently Asked Questions [/about/faq]
```

削除したいすべてのページを選択したら、`Enter` を押して確定します。ページを削除しないことにした場合は、何も選択せずに `Enter` を押してプロセスを終了できます。
その後、ツールは削除を進める前に確認を求めます。

### ステップ2：自動リンク修正（オプション）

選択したページを削除した後、WebSmith は残りのページをスキャンし、存在しないコンテンツを指す内部リンクがないか確認します。

リンク切れが見つかった場合、影響を受けるページのリストが表示されます。デフォルトでは、これらのページはすべて修正対象として選択されています。リストを確認し、`Enter` を押すと、WebSmith がこれらのページを再生成し、無効なリンクを自動的に削除します。リンク切れを手動で処理したい場合は、すべてのページの選択を解除してこのステップをスキップできます。

```text 修正するページを選択
? Select Pages with Invalid Links to Fix (all selected by default, press Enter to confirm, or unselect all to skip):
❯ ◉ Home (home.md)
    Invalid Links(1): /about
```

### ステップ3：概要の確認

プロセスが完了すると、ターミナルに概要が表示されます。この概要には以下が含まれます。

*   正常に削除されたすべてのページのリスト。
*   リンク切れを修正するために再生成されたすべてのページのリスト。
*   リンク切れを修正するために再生成されたページのリスト。

```text ページ削除操作の概要
---
📊 Summary

🗑️  Removed Pages:
   Total: 1 page(s)

   1. /about

✅ Pages fixed (Removed invalid links):
   Total: 1 page(s)

   1. /home
      Title: Home
      Invalid links fixed: /about
```
これにより、ウェブサイトの構造とコンテンツに加えられたすべての変更の明確な記録が保証されます。

## まとめ

`aigne web remove-page` コマンドは、ウェブサイトの構造を維持するための信頼できるツールです。ページの削除プロセスを簡素化するだけでなく、サイトのナビゲーションの整合性を保つためのインテリジェントなリンクチェック機能も含まれています。

関連するタスクについては、以下のガイドを参照してください。
<x-cards data-columns="2">
  <x-card data-title="ページの追加" data-href="/guides/update-website/add-page" data-icon="lucide:file-plus">ウェブサイトの構造に新しいページを追加する方法を学びます。</x-card>
  <x-card data-title="ページの更新" data-href="/guides/update-website/update-page" data-icon="lucide:file-pen-line">個々のウェブページのコンテンツと詳細を洗練させます。</x-card>
</x-cards>