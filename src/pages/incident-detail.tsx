import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, Pencil, Save, X, MessageSquare, Send } from "lucide-react";
import {
  useIncident,
  useCategories,
  usePriorities,
  useSystemUsers,
  useUpdateIncident,
  useIncidentComments,
  useCreateIncidentComment,
} from "@/hooks/use-incidents";
import { IncidentStatus, statusLabels, statusColors } from "@/types/incident";
import { LoadingSkeletonGrid } from "@/components/loading-skeleton";
import { toast } from "sonner";

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading } = useIncident(id);
  const { data: categories = [] } = useCategories();
  const { data: priorities = [] } = usePriorities();
  const { data: users = [] } = useSystemUsers();
  const { data: comments = [] } = useIncidentComments(id);
  const updateMutation = useUpdateIncident();
  const createCommentMutation = useCreateIncidentComment();

  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formPriority, setFormPriority] = useState("");
  const [formAssignee, setFormAssignee] = useState("");
  const [formResolution, setFormResolution] = useState("");
  const [commentText, setCommentText] = useState("");

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

  const startEdit = () => {
    if (!incident) return;
    setFormName(incident.New_name || "");
    setFormDescription(incident.New_description || "");
    setFormStatus(
      incident.New_status != null ? String(incident.New_status) : "",
    );
    setFormCategory((incident._New_categoryid_value as string) || "");
    setFormPriority((incident._New_priorityid_value as string) || "");
    setFormAssignee((incident._New_assigneeid_value as string) || "");
    setFormResolution(incident.New_resolution || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!incident || !id) return;
    if (!formName.trim()) {
      toast.error("タイトルは必須です");
      return;
    }

    const payload: Record<string, unknown> = {
      New_name: formName.trim(),
      New_description: formDescription.trim() || null,
      New_resolution: formResolution.trim() || null,
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

    updateMutation.mutate(
      { id, ...payload },
      {
        onSuccess: () => {
          toast.success("インシデントを更新しました");
          setIsEditing(false);
        },
        onError: () => toast.error("更新に失敗しました"),
      },
    );
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !id) return;
    createCommentMutation.mutate(
      {
        New_name: commentText.trim().slice(0, 200),
        New_content: commentText.trim(),
        "New_incidentid@odata.bind": `/New_incidentses(${id})`,
      },
      {
        onSuccess: () => {
          toast.success("コメントを追加しました");
          setCommentText("");
        },
        onError: () => toast.error("コメントの追加に失敗しました"),
      },
    );
  };

  if (isLoading) {
    return <LoadingSkeletonGrid columns={1} count={3} variant="detailed" />;
  }

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">インシデントが見つかりません</p>
        <Button variant="outline" onClick={() => navigate("/incidents")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> 一覧に戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/incidents")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> 一覧に戻る
        </Button>
        {!isEditing ? (
          <Button variant="outline" onClick={startEdit}>
            <Pencil className="mr-1 h-4 w-4" /> 編集
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="mr-1 h-4 w-4" /> キャンセル
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-1 h-4 w-4" /> 保存
            </Button>
          </div>
        )}
      </div>

      {/* 詳細カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="text-xl font-semibold"
              />
            ) : (
              <span>{incident.New_name}</span>
            )}
            {!isEditing && incident.New_status != null && (
              <Badge
                variant="outline"
                className={statusColors[incident.New_status]}
              >
                {statusLabels[incident.New_status]}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            /* 編集モード */
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>ステータス</Label>
                  <Select value={formStatus} onValueChange={setFormStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択" />
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
                <div className="space-y-2">
                  <Label>カテゴリ</Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択" />
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
                      <SelectValue placeholder="選択" />
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
              </div>
              <div className="space-y-2">
                <Label>担当者</Label>
                <Select value={formAssignee} onValueChange={setFormAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
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
              <div className="space-y-2">
                <Label>説明</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>解決策</Label>
                <Textarea
                  value={formResolution}
                  onChange={(e) => setFormResolution(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            /* 表示モード */
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">カテゴリ</p>
                  <p className="font-medium">
                    {incident._New_categoryid_value
                      ? categoryMap.get(
                          incident._New_categoryid_value as string,
                        ) || "—"
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">優先度</p>
                  <p className="font-medium">
                    {incident._New_priorityid_value
                      ? priorityMap.get(
                          incident._New_priorityid_value as string,
                        ) || "—"
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">担当者</p>
                  <p className="font-medium">
                    {incident._New_assigneeid_value
                      ? userMap.get(
                          incident._New_assigneeid_value as string,
                        ) || "—"
                      : "未割当"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">作成日</p>
                  <p className="font-medium">
                    {incident.createdon
                      ? new Date(incident.createdon).toLocaleDateString("ja-JP")
                      : "—"}
                  </p>
                </div>
              </div>

              {incident.New_description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">説明</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {incident.New_description}
                  </p>
                </div>
              )}

              {incident.New_resolution && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">解決策</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {incident.New_resolution}
                  </p>
                </div>
              )}

              {incident.New_resolvedon && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">解決日</p>
                  <p className="text-sm">
                    {new Date(incident.New_resolvedon).toLocaleDateString(
                      "ja-JP",
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* コメントセクション */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            コメント ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* コメント入力 */}
          <div className="flex gap-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを入力..."
              rows={2}
              className="flex-1"
            />
            <Button
              size="icon"
              className="self-end"
              disabled={!commentText.trim()}
              onClick={handleAddComment}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* コメント一覧 */}
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              コメントはありません
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.New_incidentcommentid}
                  className="rounded-lg border p-3 space-y-1"
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {c.New_content || c.New_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.createdon
                      ? new Date(c.createdon).toLocaleString("ja-JP")
                      : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
