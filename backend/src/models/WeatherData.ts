export class WeatherData {
  main: string;
  description: string;
  temp: number;
  wind: number;

  constructor(weather: any, main: any, wind: any) {
    this.main = weather.main;
    this.description = weather.description;
    this.temp = Math.round(main.temp - 273.15); //convert from kelvin to celsius
    this.wind = Math.round(wind.speed);
  }
}
