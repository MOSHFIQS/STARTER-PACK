import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

interface PageHeaderProps {
     title: string
     description?: string
     action?: ReactNode
     backHref?: string
}

export function PageHeader({ title, description, action, backHref }: PageHeaderProps) {
     return (
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
               <div className="flex items-start gap-3">
                    {backHref && (
                         <Button variant="ghost" size="icon" asChild className="mt-0.5 shrink-0">
                              <Link href={backHref}>
                                   <ChevronLeft className="h-5 w-5" />
                              </Link>
                         </Button>
                    )}
                    <div className="space-y-1">
                         <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                         {description && (
                              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                         )}
                    </div>
               </div>
               {action && <div className="flex items-center gap-2">{action}</div>}
          </div>
     )
}
