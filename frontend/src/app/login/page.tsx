"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, setAuthToken } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Нэвтрэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Тавтай морил
          </h1>
          <p className="text-slate-400 mt-2">Дижитал зээлийн платформд нэвтрэх</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Имэйл хаяг</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Нууц үг</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Нэвтрэх"
            )}
          </button>

          <p className="text-center text-slate-400 text-sm">
            Бүртгэлгүй юу?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Бүртгүүлэх
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
