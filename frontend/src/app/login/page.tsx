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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-purple-200 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-white text-2xl font-black">Z</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Тавтай морил</h1>
          <p className="text-gray-500 mt-2 font-medium">Дансандаа нэвтэрнэ үү</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-7">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Имэйл хаяг</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-medium"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Нууц үг</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Нэвтрэх"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 font-medium">
          Бүртгэлгүй юу?{" "}
          <Link href="/register" className="text-gray-900 font-bold hover:underline">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  );
}
