import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DocumentPlusIcon } from '@heroicons/react/24/solid';

function DocumentScraper() {
  const [urls, setUrls] = useState('');
  const [docName, setDocName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!docName.trim()) {
      setError('Please provide a name for your documentation');
      return;
    }

    const urlList = urls.split('\n').filter(url => url.trim() !== '');
    if (urlList.length === 0) {
      setError('Please provide at least one valid URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/scrape', {  // Updated endpoint
        urls: urlList,
        docs_name: docName.trim(),
        n_pages: 1  // Set default pages
      });

      // Automatically process after scraping
      await axios.post('/api/process', {  // Updated endpoint
        docs_name: response.data.docs_name
      });

      // Redirect to home after successful scraping
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to scrape documentation');
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
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"
    >
      <div className="max-w-md w-full bg-white shadow-xl rounded-xl p-8">
        <div className="text-center mb-8">
          <DocumentPlusIcon className="mx-auto h-12 w-12 text-primary-600" />
          <h2 className="mt-4 text-2xl font-bold text-primary-900">
            Scrape New Documentation
          </h2>
          <p className="mt-2 text-gray-600">
            Enter URLs to scrape and give your document a name
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="docName" className="block text-sm font-medium text-gray-700">
              Documentation Name
            </label>
            <input
              type="text"
              id="docName"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., React Documentation"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700">
              URLs (one per line)
            </label>
            <textarea
              id="urls"
              rows={5}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/docs"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            }`}
          >
            {loading ? 'Scraping...' : 'Scrape Documents'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default DocumentScraper;