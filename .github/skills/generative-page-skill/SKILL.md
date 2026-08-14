---
name: generative-page-skill
description: "モデル駆動型アプリの生成ページ（Generative page / GenPage / GenUX）をReact + TypeScriptで設計・作成・編集・デプロイする。Use when: 生成ページ, Generative page, GenPage, GenUX, pac model genpage, dataApi, UX Agent Project, モデル駆動型アプリのカスタムUI, 自然言語でページ生成"
---

# モデル駆動型アプリ生成ページ開発スキル

モデル駆動型アプリ専用の生成ページを、Microsoft公式 Power Platform Skills の `model-apps` プラグインと PAC CLIで開発する。生成ページは `savedquery` や `systemform` ではなく、React + TypeScriptで実装される独立した **UX Agent Project** である。

## 使い分け

| 要件                                                    | 使用する機能             |
| ------------------------------------------------------- | ------------------------ |
| 標準の一覧・フォームで十分                              | `model-driven-app-skill` |
| Power Fx中心のローコードページ                          | カスタムページ           |
| Reactでダッシュボード、カード、カンバン、複合CRUDを実装 | **生成ページ**           |
| モデル駆動型アプリ外でも使う独立Webアプリ               | Code Apps                |

生成ページはモデル駆動型アプリでのみ利用できる。Code Appsやカスタムページと同一視しない。

## 公式ツールを正本とする

生成ページの実装規約、サンプル、依存バージョン、PAC CLI引数は、Microsoft公式リポジトリの `model-apps` プラグインを正本とする。

- リポジトリ: `microsoft/power-platform-skills`
- プラグイン: `model-apps@power-platform-skills`
- Skill: `/genpage`
- PAC CLI: `pac model genpage`

独自の生成ページデプロイスクリプトや `dataApi` ラッパーを新設せず、公式SkillとCLIを利用する。公式プラグインの更新内容と競合する手順をこのSkillへ複製しない。

## 前提条件

1. Node.js 24 LTS
2. Power Platform CLI 2.10.0超（最新を推奨）
3. 対象環境へ接続済みのPAC CLI認証プロファイル
4. 配置先のモデル駆動型アプリとソリューション
5. Microsoft公式 `model-apps` プラグイン

```powershell
# Power Platform Skills一括インストール
iwr https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js -OutFile install.js
node install.js
Remove-Item install.js
```

生成ページだけを導入する場合は、対応するAIコード生成ツールで次を実行する。

```text
/plugin marketplace add microsoft/power-platform-skills
/plugin install model-apps@power-platform-skills
```

## 必須ワークフロー

### Step 1: 事前確認

```powershell
node --version
pac help # 先頭のVersionが2.10.0超であること
pac auth list
pac org who
pac model genpage upload --help
```

- 対象環境、ソリューション、モデル駆動型アプリを明示する。
- PAC CLIが2.10.0以下の場合は作業を停止し、Power Platform Tools拡張またはPAC CLIを更新する。
- 既存ページの編集では、アプリ名やページ名を推測せず `pac model list` と `pac model genpage list` で取得する。
- `pac model genpage upload --help` に必要なオプションがない場合はPAC CLIを更新する。

### Step 2: 設計してユーザー承認を得る

実装前に次を提示し、承認を得る。

| 項目   | 内容                                                  |
| ------ | ----------------------------------------------------- |
| ページ | 表示名、目的、1ページまたは複数ページ                 |
| 配置先 | 環境、ソリューション、モデル駆動型アプリ、SiteMap位置 |
| データ | Dataverseテーブル、列、Lookup、Choice、最大6テーブル  |
| UI     | レイアウト、Fluent UIコンポーネント、レスポンシブ方針 |
| 操作   | 検索、フィルター、CRUD、ページング、確認ダイアログ    |
| 入力   | `recordId`、`entityName`、`data` の要否               |
| 多言語 | 対象言語、LCID、RTL、地域別書式                       |
| 検証   | アクセシビリティ、セキュリティ、ブラウザテスト        |

