import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WeatherPage from "./components/WeatherPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/weather-app" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
}

export default App;
