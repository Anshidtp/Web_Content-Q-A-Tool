import glob
import logging
from pathlib import Path

import streamlit as st
from dotenv import load_dotenv
from utils.llm import DocumentationRAG
from utils.helper import scraping_config_section,documentation_select_section

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


def initialize_chat_state():
    """Initialize session state for chat"""
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "rag" not in st.session_state:
        st.session_state.llm = DocumentationRAG()

def chat_interface():
    """Create the chat interface"""
    st.title("Documentation Assistant")

    # Check if documentation is selected
    if "current_doc" not in st.session_state:
        st.info("Please select a documentation from the sidebar to start chatting.")
        return
    
# Process documentation if not already processed
    if (
        "docs_processed" not in st.session_state
        or st.session_state.docs_processed != st.session_state.current_doc
    ):
        with st.spinner("Processing documentation..."):
            st.session_state.llm.process_documents(st.session_state.current_doc)
            st.session_state.docs_processed = st.session_state.current_doc
# Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
            if "chain_of_thought" in message:
                with st.expander("View reasoning"):
                    st.markdown(message["chain_of_thought"])


# Chat input
    if prompt := st.chat_input("Ask a question about the documentation"):
        # Add user message
        st.session_state.messages.append({"role": "user", "content": prompt})

        with st.chat_message("user"):
            st.markdown(prompt)

        # Generate and display response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                response, chain_of_thought = st.session_state.llm.query(prompt)
                st.markdown(response)
                with st.expander("View reasoning"):
                    st.markdown(chain_of_thought)

        # Store assistant response
        st.session_state.messages.append({
            "role": "assistant",
            "content": response,
            "chain_of_thought": chain_of_thought,
        })

def sidebar():
    """Create the sidebar UI components"""
    with st.sidebar:
        st.title("Documentation Scraper")
        scraping_config_section()
        documentation_select_section()

def main():
    initialize_chat_state()
    sidebar()
    chat_interface()

if __name__ == "__main__":
    main()