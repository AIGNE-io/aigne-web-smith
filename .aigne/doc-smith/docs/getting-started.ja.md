# はじめに

このガイドは、サイトを稼働させるための最短ルートです。AIGNE CLI のインストール、ソース資料の収集、`aigne web generate` の実行、プランの承認、生成されたページの確認をすべて一か所で行います。

## エンドツーエンドのフローを見る

```d2
direction: right

Developer: {
  label: "あなた"
  shape: c4-person
}

Install: {
  label: "AIGNE CLI をインストール"
  shape: rectangle
}

Workspace: {
  label: "プロジェクトを作成 + ソースを収集"
  shape: rectangle
}

Generate: {
  label: "`aigne web generate` を実行"
  shape: rectangle
}

Plan: {
  label: "ウェブサイトプランを承認"
  shape: diamond
}

Review: {
  label: "生成されたページを検査"
  shape: rectangle
}

Developer -> Install -> Workspace -> Generate -> Plan -> Review -> Developer
```

## 前提条件

- **Node.js 20 以降** (npm が含まれています)。`node -v` で確認してください。
- **AIGNE アカウント** (任意)。API キーを追加することなく、AIGNE CLI に同梱されているホストされたモデルを使用できます。
- 製品やサービスを説明する**ソース資料**。より詳細なチェックリストについては、[資料の準備](./reference-prepare-materials.md)ガイドをお読みください。

## ステップ 1. AIGNE CLI のインストールと検証

AIGNE CLI をグローバルにインストールし、どのフォルダからでも `aigne` コマンドが利用できるようにします。

```bash AIGNE CLI をインストール icon=lucide:terminal
npm install -g @aigne/cli
```

インストールが成功したことを確認します。

```bash --help icon=lucide:terminal
aigne web --help
```

ベータチャネルが必要ですか？`npm install -g @aigne/cli@beta` でインストールし、`aigne web upgrade --beta` を実行して最新の Agent を取得してください。

## ステップ 2. プロジェクトワークスペースの作成

最初のサイト用にクリーンなディレクトリを設定し、そのディレクトリに移動します。

```bash ワークスペースを作成 icon=mdi:folder-open
mkdir my-first-websmith-site
cd my-first-websmith-site
```

AI に読み込ませたいドキュメント、概要、メディアをこのフォルダ内（または近くの `sources` ディレクトリ）にコピーまたは作成します。明確に定義された資料は出力品質を劇的に向上させるため、数分かけて[準備チェックリスト](./reference-prepare-materials.md)に従ってください。

## ステップ 3. `aigne web generate` の実行

プロジェクトディレクトリから、ジェネレーターを起動します。

```bash ウェブサイトを生成 icon=material-symbols:rocket-launch-outline
aigne web generate
```

これは新しいワークスペースなので、WebSmith は対話型のウィザードを起動し、以下をキャプチャします。

1.  **ウェブサイトの目的** - 例：SaaS マーケティングサイト、ドキュメンテーションハブ、投資家向けアップデート。
2.  **ターゲットオーディエンス** - 開発者、顧客、投資家など。トーンと根拠を読者に合わせます。
3.  **ウェブサイトの規模** - 最小、標準、包括的から選択するか、AI に決定させます。
4.  **言語** - プライマリロケールと生成する翻訳を選択します。
5.  **ページディレクトリ** - 生成されたファイルが保存される場所（デフォルトは `aigne/web-smith/pages`）。
6.  **ソースパス** - 製品知識を含むディレクトリまたはファイル。
7.  **カスタムルール** - トーン、用語、コンプライアンスに関するリマインダーなどの制約。

あなたの回答は `.aigne/doc-smith/config.yaml` に書き込まれ、将来の実行で再利用できます。

## ステップ 4. 設定の確認

生成された設定ファイルを開き、特に `sourcesPath` の値が正しいかを確認します。以下は、簡略化された例です。

```yaml config.yaml icon=mdi:file-document-outline
projectName: My Awesome Project
projectDesc: This is a project that does amazing things.
pagePurpose:
  - saas
targetAudienceTypes:
  - developers
websiteScale: standard
locale: en
pagesDir: aigne/web-smith/pages
sourcesPath:
  - ./docs
  - ./briefs/product-overview.md
  - ./evidence
rules: >
  Use confident, concrete copy. Highlight 99.99% uptime and SOC 2 compliance.
```

> **重要：** `sourcesPath` は AI が参照できるすべてを制御します。生成されるコピーが正確であるように、概要、仕様、価格表、および証拠を含む正確なディレクトリを指すようにしてください。

## ステップ 5. プランの承認とページの検査

設定ファイルを読み取った後、WebSmith はサイトマップ（ページ、セクション、および主要な論点）を提案します。これを承認すると、AI がコンテンツを作成し、Astro/React テンプレートを組み立てます。実行が完了すると、次のものが表示されます。

- 選択した `pagesDir` 内に生成されたファイル。
- 各ページのログ。どのソースファイルが使用されたかを示します。
- 次のアクション（公開、翻訳、または反復）の提案。

生成されたページをローカルで開くか、直接[ウェブサイトの公開](./guides-publish-website.md)ガイドに進んでライブにプッシュします。

## 次のステップ

<x-cards data-columns="3">
  <x-card data-title="資料の準備" data-icon="lucide:folder-check" data-href="/reference/prepare-materials">
    すべての生成が高品質の入力から始まるように、再現可能なコンテンツキットを構築します。
  </x-card>
  <x-card data-title="ウェブサイトの作成" data-icon="lucide:wrench" data-href="/guides/create-website">
    `generate` ワークフローの高度なオプションについてさらに深く掘り下げます。
  </x-card>
  <x-card data-title="ウェブサイトの公開" data-icon="lucide:rocket" data-href="/guides/publish-website">
    生成されたページを WebSmith Cloud または独自のインフラでライブサイトに変えます。
  </x-card>
</x-cards>
