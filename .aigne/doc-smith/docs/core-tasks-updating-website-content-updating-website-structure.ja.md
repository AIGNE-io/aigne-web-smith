# ウェブサイトの構造を更新する

ウェブサイトの構造は、しばしば情報アーキテクチャとも呼ばれ、そのページの配置と編成を指します。論理的な構造は、ユーザーのナビゲーションと理解にとって不可欠です。AIGNE WebSmithは、ページの追加、削除、更新、または再編成によってウェブサイトの構造を変更するための簡単なプロセスを提供します。

これらの構造的な変更は、個別のコマンドで実行されるわけではありません。代わりに、`update` コマンドに明確で自然言語のフィードバックを提供します。AIがあなたの指示を解釈し、必要な変更をウェブサイトの計画に適用します。このドキュメントでは、サイトの構造化に利用できる具体的な操作について概説します。

ページ内のコンテンツの変更に関する詳細は、[ページコンテンツの更新](./core-tasks-updating-website-content-updating-page-content.md)ガイドを参照してください。

## 更新プロセス

ウェブサイトの構造を変更するには、希望する変更を説明する対話形式のセッションが必要です。システムは、あなたの入力に基づいてこれらの変更を実行するための一連の専門ツールを使用します。

一般的なワークフローは次のとおりです。
1.  ターミナルで `aigne update` コマンドを実行します。
2.  システムがフィードバックを求めます。
3.  行いたい構造的な変更を明確に説明します（例：「新しい『ブログ』ページを追加する」、「『採用情報』ページを『会社概要』の下に移動する」）。
4.  AIがリクエストを分析し、必要な操作を実行し、更新された構造をレビューと確認のために提示します。

## 主要な構造操作

AIは、ウェブサイトの構造を変更するために4つの基本的な操作を実行できます。これらの操作を理解することで、より効果的なフィードバックを提供できるようになります。

### ページの追加

この操作は、ウェブサイトの構造内に新しいページを作成します。ページを追加するには、その必須プロパティを提供する必要があります。

**フィードバックの例：** `"タイトルが「サービス」で、パスが「/services」の新しいページを追加してください。トップレベルのページにしてください。"`

新しいページを作成する際には、以下のパラメータが使用されます。

<x-field-group>
  <x-field data-name="title" data-type="string" data-required="true">
    <x-field-desc markdown>新しいページのタイトル。ナビゲーションや見出しに表示されます。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="true">
    <x-field-desc markdown>ページの目的と内容の簡単な説明。</x-field-desc>
  </x-field>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>ページの一意のURLパス。`/`で始まる必要があります（例：`/about-us`）。</x-field-desc>
  </x-field>
  <x-field data-name="parentId" data-type="string" data-required="false">
    <x-field-desc markdown>親ページのパス。新しいページがサブページの場合、ここに親のパスを指定します。トップレベルのページの場合、これは`null`であるべきです。</x-field-desc>
  </x-field>
</x-field-group>

### ページの更新

この操作は、既存のページのタイトルや説明などのメタデータを変更します。変更したいページのパスを指定する必要があります。

**フィードバックの例：** `"「/about」のページを更新して、タイトルを「会社概要」にしてください。"`

既存のページを更新する際には、以下のパラメータが使用されます。

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>更新するページのURLパス。正しいページを特定するために使用されます。</x-field-desc>
  </x-field>
  <x-field data-name="title" data-type="string" data-required="false">
    <x-field-desc markdown>ページの新しいタイトル。</x-field-desc>
  </x-field>
  <x-field data-name="description" data-type="string" data-required="false">
    <x-field-desc markdown>ページの新しい説明。</x-field-desc>
  </x-field>
</x-field-group>

### ページの移動

この操作は、ウェブサイトの階層内でのページの位置を変更します。ページを別の親に移動したり、URLパスを変更したりできます。これはコンテンツを再編成するのに便利です。

**フィードバックの例：** `"「/team」のページを「/about」の子になるように移動してください。新しいパスは「/about/team」にしてください。"`

ページを移動する際には、以下のパラメータが使用されます。

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>移動したいページの現在のURLパス。</x-field-desc>
  </x-field>
  <x-field data-name="newParentId" data-type="string" data-required="false">
    <x-field-desc markdown>新しい親ページのパス。トップレベルのページにするには、これを省略するか`null`に設定します。</x-field-desc>
  </x-field>
  <x-field data-name="newPath" data-type="string" data-required="true">
    <x-field-desc markdown>ページの新しいURLパス。新しい階層を反映するようにパスを更新するのが標準的な方法です（例：ページを`/about`の下に移動すると、パスは`/about/newpage`のようになります）。</x-field-desc>
  </x-field>
</x-field-group>

### ページの削除

この操作は、ウェブサイトの構造からページを恒久的に削除します。

**重要：** 子ページ（サブページ）を持つページは直接削除できません。まずその子ページを移動または削除する必要があります。

**フィードバックの例：** `"パス「/archive/old-news」のページを削除してください。"`

ページを削除する際には、以下のパラメータが使用されます。

<x-field-group>
  <x-field data-name="path" data-type="string" data-required="true">
    <x-field-desc markdown>削除したいページのURLパス。</x-field-desc>
  </x-field>
</x-field-group>

## まとめ

`update` コマンドに明確で具体的な指示を提供することで、ウェブサイトの構造を効率的に管理できます。AIが技術的な実行を担当するため、あなたはコンテンツの論理的な編成に集中できます。

ページの構造化が完了したら、次のステップはページ内の情報を洗練させることです。詳細については、[ページコンテンツの更新](./core-tasks-updating-website-content-updating-page-content.md)ガイドに進んでください。