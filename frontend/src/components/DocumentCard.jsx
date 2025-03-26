import React from 'react';
import { Link } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

function DocumentCard({ document }) {
  const openSourceWebsite = () => {
    const url = document.urls && document.urls.length > 0 ? document.urls[0] : null;
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 hover:shadow-xl transition">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-primary-900">
          {document.name.replace(/-docs$/, '')}
        </h3>
        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
          {document.page_count || 0} Pages
        </span>
      </div>

      <div className="flex space-x-2">
        <Link 
          to={`/chat/${document.name}`}
          className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 hover:bg-green-200 rounded-md transition"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
          <span>Chat</span>
        </Link>

        <button 
          onClick={openSourceWebsite}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-md transition"
        >
          <GlobeAltIcon className="h-5 w-5" />
          <span>Visit Site</span>
        </button>
      </div>
    </div>
  );
}

export default DocumentCard;