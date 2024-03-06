import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import axios from "axios";
import "./WeatherPage.css";

interface City {
  id: number;
  name: string;
  country: string;
}

const CITIES: City[] = [
  { id: 6167865, name: "Toronto", country: "CA" },
  { id: 6094817, name: "Ottawa", country: "CA" },
  { id: 1850147, name: "Tokyo", country: "JP" },
];

const WeatherPage: React.FC = () => {
  // State initialization
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [showForecast, setShowForecast] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);
  const [selectedDateButton, setSelectedDateButton] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = authService.getToken();

  const handleLogout = () => {
    authService.setToken("");
    navigate("/"); // Redirect to the login page
  };

  // Automatically log out if token is cleared
  useEffect(() => {
    if (!token) {
      handleLogout();
    }
  }, [token]);

  async function weatherDataResponse(selectedCity: City) {
    try {
      // Fetch weather data
      setLoading(true);
      const weatherResponse = await axios.get(`/weather/${selectedCity.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWeatherData(weatherResponse.data);

      if (showForecast) {
        // Fetch detailed forecast data
        setLoading(true);
        const forecastResponse = await axios.get(
          `/forecast/${selectedCity.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setForecastData(forecastResponse.data);
      }
    } catch (error) {
      console.error(error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  }

  // Set city weather data if a city is selected
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      if (selectedCity) {
        weatherDataResponse(selectedCity);
      }
    };

    fetchData();
  }, [selectedCity, showForecast]);

  // Set dates if forecast data exists
  useEffect(() => {
    if (forecastData.length > 0) {
      const dates = [
        ...new Set(
          forecastData.map((item) => {
            const dateParts = item.date.split(" ");
            return `${dateParts[0]} ${dateParts[1]}`;
          })
        ),
      ];

      setUniqueDates(dates);
      setSelectedDate(dates[selectedDateButton]); // Auto-select the earliest date, remember date selection afterwards
    }
  }, [forecastData]);

  // Set selected city when city is selected
  const handleCitySelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = event.target.value;
    const city = CITIES.find((c) => c.name === cityName) || null;

    setSelectedCity(city);
    setLoading(true);
  };

  // Set detailed forecast data if show forecast is clicked and a city is selected, and hide it if its already selected
  const handleForecastClick = () => {
    setShowForecast(!showForecast);
  };

  // Set current date selection if a different date is clicked
  const handleDateClick = (date: string, index: number) => {
    setSelectedDate(date);
    setSelectedDateButton(index);
  };

  // Forecast data for current date
  const filteredForecastData = forecastData.filter((item) => {
    const dateParts = item.date.split(" ");
    return `${dateParts[0]} ${dateParts[1]}` === selectedDate;
  });

  return (
    <div className="page-container">
      <header>
        <h1>Weather Forecast</h1>
      </header>
      {selectedCity && <div className="cityLabel">City</div>}
      <select value={selectedCity?.name || ""} onChange={handleCitySelection}>
        <option value="" disabled>
          Select City
        </option>
        {CITIES.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}, {city.country}
          </option>
        ))}
      </select>
      {weatherData && (
        <div>
          <h2>{weatherData.main}</h2>
          <p>{weatherData.description}</p>
          <h2>{weatherData.temp} °C</h2>
          <p>Wind {weatherData.wind} m/s</p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {!loading && !error && selectedCity && (
        <>
          {/* Render the "See Forecast" button */}
          <button onClick={handleForecastClick}>
            {showForecast ? "Close" : "See Forecast"}
          </button>
          {/* Render the forecast table if showForecast is true */}
          {showForecast && (
            <div>
              <table className="forecast-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Temp</th>
                    <th>Min Temp</th>
                    <th>Max Temp</th>
                    <th>Wind</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForecastData.map((forecast, index) => (
                    <tr key={index}>
                      <td>{forecast.date}</td>
                      <td>{forecast.temp} °C</td>
                      <td>{forecast.minTemp} °C</td>
                      <td>{forecast.maxTemp} °C</td>
                      <td>{forecast.wind} m/s</td>
                      <td>{forecast.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Render buttons for day selection */}
              {uniqueDates.map((date, index) => (
                <button
                  key={index}
                  className={`date-button ${
                    selectedDateButton === index ? "selected-button" : ""
                  }`}
                  onClick={() => handleDateClick(date, index)}
                >
                  {date}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default WeatherPage;
