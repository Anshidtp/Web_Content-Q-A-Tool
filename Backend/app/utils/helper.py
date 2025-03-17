import glob
from pathlib import Path

import streamlit as st
from .scrapper import DocumentationScraper


def get_existing_docs():
    """Get all documentation directories with -docs suffix"""
    docs_dirs = glob.glob("*-docs")
    return [Path(dir_path).name for dir_path in docs_dirs]

def get_doc_page_count(docs_dir: str) -> int:
    """Get number of markdown files in a documentation directory"""
    return len(list(Path(docs_dir).glob("*.md")))

def scraping_config_section():
    """Create the documentation scraping configuration section"""
    st.markdown("### Configure Scraping")
    base_url = st.text_input(
        "Documentation URL",
        placeholder="https://docs.firecrawl.dev",
        help="The base URL of the documentation to scrape",
    )

    docs_name = st.text_input(
        "Documentation Name",
        placeholder="Firecrawl-docs",
        help="Name of the directory to store documentation",
    )

    n_pages = st.number_input(
        "Number of Pages",
        min_value=0,
        value=0,
        help="Limit the number of pages to scrape (0 for all pages)",
    )

    st.info(
        "💡 Add '-docs' suffix to the documentation name. "
        "Set pages to 0 to scrape all available pages."
    )

    if st.button("Start Scraping"):
        if not base_url or not docs_name:
            st.error("Please provide both URL and documentation name")
        elif not docs_name.endswith("-docs"):
            st.error("Documentation name must end with '-docs'")
        else:
            with st.spinner("Scraping documentation..."):
                try:
                    scraper = DocumentationScraper()
                    n_pages = None if n_pages == 0 else n_pages
                    scraper.pull_docs(base_url, docs_name, n_pages=n_pages)
                    st.success("Documentation scraped successfully!")
                except Exception as e:
                    st.error(f"Error scraping documentation: {str(e)}")

def documentation_select_section():
    """Create the documentation selection section"""
    st.markdown("### Select Documentation")
    existing_docs = get_existing_docs()

    if not existing_docs:
        st.caption("No documentation found yet")
        return None

    # Create options with page counts
    doc_options = [f"{doc} ({get_doc_page_count(doc)} pages)" for doc in existing_docs]

    selected_doc = st.selectbox(
        "Choose documentation to use as context",
        options=doc_options,
        help="Select which documentation to use for answering questions",
    )

    if selected_doc:
        # Extract the actual doc name without page count
        st.session_state.current_doc = selected_doc.split(" (")[0]
        return st.session_state.current_doc
    return None