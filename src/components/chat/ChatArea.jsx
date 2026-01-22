import { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import ChatInterface from "./ChatInterface";

export default function ChatArea() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Create ref for the messages container
  const messagesEndRef = useRef(null);

  const suggestions = [
    "How do I register for courses?",
    "What is the grading system?",
    "When was Daystar founded?",
    "How do I pay tuition fees?"
  ];

  const departments = [
    { name: "Finance Office", icon: "faWallet", description: "Fees & billing" },
    { name: "Registrar", icon: "faFileAlt", description: "Transcripts & registration" },
    { name: "ICT Helpdesk", icon: "faDesktop", description: "Portal support" },
    { name: "Student Affairs", icon: "faUsers", description: "Clubs & life" },
  ];

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    const query = text || inputValue;
    if (!query.trim()) return;

    const userMsg = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        text: "Yes, I can help you with that. Let me check our knowledge base for the most accurate information regarding your query.", 
        sender: "bot" 
      }]);
    }, 600);
  };

  const startNewChat = () => {
    setMessages([]);
    setInputValue("");
  };

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen p-4 md:p-6">
      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        departments={departments}
        startNewChat={startNewChat}
      />
      
      <ChatInterface 
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        suggestions={suggestions}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
}