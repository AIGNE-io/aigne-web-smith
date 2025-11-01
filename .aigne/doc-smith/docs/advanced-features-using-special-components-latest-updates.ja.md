# 最新情報

「最新情報」コンポーネントは、ウェブサイト上で最近のニュース、ブログ投稿、またはお知らせを動的に表示する方法を提供します。ブログシステムであるDiscuss Kitと統合し、コンテンツを自動的に取得・表示することで、サイトを常に最新の状態に保ち、継続的な活動を示します。

このコンポーネントは特に以下に役立ちます：
- 新機能、更新、または技術記事の紹介。
- 「Proof & Momentum」（証明と勢い）の提供—目に見える、進行中の進捗。
- ブランドの透明性とエンゲージメントの強化。

## 使用方法

「最新情報」セクションを実装するには、データソースファイルを準備し、それをウェブサイトの生成ルールで参照する必要があります。このプロセスは簡単で、AIがコンテンツを正しく見つけてレンダリングできるようにします。

### ステップ1：データファイルを準備する

まず、データ記述子として機能するYAMLファイルを作成し、ブログコンテンツの取得元をWebSmithに伝えます。

このファイルの推奨される場所は`src/blog-list-data.yaml`です。

#### データファイルの例

```yaml src/blog-list-data.yaml icon=yaml
blogTitle: "Latest Updates"
blogDescription: "Get the latest updates right here."
blogUrl: "https://www.arcblock.io" # または、あなたのDiscuss Kit BlockletのURL
blogLabel: "did-domain"
blogMoreButtonText: "See More"
```

#### フィールドの説明

| フィールド | 説明 | 必須 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------: |
| `blogTitle` | セクションに表示されるメインタイトルです。明確にするために、60文字未満にすることをお勧めします。 | はい |
| `blogDescription` | タイトルの下に表示される、セクションの内容を説明する簡単な要約です。 | はい |
| `blogUrl` | ソースURLで、通常はあなたのDiscuss Kit Blockletです。WebSmithはタイトル、要約、カバー画像、日付を自動的に抽出します。Discuss Kit APIは公開アクセス可能である必要があります。 | はい |
| `blogLabel` | 特定のカテゴリのコンテンツを表示するためのオプションのフィルタータグです。値はあなたのDiscuss Kitサイトから取得する必要があります（例：URL内の`labels`クエリパラメータ）。 | いいえ |
| `blogMoreButtonText` | メインのブログやニュースページにリンクできる、オプションの「もっと見る」ボタンのテキストです。 | いいえ |

### ステップ2：データソースを登録する

データファイルを作成した後、WebSmithがそれを見つけて使用できるように登録する必要があります。

`config.yaml`の`sourcesPath`フィールドにファイルパスを追加します：

```yaml config.yaml icon=yaml
sourcesPath:
  - src/blog-list-data.yaml
```

既存のサイトを更新する場合は、`.aigne/web-smith/pages/workspace/website-structure.yaml`の`sourceIds`セクションにもファイルパスを追加する必要があります。これにより、`update`操作中にWebSmithが新しいデータソースを見つけられるようになります。

```yaml .aigne/web-smith/pages/workspace/website-structure.yaml icon=yaml
sourceIds:
  - src/blog-list-data.yaml
```

### ステップ3：生成ルールでセクションを定義する

次に、WebSmithの`config.yaml`ファイルにルールを追加して、データソースの使用方法をAIに指示します。ルールでは、セクションの位置、コンポーネントの種類、データソースを指定する必要があります。

#### ルールの例

```yaml config.yaml icon=yaml
rule: Section 2 must render the `Latest Updates` section using `src/blog-list-data.yaml` as immediate proof and momentum.
```

このルールの例は、以下を実現します：
*   **位置決め**：「最新情報」コンポーネントをページ上の2番目のセクションとして配置します。
*   **コンポーネントの種類**：セクションを「最新情報」または「ブログリスト」タイプとして識別します。
*   **データソース**：`src/blog-list-data.yaml`を構成のソースとして指し示します。

あるいは、`update`コマンドを使用する際に、`config.yaml`ファイルを編集する代わりに直接プロンプトを提供することもできます：

```
Change section 2 to “Latest Updates” and generate its content using src/blog-list-data.yaml.
```

### ステップ4：ウェブサイトを生成または更新する

データファイルと生成ルールを配置したら、適切なコマンドを実行してAIGNE WebSmithにサイトをビルドまたはリフレッシュさせます。初めて生成する場合は、`aigne web generate`を使用します。既存のサイトにセクションを追加するには、`aigne web update`を使用し、セクションを追加するドキュメントを選択します。

これにより、WebSmithは自動的にYAMLデータを読み込み、指定されたDiscuss KitのURLから最新の投稿を取得し、ウェブサイトに「最新情報」セクションをレンダリングします。

## まとめ

「最新情報」コンポーネントは、ウェブサイトのコンテンツを最新かつ魅力的に保つための強力なツールです。データファイルを作成し、生成ルールを定義するという簡単な手順に従うことで、ニュースやブログ投稿をサイトに直接表示するプロセスを自動化できます。

その他の特殊コンポーネントに関する詳細については、[特殊コンポーネントの使用](./advanced-features-using-special-components.md)に関するドキュメントを参照してください。
