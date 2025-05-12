import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SideNav } from "@/components/admin/SideNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();
  
  // Define the expected type for publicMetadata
  type PublicMetadata = {
    role?: string;
  };

  // Get role from metadata
  const role = (sessionClaims?.publicMetadata as PublicMetadata)?.role;
  const isAdmin = role === "admin";
  
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}