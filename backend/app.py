# ==========================
# app.py - DIKAI Backend
# ==========================

from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import sqlite3
from sentence_transformers import SentenceTransformer
import qdrant_client
from qdrant_client.http import models
import google.generativeai as genai

# --------------------------
# Flask setup
# --------------------------
app = Flask(__name__)
DB_NAME = "dikai_backend.db"

# --------------------------
# Gemini setup
# --------------------------
genai.configure(api_key="AIzaSyCwsQWomJlBQZFMPb1m3C4TFiJYW1FlQ9Q")
gemini_model = genai.GenerativeModel("gemini-pro")

# --------------------------
# Vector DB setup (Qdrant)
# --------------------------
VECTOR_DIM = 384
client = qdrant_client.QdrantClient(":memory:")  # in-memory for local dev
client.recreate_collection(
    collection_name="daystar_vectors",
    vectors_config=models.VectorParams(size=VECTOR_DIM, distance=models.Distance.COSINE)
)

# Load embedding model (SentenceTransformers)
model = SentenceTransformer("all-MiniLM-L6-v2")  # lightweight and fast

# --------------------------
# SQLite setup
# --------------------------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Courses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            degree TEXT,
            description TEXT
        )
    ''')

    # Repository table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS repository (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    ''')

    # Elearning table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS elearning (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    ''')

    conn.commit()
    conn.close()

# --------------------------
# Health check
# --------------------------
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "OK", "service": "DIKAI Backend"})

# --------------------------
# Scraper route
# --------------------------
@app.route("/scraper", methods=["POST"])
def scraper():
    data = request.json
    scrape_type = data.get("type", "courses")

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    if scrape_type == "courses":
        url = "https://www.daystar.ac.ke/programs/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        courses = soup.select(".programs-card")
        for card in courses:
            name = card.select_one(".program-name").text.strip()
            degree = card.select_one(".program-degree").text.strip()
            description = card.select_one(".program-description").text.strip()

            cursor.execute(
                "INSERT INTO courses (name, degree, description) VALUES (?, ?, ?)",
                (name, degree, description)
            )
            course_id = cursor.lastrowid

            vector = model.encode(f"{name} {degree} {description}").tolist()

            client.upsert(
                collection_name="daystar_vectors",
                points=[models.PointStruct(
                    id=course_id,
                    vector=vector,
                    payload={"type": "courses"}
                )]
            )

    elif scrape_type == "repository":
        url = "https://www.daystar.ac.ke/repository/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        resources = soup.select(".resource-card")
        for r in resources:
            title = r.select_one(".resource-title").text.strip()
            link = r.select_one("a")["href"]

            cursor.execute(
                "INSERT INTO repository (title, link) VALUES (?, ?)",
                (title, link)
            )
            resource_id = cursor.lastrowid

            vector = model.encode(title).tolist()
            client.upsert(
                collection_name="daystar_vectors",
                points=[models.PointStruct(
                    id=resource_id,
                    vector=vector,
                    payload={"type": "repository"}
                )]
            )

    elif scrape_type == "elearning":
        url = "https://elearning.daystar.ac.ke/"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        courses = soup.select(".elearning-card")
        for e in courses:
            title = e.select_one(".elearning-title").text.strip()
            link = e.select_one("a")["href"]

            cursor.execute(
                "INSERT INTO elearning (title, link) VALUES (?, ?)",
                (title, link)
            )
            elearning_id = cursor.lastrowid

            vector = model.encode(title).tolist()
            client.upsert(
                collection_name="daystar_vectors",
                points=[models.PointStruct(
                    id=elearning_id,
                    vector=vector,
                    payload={"type": "elearning"}
                )]
            )

    conn.commit()
    conn.close()

    return jsonify({"status": "OK", "scrape_type": scrape_type})

# --------------------------
# Chatbot route
# --------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    # Convert message to vector
    query_vector = model.encode(message).tolist()

    # Search top 5 closest points in Qdrant
    try:
        results = client.search_points(
            collection_name="daystar_vectors",
            query_vector=query_vector,
            limit=5
        )
    except Exception as e:
        return jsonify({"error": f"Vector search failed: {str(e)}"}), 500

    # Retrieve info from SQLite
    answers = []
    for r in results:
        point_id = r.id
        point_type = r.payload.get("type", "")

        try:
            conn = sqlite3.connect(DB_NAME)
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM {point_type} WHERE id=?", (point_id,))
            row = cursor.fetchone()
            conn.close()
        except Exception:
            continue

        if row:
            if point_type == "courses":
                answers.append(f"{row[1]} ({row[2]}): {row[3]}")
            else:
                answers.append(f"{row[1]} -> {row[2]}")

    if not answers:
        return jsonify({"answer": "Sorry, I could not find relevant information for your question."})

    # Send context to Gemini
    context = "\n".join(answers)
    prompt = f"""
You are a helpful university assistant chatbot.
Answer the user's question clearly using the context below.

Context:
{context}

Question:
{message}
"""
    try:
        response = gemini_model.generate_content(prompt)
        answer_text = response.text
    except Exception as e:
        return jsonify({"error": f"Gemini response failed: {str(e)}"}), 500

    return jsonify({"answer": answer_text})

# --------------------------
# Start server
# --------------------------
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
