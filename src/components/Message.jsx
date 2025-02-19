import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Message({ text, type, detectedLang, summary, translation, isLoading, onSummarize }) {
  const canSummarize = detectedLang === 'English' && text.length >= 150 && !isLoading.summarizing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl max-w-[80%] relative ${type === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-800 text-gray-200 self-start'}`}
    >
      <p>{text}</p>

      {/* Language Detection */}
      {isLoading.detectingLang ? (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" /> Detecting language...
        </p>
      ) : detectedLang ? (
        <p className="text-sm text-gray-400 mt-2">Language: {detectedLang}</p>
      ) : null}

      {/* Translation */}
      {isLoading.translating ? (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" /> Translating...
        </p>
      ) : translation ? (
        <p className="mt-2 text-sm font-semibold text-gray-100">Translation: {translation}</p>
      ) : null}

      {/* Summarization */}
      {isLoading.summarizing ? (
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-2 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
        </p>
      ) : summary ? (
        <p className="mt-2 text-sm font-semibold text-gray-100">Summary: {summary}</p>
      ) : null}

      {/* Summarize Button (Only if conditions are met) */}
      {canSummarize && (
        <button 
          onClick={onSummarize} 
          className="absolute bottom-2 right-2 px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
        >
          Summarize
        </button>
      )}
    </motion.div>
  );
}
