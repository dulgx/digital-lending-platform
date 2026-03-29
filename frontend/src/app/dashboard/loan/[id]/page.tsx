"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function RepaymentSchedulePage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadSchedule();
  }, [id]);

  const loadSchedule = async () => {
    try {
      const data = await fetchApi(`/repayment/application/${id}`);
      setSchedule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (repaymentId: number) => {
    if (!confirm("Та энэ сарын төлбөрийг төлөхдөө итгэлтэй байна уу?")) return;
    try {
      await fetchApi(`/repayment/${repaymentId}/pay`, { method: "POST" });
      await loadSchedule();
    } catch (err: any) {
      alert("Төлбөр төлөхөд алдаа гарлаа: " + err.message);
    }
  };

  const paid = schedule.filter((r) => r.status !== "pending").length;
  const total = schedule.length;
  const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
  const totalAmount = schedule.reduce(
    (s, r) => s + Number(r.principal_payment) + Number(r.interest_payment),
    0
  );
  const paidAmount = schedule
    .filter((r) => r.status !== "pending")
    .reduce((s, r) => s + Number(r.principal_payment) + Number(r.interest_payment), 0);

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
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Эргэн төлөлт</h1>
          <p className="text-gray-400 text-xs font-medium">Зээл #{id}-ийн хуваарь</p>
        </div>
      </header>

      {/* ── Progress Card (teal) ── */}
      <div className="bg-[#C8F5F0] rounded-[28px] p-6 relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Нийт төлсөн</p>
            <p className="text-3xl font-black text-gray-900">₮{paidAmount.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">/ ₮{totalAmount.toLocaleString()} нийт</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-xl">{pct}%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-gray-600 text-xs font-medium mt-2">{paid} / {total} сар төлөгдсөн</p>

        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-black/5 rounded-full" />
        <div className="absolute -right-2 -bottom-10 w-16 h-16 bg-black/5 rounded-full" />
      </div>

      {/* ── Schedule List ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : schedule.length === 0 ? (
        <div className="bg-white rounded-[28px] p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-bold text-gray-700 text-base mb-1">Хуваарь олдсонгүй</p>
          <p className="text-gray-400 text-sm">Зээлийн график үүсээгүй байна.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((row: any) => {
            const isPending = row.status === "pending";
            const rowTotal = Number(row.principal_payment) + Number(row.interest_payment);

            return (
              <div
                key={row.id}
                className={`bg-white rounded-[20px] p-4 shadow-sm flex items-center gap-3 ${
                  !isPending ? "opacity-60" : ""
                }`}
              >
                {/* Month number */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-sm ${
                    isPending ? "bg-[#EDD633]" : "bg-[#DAFADE] text-gray-500"
                  }`}
                >
                  {isPending ? (
                    <span className="text-black">{row.installment_number}</span>
                  ) : (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(row.due_date).toLocaleDateString("mn-MN", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Үндсэн ₮{Number(row.principal_payment).toLocaleString()} · Хүү ₮{Number(row.interest_payment).toLocaleString()}
                  </p>
                </div>

                {/* Amount + Pay button */}
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                  <p className="font-black text-gray-900 text-sm">₮{rowTotal.toLocaleString()}</p>
                  {isPending ? (
                    <button
                      onClick={() => handlePay(row.id)}
                      className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all"
                    >
                      Төлөх
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      Төлөгдсөн
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
