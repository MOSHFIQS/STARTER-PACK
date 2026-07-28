import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
     return (
          <div className="space-y-6 p-4">
               <div className="flex items-center justify-between">
                    <div className="space-y-2">
                         <Skeleton className="h-8 w-48" />
                         <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-10 w-32" />
               </div>
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                         <Skeleton key={i} className="h-28 w-full rounded-lg" />
                    ))}
               </div>
               <Skeleton className="h-96 w-full rounded-lg" />
          </div>
     );
};

export default Loading;
