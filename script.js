import { key } from './api.js';

const weatherBlock = document.querySelector("#weather");
const API_KEY = key;
const suggestions = document.getElementById("suggestions");

const getCity = () => {
  const input = document.getElementById("inputField");
  input.addEventListener("input", (event) => {
    getCities(input.value);
  });
};

const getCities = async (query) => {
  suggestions.innerHTML = "";
  const data = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
  );
  const result = await data.json();

  result.forEach((el) => {
    const li = document.createElement("li");
    li.textContent = `${el.name},  ${el.country}`;
    li.setAttribute("lat", el.lat);
    li.setAttribute("lon", el.lon);
    li.classList.add("city");
    li.addEventListener("click", (e) => {
      const cityName = e.currentTarget.textContent.split(",")[0].trim();
      const countryCode = e.currentTarget.textContent.split(",")[1].trim();
      loadWeather(cityName, countryCode);
    });
    suggestions.appendChild(li);
  });
};

getCity();

const loadWeather = async (city, country) => {
  weatherBlock.innerHTML = `
    <div class='weather__loading'>
        <img src='loading.gif' height='100px' alt='loading...'>
    </div>`;

  const server = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${API_KEY}`;
  const response = await fetch(server, {
    method: "GET",
  });
  const responseResult = await response.json();

  response.ok
    ? getWeather(responseResult)
    : (weatherBlock.innerHTML = responseResult.message);
};

const getWeather = (data) => {
  const location = data.name;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherStatus = data.weather[0].main;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const template = `
        <div class="weather__header">
          <div class="weather__main">
            <div class="weather__city">${location}</div>
            <div class="weather__status">${weatherStatus}</div>
          </div>
          <div class="weather__icon">
            <img src=${iconUrl}></div>
          </div>
        </div>
        <div class="weather__temp">${temp} °C</div>
        <div class="weather__feels-like">Feels like: ${feelsLike} °C</div>
    `;

  weatherBlock.innerHTML = template;
};

if (weatherBlock) {
  loadWeather();
}
