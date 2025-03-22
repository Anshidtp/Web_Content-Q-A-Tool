import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-2xl font-bold">DocScraper RAG</h1>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link 
                to="/scraper"
                className={`transition-colors ${location.pathname === '/scraper' ? 'text-white font-semibold' : 'hover:text-blue-200'}`}
              >
                Load Docs
              </Link>
            </li>
            <li>
              <Link 
                to="/chat"
                className={`transition-colors ${location.pathname === '/chat' ? 'text-white font-semibold' : 'hover:text-blue-200'}`}
              >
                Chat
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;