要件を次の代表パターンへ分類し、選択理由と初回実装範囲を提示する。

| パターン              | 向いている用途                           |
| --------------------- | ---------------------------------------- |
| 入力ウィザード        | 複数ステップの登録・申請・確認           |
| KPIダッシュボード     | 指標、傾向、内訳、ドリルダウン           |
| カンバン              | ステータス別カードと業務進行管理         |
| スケジュール / ガント | 期間、進捗、依存関係の可視化             |
| 地域・地図分析        | 地域別集計と位置情報の可視化             |
| オブジェクトフロー    | 主レコードと関連レコードの関係・遷移表示 |
| 分析レポート          | 期間比較、メンバー比較、予実分析         |

いきなり全機能を実装せず、次の順で段階的に構築する。

1. **Tier 1**: 主要業務、読み込み・空・エラー状態、レスポンシブ、基本CRUD
2. **Tier 2**: チャート、ドラッグ&ドロップ、詳細フィルター、操作性向上
3. **Tier 3**: 高度な可視化、アニメーション、追加分析、個別テーマ対応

承認前にコード生成、テーブル作成、アップロードを行わない。

### Step 3: 公式 `/genpage` で作成または編集する

新規作成:

```text
/genpage {ページ要件。対象テーブル、対象アプリ、対象ソリューションを含める}
```

既存編集:

```text
/genpage edit
```

公式Skillが生成する `package.json` と `genpage.d.ts` を保持し、`npm install` 後にIntelliSenseと型チェックを利用する。生成コードは単一の `.tsx` ページとしてレビューする。

Dataverseを利用する場合は、コード作成前に型を生成する。

```powershell
pac model genpage generate-types `
  --data-sources "entity1,entity2" `
  --output-file RuntimeTypes.ts
```

- `RuntimeTypes.ts` に存在しないテーブル名・列名・Choice値を推測して書かない。
- Microsoft公式プラグインが生成した依存バージョンを使用し、独自にReactやFluent UIを更新しない。
- React 17互換の構文を使用し、ページは単一の `.tsx` ファイルにまとめる。
- エントリポイントは公式テンプレートのexport形式を維持する。
- ルートの `FluentProvider` はランタイムが提供するため、ページ側で重複配置しない。
- スタイルはFluent UI V9の `makeStyles` と `tokens` を基本とし、動的値だけインライン指定する。
- `100vh` / `100vw` に依存せず、flexboxと親コンテナー基準のサイズを使う。
- アイコンはインストール済みパッケージに存在する名前を確認し、推測したアイコン名を使わない。

### Step 4: データアクセスを検証する

データ操作にはランタイム提供の `dataApi` のみを使用する。

| メソッド      | 用途                       |
| ------------- | -------------------------- |
| `queryTable`  | 一覧取得とページング       |
| `retrieveRow` | GUIDによる単一行取得       |
| `createRow`   | 行作成                     |
| `updateRow`   | 行更新                     |
| `deleteRow`   | 行削除                     |
| `getChoices`  | ローカライズ済みChoice取得 |

- テーブルと列は論理名を使用する。
- `queryTable` / `retrieveRow` は必ず `select` で列を限定する。
- Lookupの表示名列やODataアノテーション名を `select` に含めない。`_lookupcolumn_value` を取得し、参照先テーブルを別に問い合わせてMapで名前解決する。
- Lookup値が `EntityReference(guid)` 形式の場合を考慮し、GUIDを正規化してからMapを参照する。
- Lookup作成は `navigationProperty@odata.bind` を使用する。
- Choiceラベルをハードコードせず `getChoices` を使用する。
- `hasMoreRows` と `loadMoreRows` でページングする。
- `rows` はランタイムの読み取り専用配列として扱い、状態へ保存するときは `[...result.rows]` でコピーする。
- エラー、空状態、読み込み状態、二重送信防止を実装する。

