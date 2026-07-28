import { Route } from "@/types/routes.type";

export const adminRoutes: Route[] = [
	{
		title: "Dashboard",
		items: [
			{ title: "Overview", url: "/dashboard" },
			{ title: "Profile", url: "/dashboard/profile" },
		],
	},
	{
		title: "System",
		items: [
			{ title: "Users", url: "/dashboard/users" },
			{ title: "Audit Logs", url: "/dashboard/audit-logs" },
			{ title: "Settings", url: "/dashboard/settings" },
		],
	},
];
