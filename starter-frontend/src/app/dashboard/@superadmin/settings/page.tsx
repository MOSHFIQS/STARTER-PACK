"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
     Sun, 
     Moon, 
     Settings as SettingsIcon, 
     Palette, 
     Globe, 
     Building, 
     Phone, 
     Mail, 
     FileText, 
     Check,
     Loader2
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { 
     useGetSiteSettingsQuery, 
     useUpdateSiteSettingsMutation 
} from "@/redux/api/siteSettingApi";

const PRESET_COLORS = [
     { name: "Emerald Green (Default)", value: "#10B981" },
     { name: "Indigo Blue", value: "#6366F1" },
     { name: "Violet Purple", value: "#8B5CF6" },
     { name: "Rose Pink", value: "#F43F5E" },
     { name: "Amber Orange", value: "#F59E0B" },
     { name: "Teal Blue", value: "#14B8A6" },
     { name: "Sky Blue", value: "#0EA5E9" },
     { name: "Slate Grey", value: "#64748B" }
];

export default function SuperadminSettingsPage() {
     return (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
               <SuperadminSettingsContent />
          </ProtectedRoute>
     );
}

function SuperadminSettingsContent() {
     const { theme, setTheme } = useTheme();
     const { data: settings, isLoading: isFetching } = useGetSiteSettingsQuery();
     const [updateSettings, { isLoading: isUpdating }] = useUpdateSiteSettingsMutation();

     // Form States
     const [siteName, setSiteName] = useState("");
     const [tagline, setTagline] = useState("");
     const [phone, setPhone] = useState("");
     const [email, setEmail] = useState("");
     const [address, setAddress] = useState("");
     const [primaryColor, setPrimaryColor] = useState("#10B981");

     // Sync with fetched data
     useEffect(() => {
          if (settings) {
               setSiteName(settings.siteName || "");
               setTagline(settings.tagline || "");
               setPhone(settings.phone || "");
               setEmail(settings.email || "");
               setAddress(settings.address || "");
               setPrimaryColor(settings.primaryColor || "#10B981");
          }
     }, [settings]);

     const handleSave = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
               await updateSettings({
                    siteName,
                    tagline,
                    phone,
                    email,
                    address,
                    primaryColor
               }).unwrap();
               toast.success("Site settings updated successfully");
          } catch (err: any) {
               toast.error(err?.data?.message || "Failed to update site settings");
          }
     };

     if (isFetching) {
          return (
               <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
          );
     }

     return (
          <div className="space-y-6 p-6">
               <PageHeader
                    title="Superadmin Settings"
                    description="Configure application theme preferences and branding colors."
               />

               <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
                    {/* Appearance & Color Customization */}
                    <div className="space-y-6">
                         {/* Theme Selectors */}
                         <Card className="border border-border bg-card">
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2 text-foreground">
                                        <Palette className="h-5 w-5 text-primary" />
                                        Interface Theme
                                   </CardTitle>
                                   <CardDescription>
                                        Customize how the application interface theme renders.
                                   </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="space-y-2">
                                        <Label className="text-foreground">Theme Mode</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                             <Button
                                                  type="button"
                                                  variant={theme === "light" ? "default" : "outline"}
                                                  size="sm"
                                                  onClick={() => setTheme("light")}
                                                  className="rounded-xl font-bold transition-all"
                                             >
                                                  <Sun className="mr-2 h-4 w-4" />
                                                  Light
                                             </Button>
                                             <Button
                                                  type="button"
                                                  variant={theme === "dark" ? "default" : "outline"}
                                                  size="sm"
                                                  onClick={() => setTheme("dark")}
                                                  className="rounded-xl font-bold transition-all"
                                             >
                                                  <Moon className="mr-2 h-4 w-4" />
                                                  Dark
                                             </Button>
                                             <Button
                                                  type="button"
                                                  variant={theme === "system" ? "default" : "outline"}
                                                  size="sm"
                                                  onClick={() => setTheme("system")}
                                                  className="rounded-xl font-bold transition-all"
                                             >
                                                  <SettingsIcon className="mr-2 h-4 w-4" />
                                                  System
                                             </Button>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Website Accent Color Customizer */}
                         <Card className="border border-border bg-card">
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2 text-foreground">
                                        <Palette className="h-5 w-5 text-primary" />
                                        Primary Website Color
                                   </CardTitle>
                                   <CardDescription>
                                        Configure the primary theme colors of your website. Saves dynamically to the backend.
                                   </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6">
                                   {/* Preset Swatches */}
                                   <div className="space-y-3">
                                        <Label className="text-foreground">Choose a Preset Color</Label>
                                        <div className="grid grid-cols-4 gap-2.5">
                                             {PRESET_COLORS.map((c) => {
                                                  const isSelected = primaryColor.toLowerCase() === c.value.toLowerCase();
                                                  return (
                                                       <button
                                                            key={c.value}
                                                            type="button"
                                                            onClick={() => setPrimaryColor(c.value)}
                                                            className={`group relative flex h-10 w-full items-center justify-center rounded-xl border transition-all duration-300 ${
                                                                 isSelected
                                                                      ? "border-primary ring-2 ring-primary/20 bg-muted"
                                                                      : "border-border hover:bg-muted bg-card"
                                                            }`}
                                                            title={c.name}
                                                       >
                                                            <span 
                                                                 className="h-5 w-5 rounded-full shadow-sm"
                                                                 style={{ backgroundColor: c.value }}
                                                            />
                                                            {isSelected && (
                                                                 <Check className="absolute size-3 text-white mix-blend-difference" />
                                                            )}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>

                                   <Separator />

                                   {/* Custom Color Input */}
                                   <div className="space-y-4">
                                        <Label className="text-foreground">Custom Color Hex</Label>
                                        <div className="flex items-center gap-4">
                                             {/* Color picker box */}
                                             <div className="relative size-12 shrink-0 rounded-xl border border-border shadow-sm overflow-hidden bg-card">
                                                  <input 
                                                       type="color" 
                                                       value={primaryColor} 
                                                       onChange={(e) => setPrimaryColor(e.target.value)}
                                                       className="absolute inset-0 size-full cursor-pointer opacity-0"
                                                  />
                                                  <div 
                                                       className="size-full" 
                                                       style={{ backgroundColor: primaryColor }}
                                                  />
                                             </div>
                                             
                                             <div className="flex-1 space-y-1">
                                                  <Input 
                                                       type="text" 
                                                       value={primaryColor} 
                                                       onChange={(e) => setPrimaryColor(e.target.value)}
                                                       placeholder="#10B981"
                                                       className="rounded-xl border-border bg-card text-foreground"
                                                  />
                                                  <p className="text-[10px] text-muted-foreground">Select custom colors using the picker or input hex code.</p>
                                             </div>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>

                    {/* Site Information Settings */}
                    <div className="space-y-6">
                         <Card className="border border-border bg-card h-full flex flex-col">
                              <CardHeader>
                                   <CardTitle className="flex items-center gap-2 text-foreground">
                                        <Building className="h-5 w-5 text-primary" />
                                        General Site Information
                                   </CardTitle>
                                   <CardDescription>
                                        Configure general site variables stored in your database.
                                   </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4 flex-1">
                                   <div className="space-y-2">
                                        <Label className="text-foreground">Site Name</Label>
                                        <div className="relative">
                                             <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                             <Input 
                                                  value={siteName} 
                                                  onChange={(e) => setSiteName(e.target.value)}
                                                  className="pl-10 rounded-xl border-border bg-card text-foreground"
                                                  placeholder="StarterApp"
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-2">
                                        <Label className="text-foreground">Tagline</Label>
                                        <div className="relative">
                                             <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                             <Input 
                                                  value={tagline} 
                                                  onChange={(e) => setTagline(e.target.value)}
                                                  className="pl-10 rounded-xl border-border bg-card text-foreground"
                                                  placeholder="SaaS Boilerplate Starter"
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-2">
                                        <Label className="text-foreground">Contact Email</Label>
                                        <div className="relative">
                                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                             <Input 
                                                  type="email"
                                                  value={email} 
                                                  onChange={(e) => setEmail(e.target.value)}
                                                  className="pl-10 rounded-xl border-border bg-card text-foreground"
                                                  placeholder="info@starterapp.com"
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-2">
                                        <Label className="text-foreground">Contact Phone</Label>
                                        <div className="relative">
                                             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                             <Input 
                                                  value={phone} 
                                                  onChange={(e) => setPhone(e.target.value)}
                                                  className="pl-10 rounded-xl border-border bg-card text-foreground"
                                                  placeholder="+8801700000000"
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-2">
                                        <Label className="text-foreground">Office Address</Label>
                                        <div className="relative">
                                             <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                             <Input 
                                                  value={address} 
                                                  onChange={(e) => setAddress(e.target.value)}
                                                  className="pl-10 rounded-xl border-border bg-card text-foreground"
                                                  placeholder="Dhaka, Bangladesh"
                                             />
                                        </div>
                                   </div>

                                   <Separator className="my-4" />

                                   {/* Form Submit Button */}
                                   <div className="pt-2 flex justify-end">
                                        <Button 
                                             type="submit" 
                                             disabled={isUpdating}
                                             className="w-full sm:w-auto rounded-xl px-6 font-bold shadow-md shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2"
                                        >
                                             {isUpdating ? (
                                                  <>
                                                       <Loader2 className="h-4 w-4 animate-spin animate-spin" />
                                                       Saving...
                                                  </>
                                             ) : (
                                                  "Save Changes"
                                             )}
                                        </Button>
                                   </div>
                              </CardContent>
                         </Card>
                    </div>
               </form>
          </div>
     );
}
