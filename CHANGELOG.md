# Changelog

## 1.0.0 (2026-08-14)


### Features

* add release management and generative page support ([2d7641e](https://github.com/yuseidemo/CodeAppsTemplate/commit/2d7641e3a62f59e1bf844cb20a117baa652f7be1))
* migrate to template-core dashboard and update repo references ([c498ca4](https://github.com/yuseidemo/CodeAppsTemplate/commit/c498ca4401c71d2e945db50ee4a9b53d6e2db90e))


### Bug Fixes

* stabilize dependency and release automation ([65097fc](https://github.com/yuseidemo/CodeAppsTemplate/commit/65097fc58d14b491ba4dcf46a45c491dae299da3))

## Changelog

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

- Dependabotのnpmメジャー更新を自動PR対象外とし、破壊的変更を個別に検証する運用へ変更
- Release Pleaseに必要なGitHub ActionsのPR作成権限設定をREADMEへ追加
- PowerCodeAgentのモデル固定を解除し、VS Codeのモデルピッカーで選択したモデルを使用するよう変更
- アーキテクチャ判断にモデル駆動型アプリの生成ページを追加
- モデル駆動型アプリSkillと生成ページSkillの責務を分離
- Power Platform共通標準とREADMEへ生成ページ開発フローを追加
- 生成ページSkillへReact 17、Fluent UI V9、RuntimeTypes、dataApi、Lookup名前解決、段階的UI構築の実装規約を追加

### Security

- 脆弱な推移依存関係を解消し、`npm audit` で脆弱性0件を確認
