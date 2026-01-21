import { useState } from "react";

export default function Navbar() {
  const [language, setLanguage] = useState("English");

  return (
    <nav className="flex items-center justify-between bg-white px-8 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/du.png" alt="Daystar Logo" width={100} height={100} className="object-contain" />
        <div>
          <h1 className="text-2xl font-serif font-bold leading-none text-[#192f59]">Daystar AI</h1>
          <p className="text-xs italic opacity-90 text-[#192f59]">Daystar Institutional Knowledge AI</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Beautiful Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-[#192f59] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all">
            <span>🌐 {language}</span>
            <span className="text-[10px]">▼</span>
          </button>
          
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <button 
              onClick={() => setLanguage("English")}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-xl">
              English
            </button>
            <button 
              onClick={() => setLanguage("Kiswahili")}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-xl">
              Kiswahili
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}