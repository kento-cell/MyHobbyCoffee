import { AdminGuard } from "./_components/admin-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <AdminGuard>{children}</AdminGuard>
    </div>
  );
}
