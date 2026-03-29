"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  APPROVED: { label: "Батлагдсан", cls: "bg-green-100 text-green-700" },
  REJECTED: { label: "Татгалзсан", cls: "bg-red-100 text-red-600" },
  REVIEW:   { label: "Шалгагдаж буй", cls: "bg-amber-100 text-amber-700" },
  PENDING:  { label: "Хүлээгдэж буй", cls: "bg-blue-100 text-blue-700" },
};

const ICON_COLORS = [
  "bg-[#C8F5F0]",
  "bg-[#DAFADE]",
  "bg-[#F5E642]/60",
  "bg-[#FFE0CC]",
  "bg-[#E8D5FB]",
];

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status?.toUpperCase()] ?? STATUS_MAP.PENDING;
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/loan/applications")
      .then((data: any) => {
        const sorted = (data || []).sort((a: any, b: any) => b.id - a.id);
        setApplications(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = applications.reduce((s, a) => s + Number(a.amount || 0), 0);
  const approvedApps = applications.filter((a) => a.status?.toUpperCase() === "APPROVED");
  const pendingApps = applications.filter(
    (a) => a.status?.toUpperCase() === "PENDING" || a.status?.toUpperCase() === "REVIEW"
  );

  return (
    <div className="space-y-6 animate-[slideUp_0.4s_ease-out]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Wallet</h1>
          <p className="text-gray-400 text-xs font-medium">Сайн байна уу</p>
        </div>
        <div className="w-11 h-11 rounded-full bg-amber-200 flex items-center justify-center">
          <span className="text-amber-800 font-black text-lg">М</span>
        </div>
      </header>

      {/* ── Balance Card (Yellow) ── */}
      <div className="bg-[#EDD633] rounded-[28px] p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="font-black text-black text-base tracking-wide">ЗЭЭЛ</span>
          </div>
          <span className="text-black/50 font-semibold text-sm">03/26</span>
        </div>

        <p className="text-black/60 text-sm font-medium mb-1">Нийт зээлийн дүн</p>
        <p className="text-4xl font-black text-black tracking-tight">
          ₮{totalAmount.toLocaleString()}
        </p>

        <div className="flex items-end justify-between mt-5">
          <div>
            <p className="text-black/50 text-xs mb-0.5">Нэр</p>
            <p className="font-black text-black text-sm">Миний данс</p>
          </div>
          <div className="text-right">
            <p className="text-black/50 text-xs mb-0.5">Нийт зээл</p>
            <p className="font-black text-black text-sm">{applications.length} хүсэлт</p>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-black/5 rounded-full" />
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-black/5 rounded-full" />
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex items-center justify-between px-2">
        <Link href="/dashboard/apply" className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500">Хүсэлт</span>
        </Link>

        <button className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500">Шилжүүлэх</span>
        </button>

        <button className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500">Илгээх</span>
        </button>

        <button className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-500">Дэлгэрэнгүй</span>
        </button>
      </div>

      {/* ── Spending by Category ── */}
      <div>
        <h2 className="text-base font-black text-gray-900 mb-3">Зээлийн ангилал</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Teal card */}
          <div className="bg-[#C8F5F0] rounded-[24px] p-4 relative overflow-hidden">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-8">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Батлагдсан</p>
            <p className="text-2xl font-black text-gray-900">{approvedApps.length} зээл</p>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-black/5 rounded-full" />
          </div>

          {/* Green card */}
          <div className="bg-[#DAFADE] rounded-[24px] p-4 relative overflow-hidden">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mb-8">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Хүлээгдэж буй</p>
            <p className="text-2xl font-black text-gray-900">{pendingApps.length} зээл</p>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-black/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── My Loans ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-black text-gray-900">Миний зээлүүд</h2>
          <button className="text-sm font-semibold text-gray-400">Бүгдийг харах</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-[24px] p-10 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-bold text-gray-700 text-base mb-1">Зээл байхгүй байна</p>
            <p className="text-gray-400 text-sm mb-5">Анхны зээлийн хүсэлтээ илгээгээрэй</p>
            <Link
              href="/dashboard/apply"
              className="inline-flex px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
            >
              Хүсэлт илгээх
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app, i) => (
              <div
                key={app.id}
                className="bg-white rounded-[20px] p-4 flex items-center gap-3 shadow-sm"
              >
                <div
                  className={`w-12 h-12 ${ICON_COLORS[i % ICON_COLORS.length]} rounded-2xl flex items-center justify-center flex-shrink-0`}
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate mb-1">
                    {app.purpose || "Дижитал зээл"}
                  </p>
                  <StatusBadge status={app.status} />
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-black text-gray-900 text-sm">
                    ₮{Number(app.amount).toLocaleString()}
                  </p>
                  {app.status?.toUpperCase() === "APPROVED" && (
                    <Link
                      href={`/dashboard/loan/${app.id}`}
                      className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Дэлгэрэнгүй →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
