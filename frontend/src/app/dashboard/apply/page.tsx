"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function ApplyLoanPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("12");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      setError("Зээлийн хэмжээ буруу байна.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await fetchApi("/loan/apply", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          term_months: Number(term),
        }),
      });
      // Хүсэлт амжилттай боллоо
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Зээл хүсэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mb-4 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Хянах самбар руу буцах
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Шинээр зээл хүсэх</h1>
        <p className="text-slate-400 mt-1">Орлогын хэмжээндээ тулгуурлан зээлийн хэмжээг тодорхойлно.</p>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden">
        <form onSubmit={handleApply} className="relative z-10 space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Хүсэх зээлийн хэмжээ (₮)</label>
            <div className="relative">
              <input
                type="number"
                required
                min="50000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="0.00"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-medium">MNT</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Төлөх хугацаа (Сар)</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {['3', '6', '12', '24'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTerm(m)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
                    term === m 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {m} сар
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Хүсэлт илгээх"
            )}
          </button>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-teal-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
      </div>
    </div>
  );
}
