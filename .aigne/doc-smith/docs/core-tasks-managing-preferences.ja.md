# 設定の管理

AIGNE WebSmith は、フィードバックから学習して、Web サイトの生成と更新の方法を洗練させます。これらの学習した指示は、ユーザー設定として保存されます。`prefs` コマンドは、これらの保存された設定を表示、管理、およびクリアする方法を提供し、AI の動作を完全に制御できるようにします。

設定を管理することで、AI が特定のスタイルガイド、コンテンツ要件、および構造規則に長期にわたって一貫して準拠することを保証します。

## 設定の一覧表示

現在保存されているすべての設定を表示するには、`list` コマンドを使用します。このコマンドは、ID、アクティブ状態、スコープ、およびルール自体を含む、すべての設定ルールのテーブルを表示します。

```bash terminal icon=lucide:terminal
aigne web prefs list
```

エイリアス `ls` も使用できます。

```bash terminal icon=lucide:terminal
aigne web prefs ls
```

### 出力例

出力はフォーマットされたテーブルになり、保存されたルールを簡単に確認できます。

| ID | Active | Scope | Rule |
| :--------- | :----- | :-------- | :----------------------------------------------------------------- |
| pref_a1b2c3d4 | true | page | フォーマルでプロフェッショナルなトーンで記述する。 |
| pref_e5f6g7h8 | true | structure | 古い「レガシー API リファレンス」のページやセクションを生成しない。 |
| pref_i9j0k1l2 | false | theme | ヘルスケアの Web サイトでは暖色系の色調を使用する必要がある。 |

## 設定の切り替え

設定を永続的に削除せずに一時的に無効にしたい場合は、`toggle` コマンドを使用できます。このコマンドは、ルールの `active` ステータスを切り替えます。特定のルールを切り替えるには、`--id` パラメータを使用してその一意の ID を指定する必要があります。

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id <PREFERENCE_ID>
```

エイリアス `t` も使用できます。

```bash terminal icon=lucide:terminal
aigne web prefs t --id <PREFERENCE_ID>
```

### 例

上記の例からテーマ設定を無効にするには：

```bash terminal icon=lucide:terminal
aigne web prefs toggle --id pref_i9j0k1l2
```

再度 `aigne web prefs list` を実行すると、`pref_i9j0k1l2` は `false` と表示されます。同じ ID で再度 toggle コマンドを実行すると、再アクティブ化されます。

## 設定の削除

不要になった設定を永続的に削除するには、`remove` コマンドを使用します。この操作は元に戻せません。`--id` パラメータで ID を指定して、削除するルールを指定する必要があります。

```bash terminal icon=lucide:terminal
aigne web prefs remove --id <PREFERENCE_ID>
```

エイリアス `rm` も使用できます。

```bash terminal icon=lucide:terminal
aigne web prefs rm --id <PREFERENCE_ID>
```

### 例

上記の例からページ設定を永続的に削除するには：

```bash terminal icon=lucide:terminal
aigne web prefs remove --id pref_a1b2c3d4
```

指定された設定は `preferences.yml` ファイルから削除されます。

## 設定スコープについて

設定は、割り当てられた `scope` に基づいて適用されます。スコープは、ルールがトリガーされるコンテキストを決定します。

| Scope | Description |
| :------------ | :------------------------------------------------------------------------------------------------------ |
| **global** | 生成とコンテンツ洗練のすべての段階に適用されます。普遍的なスタイルやコンテンツのルールに使用します。 |
| **structure** | Web サイトの構造を計画または更新する場合（例：ページの追加、削除）にのみ適用されます。 |
| **page** | 個々のページのコンテンツを生成または洗練する場合に適用されます。 |
| **translation** | コンテンツの翻訳プロセス中にのみ適用されます。 |
| **theme** | Web サイトのビジュアルテーマ（色やフォントなど）を生成または変更する場合に適用されます。 |

## まとめ

`prefs` コマンドは、AIGNE WebSmith の長期的な動作をカスタマイズおよび制御するための不可欠なツールです。設定を一覧表示、切り替え、削除することで、AI がプロジェクトの特定のニーズに合った結果を一貫して生成することを保証する、クリーンで効果的なルールセットを維持できます。