import axios from "axios";
import { Request, Response } from "express";
import { WeatherData } from "./models/WeatherData";
import { ForecastData } from "./models/ForecastData";

export const getWeatherData = async (
  endpoint: string,
  req: Request,
  res: Response
) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/${endpoint}?id=${req.params.cityId}&appid=${apiKey}`
    );

    if (endpoint === "weather") {
      const weatherData = new WeatherData(
        response.data.weather[0],
        response.data.main,
        response.data.wind
      );
      res.json(weatherData);
    } else if (endpoint === "forecast") {
      const forecastDataList = response.data.list.map(
        (item: any) => new ForecastData(item)
      );
      res.json(forecastDataList);
    } else {
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      res.status(error.response.status).send(error.response.data.message);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};
