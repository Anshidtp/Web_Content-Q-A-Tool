// API service for interacting with the backend
const API_URL = 'http://localhost:8000/api';

export const fetchDocumentations = async () => {
  try {
    const response = await fetch(`${API_URL}/docs`);
    if (!response.ok) {
      throw new Error('Failed to fetch documentations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching documentations:', error);
    throw error;
  }
};

export const scrapeDocumentation = async (baseUrl, docsDir, nPages) => {
  try {
    const response = await fetch(`${API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base_url: baseUrl, docs_dir: docsDir, n_pages: nPages }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to scrape documentation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error scraping documentation:', error);
    throw error;
  }
};

export const processDocumentation = async (docsDir) => {
  try {
    const response = await fetch(`${API_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ docs_dir: docsDir }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process documentation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing documentation:', error);
    throw error;
  }
};

export const queryDocumentation = async (question, docsDir) => {
  try {
    const response = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, docs_dir: docsDir }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to query documentation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error querying documentation:', error);
    throw error;
  }
};