import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documentations, setDocumentations] = useState([]);
  const [selectedDocumentation, setSelectedDocumentation] = useState(null);
  const [chatMode, setChatMode] = useState(false);

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        error,
        showError,
        success,
        showSuccess,
        documentations,
        setDocumentations,
        selectedDocumentation,
        setSelectedDocumentation,
        chatMode,
        setChatMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Export the context as default
export default AppContext;
