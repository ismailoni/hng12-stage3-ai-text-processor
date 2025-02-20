import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function BrowserNotice() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (window.navigator.userAgentData.brands[1].brand !== 'Google Chrome') {
      setShowModal(true);
    }
  }, []);

  if (!showModal) return null;

  return (showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
      >
        <button 
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-3">Browser Compatibility Notice</h2>
        <p className="text-gray-300">For the best experience, please use <span className="text-blue-400 font-semibold">Google Chrome</span>. Some features may not work properly on other browsers.</p>
      </motion.div>
    </div>
    )
  );
}
