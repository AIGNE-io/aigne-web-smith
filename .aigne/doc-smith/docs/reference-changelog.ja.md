# 変更履歴

このドキュメントは、AIGNE WebSmith のすべての更新に関する包括的な記録を提供します。新機能、バグ修正、その他の変更が含まれており、バージョンごとに逆時系列で整理されています。

## [1.4.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.1-beta...v1.4.1-beta.1) (2025-10-08)

### バグ修正

*   プロンプトを調整し、コンポーネントライブラリを更新しました ([#104](https://github.com/AIGNE-io/aigne-web-smith/issues/104))。

## [1.4.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0...v1.4.1-beta) (2025-10-08)

### バグ修正

*   ページ構成ステップでのデータフィールドのマッチングロジックを洗練しました ([#102](https://github.com/AIGNE-io/aigne-web-smith/issues/102))。

## [1.4.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.8...v1.4.0) (2025-10-05)

このバージョンは、公式の 1.4.0 リリースです。

## [1.4.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.7...v1.4.0-beta.8) (2025-10-04)

### 機能

*   シンプルおよび git ベースの更新履歴追跡の両方をサポートしました ([#98](https://github.com/AIGNE-io/aigne-web-smith/issues/98))。

## [1.4.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.6...v1.4.0-beta.7) (2025-10-03)

### バグ修正

*   メディアファイルがページのデータソースに自動的に含まれるようになりました ([#92](https://github.com/AIGNE-io/aigne-web-smith/issues/92))。

## [1.4.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.5...v1.4.0-beta.6) (2025-10-03)

### バグ修正

*   パフォーマンス向上のため、コンテンツ更新 Agent のプロンプトを調整しました ([#95](https://github.com/AIGNE-io/aigne-web-smith/issues/95))。

## [1.4.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.4.0-beta.4...v1.4.0-beta.5) (2025-10-03)

### バグ修正

*   **core:** より安定したウェブサイト生成ワークフローを実装しました ([#89](https://github.com/AIGNE-io/aigne-web-smith/issues/89))。

## [1.4.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.4...v1.4.0-beta.4) (2025-10-03)

### 機能

*   トークンの消費量と生成時間を削減するため、スマートソースサジェスチョンを追加しました ([#87](https://github.com/AIGNE-io/aigne-web-smith/issues/87))。

## [1.3.1-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.3...v1.3.1-beta.4) (2025-10-02)

### バグ修正

*   **ux:** ウェブサイト構造とページコンテンツのチューニングを高速化するため、共有コンテキストを実装しました ([#85](https://github.com/AIGNE-io/aigne-web-smith/issues/85))。

## [1.3.1-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.2...v1.3.1-beta.3) (2025-10-02)

### バグ修正

*   **ux:** 明確にするため、公開成功メッセージの文言を調整しました。

## [1.3.1-beta.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.1...v1.3.1-beta.2) (2025-10-02)

### バグ修正

*   **ux:** 明確にするため、生成成功メッセージの文言を調整しました ([#54](https://github.com/AIGNE-io/aigne-web-smith/issues/54))。

## [1.3.1-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.1-beta.0...v1.3.1-beta.1) (2025-10-02)

### バグ修正

*   **core:** 設定エラーを防ぐため、ページ詳細に YAML スキーマ検証を追加しました ([#52](https://github.com/AIGNE-io/aigne-web-smith/issues/52))。

## [1.3.0-beta.8](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.7...v1.3.0-beta.8) (2025-10-01)

### 機能

*   組み込みのコンポーネントライブラリを更新し、テンプレート処理を強化しました ([#48](https://github.com/AIGNE-io/aigne-web-smith/issues/48))。

## [1.3.0-beta.7](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.6...v1.3.0-beta.7) (2025-10-01)

### 機能

*   ウェブサイトの初期化フロー中にカスタムルールを入力する機能を追加しました ([#44](https://github.com/AIGNE-io/aigne-web-smith/issues/44))。
*   有料のウェブサイトデプロイメントサービスを統合しました ([#42](https://github.com/AIGNE-io/aigne-web-smith/issues/42))。
*   **auth:** 公開承認にユーザーロール要件を追加しました ([#46](https://github.com/AIGNE-io/aigne-web-smith/issues/46))。
*   `theme` および `component` コマンドでネストされたサブコマンドをサポートしました ([#45](https://github.com/AIGNE-io/aigne-web-smith/issues/45))。

### バグ修正

*   **ux:** ウェブサイト作成失敗時のエラーメッセージを改善しました ([#47](https://github.com/AIGNE-io/aigne-web-smith/issues/47))。

## [1.3.0-beta.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.5...v1.3.0-beta.6) (2025-09-30)

### バグ修正

*   **generate:** より柔軟性を高めるため、コンポーネントマッチングがフィールドのスーパーセットにフォールバックできるようにしました ([#40](https://github.com/AIGNE-io/aigne-web-smith/issues/40))。

## [1.3.0-beta.5](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.4...v1.3.0-beta.5) (2025-09-27)

### 機能

*   **core:** ウェブサイトのコンテンツ生成を更新し、UI コンポーネントを改善しました ([#39](https://github.com/AIGNE-io/aigne-web-smith/issues/39))。

### バグ修正

*   テーマ Agent のインタラクションフローを改善しました ([#34](https://github.com/AIGNE-io/aigne-web-smith/issues/34))。
*   セクション管理ツールを更新し、YAML 文字列入力を正しく処理するようにしました ([#37](https://github.com/AIGNE-io/aigne-web-smith/issues/37))。

## [1.3.0-beta.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.3...v1.3.0-beta.4) (2025-09-26)

### バグ修正

*   **core:** CLI から `clear` コマンドが欠落していたバグを修正しました。

## [1.3.0-beta.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.3.0-beta.2...v1.3.0-beta.3) (2025-09-26)

### バグ修正

*   **core:** CLI から `component` コマンドが欠落していたバグを修正しました。
*   **main:** コンポーネントライブラリの UI から不要なパディングを削除しました。

## [1.3.0-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta.1...v1.3.0-beta.1) (2025-09-24)

### 機能

*   テーマの生成と管理を可能にするテーマ Agent のサポートを追加しました ([#28](https://github.com/AIGNE-io/aigne-web-smith/issues/28))。

## [1.2.2-beta.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.2-beta...v1.2.2-beta.1) (2025-09-24)

### バグ修正

*   ユーザーがウェブサイトの構造を確認および修正するためのツールを追加しました ([#29](https://github.com/AIGNE-io/aigne-web-smith/issues/29))。

## [1.2.2-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.1-beta...v1.2.2-beta) (2025-09-23)

### 機能

*   **core:** AI が生成するコンテンツのスタイルを洗練させるため、Agent のプロンプトに MBTI パーソナを追加しました ([#26](https://github.com/AIGNE-io/aigne-web-smith/issues/26))。

## [1.2.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.2.0-beta...v1.2.1-beta) (2025-09-22)

### 機能

*   生成されたファイルとデータを削除するための `clear` コマンドを追加しました。

### バグ修正

*   ウェブサイトの公開に関連するバグを修正しました。

## [1.2.0-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.5-beta...v1.2.0-beta) (2025-09-19)

### 機能

*   **core:** 組み込みのコンポーネントライブラリのサポートを追加しました ([#21](https://github.com/AIGNE-io/aigne-web-smith/issues/21))。

## [1.1.5-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.4-beta...v1.1.5-beta) (2025-09-19)

### バグ修正

*   **core:** ページデータ構成のエラーを修正し、ページのキャッシュ問題を解決しました。

## [1.1.1-beta](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.1.0...v1.1.1-beta) (2025-09-16)

### バグ修正

*   **ci:** ベータ版リリースの公開をサポートしました ([#14](https://github.com/AIGNE-io/aigne-web-smith/issues/14))。

## [1.1.0](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.6...v1.1.0) (2025-09-15)

### 機能

*   ウェブサイトの公開ロジックを最適化しました ([#11](https://github.com/AIGNE-io/aigne-web-smith/issues/11))。

## [1.0.6](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.4...v1.0.6) (2025-09-15)

### 機能

*   `projectId` を必要とせずにウェブサイトを公開できるようにしました。

### バグ修正

*   **cli:** クラッシュを防ぐため、コンポーネントパーサーにエラーハンドリングを追加しました。

## [1.0.4](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.3...v1.0.4) (2025-09-12)

### バグ修正

*   **cli:** 設定ファイル内で `temperature` キーが重複していたバグを解決しました。

## [1.0.3](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.2...v1.0.3) (2025-09-12)

### バグ修正

*   **cli:** ESLint のエラーを修正し、「name not defined」のバグを解決しました。

## [1.0.2](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.1...v1.0.2) (2025-09-11)

### バグ修正

*   **cli:** 生成中のコンテンツエラーを解決しました。

## [1.0.1](https://github.com/AIGNE-io/aigne-web-smith/compare/v1.0.0...v1.0.1) (2025-09-11)

### バグ修正

*   **ci:** npmjs への公開時に発生していたエラーを修正しました。

## [1.0.0](https://github.com/AIGNE-io/aigne-web-smith) (2025-09-11)

### 機能

*   リポジトリの初期設定と最初の公開リリース。