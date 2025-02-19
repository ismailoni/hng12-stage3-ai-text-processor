'use client';
import { useState, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';
import LoadingScreen from '@/components/LoadingScreen';
import { detectLanguage, summarizeText, translateText } from '@/utils/api';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    setTimeout(() => setLoading(false), 5000); // Reduced loading time
  }, []);

  // Save messages to localStorage on change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text, targetLang) => {
    if (!text.trim()) return;

    const newMessage = {
      text,
      type: 'user',
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
      console.error('Error processing message:', error);
    }
  };

  const handleSummarize = async (index) => {
    setMessages((prev) => prev.map((msg, idx) => idx === index ? { ...msg, isLoading: { ...msg.isLoading, summarizing: true } } : msg));

    try {
      const summary = await summarizeText(messages[index].text);
      setMessages((prev) => prev.map((msg, idx) => idx === index ? { ...msg, summary, isLoading: { ...msg.isLoading, summarizing: false } } : msg));
    } catch (error) {
      console.error('Summarization failed:', error);
    }
  };

  // Clear chat function with animation
  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return loading ? <LoadingScreen /> : (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-white gap-4">
      <div className="flex justify-end">
        <button 
          onClick={handleClearChat}
          className="bg-red-600 hover:bg-red-700 transition-all px-4 py-2 rounded-full text-white font-medium text-sm shadow-lg"
        >
          Clear Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-10 space-y-4">
        {messages.map((msg, index) => (
          <Message
            key={index}
            text={msg.text}
            type={msg.type}
            detectedLang={msg.detectedLang}
            summary={msg.summary}
            translation={msg.translation}
            isLoading={msg.isLoading}
            onSummarize={() => handleSummarize(index)}
          />
        ))}
      </div>
      <div>
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
