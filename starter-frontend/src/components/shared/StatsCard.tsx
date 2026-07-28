import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface StatsCardProps {
     title: string
     value: string | number
     icon?: ReactNode
     description?: string
     trend?: { value: string; positive: boolean }
     className?: string
}

export function StatsCard({ title, value, icon, description, trend, className }: StatsCardProps) {
     return (
          <Card className={cn("overflow-hidden", className)}>
               <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                         <div className="space-y-1.5">
                              <p className="text-sm font-medium text-muted-foreground">{title}</p>
                              <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
                              {description && (
                                   <p className="text-xs text-muted-foreground">{description}</p>
                              )}
                              {trend && (
                                   <div className="flex items-center gap-1 pt-0.5">
                                        <span
                                             className={cn(
                                                  "inline-flex items-center gap-0.5 text-xs font-semibold",
                                                  trend.positive ? "text-success" : "text-destructive",
                                             )}
                                        >
                                             {trend.positive ? "↑" : "↓"} {trend.value}
                                        </span>
                                   </div>
                              )}
                         </div>
                         {icon && (
                              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10">
                                   {icon}
                              </div>
                         )}
                    </div>
               </CardContent>
          </Card>
     )
}
