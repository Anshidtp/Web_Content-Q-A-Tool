import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DocumentScraperPage from './pages/DocumentScraper';
import DocumentChatPage from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scrape" element={<DocumentScraperPage />} />
            <Route path="/chat/:docName" element={<DocumentChatPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;