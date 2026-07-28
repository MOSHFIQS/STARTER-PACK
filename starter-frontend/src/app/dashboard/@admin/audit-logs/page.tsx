"use client";
import { auditLogApi } from "@/redux/api/auditLogApi";
import { store } from "@/redux/store";

import { Eye, History } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ActionsMenu, type Action } from "@/components/shared/ActionsMenu";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { LoadingTable } from "@/components/shared/LoadingStates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchFilterBar, type FilterOption } from "@/components/shared/SearchFilterBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";


import { extractErrorMessage, formatDate } from "@/lib/utils";
import type { AuditAction, AuditLog } from "@/types";

const ACTION_TONES: Record<string, "success" | "warning" | "danger" | "info" | "default" | "muted"> = {
     LOGIN: "success",
     LOGOUT: "muted",
     CREATE: "success",
     UPDATE: "info",
     DELETE: "danger",
     SOFT_DELETE: "warning",
     RESTORE: "info",
     ADMIN_ACTION: "info",
     PROFILE_CHANGE: "info",
     ROLE_CHANGE: "warning",
     STATUS_CHANGE: "warning",
};

const AUDIT_ACTIONS: AuditAction[] = [
     "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "SOFT_DELETE", "RESTORE",
     "ADMIN_ACTION", "PROFILE_CHANGE", "ROLE_CHANGE", "STATUS_CHANGE",
];

export default function AuditLogsPage() {
     return (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
               <AuditLogsContent />
          </ProtectedRoute>
     );
}

