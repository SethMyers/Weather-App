import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import axios from "axios";

interface User {
  id: number;
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`/login`, {
        username,
        password,
      });
      authService.setToken(response.data.token);
      navigate("/weather-app");
    } catch (error) {
      setError("Invalid credentials. Please try again.");
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
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default LoginPage;
