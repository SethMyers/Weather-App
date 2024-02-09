import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WeatherApp from "./components/WeatherApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/weather-app" element={<WeatherApp />} />
      </Routes>
    </Router>
  );
}

export default App;
