import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
      role="alert"
      aria-live="assertive"
    >
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2 }}
        className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wide"
        aria-hidden="true"
      >
        text.ai
      </motion.h1>
      <p className="sr-only">Loading, please wait...</p>
    </div>
  );
}
