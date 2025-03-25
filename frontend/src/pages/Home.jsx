import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DocumentCard from '../components/DocumentCard';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

// Add API base URL
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000/api';

function Home() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/docs`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      setDocuments(response.data.docs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.response?.data?.detail || 'Failed to load documents. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary-900">
          Your Documentation Library
        </h1>
        <Link 
          to="/scrape" 
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Docs</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <h2 className="text-2xl text-gray-600 mb-4">
            No documents found
          </h2>
          <p className="text-gray-500 mb-6">
            Start by adding a new documentation set
          </p>
          <Link 
            to="/scrape" 
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition"
          >
            Add First Document
          </Link>
        </div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {documents.map((doc, index) => (
            <motion.div
              key={doc.name}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <DocumentCard 
                document={doc} 
                onRefresh={fetchDocuments}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Home;