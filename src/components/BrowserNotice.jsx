import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function BrowserNotice() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (window.navigator.userAgentData?.brands[1]?.brand !== "Google Chrome") {
      setShowModal(true);
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      role="dialog"
      aria-labelledby="browser-notice-title"
      aria-describedby="browser-notice-message"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Close browser notice"
        >
          <X size={24} />
        </button>
        <h2 id="browser-notice-title" className="text-xl font-bold mb-3">Browser Compatibility Notice</h2>
        <p id="browser-notice-message" className="text-gray-300">
          For the best experience, please use <span className="text-blue-400 font-semibold">Google Chrome</span>. 
          Some features may not work properly on other browsers.
        </p>
      </motion.div>
    </div>
  );
}
