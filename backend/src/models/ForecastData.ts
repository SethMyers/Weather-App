export class ForecastData {
  date: string;
  description: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  wind: number;

  constructor(forecastItem: any) {
    this.date = forecastItem.dt_txt;
    this.description = forecastItem.weather[0].description;
    this.temp = Math.round(forecastItem.main.temp - 273.15); //convert from kelvin to celsius
    this.minTemp = Math.round(forecastItem.main.temp_min - 273.15); //convert from kelvin to celsius
    this.maxTemp = Math.round(forecastItem.main.temp_max - 273.15); //convert from kelvin to celsius
    this.wind = Math.round(forecastItem.wind.speed);
  }
}
