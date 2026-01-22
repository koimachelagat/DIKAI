import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function InputArea({ inputValue, setInputValue, handleSend, suggestions }) {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-t from-white/80 to-white/50 border-t border-white/30">
      <div className="relative flex items-center mb-6">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question here..." 
          className="w-full p-4 pl-6 pr-16 bg-white/70 backdrop-blur-sm border-2 border-white/50 rounded-2xl shadow-inner focus:outline-none focus:border-[#192f59]/30 focus:ring-2 focus:ring-[#192f59]/10 transition-all text-gray-700 placeholder-gray-400"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!inputValue.trim()}
          className={`absolute right-3 p-3 rounded-xl transition-all ${inputValue.trim() 
            ? "bg-gradient-to-r from-[#192f59] to-[#2a4a8a] hover:shadow-lg hover:scale-105 cursor-pointer" 
            : "bg-gray-300 cursor-not-allowed"}`}
        >
          <FontAwesomeIcon 
            icon={faPaperPlane} 
            className={`text-lg ${inputValue.trim() ? "text-white" : "text-gray-400"}`} 
          />
        </button>
      </div>

      {/* Quick Suggestions */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-gray-400 text-xs font-bold uppercase whitespace-nowrap tracking-wider">
          Quick Questions:
        </span>
        {suggestions.map((text, i) => (
          <button 
            key={i} 
            onClick={() => handleSend(text)}
            className="whitespace-nowrap px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-full text-sm text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-[#192f59] hover:to-[#2a4a8a] transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}