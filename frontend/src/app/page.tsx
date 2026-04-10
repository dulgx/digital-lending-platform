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
        <div className="flex items-center gap-2">
          <Link
            href="/register"
            className="text-sm font-semibold text-gray-700 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full hover:bg-white transition-all shadow-sm"
          >
            Бүртгүүлэх
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white bg-gray-900 px-5 py-2 rounded-full hover:bg-gray-700 transition-all shadow-sm"
          >
            Нэвтрэх
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="z-10 text-center px-6 max-w-lg">
        <div className="mb-6 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-600">Шуурхай шийдвэр гаргадаг</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
          Хэдхэн<br />
          <span className="text-gray-500">минутад зээл!</span>
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

        {/* Feature pills */}
        <div className="mt-14 flex flex-col gap-3 max-w-sm mx-auto">
          <div className="flex items-center gap-4 bg-purple-200/70 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 text-sm">Хэдхэн минутад шийдвэр гардаг автомат систем</span>
          </div>
          <div className="flex items-center gap-4 bg-green-200/70 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700 text-sm">Найдвартай, аюулгүй бүрэн онлайн процесс</span>
          </div>
        </div>
      </main>
    </div>
  );
}
