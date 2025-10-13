# 更新履歴の表示

AIGNE WebSmithは、ウェブサイトに加えられたすべての変更の詳細なログを自動で記録します。単一ページのコンテンツ更新からサイト全体の構造再編成まで、あらゆる操作が記録されます。この履歴は、時系列で整理された明確な記録となり、進捗の追跡や過去の変更点の確認に役立ちます。

このログにアクセスするための主要なツールが `history` コマンドです。このコマンドを使用すると、Gitのようなバージョン管理システムに似た形式で、記録されたすべての更新のリストを表示できます。

## 履歴ログの表示

更新の完全なリストを表示するには、`history view` コマンドを使用します。このコマンドは、すべてのエントリを最新のものから最も古いものの順に表示します。

```bash ターミナル icon=lucide:terminal
aigne history view
```

### 出力の見方

このコマンドは、各行が単一の更新を表すリストを生成します。その形式は、簡潔で情報が分かりやすいように設計されています。

**出力例：**

```bash
📜 Update History

e5c7a91 5 minutes ago   page (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page (services): Added new section for consulting services
1d9c0b2 1 day ago       structure: Added a new 'Careers' page to the main menu
f4e5a67 3 days ago      page (contact): Updated the main office phone number
```

ログの各エントリには、いくつかの主要な情報が含まれています。以下に各構成要素の内訳を示します。

| 構成要素 | 説明 |
| :--- | :--- |
| **ハッシュ** | 特定の更新を識別するユニークな7文字のコード（`e5c7a91`）です。 |
| **日付** | 更新が行われた時期を示す相対的なタイムスタンプです（例：「5 minutes ago」）。 |
| **操作** | 行われた変更の種類です。サイト全体の変更の場合は `structure`、特定ページのコンテンツ編集の場合は `page` のいずれかになります。 |
| **ページパス** | 操作が `page` の場合、変更されたページのパスが括弧内に表示されます（例：`(about-us)`）。 |
| **フィードバック** | `update` コマンドを実行した際に指定した説明的なメッセージです。このテキストは変更の目的を説明します。 |

### コマンドのエイリアス

利便性のため、`history` コマンドでは `view` のエイリアスをいくつか使用できます。以下のコマンドはすべて同じ意味で、同じ出力が得られます。

-   `aigne history log`
-   `aigne history list`

あなたが最も覚えやすいものを選んでください。

## 概要

`history` コマンドは、ウェブサイトの変遷を追跡するための不可欠なツールです。ログを確認することで、過去の変更の詳細を簡単に思い出し、いつ変更が行われたかを理解し、その背後にある理由を確認できます。

これらの履歴エントリを作成するアクションに関する詳細については、以下のセクションを参照してください。
-   [ウェブサイトコンテンツの更新](./core-tasks-updating-website-content.md)
-   [ウェブサイト構造の更新](./core-tasks-updating-website-content-updating-website-structure.md)