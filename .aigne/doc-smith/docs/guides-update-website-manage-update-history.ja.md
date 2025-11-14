# 更新履歴の管理

このガイドでは、WebSmithが変更したすべてを監査する方法について説明します。`aigne web history`コマンドは、すべての生成または更新アクションを記録するため、何が、いつ、なぜフィードバックが適用されたのかを常に把握できます。

このガイドは、より広範な**ウェブサイトの更新**ワークフロー内にあります。公開前、チームメイトとのレビュー、または編集のロールバック前に証跡が必要な場合はいつでも実行してください。

## 履歴ログの表示

更新ログ全体（最新のものが最初）を表示するには、次のようにします。

```bash 履歴ログの表示 icon=lucide:history
aigne web history view
```

エイリアスの `log` と `list` も同じ出力を生成します。

```bash 履歴ログの表示（エイリアス） icon=lucide:history
aigne web history log
```

まだ更新が存在しない場合、WebSmithは`No update history found`と表示します。

## 各エントリの理解

各行は1つの変更イベントを記述し、同じ構造に従います。

| フィールド | 説明 |
| :--- | :--- |
| **短いハッシュ** | タイムスタンプから派生した決定論的な識別子。特定の更新についてチームと議論する際に使用します。 |
| **日付** | 相対的なタイムスタンプ（例：`5 minutes ago`や`2 days ago`）。1週間以上前のエントリはカレンダーの日付を表示します。 |
| **操作** | サイトマップの変更の場合は`structure_update`、個々のページの編集の場合は`page_update`。 |
| **ページパス** | `page_update`エントリにのみ表示され、括弧内に表示されます（例：`(about-us)`）。 |
| **フィードバック** | `aigne web update`実行時に提供した要約。将来の読者が意図を理解できるようにキャプチャされます。 |

### 出力例

```text
📜 Update History

e5c7a91 5 minutes ago   page_update (about-us): Refined the company mission statement
a3b4f8e 2 hours ago     page_update (services): Added new section for consulting services
1d9c0b2 1 day ago       structure_update: Added a new "Careers" page to the main menu
f4e5a67 3 days ago      page_update (contact): Updated the main office phone number
```

公開前に履歴ログを使用して、どの編集が公開されようとしているかを確認したり、公開後に関係者からの変更時期に関する質問に答えたりします。

## 関連ワークフロー

- [構造の更新](./guides-update-website-update-structure.md) – ナビゲーションとサイトマップを再生成します。
- [ページの更新](./guides-update-website-update-page.md) – 個々のページのコピーを洗練させます。