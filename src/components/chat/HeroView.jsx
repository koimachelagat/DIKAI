export default function HeroView() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-5 p-4 max-w-lg mx-auto">
      <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg border border-white/50">
        <img 
          src="/chatbot.png" 
          alt="Daystar AI Bot" 
          className="w-16 h-16 object-contain" 
        />
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl md:text-3xl font-poppins font-bold text-[#192f59]">
          How can I assist you today?
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          I'm your Daystar University AI assistant. Ask me about admissions, courses, fees, schedules, or any other university-related information.
        </p>
      </div>
    </div>
  );
}