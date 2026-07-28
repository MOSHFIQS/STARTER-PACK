"use client";
import { notificationApi } from "@/redux/api/notificationApi";
import { store } from "@/redux/store";

import { CheckCheck, Eye, Mail, MailOpen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";


import type {
     ListQueryParams
} from "@/types/api.types";

import { normalizePaginatedResponse } from "@/types/api.types";

import { extractErrorMessage, formatRelativeTime } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types";
import type { PaginatedResponse } from "@/types/api.types";

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

const NOTIFICATION_TYPES: NotificationType[] = [
     "INFO",
     "SUCCESS",
     "WARNING",
     "ERROR",
     "SYSTEM",
];

const TYPE_TONES: Record<NotificationType, "info" | "success" | "warning" | "danger" | "muted"> = {
     INFO: "info",
     SUCCESS: "success",
     WARNING: "warning",
     ERROR: "danger",
     SYSTEM: "muted",
};

function CustomerNotificationsContent() {
     // ---- list state ----
     const [data, setData] = useState<AppNotification[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(10);
     const [totalPages, setTotalPages] = useState(1);
     const [totalItems, setTotalItems] = useState(0);
     const [unreadCount, setUnreadCount] = useState(0);

     // ---- filters ----
     const [search, setSearch] = useState("");
     const [typeFilter, setTypeFilter] = useState("");
     const [readFilter, setReadFilter] = useState("");
     const [sortKey, setSortKey] = useState<string>("createdAt");
     const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

     // ---- dialog state ----
     const [detailsNotification, setDetailsNotification] = useState<AppNotification | null>(null);
     const [deleteNotification, setDeleteNotification] = useState<AppNotification | null>(null);
     const [submitting, setSubmitting] = useState(false);

     const fetchUnreadCount = useCallback(async () => {
          try {
               const res = await store.dispatch(notificationApi.endpoints.getUnreadCount.initiate(undefined)).unwrap();
               setUnreadCount(res.count);
          } catch {
               // silent fail
          }
     }, []);

     const fetchData = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);
               const params: ListQueryParams = {
                    page,
                    limit: pageSize,
                    search: search || undefined,
                    sortBy: sortKey,
                    sortOrder: sortDirection,
               };
               if (typeFilter) params.type = typeFilter;
               if (readFilter === "unread") params.isRead = "false";
               if (readFilter === "read") params.isRead = "true";
               const res = await store.dispatch(notificationApi.endpoints.getNotifications.initiate(params)).unwrap();
               const normalized = normalizePaginatedResponse(
                    res as PaginatedResponse<AppNotification>,
               );
               setData(normalized.data);
               setTotalPages(normalized.meta.totalPages);
               setTotalItems(normalized.meta.total);
          } catch (err: unknown) {
               const message = extractErrorMessage(err, "Failed to load notifications.");
               setError(message);
          } finally {
               setLoading(false);
          }
     }, [page, pageSize, search, typeFilter, readFilter, sortKey, sortDirection]);

     useEffect(() => {
          fetchData();
          fetchUnreadCount();
     }, [fetchData, fetchUnreadCount]);

     const handleSortChange = useCallback((key: string, direction: "asc" | "desc") => {
          setSortKey(key);
          setSortDirection(direction);
     }, []);

     const handleFilterChange = useCallback((key: string, value: string) => {
          setPage(1);
          if (key === "type") setTypeFilter(value);
          if (key === "isRead") setReadFilter(value);
     }, []);

     const handleReset = useCallback(() => {
          setSearch("");
          setTypeFilter("");
          setReadFilter("");
          setPage(1);
     }, []);

     const handleSearchChange = useCallback((value: string) => {
          setSearch(value);
          setPage(1);
     }, []);

     const handlePageChange = useCallback((p: number) => {
          setPage(p);
     }, []);

     const handlePageSizeChange = useCallback((size: number) => {
          setPageSize(size);
          setPage(1);
     }, []);

     const handleMarkAsRead = useCallback(
          async (notification: AppNotification) => {
               try {
                    await store.dispatch(notificationApi.endpoints.markNotificationAsRead.initiate(notification.id)).unwrap();
                    fetchData();
                    fetchUnreadCount();
               } catch (err: unknown) {
                    const message = extractErrorMessage(err, "Failed to mark as read.");
                    toast.error(message);
               }
          },
          [fetchData, fetchUnreadCount],
     );

     const handleMarkAllAsRead = useCallback(async () => {
          try {
               await store.dispatch(notificationApi.endpoints.markAllNotificationsAsRead.initiate()).unwrap();
               toast.success("All notifications marked as read.");
               fetchData();
               fetchUnreadCount();
          } catch (err: unknown) {
               const message = extractErrorMessage(err, "Failed to mark all as read.");
               toast.error(message);
          }
     }, [fetchData, fetchUnreadCount]);

     const handleDelete = useCallback(async () => {
          if (!deleteNotification) return;
          try {
               setSubmitting(true);
               await store.dispatch(notificationApi.endpoints.deleteNotification.initiate(deleteNotification.id)).unwrap();
               toast.success("Notification deleted.");
               setDeleteNotification(null);
               fetchData();
               fetchUnreadCount();
          } catch (err: unknown) {
               const message = extractErrorMessage(err, "Failed to delete notification.");
               toast.error(message);
          } finally {
               setSubmitting(false);
          }
     }, [deleteNotification, fetchData, fetchUnreadCount]);

     const columns = useMemo<Column<AppNotification>[]>(
          () => [
               {
                    key: "title",
                    label: "Notification",
                    sortable: true,
                    render: (notification) => (
                         <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                   {notification.isRead ? (
                                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                                   ) : (
                                        <Mail className="h-4 w-4 text-primary" />
                                   )}
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                   <p className={`text-sm ${notification.isRead ? "" : "font-semibold"}`}>
                                        {notification.title}
                                   </p>
                                   <p className="truncate text-xs text-muted-foreground">
                                        {notification.message}
                                   </p>
                              </div>
                         </div>
                    ),
               },
               {
                    key: "type",
                    label: "Type",
                    sortable: true,
                    render: (notification) => (
                         <StatusBadge
                              value={notification.type}
                              tone={TYPE_TONES[notification.type]}
                         />
                    ),
               },
               {
                    key: "isRead",
                    label: "Status",
                    render: (notification) =>
                         notification.isRead ? (
                              <StatusBadge value="Read" tone="muted" />
                         ) : (
                              <StatusBadge value="Unread" tone="info" />
                         ),
               },
               {
                    key: "createdAt",
                    label: "Received",
                    sortable: true,
                    render: (notification) => (
                         <span className="text-sm">{formatRelativeTime(notification.createdAt)}</span>
                    ),
               },
               {
                    key: "actions",
                    label: "",
                    className: "text-right",
                    render: (notification) => {
                         const actions: Action[] = [
                              {
                                   label: "View Details",
                                   icon: <Eye className="h-4 w-4" />,
                                   onClick: () => {
                                        setDetailsNotification(notification);
                                        if (!notification.isRead) {
                                             handleMarkAsRead(notification);
                                        }
                                   },
                              },
                         ];
                         if (!notification.isRead) {
                              actions.push({
                                   label: "Mark as Read",
                                   icon: <CheckCheck className="h-4 w-4" />,
                                   onClick: () => handleMarkAsRead(notification),
                              });
                         }
                         actions.push({
                              label: "Delete",
                              icon: <Trash2 className="h-4 w-4" />,
                              onClick: () => setDeleteNotification(notification),
                              variant: "destructive",
                         });
                         return <ActionsMenu actions={actions} />;
                    },
               },
          ],
          [handleMarkAsRead],
     );

     const filters: FilterOption[] = [
          {
               key: "type",
               label: "Type",
               value: typeFilter,
               options: NOTIFICATION_TYPES.map((t) => ({
                    label: t.charAt(0) + t.slice(1).toLowerCase(),
                    value: t,
               })),
               placeholder: "All types",
          },
          {
               key: "isRead",
               label: "Status",
               value: readFilter,
               options: [
                    { label: "Unread", value: "unread" },
                    { label: "Read", value: "read" },
               ],
               placeholder: "All",
          },
     ];

     return (
          <div className="space-y-6">
               <PageHeader
                    title="My Notifications"
                    description={
                         unreadCount > 0
                              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                              : "View your notifications"
                    }
                    action={
                         unreadCount > 0 ? (
                              <Button variant="outline" onClick={handleMarkAllAsRead}>
                                   <CheckCheck className="mr-2 h-4 w-4" />
                                   Mark All Read
                              </Button>
                         ) : undefined
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Search notifications..."
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
               />

               {error ? (
                    <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                         {error}
                    </div>
               ) : null}

               {loading ? (
                    <LoadingTable />
               ) : (
                    <DataTable
                         columns={columns}
                         data={data}
                         keyExtractor={(item) => item.id}
                         emptyMessage="No notifications found."
                         sortKey={sortKey}
                         sortDirection={sortDirection}
                         onSortChange={handleSortChange}
                    />
               )}

               <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
               />

               {/* Details Dialog */}
               <Dialog
                    open={!!detailsNotification}
                    onOpenChange={(open) => !open && setDetailsNotification(null)}
               >
                    <DialogContent className="max-w-lg">
                         <DialogHeader>
                              <DialogTitle>{detailsNotification?.title}</DialogTitle>
                              <DialogDescription>
                                   {detailsNotification
                                        ? formatRelativeTime(detailsNotification.createdAt)
                                        : ""}
                              </DialogDescription>
                         </DialogHeader>
                         {detailsNotification ? (
                              <div className="space-y-4">
                                   <div className="flex items-center gap-2">
                                        <StatusBadge
                                             value={detailsNotification.type}
                                             tone={TYPE_TONES[detailsNotification.type]}
                                        />
                                        {detailsNotification.isRead ? (
                                             <StatusBadge value="Read" tone="muted" />
                                        ) : (
                                             <StatusBadge value="Unread" tone="info" />
                                        )}
                                   </div>
                                   <p className="text-sm text-muted-foreground">
                                        {detailsNotification.message}
                                   </p>
                                   {detailsNotification.data ? (
                                        <div className="rounded-md border p-3">
                                             <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                  Additional Data
                                             </p>
                                             <pre className="overflow-x-auto text-xs">
                                                  {JSON.stringify(detailsNotification.data, null, 2)}
                                             </pre>
                                        </div>
                                   ) : null}
                                   {detailsNotification.readAt ? (
                                        <p className="text-xs text-muted-foreground">
                                             Read on {formatRelativeTime(detailsNotification.readAt)}
                                        </p>
                                   ) : null}
                              </div>
                         ) : null}
                    </DialogContent>
               </Dialog>

               {/* Delete Confirmation */}
               <DeleteConfirmationDialog
                    open={!!deleteNotification}
                    onOpenChange={(open) => !open && setDeleteNotification(null)}
                    itemName={deleteNotification?.title}
                    isDeleting={submitting}
                    onConfirm={handleDelete}
               />
          </div>
     );
}

export default function CustomerNotificationsPage() {
     return (
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
               <CustomerNotificationsContent />
          </ProtectedRoute>
     );
}
