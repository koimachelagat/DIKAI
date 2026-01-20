from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup 
import sqlite3

app = Flask(__name__)
DB_NAME = 'dikai_backend.db'
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Table for courses
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            degree TEXT,
            description TEXT
        )
    ''')

    # Table for repository resources
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS repository (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    ''')

    # Table for e-learning resources
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS elearning (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT
        )
    ''')

    conn.commit()
    conn.close()

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "OK",
        "service": "DIKAI Backend"
    })

@app.route("/api/scraper", methods=["POST"])
def scraper():
    url= 'https://www.daystar.ac.ke/programs/'
    data = request.json
    message = data.get("message", "")
    language = data.get("language", "en")

    if language == "sw":
        answer = "Hili ni jibu la mfano kutoka kwa DIKAI."
    else:
        answer = "This is a sample response from DIKAI backend."

    return jsonify({
        "answer": answer
    })

if __name__ == "__main__":
    app.run(debug=True)
