import React, { useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { fetchDocumentations } from '../services/api';

const DocumentList = () => {
  const { 
    documentations, 
    setDocumentations, 
    selectedDocumentation, 
    setSelectedDocumentation,
    setLoading,
    showError
  } = useAppContext();

  useEffect(() => {
    const loadDocumentations = async () => {
      setLoading(true);
      try {
        const data = await fetchDocumentations();
        setDocumentations(data.documentations);
      } catch (error) {
        showError('Failed to load documentations');
      } finally {
        setLoading(false);
      }
    };

    loadDocumentations();
  }, []);

  if (documentations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <p className="text-gray-500 italic">No documentations available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Available Documentations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentations.map((doc) => (
          <div 
            key={doc}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedDocumentation === doc ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedDocumentation(doc)}
          >
            <h3 className="font-medium text-gray-800">{doc}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;