import { useEffect, useState } from 'react';
import { WeatherData, WeatherProps } from '../types.d';

const MountainWeather = ({ name, location, completeLoading }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherData>();
  const [content, setContent] = useState<boolean>(false);

  const getConditions = async (location: number) => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_KEY}=${location}&days=2&aqi=no&alerts=no`
    );
    const data = await response.json();
    setWeather({
      today: {
        condition: data.forecast.forecastday[0].day.condition.text,
        icon: data.forecast.forecastday[0].day.condition.icon,
        avgtemp_f: data.forecast.forecastday[0].day.avgtemp_f,
        daily_chance_of_snow:
          data.forecast.forecastday[0].day.daily_chance_of_snow,
        totalprecip_in: data.forecast.forecastday[0].day.totalprecip_in,
      },
      tomorrow: {
        condition: data.forecast.forecastday[1].day.condition.text,
        icon: data.forecast.forecastday[1].day.condition.icon,
        avgtemp_f: data.forecast.forecastday[1].day.avgtemp_f,
        daily_chance_of_snow:
          data.forecast.forecastday[1].day.daily_chance_of_snow,
        totalprecip_in: data.forecast.forecastday[1].day.totalprecip_in,
      },
    });
    setContent(true);
    completeLoading();
  };

  useEffect(() => {
    getConditions(location);
  }, [location]);

  return (
    <div id={name} className="mountain-weather">
      {content && (
        <div className="weather-content">
          <h2>{name}</h2>
          <div className="current-conditions">
            <h3>Today</h3>
            <p>{weather?.today.condition}</p>
            <img
              src={weather?.today.icon}
              alt={`${weather?.today.condition} icon`}
            />
            <p>{weather?.today.avgtemp_f} °F</p>
            <p>Snow: {weather?.today.daily_chance_of_snow}%</p>
            <p>Precip: {weather?.today.totalprecip_in} in.</p>
          </div>
          <div className="forecast">
            <h3>Tomorrow</h3>
            <p>{weather?.tomorrow.condition}</p>
            <img
              src={weather?.tomorrow.icon}
              alt={`${weather?.tomorrow.condition} icon`}
            />
            <p>{weather?.tomorrow.avgtemp_f} °F</p>
            <p>Snow: {weather?.tomorrow.daily_chance_of_snow}%</p>
            <p>Precip: {weather?.tomorrow.totalprecip_in} in.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MountainWeather;
