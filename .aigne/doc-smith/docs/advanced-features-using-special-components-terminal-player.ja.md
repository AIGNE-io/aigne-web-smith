# ターミナルプレイヤー

ターミナルプレイヤーは、インタラクティブで事前に記録されたターミナルセッションをウェブサイトに表示するために使用される特殊なコンポーネントです。このコンポーネントは、コマンドラインの指示をデモンストレーションしたり、ソフトウェアのインストールを紹介したり、技術的なプロセスを明確で再生可能な形式でユーザーに案内したりするための効果的なツールです。

このコンポーネントは、`asciinema`形式で作成された記録を利用しており、これによりターミナル出力の軽量でテキストベースのキャプチャが保証されます。

## プロセスの概要

ターミナルプレイヤーを使用するためのワークフローは、明確で管理しやすい一連のステップに分けることができます。プロセスは、開発者がターミナルセッションを記録することから始まり、エンドユーザーがウェブサイトでインタラクティブな再生を視聴することで完了します。

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
    label: "TerminalPlayerコンポーネント"
  }
}

Website-Visitor: {
  label: "ウェブサイト訪問者"
  shape: c4-person
}

Developer -> Terminal: "1. セッションを記録"
Terminal -> Cast-File: "2. 生成"
Cast-File -> Online-Converter: "3. アップロードと変換"
Online-Converter -> JSON-File: "4. ダウンロード"
JSON-File -> Website-Project.Page-Config: "5. 設定で参照"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "設定"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. 再生を表示"
```

## ターミナル記録の作成

ターミナルプレイヤーを使用するには、まず記録ファイルを作成する必要があります。これに推奨されるツールは、ターミナルセッションを記録および共有するためのオープンソースのコマンドラインユーティリティである`asciinema`です。

### ステップ1：`asciinema` CLIのインストール

まず、ローカルマシンに`asciinema`ツールをインストールします。インストール方法はオペレーティングシステムによって異なります。

```bash インストール icon=lucide:download
# Homebrewを使用したmacOSでのインストール
brew install asciinema

# APTを使用したUbuntu/Debianでのインストール
sudo apt install asciinema

# pipxを使用（クロスプラットフォーム）
pipx install asciinema
```

追加のインストールオプションについては、公式の[asciinemaドキュメント](https://docs.asciinema.org/)を参照してください。

### ステップ2：セッションの記録

`asciinema`がインストールされたら、`rec`コマンドを実行してターミナルセッションの記録を開始できます。

```bash 記録コマンド icon=lucide:radio-tower
# 新しい記録を開始し、「my-demo.cast」に保存します
asciinema rec my-demo.cast
```

コマンドを開始した後、ターミナル内でキャプチャしたいすべてのアクションを実行します。記録を停止するには、`Ctrl+D`を押すか、`exit`コマンドを入力します。`my-demo.cast`という名前のファイルが現在のディレクトリに保存されます。`asciinema play my-demo.cast`を実行することで、ローカルで再生を確認できます。

**重要な考慮事項：**
*   **手順を計画する：** 記録には、一時停止やエラーを含むすべてのアクションがキャプチャされます。事前にスクリプトを準備することをお勧めします。
*   **ターミナルの寸法：** プレイヤーは記録に使用されたターミナルの列と行の寸法を複製します。再生中にコンテンツの折り返しや切り捨てを防ぐために、ターミナルウィンドウのサイズが適切であることを確認してください。

### ステップ3：`.cast`ファイルをJSONに変換

Terminal Playerコンポーネントは、記録データを特定のJSON形式にする必要があります。この変換プロセスを簡略化するために、オンラインコンバーターが利用できます。

1.  **コンバーターに移動：** Webブラウザで[ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)を開きます。
2.  **ファイルをアップロード：** `.cast`ファイルをページにドラッグアンドドロップします。
3.  **プレビューとダウンロード：** ツールが記録のライブプレビューを生成します。正しいことを確認した後、変換された`.json`ファイルをダウンロードします。
4.  **プロジェクトに追加：** ダウンロードしたJSONファイルをウェブサイトのメディアまたはアセットディレクトリに配置します。
 
## 記録の使用
 
JSON記録ファイルがプロジェクトのメディアまたはアセットディレクトリに配置されると、AIが利用できるようになります。YAMLファイルでコンポーネントを手動で設定する必要はありません。
 
コンテンツソースファイルでターミナルのデモンストレーションの必要性を記述するだけです。`aigne generate`または`aigne update`を実行すると、AIは関連する`.json`記録を自動的に見つけ、Terminal Playerコンポーネントを使用してウェブサイトに表示します。
 
```bash AIGNE CLIコマンド icon=lucide:terminal
# ウェブサイトをゼロから生成する
aigne generate
 
# 変更をウェブサイトに反映させる
aigne update
```
 
記録に関する追加情報については、公式の[asciinemaウェブサイト](https://asciinema.org/)を参照してください。