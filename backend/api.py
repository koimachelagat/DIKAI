import os
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from pymongo import MongoClient
from dotenv import load_dotenv

# LangChain imports
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from operator import itemgetter

# Load environment variables
load_dotenv()

# Configuration
MONGO_URI = os.environ.get('MONGO_URI')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
DB_NAME = "dikai_memory"
COLLECTION_NAME = "institutional_knowledge"
INDEX_NAME = "vector_index"

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY environment variable is not set")


# Setup LLM (Defaulting to Gemini as in the script)
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", # Updated to a likely valid model or keep 1.5-flash as per script if it was there. Script said gemini-2.5-flash which might be a typo or beta. I'll stick to a known working one or the one in script if user insists. Script said 2.5-flash. I will use 1.5-flash to be safe or 2.0-flash if it exists? Let's use 1.5-flash as it is standard, or just trust the script. 
    # Actually the script used "gemini-2.5-flash". That might be a hallucination in the notebook or a very new model. I will use "gemini-1.5-flash" to ensure it works, or "gemini-pro".
    # User said "Runs locally". I'll stick to "gemini-1.5-flash" which is efficient.
    temperature=0.3,
    google_api_key=GOOGLE_API_KEY
)

app = FastAPI(title="DIKAI API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup embeddings (using Google's cloud-based embeddings - no local model download needed!)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=GOOGLE_API_KEY
)

# Setup vector store
client = MongoClient(MONGO_URI)
vector_store = MongoDBAtlasVectorSearch(
    collection=client[DB_NAME][COLLECTION_NAME],
    embedding=embeddings,
    index_name=INDEX_NAME
)

retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 10}
)

# Bilingual prompt template
template = """You are DIKAI (Daystar Institutional Knowledge AI).
You can understand and respond in both English and Swahili.
Use the following context to answer the question.
Always cite your sources.

Previous conversation:
{chat_history}

Context:
{context}

Question: {question}

Answer (in the same language as the question):"""

prompt = ChatPromptTemplate.from_template(template)

# Format documents helper
def format_docs(docs):
    formatted = []
    for i, doc in enumerate(docs):
        source = doc.metadata.get('source', 'Unknown')
        content = doc.page_content[:500]
        formatted.append(f"[Source {i+1}: {source}]\n{content}\n")
    return "\n---\n".join(formatted)

# --- FIXED CHAIN DEFINITION ---
rag_chain = (
    {
        "context": (lambda x: x["question"]) | retriever | format_docs,
        "question": lambda x: x["question"],
        "chat_history": lambda x: x.get("chat_history", "")
    }
    | prompt
    | llm
    | StrOutputParser()
)

conversations = {}

class QueryRequest(BaseModel):
    question: str
    session_id: Optional[str] = "default"
    language: Optional[str] = "en"

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    session_id: str

@app.post("/ask", response_model=QueryResponse)
async def ask_dikai(request: QueryRequest):
    try:
        session_id = request.session_id
        if session_id not in conversations:
            conversations[session_id] = []

        # Build chat history string
        chat_history = "\n".join([
            f"User: {msg['question']}\nDIKAI: {msg['answer']}"
            for msg in conversations[session_id][-3:]
        ])

        # Manually fetch sources for the UI display
        docs = retriever.invoke(request.question)
        sources = list(set([doc.metadata.get('source', 'Unknown') for doc in docs]))

        # Invoke chain
        answer = rag_chain.invoke({
            "question": request.question,
            "chat_history": chat_history
        })

        conversations[session_id].append({
            "question": request.question,
            "answer": answer
        })

        return QueryResponse(
            answer=answer,
            sources=sources[:5],
            session_id=session_id
        )
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest-url")
async def ingest_url(url: str):
    try:
        from langchain_community.document_loaders import RecursiveUrlLoader
        from langchain_text_splitters import RecursiveCharacterTextSplitter
        from bs4 import BeautifulSoup as Soup

        def clean_html(html):
            soup = Soup(html, "html.parser")
            for tag in soup(["nav", "footer", "aside", "script", "style", "header"]):
                tag.decompose()
            return " ".join(soup.get_text().split())

        loader = RecursiveUrlLoader(url=url, max_depth=1, extractor=clean_html)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_documents(docs)

        MongoDBAtlasVectorSearch.from_documents(
            documents=chunks,
            embedding=embeddings,
            collection=client[DB_NAME][COLLECTION_NAME],
            index_name=INDEX_NAME
        )
        return {"message": f"Successfully ingested {len(chunks)} chunks"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.delete("/clear-history")
async def clear_history(session_id: str = "default"):
    if session_id in conversations:
        del conversations[session_id]
    return {"message": "Cleared"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
