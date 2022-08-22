import { useEffect, useState } from 'react';
import { WeatherProps } from '../types.d';

const MountainWeather = ({ name, location }: WeatherProps) => {
  const [weather, setWeather] = useState<any>();

  const getConditions = async (location: number) => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`
    );
    const data = await response.json();
    setWeather(data);
  };
  useEffect(() => {
    getConditions(location);
  }, []);
  return (
    <div className="mountain-weather">
      <div className="background-image"></div>
      <div className="weather-content">
        <h2>{name}</h2>
        <div className="current-conditions">
          <h3>Today</h3>
          <p>{weather?.forecast.forecastday[0].day.condition.text}</p>
          <img
            src={weather?.forecast.forecastday[0].day.condition.icon}
            alt={`${weather?.forecast.forecastday[0].day.condition.text} icon`}
          />
          <p>{weather?.forecast.forecastday[0].day.avgtemp_f} °F</p>
          <p>
            Snow: {weather?.forecast.forecastday[0].day.daily_chance_of_snow}%
          </p>
          <p>
            Precip: {weather?.forecast.forecastday[0].day.totalprecip_in} in.
          </p>
        </div>
        <div className="forecast">
          <h3>Tomorrow</h3>
          <p>{weather?.forecast.forecastday[1].day.condition.text}</p>
          <img
            src={weather?.forecast.forecastday[1].day.condition.icon}
            alt={`${weather?.forecast.forecastday[1].day.condition.text} icon`}
          />
          <p>{weather?.forecast.forecastday[1].day.avgtemp_f} °F</p>
          <p>
            Snow: {weather?.forecast.forecastday[1].day.daily_chance_of_snow}%
          </p>
          <p>
            Precip: {weather?.forecast.forecastday[1].day.totalprecip_in} in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MountainWeather;
