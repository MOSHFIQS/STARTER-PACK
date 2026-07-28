"use client";

import { useUpdateProfileWithAvatarMutation } from "@/redux/api/userApi";

import {
     Camera,
     Globe,
     Loader2,
     Mail,
     MapPin,
     Phone,
     Save,
     User as UserIcon,
     UserCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { ROLE_LABELS } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage, formatDate, getInitials } from "@/lib/utils";
import type { UserStatus } from "@/types/user.types";

const STATUS_TONES: Record<UserStatus, "success" | "warning" | "danger"> = {
     ACTIVE: "success",
     INACTIVE: "warning",
     SUSPENDED: "danger",
};

interface ProfileFormState {
     firstName: string;
     lastName: string;
     phone: string;
     bio: string;
     address: string;
     city: string;
     country: string;
     postalCode: string;
     gender: string;
     dateOfBirth: string;
}

const EMPTY_FORM: ProfileFormState = {
     firstName: "",
     lastName: "",
     phone: "",
     bio: "",
     address: "",
     city: "",
     country: "",
     postalCode: "",
     gender: "",
     dateOfBirth: "",
};

const GENDER_OPTIONS = [
     { value: "Male", label: "Male" },
     { value: "Female", label: "Female" },
     { value: "Other", label: "Other" },
     { value: "Prefer not to say", label: "Prefer not to say" },
];

interface ProfileEditorProps {
     /** Optional header action (e.g. a "Change Password" button). */
     headerAction?: React.ReactNode;
     /** Show the page-level PageHeader. Defaults to true. */
     showHeader?: boolean;
}

