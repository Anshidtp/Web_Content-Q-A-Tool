import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import DocumentList from '../components/DocumentList';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
  const { setChatMode } = useAppContext();
  
  // Ensure we're in chat mode
  useEffect(() => {
    setChatMode(true);
  }, [setChatMode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left column */}
      <div className="md:col-span-4">
        <DocumentList />
      </div>
      
      {/* Right column */}
      <div className="md:col-span-8">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;