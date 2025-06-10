from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from datetime import datetime
import jwt

app = Flask(__name__)
CORS(app)

SECRET_KEY = "supersecret"  # In production, use environment variables

# Simulated users (for login)
users = {
    "demo@uplyft.com": "pass123"
}

# Mock products
products = [
    {"id": 1, "name": "Wireless Headphones", "category": "audio", "price": 59.99},
    {"id": 2, "name": "Smartphone Stand", "category": "accessories", "price": 9.99},
    {"id": 3, "name": "Bluetooth Speaker", "category": "audio", "price": 29.99},
    {"id": 4, "name": "Gaming Mouse", "category": "computing", "price": 39.99},
    {"id": 5, "name": "Mechanical Keyboard", "category": "computing", "price": 89.99}
]

# In-memory chat logs
chat_logs = {}

# ----------------------------
# Login: returns JWT token
# ----------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if users.get(email) != password:
        return make_response(jsonify({"error": "Invalid credentials"}), 401)

    token = jwt.encode({
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=1)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'token': token})

# --------------------------------------------
# Chat log route: stores chat if token is valid
# --------------------------------------------
@app.route("/api/chatlog", methods=["POST"])
def store_chat():
    auth_header = request.headers.get('Authorization', None)
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split()[1]

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        email = decoded['email']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    message = data.get("message")
    sender = data.get("sender")

    if not all([message, sender]):
        return jsonify({"error": "Missing fields"}), 400

    timestamp = datetime.now().isoformat()
    if email not in chat_logs:
        chat_logs[email] = []

    chat_logs[email].append({
        "sender": sender,
        "text": message,
        "time": timestamp
    })

    return jsonify({"status": "saved"})
@app.route("/api/chatlog/reset", methods=["POST"])
def reset_chat():
    auth_header = request.headers.get('Authorization', None)
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split()[1]

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        email = decoded['email']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    chat_logs[email] = []
    return jsonify({"status": "chat reset"})

# --------------------------------
# Product search with basic filters
# --------------------------------
@app.route("/api/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "").lower()
    results = products

    # Parse filters
    if "category:" in query:
        parts = query.split("category:")
        query = parts[0].strip()
        category = parts[1].split()[0]
        results = [p for p in results if p["category"].lower() == category.lower()]

    if "price:<" in query:
        try:
            max_price = float(query.split("price:<")[1].split()[0])
            results = [p for p in results if p["price"] < max_price]
        except:
            pass

    if query:
        results = [p for p in results if query in p["name"].lower()]

    return jsonify(results)

# -----------------
# Run the server
# -----------------
if __name__ == "__main__":
    from datetime import timedelta  # Moved here to fix import confusion
    app.run(debug=True)
