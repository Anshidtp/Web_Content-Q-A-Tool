import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext'; // ✅ Import AppContext and useAppContext
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Scraper from './pages/Scraper';
import Chat from './pages/Chat';
import LoadingSpinner from './components/LoadingSpinner';

const MainContent = () => {
  const { loading, error, success } = useAppContext(); // ✅ Use the custom hook

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scraper" element={<Scraper />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      
      {loading && <LoadingSpinner />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </Router>
  );
};

export default App;
