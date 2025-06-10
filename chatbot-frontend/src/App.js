import React, { useState } from 'react';
import './App.css';

function App() {
  const [sessionStart, setSessionStart] = useState(() => new Date().toLocaleString());
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! You can search by name or try filters like:\ncategory:audio price:<50' }
  ]);
  const [input, setInput] = useState('');

  const logMessage = async (text, sender) => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/chatlog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: text, sender }),
    });
  };

  const resetChat = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5000/api/chatlog/reset", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    setMessages([
      { type: 'bot', text: 'Chat has been reset. How can I help you now?' }
    ]);
    setSessionStart(new Date().toLocaleString());
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    logMessage(input, 'user');

    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(input)}`);
      const data = await response.json();

      let botReply = 'Sorry, no products found.';
      if (data.length > 0) {
        botReply = `Here are some results:\n` + data.map(p => `• ${p.name} - $${p.price}`).join('\n');
      }

      setMessages(prev => [...prev, { type: 'bot', text: botReply }]);
      logMessage(botReply, 'bot');

    } catch (error) {
      const err = 'Error connecting to server.';
      setMessages(prev => [...prev, { type: 'bot', text: err }]);
      logMessage(err, 'bot');
    }

    setInput('');
  };

  return (
    <div className="chat-container">
      <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
        Session started at: {sessionStart}
      </p>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {msg.text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))}
      </div>

      <div className="input-area">
        <button onClick={resetChat} style={{ marginRight: "10px" }}>
          Reset Chat
        </button>

        <input
          type="text"
          placeholder="Search for a product..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
