import logging
import sys

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("app.log")
        ],
    )
    
    # Set specific loggers
    loggers = [
        "app.services.scraper",
        "app.services.rag",
        "app.api.routes",
        "uvicorn"
    ]
    
    for logger_name in loggers:
        logger = logging.getLogger(logger_name)
        logger.setLevel(logging.INFO)
    
    return logging.getLogger("app")