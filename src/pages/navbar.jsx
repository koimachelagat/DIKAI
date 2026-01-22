import { useState } from "react";

export default function Navbar() {
  const [language, setLanguage] = useState("English");

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 mx-auto my-4 bg-white/80 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl max-w-7xl transition-all duration-300">
      <div className="flex items-center gap-4">
        <img 
          src="/du.png" 
          alt="Daystar Logo" 
          width={100} 
          height={100} 
          className="object-contain" 
        />
        <div>
          <h1 className="text-2xl font-serif font-bold leading-none text-[#192f59]">
            Daystar AI
          </h1>
          <p className="text-xs italic opacity-90 text-[#192f59]">
            Daystar Institutional Knowledge AI
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Beautiful Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/30 text-[#192f59] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/80 transition-all shadow-sm">
            <span>🌐 {language}</span>
            <span className="text-[10px] transition-transform group-hover:rotate-180">▼</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-32 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <button 
              onClick={() => setLanguage("English")}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/50 first:rounded-t-xl transition-colors"
            >
              English
            </button>
            <button 
              onClick={() => setLanguage("Kiswahili")}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-white/50 last:rounded-b-xl transition-colors"
            >
              Kiswahili
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}