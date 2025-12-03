# ターミナルプレイヤー

ターミナルプレイヤーは、インタラクティブな録画済みターミナルセッションをウェブサイトに表示するために使用される特殊なコンポーネントです。このコンポーネントは、コマンドラインの指示をデモンストレーションしたり、ソフトウェアのインストールを紹介したり、明確で再生可能な形式でユーザーを技術的なプロセスを通じて案内したりするための効果的なツールです。

このコンポーネントは `asciinema` 形式で作成された録画を利用しており、これによりターミナル出力の軽量でテキストベースのキャプチャが保証されます。

## プロセスの概要

ターミナルプレイヤーを使用するワークフローは、明確で管理しやすい一連のステップに分解できます。プロセスは、開発者がターミナルセッションを録画することから始まり、エンドユーザーがウェブサイトでインタラクティブな再生を視聴することで完了します。

以下の図は、このプロセスを示しています：

<!-- DIAGRAM_IMAGE_START:flowchart:16:9 -->
![Terminal Player](assets/diagram/advanced-features-use-special-components-terminal-player-diagram-0.jpg)
<!-- DIAGRAM_IMAGE_END -->

## ターミナル録画の作成

ターミナルプレイヤーを使用するには、まず録画ファイルを作成する必要があります。これに推奨されるツールは `asciinema` で、これはターミナルセッションを録画および共有するためのオープンソースのコマンドラインユーティリティです。

### ステップ 1: `asciinema` CLI のインストール

まず、ローカルマシンに `asciinema` ツールをインストールします。インストール方法はオペレーティングシステムによって異なります。

```bash インストール icon=lucide:download
# macOS で Homebrew を使用する場合
brew install asciinema

# Ubuntu/Debian で APT を使用する場合
sudo apt install asciinema

# pipx を使用する場合（クロスプラットフォーム）
pipx install asciinema
```

追加のインストールオプションについては、公式の[asciinema ドキュメント](https://docs.asciinema.org/)を参照してください。

### ステップ 2: セッションの録画

`asciinema` がインストールされたら、`rec` コマンドを実行してターミナルセッションの録画を開始できます。

```bash 録画コマンド icon=lucide:radio-tower
# 新しい録画を開始し、「my-demo.cast」に保存します
asciinema rec my-demo.cast
```

コマンドを開始した後、ターミナル内でキャプチャしたいすべてのアクションを実行します。録画を停止するには、`Ctrl+D` を押すか、`exit` コマンドを入力します。`my-demo.cast` という名前のファイルが現在のディレクトリに保存されます。`asciinema play my-demo.cast` を実行することで、ローカルで再生を確認できます。

**重要な考慮事項：**
*   **手順を計画する：** 録画は、一時停止やエラーを含むすべてのアクションをキャプチャします。事前にスクリプトを準備することをお勧めします。
*   **ターミナルの寸法：** プレイヤーは、録画に使用されたターミナルの列と行の寸法を再現します。再生中にコンテンツが折り返されたり切り捨てられたりするのを防ぐために、ターミナルウィンドウのサイズが適切であることを確認してください。

### ステップ 3: `.cast` ファイルを JSON に変換する

ターミナルプレイヤーコンポーネントは、録画データが特定の JSON 形式であることを要求します。この変換プロセスを簡素化するために、オンラインコンバーターが利用可能です。

1.  **コンバーターに移動：** ウェブブラウザで [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide) を開きます。
2.  **ファイルをアップロード：** `.cast` ファイルをページにドラッグアンドドロップします。
3.  **プレビューとダウンロード：** ツールが録画のライブプレビューを生成します。それが正しいことを確認した後、変換された `.json` ファイルをダウンロードします。
4.  **プロジェクトに追加：** ダウンロードした JSON ファイルをウェブサイトのメディアまたはアセットディレクトリに配置します。

## 録画の使用

JSON 録画ファイルがプロジェクトのメディアまたはアセットディレクトリに配置されると、AI が利用できるようになります。YAML ファイルでコンポーネントを手動で設定する必要はありません。

コンテンツソースファイルでターミナルのデモンストレーションの必要性を記述するだけです。`aigne web generate` または `aigne web update` を実行すると、AI は関連する `.json` 録画を自動的に見つけ、ターミナルプレイヤーコンポーネントを使用してウェブサイトに表示します。

```bash AIGNE CLI コマンド icon=lucide:terminal
# ウェブサイトをゼロから生成する場合
aigne web generate
 
# 変更を加えてウェブサイトを更新する場合
aigne web update
```

録画に関する追加情報については、公式の [asciinema ウェブサイト](https://asciinema.org/) を参照してください。

## 追加リソース

- [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)
- [asciinema ドキュメント](https://docs.asciinema.org/)
