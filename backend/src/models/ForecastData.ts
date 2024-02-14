export class ForecastData {
  date: string;
  description: string;
  temp: number;
  minTemp: number;
  maxTemp: number;
  wind: number;

  constructor(forecastItem: any) {
    this.date = formatDateTime(forecastItem.dt_txt);
    this.description = forecastItem.weather[0].description;
    this.temp = Math.round(forecastItem.main.temp - 273.15); // convert from kelvin to celsius
    this.minTemp = parseFloat((forecastItem.main.temp_min - 273.15).toFixed(2)); // convert from kelvin to celsius, round to two decimals
    this.maxTemp = parseFloat((forecastItem.main.temp_max - 273.15).toFixed(2)); // convert from kelvin to celsius, round to two decimals
    this.wind = Math.round(forecastItem.wind.speed);
  }
}

function formatDateTime(input: string): string {
  const date = new Date(input);
  const formattedDate = date
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    })
    .split(" ");
  const formattedTime = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    })
    .replace(" ", "");

  return `${formattedDate[1]} ${formattedDate[0]} ${formattedTime}`;
}
