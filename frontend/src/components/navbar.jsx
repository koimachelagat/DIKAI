export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-[#1e3a5f] px-8 py-3 text-white p-20">
      
      <div className="flex items-center gap-4">
        {/* <div className="bg-[#eab308] p-2 rounded-lg">
           
           <span className="text-2xl text-[#1e3a5f]">🎓</span>
        </div> */}
        <div>
          <h1 className="text-2xl font-serif font-bold leading-none">DIKAI</h1>
          <p className="text-xs italic opacity-90">Daystar Institutional Knowledge AI</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex bg-[#4a6b8a] rounded-md overflow-hidden p-0.5">
          <button className="bg-[#eab308] text-white px-4 py-1 text-sm font-semibold rounded">English</button>
          <button className="px-4 py-1 text-sm font-semibold text-white hover:bg-white/10">Kiswahili</button>
        </div>
        <div className="text-right text-[10px] space-y-0.5">
          <div className="flex items-center justify-end gap-1">
            {/* <span>📚</span> */}
             19 Documents
          </div>
          <div className="flex items-center justify-end gap-1">
            {/*   */}
             Last Updated: Jan 2025
          </div>
        </div>
      </div>
    </nav>
  );
}