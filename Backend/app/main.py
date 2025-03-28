from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router as api_router
from app.core.config import settings
from app.core.logging import setup_logging

# Setup logging
setup_logging()

# Initialize FastAPI app
app = FastAPI(
    title="Web Content RAG API",
    description="App for scraping documentation and providing RAG-based Q&A capabilities",
    version="1.0.0",
)

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include routers
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="127.0.0.1",
        port=8000, 
        reload=True,
        access_log=True
    )