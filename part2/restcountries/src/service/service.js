import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

const getAllCountries = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data);
};

const getWeather = (lat, lon) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );
  return request.then((response) => response.data);
};

export default { getAllCountries, getWeather };
