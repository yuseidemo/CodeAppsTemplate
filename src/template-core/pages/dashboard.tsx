import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListTable } from "@/components/list-table";
import type { TableColumn } from "@/components/list-table";

type TaskStatus = "未着手" | "進行中" | "レビュー待ち" | "完了";

type TaskRow = {
  id: string;
  タスク名: string;
  担当: string;
  期限: string;
  ステータス: TaskStatus;
  進捗率: number;
};

const 指標カード = [
  { 見出し: "本日の問い合わせ", 値: "24件", 補足: "前日比 +3件" },
  { 見出し: "未対応チケット", 値: "8件", 補足: "優先対応 3件" },
  { 見出し: "今週の完了タスク", 値: "37件", 補足: "達成率 92%" },
  { 見出し: "満足度スコア", 値: "4.6", 補足: "5段階評価" },
];

const タスク一覧: TaskRow[] = [
  {
    id: "TK-001",
    タスク名: "顧客マスタ連携の仕様確認",
    担当: "田中",
    期限: "2026-04-22",
    ステータス: "進行中",
    進捗率: 55,
  },
  {
    id: "TK-002",
    タスク名: "承認フローのメール文面調整",
    担当: "佐藤",
    期限: "2026-04-23",
    ステータス: "レビュー待ち",
    進捗率: 80,
  },
  {
    id: "TK-003",
    タスク名: "ダッシュボード KPI 定義書の更新",
    担当: "鈴木",
    期限: "2026-04-24",
    ステータス: "未着手",
    進捗率: 10,
  },
  {
    id: "TK-004",
    タスク名: "Dataverse テーブル命名規則の統一",
    担当: "高橋",
    期限: "2026-04-20",
    ステータス: "完了",
    進捗率: 100,
  },
  {
    id: "TK-005",
    タスク名: "運用手順書の初版作成",
    担当: "中村",
    期限: "2026-04-25",
    ステータス: "進行中",
    進捗率: 40,
  },
];

const お知らせ = [
  {
    日付: "2026-04-20",
    区分: "案内",
    内容: "テンプレート初期構成を template-core に統一しました。",
  },
  {
    日付: "2026-04-19",
    区分: "更新",
    内容: "ルーティング設定を app-config へ集約しました。",
  },
  {
    日付: "2026-04-18",
    区分: "注意",
    内容: "本番接続前に .env の値と接続参照を確認してください。",
  },
];

const 部門進捗 = [
  { 名称: "業務要件定義", 進捗率: 75 },
  { 名称: "画面設計", 進捗率: 62 },
  { 名称: "データ設計", 進捗率: 48 },
  { 名称: "運用準備", 進捗率: 30 },
];

const ステータス色: Record<TaskStatus, string> = {
  未着手: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200",
  進行中: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  レビュー待ち:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200",
  完了: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
};

const テーブル列: TableColumn<TaskRow>[] = [
  { key: "id", label: "ID", sortable: true, width: "100px" },
  { key: "タスク名", label: "タスク名", sortable: true },
  { key: "担当", label: "担当", sortable: true, width: "120px" },
  { key: "期限", label: "期限", sortable: true, width: "130px" },
  {
    key: "ステータス",
    label: "ステータス",
    sortable: true,
    width: "140px",
    render: (item) => (
      <Badge variant="outline" className={ステータス色[item.ステータス]}>
        {item.ステータス}
      </Badge>
    ),
  },
  {
    key: "進捗率",
    label: "進捗",
    sortable: true,
    width: "220px",
    render: (item) => (
      <div className="flex items-center gap-3">
        <Progress value={item.進捗率} className="h-2 w-[120px]" />
        <span className="text-xs text-muted-foreground">{item.進捗率}%</span>
      </div>
    ),
  },
];

export default function TemplateCoreDashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle>業務テンプレート ダッシュボード</CardTitle>
              <p className="text-sm text-muted-foreground">
                共通コンポーネントだけで構成した初期画面です。業務要件に合わせて
                モジュールとデータ接続を段階的に拡張してください。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">template-core</Badge>
              <Badge variant="outline">ダミーデータ表示中</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm">新規ページを追加</Button>
          <Button size="sm" variant="outline">
            Dataverse 接続設定
          </Button>
          <Button size="sm" variant="ghost">
            設定ガイドを確認
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {指標カード.map((項目) => (
          <Card key={項目.見出し}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{項目.見出し}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{項目.値}</div>
              <p className="text-xs text-muted-foreground">{項目.補足}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">タスク進捗</TabsTrigger>
          <TabsTrigger value="news">お知らせ</TabsTrigger>
          <TabsTrigger value="health">プロジェクト健全性</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <ListTable
            title="進行中タスク一覧"
            description="担当と期限を確認しながら優先順で対応してください。"
            data={タスク一覧}
            columns={テーブル列}
            searchKeys={["id", "タスク名", "担当", "ステータス"]}
            itemsPerPage={6}
            emptyMessage="表示できるタスクはありません"
          />
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">最新のお知らせ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {お知らせ.map((項目, index) => (
                <div key={`${項目.日付}-${項目.内容}`} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{項目.区分}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {項目.日付}
                    </span>
                  </div>
                  <p className="text-sm">{項目.内容}</p>
                  {index < お知らせ.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">領域別進捗</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {部門進捗.map((項目) => (
                <div key={項目.名称} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{項目.名称}</span>
                    <span className="text-muted-foreground">{項目.進捗率}%</span>
                  </div>
                  <Progress value={項目.進捗率} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
