# ページの更新

このガイドは、サイトの他の部分を変更せずに、単一のページに対して `aigne web update` を実行する必要がある場合（セクションの書き換え、新しいモジュールの挿入、ブロックの並べ替え、古いコンテンツの削除など）に使用します。

このプロセスは、サイトマップ全体の変更とは異なります。ページの追加、削除、再編成の手順については、[構造の更新](./guides-update-website-update-structure.md)ガイドを参照してください。

## 更新プロセス

コンテンツの更新は `aigne web update` コマンドを使用して開始されます。このプロセスは対話形式で、自然言語でフィードバックを提供することができ、WebSmith はそれを選択されたページの構造的な変更に変換します。

```bash ページを更新 icon=lucide:terminal
aigne web update
```

このコマンドは、エイリアスである `up` でも呼び出すことができます。

標準的なワークフローは以下の通りです：

1.  **コマンドの実行**： `aigne web update` を実行します。
2.  **ページの選択**： WebSmith が既存のページのリストを表示します。変更したい単一のページを選択します。
3.  **フィードバックの提供**： 行いたい変更を説明する自然言語の指示を入力します。例：「ヒーローの見出しを『Instant AI Websites』に変更する」や「Benefits の後に3カラムの機能セクションを追加する」。
4.  **処理**： WebSmith がリクエストを分析し、更新ツールを使用してページのコンテンツ構造に変更を適用します。
5.  **レビューと保存**： 更新されたページコンテンツが保存されます。再生成または公開することで、レンダリングされたページに新しいコピーが反映されているのを確認できます。

![更新のためのページ選択とフィードバック入力を示す対話型プロンプト](../../../assets/images/web-smith-update.png)

## コマンドパラメータ

非対話的な使用やスクリプトでの使用のために、フィードバックやその他のパラメータをコマンドライン引数として直接提供することができます。

<x-field-group>
  <x-field data-name="--pages" data-type="array">
    <x-field-desc markdown>更新する1つ以上のページパスを指定します。指定しない場合、WebSmith は対話形式でページを選択するよう促します。</x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string">
    <x-field-desc markdown>コンテンツのフィードバックを直接提供します。スクリプトによる更新に便利です。</x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string">
    <x-field-desc markdown>コンテンツ生成中に一貫した用語を保証するための用語集です。`@<file>` 構文を使用してファイルへのパスを提供できます。</x-field-desc>
  </x-field>
</x-field-group>

## コンテンツ変更機能

更新ワークフローはツールベースの操作を使用します。予測可能な結果を得るために、フィードバックをこれらの機能に合わせてください。

| アクション | 説明 | フィードバック例 |
| :--- | :--- | :--- |
| **セクションの追加** | 新しいコンテンツブロックを追加します。コンテンツとその位置を指定します。 | 「Features の後に3つの推薦文を含む『Customers』セクションを追加する。」 |
| **セクションの削除** | 既存のブロックを名前で削除します。 | 「『Legacy Support』セクションを削除する。」 |
| **セクションの更新** | ブロック内のコンテンツを変更します。 | 「『Pricing』セクションで、見出しを『チーム向けの予測可能な価格設定』に変更する。」 |
| **セクションの移動** | セクションを並べ替えます。 | 「『FAQ』を最終的な CTA の前に表示されるように移動する。」 |
| **メタデータの更新** | タイトルや説明などのページのメタデータを更新します。 | 「ページタイトルを『Platform Overview』に設定する。」 |

## フィードバックプロンプトの例

```text フィードバックの例 icon=lucide:clipboard-list
"Add a four-step walkthrough section after the hero for onboarding instructions."

"Remove the case-study section that references Legacy API clients."

"Change the CTA in the hero to 'See it in action' and adjust the subheading to mention 5-minute setup."
```

## まとめ

ページコンテンツの更新は、明確な指示によって駆動される反復的なプロセスです。フィードバックを WebSmith のページ更新機能に合わせることで、ウェブサイトの他の部分に影響を与えることなく、コピーを迅速に洗練させ、セクションを並べ替え、サイトを正確に保つことができます。

構造的な変更については、[構造の更新](./guides-update-website-update-structure.md)ガイドを参照してください。更新の公開については、[ウェブサイトの公開](./guides-publish-website.md)をご覧ください。