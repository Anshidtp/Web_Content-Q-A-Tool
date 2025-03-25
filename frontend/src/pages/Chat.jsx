import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  ArrowLeftIcon, 
  SparklesIcon 
} from '@heroicons/react/24/solid';

function Chat() {
  const { docName } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/query', {  // Updated endpoint
        question: userMessage,
        docs_name: docName
      });

      setMessages(prev => [...prev, { 
        text: response.data.answer, 
        isUser: false 
      }]);
    } catch (err) {
      setError('Failed to get response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      <div className="bg-white shadow-md py-4 px-6 flex items-center">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 text-primary-600 hover:text-primary-800"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-primary-900">
          Chat with {docName.replace(/-docs$/, '')}
        </h1>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center text-gray-500">
            <SparklesIcon className="h-16 w-16 text-primary-600 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Start Chatting
            </h2>
            <p>Ask questions about your documentation</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${
              msg.isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <div 
              className={`max-w-xl p-4 rounded-lg ${
                msg.isUser 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 p-4 rounded-lg animate-pulse">
              Generating response...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-6 border-t">
        <div className="flex space-x-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className={`p-2 rounded-md text-white ${
              loading || !input.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Chat;