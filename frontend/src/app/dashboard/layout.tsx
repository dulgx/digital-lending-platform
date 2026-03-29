import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Background glow for the whole dashboard */}
        <div className="fixed top-[20%] right-[10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>
        <div className="fixed bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
