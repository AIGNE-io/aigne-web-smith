# ターミナルプレイヤー

ターミナルプレイヤーは、インタラクティブな、事前に録画されたターミナルセッションをウェブサイトに表示するために使用される特殊なコンポーネントです。このコンポーネントは、コマンドラインの指示をデモンストレーションしたり、ソフトウェアのインストールを紹介したり、技術的なプロセスを明確で再生可能な形式でユーザーに案内したりするための効果的なツールです。

このコンポーネントは `asciinema` 形式で作成された録画を利用しており、これによりターミナル出力の軽量なテキストベースのキャプチャが保証されます。

## プロセスの概要

ターミナルプレイヤーを使用するためのワークフローは、明確で管理しやすい一連のステップに分解できます。このプロセスは、開発者がターミナルセッションを録画することから始まり、エンドユーザーがウェブサイトでインタラクティブな再生を視聴することで完了します。

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
  label: "ArcBlock オンラインコンバーター"
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
    label: "TerminalPlayer コンポーネント"
  }
}

Website-Visitor: {
  label: "ウェブサイト訪問者"
  shape: c4-person
}

Developer -> Terminal: "1. セッションを録画"
Terminal -> Cast-File: "2. 生成"
Cast-File -> Online-Converter: "3. アップロード & 変換"
Online-Converter -> JSON-File: "4. ダウンロード"
JSON-File -> Website-Project.Page-Config: "5. 設定で参照"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 再生を表示"
```

## ターミナル録画の作成

ターミナルプレイヤーを使用するには、まず録画ファイルを作成する必要があります。これには、ターミナルセッションを録画および共有するためのオープンソースのコマンドラインユーティリティである `asciinema` の使用を推奨します。

### ステップ1：`asciinema` CLIのインストール

まず、ローカルマシンに `asciinema` ツールをインストールします。インストール方法はオペレーティングシステムによって異なります。

```bash インストール icon=lucide:download
# Homebrew を使用した macOS でのインストール
brew install asciinema

# APT を使用した Ubuntu/Debian でのインストール
sudo apt install asciinema

# pipx を使用（クロスプラットフォーム）
pipx install asciinema
```

追加のインストールオプションについては、公式の [asciinema ドキュメント](https://docs.asciinema.org/) を参照してください。

### ステップ2：セッションの録画

`asciinema` がインストールされたら、`rec` コマンドを実行してターミナルセッションの録画を開始できます。

```bash 録画コマンド icon=lucide:radio-tower
# 新しい録画を開始し、「my-demo.cast」に保存します
asciinema rec my-demo.cast
```

コマンドを開始した後、ターミナル内でキャプチャしたいすべてのアクションを実行します。録画を停止するには、`Ctrl+D` を押すか、`exit` コマンドを入力します。`my-demo.cast` という名前のファイルが現在のディレクトリに保存されます。`asciinema play my-demo.cast` を実行することで、ローカルで再生を確認できます。

**重要な考慮事項：**
*   **手順を計画する：** 録画には、一時停止やエラーを含むすべてのアクションがキャプチャされます。事前にスクリプトを準備することをお勧めします。
*   **ターミナルの寸法：** プレイヤーは録画に使用されたターミナルの列と行の寸法を再現します。再生中にコンテンツの折り返しや切り捨てを防ぐために、ターミナルウィンドウのサイズが適切であることを確認してください。

### ステップ3：`.cast` ファイルを JSON に変換する

Terminal Player コンポーネントは、録画データが特定の JSON 形式であることを要求します。この変換プロセスを簡素化するために、オンラインコンバーターが利用可能です。

1.  **コンバーターに移動：** ウェブブラウザで [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide) を開きます。
2.  **ファイルをアップロード：** `.cast` ファイルをページにドラッグアンドドロップします。
3.  **プレビューとダウンロード：** このツールは録画のライブプレビューを生成します。それが正しいことを確認した後、変換された `.json` ファイルをダウンロードします。
4.  **プロジェクトに追加：** ダウンロードした JSON ファイルをウェブサイトのメディアまたはアセットディレクトリに配置します。
 
## 録画の使用
 
JSON 録画ファイルがプロジェクトのメディアまたはアセットディレクトリに配置されると、AI がそれを利用できるようになります。YAML ファイルでコンポーネントを手動で設定する必要はありません。
 
コンテンツソースファイルにターミナルのデモンストレーションが必要であることを記述するだけです。`aigne web generate` または `aigne web update` を実行すると、AI が関連する `.json` 録画を自動的に見つけ、Terminal Player コンポーネントを使用してウェブサイトに表示します。
 
```bash AIGNE CLI コマンド icon=lucide:terminal
# ウェブサイトをゼロから生成する場合
aigne web generate
 
# 変更内容でウェブサイトを更新する場合
aigne web update
```
 
録画に関する追加情報については、公式の [asciinema ウェブサイト](https://asciinema.org/) を参照してください。

## 追加リソース

- [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)
- [asciinema ドキュメント](https://docs.asciinema.org/)