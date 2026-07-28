import { Route } from "@/types/routes.type";

export const customerRoutes: Route[] = [
     {
          title: "Dashboard",
          items: [
               { title: "Overview", url: "/dashboard" },
               { title: "Profile", url: "/dashboard/profile" },
          ],
     },
     {
          title: "Account",
          items: [
               { title: "Notifications", url: "/dashboard/notifications" },
               { title: "Change Password", url: "/dashboard/change-password" },
          ],
     },
];
