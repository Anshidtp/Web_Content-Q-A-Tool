import logging
from typing import Tuple, List,Dict,Any
import os

from langchain_milvus import Milvus
from langchain_community.document_loaders import DirectoryLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pymilvus import MilvusClient
from langchain_community.vectorstores import FAISS



from app.core.config import settings

logger = logging.getLogger(__name__)

class DocumentationRAG:
    def __init__(self):
        """Initialize the RAG system components"""
# Store vector databases for each documentation
        self.vector_stores: Dict[str, Any] = {}
        
        # Create vectorstore directory if it doesn't exist
        os.makedirs(settings.BASE_DIR / "vectorstores", exist_ok=True)

        # Initialize embeddings
        logger.info("Initializing embeddings model")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-mpnet-base-v2"
        )
        
        # Initialize vector store
        logger.info("Initializing Milvus vector store")
        # self.vector_store = Milvus(
        #     embedding_function=self.embeddings,
        #     connection_args={"uri": settings.MILVUS_URI},
        #     index_params={"index_type": "FLAT", "metric_type": "L2"},
        # )

        # client = MilvusClient("milvus_demo.db")
        self.vector_store = MilvusClient("milvus_demo.db")

        
        # Initialize LLM
        logger.info("Initializing LLM")
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=settings.LLM_MODEL,
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2
        )
        
        # Text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE, 
            chunk_overlap=settings.CHUNK_OVERLAP,
            add_start_index=True
        )
        
        # RAG prompt template
        self.prompt = ChatPromptTemplate.from_template(
            """
            <think>
            I'll answer this question using only the information provided in the documentation context.
            Let me analyze the context and extract the most relevant information.
            
            Context provided:
            {context}
            
            Question:
            {question}
            
            Based on the context, I'll provide a clear and concise answer, focusing on the most relevant information.
            </think>
            
            You are an expert documentation assistant. Use the following documentation context
            to answer the question. If you don't know the answer, just say that you don't
            have enough information. Keep the answer concise and clear.
            
            Context: {context}
            Question: {question}
            
            Answer:"""
        )
        
        # Track processed documents
        self.processed_docs = set()
        
    def load_docs_from_directory(self, docs_dir: str):
        """Load all markdown documents from a directory"""
        dir_path = settings.DOCS_DIR / docs_dir
        logger.info(f"Loading documents from {dir_path}")
        
        # Check if directory exists
        if not dir_path.exists():
            logger.error(f"Directory does not exist: {dir_path}")
            return []
            
        # Load documents
        try:
            markdown_docs = DirectoryLoader(str(dir_path), glob="*.md").load()
            logger.info(f"Loaded {len(markdown_docs)} documents from {dir_path}")
            return markdown_docs
        except Exception as e:
            logger.error(f"Error loading documents: {str(e)}")
            return []

    # 
    def process_documents(self, docs_dir: str):
        """Process documents and create/update vector store"""
        # Load documents
        documents = self.load_docs_from_directory(docs_dir)
        
        if not documents:
            logger.warning(f"No documents found in {docs_dir}")
            return
            
        # Split documents into chunks
        logger.info(f"Splitting {len(documents)} documents into chunks")
        chunks = self.text_splitter.split_documents(documents)
        logger.info(f"Created {len(chunks)} chunks")
        
        # Create vector store path
        vector_store_path = settings.BASE_DIR / "vectorstores" / docs_dir
        
        # Create or update vector store
        if os.path.exists(vector_store_path):
            logger.info(f"Updating existing vector store for {docs_dir}")
            # Load existing vector store
            vector_store = FAISS.load_local(str(vector_store_path), self.embeddings)
            # Add new documents
            vector_store.add_documents(chunks)
        else:
            logger.info(f"Creating new vector store for {docs_dir}")
            # Create new vector store
            vector_store = FAISS.from_documents(chunks, self.embeddings)
            # Save vector store
            vector_store.save_local(str(vector_store_path))
        
        # Store in memory
        self.vector_stores[docs_dir] = vector_store
        
        logger.info(f"Successfully processed documents for {docs_dir}")

    # def query(self, question: str) -> Tuple[str, str]:
    #     """Query the documentation"""
    #     logger.info(f"Processing query: {question}")
        
    #     # Get relevant documents
    #     docs = self.vector_store.similarity_search(question, k=3)
    #     logger.info(f"Retrieved {len(docs)} relevant documents")
        
    #     # Combine context
    #     context = "\n\n".join([doc.page_content for doc in docs])
        
    #     # Generate response
    #     logger.info("Generating response")
    #     chain = self.prompt | self.llm
    #     response = chain.invoke({"context": context, "question": question})
        
    #     # Extract chain of thought and response
    #     response_text = response.content
        
    #     # If no think tags, provide a fallback
    #     if "<think>" not in response_text:
    #         chain_of_thought = "Analyzed the context and generated a response based on the provided documentation."
    #         answer = response_text
    #     else:
    #         # Extract chain of thought between <think> and </think>
    #         chain_of_thought = response_text.split("<think>")[1].split("</think>")[0].strip()
    #         # Extract response after </think>
    #         answer = response_text.split("</think>")[1].strip()
        
    #     logger.info("Query processed successfully")
    #     return answer, chain_of_thought
    def get_vector_store(self, docs_dir: str):
        """Get or load vector store for a documentation directory"""
        # Check if vector store exists in memory
        if docs_dir in self.vector_stores:
            return self.vector_stores[docs_dir]
        
        # Check if vector store exists on disk
        vector_store_path = settings.BASE_DIR / "vectorstores" / docs_dir
        if os.path.exists(vector_store_path):
            logger.info(f"Loading vector store from disk for {docs_dir}")
            vector_store = FAISS.load_local(str(vector_store_path), self.embeddings)
            self.vector_stores[docs_dir] = vector_store
            return vector_store
        
        # If not found, raise error
        logger.error(f"Vector store not found for {docs_dir}. Please process documents first.")
        raise ValueError(f"Vector store not found for {docs_dir}. Please process documents first.")

    def query(self, question: str, docs_dir: str) -> Tuple[str, str]:
        """Query the documentation"""
        logger.info(f"Processing query for {docs_dir}: {question}")
        
        # Get vector store
        vector_store = self.get_vector_store(docs_dir)
        
        # Get relevant documents
        docs = vector_store.similarity_search(question, k=3)
        logger.info(f"Retrieved {len(docs)} relevant documents")
        
        # Combine context
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Generate response
        logger.info("Generating response")
        chain = self.prompt | self.llm
        response = chain.invoke({"context": context, "question": question})
        
        # Extract chain of thought and response
        response_text = response.content
        
        # If no think tags, provide a fallback
        if "<think>" not in response_text:
            chain_of_thought = "Analyzed the context and generated a response based on the provided documentation."
            answer = response_text
        else:
            # Extract chain of thought between <think> and </think>
            chain_of_thought = response_text.split("<think>")[1].split("</think>")[0].strip()
            # Extract response after </think>
            answer = response_text.split("</think>")[1].strip()
        
        logger.info("Query processed successfully")
        return answer, chain_of_thought