export function ProfileEditor({ headerAction, showHeader = true }: ProfileEditorProps) {
     const { user } = useAuth();
     const [updateProfileWithAvatar] = useUpdateProfileWithAvatarMutation();

     // Single form-state object — every field is always a string, which keeps
     // all inputs controlled and avoids the "uncontrolled -> controlled" warning.
     const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
     const [avatarFile, setAvatarFile] = useState<File | null>(null);
     const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
     const [saving, setSaving] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null);

     // Sync the form from the authenticated user whenever it changes
     // (initial load and after a successful save refetches /auth/me).
     useEffect(() => {
          if (!user) return;
          setForm({
               firstName: user.firstName ?? "",
               lastName: user.lastName ?? "",
               phone: user.phone ?? "",
               bio: user.bio ?? "",
               address: user.address ?? "",
               city: user.city ?? "",
               country: user.country ?? "",
               postalCode: user.postalCode ?? "",
               gender: user.gender ?? "",
               dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
          });
     }, [user]);

     // Clean up the object URL when the preview changes / on unmount.
     useEffect(() => {
          return () => {
               if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          };
     }, [avatarPreview]);

     if (!user) {
          return (
               <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
               </div>
          );
     }

     const handleChange = (field: keyof ProfileFormState, value: string) => {
          setForm((prev) => ({ ...prev, [field]: value }));
     };

     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0] ?? null;
          setAvatarFile(file);
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(file ? URL.createObjectURL(file) : null);
     };

     const clearAvatar = () => {
          setAvatarFile(null);
          if (avatarPreview) URL.revokeObjectURL(avatarPreview);
          setAvatarPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
     };

     // Build the JSON payload for the `data` field. Fields with validators that
     // reject empty strings (phone @Matches, dateOfBirth @IsDateString) are
     // omitted when empty. The avatar file (if any) is sent as a separate
     // `avatar` binary field in the multipart FormData, so it is only uploaded
     // to Cloudinary when the form is actually saved.
     const buildPayload = (): Record<string, string> => {
          const payload: Record<string, string> = {
               firstName: form.firstName.trim(),
               lastName: form.lastName.trim(),
               bio: form.bio,
               address: form.address,
               city: form.city,
               country: form.country,
               postalCode: form.postalCode,
          };
          if (form.phone.trim()) payload.phone = form.phone.trim();
          if (form.gender) payload.gender = form.gender;
          if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth;
          return payload;
     };

     const handleSave = async () => {
          if (!form.firstName.trim() || !form.lastName.trim()) {
               toast.error("First name and last name are required");
               return;
          }
          setSaving(true);
          try {
               // Build multipart FormData: JSON `data` field + optional `avatar` file.
               // The avatar is uploaded to Cloudinary by the backend only on save.
               const formData = new FormData();
               formData.append("data", JSON.stringify(buildPayload()));
               if (avatarFile) formData.append("avatar", avatarFile);
               await updateProfileWithAvatar(formData).unwrap();
               toast.success("Profile updated successfully");
               clearAvatar();
          } catch (err: unknown) {
               const message = extractErrorMessage(err, "Failed to update profile");
               toast.error(message);
          } finally {
               setSaving(false);
          }
     };

     const displayName =
          user.fullName || `${user.firstName} ${user.lastName}`.trim() || "User";
     const avatarSrc = avatarPreview || user.avatarUrl || null;

     return (
          <div className="space-y-6 p-4 md:p-6">
               {showHeader && (
                    <PageHeader
                         title="My Profile"
                         description="Manage your account information and preferences"
                         action={headerAction}
                    />
               )}

               {/* Identity / header card (read-only display of non-editable fields) */}
               <Card className="overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5" />
                    <CardContent className="px-6 pb-6">
                         <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                              <div className="-mt-12 flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">
                                   {/* Avatar with upload overlay */}
                                   <div className="relative">
                                        <div className="size-28 overflow-hidden rounded-full border-4 border-background bg-primary text-primary-foreground shadow-lg">
                                             {avatarSrc ? (
                                                  <img
                                                       src={avatarSrc}
                                                       alt={displayName}
                                                       className="h-full w-full object-cover"
                                                  />
                                             ) : (
                                                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
                                                       {getInitials(displayName)}
                                                  </div>
                                             )}
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => fileInputRef.current?.click()}
                                             className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition hover:bg-accent"
                                             aria-label="Change avatar"
                                        >
                                             <Camera className="size-4" />
                                        </button>
                                        <input
                                             ref={fileInputRef}
                                             type="file"
                                             accept="image/*"
                                             onChange={handleAvatarChange}
                                             className="hidden"
                                        />
                                   </div>
                                   <div className="mt-3 text-center sm:mb-1 sm:text-left">
                                        <h2 className="text-xl font-bold">{displayName}</h2>
                                        <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                                             <Mail className="size-3.5" />
                                             {user.email}
                                        </p>
                                        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                             <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
                                             <StatusBadge
                                                  value={user.status}
                                                  tone={STATUS_TONES[user.status]}
                                             />
                                             {user.emailVerified && (
                                                  <Badge variant="outline" className="text-emerald-600">
                                                       Email verified
                                                  </Badge>
                                             )}
                                             {user.phoneVerified && (
                                                  <Badge variant="outline" className="text-emerald-600">
                                                       Phone verified
                                                  </Badge>
                                             )}
                                        </div>
                                        {user.createdAt && (
                                             <p className="mt-2 text-xs text-muted-foreground">
                                                  Member since {formatDate(user.createdAt)}
                                             </p>
                                        )}
                                   </div>
                              </div>
                              {avatarFile && (
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearAvatar}
                                        className="self-center"
                                   >
                                        Clear avatar
                                   </Button>
                              )}
                         </div>
                    </CardContent>
               </Card>

               {/* Personal information */}
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <UserCircle className="size-5" />
                              Personal Information
                         </CardTitle>
                         <CardDescription>Your basic identity details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="First name" htmlFor="firstName" required>
                                   <Input
                                        id="firstName"
                                        value={form.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        placeholder="First name"
                                   />
                              </Field>
                              <Field label="Last name" htmlFor="lastName" required>
                                   <Input
                                        id="lastName"
                                        value={form.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        placeholder="Last name"
                                   />
                              </Field>
                              <Field label="Gender" htmlFor="gender">
                                   <Select
                                        value={form.gender}
                                        onValueChange={(v) => handleChange("gender", v)}
                                   >
                                        <SelectTrigger id="gender" className="w-full">
                                             <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             {GENDER_OPTIONS.map((opt) => (
                                                  <SelectItem key={opt.value} value={opt.value}>
                                                       {opt.label}
                                                  </SelectItem>
                                             ))}
                                        </SelectContent>
                                   </Select>
                              </Field>
                              <Field label="Date of birth" htmlFor="dateOfBirth">
                                   <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={form.dateOfBirth}
                                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                   />
                              </Field>
                         </div>
                    </CardContent>
               </Card>

               {/* Contact & address */}
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <MapPin className="size-5" />
                              Contact & Address
                         </CardTitle>
                         <CardDescription>How customers and the team can reach you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid gap-4 sm:grid-cols-2">
                              <Field label="Phone" htmlFor="phone" icon={<Phone className="size-3.5" />}>
                                   <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="+8801XXXXXXXXX"
                                   />
                              </Field>
                              <Field label="Country" htmlFor="country" icon={<Globe className="size-3.5" />}>
                                   <Input
                                        id="country"
                                        value={form.country}
                                        onChange={(e) => handleChange("country", e.target.value)}
                                        placeholder="Country"
                                   />
                              </Field>
                              <Field label="City" htmlFor="city">
                                   <Input
                                        id="city"
                                        value={form.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        placeholder="City"
                                   />
                              </Field>
                              <Field label="Postal code" htmlFor="postalCode">
                                   <Input
                                        id="postalCode"
                                        value={form.postalCode}
                                        onChange={(e) => handleChange("postalCode", e.target.value)}
                                        placeholder="Postal code"
                                   />
                              </Field>
                              <div className="sm:col-span-2">
                                   <Field label="Address" htmlFor="address">
                                        <Input
                                             id="address"
                                             value={form.address}
                                             onChange={(e) => handleChange("address", e.target.value)}
                                             placeholder="Street address"
                                        />
                                   </Field>
                              </div>
                         </div>
                    </CardContent>
               </Card>

               {/* About me */}
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <UserIcon className="size-5" />
                              About Me
                         </CardTitle>
                         <CardDescription>A short bio (up to 500 characters)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                         <Textarea
                              id="bio"
                              value={form.bio}
                              onChange={(e) => handleChange("bio", e.target.value)}
                              placeholder="Tell us a little about yourself..."
                              rows={4}
                              maxLength={500}
                         />
                         <p className="text-right text-xs text-muted-foreground">
                              {form.bio.length}/500
                         </p>
                    </CardContent>
               </Card>

               {/* Save bar */}
               <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={saving} size="lg">
                         {saving ? (
                              <Loader2 className="mr-2 size-4 animate-spin" />
                         ) : (
                              <Save className="mr-2 size-4" />
                         )}
                         Save Changes
                    </Button>
               </div>
          </div>
     );
}

function Field({
     label,
     htmlFor,
     required,
     icon,
     children,
}: {
     label: string;
     htmlFor: string;
     required?: boolean;
     icon?: React.ReactNode;
     children: React.ReactNode;
}) {
     return (
          <div className="space-y-2">
               <Label htmlFor={htmlFor} className="flex items-center gap-1.5">
                    {icon}
                    {label}
                    {required && <span className="text-destructive">*</span>}
               </Label>
               {children}
          </div>
     );
}
