# Web_Content-Q-A-Tool  🔍📚

An advanced FastAPI-powered documentation scraping and question-answering system leveraging RAG (Retrieval-Augmented Generation) technology.

## 🌟 Features

- **Multi-URL Documentation Scraping**: Utilize Firecrawl to extract comprehensive documentation from multiple websites
- **Intelligent Question Answering**: Powered by DeepSeek LLM from Groq Cloud
- **Vector Search**: Fast semantic document retrieval using FAISS
- **RESTful API**: Seamless integration with modern web applications
- **React Frontend**: Intuitive user interface for interacting with documentation

## 🚀 Technology Stack
 
  - FastAPI
  - LangChain
  - Firecrawl (Web Scraping)
  - FAISS (Vector Database)
  - DeepSeek LLM (via Groq Cloud)
  - React


## 🛠 Prerequisites

- Python 3.9+
- Node.js 14+

## 📦 Installation

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/documentation-rag-api.git
   cd documentation-rag-api
   ```

2. Create virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file
   ```
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

### Frontend Setup

1. Navigate to frontend directory
   ```bash
   cd frontend
   npm install
   ```

## 🖥 Running the Application

### Start Backend
```bash
uvicorn app.main:app --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

## 🌐 API Endpoints

- `POST /api/scrape`: Scrape documentation from URLs
- `POST /api/process`: convert scraped contents in to vector embedding and building a knowledge base
- `POST /api/query`: Ask questions about scraped documentation
- `GET /api/docs`: List available documentation

## 📝 Usage Example

```python
# Scrape documentation
requests.post('/api/scrape', json={
    'urls': ['https://docs.example.com'],
    'docs_name': 'example-docs'
})

# Query documentation
response = requests.post('/api/query', json={
    'question': 'How do I use the API?',
    'docs_name': 'example-docs'
})
```


## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙌 Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [LangChain](https://www.langchain.com/)
- [Firecrawl](https://www.firecrawl.dev/)
- [Groq Cloud](https://wow.groq.com/)
- [FAISS](https://github.com/facebookresearch/faiss)

---

**Star ⭐ this repository if you find it helpful!**