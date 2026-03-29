"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    age: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        age: Number(formData.age),
      };

      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      // Бүртгэл амжилттай бол шууд login хийх хэсэг рүү шилжүүлнэ
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Бүртгүүлэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 w-full max-w-lg p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Шинээр бүртгүүлэх
          </h1>
          <p className="text-slate-400 mt-2">Мэдээллээ үнэн зөв оруулна уу</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Овог нэр</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              placeholder="Бат-Эрдэнэ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Имэйл хаяг</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Нууц үг</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Нас</label>
              <input
                type="number"
                name="age"
                required
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                placeholder="25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Цалин (MNT)</label>
              <input
                type="number"
                name="salary"
                required
                min="0"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
                placeholder="2000000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-teal-500/25 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Бүртгүүлэх"
            )}
          </button>

          <p className="text-center text-slate-400 text-sm mt-4">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 transition-colors">
              Нэвтрэх
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
