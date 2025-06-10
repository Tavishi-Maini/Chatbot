import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", email);
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    alert("Server error");
  }
};


  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login to Chatbot</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
