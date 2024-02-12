import axios from "axios";
import { Request, Response } from "express";

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
    res.json(response.data);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};
