import { Loader2, Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text, targetLang);
      setText("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[50%] bg-gray-900 p-3 rounded-full shadow-lg flex items-center gap-3"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-3 py-2 text-sm"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />
      <select
        onChange={(e) => setTargetLang(e.target.value)}
        value={targetLang}
        disabled={loading}
        className="bg-gray-800 text-white text-sm px-3 py-1 rounded-lg border border-gray-700"
      >
        <option value="">Translate to...</option>
        <option value="en">English</option>
        <option value="pt">Portuguese</option>
        <option value="jp">Japanese</option>
        <option value="es">Spanish</option>
        <option value="ru">Russian</option>
        <option value="tr">Turkish</option>
        <option value="fr">French</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
}
