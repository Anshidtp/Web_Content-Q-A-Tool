import logging
import os
import re
from pathlib import Path
from typing import List, Set
from concurrent.futures import ThreadPoolExecutor, as_completed

from langchain_community.document_loaders import FireCrawlLoader
from pydantic import BaseModel, Field

from app.core.config import settings
from app.models.schema import DocPage

# Get logger for the scraper module
logger = logging.getLogger(__name__)

class DocumentationScraper:
    def __init__(self):
        self.app = FireCrawlLoader(
            api_key=settings.FIRECRAWL_API_KEY, 
            mode="crawl"
        )

    def get_documentation_links(self, base_url: str) -> List[str]:
        """
        Get all documentation page links from a given base URL.
        """
        logger.info(f"Getting documentation links from {base_url}")
        initial_crawl = self.app.crawl_url(
            base_url,
            params={
                "scrapeOptions": {"formats": ["links"]},
            },
        )
        all_links = []
        for item in initial_crawl["data"]:
            all_links.extend(item["links"])
        filtered_links = set(
            [link.split("#")[0] for link in all_links if link.startswith(base_url)]
        )
        logger.info(f"Found {len(filtered_links)} unique documentation links")
        return list(filtered_links)

    def scrape_documentation(self, base_url: str, limit: int = None) -> List[DocPage]:
        """Scrape documentation pages from a given base URL."""
        logger.info(f"Scraping doc pages from {base_url}")

        filtered_links = self.get_documentation_links(base_url)
        if limit:
            filtered_links = filtered_links[:limit]

        try:
            logger.info(f"Scraping {len(filtered_links)} documentation pages")
            crawl_results = self.app.batch_scrape_urls(filtered_links)
        except Exception as e:
            logger.error(f"Error scraping documentation pages: {str(e)}")
            return []

        doc_pages = []
        for result in crawl_results["data"]:
            if result.get("markdown"):
                doc_pages.append(
                    DocPage(
                        title=result.get("metadata", {}).get("title", "Untitled"),
                        content=result["markdown"],
                        url=result.get("metadata", {}).get("url", ""),
                    )
                )
            else:
                logger.warning(
                    f"Failed to scrape {result.get('metadata', {}).get('url', 'unknown URL')}"
                )

        logger.info(f"Successfully scraped {len(doc_pages)} pages out of {len(filtered_links)} URLs")
        return doc_pages

    def save_documentation_pages(self, doc_pages: List[DocPage], docs_dir: str):
        """Save scraped documentation pages to markdown files."""
        docs_path = settings.DOCS_DIR / docs_dir
        docs_path.mkdir(parents=True, exist_ok=True)

        for page in doc_pages:
            # Create a safe filename based on the URL
            url_path = page.url.split("://")[1] if "://" in page.url else page.url
            safe_filename = url_path.strip("/").replace("/", "-")
            filepath = docs_path / f"{safe_filename}.md"

            with open(filepath, "w", encoding="utf-8") as f:
                f.write("---\n")
                f.write(f"title: {page.title}\n")
                f.write(f"url: {page.url}\n")
                f.write("---\n\n")
                f.write(page.content)

        logger.info(f"Saved {len(doc_pages)} pages to {docs_dir}")

    def pull_docs(self, base_url: str, docs_dir: str, n_pages: int = None):
        """Pull documentation from a URL and save it to the specified directory."""
        doc_pages = self.scrape_documentation(base_url, n_pages)
        self.save_documentation_pages(doc_pages, docs_dir)
        return len(doc_pages)