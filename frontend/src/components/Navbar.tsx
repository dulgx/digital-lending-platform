"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent tracking-tighter">
              ZMN FINTECH
            </span>
          </Link>

          {/* User Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard/apply"
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Зээл хүсэх
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
            >
              Гарах
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
