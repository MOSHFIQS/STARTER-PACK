"use client"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavProjectsProps } from "@/types/navProjectsProps"
import Link from "next/link"

export function NavProjects({ title, items }: NavProjectsProps) {
  const pathname = usePathname()
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu className="md:hidden">
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <Link
                href={item.url}
                className={`text-gray-600 `}
                onClick={() => {
                  toggleSidebar()
                }}
              >
                <SidebarMenuButton tooltip={item.name} isActive={isActive}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
      <SidebarMenu className="md:flex hidden">
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.name}>
              <Link
                href={item.url}
                className={`text-gray-600 `}
              >
                <SidebarMenuButton tooltip={item.name} isActive={isActive}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>

  )
}
