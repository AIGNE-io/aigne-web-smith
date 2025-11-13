# 最新情報

「最新情報」コンポーネントは、ウェブサイトに最近のニュース、ブログ投稿、またはお知らせを動的に表示する方法を提供します。ブログシステムである Discuss Kit と統合し、コンテンツを自動的に取得・表示することで、サイトを常に新鮮に保ち、継続的な活動を示します。

このコンポーネントは特に以下の場合に役立ちます：
- 新機能、アップデート、または技術記事の紹介
- 「実績と勢い」（可視化された継続的な進捗）の提供
- ブランドの透明性とエンゲージメントの強化

## 使用方法

「最新情報」セクションを実装するには、データソースファイルを準備し、それをウェブサイトの生成ルールで参照する必要があります。このプロセスは簡単で、AI がコンテンツを正しく見つけてレンダリングできるようにします。

### ステップ 1: データファイルの準備

まず、WebSmith にブログコンテンツの取得元を伝えるデータ記述子として機能する YAML ファイルを作成します。

このファイルの推奨される場所は `src/blog-list-data.yaml` です。

#### データファイルの例

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # または、あなたの Discuss Kit Blocklet の URL
blogLabel: "did-domain"
blogMoreButtonText: "See More"
```

#### フィールドの説明

| フィールド             | 説明                                                                                                                                                                                                   | 必須 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--: |
| `blogTitle`            | セクションに表示されるメインタイトル。分かりやすくするため、60 文字以内に保つことをお勧めします。                                                                                                          | はい |
| `blogDescription`      | タイトルの下に表示される簡単な要約で、セクションのコンテンツを説明します。                                                                                                                               | はい |
| `blogUrl`              | ソース URL。通常は Discuss Kit Blocklet の URL です。WebSmith はタイトル、要約、カバー画像、日付を自動的に抽出します。Discuss Kit API は公開アクセス可能である必要があります。                               | はい |
| `blogLabel`            | 特定のカテゴリのコンテンツを表示するためのオプションのフィルタータグ。値は Discuss Kit サイトから取得する必要があります（例：URL の `labels` クエリパラメータ）。                                             | いいえ |
| `blogMoreButtonText`   | メインのブログやニュースページにリンクできるオプションの「もっと見る」ボタンのテキスト。                                                                                                                   | いいえ |

### ステップ 2: データソースの登録

データファイルを作成した後、WebSmith がそれを見つけて使用できるように登録する必要があります。

`config.yaml` の `sourcesPath` フィールドにファイルパスを追加します：

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

既存のサイトを更新している場合は、`.aigne/web-smith/pages/workspace/website-structure.yaml` の `sourceIds` セクションにもファイルパスを追加する必要があります。これにより、WebSmith が `update` 操作中に新しいデータソースを見つけられるようになります。

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### ステップ 3: 生成ルールでセクションを定義する

次に、WebSmith の `config.yaml` ファイルにルールを追加して、AI にデータソースの使用方法を指示します。ルールでは、セクションの位置、コンポーネントタイプ、およびデータソースを指定する必要があります。

#### ルールの例

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

このルールの例は、以下を実現します：
*   **配置**: 「最新情報」コンポーネントをページの 2 番目のセクションとして配置します。
*   **コンポーネントタイプ**: セクションを「最新情報」または「ブログリスト」タイプとして識別します。
*   **データソース**: `src/blog-list-data.yaml` を設定のソースとして指定します。

または、`update` コマンドを使用する場合、`config.yaml` ファイルを編集する代わりに、直接プロンプトを提供することもできます：

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### ステップ 4: ウェブサイトの生成または更新

データファイルと生成ルールを準備したら、適切なコマンドを実行して AIGNE WebSmith にサイトを構築または更新させます。初めて生成する場合は `aigne web generate` を使用します。既存のサイトにセクションを追加する場合は `aigne web update` を使用し、セクションを追加するドキュメントを選択します。

WebSmith は YAML データを自動的にロードし、指定された Discuss Kit URL から最新の投稿を取得して、ウェブサイトに「最新情報」セクションをレンダリングします。

## まとめ

「最新情報」コンポーネントは、ウェブサイトのコンテンツを常に最新で魅力的なものに保つための強力なツールです。データファイルを作成し、生成ルールを定義するという簡単な手順に従うことで、ニュースやブログ投稿をサイトに直接表示するプロセスを自動化できます。

他の特殊コンポーネントに関する詳細については、[特殊コンポーネントの使用](./advanced-features-use-special-components.md)に関するドキュメントを参照してください。