# ターミナルプレイヤー

ターミナルプレイヤーは、ウェブサイト上でインタラクティブな、事前に録画されたターミナルセッションを表示するために使用される専門的なコンポーネントです。このコンポーネントは、コマンドラインの指示をデモンストレーションしたり、ソフトウェアのインストールを紹介したり、技術的なプロセスを明確で再生可能な形式でユーザーに案内したりするための効果的なツールです。

このコンポーネントは `asciinema` 形式で作成された録画を利用しており、これによりターミナル出力の軽量でテキストベースのキャプチャが保証されます。

## プロセスの概要

ターミナルプレイヤーを使用するためのワークフローは、明確で管理しやすい一連のステップに分けることができます。このプロセスは、開発者がターミナルセッションを録画することから始まり、エンドユーザーがウェブサイトでインタラクティブな再生を視聴することで完了します。

```d2
direction: down

Developer: {
  label: "開発者"
  shape: c4-person
}

Terminal: {
  label: "ターミナル\n(asciinema CLI使用)"
  shape: rectangle
}

Cast-File: {
  label: "my-demo.cast"
  shape: rectangle
}

Online-Converter: {
  label: "ArcBlockオンラインコンバーター"
  shape: rectangle
}

JSON-File: {
  label: "my-demo.json"
  shape: rectangle
}

Website-Project: {
  label: "ウェブサイトプロジェクト"
  shape: rectangle

  Page-Config: {
    label: "ページYAML設定"
  }

  Terminal-Player-Component: {
    label: "TerminalPlayerコンポーネント"
  }
}

Website-Visitor: {
  label: "ウェブサイト訪問者"
  shape: c4-person
}

Developer -> Terminal: "1. セッションを録画"
Terminal -> Cast-File: "2. 生成"
Cast-File -> Online-Converter: "3. アップロードと変換"
Online-Converter -> JSON-File: "4. ダウンロード"
JSON-File -> Website-Project.Page-Config: "5. 設定ファイルで参照"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 再生を表示"
```

## ターミナル録画の作成

ターミナルプレイヤーを使用するには、まず録画ファイルを作成する必要があります。このための推奨ツールは `asciinema` で、これはターミナルセッションを録画して共有するためのオープンソースのコマンドラインユーティリティです。

### ステップ1：asciinema CLIのインストール

まず、ローカルマシンに `asciinema` ツールをインストールします。インストール方法はオペレーティングシステムによって異なります。

```bash インストール icon=lucide:download
# Homebrewを使用したmacOSでのインストール
brew install asciinema

# APTを使用したUbuntu/Debianでのインストール
sudo apt install asciinema

# pipxを使用（クロスプラットフォーム）
pipx install asciinema
```

追加のインストールオプションについては、公式の[asciinemaドキュメント](https://docs.asciinema.org/)を参照してください。

### ステップ2：セッションの録画

`asciinema` がインストールされたら、`rec` コマンドを実行してターミナルセッションの録画を開始できます。

```bash 録画コマンド icon=lucide:radio-tower
# 新しい録画を開始し、「my-demo.cast」に保存します
asciinema rec my-demo.cast
```

コマンドを開始した後、ターミナル内でキャプチャしたいすべてのアクションを実行します。録画を停止するには、`Ctrl+D` を押すか、`exit` コマンドを入力します。`my-demo.cast` という名前のファイルが現在のディレクトリに保存されます。`asciinema play my-demo.cast` を実行して、ローカルで再生を確認できます。

**重要な考慮事項：**
*   **手順を計画する：** 録画には、一時停止やエラーを含むすべてのアクションがキャプチャされます。事前にスクリプトを準備することをお勧めします。
*   **ターミナルのサイズ：** プレイヤーは、録画に使用されたターミナルの列と行のサイズを再現します。再生中にコンテンツが折り返されたり、切り捨てられたりするのを防ぐために、ターミナルウィンドウのサイズが適切であることを確認してください。

### ステップ3：.castファイルをJSONに変換

Terminal Playerコンポーネントは、録画データが特定のJSON形式である必要があります。この変換プロセスを簡略化するために、オンラインコンバーターが利用できます。

1.  **コンバーターに移動：** ウェブブラウザで [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide) を開きます。
2.  **ファイルをアップロード：** `.cast` ファイルをページにドラッグアンドドロップします。
3.  **プレビューとダウンロード：** このツールは録画のライブプレビューを生成します。それが正しいことを確認した後、変換された `.json` ファイルをダウンロードします。
4.  **プロジェクトに追加：** ダウンロードしたJSONファイルをウェブサイトのメディアまたはアセットディレクトリに配置します。

## Terminal Playerコンポーネントの使用

録画を作成して変換した後、ページの構成ファイルでTerminal Playerを定義することで、任意のページに統合できます。録画のJSONファイルへのパスを指定する必要があり、オプションでそのレイアウトを構成できます。

### 設定例

以下は、ページのデータファイル内で `TerminalPlayer` コンポーネントを構成する方法の例です。

```yaml ページ設定例 icon=lucide:file-cog
# ページのYAML設定ファイル内（例：page-name.yaml）

# ... その他のページコンテンツ ...

sections:
  - component: TerminalPlayer
    props:
      # ターミナルプレイヤーの上に表示されるタイトル
      title: "Live Demo"
      # 録画が何を示しているかの簡単な説明
      description: "This demo shows how to initialize a new AIGNE WebSmith project."
      # 録画ファイルへの相対パス
      recording: "/assets/data/my-demo.json"
      # (任意) コンポーネントのレイアウト。デフォルトは「right」です。
      layout: "left"

# ... その他のページセクション ...
```

### コンポーネントのプロパティ

`TerminalPlayer` コンポーネントは、その外観と動作をカスタマイズするために、以下のプロパティを受け入れます。

| プロパティ | タイプ | 必須 | 説明 |
| :--- | :--- | :--- | :--- |
| `title` | `string` | はい | コンポーネントセクションのタイトル。 |
| `description` | `string` | いいえ | タイトルの横に表示される短い説明。 |
| `recording` | `string` | はい | JSON録画ファイルへのパス。 |
| `layout` | `string` | いいえ | プレイヤーに対するテキストコンテンツの位置を決定します。`left` または `right` が指定できます。デフォルトは `right` です。 |

## まとめ

Terminal Playerコンポーネントは、コマンドラインのワークフローをデモンストレーションするための堅牢な方法を提供します。`asciinema` で録画し、オンラインでファイルを変換し、ページデータでコンポーネントを構成する手順に従うことで、ユーザーのために魅力的で有益な技術チュートリアルを作成できます。

詳細については、公式の[asciinemaウェブサイト](https://asciinema.org/)を参照してください。