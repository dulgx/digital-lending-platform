"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

// ── Scoring logic ─────────────────────────────────────────────────────────────

function calcMonthlyPayment(principal: number, monthlyRate: number, term: number): number {
  if (monthlyRate === 0) return principal / term;
  const factor = Math.pow(1 + monthlyRate, term);
  return (principal * monthlyRate * factor) / (factor - 1);
}

type ScoreResult = {
  score: number;
  band: "A" | "B" | "C" | "D" | "F";
  rate: number;
  dtiScore: number;
  ageScore: number;
  amountScore: number;
  decision: "APPROVED" | "REVIEW" | "REJECTED";
};

function calcScore(salary: number, loanAmount: number, termMonths: number, age: number): ScoreResult {
  const stressPayment = calcMonthlyPayment(loanAmount, 0.025, termMonths);
  const dti = salary > 0 ? stressPayment / salary : 1.0;

  const dtiScore = dti <= 0.2 ? 40 : dti <= 0.35 ? 30 : dti <= 0.5 ? 20 : 0;
  const ageScore = age >= 25 && age <= 45 ? 30 : (age >= 20 && age < 25) || (age > 45 && age <= 55) ? 20 : 10;
  const amountScore = loanAmount <= 5_000_000 ? 30 : loanAmount <= 15_000_000 ? 20 : 10;
  const score = dtiScore + ageScore + amountScore;

  const band = score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : score >= 50 ? "D" : "F";
  const rate = score >= 80 ? 0.01 : score >= 70 ? 0.015 : score >= 60 ? 0.02 : 0.025;
  const decision = score >= 60 ? "APPROVED" : score >= 50 ? "REVIEW" : "REJECTED";

  return { score, band, rate, dtiScore, ageScore, amountScore, decision };
}

function fmt(n: number) {
  return n.toLocaleString("mn-MN", { maximumFractionDigits: 0 });
}

const BAND_COLORS: Record<string, string> = {
  A: "text-emerald-600",
  B: "text-teal-600",
  C: "text-amber-600",
  D: "text-orange-600",
  F: "text-red-600",
};

const DECISION_CONFIG: Record<string, { cls: string; label: string }> = {
  APPROVED: { cls: "bg-green-100 text-green-700", label: "Батлагдах магадлалтай" },
  REVIEW:   { cls: "bg-amber-100 text-amber-700", label: "Хянагдах шаардлагатай" },
  REJECTED: { cls: "bg-red-100 text-red-600",     label: "Татгалзагдах магадлалтай" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ApplyLoanPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("12");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ salary: number | null; age: number | null } | null>(null);

  useEffect(() => {
    fetchApi("/auth/me")
      .then((data: any) => setUser({ salary: data.salary, age: data.age }))
      .catch(() => {});
  }, []);

  const calc = useMemo(() => {
    const parsedAmount = Number(amount);
    const parsedTerm = Number(term);
    if (!parsedAmount || parsedAmount <= 0 || !parsedTerm) return null;
    if (!user?.salary || !user?.age) return null;

    const result = calcScore(user.salary, parsedAmount, parsedTerm, user.age);
    const monthly = calcMonthlyPayment(parsedAmount, result.rate, parsedTerm);
    const totalPay = monthly * parsedTerm;
    const totalInterest = totalPay - parsedAmount;

    return { ...result, monthly, totalPay, totalInterest };
  }, [amount, term, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    const parsedTerm = Number(term);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 50_000_000) {
      setError("Зээлийн хэмжээ 1–50,000,000 ₮ хооронд байх ёстой.");
      return;
    }
    if (isNaN(parsedTerm) || parsedTerm < 1 || parsedTerm > 60) {
      setError("Зээлийн хугацаа 1–60 сар хооронд байх ёстой.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await fetchApi("/loan/apply", {
        method: "POST",
        body: JSON.stringify({ amount: parsedAmount, term_months: parsedTerm }),
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Зээл хүсэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[slideUp_0.4s_ease-out]">

      {/* ── Header ── */}
      <header className="flex items-center gap-3 pt-2">
        <Link
          href="/dashboard"
          className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Шинэ зээл хүсэх</h1>
          <p className="text-gray-400 text-xs font-medium">Дижитал зээлийн хүсэлт</p>
        </div>
      </header>

      {/* ── Form Card ── */}
      <div className="bg-white rounded-[28px] p-6 shadow-sm space-y-5">

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleApply} className="space-y-5">
          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Зээлийн хэмжээ
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">₮</span>
              <input
                type="number"
                required
                min="50000"
                step="50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 text-xl font-bold placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-transparent transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Төлөх хугацаа
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["3", "6", "12", "24"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTerm(m)}
                  className={`py-3 rounded-2xl border text-sm font-bold transition-all ${
                    term === m
                      ? "bg-black border-black text-white"
                      : "bg-gray-50 border-gray-100 text-gray-500 hover:border-gray-300"
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
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-base hover:bg-gray-800 active:scale-95 transition-all flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Хүсэлт илгээх
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Calculator Card ── */}
      <div className="bg-[#DAFADE] rounded-[28px] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-700">Зээлийн тооцоолуур</p>
        </div>

        {!user?.salary || !user?.age ? (
          <p className="text-gray-500 text-sm text-center py-6">
            Тооцоолол хийхийн тулд бүртгэлдээ цалин болон насаа оруулна уу.
          </p>
        ) : !calc ? (
          <p className="text-gray-500 text-sm text-center py-6">
            Зээлийн дүн оруулна уу
          </p>
        ) : (
          <div className="space-y-4">
            {/* Decision */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${DECISION_CONFIG[calc.decision].cls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {DECISION_CONFIG[calc.decision].label}
            </span>

            {/* Monthly payment */}
            <div className="bg-white/70 rounded-2xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-1">Сарын төлбөр</p>
              <p className="text-3xl font-black text-gray-900">
                ₮{fmt(calc.monthly)}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/70 rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">Нийт төлбөр</p>
                <p className="text-sm font-black text-gray-900">₮{fmt(calc.totalPay)}</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">Нийт хүү</p>
                <p className="text-sm font-black text-orange-600">₮{fmt(calc.totalInterest)}</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">Сарын хүү</p>
                <p className="text-sm font-black text-gray-900">{(calc.rate * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-white/70 rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">Зэрэглэл</p>
                <p className={`text-sm font-black ${BAND_COLORS[calc.band]}`}>Band {calc.band}</p>
              </div>
            </div>

            {/* Score bar */}
            <div className="bg-white/70 rounded-2xl p-3 space-y-2">
              <p className="text-xs text-gray-500 font-medium">Оноо: {calc.score}/100</p>
              <ScoreBar label="Өр/Орлого" value={calc.dtiScore} max={40} />
              <ScoreBar label="Нас" value={calc.ageScore} max={30} />
              <ScoreBar label="Зээлийн дүн" value={calc.amountScore} max={30} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? "bg-green-500" : pct >= 40 ? "bg-amber-400" : "bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-bold">{value}/{max}</span>
      </div>
      <div className="h-2 bg-black/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
