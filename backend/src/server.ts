import axios from 'axios';
import express from 'express';
import { Request, Response } from 'express';

require('dotenv').config({ path: "./backend/.env" });
const app = express();
const port =   3001;

const getWeatherData = async (endpoint: string, req: Request, res: Response) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/${endpoint}?id=${req.params.cityId}&appid=${apiKey}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('An error occurred');
  }
};

app.get('/weather/:cityId', (req: Request, res: Response) => getWeatherData('weather', req, res));
app.get('/forecast/:cityId', (req: Request, res: Response) => getWeatherData('forecast', req, res));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});