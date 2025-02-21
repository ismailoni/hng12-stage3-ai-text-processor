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
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      setShowInstructions(JSON.parse(savedMessages).length === 0);
    }
    setTimeout(() => {
      setLoading(false);
      if (!navigator.userAgent.includes('Chrome')) {
        setShowNotice(true);
      }
    }, 2000);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const withTimeout = (promise, timeout = 10000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
    ]);
  };

  const handleSend = async (text, targetLang) => {
    if (!text.trim()) return;

    setShowInstructions(false);

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
      const lang = await withTimeout(detectLanguage(text));
      setMessages((prev) => prev.map((msg, idx) => idx === messageIndex 
        ? { ...msg, detectedLang: lang, isLoading: { ...msg.isLoading, detectingLang: false } } 
        : msg));
    } catch (error) {
      setMessages((prev) => prev.map((msg, idx) => idx === messageIndex 
        ? { ...msg, detectedLang: 'Language detection failed (timeout).', isLoading: { ...msg.isLoading, detectingLang: false } } 
        : msg));
    }

    if (targetLang) {
      try {
        const translation = await withTimeout(translateText(text, targetLang));
        setMessages((prev) => prev.map((msg, idx) => idx === messageIndex 
          ? { ...msg, translation, isLoading: { ...msg.isLoading, translating: false } } 
          : msg));
      } catch (error) {
        setMessages((prev) => prev.map((msg, idx) => idx === messageIndex 
          ? { ...msg, translation: 'Translation failed (timeout).', isLoading: { ...msg.isLoading, translating: false } } 
          : msg));
      }
    }
  };

  const handleSummarize = async (index) => {
    setMessages((prev) => prev.map((msg, idx) => idx === index 
      ? { ...msg, isLoading: { ...msg.isLoading, summarizing: true } } 
      : msg));

    try {
      const summary = await summarizeText(messages[index].text);
      setMessages((prev) => prev.map((msg, idx) => idx === index 
        ? { ...msg, summary, isLoading: { ...msg.isLoading, summarizing: false } } 
        : msg));
    } catch (error) {
      setMessages((prev) => prev.map((msg, idx) => idx === index 
        ? { ...msg, summary: 'Summarization failed (timeout).', isLoading: { ...msg.isLoading, summarizing: false } } 
        : msg));
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
    setShowInstructions(true);
  };

  return loading ? <LoadingScreen /> : (
    <div className="flex flex-col h-screen p-4 bg-gray-900 text-gray-100">
      {showNotice && <BrowserNotice onClose={() => setShowNotice(false)} />}
      <div className="flex justify-between items-center pb-2 border-b border-gray-700 bg-opacity-30">
        <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AI Text Processor
        </h1>
        <button 
          onClick={handleClearChat}
          className="bg-red-600 hover:bg-red-700 transition-all px-4 py-2 rounded-full text-white font-semibold text-sm shadow-md"
        >
          Clear Chat 🗑
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showInstructions && (
          <div className="text-gray-400 flex flex-col justify-self-center gap-2 bg-gray-800 p-6 rounded-lg shadow-md">
            <h1 className='mb-3'>👋 Welcome to the AI Text Processor!</h1>

            <p>Instructions:</p>
            <ul className="list-disc list-inside flex flex-col gap-2">
              <li>Start typing a message in the chat input below.</li>
              <li>Click on the send button to detect the language of the message.</li>
              <li>Select a target language to translate the message.</li>
              <li>Click on the "Summarize" button to summarize the message.</li>
              <li className='font-bold'>Note: summarize button only appears when detected language is english and text is more than 160 chars.</li>
              <li>Click on the "Clear Chat" button to delete all messages and show these instructions again</li>
            </ul>
          </div>
        )}

        {messages.map((msg, index) => (
          <Message key={index} {...msg} onSummarize={() => handleSummarize(index)} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
