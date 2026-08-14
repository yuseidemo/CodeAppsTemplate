# Changelog

このプロジェクトの主な変更を記録します。バージョン管理は Semantic Versioning に従います。

## Unreleased

### Added

- モデル駆動型アプリの生成ページを設計・作成・編集・デプロイする `generative-page-skill` を追加
- PowerCodeAgent にモデル駆動型アプリと生成ページの開発フェーズを追加
- Node.js 24 LTS と npm 11 のバージョン管理を追加
- `package-lock.json` をGit管理対象に追加
- Pull Requestとmainブランチでlint、build、脆弱性監査を行うGitHub Actions CIを追加
- npm依存関係とGitHub Actionsを定期更新するDependabot設定を追加
- Semantic Versioning、CHANGELOG、GitHub Releaseを管理するRelease Pleaseを追加

### Changed

- PowerCodeAgentのモデル固定を解除し、VS Codeのモデルピッカーで選択したモデルを使用するよう変更
- アーキテクチャ判断にモデル駆動型アプリの生成ページを追加
- モデル駆動型アプリSkillと生成ページSkillの責務を分離
- Power Platform共通標準とREADMEへ生成ページ開発フローを追加
- 生成ページSkillへReact 17、Fluent UI V9、RuntimeTypes、dataApi、Lookup名前解決、段階的UI構築の実装規約を追加

### Security

- 脆弱な推移依存関係を解消し、`npm audit` で脆弱性0件を確認
