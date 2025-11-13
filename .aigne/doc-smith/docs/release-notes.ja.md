# リリース履歴

このドキュメントは、AIGNE WebSmith のすべてのバージョン更新を記録しています。新機能、バグ修正、その他の変更が含まれており、バージョンごとに逆時系列で整理されています。

## [1.8.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.7.0...v1.8.0-beta) (2025-11-13)

### 機能

* add-page および remove-page のサポート ([#231](https://github.com/AIGNE-io/aigne-web-smith/issues/231)) ([d02fe21](https://github.com/AIGNE-io/aigne-web-smith/commit/d02fe21b0425b870ad7ba98d4bc28c4a0f95c8e2))

## [1.7.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.7.0-beta.3...v1.7.0) (2025-11-11)

## [1.7.0-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.7.0-beta.2...v1.7.0-beta.3) (2025-11-11)

### 機能

* AI フォールバック付きの自動セクションエラー修正システムを追加 ([#239](https://github.com/AIGNE-io/aigne-web-smith/issues/239)) ([7fe6421](https://github.com/AIGNE-io/aigne-web-smith/commit/7fe64215114d5cfa99afc658ec7f967855c1ed69))
* **validate:** プロジェクト名と説明に最大長を強制 ([#238](https://github.com/AIGNE-io/aigne-web-smith/issues/238)) ([3aef2d5](https://github.com/AIGNE-io/aigne-web-smith/commit/3aef2d556f2fdb40ef6ab4538bd7146e580fc5af))

### バグ修正

* 詳細チェックユーティリティにおけるエラーハンドリングとパラメータ抽出を改善 ([#240](https://github.com/AIGNE-io/aigne-web-smith/issues/240)) ([16f1397](https://github.com/AIGNE-io/aigne-web-smith/commit/16f1397809c47bbb73997cc08f026f3cebed476b))
* チャットモデルを aignehub/gemini-2.5-pro から google/gemini-2.5-pro に更新 ([0c01596](https://github.com/AIGNE-io/aigne-web-smith/commit/0c01596da4c6659ce6da080327d7ddf2bef5a650))

## [1.7.0-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.7.0-beta.1...v1.7.0-beta.2) (2025-11-10)

### バグ修正

* 公開アクセストークン環境の命名を調整 ([#234](https://github.com/AIGNE-io/aigne-web-smith/issues/234)) ([2887bd9](https://github.com/AIGNE-io/aigne-web-smith/commit/2887bd95487626ace7e4ecb200eb0c4222ab1ef8))

## [1.7.0-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.7.0-beta...v1.7.0-beta.1) (2025-11-10)

### バグ修正

* 既存の翻訳ファイルに対する検証チェックを追加 ([#232](https://github.com/AIGNE-io/aigne-web-smith/issues/232)) ([f9760fb](https://github.com/AIGNE-io/aigne-web-smith/commit/f9760fbf295b51cf35a728e8a351f099401359bb))

## [1.7.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0...v1.7.0-beta) (2025-11-08)

### 機能

* バージョン v2 の組み込みコンポーネントを使用するようにアップグレード ([#229](https://github.com/AIGNE-io/aigne-web-smith/issues/229)) ([93e3915](https://github.com/AIGNE-io/aigne-web-smith/commit/93e3915c6140c5b7061762cdc635a4632e92b3cf))

## [1.6.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.15...v1.6.0) (2025-11-07)

## [1.6.0-beta.15](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.14...v1.6.0-beta.15) (2025-11-07)

### バグ修正

* 生成されたメディアの後にメディアを再読み込み ([#226](https://github.com/AIGNE-io/aigne-web-smith/issues/226)) ([1b0a62b](https://github.com/AIGNE-io/aigne-web-smith/commit/1b0a62b63eab6abf93950888346e9edc1a7d7952))

## [1.6.0-beta.14](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.13...v1.6.0-beta.14) (2025-11-07)

### 機能

* カスタマイズ可能な AI モデル設定のための reasoning effort 設定を追加 ([#223](https://github.com/AIGNE-io/aigne-web-smith/issues/223)) ([47813ce](https://github.com/AIGNE-io/aigne-web-smith/commit/47813ce77277ece9ec74a38870ae11d1540d7a6d))
* **doc:** 明確性と一貫性のために設定ドキュメントと履歴エントリを更新 ([#222](https://github.com/AIGNE-io/aigne-web-smith/issues/222)) ([1941dee](https://github.com/AIGNE-io/aigne-web-smith/commit/1941deed2f52edfbd84318ea546b92b771204e9d))
* **guest:** ゲストが公式サイトにウェブページを公開できるようにする ([#220](https://github.com/AIGNE-io/aigne-web-smith/issues/220)) ([3367ce9](https://github.com/AIGNE-io/aigne-web-smith/commit/3367ce9e5dbff39afc879f5dc312cab6e9f93ce4))

### バグ修正

* reasoning effort 定数を一元化し、初期化ロジックをリファクタリング ([#225](https://github.com/AIGNE-io/aigne-web-smith/issues/225)) ([fe3c0cb](https://github.com/AIGNE-io/aigne-web-smith/commit/fe3c0cbcabe80c75da3f309e954efc524bb8fb81))
* ページのタイミングフィールドをより正確に ([#224](https://github.com/AIGNE-io/aigne-web-smith/issues/224)) ([bf074d9](https://github.com/AIGNE-io/aigne-web-smith/commit/bf074d9801d9c4fd15442c0f727416020c5d1d38))

## [1.6.0-beta.13](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.12...v1.6.0-beta.13) (2025-11-05)

### 機能

* メディアファイルと効率化されたナビゲーションでページ検証を強化 ([#217](https://github.com/AIGNE-io/aigne-web-smith/issues/217)) ([7777805](https://github.com/AIGNE-io/aigne-web-smith/commit/77778050e4473222a859001c306265d22bc531ba))
* より良いエラーハンドリングとフィルタリングでコンポーネントの読み込みを改善 ([a375567](https://github.com/AIGNE-io/aigne-web-smith/commit/a375567cedf031f834712e133b66742c3d04df77))

### バグ修正

* choosePages のエラーロギングを改善 ([#215](https://github.com/AIGNE-io/aigne-web-smith/issues/215)) ([645a591](https://github.com/AIGNE-io/aigne-web-smith/commit/645a591bea6434f0e1ad172c40e2aee82a07b503))
* 有料デプロイメントをよりスムーズで安定させる ([#214](https://github.com/AIGNE-io/aigne-web-smith/issues/214)) ([d6bccfb](https://github.com/AIGNE-io/aigne-web-smith/commit/d6bccfb7a6a3d45c3498b4b84128a5ee62ac610e))
* theme/prefs/component/publish コマンドと検証を調整 ([#219](https://github.com/AIGNE-io/aigne-web-smith/issues/219)) ([d2e8465](https://github.com/AIGNE-io/aigne-web-smith/commit/d2e8465471cb2ff2bad4fc3deb8ad7e5245616d3))

## [1.6.0-beta.12](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.11...v1.6.0-beta.12) (2025-11-05)

### 機能

* 意図分析を用いて更新操作のトークン消費を調整 ([#212](https://github.com/AIGNE-io/aigne-web-smith/issues/212)) ([534aa3e](https://github.com/AIGNE-io/aigne-web-smith/commit/534aa3e3bce96feb7334e8d3701c7c29909a2059))

## [1.6.0-beta.11](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.10...v1.6.0-beta.11) (2025-11-04)

### 機能

* agent 設定に reasoning_effort パラメータを追加 ([#184](https://github.com/AIGNE-io/aigne-web-smith/issues/184)) ([a31899f](https://github.com/AIGNE-io/aigne-web-smith/commit/a31899f805a9bd0fd5a75f90f02199d5298fb6ab))
* 無効なソースに対する警告と翻訳メッセージの調整 ([#183](https://github.com/AIGNE-io/aigne-web-smith/issues/183)) ([b99e0b5](https://github.com/AIGNE-io/aigne-web-smith/commit/b99e0b554a936da9466bd7eeab4e46e429cee977))

## [1.6.0-beta.10](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.9...v1.6.0-beta.10) (2025-11-03)

### 機能

* **doc:** config.yml ガイドを追加し、最新の更新ドキュメントを更新 ([#175](https://github.com/AIGNE-io/aigne-web-smith/issues/175)) ([46b1ef0](https://github.com/AIGNE-io/aigne-web-smith/commit/46b1ef05282f9d345f5cd15b008eb6f8782f206c))

## [1.6.0-beta.9](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.8...v1.6.0-beta.9) (2025-11-01)

### バグ修正

* コンポーネントの背景色を調整 ([#178](https://github.com/AIGNE-io/aigne-web-smith/issues/178)) ([6ce85f6](https://github.com/AIGNE-io/aigne-web-smith/commit/6ce85f63ae5833f0e027d5586d213d51264d84a4))

## [1.6.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.7...v1.6.0-beta.8) (2025-11-01)

### 機能

* 特定ページのクリーニングをサポート ([#179](https://github.com/AIGNE-io/aigne-web-smith/issues/179)) ([ec49d3f](https://github.com/AIGNE-io/aigne-web-smith/commit/ec49d3f157bd9dfea6268dd412442e8f21544468))

## [1.6.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.6...v1.6.0-beta.7) (2025-11-01)

### バグ修正

* ウェブサイト構造表示での二重スラッシュ ([b905586](https://github.com/AIGNE-io/aigne-web-smith/commit/b905586d8b4c0c19964556b9fcbb1ba7ad2d8990))

## [1.6.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.5...v1.6.0-beta.6) (2025-11-01)

### 機能

* サイト構造表示時にページリンクを含める ([49569c8](https://github.com/AIGNE-io/aigne-web-smith/commit/49569c8fdd7fe0755df7ad63c20a73c4abf2f167))

## [1.6.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.4...v1.6.0-beta.5) (2025-10-31)

### 機能

* カルーセルコンポーネントを追加 ([#173](https://github.com/AIGNE-io/aigne-web-smith/issues/173)) ([d6c7a4b](https://github.com/AIGNE-io/aigne-web-smith/commit/d6c7a4b8308a406f44c0a43e05acbd458046fd31))

## [1.6.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.3...v1.6.0-beta.4) (2025-10-28)

### バグ修正

* 複数ページのコンテンツ計画を強化 ([#168](https://github.com/AIGNE-io/aigne-web-smith/issues/168)) ([3106397](https://github.com/AIGNE-io/aigne-web-smith/commit/31063972134c1188fc17545fa7872de2ca3c1ce9))

## [1.6.0-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.6.0-beta.2...v1.6.0-beta.3) (2025-10-27)

### バグ修正

* 組み込みコンポーネントのスタイルを最適化 ([#166](https://github.com/AIGNE-io/aigne-web-smith/issues/166)) ([e61bf64](https://github.com/AIGNE-io/aigne-web-smith/commit/e61bf643be8e0c48bc93d1520398f370fc36a825))

## [1.6.0-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.1-beta.2...v1.6.0-beta.2) (2025-10-26)

### 機能

* 公式サイトにドキュメントを公開 ([#162](https://github.com/AIGNE-io/aigne-web-smith/issues/162)) ([11a7641](https://github.com/AIGNE-io/aigne-web-smith/commit/11a76414cd94383d2dc4a09466a98f3bd9159c9e))

### バグ修正

* ソースファイルの変更検出ロジックを削除 ([#165](https://github.com/AIGNE-io/aigne-web-smith/issues/165)) ([0408df8](https://github.com/AIGNE-io/aigne-web-smith/commit/0408df87d57ed771d2d2b592c9c52b9414ebd410))

## [1.5.1-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.1-beta.1...v1.5.1-beta.2) (2025-10-24)

### バグ修正

* スクリーンショット表示をサポートするコンテンツカードコンポーネントを強化 ([#161](https://github.com/AIGNE-io/aigne-web-smith/issues/161)) ([1e4b67a](https://github.com/AIGNE-io/aigne-web-smith/commit/1e4b67a3593acda6b4682ddcaf0dfaa757348958))

## [1.5.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.1-beta...v1.5.1-beta.1) (2025-10-22)

### バグ修正

* **layout:** モバイルレスポンシブ対応のためにグリッド設定を調整 ([#156](https://github.com/AIGNE-io/aigne-web-smith/issues/156)) ([b873dbc](https://github.com/AIGNE-io/aigne-web-smith/commit/b873dbc7db7bc41a875d9b9c691fe6d9e2d2f955))

## [1.5.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0...v1.5.1-beta) (2025-10-21)

### バグ修正

* ホームページのアクションリンクを auto に変更 ([0959250](https://github.com/AIGNE-io/aigne-web-smith/commit/0959250bd26ca368ccbedfcad98892ed6061bc4c))
* updatePageDetail での重複したツール呼び出しを防止 ([#154](https://github.com/AIGNE-io/aigne-web-smith/issues/154)) ([ca5eba1](https://github.com/AIGNE-io/aigne-web-smith/commit/ca5eba14e72131db29c5ab0bf9c8deb27e4bd113))

## [1.5.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.16...v1.5.0) (2025-10-19)

## [1.5.0-beta.16](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.15...v1.5.0-beta.16) (2025-10-17)

### バグ修正

* ドキュメントのレビューと更新 ([#147](https://github.com/AIGNE-io/aigne-web-smith/issues/147)) ([436344c](https://github.com/AIGNE-io/aigne-web-smith/commit/436344c1bd1f1ac4fa98200927e184d705061c7d))
* updateSection ツールでコンポーネントタイプの変更を防止 ([#151](https://github.com/AIGNE-io/aigne-web-smith/issues/151)) ([cdbdc91](https://github.com/AIGNE-io/aigne-web-smith/commit/cdbdc9126e64071e7ef40a78bcdfc6da436b71d1))
* 再開機能とナビゲーションレイアウトのサポートを調整 ([#150](https://github.com/AIGNE-io/aigne-web-smith/issues/150)) ([4c62fbd](https://github.com/AIGNE-io/aigne-web-smith/commit/4c62fbdbcb9bf441644d6a260a086d5481f1e46d))

## [1.5.0-beta.15](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.14...v1.5.0-beta.15) (2025-10-16)

### バグ修正

* 更新後に翻訳モデルのキーを再読み込み ([#146](https://github.com/AIGNE-io/aigne-web-smith/issues/146)) ([c0183ff](https://github.com/AIGNE-io/aigne-web-smith/commit/c0183ff3d1417a7a3c0970bb71e9a61f8b63dfa6))

## [1.5.0-beta.14](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.13...v1.5.0-beta.14) (2025-10-16)

### バグ修正

* 翻訳ドキュメントの改善と翻訳出力を調整 ([#144](https://github.com/AIGNE-io/aigne-web-smith/issues/144)) ([681b076](https://github.com/AIGNE-io/aigne-web-smith/commit/681b0769ea00db461439af0dd5b939ae42309952))

## [1.5.0-beta.13](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.12...v1.5.0-beta.13) (2025-10-15)

### バグ修正

* ターミナル録画のサポートを追加 ([#143](https://github.com/AIGNE-io/aigne-web-smith/issues/143)) ([f23fbab](https://github.com/AIGNE-io/aigne-web-smith/commit/f23fbab98129fba91200b798d317090dcb4175d2))

## [1.5.0-beta.12](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.11...v1.5.0-beta.12) (2025-10-15)

### バグ修正

* plan -> detail により良いプロンプト構造を使用 ([#141](https://github.com/AIGNE-io/aigne-web-smith/issues/141)) ([aa01994](https://github.com/AIGNE-io/aigne-web-smith/commit/aa019946cfac635c4a2f5acfffc4b1468b969adb))

## [1.5.0-beta.11](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.5.0-beta.10...v1.5.0-beta.11) (2025-10-16)

### バグ修正

* 公開のためのプロジェクト検証と動的スラッグ処理を追加 ([#137](https://github.com/AIGNE-io/aigne-web-smith/issues/137))。
* エラーハンドリングと構造検証を強化 ([#133](https://github.com/AIGNE-io/aigne-web-smith/issues/133))。
* **ux:** ユーザーインタラクション向上のため、表示されるコピーを最適化 ([#136](https://github.com/AIGNE-io/aigne-web-smith/issues/136))。

... *(古いリリースは簡潔さのために省略)* ...