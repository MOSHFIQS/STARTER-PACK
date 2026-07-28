"use client"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"
import { ReactNode } from "react"

export interface Action {
     label: string
     icon?: ReactNode
     onClick: () => void
     variant?: "default" | "destructive" | "success"
}

interface ActionsMenuProps {
     actions: Action[]
     label?: string
}

export function ActionsMenu({ actions, label = "Actions" }: ActionsMenuProps) {
     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                         <MoreHorizontal className="h-4 w-4" />
                         <span className="sr-only">{label}</span>
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuLabel className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {actions.map((action, i) => (
                         <DropdownMenuItem
                              key={i}
                              onClick={action.onClick}
                              className={action.variant === "destructive" ? "text-destructive focus:text-destructive focus:bg-destructive/10" : action.variant === "success" ? "text-success focus:text-success focus:bg-success/10" : ""}
                         >
                              {action.icon || <Eye className="mr-2 h-4 w-4" />}
                              {action.label}
                         </DropdownMenuItem>
                    ))}
               </DropdownMenuContent>
          </DropdownMenu>
     )
}
