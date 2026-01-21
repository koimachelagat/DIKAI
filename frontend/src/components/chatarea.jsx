import { useState } from "react";

export default function ChatArea() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const suggestions = [
    "How do I register for courses?",
    "What is the grading system?",
    "When was Daystar founded?",
    "How do I pay tuition fees?"
  ];

  const departments = [
    { name: "Finance Office", icon: "💰", description: "Fees & billing" },
    { name: "Registrar", icon: "📝", description: "Transcripts & registration" },
    { name: "ICT Helpdesk", icon: "💻", description: "Portal support" },
    { name: "Student Affairs", icon: "🤝", description: "Clubs & life" },
  ];

  const handleSend = (text) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Yes, I can help you with that.", sender: "bot" }]);
    }, 600);
  };

  const startNewChat = () => {
    setMessages([]); // Clears the chat and brings back the hero screen
    setInputValue("");
  };

  return (
    <div className="flex bg-[#f3f4f6] min-h-screen">
      
      {/* Left Sidebar */}
      <aside className={`${isSidebarOpen ? "w-72" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <h2 className="font-bold text-[#192f59] uppercase tracking-wider text-xs">Menu</h2>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
            {isSidebarOpen ? "⇠" : "⇢"}
          </button>
        </div>

        {/* NEW CHAT BUTTON */}
        <div className="px-4 mb-6">
          <button 
            onClick={startNewChat}
            className={`w-[80%] flex items-center justify-center gap-2 p-2 bg-[#192f59] text-white rounded-xl hover:bg-[#2a4a8a] transition-all shadow-md ${!isSidebarOpen && "px-0"}`}
          >
            <span className="text-xl">+</span>
            {isSidebarOpen && <span className="font-medium">New Chat</span>}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {isSidebarOpen && <p className="text-[10px] font-bold text-gray-400 px-2 mb-2 uppercase">Departments</p>}
          {departments.map((dept, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group">
              <span className="text-xl">{dept.icon}</span>
              {isSidebarOpen && (
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800">{dept.name}</p>
                </div>
              )}
            </button>
          ))}
        </nav>
      </aside>

      
      <main className="flex-1 flex flex-col items-center p-6 md:p-10">
        <div className="w-full max-w-4xl bg-white min-h-[50vh] rounded-[2.5rem] shadow-xl flex flex-col overflow-hidden border border-gray-100 relative">
          
          <div className="flex-1 overflow-y-auto p-10">
            {messages.length === 0 ? (
              /* Centered Hero View (Logo and Ask me anything) */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <img src="/chatbot.png" alt="Bot Logo" className="w-16 h-16 object-contain" />
                </div>
                <h2 className="text-4xl font-poppins font-semibold text-[#192f59]">
                  Ask Daystar AI anything
                </h2>
                <p className="text-gray-400 max-w-xs">
                  I'm here to help with your university questions.
                </p>
              </div>
            ) : (
              /* Active Chat Message List */
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-4 px-6 rounded-3xl text-sm md:text-base ${
                      msg.sender === "user" 
                      ? "bg-[#192f59] text-white rounded-br-none" 
                      : "bg-gray-100 text-gray-700 rounded-tl-none"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-gray-50">
            <div className="relative flex items-center mb-6">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask your question here..." 
                className="w-full p-5 pr-20 bg-gray-50 border border-[#192f59] rounded-2xl transition-all"
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-3 p-3 bg-[#192f59] rounded-xl hover:scale-105 transition-transform"
              >
                <img src="/send.png" alt="Send" width={24} height={24} className="brightness-0 invert"/>
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-gray-400 text-xs font-bold uppercase whitespace-nowrap">Try:</span>
              {suggestions.map((text, i) => (
                <button 
                  key={i} 
                  onClick={() => handleSend(text)}
                  className="whitespace-nowrap px-4 py-2 border border-gray-200 rounded-full text-sm text-gray-500 hover:bg-[#192f59] hover:text-white transition-all">
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}