'use client';
import { useState, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';
import LoadingScreen from '@/components/LoadingScreen';
import { detectLanguage, summarizeText, translateText } from '@/utils/api';

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);

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

  return loading ? <LoadingScreen /> : (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-white gap-8">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
