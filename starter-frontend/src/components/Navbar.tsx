"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardRoute } from "@/lib/roleRoutes";
import { cn } from "@/lib/utils";
import { Menu, ArrowRight, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

interface MenuItem {
	title: string;
	url: string;
	description?: string;
	items?: MenuItem[];
}

const publicMenu: MenuItem[] = [
	{ title: "Home", url: "/" },
	{ title: "About", url: "/about" },
	{ title: "Contact", url: "/contact" },
];

export default function Navbar({ className }: { className?: string }) {
	const { user, logout, isLoading } = useAuth();
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const dashboardUrl = getDashboardRoute(user?.role ?? null);
	const computedMenu = user?.id
		? [...publicMenu, { title: "Dashboard", url: dashboardUrl }]
		: publicMenu;

	const handleLogout = async () => {
		await logout();
	};

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b border-neutral-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-all duration-300",
				className
			)}
		>
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5 group">
					<div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 font-black text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
						S
					</div>
					<span className="text-lg font-black tracking-tight text-neutral-800 dark:text-neutral-200 transition-colors duration-300 group-hover:text-primary">
						StarterApp
					</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden items-center gap-6 md:flex">
					<NavigationMenu>
						<NavigationMenuList className="gap-1">
							{computedMenu.map((item) => {
								const isActive = pathname === item.url;
								return (
									<NavigationMenuItem key={item.title}>
										<NavigationMenuLink asChild>
											<Link
												href={item.url}
												className={cn(
													"inline-flex h-9 w-max items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-300",
													isActive
														? "bg-neutral-50 dark:bg-neutral-900 text-primary"
														: "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-100"
												)}
											>
												{item.title}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>

					{/* Action Buttons */}
					<div className="flex items-center gap-3 border-l border-neutral-100 dark:border-neutral-800 pl-6">
						{/* Theme Switcher */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="size-10 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
							aria-label="Toggle theme"
						>
							{!mounted ? (
								<div className="size-5 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
							) : theme === "dark" ? (
								<Sun className="size-5 text-indigo-400" />
							) : (
								<Moon className="size-5 text-neutral-600 dark:text-neutral-400" />
							)}
						</Button>

						{isLoading ? (
							<div className="h-9 w-20 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900" />
						) : user?.id ? (
							<div className="flex items-center gap-3">
								<Button asChild variant="outline" size="sm" className="rounded-xl font-bold border-neutral-200 dark:border-neutral-800">
									<Link href={dashboardUrl}>Dashboard</Link>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleLogout}
									className="rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-destructive hover:bg-destructive/5 font-bold"
								>
									Log Out
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<Button asChild variant="ghost" size="sm" className="rounded-xl font-bold text-neutral-600 dark:text-neutral-400">
									<Link href="/login">Sign In</Link>
								</Button>
								<Button asChild size="sm" className="rounded-xl font-bold shadow-sm">
									<Link href="/signup" className="flex items-center gap-1">
										Get Started
										<ArrowRight className="size-4" />
									</Link>
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Mobile Menu Button */}
				<div className="flex items-center gap-2.5 md:hidden">
					{/* Theme Switcher */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="size-10 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
						aria-label="Toggle theme"
					>
						{!mounted ? (
							<div className="size-5 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
						) : theme === "dark" ? (
							<Sun className="size-5 text-indigo-400" />
						) : (
							<Moon className="size-5 text-neutral-600 dark:text-neutral-400" />
						)}
					</Button>

					<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon" className="size-10 rounded-xl md:hidden">
								<Menu className="size-5 text-neutral-600" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full max-w-[280px] p-6">
							<SheetHeader className="pb-6 border-b text-left">
								<SheetTitle className="flex items-center gap-2">
									<div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-600 font-black text-white text-sm">
										S
									</div>
									<span className="font-black text-neutral-800">StarterApp</span>
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-2 py-6">
								{computedMenu.map((item) => {
									const isActive = pathname === item.url;
									return (
										<Link
											key={item.title}
											href={item.url}
											onClick={() => setMobileOpen(false)}
											className={cn(
												"flex h-11 items-center px-4 rounded-xl text-sm font-semibold transition-all duration-300",
												isActive
													? "bg-neutral-50 text-primary font-bold"
													: "text-neutral-600 hover:bg-neutral-50/50 hover:text-neutral-900"
											)}
										>
											{item.title}
										</Link>
									);
								})}
							</div>
							<div className="border-t pt-6 space-y-3">
								{user?.id ? (
									<>
										<Button asChild className="w-full rounded-xl font-bold" onClick={() => setMobileOpen(false)}>
											<Link href={dashboardUrl}>Dashboard</Link>
										</Button>
										<Button
											variant="outline"
											className="w-full rounded-xl font-bold text-destructive hover:bg-destructive/5 hover:text-destructive border-neutral-200"
											onClick={() => {
												setMobileOpen(false);
												handleLogout();
											}}
										>
											Log Out
										</Button>
									</>
								) : (
									<>
										<Button asChild variant="outline" className="w-full rounded-xl font-bold border-neutral-200" onClick={() => setMobileOpen(false)}>
											<Link href="/login">Sign In</Link>
										</Button>
										<Button asChild className="w-full rounded-xl font-bold" onClick={() => setMobileOpen(false)}>
											<Link href="/signup">Get Started</Link>
										</Button>
									</>
								)}
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
