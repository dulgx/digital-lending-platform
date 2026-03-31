import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f2f2f2] text-gray-900 pb-[env(safe-area-inset-bottom)]">
      <main className="max-w-md mx-auto px-5 pt-6 pb-40">
        {children}
      </main>
      <Navbar />
    </div>
  );
}
