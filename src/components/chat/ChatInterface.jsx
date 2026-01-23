import MessageList from "./MessageList";
import InputArea from "./InputArea";
import HeroView from "./HeroView";

export default function ChatInterface({ 
  messages, 
  inputValue, 
  setInputValue, 
  handleSend, 
  suggestions,
  messagesEndRef 
}) {
  return (
    <main className="flex-1 flex flex-col items-center p-2 md:p-4 ml-4">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md h-[calc(100vh-8rem)] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/30">
        {/* Chat Messages Area - Fixed height with proper scrolling */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <HeroView />
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              {/* Empty div for scrolling reference */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-white/30">
          <InputArea 
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSend={handleSend}
            suggestions={suggestions}
          />
        </div>
      </div>
    </main>
  );
}