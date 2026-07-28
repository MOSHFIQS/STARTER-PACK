"use client";
import { userApi } from "@/redux/api/userApi";
import { store } from "@/redux/store";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { Action } from "@/components/shared/ActionsMenu";
import { ActionsMenu } from "@/components/shared/ActionsMenu";
import type { Column } from "@/components/shared/DataTable";
import { DataTable } from "@/components/shared/DataTable";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { FormDialog } from "@/components/shared/FormDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import type { FilterOption } from "@/components/shared/SearchFilterBar";
import { SearchFilterBar } from "@/components/shared/SearchFilterBar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";


import type {
     ListQueryParams
} from "@/types/api.types";

import { extractErrorMessage, formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import type { User, UserRole, UserStatus } from "@/types/user.types";
import { Eye, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const ROLE_FILTER_OPTIONS = [
     { label: "All Roles", value: "all" },
     { label: "Super Admin", value: ROLES.SUPER_ADMIN },
     { label: "Admin", value: ROLES.ADMIN },
     { label: "Customer", value: ROLES.CUSTOMER },
];

const STATUS_FILTER_OPTIONS = [
     { label: "All Status", value: "all" },
     { label: "Active", value: "ACTIVE" },
     { label: "Inactive", value: "INACTIVE" },
     { label: "Suspended", value: "SUSPENDED" },
];

interface UserFormData {
     firstName: string;
     lastName: string;
     email: string;
     phone: string;
     role: UserRole;
     status: UserStatus;
     password: string;
}

const emptyForm: UserFormData = {
     firstName: "",
     lastName: "",
     email: "",
     phone: "",
     role: ROLES.CUSTOMER,
     status: "ACTIVE",
     password: "",
};

export default function UsersPage() {
     return (
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
               <UsersContent />
          </ProtectedRoute>
     );
}

function UsersContent() {
     const { user: currentUser } = useAuth();
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const [search, setSearch] = useState("");
     const [roleFilter, setRoleFilter] = useState("all");
     const [statusFilter, setStatusFilter] = useState("all");
     const [page, setPage] = useState(1);
     const [pageSize, setPageSize] = useState(10);
     const [totalPages, setTotalPages] = useState(1);
     const [totalItems, setTotalItems] = useState(0);
     const [sortKey, setSortKey] = useState("createdAt");
     const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

     const [formOpen, setFormOpen] = useState(false);
     const [editingUser, setEditingUser] = useState<User | null>(null);
     const [formData, setFormData] = useState<UserFormData>(emptyForm);
     const [submitting, setSubmitting] = useState(false);

     const [detailsUser, setDetailsUser] = useState<User | null>(null);

     const [deleteUser, setDeleteUser] = useState<User | null>(null);
     const [deleting, setDeleting] = useState(false);

     // Role-change dialog state — enforces the role hierarchy
     // (superadmin > admin > customer) and self-protection rules.
     const [roleTarget, setRoleTarget] = useState<User | null>(null);
     const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
     const [changingRole, setChangingRole] = useState(false);

     const fetchUsers = useCallback(async () => {
          setLoading(true);
          setError(null);
          try {
               const params: ListQueryParams = {
                    page,
                    limit: pageSize,
                    search: search || undefined,
                    sortBy: sortKey,
                    sortOrder: sortDirection,
               };
               if (roleFilter !== "all") params.role = roleFilter;
               if (statusFilter !== "all") params.status = statusFilter;

               const res = await store.dispatch(userApi.endpoints.getUsers.initiate(params)).unwrap();
               setUsers(res.data || []);
               setTotalPages(res.meta?.totalPages || 1);
               setTotalItems(res.meta?.total || 0);
          } catch (err) {
               setError(extractErrorMessage(err, "Failed to load users"));
          } finally {
               setLoading(false);
          }
     }, [page, pageSize, search, roleFilter, statusFilter, sortKey, sortDirection]);

     useEffect(() => {
          fetchUsers();
     }, [fetchUsers]);

     const handleSearchChange = (value: string) => {
          setSearch(value);
          setPage(1);
     };

     const handleFilterChange = (key: string, value: string) => {
          if (key === "role") setRoleFilter(value);
          if (key === "status") setStatusFilter(value);
          setPage(1);
     };

     const handleReset = () => {
          setSearch("");
          setRoleFilter("all");
          setStatusFilter("all");
          setPage(1);
     };

     const handleSort = (key: string, direction: "asc" | "desc") => {
          setSortKey(key);
          setSortDirection(direction);
     };

     const openCreate = () => {
          setEditingUser(null);
          setFormData(emptyForm);
          setFormOpen(true);
     };

     const openEdit = (user: User) => {
          setEditingUser(user);
          setFormData({
               firstName: user.firstName || "",
               lastName: user.lastName || "",
               email: user.email,
               phone: user.phone || "",
               role: user.role,
               status: user.status,
               password: "",
          });
          setFormOpen(true);
     };

     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setSubmitting(true);
          try {
               if (editingUser) {
                    const updateData: Record<string, unknown> = {
                         firstName: formData.firstName,
                         lastName: formData.lastName,
                         email: formData.email,
                         phone: formData.phone,
                         role: formData.role,
                         status: formData.status,
                    };
                    if (formData.password) {
                         updateData.password = formData.password;
                    }
                    await store.dispatch(userApi.endpoints.updateUser.initiate({ id: editingUser.id, data: updateData })).unwrap();
                    toast.success("User updated successfully");
               } else {
                    await store.dispatch(userApi.endpoints.createUser.initiate(formData)).unwrap();
                    toast.success("User created successfully");
               }
               setFormOpen(false);
               fetchUsers();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to save user"));
          } finally {
               setSubmitting(false);
          }
     };

     const handleDelete = async () => {
          if (!deleteUser) return;
          setDeleting(true);
          try {
               await store.dispatch(userApi.endpoints.deleteUser.initiate(deleteUser.id)).unwrap();
               toast.success("User deleted successfully");
               setDeleteUser(null);
               fetchUsers();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to delete user"));
          } finally {
               setDeleting(false);
          }
     };

     const handleUpdateRole = async (user: User, role: UserRole) => {
          setChangingRole(true);
          try {
               await store.dispatch(userApi.endpoints.updateUserRole.initiate({ id: user.id, role: role })).unwrap();
               toast.success(`Role updated to ${ROLE_LABELS[role] ?? role}`);
               setRoleTarget(null);
               setPendingRole(null);
               fetchUsers();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to update role"));
          } finally {
               setChangingRole(false);
          }
     };

     // Open the role-change dialog for a user, pre-selecting a sensible
     // default role that respects the hierarchy (superadmin > admin > customer).
     const openRoleDialog = (user: User) => {
          setRoleTarget(user);
          // Default to the user's current role so the admin must explicitly change it.
          setPendingRole(user.role);
     };

     // Roles the current admin is allowed to assign to the target user,
     // enforcing the hierarchy. A non-superadmin cannot touch superadmin
     // accounts and cannot assign the superadmin role.
     const getAssignableRoles = (user: User): UserRole[] => {
          const actorIsSuperAdmin = currentUser?.role === ROLES.SUPER_ADMIN;
          // Admins cannot modify a Super Admin's role at all.
          if (user.role === ROLES.SUPER_ADMIN && !actorIsSuperAdmin) return [];
          return (Object.values(ROLES) as UserRole[]).filter((role) => {
               // Can't assign the role the user already has.
               if (role === user.role) return false;
               // Only a Super Admin can assign the Super Admin role.
               if (role === ROLES.SUPER_ADMIN && !actorIsSuperAdmin) return false;
               return true;
          });
     };

     const handleUpdateStatus = async (user: User, status: UserStatus) => {
          try {
               await store.dispatch(userApi.endpoints.updateUserStatus.initiate({ id: user.id, status: status })).unwrap();
               toast.success("Status updated successfully");
               fetchUsers();
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to update status"));
          }
     };

     const columns: Column<User>[] = useMemo(
          () => [
               {
                    key: "name",
                    label: "Name",
                    sortable: true,
                    render: (user) => (
                         <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                   {getInitials(user.fullName || user.email)}
                              </div>
                              <div>
                                   <p className="font-medium">{user.fullName || "—"}</p>
                                   <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                         </div>
                    ),
               },
               {
                    key: "phone",
                    label: "Phone",
                    render: (user) => <span className="text-sm">{user.phone || "—"}</span>,
               },
               {
                    key: "role",
                    label: "Role",
                    sortable: true,
                    render: (user) => (
                         <StatusBadge
                              value={user.role}
                              tone={user.role === ROLES.SUPER_ADMIN ? "info" : user.role === ROLES.ADMIN ? "success" : "default"}
                         />
                    ),
               },
               {
                    key: "status",
                    label: "Status",
                    sortable: true,
                    render: (user) => <StatusBadge value={user.status} />,
               },
               {
                    key: "lastLoginAt",
                    label: "Last Login",
                    render: (user) => (
                         <span className="text-sm text-muted-foreground">
                              {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
                         </span>
                    ),
               },
               {
                    key: "createdAt",
                    label: "Joined",
                    sortable: true,
                    render: (user) => (
                         <span className="text-sm text-muted-foreground">
                              {formatDate(user.createdAt)}
                         </span>
                    ),
               },
               {
                    key: "actions",
                    label: "Actions",
                    headerClassName: "text-right",
                    render: (user) => {
                         const actions: Action[] = [
                              {
                                   label: "View Details",
                                   icon: <Eye className="h-4 w-4" />,
                                   onClick: () => setDetailsUser(user),
                              },
                              {
                                   label: "Edit",
                                   icon: <Pencil className="h-4 w-4" />,
                                   onClick: () => openEdit(user),
                              },
                         ];

                         // Only offer the "Change Role" action when the actor is
                         // allowed to assign at least one alternative role. This
                         // honours the superadmin > admin > customer hierarchy and
                         // the self-protection rule (handled by getAssignableRoles).
                         if (getAssignableRoles(user).length > 0 && user.id !== currentUser?.id) {
                              actions.push({
                                   label: "Change Role",
                                   icon: <ShieldCheck className="h-4 w-4" />,
                                   onClick: () => openRoleDialog(user),
                              });
                         }

                         if (user.id !== currentUser?.id) {
                              actions.push({
                                   label: user.status === "ACTIVE" ? "Deactivate" : "Activate",
                                   onClick: () =>
                                        handleUpdateStatus(user, user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"),
                              });
                              actions.push({
                                   label: "Delete",
                                   icon: <Trash2 className="h-4 w-4" />,
                                   onClick: () => setDeleteUser(user),
                                   variant: "destructive",
                              });
                         }

                         return (
                              <div className="flex justify-end">
                                   <ActionsMenu actions={actions} />
                              </div>
                         );
                    },
               },
          ],
          [currentUser],
     );

     const filters: FilterOption[] = [
          {
               key: "role",
               label: "Role",
               value: roleFilter,
               options: ROLE_FILTER_OPTIONS,
          },
          {
               key: "status",
               label: "Status",
               value: statusFilter,
               options: STATUS_FILTER_OPTIONS,
          },
     ];

     const hasActiveFilters = search !== "" || roleFilter !== "all" || statusFilter !== "all";

     return (
          <div className="space-y-6 p-4 md:p-6">
               <PageHeader
                    title="Users"
                    description="Manage all platform users and their roles"
                    action={
                         <Button onClick={openCreate}>
                              <Plus className="mr-2 h-4 w-4" />
                              New User
                         </Button>
                    }
               />

               <SearchFilterBar
                    search={search}
                    onSearchChange={handleSearchChange}
                    searchPlaceholder="Search by name, email, or phone..."
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={hasActiveFilters ? handleReset : undefined}
               />

               {error && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                         {error}
                    </div>
               )}

               <DataTable
                    columns={columns}
                    data={users}
                    keyExtractor={(user) => user.id}
                    loading={loading}
                    error={error}
                    skeletonRows={5}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={handleSort}
               />

               <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                         setPageSize(size);
                         setPage(1);
                    }}
               />

               <FormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    title={editingUser ? "Edit User" : "Create New User"}
                    description={
                         editingUser
                              ? "Update user information. Leave password blank to keep current."
                              : "Add a new user to the platform."
                    }
                    onSubmit={handleSubmit}
                    submitLabel={editingUser ? "Save Changes" : "Create User"}
                    isSubmitting={submitting}
                    maxWidthClassName="sm:max-w-2xl"
               >
                    <div className="grid gap-4 sm:grid-cols-2">
                         <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                   id="firstName"
                                   value={formData.firstName}
                                   onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                   required
                              />
                         </div>
                         <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                   id="lastName"
                                   value={formData.lastName}
                                   onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                   required
                              />
                         </div>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="email">Email</Label>
                         <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                         />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="phone">Phone</Label>
                         <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                         />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                         <div className="space-y-2">
                              <Label htmlFor="role">Role</Label>
                              <Select
                                   value={formData.role}
                                   onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                              >
                                   <SelectTrigger id="role">
                                        <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {Object.values(ROLES).map((role) => (
                                             <SelectItem key={role} value={role}>
                                                  {ROLE_LABELS[role]}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>
                         <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                   value={formData.status}
                                   onValueChange={(value) => setFormData({ ...formData, status: value as UserStatus })}
                              >
                                   <SelectTrigger id="status">
                                        <SelectValue />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="password">
                              Password {editingUser && <span className="text-muted-foreground">(leave blank to keep current)</span>}
                         </Label>
                         <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required={!editingUser}
                         />
                    </div>
               </FormDialog>

               <Dialog open={Boolean(detailsUser)} onOpenChange={(open) => !open && setDetailsUser(null)}>
                    <DialogContent className="sm:max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                         </DialogHeader>
                         {detailsUser && (
                              <div className="space-y-4">
                                   <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-medium text-primary">
                                             {getInitials(detailsUser.fullName || detailsUser.email)}
                                        </div>
                                        <div>
                                             <h3 className="text-lg font-semibold">{detailsUser.fullName || "—"}</h3>
                                             <p className="text-sm text-muted-foreground">{detailsUser.email}</p>
                                             <div className="mt-1 flex gap-2">
                                                  <StatusBadge
                                                       value={detailsUser.role}
                                                       tone={detailsUser.role === ROLES.SUPER_ADMIN ? "info" : detailsUser.role === ROLES.ADMIN ? "success" : "default"}
                                                  />
                                                  <StatusBadge value={detailsUser.status} />
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid gap-4 sm:grid-cols-2">
                                        <DetailField label="Phone" value={detailsUser.phone || "—"} />
                                        <DetailField label="City" value={detailsUser.city || "—"} />
                                        <DetailField label="Country" value={detailsUser.country || "—"} />
                                        <DetailField label="Address" value={detailsUser.address || "—"} />
                                        <DetailField label="Email Verified" value={detailsUser.emailVerified ? "Yes" : "No"} />
                                        <DetailField label="Phone Verified" value={detailsUser.phoneVerified ? "Yes" : "No"} />
                                        <DetailField label="Last Login" value={detailsUser.lastLoginAt ? formatDate(detailsUser.lastLoginAt) : "Never"} />
                                        <DetailField label="Last Device" value={detailsUser.lastDevice || "—"} />
                                        <DetailField label="Joined" value={formatDate(detailsUser.createdAt)} />
                                        <DetailField label="Updated" value={formatDate(detailsUser.updatedAt)} />
                                   </div>
                                   {detailsUser.bio && (
                                        <div>
                                             <Label className="text-muted-foreground">Bio</Label>
                                             <p className="mt-1 text-sm">{detailsUser.bio}</p>
                                        </div>
                                   )}
                              </div>
                         )}
                    </DialogContent>
               </Dialog>

               <DeleteConfirmationDialog
                    open={Boolean(deleteUser)}
                    onOpenChange={(open) => !open && setDeleteUser(null)}
                    title="Delete User"
                    description="This action cannot be undone. This will permanently delete the user account."
                    itemName={deleteUser?.fullName || deleteUser?.email}
                    isDeleting={deleting}
                    onConfirm={handleDelete}
               />

               {/* Role-change dialog — enforces the role hierarchy */}
               <Dialog
                    open={Boolean(roleTarget)}
                    onOpenChange={(open) => {
                         if (!open) {
                              setRoleTarget(null);
                              setPendingRole(null);
                         }
                    }}
               >
                    <DialogContent className="sm:max-w-md">
                         <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                   <ShieldCheck className="h-5 w-5" />
                                   Change Role
                              </DialogTitle>
                              <DialogDescription>
                                   Update the role for{" "}
                                   <span className="font-medium text-foreground">
                                        {roleTarget?.fullName || roleTarget?.email}
                                   </span>
                                   . The available options respect the role hierarchy
                                   {"(Super Admin > Admin > Customer)."}
                              </DialogDescription>
                         </DialogHeader>

                         {roleTarget && (
                              <div className="space-y-4 py-2">
                                   <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                                        <span className="text-muted-foreground">Current role: </span>
                                        <span className="font-medium">
                                             {ROLE_LABELS[roleTarget.role] ?? roleTarget.role}
                                        </span>
                                   </div>

                                   <div className="space-y-2">
                                        <Label htmlFor="role-select">New role</Label>
                                        <Select
                                             value={pendingRole ?? roleTarget.role}
                                             onValueChange={(value) => setPendingRole(value as UserRole)}
                                        >
                                             <SelectTrigger id="role-select">
                                                  <SelectValue placeholder="Select a role" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {getAssignableRoles(roleTarget).map((role) => (
                                                       <SelectItem key={role} value={role}>
                                                            {ROLE_LABELS[role] ?? role}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                   </div>
                              </div>
                         )}

                         <div className="flex justify-end gap-2 border-t pt-4">
                              <Button
                                   variant="outline"
                                   onClick={() => {
                                        setRoleTarget(null);
                                        setPendingRole(null);
                                   }}
                                   disabled={changingRole}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   onClick={() => {
                                        if (roleTarget && pendingRole && pendingRole !== roleTarget.role) {
                                             handleUpdateRole(roleTarget, pendingRole);
                                        }
                                   }}
                                   disabled={
                                        changingRole ||
                                        !roleTarget ||
                                        !pendingRole ||
                                        pendingRole === roleTarget?.role
                                   }
                              >
                                   {changingRole ? "Saving…" : "Save Role"}
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </div>
     );
}

function DetailField({ label, value }: { label: string; value: string }) {
     return (
          <div>
               <Label className="text-muted-foreground">{label}</Label>
               <p className="mt-1 text-sm">{value}</p>
          </div>
     );
}
