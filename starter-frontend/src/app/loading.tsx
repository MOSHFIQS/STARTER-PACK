import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
     return (
          <div className="flex items-center justify-center min-h-screen">
               <p className="animate-pulse text-muted-foreground flex items-center gap-2">
                    <Spinner className="size-8" /> Loading
               </p>
          </div>
     );
};

export default Loading;
