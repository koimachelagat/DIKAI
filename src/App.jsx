import Navbar from "./pages/navbar.jsx";
import ChatArea from "./components/chat/ChatArea";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <ChatArea />
    </div>
  );
}