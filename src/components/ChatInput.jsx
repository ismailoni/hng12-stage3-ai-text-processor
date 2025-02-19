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
      className="border w-[90%] p-3 rounded-full shadow-lg flex gap-3 self-center mt-3"
    >
      <div className="flex-1 flex items-start md:items-center flex-col md:flex-row gap-3 pl-5">

        <textarea
          type=""
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-3 py-2 text-sm w-full"
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
          <option value="es">Spanish</option>
          <option value="ru">Russian</option>
          <option value="tr">Turkish</option>
          <option value="fr">French</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 self-center text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
}
