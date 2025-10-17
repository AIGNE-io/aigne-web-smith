# 更新履歴の表示

AIGNE WebSmithは、ウェブサイトに加えられたすべての変更の詳細なログを自動的に保持します。単一ページのコンテンツを更新する場合でも、サイト全体の構造を再編成する場合でも、各アクションは記録されます。この履歴は明確で時系列の記録を提供し、進捗を追跡し、過去の変更を確認することができます。

`web history` コマンドは、このログにアクセスするための主要なツールです。Gitのようなバージョン管理システムに似た形式で、記録されたすべての更新のリストを表示できます。

## 履歴ログの表示

更新の完全なリストを表示するには、`web history view` コマンドを使用します。このコマンドは、すべてのエントリを最新のものから順に表示します。

```bash Terminal icon=lucide:terminal
aigne web history view
```

### 出力の理解

このコマンドは、各行が単一の更新を表すリストを生成します。形式は簡潔で分かりやすいように設計されています。

**出力例：**

```bash
📜 更新履歴

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

ログの各エントリには、いくつかの重要な情報が含まれています。以下に各構成要素の内訳を示します。

| コンポーネント | 説明 |
| :--- | :--- |
| **ハッシュ** | 特定の更新を識別する一意の7文字のコード（`e5c7a91`）。 |
| **日付** | 更新が行われた時期を示す相対的なタイムスタンプ（例：「5 minutes ago」）。 |
| **操作** | 発生した変更の種類。サイト全体の変更の場合は `structure_update`、特定ページのコンテンツ編集の場合は `page_update` のいずれかになります。 |
| **ページパス** | 操作が `page_update` の場合、変更されたページのパスが括弧内に表示されます（例：`(about-us)`）。 |
| **フィードバック** | `update` コマンド実行時に入力した説明的なメッセージ。このテキストは変更の目的を説明します。 |

### コマンドエイリアス

便宜上、`web history` コマンドは `view` のいくつかのエイリアスを受け入れます。以下のコマンドは同等であり、同じ出力を生成します。

-   `aigne web history log`
-   `aigne web history list`

ご自身が最も覚えやすいものをお選びください。

## まとめ

`web history` コマンドは、ウェブサイトの進化を追跡するための不可欠なツールです。ログを確認することで、過去の変更の詳細を簡単に思い出し、いつ行われたかを理解し、その背後にある理由を確認できます。

これらの履歴エントリが作成される操作の詳細は、以下のセクションを参照してください。
-   [ウェブサイトのコンテンツの更新](./core-tasks-updating-website-content.md)
-   [ウェブサイトの構造の更新](./core-tasks-updating-website-content-updating-website-structure.md)