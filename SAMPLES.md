# Template Core ガイド

このリポジトリは **template-core 中心** の構成です。  
軽量なコンポーネントベースのダッシュボードから開始できるようにしました。

## 再利用の中心

| パス                                    | 役割                                     |
| --------------------------------------- | ---------------------------------------- |
| `src/app-config.ts`                     | アプリ名・ナビ・ルーティングの集中設定   |
| `src/template-core/module.ts`           | template-core のルート/メニュー定義      |
| `src/template-core/pages/dashboard.tsx` | コンポーネントベースの軽量ダッシュボード |
| `src/components/`                       | shadcn/ui + 共通コンポーネント           |
| `src/providers/`                        | 共通 Provider 群                         |
| `src/lib/`                              | 共通ユーティリティ                       |
| `styles/`                               | Tailwind スタイル                        |

## 使い始める手順

1. `npm install`
2. `npm run build` で初期状態を確認
3. `src/template-core/pages/dashboard.tsx` を要件に合わせて編集
4. メニューやルートを増やす場合は `src/template-core/module.ts` を更新
5. 必要なら `src/app-config.ts` でモジュール切り替えを実施

## 業務アプリへ拡張するとき

- `src/template-core/pages/` に新規ページを追加
- データ取得が必要になった段階で hooks/services を段階的に追加
- Dataverse 向けスクリプトは `scripts/` をベースにプロジェクトごとに調整
