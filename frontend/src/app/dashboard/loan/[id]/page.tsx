"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function RepaymentSchedulePage() {
  const { id } = useParams();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real MVP, user clicks from Application, we need the `loan_id` to get repayments.
  // Because our DB stores repayment via `loan_id`, and `id` in the URL might be `application_id`.
  // Wait, if it's application_id, let's gracefully fail or load the schedules via loan_id.
  
  useEffect(() => {
    if (id) {
      loadSchedule();
    }
  }, [id]);

  const loadSchedule = async () => {
    try {
      // Assuming application ID matches loan ID strictly for this MVP, else we will see an error.
      const data = await fetchApi(`/repayment/${id}`);
      setSchedule(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mb-4 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Хянах самбар руу буцах
        </Link>
        <h1 className="text-3xl font-bold text-white tracking-tight">Эргэн төлөлтийн хуваарь</h1>
        <p className="text-slate-400 mt-1">Зээл #{id}-ийн дэлгэрэнгүй графикийг эндээс харах боломжтой</p>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

        {loading ? (
          <div className="flex justify-center items-center h-64 relative z-10">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : schedule && schedule.length > 0 ? (
          <div className="overflow-x-auto relative z-10 p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Сар №</th>
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Төлөх огноо</th>
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Үндсэн төлбөр</th>
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Хүүгийн төлбөр</th>
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Нийт</th>
                  <th className="py-4 px-6 text-sm font-medium text-slate-400 uppercase tracking-wider">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row: any) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-white font-mono">{row.installment_number}</td>
                    <td className="py-4 px-6 text-slate-300">
                      {new Date(row.due_date).toLocaleDateString('mn-MN')}
                    </td>
                    <td className="py-4 px-6 text-slate-300">{Number(row.principal_payment).toLocaleString()} ₮</td>
                    <td className="py-4 px-6 text-slate-300">{Number(row.interest_payment).toLocaleString()} ₮</td>
                    <td className="py-4 px-6 font-bold text-white bg-white/5">
                      {(Number(row.principal_payment) + Number(row.interest_payment)).toLocaleString()} ₮
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                        row.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}>
                        {row.status === 'pending' ? 'Хүлээгдэж буй' : 'Төлөгдсөн'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 relative z-10">
            <h3 className="text-xl font-medium text-white mb-2">Хуваарь олдсонгүй</h3>
            <p className="text-slate-400">Таны зээлийн график хараахан үүсээгүй эсвэл олдсонгүй.</p>
          </div>
        )}
      </div>
    </div>
  );
}
