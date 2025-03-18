from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl

# Request models
class ScrapingRequest(BaseModel):
    urls: List[HttpUrl] = Field(..., description="List of documentation URLs to scrape")
    docs_name: str = Field(..., description="Name of the documentation directory")
    n_pages: Optional[int] = Field(None, description="Limit the number of pages to scrape (None for all pages)")

class QueryRequest(BaseModel):
    question: str = Field(..., description="Question to ask about the documentation")
    docs_name: str = Field(..., description="Name of the documentation directory to query")

# Response models
class DocPage(BaseModel):
    title: str = Field(..., description="Page title")
    content: str = Field(..., description="Main content of the page")
    url: str = Field(..., description="Page URL")

class ScrapingResponse(BaseModel):
    docs_name: str = Field(..., description="Name of the documentation directory")
    page_count: int = Field(..., description="Number of pages scraped")
    urls_processed: List[str] = Field(..., description="List of URLs processed")
    success: bool = Field(..., description="Whether the scraping was successful")
    message: str = Field(..., description="Status message")

class EmbedRequest(BaseModel):
    docs_name: str = Field(..., description="Name of the documentation directory to query")

class QueryResponse(BaseModel):
    question: str = Field(..., description="Original question")
    answer: str = Field(..., description="Answer to the question")
    chain_of_thought: str = Field(..., description="Chain of thought reasoning")
    docs_name: str = Field(..., description="Documentation used for the answer")

class DocsListResponse(BaseModel):
    docs: List[dict] = Field(..., description="List of available documentation directories with page counts")
    
class StatusResponse(BaseModel):
    status: str = Field(..., description="Status message")
    details: Optional[dict] = None