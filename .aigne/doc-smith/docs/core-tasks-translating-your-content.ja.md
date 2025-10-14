# コンテンツの翻訳

AIGNE WebSmithは、ウェブサイトのコンテンツを複数の言語に自動的に翻訳する、強力かつ簡単な方法を提供します。これにより、最小限の労力で世界中のオーディエンスにリーチできます。`translate` コマンドは、AIを使用して既存のページに対して高品質な翻訳を生成します。

このドキュメントでは、基本的な対話形式での使用方法から、コマンドラインパラメータを使用したより高度なオプションまで、コンテンツの翻訳プロセスをガイドします。

## 翻訳の仕組み

翻訳プロセスは、シンプルかつ効率的になるように設計されています。`translate` コマンドを実行すると、WebSmithは以下のステップを実行します：

1.  **ソースコンテンツの特定**：既存のウェブサイトの構造とコンテンツを読み込み、設定から主要言語を決定します。
2.  **ページの選択**：翻訳するページを指定できます。指定しない場合は、利用可能なすべてのページの対話型リストが表示され、そこから選択できます。
3.  **ターゲット言語の選択**：ターゲット言語のリストを提供できます。提供しない場合は、サポートされている言語のリストが表示され、そこから選択できます。
4.  **翻訳の生成**：AIが選択された各ページのコンテンツを処理し、選択された各言語の翻訳版を生成します。オプションの用語集を使用することで、用語の一貫性を確保できます。
5.  **翻訳済みファイルの保存**：新しく翻訳されたページは、言語固有のディレクトリに保存され、レビューと公開の準備が整います。

## 基本的な使用方法

最も簡単なアプローチとして、パラメータなしでコマンドを実行できます。WebSmithが対話型のプロンプトでプロセスを案内します。

ターミナルで次のコマンドを実行してください：

```bash title="対話形式での翻訳" icon=lucide:terminal
aigne web translate
```

次のようにプロンプトが表示されます：
1.  翻訳したいページを選択します（スペースバーで選択し、エンターキーで確定します）。
2.  サポートされているオプションのリストからターゲット言語を選択します。

選択が完了すると、AIが翻訳プロセスを開始します。

## コマンドパラメータ

より詳細な制御や自動化スクリプトでの使用のために、次のコマンドラインパラメータを使用できます。

<x-field-group>
  <x-field data-name="--pages" data-type="array" data-required="false">
    <x-field-desc markdown="翻訳するページのパスの配列です。省略した場合は、対話形式でページを選択するよう求められます。例：`--pages /about /contact`"></x-field-desc>
  </x-field>
  <x-field data-name="--langs" data-type="array" data-required="false">
    <x-field-desc markdown="翻訳先の言語コードの配列です。省略した場合は、対話形式で言語を選択するよう求められます。サポートされている言語の完全なリストについては、以下の表を参照してください。"></x-field-desc>
  </x-field>
  <x-field data-name="--glossary" data-type="string" data-required="false">
    <x-field-desc markdown="翻訳中の一貫した用語を保証するための特定用語の用語集です。キーと値のペアの文字列を提供するか、`@` プレフィックスを使用してファイルパスを参照できます（例：`@./glossary.txt`）。"></x-field-desc>
  </x-field>
  <x-field data-name="--feedback" data-type="string" data-required="false">
    <x-field-desc markdown="AIにフィードバックを提供して、既存の翻訳を洗練・改善します。これは、修正を行ったり、トーンを調整したりするのに役立ちます。"></x-field-desc>
  </x-field>
</x-field-group>

## 使用例

### 特定のページを複数の言語に翻訳する

このコマンドは、`/about-us` と `/services/main` のページを、対話型プロンプトなしで日本語とフランス語に翻訳します。

```bash title="特定のページを翻訳する" icon=lucide:terminal
aigne web translate --pages /about-us /services/main --langs ja fr
```

### 用語集を使用して用語の一貫性を保つ

ブランド名「WebSmith」と用語「SaaS」がスペイン語に一貫して翻訳されるようにするために、`--glossary` パラメータを使用できます。

```bash title="インライン用語集を使用した翻訳" icon=lucide:terminal
aigne web translate --langs es --glossary "WebSmith:WebSmith AI,SaaS:Software como Servicio"
```

大規模な用語集の場合は、ファイルを使用する方が実用的です。用語を記載した `glossary.txt` という名前のファイルを作成し、それを参照します。

```bash title="用語集ファイルを使用した翻訳" icon=lucide:terminal
aigne web translate --langs de --glossary @./glossary.txt
```

## サポートされている言語

次の表は、現在翻訳に利用できるすべての言語のリストです。

| 言語 | コード |
| :--- | :--- |
| 英語 | `en` |
| 中国語（簡体字） | `zh` |
| 中国語（繁体字） | `zh-TW` |
| 日本語 | `ja` |
| フランス語 | `fr` |
| ドイツ語 | `de` |
| スペイン語 | `es` |
| イタリア語 | `it` |
| ロシア語 | `ru` |
| 韓国語 | `ko` |
| ポルトガル語 | `pt` |
| アラビア語 | `ar` |

---

コンテンツを翻訳した後、次の論理的なステップは、それをユーザーが利用できるようにすることです。多言語サイトのデプロイ方法については、[ウェブサイトの公開](./core-tasks-publishing-your-website.md)セクションで学んでください。