import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Message({ text, detectedLang, summary, translation, isLoading, onSummarize }) {
  const canSummarize = detectedLang === 'English' && text.length > 150 && !isLoading.summarizing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-5 rounded-2xl shadow-lg max-w-[80%] bg-gradient-to-br from-blue-600 to-purple-700 text-white self-end font-inter"
    >
      <p className="text-base font-bold tracking-wide leading-relaxed">{text}</p>

      {isLoading.detectingLang && (
        <p className="text-sm text-gray-300 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Detecting language...
        </p>
      )}

      {detectedLang && (
        <p className="text-sm mt-2 p-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 text-gray-100 font-medium shadow-md table">
          Language: <span className="font-semibold text-white">{detectedLang}</span>
        </p>
      )}

      {isLoading.translating ? (
        <p className="text-sm text-gray-300 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Translating...
        </p>
      ) : translation && (
        <p className="mt-2 p-2 text-sm font-medium bg-gradient-to-r from-violet-500 to-indigo-700 text-gray-100 rounded-md shadow-md table">
          Translation: <span className="font-semibold text-white">{translation}</span>
        </p>
      )}

      {isLoading.summarizing ? (
        <p className="text-sm text-gray-300 flex items-center gap-2 mt-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Summarizing...
        </p>
      ) : summary && (
        <p className="mt-2 p-2 text-sm font-medium bg-gradient-to-r from-fuchsia-600 to-violet-500 text-gray-100 rounded-md shadow-md ">
          Summary: <span className="font-semibold text-white">{summary}</span>
        </p>
      )}

      {canSummarize && (
        <motion.button 
          onClick={onSummarize} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-3 px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md"
        >
         📝 Summarize
        </motion.button>
      )}
    </motion.div>
  );
}
