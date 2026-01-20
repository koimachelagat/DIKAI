export default function ChatArea() {
  const suggestions = [
    "How do I register for courses?",
    "What is the grading system?",
    "When was Daystar founded?",
    "How do I pay tuition fees?"
  ];

  return (
    <div className="bg-[#d1d5db] min-h-screen p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden ">  
        <div className="p-8 ">
          <div className="bg-[#f3f4f6] p-6 rounded-2xl rounded-tl-none max-w-[80%] border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to DIKAI - Daystar Institutional Knowledge AI! I can help you find information about university policies, procedures, academic regulations, and more. Ask me anything in English or Swahili.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Karibu DIKAI! Ninaweza kukusaidia kupata taarifa kuhusu sera za chuo, taratibu, kanuni za kitaaluma, na zaidi. Niulize chochote kwa Kiingereza au Kiswahili.
            </p>
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">06:25 PM</span>
        </div>

        <div className="p-8 flex flex-col items-end">
          <div className="bg-[#f3f4f6] p-2 rounded-2xl rounded-br-none max-w-[30%] border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-2">
              How do I pay my fees?
            </p>
          </div>
          <span className="text-[10px] text-gray-400 mt-2 block">Now</span>
        </div>

        {/* Input and Suggestions Area */}
        <div className="p-6 border-t border-gray-100">
          <div className="relative flex items-center mb-4">
            <input 
              type="text" 
              placeholder="Ask your question here..." 
              className="w-full p-4 pr-16 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400"
            />
            <button className="absolute right-2 bg-[#d4a017] hover:bg-[#b88a14] p-3 rounded-xl transition-colors">
              <span className="text-white transform  block">➤</span>
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-gray-500 text-sm italic">Try:</span>
            {suggestions.map((text, i) => (
              <button key={i} className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}