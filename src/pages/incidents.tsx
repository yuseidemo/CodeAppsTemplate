import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListTable } from "@/components/list-table";
import type { TableColumn, FilterConfig } from "@/components/list-table";
import { FormModal, FormSection, FormColumns } from "@/components/form-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useIncidents,
  useCategories,
  usePriorities,
  useSystemUsers,
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
} from "@/hooks/use-incidents";
import type { New_incidents } from "@/generated/models/New_incidentsModel";
import { IncidentStatus, statusLabels, statusColors } from "@/types/incident";
import { LoadingSkeletonGrid } from "@/components/loading-skeleton";
import { toast } from "sonner";

type IncidentRow = New_incidents & Record<string, unknown>;

export default function IncidentListPage() {
  const navigate = useNavigate();
  const { data: incidents = [], isLoading } = useIncidents();
  const { data: categories = [] } = useCategories();
  const { data: priorities = [] } = usePriorities();
  const { data: users = [] } = useSystemUsers();
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const deleteMutation = useDeleteIncident();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<New_incidents | null>(
    null,
  );

  // フォーム状態
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPriority, setFormPriority] = useState("");
  const [formAssignee, setFormAssignee] = useState("");

  const userMap = useMemo(() => {
    const m = new Map<string, string>();
    users.forEach((u) =>
      m.set(u.systemuserid, u.fullname || u.internalemailaddress || ""),
    );
    return m;
  }, [users]);

  const categoryMap = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.New_incidentcategoryid, c.New_name));
    return m;
  }, [categories]);

  const priorityMap = useMemo(() => {
    const m = new Map<string, string>();
    priorities.forEach((p) => m.set(p.New_priorityid, p.New_name));
    return m;
  }, [priorities]);

  const columns: TableColumn<IncidentRow>[] = [
    { key: "New_name", label: "タイトル", sortable: true },
    {
      key: "New_status",
      label: "ステータス",
      sortable: true,
      render: (item) => {
        const s = item.New_status as number | undefined;
        return s != null ? (
          <Badge variant="outline" className={statusColors[s]}>
            {statusLabels[s]}
          </Badge>
        ) : null;
      },
    },
    {
      key: "_New_categoryid_value",
      label: "カテゴリ",
      sortable: true,
      render: (item) => {
        const v = item._New_categoryid_value as string | undefined;
        return v ? categoryMap.get(v) || "" : "";
      },
    },
    {
      key: "_New_priorityid_value",
      label: "優先度",
      sortable: true,
      render: (item) => {
        const v = item._New_priorityid_value as string | undefined;
        return v ? priorityMap.get(v) || "" : "";
      },
    },
    {
      key: "_New_assigneeid_value",
      label: "担当者",
      sortable: true,
      render: (item) => {
        const v = item._New_assigneeid_value as string | undefined;
        return v ? (
          userMap.get(v) || ""
        ) : (
          <span className="text-muted-foreground">未割当</span>
        );
      },
    },
    {
      key: "createdon",
      label: "作成日",
      sortable: true,
      render: (item) =>
        item.createdon
          ? new Date(item.createdon).toLocaleDateString("ja-JP")
          : "",
    },
    {
      key: "New_incidentid",
      label: "操作",
      sortable: false,
      render: (item) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(item as New_incidents);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="z-[400]">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  インシデントを削除しますか？
                </AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(item.New_incidentid)}
                >
                  削除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const filters: FilterConfig<IncidentRow>[] = [
    {
      key: "New_status" as keyof IncidentRow,
      label: "ステータス",
      options: Object.entries(statusLabels).map(([v, l]) => ({
        value: v,
        label: l,
      })),
    },
  ];

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormStatus("");
    setFormCategory("");
    setFormPriority("");
    setFormAssignee("");
    setEditingIncident(null);
  };

  const startEdit = (incident: New_incidents) => {
    setFormName(incident.New_name || "");
    setFormDescription(incident.New_description || "");
    setFormStatus(
      incident.New_status != null ? String(incident.New_status) : "",
    );
    setFormCategory((incident._New_categoryid_value as string) || "");
    setFormPriority((incident._New_priorityid_value as string) || "");
    setFormAssignee((incident._New_assigneeid_value as string) || "");
    setEditingIncident(incident);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast.error("タイトルは必須です");
      return;
    }

    const payload: Record<string, unknown> = {
      New_name: formName.trim(),
      New_description: formDescription.trim() || undefined,
    };
    if (formStatus) payload.New_status = Number(formStatus);
    if (formCategory) {
      payload["New_categoryid@odata.bind"] =
        `/New_incidentcategoryset(${formCategory})`;
    }
    if (formPriority) {
      payload["New_priorityid@odata.bind"] =
        `/New_priorityset(${formPriority})`;
    }
    if (formAssignee) {
      payload["New_assigneeid@odata.bind"] = `/systemusers(${formAssignee})`;
    }

    if (editingIncident) {
      updateMutation.mutate(
        { id: editingIncident.New_incidentid, ...payload },
        {
          onSuccess: () => {
            toast.success("インシデントを更新しました");
            setIsFormOpen(false);
            resetForm();
          },
          onError: () => toast.error("更新に失敗しました"),
        },
      );
    } else {
      if (!formStatus) payload.New_status = IncidentStatus.NEW;
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("インシデントを作成しました");
          setIsFormOpen(false);
          resetForm();
        },
        onError: () => toast.error("作成に失敗しました"),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("インシデントを削除しました"),
      onError: () => toast.error("削除に失敗しました"),
    });
  };

  if (isLoading) {
    return <LoadingSkeletonGrid columns={4} count={6} variant="compact" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>インシデント一覧</CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> 新規作成
          </Button>
        </CardHeader>
        <CardContent>
          <ListTable
            data={incidents as IncidentRow[]}
            columns={columns}
            filters={filters}
            searchKeys={["New_name", "New_description"]}
            onRowClick={(row) => navigate(`/incidents/${row.New_incidentid}`)}
          />
        </CardContent>
      </Card>

      {/* 作成 / 編集モーダル */}
      <FormModal
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) resetForm();
        }}
        title={editingIncident ? "インシデント編集" : "インシデント作成"}
        maxWidth="2xl"
        onSave={handleSave}
        saveLabel={editingIncident ? "更新" : "作成"}
      >
        <FormSection title="基本情報">
          <FormColumns columns={2}>
            <div className="space-y-2">
              <Label>タイトル *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="インシデントのタイトル"
              />
            </div>
            <div className="space-y-2">
              <Label>ステータス</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormColumns>
        </FormSection>

        <FormSection title="分類">
          <FormColumns columns={3}>
            <div className="space-y-2">
              <Label>カテゴリ</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem
                      key={c.New_incidentcategoryid}
                      value={c.New_incidentcategoryid}
                    >
                      {c.New_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>優先度</Label>
              <Select value={formPriority} onValueChange={setFormPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem
                      key={p.New_priorityid}
                      value={p.New_priorityid}
                    >
                      {p.New_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>担当者</Label>
              <Select value={formAssignee} onValueChange={setFormAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.systemuserid} value={u.systemuserid}>
                      {u.fullname || u.internalemailaddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormColumns>
        </FormSection>

        <FormSection title="詳細">
          <div className="space-y-2">
            <Label>説明</Label>
            <Textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="インシデントの詳細を入力"
              rows={4}
            />
          </div>
        </FormSection>
      </FormModal>
    </div>
  );
}
