import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import DocumentList from '../components/DocumentList';
import ScraperForm from '../components/ScraperForm';

const Scraper = () => {
  const { setChatMode } = useAppContext();
  
  // Ensure we're in scraper mode
  useEffect(() => {
    setChatMode(false);
  }, [setChatMode]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left column */}
      <div className="md:col-span-4">
        <DocumentList />
      </div>
      
      {/* Right column */}
      <div className="md:col-span-8">
        <ScraperForm />
      </div>
    </div>
  );
};

export default Scraper;