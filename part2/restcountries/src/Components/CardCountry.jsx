import weatherService from "../service/service";
import { useState, useEffect } from "react";

const CardCountry = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const lat = country.capitalInfo?.latlng?.[0];
  const lon = country.capitalInfo?.latlng?.[1];

  useEffect(() => {
    if (!lat || !lon) return;

    weatherService.getWeather(lat, lon).then((response) => {
      setWeather(response);
    });
  }, [lat, lon]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0]}</p>
      <p>Area: {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages || {}).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={country.name.common} width="200" />

      <h2>Weather in {country.capital?.[0]}</h2>

      {weather ? (
        <div>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
};

export default CardCountry;
