"use client";

import { Bell, Globe, Moon, Palette, Settings as SettingsIcon, Sun, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { useTheme } from "@/components/theme-provider";
import { ROLE_LABELS } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";

import { formatDate } from "@/lib/utils";

export default function SettingsPage() {
     return (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
               <SettingsContent />
          </ProtectedRoute>
     );
}

function SettingsContent() {
     const { user } = useAuth();
     const { theme, setTheme } = useTheme();

     const [notifications, setNotifications] = useState({
          email: true,
          push: true,
          inquiries: true,
          system: false,
     });

     const [language, setLanguage] = useState("en");
     const [pageSize, setPageSize] = useState("10");

     const handleSavePreferences = () => {
          toast.success("Preferences saved successfully");
     };

     const toggleNotification = (key: keyof typeof notifications) => {
          setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
     };


     return (
          <div className="space-y-6 p-6">
               <PageHeader
                    title="Settings"
                    description="Manage your application preferences"
               />

               <div className="grid gap-6 lg:grid-cols-2">
                    {/* Account Info */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <UserIcon className="h-5 w-5" />
                                   Account Information
                              </CardTitle>
                              <CardDescription>Your account details and role</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label>Full Name</Label>
                                   <Input value={user?.fullName || ""} disabled className="bg-muted" />
                              </div>
                              <div className="space-y-2">
                                   <Label>Email</Label>
                                   <Input value={user?.email || ""} disabled className="bg-muted" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-2">
                                        <Label>Role</Label>
                                        <div className="flex items-center">
                                             <Badge variant="secondary">{user ? ROLE_LABELS[user.role] : "—"}</Badge>
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        <Label>Member Since</Label>
                                        <p className="text-sm pt-2">{user?.createdAt ? formatDate(user.createdAt) : "—"}</p>
                                   </div>
                              </div>
                              <Separator />
                              <p className="text-xs text-muted-foreground">
                                   To update your account information, please visit the{" "}
                                   <a href="/dashboard/profile" className="text-primary underline">
                                        Profile
                                   </a>{" "}
                                   page.
                              </p>
                         </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Palette className="h-5 w-5" />
                                   Appearance
                              </CardTitle>
                              <CardDescription>Customize how the dashboard looks</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label>Theme</Label>
                                   <div className="grid grid-cols-3 gap-2">
                                        <Button
                                             variant={theme === "light" ? "default" : "outline"}
                                             size="sm"
                                             onClick={() => setTheme("light")}
                                        >
                                             <Sun className="mr-2 h-4 w-4" />
                                             Light
                                        </Button>
                                        <Button
                                             variant={theme === "dark" ? "default" : "outline"}
                                             size="sm"
                                             onClick={() => setTheme("dark")}
                                        >
                                             <Moon className="mr-2 h-4 w-4" />
                                             Dark
                                        </Button>
                                        <Button
                                             variant={theme === "system" ? "default" : "outline"}
                                             size="sm"
                                             onClick={() => setTheme("system")}
                                        >
                                             <SettingsIcon className="mr-2 h-4 w-4" />
                                             System
                                        </Button>
                                   </div>
                                   <p className="text-xs text-muted-foreground">Select your interface color mode preference.</p>
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                   <Label htmlFor="pageSize">Default Page Size</Label>
                                   <Input
                                        id="pageSize"
                                        type="number"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(e.target.value)}
                                        min={5}
                                        max={100}
                                   />
                                   <p className="text-xs text-muted-foreground">Number of items per page in tables (5-100)</p>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Bell className="h-5 w-5" />
                                   Notification Preferences
                              </CardTitle>
                              <CardDescription>Choose what notifications you receive</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              {[
                                   { key: "email" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                                   { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
                                   { key: "inquiries" as const, label: "Inquiry Alerts", desc: "New customer inquiries" },
                                   { key: "system" as const, label: "System Updates", desc: "System maintenance and updates" },
                              ].map((item) => (
                                   <div key={item.key} className="flex items-center justify-between">
                                        <div>
                                             <p className="text-sm font-medium">{item.label}</p>
                                             <p className="text-xs text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => toggleNotification(item.key)}
                                             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key] ? "bg-primary" : "bg-muted"
                                                  }`}
                                        >
                                             <span
                                                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-1"
                                                       }`}
                                             />
                                        </button>
                                   </div>
                              ))}
                         </CardContent>
                    </Card>

                    {/* Language & Region */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <Globe className="h-5 w-5" />
                                   Language & Region
                              </CardTitle>
                              <CardDescription>Set your language and regional preferences</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="language">Language</Label>
                                   <select
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                   >
                                        <option value="en">English</option>
                                        <option value="bn">বাংলা (Bengali)</option>
                                   </select>
                                   <p className="text-xs text-muted-foreground">Language switching will be available in a future update</p>
                              </div>
                              <Separator />
                              <div className="space-y-2">
                                   <Label>Currency</Label>
                                   <div className="flex items-center">
                                        <Badge variant="outline">BDT (৳)</Badge>
                                   </div>
                                   <p className="text-xs text-muted-foreground">All prices are displayed in Bangladeshi Taka</p>
                              </div>
                              <div className="space-y-2">
                                   <Label>Timezone</Label>
                                   <p className="text-sm">Asia/Dhaka (UTC+6)</p>
                              </div>
                         </CardContent>
                    </Card>
               </div>

               <div className="flex justify-end">
                    <Button onClick={handleSavePreferences} size="lg">
                         Save Preferences
                    </Button>
               </div>
          </div>
     );
}
