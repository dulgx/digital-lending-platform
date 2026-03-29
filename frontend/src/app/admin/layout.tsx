import Link from "next/link";
import { removeAuthToken } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30">
      <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent tracking-tighter">
                АДМИН САМБАР
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Хянах самбар руу буцах
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="fixed top-[10%] right-[30%] w-[400px] h-[400px] bg-rose-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="fixed bottom-[20%] left-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
