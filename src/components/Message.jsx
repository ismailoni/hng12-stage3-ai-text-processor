import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Message({ text, type, detectedLang, summary, translation, isLoading, onSummarize }) {
  const canSummarize = detectedLang === 'English' && text.length > 150 && !isLoading.summarizing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-2xl shadow-md max-w-[80%] max-h-[70%] bg-blue-600 text-white self-end"
    >
      <p className="text-lg leading-relaxed">{text}</p>

      {isLoading.detectingLang && (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Detecting language...
        </p>
      )}

      {detectedLang && <p className="text-sm text-gray-400 mt-2">Language: <span className="font-semibold text-gray-300">{detectedLang}</span></p>}

      {isLoading.translating ? (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Translating...
        </p>
      ) : translation && (
        <p className="mt-2 text-sm font-medium text-gray-100">Translation: <span className="font-semibold">{translation}</span></p>
      )}

      {isLoading.summarizing ? (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
        </p>
      ) : summary && (
        <p className="mt-2 text-sm font-medium text-gray-100">Summary: <span className="font-semibold">{summary}</span></p>
      )}

      {canSummarize && (
        <button 
          onClick={onSummarize} 
          className="mt-3 px-3 py-1 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition"
        >
          Summarize
        </button>
      )}
    </motion.div>
  );
}
