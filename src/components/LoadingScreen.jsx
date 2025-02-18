import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
      <motion.h1
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold text-white animate-pulse"
      >
        text<span className="text-blue-700">.ai</span>
      </motion.h1>
    </div>
  );
}
