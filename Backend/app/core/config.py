import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API settings
    API_V1_STR: str = "/v1"
    
    # Base directories
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DOCS_DIR: Path = BASE_DIR / "docs"
    
    # RAG settings
    # MILVUS_URI: str = "./milvus_webrag.db"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # LLM settings
    GROQ_API_KEY: str = os.environ.get("GROQ_API_KEY", "")
    LLM_MODEL: str = "deepseek-r1-distill-qwen-32b"
    
    # Scraper settings
    FIRECRAWL_API_KEY: str = os.environ.get("FIRECRAWL_API_KEY", "")
    
    # Create docs directory if it doesn't exist
    def setup_directories(self):
        self.DOCS_DIR.mkdir(parents=True, exist_ok=True)
        (self.BASE_DIR / "vectorstores").mkdir(parents=True, exist_ok=True)
        
    class Config:
        env_file = ".env"
        case_sensitive = True

# Initialize settings
settings = Settings()
settings.setup_directories()