### Step 5: デプロイと公開

公式Skillが提示する `pac model genpage upload` コマンドを使用する。

- 新規ページは `--add-to-sitemap` を使用する。
- 既存更新は `--page-id` を指定し、`--add-to-sitemap` を省略する。
- 初回の `--prompt` はページ要件全文、更新時は今回の差分だけを記述する。
- 新規アップロードがタイムアウトする場合は、設計書の要件を失わない範囲で `--prompt` と `--agent-message` を短い英語へ要約して再試行する。最初から意味のない短文にはしない。
- Dataverse利用時は `--data-sources` を指定する。
- ページを含むアプリを公開する。

初回デプロイ後は、キャッシュを考慮して再読み込みし、Tier 1の動作を確認してからTier 2以降へ進む。大規模な一括修正ではなく、小さな変更をアップロードして比較可能な履歴を残す。

## ナビゲーション

生成ページは `Xrm.Navigation.navigateTo` で開く。

```javascript
Xrm.Navigation.navigateTo(
  {
    pageType: "generative",
    pageId: "<page-id>",
    entityName: "account",
    recordId: "<record-id>",
    data: { view: "summary" },
  },
  { target: 2, position: 1, width: { value: 70, unit: "%" } },
);
```

- インライン表示と中央・サイドダイアログを利用できる。
- `Xrm.App.sidePanes.createPane()` は生成ページをサポートしない。
- 生成ページ内部からは `(window as any).Xrm` を使用する。
- 内部遷移で生URLや `window.location` を組み立てない。

## ALM

- 生成ページはソリューション対応で、`UX Agent Project` として移送される。
- アプリ、SiteMap、生成ページを同じソリューションへ含める。
- プレビュー期に作成したページは、アプリデザイナーで開いて移行を完了してからエクスポートする。
- 移送されるのは最初のプロンプトと公開済みコードであり、会話履歴や全イテレーションは移送されない。
- インポート先で接続参照と権限を再確認し、アプリを公開する。

## 制約

- Makerポータルでの生成は米国、英国、オーストラリア、シンガポールのみ。公式外部ツール方式はパブリッククラウドで世界対応。
- 1ページで参照できるDataverseテーブルは最大6個。
- Dataverse以外のデータソースは使用しない。
- 同時共同編集は不可。1ページを同時に編集する担当者は1人にする。
- Makerポータルのプロンプトは英語のみ。外部ツール方式でも生成後の翻訳と表示確認を行う。
- サポート対象外の列型を事前確認する。

## 完了条件

1. TypeScriptの型チェックが成功
2. 生成コードを人がレビュー
3. Accessibility Assistantの違反を解消
4. ページの読み込み、空状態、CRUD、ページング、入力パラメータを確認
5. Dataverseセキュリティロールでアクセスを確認
6. 対象モデル駆動型アプリを再公開
7. Playwrightまたは手動ブラウザテストを実施
8. ソリューションエクスポートの依存関係に生成ページが含まれることを確認

## 公式リファレンス

- https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-pages
- https://learn.microsoft.com/power-apps/maker/model-driven-apps/generative-page-external-tools
- https://learn.microsoft.com/power-apps/developer/model-driven-apps/generative-page/data-api/
- https://learn.microsoft.com/power-apps/developer/model-driven-apps/clientapi/navigate-to-generative-page-examples
- https://github.com/microsoft/power-platform-skills/tree/main/plugins/model-apps

## 実装知見の参考

- https://github.com/geekfujiwara/CodeAppsDevelopmentStandard/tree/main/.github/skills/generative-page

上記MITライセンスのSkillから、設計パターンと実運用上の注意点を参考にしている。Microsoft公式仕様と競合する場合は、公式ドキュメント、公式 `model-apps` プラグイン、現在のPAC CLIヘルプを優先する。
