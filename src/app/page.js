'use client';
import { useState, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';
import LoadingScreen from '@/components/LoadingScreen';
import BrowserNotice from '@/components/BrowserNotice';
import { detectLanguage, summarizeText, translateText } from '@/utils/api';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    setTimeout(() => {
      setLoading(false);
      if (!navigator.userAgent.includes('Chrome')) {
        setShowNotice(true);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text, targetLang) => {
    if (!text.trim()) return;

    const newMessage = {
      text,
      detectedLang: null,
      summary: '',
      translation: '',
      isLoading: { detectingLang: true, translating: !!targetLang, summarizing: false }
    };

    setMessages((prev) => [...prev, newMessage]);
    const messageIndex = messages.length;

    try {
      const lang = await detectLanguage(text);
      setMessages((prev) => prev.map((msg, idx) => idx === messageIndex ? { ...msg, detectedLang: lang, isLoading: { ...msg.isLoading, detectingLang: false } } : msg));

      if (targetLang) {
        const translation = await translateText(text, targetLang);
        setMessages((prev) => prev.map((msg, idx) => idx === messageIndex ? { ...msg, translation, isLoading: { ...msg.isLoading, translating: false } } : msg));
      }
    } catch (error) {
      return 'Error processing message:';
    }
  };

  const handleSummarize = async (index) => {
    setMessages((prev) => prev.map((msg, idx) => idx === index ? { ...msg, isLoading: { ...msg.isLoading, summarizing: true } } : msg));

    try {
      const summary = await summarizeText(messages[index].text);
      setMessages((prev) => prev.map((msg, idx) => idx === index ? { ...msg, summary, isLoading: { ...msg.isLoading, summarizing: false } } : msg));
    } catch (error) {
      return 'Summarization failed:', error;
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return loading ? <LoadingScreen /> : (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-gray-100">
      {showNotice && <BrowserNotice onClose={() => setShowNotice(false)} />}
      <div className="flex justify-between items-center pb-2 border-b border-gray-700 bg-opacity-30">
        <h1 className="text-2xl font-bold tracking-tight">AI Text Processor</h1>
        <button 
          onClick={handleClearChat}
          className="bg-red-600 hover:bg-red-700 transition-all px-4 py-2 rounded-full text-white font-semibold text-sm shadow-md"
        >
          Clear Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} {...msg} onSummarize={() => handleSummarize(index)} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
