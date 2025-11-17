# インタラクティブモード（ベータ）

> **注:** インタラクティブモード機能は現在ベータ版です。完全に機能しますが、予期しない動作が発生する可能性があります。この体験を改善し続けるため、皆様からのフィードバックをお待ちしております。

このガイドを使用して `aigne web chat` を起動し、自然言語で WebSmith と対話し、アシスタントにあなたに代わって生成/更新/公開アクションをトリガーさせます。

`chat` コマンドは、ウェブサイトの構築と管理のためのインタラクティブな対話型インターフェースを提供します。`generate` や `update` のような個別のコマンドを実行する代わりに、あなたのニーズを平易な言葉で説明するだけで、AI アシスタントがプロセスを案内します。これは、よりガイド付きの体験を好むユーザーにとって理想的な出発点です。

## 仕組み

インタラクティブモードセッションは、あなたのリクエストを理解し、他の WebSmith ツールを使用してタスクを実行できる専用の AI agent によって提供されます。会話の記憶を保持するため、連続して変更を加えたり、以前のアクションを基に構築したりすることができます。

一般的なワークフローは、シンプルな対話ループに従います:

```d2
direction: down

start: {
  label: "セッションを開始"
  shape: oval
}

user_input: {
  label: "ユーザーがリクエストを提供\n（例：「ウェブサイトを作成して」）"
}

ai_process: {
  label: "AI アシスタントがリクエストを分析"
}

execute_task: {
  label: "AI が適切なコマンドを実行\n（generate、update、publish など）"
  shape: diamond
}

show_result: {
  label: "アシスタントが結果を表示し\n次の指示を待つ"
}

end: {
  label: "セッションを終了"
  shape: oval
}

start -> user_input
user_input -> ai_process
ai_process -> execute_task
execute_task -> show_result: "成功"
show_result -> user_input
execute_task -> user_input: "追加情報が必要"
user_input -> end: "ユーザーが 'exit' と入力"
```

## インタラクティブセッションの開始

開始するには、ターミナルから `chat` コマンドを実行します：

```bash Command icon=lucide:terminal
aigne web
```

これによりアシスタントが起動し、挨拶の後、あなたの指示を待ちます。

## できること

インタラクティブモードのアシスタントは、AIGNE WebSmith CLI で利用可能なほとんどのコアタスクを実行できます。単に次のように依頼するだけです：

*   **新しいウェブサイトの生成**: ウェブサイトの要件、ターゲットオーディエンス、希望するスタイルを説明します。
*   **既存コンテンツの更新**: 変更したいページやセクションを指定し、新しい詳細を提供します。
*   **ページの翻訳**: 特定のページを別の言語に翻訳するようリクエストします。
*   **サイトの公開**: Pages Kit にウェブサイトを公開する準備ができたことをアシスタントに伝えます。
*   **ファイルの管理**: 現在のファイル構造や特定のページの内容を表示するように依頼します。

## 会話例

以下は、インタラクティブモードを使用して簡単なウェブサイトを作成、変更、公開する方法の例です。

```bash Command Line icon=lucide:terminal
aigne web

> Welcome to the AIGNE WebSmith interactive assistant!
> How can I help you build your website today?

You:
チームがプロジェクトを管理するのに役立つ新しいSaaS製品のウェブサイトを作成する必要があります。

> Of course. Could you please provide a few more details?
> - What are the core features of the product?
> - Who is the target audience?
> - What style should the website have (e.g., business, modern, playful)?

You:
主な機能はタスク追跡、チームコラボレーション、レポーティングです。ターゲットオーディエンスは中小企業の経営者です。モダンなビジネススタイルでお願いします。

> Thank you. I have enough information to plan the website structure.
> I will now generate the following pages:
> - Home
> - Features
> - Pricing
> - About Us
> - Contact
> ...
> [Generation process starts]
> ...
> Website generation is complete. The files have been saved to the 'output' directory.
> What would you like to do next?

You:
ホームページに顧客の声セクションを追加してください。

> Understood. I will add a customer testimonials section to the homepage.
> [Update process starts]
> ...
> The homepage has been updated. Is there anything else?

You:
いいえ、今のところは以上です。ウェブサイトを公開してください。

> I will now publish the website to your configured Pages Kit project.
> [Publishing process starts]
> ...
> Your website has been successfully published.
> You can now exit the chat by typing 'exit'.

You:
exit

> Goodbye!
```

## インタラクティブモードの終了

インタラクティブセッションをいつでも終了するには、単に `exit` または `quit` と入力して Enter キーを押します。

---

インタラクティブモードは、特定のコマンドやパラメータを覚える必要なく、ウェブサイトのライフサイクル全体を管理する強力な方法です。より直接的な制御が必要な場合は、いつでも次のセクションで詳述されている標準コマンドを使用できます。

### 関連資料

*   [ウェブサイトの作成](./guides-create-website.md)
*   [ウェブサイトの更新](./guides-update-website.md)
*   [ウェブサイトの公開](./guides-publish-website.md)
