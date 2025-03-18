import glob
from pathlib import Path
from typing import List

from app.core.config import settings

def get_existing_docs() -> List[str]:
    """Get all documentation directories with -docs suffix"""
    docs_dir = settings.DOCS_DIR
    docs_dirs = [path.name for path in docs_dir.glob("*-docs") if path.is_dir()]
    return docs_dirs

def get_doc_page_count(docs_dir: str) -> int:
    """Get number of markdown files in a documentation directory"""
    dir_path = settings.DOCS_DIR / docs_dir
    return len(list(dir_path.glob("*.md")))

def sanitize_filename(filename: str) -> str:
    """Create a safe filename from potentially unsafe input"""
    # Remove invalid characters
    valid_chars = "-_.() abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    sanitized = ''.join(c for c in filename if c in valid_chars)
    # Replace spaces with underscores
    sanitized = sanitized.replace(' ', '_')
    return sanitized