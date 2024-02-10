import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  id: number;
  username: string;
  password: string;
}

const USERS: User[] = [
  { id: 1, username: "SethMyers", password: "test-password" },
];

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const isAuthenticated = USERS.some(
      (u) => u.username === username && u.password === password
    );

    if (isAuthenticated) {
      try {
        const response = await axios.post(`http://localhost:3001/login`, {
          username,
          password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        navigate("/weather-app");
      } catch (error) {
        alert("Invalid credentials");
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <header>
        <h1>Weather Login</h1>
      </header>
      <div>
        <p>Username:</p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p>Password:</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Log in</button>
    </div>
  );
};

export default LoginPage;
