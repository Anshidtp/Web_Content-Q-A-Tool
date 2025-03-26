import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/solid';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold text-primary-900">WebQuery AI</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:bg-primary-100 hover:text-primary-800 px-3 py-2 rounded-md transition"
            >
              Home
            </Link>
            <Link 
              to="/scrape" 
              className="text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-md transition"
            >
              New Document
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;