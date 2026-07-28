import Navbar from "@/components/Navbar";

export default function CommonLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     return (
          <div className="flex min-h-screen flex-col">
               <Navbar />
               <div className="flex-1">{children}</div>
          </div>
     );
}
