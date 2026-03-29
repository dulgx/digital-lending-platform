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
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Бүртгүүлэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-medium";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-purple-200 flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-300/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <span className="text-white text-2xl font-black">Z</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Шинээр бүртгүүлэх</h1>
          <p className="text-gray-500 mt-2 font-medium">Мэдээллээ үнэн зөв оруулна уу</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-7">
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className={labelClass}>Овог нэр</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Бат-Эрдэнэ" />
            </div>
            <div>
              <label className={labelClass}>Имэйл хаяг</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="name@example.com" />
            </div>
            <div>
              <label className={labelClass}>Нууц үг</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className={inputClass} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Нас</label>
                <input type="number" name="age" required min="18" max="100" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" />
              </div>
              <div>
                <label className={labelClass}>Цалин (₮)</label>
                <input type="number" name="salary" required min="0" value={formData.salary} onChange={handleChange} className={inputClass} placeholder="2,000,000" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Бүртгүүлэх"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 font-medium">
          Аль хэдийн бүртгэлтэй юу?{" "}
          <Link href="/login" className="text-gray-900 font-bold hover:underline">
            Нэвтрэх
          </Link>
        </p>
      </div>
    </div>
  );
}
