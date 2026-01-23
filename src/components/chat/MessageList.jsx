export default function MessageList({ messages, messagesEndRef }) {
  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <div 
          key={i} 
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`max-w-[85%] min-w-[20%] break-words p-4 px-5 rounded-3xl text-sm md:text-base shadow-sm border ${
            msg.sender === "user" 
            ? "bg-gradient-to-r from-[#192f59] to-[#2a4a8a] text-white rounded-br-none border-[#192f59]/20" 
            : "bg-gradient-to-br from-gray-50 to-white text-gray-700 rounded-tl-none border-gray-100"
          }`}>
            <div className="whitespace-pre-wrap break-words">
              {msg.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}