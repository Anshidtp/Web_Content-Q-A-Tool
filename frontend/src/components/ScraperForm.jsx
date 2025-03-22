import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { scrapeDocumentation, processDocumentation } from '../services/api';

const ScraperForm = () => {
  const { setLoading, showError, showSuccess, setDocumentations } = useAppContext();
  const [baseUrl, setBaseUrl] = useState('');
  const [docsDir, setDocsDir] = useState('');
  const [nPages, setNPages] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScrape = async (e) => {
    e.preventDefault();
    
    if (!baseUrl || !docsDir) {
      showError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const result = await scrapeDocumentation(baseUrl, docsDir, nPages);
      showSuccess(`Successfully scraped ${result.pages_count} pages`);
      
      // Update documentations list
      setDocumentations(prev => [...prev, docsDir]);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!docsDir) {
      showError('Please enter a documentation directory');
      return;
    }
    
    setIsProcessing(true);
    setLoading(true);
    try {
      await processDocumentation(docsDir);
      showSuccess(`Successfully processed ${docsDir} documentation`);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Scrape Documentation</h2>
      <form onSubmit={handleScrape}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baseUrl">
            Base URL *
          </label>
          <input
            id="baseUrl"
            type="url"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://example.com/docs"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="docsDir">
            Documentation Directory *
          </label>
          <input
            id="docsDir"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="langchain"
            value={docsDir}
            onChange={(e) => setDocsDir(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nPages">
            Number of Pages (max)
          </label>
          <input
            id="nPages"
            type="number"
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={nPages}
            onChange={(e) => setNPages(parseInt(e.target.value))}
          />
        </div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Scrape
          </button>
          
          <button
            type="button"
            onClick={handleProcess}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Load & Process'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScraperForm;