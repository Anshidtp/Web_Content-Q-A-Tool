import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import DocumentList from '../components/DocumentList';
import ScraperForm from '../components/ScraperForm';
import ChatWindow from '../components/ChatWindow';

const Home = () => {
  const { chatMode } = useAppContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left column */}
      <div className="md:col-span-4">
        <DocumentList />
      </div>
      
      {/* Right column */}
      <div className="md:col-span-8">
        {chatMode ? <ChatWindow /> : <ScraperForm />}
      </div>
    </div>
  );
};

export default Home;