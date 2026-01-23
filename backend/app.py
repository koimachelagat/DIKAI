# ==========================
# app.py - DIKAI Backend (Fully Updated with Gemini v1beta)
# ==========================

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import sqlite3
from sentence_transformers import SentenceTransformer
import qdrant_client
from qdrant_client.http import models
import os
import google.generativeai as genai


# --------------------------
# Flask setup
# --------------------------
app = Flask(__name__)
CORS(app)
DB_NAME = "dikai_backend.db"

# --------------------------
# Gemini setup
# --------------------------
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def ask_gemini(question: str):
    """
    Sends the question to Gemini (v1beta) and returns the answer.
    Uses a supported model like 'gemini-1.5' or 'gemini-1.5-turbo'.
    """
    try:
        response = genai.chat.create(
            model="gemini-1.5",  # check with genai.list_models() if unavailable
            messages=[{"author": "user", "content": question}]
        )
        return response.choices[0].message.content
    except Exception as e:
        print("Gemini error:", e)
        return "Sorry, Gemini is not responding right now."

# --------------------------
# Vector DB setup (Qdrant)
# --------------------------
VECTOR_DIM = 384
client = qdrant_client.QdrantClient(":memory:")

if not client.collection_exists("daystar_vectors"):
    client.create_collection(
        collection_name="daystar_vectors",
        vectors_config=models.VectorParams(size=VECTOR_DIM, distance=models.Distance.COSINE)
    )

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# --------------------------
# SQLite setup
# --------------------------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            degree TEXT,
            description TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS repository (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS elearning (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    """)

    conn.commit()
    conn.close()

# --------------------------
# Health check
# --------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "OK", "service": "DIKAI Backend"})

# --------------------------
# Scraper
# --------------------------
@app.route("/api/scraper", methods=["POST"])
def scraper():
    data = request.json or {}
    scrape_type = data.get("type", "courses")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    if scrape_type == "courses":
        url = "https://www.daystar.ac.ke/programs/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        courses = soup.select(".programs-card")
        for card in courses:
            name = card.get_text(strip=True)
            cursor.execute(
                "INSERT INTO courses (name, degree, description) VALUES (?, ?, ?)",
                (name, "Degree", "Program information")
            )
            course_id = cursor.lastrowid
            vector = model.encode(name).tolist()
            client.upsert(
                collection_name="daystar_vectors",
                points=[models.PointStruct(id=course_id, vector=vector, payload={"type": "courses"})]
            )

    conn.commit()
    conn.close()
    return jsonify({"status": "OK", "scrape_type": scrape_type})

# --------------------------
# Chatbot
# --------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json or {}
    message = data.get("message", "").strip()
    language = data.get("language", "en")

    if not message:
        return jsonify({"answer": ["Please enter a question."]})

    # 1️⃣ Try vector search first
    query_vector = model.encode(message).tolist()
    try:
        results = client.search_points(
            collection_name="daystar_vectors",
            query_vector=query_vector,
            limit=3
        )
    except Exception:
        results = []

    answers = []

    if results:
        for r in results:
            point_id = r.id
            point_type = r.payload.get("type")
            conn = sqlite3.connect(DB_NAME)
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM {point_type} WHERE id=?", (point_id,))
            row = cursor.fetchone()
            conn.close()
            if row:
                answers.append(str(row[1]))
    else:
        # 2️⃣ Fallback to Gemini if no results
        gemini_answer = ask_gemini(message)
        answers.append(gemini_answer)

    # Optional: translate to Swahili
    if language == "sw":
        answers = ["Hili ni jibu la mfano kwa Swahili: " + a for a in answers]

    return jsonify({"answer": answers})

# --------------------------
# Start server
# --------------------------
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
