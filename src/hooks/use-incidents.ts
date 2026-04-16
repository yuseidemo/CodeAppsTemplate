import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataverseService } from "../services/DataverseService";
import type { New_incidents } from "@/generated/models/New_incidentsModel";
import type { New_incidentcategorys } from "@/generated/models/New_incidentcategorysModel";
import type { New_prioritys } from "@/generated/models/New_prioritysModel";
import type { New_itassets } from "@/generated/models/New_itassetsModel";
import type { New_incidentcomments } from "@/generated/models/New_incidentcommentsModel";

// ── インシデント ──

export function useIncidents() {
  return useQuery<New_incidents[]>({
    queryKey: ["incidents"],
    queryFn: () =>
      DataverseService.GetItems("New_incidentses", "$orderby=createdon desc"),
  });
}

export function useIncident(id: string | undefined) {
  return useQuery<New_incidents>({
    queryKey: ["incidents", id],
    queryFn: () => DataverseService.GetItem("New_incidentses", id!),
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      DataverseService.PostItem("New_incidentses", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      DataverseService.PatchItem("New_incidentses", id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

export function useDeleteIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      DataverseService.DeleteItem("New_incidentses", id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }),
  });
}

// ── カテゴリ ──

export function useCategories() {
  return useQuery<New_incidentcategorys[]>({
    queryKey: ["categories"],
    queryFn: () =>
      DataverseService.GetItems(
        "New_incidentcategoryset",
        "$orderby=New_name asc",
      ),
  });
}

// ── 優先度 ──

export function usePriorities() {
  return useQuery<New_prioritys[]>({
    queryKey: ["priorities"],
    queryFn: () =>
      DataverseService.GetItems(
        "New_priorityset",
        "$orderby=New_sortorder asc",
      ),
  });
}

// ── システムユーザー ──

type SystemUser = {
  systemuserid: string;
  fullname: string;
  internalemailaddress: string;
};

export function useSystemUsers() {
  return useQuery<SystemUser[]>({
    queryKey: ["systemusers"],
    queryFn: () =>
      DataverseService.GetItems(
        "systemusers",
        "$select=systemuserid,fullname,internalemailaddress&$filter=isdisabled eq false&$top=200",
      ),
  });
}

// ── IT 資産 ──

export function useItAssets() {
  return useQuery<New_itassets[]>({
    queryKey: ["itassets"],
    queryFn: () =>
      DataverseService.GetItems("New_itassetset", "$orderby=createdon desc"),
  });
}

export function useCreateItAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      DataverseService.PostItem("New_itassetset", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["itassets"] }),
  });
}

export function useUpdateItAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      DataverseService.PatchItem("New_itassetset", id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["itassets"] }),
  });
}

export function useDeleteItAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      DataverseService.DeleteItem("New_itassetset", id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["itassets"] }),
  });
}

// ── インシデントコメント ──

export function useIncidentComments(incidentId: string | undefined) {
  return useQuery<New_incidentcomments[]>({
    queryKey: ["incidentcomments", incidentId],
    queryFn: () =>
      DataverseService.GetItems(
        "New_incidentcommentset",
        `$filter=_New_incidentid_value eq '${incidentId}'&$orderby=createdon desc`,
      ),
    enabled: !!incidentId,
  });
}

export function useCreateIncidentComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      DataverseService.PostItem("New_incidentcommentset", data),
    onSuccess: (_data, variables) => {
      const incidentId = variables["_New_incidentid_value"];
      qc.invalidateQueries({ queryKey: ["incidentcomments", incidentId] });
    },
  });
}
