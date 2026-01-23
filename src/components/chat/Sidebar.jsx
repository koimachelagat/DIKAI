import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faWallet, 
  faFileAlt, 
  faDesktop, 
  faUsers,
  faChevronLeft,
  faChevronRight,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  faWallet: faWallet,
  faFileAlt: faFileAlt,
  faDesktop: faDesktop,
  faUsers: faUsers
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, departments, startNewChat }) {
  return (
    <aside className={`${isSidebarOpen ? "w-64" : "w-16"} h-[calc(100vh-8rem)] sticky top-24 bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl transition-all duration-300 flex flex-col overflow-hidden`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-100/50">
        {isSidebarOpen && (
          <h2 className="font-bold text-[#192f59] uppercase tracking-wider text-xs">
            Menu
          </h2>
        )}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="p-1.5 hover:bg-white/50 rounded-lg text-gray-500 hover:text-[#192f59] transition-colors"
        >
          <FontAwesomeIcon 
            icon={isSidebarOpen ? faChevronLeft : faChevronRight} 
            size="xs" 
          />
        </button>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="px-3 my-4">
        <button 
          onClick={startNewChat}
          className={`w-full flex items-center justify-center gap-2 p-2.5 bg-gradient-to-r from-[#192f59] to-[#2a4a8a] text-white rounded-xl hover:from-[#2a4a8a] hover:to-[#3a5a9a] transition-all shadow-md hover:shadow-lg ${!isSidebarOpen && "px-2"}`}
        >
          <FontAwesomeIcon icon={faPlus} size="sm" />
          {isSidebarOpen && <span className="font-medium text-sm">New Chat</span>}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
        {isSidebarOpen && (
          <p className="text-[9px] font-bold text-gray-400 px-2 mb-1 uppercase tracking-widest">
            Departments
          </p>
        )}
        {departments.map((dept, i) => (
          <button 
            key={i} 
            className="w-full flex items-center gap-3 p-2 hover:bg-white/70 rounded-xl transition-all duration-200 group border border-transparent hover:border-white/50"
          >
            <div className="p-1.5 bg-gradient-to-br from-blue-50 to-white rounded-lg">
              <FontAwesomeIcon 
                icon={iconMap[dept.icon]} 
                className="text-[#192f59] text-base" 
              />
            </div>
            {isSidebarOpen && (
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{dept.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{dept.description}</p>
              </div>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}