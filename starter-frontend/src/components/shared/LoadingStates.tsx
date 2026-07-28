import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingCard() {
     return (
          <Card>
               <CardContent className="p-6">
                    <div className="space-y-3">
                         <Skeleton className="h-4 w-24" />
                         <Skeleton className="h-8 w-16" />
                    </div>
               </CardContent>
          </Card>
     )
}

export function LoadingTable() {
     return (
          <div className="space-y-3">
               <Skeleton className="h-11 w-full" />
               {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
               ))}
          </div>
     )
}
