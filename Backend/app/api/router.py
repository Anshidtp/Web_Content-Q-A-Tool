import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
import asyncio

from app.models.schema import (
    ScrapingRequest, 
    QueryRequest, 
    ScrapingResponse, 
    QueryResponse, 
    DocsListResponse,
    StatusResponse,
    EmbedRequest
)
from app.services.scrapper import DocumentationScraper
from app.services.rag import DocumentationRAG
from app.utils.helper import get_existing_docs, get_doc_page_count

# Initialize logger
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter()

# Dependency for RAG service
def get_rag_service():
    return DocumentationRAG()

# Dependency for Scraper service
def get_scraper_service():
    return DocumentationScraper()

@router.get("/docs", response_model=DocsListResponse)
async def list_docs():
    """List all available documentation directories"""
    try:
        existing_docs = get_existing_docs()
        docs_with_counts = [
            {"name": doc, "page_count": get_doc_page_count(doc)} 
            for doc in existing_docs
        ]
        return DocsListResponse(docs=docs_with_counts)
    except Exception as e:
        logger.error(f"Error listing docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scrape", response_model=ScrapingResponse)
async def scrape_docs(
    request: ScrapingRequest,
    scraper: DocumentationScraper = Depends(get_scraper_service)
):
    """Scrape documentation from multiple URLs"""
    try:
        docs_name = request.docs_name
        if not docs_name.endswith("-docs"):
            docs_name = f"{docs_name}-docs"
        
        # # Create scraping tasks for each URL
        # async def scrape_url(url):
        #     return await scraper.pull_docs(str(url), request.docs_name, request.n_pages)
            
        # # Gather and execute all scraping tasks concurrently    
        # tasks = [scrape_url(url) for url in request.urls]
        # processed_urls = await asyncio.gather(*tasks)
        
        processed_urls = []
        for url in request.urls:
            scraper.pull_docs(str(url), request.docs_name, request.n_pages)
            processed_urls.append(str(url))
        
        page_count = get_doc_page_count(request.docs_name)
        
        return ScrapingResponse(
            docs_name=request.docs_name,
            page_count=page_count,
            urls_processed=processed_urls,
            success=True,
            message=f"Successfully scraped {page_count} pages from {len(processed_urls)} URLs"
        )
    except Exception as e:
        logger.error(f"Error scraping docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process", response_model=StatusResponse)
async def process_docs(
    request: EmbedRequest,
    rag: DocumentationRAG = Depends(get_rag_service)
):
    """Process documentation and embed into vector database"""
    try:
        # Process documents
        rag.process_documents(request.docs_name)
        
        return StatusResponse(
            status="success",
            details={
                "docs_name": request.docs_name,
                "message": f"Successfully processed and embedded documents from {request.docs_name}"
            }
        )
    except Exception as e:
        logger.error(f"Error processing docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query_docs(
    request: QueryRequest,
    rag: DocumentationRAG = Depends(get_rag_service)
):
    """Query documentation using RAG (assumes documents are already processed)"""
    try:
        # Generate response
        answer, chain_of_thought = rag.query(request.question, request.docs_name)
        
        return QueryResponse(
            question=request.question,
            answer=answer,
            chain_of_thought=chain_of_thought,
            docs_name=request.docs_name
        )
    except Exception as e:
        logger.error(f"Error querying docs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=StatusResponse)
async def health_check():
    """Health check endpoint"""
    return StatusResponse(status="healthy")