"use client";
import { notificationApi } from "@/redux/api/notificationApi";
import { store } from "@/redux/store";

import { Bell, CheckCheck, Eye, Mail, MailOpen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ActionsMenu, type Action } from "@/components/shared/ActionsMenu";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { LoadingTable } from "@/components/shared/LoadingStates";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SearchFilterBar, type FilterOption } from "@/components/shared/SearchFilterBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";

import { useAuth } from "@/hooks/useAuth";


import { extractErrorMessage, formatDate, formatRelativeTime } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";

const NOTIFICATION_TYPE_TONES: Record<NotificationType, "info" | "success" | "warning" | "danger" | "default" | "muted"> = {
     INFO: "info",
     SUCCESS: "success",
     WARNING: "warning",
     ERROR: "danger",
     SYSTEM: "muted",
};

export default function NotificationsPage() {
     return (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
               <NotificationsContent />
          </ProtectedRoute>
     );
}

function NotificationsContent() {
     const { user } = useAuth();
     const [notifications, setNotifications] = useState<AppNotification[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const [search, setSearch] = useState("");
     const [typeFilter, setTypeFilter] = useState("");
     const [readFilter, setReadFilter] = useState("");
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(10);
     const [totalPages, setTotalPages] = useState(1);
     const [totalItems, setTotalItems] = useState(0);
     const [sortKey, setSortKey] = useState("createdAt");
     const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

     const [unreadCount, setUnreadCount] = useState(0);

     const [detailsNotification, setDetailsNotification] = useState<AppNotification | null>(null);
     const [deleteNotification, setDeleteNotification] = useState<AppNotification | null>(null);
     const [deleting, setDeleting] = useState(false);

     const fetchNotifications = useCallback(async () => {
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
               if (typeFilter) params.type = typeFilter;
               if (readFilter) params.isRead = readFilter;

               const res = await store.dispatch(notificationApi.endpoints.getNotifications.initiate(params, { forceRefetch: true })).unwrap();
               setNotifications(res.data || []);
               setTotalPages(res.meta?.totalPages ?? 1);
               setTotalItems(res.meta?.total ?? 0);

               const countRes = await store.dispatch(notificationApi.endpoints.getUnreadCount.initiate(undefined, { forceRefetch: true })).unwrap();
               setUnreadCount(typeof countRes === "number" ? countRes : (countRes as { count?: number })?.count ?? 0);
          } catch (err) {
               setError(extractErrorMessage(err, "Failed to load notifications"));
          } finally {
               setLoading(false);
          }
     }, [page, pageSize, search, typeFilter, readFilter, sortKey, sortDirection]);

     useEffect(() => {
          fetchNotifications();
     }, [fetchNotifications]);

     const handleSearch = (value: string) => {
          setSearch(value);
          setPage(1);
     };

     const handleFilterChange = (key: string, value: string) => {
          if (key === "type") setTypeFilter(value);
          if (key === "isRead") setReadFilter(value);
          setPage(1);
     };

     const handleReset = () => {
          setSearch("");
          setTypeFilter("");
          setReadFilter("");
          setPage(1);
     };

     const handleSort = (key: string, direction: "asc" | "desc") => {
          setSortKey(key);
          setSortDirection(direction);
     };

     const handleMarkAsRead = async (notification: AppNotification) => {
          try {
               await store.dispatch(notificationApi.endpoints.markNotificationAsRead.initiate(notification.id)).unwrap();
               toast.success("Notification marked as read");
               fetchNotifications();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to mark as read"));
          }
     };

     const handleMarkAllAsRead = async () => {
          try {
               await store.dispatch(notificationApi.endpoints.markAllNotificationsAsRead.initiate()).unwrap();
               toast.success("All notifications marked as read");
               fetchNotifications();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to mark all as read"));
          }
     };

     const handleDelete = async () => {
          if (!deleteNotification) return;
          setDeleting(true);
          try {
               await store.dispatch(notificationApi.endpoints.deleteNotification.initiate(deleteNotification.id)).unwrap();
               toast.success("Notification deleted");
               setDeleteNotification(null);
               fetchNotifications();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to delete notification"));
          } finally {
               setDeleting(false);
          }
     };

     const filters: FilterOption[] = [
          {
               key: "type",
               label: "Type",
               value: typeFilter,
               options: [
                    { label: "All Types", value: "" },
                    { label: "Info", value: "INFO" },
                    { label: "Success", value: "SUCCESS" },
                    { label: "Warning", value: "WARNING" },
                    { label: "Error", value: "ERROR" },
                    { label: "Payment", value: "PAYMENT" },
                    { label: "System", value: "SYSTEM" },
               ],
          },
          {
               key: "isRead",
               label: "Status",
               value: readFilter,
               options: [
                    { label: "All", value: "" },
                    { label: "Unread", value: "false" },
                    { label: "Read", value: "true" },
               ],
          },
     ];

     const columns: Column<AppNotification>[] = useMemo(
          () => [
               {
                    key: "title",
                    label: "Notification",
                    sortable: true,
                    render: (n) => (
                         <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                   {n.isRead ? (
                                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                                   ) : (
                                        <Mail className="h-4 w-4 text-primary" />
                                   )}
                              </div>
                              <div className="min-w-0">
                                   <p className={`font-medium truncate ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                        {n.title}
                                   </p>
                                   <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
                              </div>
                         </div>
                    ),
               },
               {
                    key: "type",
                    label: "Type",
                    sortable: true,
                    render: (n) => <StatusBadge value={n.type} tone={NOTIFICATION_TYPE_TONES[n.type]} />,
               },
               {
                    key: "isRead",
                    label: "Status",
                    render: (n) =>
                         n.isRead ? (
                              <StatusBadge value="Read" tone="muted" />
                         ) : (
                              <StatusBadge value="Unread" tone="info" />
                         ),
               },
               {
                    key: "createdAt",
                    label: "Created",
                    sortable: true,
                    render: (n) => (
                         <span className="text-sm text-muted-foreground" title={formatDate(n.createdAt)}>
                              {formatRelativeTime(n.createdAt)}
                         </span>
                    ),
               },
               {
                    key: "actions",
                    label: "Actions",
                    render: (n) => {
                         const actions: Action[] = [
                              {
                                   label: "View Details",
                                   icon: <Eye className="h-4 w-4" />,
                                   onClick: () => setDetailsNotification(n),
                              },
                         ];
                         if (!n.isRead) {
                              actions.push({
                                   label: "Mark as Read",
                                   icon: <CheckCheck className="h-4 w-4" />,
                                   onClick: () => handleMarkAsRead(n),
                              });
                         }
                         actions.push({
                              label: "Delete",
                              icon: <Trash2 className="h-4 w-4" />,
                              onClick: () => setDeleteNotification(n),
                              variant: "destructive",
                         });
                         return <ActionsMenu actions={actions} />;
                    },
               },
          ],
          [],
     );

     return (
          <div className="space-y-6 p-6">
               <PageHeader
                    title="Notifications"
                    description={`Manage system notifications${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
                    action={
                         unreadCount > 0 ? (
                              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                                   <CheckCheck className="mr-2 h-4 w-4" />
                                   Mark All as Read
                              </Button>
                         ) : undefined
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={handleSearch}
                    searchPlaceholder="Search notifications..."
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
                         data={notifications}
                         keyExtractor={(n) => n.id}
                         emptyMessage="No notifications found"
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
               <Dialog open={!!detailsNotification} onOpenChange={(open) => !open && setDetailsNotification(null)}>
                    <DialogContent className="max-w-lg">
                         <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                   <Bell className="h-5 w-5" />
                                   {detailsNotification?.title}
                              </DialogTitle>
                              <DialogDescription>
                                   {detailsNotification && formatDate(detailsNotification.createdAt)}
                              </DialogDescription>
                         </DialogHeader>
                         {detailsNotification && (
                              <div className="space-y-4">
                                   <div className="flex flex-wrap gap-2">
                                        <StatusBadge
                                             value={detailsNotification.type}
                                             tone={NOTIFICATION_TYPE_TONES[detailsNotification.type]}
                                        />
                                        {detailsNotification.isRead ? (
                                             <StatusBadge value="Read" tone="muted" />
                                        ) : (
                                             <StatusBadge value="Unread" tone="info" />
                                        )}
                                   </div>
                                   <div>
                                        <p className="text-sm text-muted-foreground">Message</p>
                                        <p className="mt-1 text-sm">{detailsNotification.message}</p>
                                   </div>
                                   {detailsNotification.data && Object.keys(detailsNotification.data).length > 0 && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">Additional Data</p>
                                             <pre className="mt-1 overflow-auto rounded-md bg-muted p-3 text-xs">
                                                  {JSON.stringify(detailsNotification.data, null, 2)}
                                             </pre>
                                        </div>
                                   )}
                                   {detailsNotification.readAt && (
                                        <div>
                                             <p className="text-sm text-muted-foreground">Read At</p>
                                             <p className="mt-1 text-sm">{formatDate(detailsNotification.readAt)}</p>
                                        </div>
                                   )}
                                   {!detailsNotification.isRead && (
                                        <Button
                                             variant="outline"
                                             size="sm"
                                             onClick={() => {
                                                  handleMarkAsRead(detailsNotification);
                                                  setDetailsNotification(null);
                                             }}
                                        >
                                             <CheckCheck className="mr-2 h-4 w-4" />
                                             Mark as Read
                                        </Button>
                                   )}
                              </div>
                         )}
                    </DialogContent>
               </Dialog>

               {/* Delete Confirmation */}
               <DeleteConfirmationDialog
                    open={!!deleteNotification}
                    onOpenChange={(open) => !open && setDeleteNotification(null)}
                    itemName={deleteNotification?.title}
                    isDeleting={deleting}
                    onConfirm={handleDelete}
               />
          </div>
     );
}
