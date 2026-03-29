"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchApi("/loan/applications");
      // Sort newest first
      const sorted = (data || []).sort((a: any, b: any) => b.id - a.id);
      setApplications(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      APPROVED: "bg-teal-500/10 text-teal-400 border-teal-500/20",
      REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
      REVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      PENDING: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    };
    
    // @ts-ignore
    const colorClass = colors[status?.toUpperCase()] || colors.PENDING;
    const labels: any = { APPROVED: "Батлагдсан", REJECTED: "Татгалзсан", REVIEW: "Шалгагдаж буй" };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
        {labels[status?.toUpperCase()] || status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Таны зээлүүд</h1>
          <p className="text-slate-400 mt-1">Зээлийн түүх болон эргэн төлөлтөө хянах</p>
        </div>
        <Link 
          href="/dashboard/apply" 
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Шинээр зээл хүсэх
        </Link>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Зээлийн түүх хоосон байна</h2>
          <p className="text-slate-400 max-w-sm mx-auto mb-8">
            Та зээл хараахан аваагүй байна. Дараах товчийг дарж зээлийн хүсэлтээ хялбархан илгээгээрэй.
          </p>
          <Link href="/dashboard/apply" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium">
            Хүсэлт илгээх
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden hover:border-white/20 transition-colors group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Хүсэлтийн дугаар</p>
                    <p className="text-white font-mono font-medium">#{app.id.toString().padStart(6, '0')}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                
                <div className="mb-6">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Зээлийн хэмжээ</p>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    {Number(app.amount).toLocaleString()} ₮
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Хугацаа</p>
                    <p className="text-white font-medium">{app.term_months} сар</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-500 text-xs mb-1">Кредит оноо</p>
                    <p className="text-white font-medium">{app.score ?? 'Тооцоогүй'}</p>
                  </div>
                </div>
              </div>
              
              {app.status === 'approved' && (
                <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                  <Link 
                    href={`/dashboard/loan/${app.id}`} 
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors py-2"
                  >
                    Эргэн төлөлтийн хуваарь харах
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
