import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import DirectoryLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_groq import ChatGroq



class DocumentationRAG:
    def __init__(self):
        # Initialize embeddings and vector store
        self.embeddings = OllamaEmbeddings(model="nomic-embed-text")
        self.vector_store = FAISS(
            embedding_function=self.embeddings,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

        # Initialize LLM
        self.llm = ChatGroq(
            model="mixtral-8x7b-32768",
            temperature=0,
            max_tokens=None,
            timeout=None,
            max_retries=2,
            # other params...
        )

        # Text splitter for chunking
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200, add_start_index=True
        )

        self.prompt = ChatPromptTemplate.from_template(
            """
            You are an expert documentation assistant. Use the following documentation context
            to answer the question. If you don't know the answer, just say that you don't
            have enough information. Keep the answer concise and clear.

            Context: {context}
            Question: {question}

            Answer:"""
        )

    def load_docs_from_directory(self, docs_dir: str):
        """Load all markdown documents from a directory"""
        markdown_docs = DirectoryLoader(docs_dir, glob="*.md").load()
        return markdown_docs
    
    def process_documents(self, docs_dir: str):
        """Process documents and add to vector store"""
        # Clear existing documents
        self.vector_store = FAISS(
            embedding_function=self.embeddings,
            docstore=InMemoryDocstore(),
            index_to_docstore_id={},
        )

        # Load and process new documents
        documents = self.load_docs_from_directory(docs_dir)
        chunks = self.text_splitter.split_documents(documents)
        self.vector_store.add_documents(chunks)

    def query(self, question: str) -> tuple[str, str]:
        """Query the documentation"""
        # Get relevant documents
        docs = self.vector_store.similarity_search(question, k=3)

        # Combine context
        context = "\n\n".join([doc.page_content for doc in docs])

        # Generate response
        chain = self.prompt | self.llm
        response = chain.invoke({"context": context, "question": question})

        # Extract chain of thought between <think> and </think>
        chain_of_thought = response.content.split("<think>")[1].split("</think>")[0]

        # Extract response
        response = response.content.split("</think>")[1].strip()

        return response, chain_of_thought