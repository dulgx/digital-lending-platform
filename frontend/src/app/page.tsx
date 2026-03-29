import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-purple-200 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Soft blurred bg shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-pink-300/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-300/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="absolute top-0 w-full px-6 py-5 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">Z</span>
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">ZMN Fintech</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-semibold text-gray-700 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full hover:bg-white transition-all shadow-sm"
        >
          Нэвтрэх
        </Link>
      </nav>

      {/* Hero */}
      <main className="z-10 text-center px-6 max-w-lg">
        <div className="mb-6 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-600">Шуурхай шийдвэр гаргадаг</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
          Get Loans<br />
          <span className="text-gray-500">in Minutes!</span>
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
          Цалингийн орлогоо шалгуулаад хэдхэн минутын дотор зээл авах боломж. Бүрэн онлайн процесс.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 rounded-full bg-gray-900 text-white font-bold text-base hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Яг одоо зээл авах
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 rounded-full bg-white/70 backdrop-blur-sm text-gray-900 font-semibold text-base hover:bg-white transition-all shadow-sm"
          >
            Нэвтрэх
          </Link>
        </div>

        {/* Preview pills */}
        <div className="mt-14 flex flex-col gap-3 max-w-sm mx-auto">
          <div className="flex items-center justify-between bg-purple-200/70 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700">Нийт зээлийн дүн</span>
            </div>
            <span className="font-black text-gray-900 text-lg">₮74,526.30</span>
          </div>
          <div className="flex items-center justify-between bg-green-200/70 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-semibold text-gray-700">Сарын төлбөр</span>
            </div>
            <span className="font-black text-gray-900 text-lg">₮1,245.30</span>
          </div>
        </div>
      </main>
    </div>
  );
}