function AuditLogsContent() {
     const [logs, setLogs] = useState<AuditLog[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const [search, setSearch] = useState("");
     const [actionFilter, setActionFilter] = useState("");
     const [entityFilter, setEntityFilter] = useState("");
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(20);
     const [totalPages, setTotalPages] = useState(1);
     const [totalItems, setTotalItems] = useState(0);
     const [sortKey, setSortKey] = useState("createdAt");
     const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

     const [detailsLog, setDetailsLog] = useState<AuditLog | null>(null);

     const fetchLogs = useCallback(async () => {
          setLoading(true);
          setError(null);
          try {
               const params: Record<string, string | number> = {
                    page,
                    limit: pageSize,
                    sortBy: sortKey,
                    sortOrder: sortDirection,
               };
               if (search) params.search = search;
               if (actionFilter) params.action = actionFilter;
               if (entityFilter) params.entity = entityFilter;

               const res = await store.dispatch(auditLogApi.endpoints.getAuditLogs.initiate(params)).unwrap();
               setLogs(res.data || []);
               setTotalPages(res.meta?.totalPages ?? 1);
               setTotalItems(res.meta?.total ?? 0);
          } catch (err) {
               setError(extractErrorMessage(err, "Failed to load audit logs"));
          } finally {
               setLoading(false);
          }
     }, [page, pageSize, search, actionFilter, entityFilter, sortKey, sortDirection]);

     useEffect(() => {
          fetchLogs();
     }, [fetchLogs]);

     const handleSearch = (value: string) => {
          setSearch(value);
          setPage(1);
     };

     const handleFilterChange = (key: string, value: string) => {
          if (key === "action") setActionFilter(value);
          if (key === "entity") setEntityFilter(value);
          setPage(1);
     };

     const handleReset = () => {
          setSearch("");
          setActionFilter("");
          setEntityFilter("");
          setPage(1);
     };

     const handleSort = (key: string, direction: "asc" | "desc") => {
          setSortKey(key);
          setSortDirection(direction);
     };

     const getUserName = (log: AuditLog) => {
          if (log.user) {
               const u = log.user as { firstName?: string; lastName?: string; email?: string };
               if (u.firstName || u.lastName) return `${u.firstName || ""} ${u.lastName || ""}`.trim();
               return u.email || "Unknown";
          }
          return "System";
     };

     const filters: FilterOption[] = [
          {
               key: "action",
               label: "Action",
               value: actionFilter,
               options: [
                    { label: "All Actions", value: "" },
                    ...AUDIT_ACTIONS.map((a) => ({
                         label: a.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
                         value: a,
                    })),
               ],
          },
          {
               key: "entity",
               label: "Entity",
               value: entityFilter,
               options: [
                    { label: "All Entities", value: "" },
                    { label: "User", value: "User" },
                    { label: "Property", value: "Property" },
                    { label: "Rental", value: "Rental" },
                    { label: "Room", value: "Room" },
                    { label: "Inquiry", value: "Inquiry" },
                    { label: "Review", value: "Review" },
                    { label: "Blog", value: "Blog" },
               ],
          },
     ];

     const columns: Column<AuditLog>[] = useMemo(
          () => [
               {
                    key: "action",
                    label: "Action",
                    sortable: true,
                    render: (log) => (
                         <StatusBadge
                              value={log.action.replace(/_/g, " ")}
                              tone={ACTION_TONES[log.action] || "default"}
                         />
                    ),
               },
               {
                    key: "user",
                    label: "User",
                    render: (log) => (
                         <div className="min-w-0">
                              <p className="font-medium truncate">{getUserName(log)}</p>
                              {log.role && (
                                   <p className="text-xs text-muted-foreground">{log.role}</p>
                              )}
                         </div>
                    ),
               },
               {
                    key: "entity",
                    label: "Entity",
                    sortable: true,
                    render: (log) => (
                         <div>
                              <span className="text-sm font-medium">{log.entity || "—"}</span>
                              {log.entityId && (
                                   <p className="text-xs text-muted-foreground font-mono truncate max-w-[120px]">
                                        {log.entityId}
                                   </p>
                              )}
                         </div>
                    ),
               },
               {
                    key: "description",
                    label: "Description",
                    render: (log) => (
                         <span className="text-sm text-muted-foreground line-clamp-1">
                              {log.description || "—"}
                         </span>
                    ),
               },
               {
                    key: "ipAddress",
                    label: "IP Address",
                    render: (log) => (
                         <span className="text-xs font-mono text-muted-foreground">{log.ipAddress || "—"}</span>
                    ),
               },
               {
                    key: "createdAt",
                    label: "Timestamp",
                    sortable: true,
                    render: (log) => (
                         <span className="text-sm text-muted-foreground">{formatDate(log.createdAt)}</span>
                    ),
               },
               {
                    key: "actions",
                    label: "Actions",
                    render: (log) => {
                         const actions: Action[] = [
                              {
                                   label: "View Details",
                                   icon: <Eye className="h-4 w-4" />,
                                   onClick: () => setDetailsLog(log),
                              },
                         ];
                         return <ActionsMenu actions={actions} />;
                    },
               },
          ],
          [],
     );

     return (
          <div className="space-y-6 p-6">
               <PageHeader
                    title="Audit Logs"
                    description="System activity and change history"
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search audit logs..."
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
               />

               {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                         {error}
                    </div>
               )}

               {loading ? (
                    <LoadingTable />
               ) : (
                    <DataTable
                         columns={columns}
                         data={logs}
                         keyExtractor={(log) => log.id}
                         emptyMessage="No audit logs found"
                         sortKey={sortKey}
                         sortDirection={sortDirection}
                         onSortChange={handleSort}
                    />
               )}

               <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(s) => {
                         setPageSize(s);
                         setPage(1);
                    }}
               />

               {/* Details Dialog */}
               <Dialog open={!!detailsLog} onOpenChange={(open) => !open && setDetailsLog(null)}>
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                   <History className="h-5 w-5" />
                                   Audit Log Details
                              </DialogTitle>
                              <DialogDescription>
                                   {detailsLog && formatDate(detailsLog.createdAt)}
                              </DialogDescription>
                         </DialogHeader>
                         {detailsLog && (
                              <div className="space-y-4">
                                   <div className="flex flex-wrap gap-2">
                                        <StatusBadge
                                             value={detailsLog.action.replace(/_/g, " ")}
                                             tone={ACTION_TONES[detailsLog.action] || "default"}
                                        />
                                        {detailsLog.entity && <Badge variant="secondary">{detailsLog.entity}</Badge>}
                                        {detailsLog.role && <Badge variant="outline">{detailsLog.role}</Badge>}
                                   </div>

                                   <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                             <p className="text-muted-foreground">User</p>
                                             <p className="font-medium">{getUserName(detailsLog)}</p>
                                        </div>
                                        <div>
                                             <p className="text-muted-foreground">IP Address</p>
                                             <p className="font-mono">{detailsLog.ipAddress || "—"}</p>
                                        </div>
                                        <div>
                                             <p className="text-muted-foreground">Entity</p>
                                             <p className="font-medium">{detailsLog.entity || "—"}</p>
                                        </div>
                                        <div>
                                             <p className="text-muted-foreground">Entity ID</p>
                                             <p className="font-mono text-xs">{detailsLog.entityId || "—"}</p>
                                        </div>
                                        <div>
                                             <p className="text-muted-foreground">Device</p>
                                             <p className="text-xs">{detailsLog.device || "—"}</p>
                                        </div>
                                        <div>
                                             <p className="text-muted-foreground">Timestamp</p>
                                             <p>{formatDate(detailsLog.createdAt)}</p>
                                        </div>
                                   </div>

                                   {detailsLog.description && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">Description</p>
                                             <p className="mt-1 text-sm">{detailsLog.description}</p>
                                        </div>
                                   )}

                                   {detailsLog.userAgent && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">User Agent</p>
                                             <p className="mt-1 text-xs text-muted-foreground break-all">{detailsLog.userAgent}</p>
                                        </div>
                                   )}

                                   {detailsLog.beforeValue && Object.keys(detailsLog.beforeValue).length > 0 && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">Before</p>
                                             <pre className="mt-1 overflow-auto rounded-md bg-muted p-3 text-xs max-h-40">
                                                  {JSON.stringify(detailsLog.beforeValue, null, 2)}
                                             </pre>
                                        </div>
                                   )}

                                   {detailsLog.afterValue && Object.keys(detailsLog.afterValue).length > 0 && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">After</p>
                                             <pre className="mt-1 overflow-auto rounded-md bg-muted p-3 text-xs max-h-40">
                                                  {JSON.stringify(detailsLog.afterValue, null, 2)}
                                             </pre>
                                        </div>
                                   )}
                              </div>
                         )}
                    </DialogContent>
               </Dialog>
          </div>
     );
}
