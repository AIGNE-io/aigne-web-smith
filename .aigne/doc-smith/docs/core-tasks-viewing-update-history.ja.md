# 更新履歴の表示

AIGNE WebSmithは、ウェブサイトに行ったすべての変更の詳細なログを自動的に保持します。単一ページのコンテンツを更新する場合でも、サイト全体の構造を再編成する場合でも、各アクションが記録されます。この履歴は、明確な時系列の記録を提供し、進捗を追跡し、過去の変更を確認することができます。

このログにアクセスするための主要なツールは `history` コマンドです。これにより、Gitのようなバージョン管理システムに似た形式で、記録されたすべての更新のリストを表示できます。

## 履歴ログの表示

更新の完全なリストを表示するには、`history view` コマンドを使用します。このコマンドは、すべてのエントリを新しいものから古いものへと表示します。

```bash Terminal icon=lucide:terminal
aigne history view
```

### 出力の理解

このコマンドは、各行が単一の更新を表すリストを生成します。この形式は、簡潔で情報が豊富になるように設計されています。

**出力例:**

```bash
📜 Update History

e5c7a91 5 minutes ago   page (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page (services): Added new section for consulting services
1d9c0b2 1 day ago       structure: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page (contact): Updated the main office phone number
```

ログの各エントリには、いくつかの重要な情報が含まれています。以下は、その構成要素の内訳です。

| コンポーネント | 説明 |
| :--- | :--- |
| **ハッシュ** | 特定の更新を識別する一意の7文字のコード (`e5c7a91`) です。 |
| **日付** | 更新が行われた時期を示す相対的なタイムスタンプ（例：「5 minutes ago」）です。 |
| **操作** | 発生した変更の種類。サイト全体の変更の場合は `structure`、特定のページのコンテンツ編集の場合は `page` になります。 |
| **ページパス** | 操作が `page` の場合、変更されたページのパスが括弧内に表示されます（例：`(about-us)`）。 |
| **フィードバック** | `update` コマンドを実行したときに提供した説明的なメッセージです。このテキストは変更の目的を説明します。 |

### コマンドのエイリアス

便宜上、`history` コマンドは `view` のいくつかのエイリアスを受け入れます。以下のコマンドは同等であり、同じ出力を生成します。

-   `aigne history log`
-   `aigne history list`

自分にとって最も覚えやすいものを選んでください。

## まとめ

`history` コマンドは、ウェブサイトの進化を追跡するための不可欠なツールです。ログを確認することで、過去の変更の詳細を簡単に思い出し、いつ変更が行われたかを理解し、その背後にある理由を知ることができます。

これらの履歴エントリを作成するアクションの詳細については、以下のセクションを参照してください。
-   [ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md)
-   [ウェブサイト構造の更新](./core-tasks-updating-website-content-updating-website-structure.md)