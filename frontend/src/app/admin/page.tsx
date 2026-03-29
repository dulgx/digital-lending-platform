"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

export default function AdminDashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchApi("/admin/applications");
      setApplications(data || []);
      setError("");
    } catch (err: any) {
      setError(err.message || "Мэдээлэл татахад алдаа гарлаа. Та админ эрхтэй эсэхээ шалгана уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (id: number, decision: "approved" | "rejected") => {
    const note = prompt(`Хүсэлт #${id}-г ${decision === 'approved' ? 'ЗӨВШӨӨРӨХ' : 'ТАТГАЛЗАХ'} гэж байна. Тэмдэглэл бичих үү?`);
    if (note === null) return; // cancelled

    try {
      await fetchApi("/admin/decision", {
        method: "POST",
        body: JSON.stringify({
          application_id: id,
          decision: decision,
          note: note
        })
      });
      // Refresh
      await loadData();
    } catch (err: any) {
      alert("Алдаа гарлаа: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
        <h2 className="text-xl text-red-400 font-bold mb-2">Хандах эрхгүй эсвэл алдаа гарлаа</h2>
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Нийт зээлийн хүсэлтүүд</h1>
        <p className="text-slate-400 mt-1">Системд ирсэн бүх хүсэлтийг хянах, шийдвэрлэх самбар</p>
      </header>

      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Хэрэглэгч ID</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Дүн</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Оноо</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Статус</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Одоогоор ямар ч хүсэлт бүртгэгдээгүй байна
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 text-slate-300 font-mono">#{app.id}</td>
                    <td className="py-4 px-6 text-slate-300">Хэрэглэгч #{app.user_id}</td>
                    <td className="py-4 px-6 text-white font-medium">{Number(app.amount).toLocaleString()} ₮ ({app.term_months} сар)</td>
                    <td className="py-4 px-6 text-slate-300">{app.score}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                        app.status === 'approved' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                        app.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {(app.status === 'review' || app.status === 'pending') ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDecision(app.id, 'approved')}
                            className="px-3 py-1.5 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-lg text-sm font-medium transition-colors"
                          >
                            Зөвшөөрөх
                          </button>
                          <button 
                            onClick={() => handleDecision(app.id, 'rejected')}
                            className="px-3 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                          >
                            Татгалзах
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Шийдвэрлэгдсэн</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
