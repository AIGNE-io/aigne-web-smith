# 更新履歴の表示

このガイドでは、`aigne web history` を使用して更新履歴を照会し、ログ形式を解釈し、個々の更新をフィルタリングまたは検査する方法について説明します。

AIGNE WebSmith は、ウェブサイトに加えられたすべての変更の詳細なログを自動的に維持します。単一ページのコンテンツを更新する場合でも、サイト全体の構造を再編成する場合でも、各アクションは記録されます。この履歴は、明確な時系列の記録を提供し、進捗状況を追跡し、過去の変更を確認することができます。

`aigne web history` コマンドは、このログにアクセスするための主要なツールです。これにより、Gitのようなバージョン管理システムに似た形式で、記録されたすべての更新のリストを表示できます。

## 履歴ログの表示

更新の完全なリストを表示するには、`aigne web history view` コマンドを使用します。このコマンドは、最新のものから最も古いものまですべてのエントリを表示します。

```bash 更新履歴の表示 icon=lucide:terminal
aigne web history view
```

### 出力の理解

このコマンドは、各行が単一の更新を表すリストを生成します。形式は簡潔で情報量が多くなるように設計されています。

**出力例:**

```bash
📜 Update History

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

ログの各エントリには、いくつかの重要な情報が含まれています。以下にコンポーネントの内訳を示します。

| コンポーネント | 説明 |
| :--- | :--- |
| **ハッシュ** | 特定の更新を識別する一意の7文字のコード (`e5c7a91`)。 |
| **日付** | 更新が行われた時期を示す相対的なタイムスタンプ (例: 「5 minutes ago」)。 |
| **操作** | 発生した変更の種類。サイト全体の変更の場合は `structure_update`、特定のページのコンテンツ編集の場合は `page_update` になります。 |
| **ページパス** | 操作が `page_update` の場合、変更されたページのパスが括弧内に表示されます (例: `(about-us)`)。 |
| **フィードバック** | `update` コマンドを実行したときに提供した説明的なメッセージ。このテキストは変更の目的を説明します。 |

### コマンドのエイリアス

便宜上、`aigne web history` コマンドは `view` のいくつかのエイリアスを受け入れます。以下のコマンドは同等であり、同じ出力を生成します。

-   `aigne web history log`
-   `aigne web history list`

最も覚えやすいものを選択してください。

## まとめ

`aigne web history` コマンドは、ウェブサイトの進化を追跡するための不可欠なツールです。ログを確認することで、過去の変更の詳細を簡単に思い出し、いつ行われたかを理解し、その背後にある理由を確認できます。

これらの履歴エントリを作成するアクションの詳細については、以下のセクションを参照してください。
-   [ウェブサイトの更新](./guides-update-website.md)
-   [ウェブサイト構造の更新](./guides-update-website-update-structure.md)