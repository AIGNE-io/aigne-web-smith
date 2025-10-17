# 対話型チャットの使用（ベータ版）

> **注：** 対話型チャット機能は現在ベータ版です。完全に機能しますが、予期しない動作が発生する可能性があります。このエクスペリエンスを継続的に改善していくため、皆様からのフィードバックをお待ちしております。

`chat` コマンドは、ウェブサイトを構築および管理するための対話型の会話インターフェースを提供します。`generate` や `update` のような個別のコマンドを実行する代わりに、平易な言葉でニーズを説明すると、AI アシスタントがプロセスを案内します。これは、よりガイド付きのエクスペリエンスを好むユーザーにとって理想的な出発点です。

## 仕組み

対話型チャットセッションは、ユーザーのリクエストを理解し、他の WebSmith ツールを使用してタスクを実行できる専用の AI agent によって提供されます。会話のメモリを保持するため、連続的な変更を加えたり、以前のアクションに基づいて構築したりすることができます。

一般的なワークフローは、シンプルな会話ループに従います：

```d2
direction: down

start: {
  label: "チャットセッションの開始"
  shape: oval
}

user_input: {
  label: "ユーザーがリクエストを提供\n（例：「ウェブサイトを作成して」）"
}

ai_process: {
  label: "AI アシスタントがリクエストを分析"
}

execute_task: {
  label: "AI が適切なコマンドを実行\n（generate, update, publish など）"
  shape: diamond
}

show_result: {
  label: "アシスタントが結果を表示し\n次の指示を待つ"
}

end: {
  label: "チャットセッションの終了"
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

## 対話セッションの開始

開始するには、ターミナルから `chat` コマンドを実行します：

```bash
aigne web
```

これによりアシスタントが起動し、挨拶の後、あなたの指示を待ちます。

## できること

チャットアシスタントは、AIGNE WebSmith CLI で利用可能なほとんどのコアタスクを実行できます。単純に以下のようなことを依頼できます：

*   **新しいウェブサイトの生成**：ウェブサイトの要件、ターゲットオーディエンス、希望のスタイルを説明します。
*   **既存コンテンツの更新**：変更したいページやセクションを指定し、新しい詳細を提供します。
*   **ページの翻訳**：特定のページを別の言語に翻訳するようリクエストします。
*   **サイトの公開**：ウェブサイトを Pages Kit に公開する準備ができたことをアシスタントに伝えます。
*   **ファイルの管理**：現在のファイル構造や特定のページの内容を表示するよう依頼します。

## 会話例

以下は、対話型チャットを使用して簡単なウェブサイトを作成、変更、公開する方法の例です。

```bash Command Line icon=lucide:terminal
aigne web

> AIGNE WebSmith 対話型アシスタントへようこそ！
> 今日はどのようなウェブサイトの構築をお手伝いしましょうか？

あなた：
I need to create a website for a new SaaS product that helps teams manage their projects.

> 承知しました。もう少し詳細を教えていただけますか？
> - 製品のコア機能は何ですか？
> - ターゲットオーディエンスは誰ですか？
> - ウェブサイトはどのようなスタイルにすべきですか（例：ビジネス、モダン、遊び心のある）？

あなた：
The main features are task tracking, team collaboration, and reporting. The target audience is small to medium-sized business owners. Let's go with a modern business style.

> ありがとうございます。ウェブサイトの構造を計画するのに十分な情報が得られました。
> これから以下のページを生成します：
> - Home
> - Features
> - Pricing
> - About Us
> - Contact
> ...
> [生成プロセス開始]
> ...
> ウェブサイトの生成が完了しました。ファイルは 'output' ディレクトリに保存されました。
> 次に何をしますか？

あなた：
On the homepage, add a section for customer testimonials.

> 承知しました。ホームページに顧客の声セクションを追加します。
> [更新プロセス開始]
> ...
> ホームページが更新されました。他に何かありますか？

あなた：
No, that's all for now. Please publish the website.

> 設定された Pages Kit プロジェクトにウェブサイトを公開します。
> [公開プロセス開始]
> ...
> ウェブサイトは正常に公開されました。
> 'exit' と入力してチャットを終了できます。

あなた：
exit

> さようなら！
```

## チャットの終了

対話セッションをいつでも終了するには、単に `exit` または `quit` と入力して Enter キーを押します。

---

対話型チャットは、特定のコマンドやパラメータを覚える必要なく、ウェブサイトのライフサイクル全体を管理するための強力な方法です。より直接的な制御が必要な場合は、いつでも次のセクションで詳述されている標準コマンドを使用できます。

### 関連資料

*   [ウェブサイトの生成](./core-tasks-generating-a-website.md)
*   [ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md)
*   [ウェブサイトの公開](./core-tasks-publishing-your-website.md)