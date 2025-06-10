# Uplyft Full-Stack Chatbot Assignment

## 💡 Description
An e-commerce chatbot built with React (frontend) and Flask (backend). Supports product search, JWT login, chat logging, reset, and session tracking.

## 🚀 Tech Stack
- Frontend: React + plain CSS
- Backend: Flask (Python) + PyJWT
- Auth: JWT-based login
- Data: Mock product list and in-memory chat history

## ✅ Features
- Search products with filters (`category:audio price:<50`)
- Login with JWT token
- Chatbot conversation interface
- Reset chat & track session start
- Secure API with token validation

## ▶️ How to Run

### Frontend
```bash
cd chatbot-frontend
npm install
npm start
Runs at: http://localhost:3000

### Backend
cd chatbot-backend
python -m venv venv
venv\Scripts\activate    # (Windows)
# or
source venv/bin/activate # (Mac/Linux)

pip install -r requirements.txt
python app.py
Runs at: http://127.0.0.1:5000/api/search?q=mouse

### Test Credentials
Email: demo@uplyft.com
Password: pass123

### Sample Queries
Try typing the following into the chatbot:

-mouse
-category:audio
-price:<50
-keyboard category:computing price:<100