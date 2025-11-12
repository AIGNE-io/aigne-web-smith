# コンテンツの準備

AIGNE WebSmith で最良の結果を得るには、適切なソース素材を提供することが最も重要なステップです。ウェブサイトの品質と関連性は、AI に提供する情報に直接依存します。このガイドでは、開始前に準備すべきことを正確に概説します。

ウェブサイトの生成を開始する前に、プロジェクト、製品、またはビジネスを説明するすべての関連ドキュメントを収集することが不可欠です。AI は、提供されたファイルのみをナレッジベースとして使用します。高品質で包括的なソース素材は、プロフェッショナルで正確なウェブサイトをもたらしますが、まばらな、または無関係なコンテンツは、一般的で効果の低いサイトにつながります。

最良の結果を得るためにナレッジを構造化する方法についてさらに深く知りたい場合は、[方法論](./guides.md)ガイドを参照してください。

```d2
direction: down

User: {
  shape: c4-person
}

Source-Content: {
  label: "ソースコンテンツディレクトリ"
  shape: rectangle
  grid-columns: 2

  Product-Documents: {
    label: "製品ドキュメント\n(.md, .pdf, .docx)"
  }

  Marketing-Plans: {
    label: "マーケティング計画\n(.md, .pdf)"
  }

  Business-Plans: {
    label: "事業計画\n(.docx, .md)"
  }

  Media-Assets: {
    label: "メディアアセット\n(.svg, .png)"
  }
}

Websmith-Config: {
  label: "websmith-config.yaml"
  shape: rectangle
}

AIGNE-WebSmith: {
  label: "AIGNE WebSmith"
  icon: "https://www.arcblock.io/image-bin/uploads/89a24f04c34eca94f26c9dd30aec44fc.png"
}

Generated-Website: {
  label: "生成されたウェブサイト"
  shape: rectangle
}

User -> Source-Content: "1. コンテンツの準備と整理"
User -> Websmith-Config: "2. sourcesPath の定義"
Websmith-Config -> AIGNE-WebSmith: "3. 設定の提供"
Source-Content -> AIGNE-WebSmith: "4. ソース素材の読み込み"
AIGNE-WebSmith -> Generated-Website: "5. ウェブサイトの生成"

```

## `sourcesPath` の役割

設定ファイル内の `sourcesPath` パラメーターは、AIGNE WebSmith にコンテンツの場所を伝えます。1つまたは複数のディレクトリを指定でき、AI はその中のファイルを再帰的に読み取り、ウェブサイトが何についてのものであるべきかを理解します。

これは、生成されるウェブサイトの品質を決定する上で最も重要な単一の設定です。

以下は、`websmith-config.yaml` ファイルで `sourcesPath` がどのように定義されるかの基本的な例です。

```yaml websmith-config.yaml icon=lucide:file-code
# ソース素材を含むディレクトリ
sourcesPath:
  - ./docs
  - ./product-briefs
# その他の設定詳細が続きます...
pagePurpose: "新しいSaaS製品のマーケティングウェブサイトを作成するため"
targetAudienceTypes: "潜在顧客、開発者、投資家"
```

この例では、WebSmith は `./docs` および `./product-briefs` ディレクトリ内のすべてのサポートされているファイルを、ウェブサイトを生成するためのコンテキストとして使用します。

## ソースコンテンツに含めるべきもの

効果的なウェブサイトを構築するために、AI はあなたの目的を明確に理解する必要があります。ソースコンテンツは、プロジェクトやビジネスの主要な側面を包括的にカバーする必要があります。

### 推奨されるコンテンツタイプ

プロジェクトを詳述するドキュメントのコレクションを提供してください。情報が徹底的であるほど、AI はあなたのビジョンに沿ったコンテンツをより良く作成できます。

| コンテンツタイプ | 説明 | 例 |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **製品ドキュメント** | 製品やサービス、その機能、利点、技術仕様の詳細な説明。 | `Product-Brief.md`, `Technical-Specifications.pdf`, `Feature-List.docx` |
| **マーケティング計画** | ターゲットオーディエンス、ブランドボイス、主要メッセージング、競合分析に関する情報。 | `Marketing-Strategy.md`, `Brand-Guidelines.pdf`, `Competitor-Analysis.pptx` |
| **事業計画** | 事業目標、ミッション、ビジョン、会社沿革のハイレベルな概要。 | `Business-Plan-Q3.docx`, `Company-Overview.md` |
| **既存のコンテンツ** | 再利用したり、スタイルやトーンの参考として使用できる既存の記事、ブログ投稿、またはドキュメント。 | `Blog-Posts/`, `FAQ.md`, `About-Us.txt` |
| **メディアファイル** | ウェブサイトに含めるべき画像、ロゴ、その他のビジュアルアセット。ウェブ表示に十分な品質であることを確認してください。 | `assets/logo.png`, `images/product-screenshot.jpg` |

### サポートされているファイル形式

AIGNE WebSmith は、テキストベースのコンテンツとメディアアセットの両方について、幅広い一般的なファイル形式をサポートしています。

| カテゴリ | サポートされている形式 |
| :------------ | :----------------------------------------------------------------------------------- |
| **テキスト** | `.md`, `.txt`, `.html`, `.json`, `.yaml`, `.xml` |
| **ドキュメント** | `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx` |
| **画像** | `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp` |
| **コード** | `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, およびその他の一般的なプログラミング言語ファイル |

## コンテンツディレクトリの構造化方法

よく整理されたディレクトリ構造は、あなたと AI の両方がソース素材を効果的に管理するのに役立ちます。フォルダ構造に厳格な要件はありませんが、論理的な整理が推奨されます。

ファイルを目的別にグループ化することを検討してください。これにより、`sourcesPath` 設定の管理が容易になり、どの情報が使用されているかを理解しやすくなります。

以下は、よく構造化されたコンテンツディレクトリの例です。

```sh project-sources/ icon=lucide:folder-tree
project-sources/
├── 01-business-plan/
│   ├── company-overview.md
│   └── mission-and-vision.txt
├── 02-product-docs/
│   ├── feature-list.md
│   └── technical-specifications.pdf
├── 03-marketing-materials/
│   ├── brand-guidelines.pdf
│   └── target-audience-profile.docx
└── 04-media-assets/
    ├── logo.svg
    └── product-screenshot.png
```

その後、`sourcesPath` をルートディレクトリを指すように設定できます。

```yaml websmith-config.yaml icon=lucide:file-code
sourcesPath:
  - ./project-sources
# その他の設定...
```

## まとめ

コンテンツの準備は、AIGNE WebSmith で高品質なウェブサイトを作成するための基礎的なステップです。包括的なソース素材を収集し、`sourcesPath` を使用して正しく指定することで、AI に正確で関連性の高いプロフェッショナルなウェブページを生成するために必要なコンテキストを提供します。

コンテンツの準備が整ったら、設定ファイルを作成し、最初のウェブサイトを生成する準備ができました。

<x-cards>
<x-card data-title="最初のウェブサイト" data-icon="lucide:rocket" data-href="/getting-started/your-first-website">
次のステップに進み、設定を作成してウェブサイトを生成します。
</x-card>
</x-cards>