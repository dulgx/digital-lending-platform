import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[150px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[150px] animate-blob animation-delay-4000"></div>

      {/* Navigation barebones */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent tracking-tighter">
          ZMN FINTECH
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Нэвтрэх
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="z-10 text-center px-4 max-w-4xl">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
          <span className="text-sm font-medium text-blue-300 tracking-wide">AI-д суурилсан хурд</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
          Дижитал зээлийн <br className="hidden md:block" /> шинэ эрин үе
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Цалингийн орлогоо шалгуулаад хэдхэн секундийн дотор зээл авах боломж. Салбар дээр очих шаардлагагүй, бүрэн онлайн процесс.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            href="/register" 
            className="px-8 py-4 rounded-full bg-slate-100 font-bold text-slate-900 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            Яг одоо зээл авах
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md font-semibold text-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            Үйлчилгээтэй танилцах
          </Link>
        </div>
      </main>

      {/* Decorative floating cards */}
      <div className="hidden lg:block absolute left-10 top-1/3 transform -rotate-12 w-64 h-32 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="h-2 w-12 bg-blue-500/50 rounded-full mb-4"></div>
        <div className="h-2 w-3/4 bg-slate-700 rounded-full mb-3"></div>
        <div className="h-2 w-1/2 bg-slate-700 rounded-full"></div>
      </div>
      <div className="hidden lg:block absolute right-10 bottom-1/4 transform rotate-6 w-64 h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-8 bg-purple-500/50 rounded-full"></div>
          <div className="text-teal-400 font-mono text-sm">Зөвшөөрөгдсөн</div>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full mb-3"></div>
        <div className="h-2 w-2/3 bg-slate-700 rounded-full"></div>
      </div>
    </div>
  );
}
