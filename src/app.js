//function to update the time and date based on the location
function updateTimeDate(response) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let now = new Date(response);
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let date = now.getDate();
  let year = now.getFullYear();
  let hour = now.getHours();
  let minute = now.getMinutes();

  //moving from 24hr clock to 12hr clock
  let half = null;
  if (hour > 12) {
    hour = hour - 12;
    half = "pm";
  } else {
    half = "am";
  }

  //adding 0 in front of single digit minutes
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let weekday = document.querySelector("#current-weekday");
  weekday.innerHTML = day;

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = `${month} ${date}, ${year}`;

  let time = document.querySelector("#current-time");
  time.innerHTML = `${hour}:${minute}${half}`;
}

//function to update the current weather section based on the location's weather
function updateCurrentWeather(response) {
  //console.log(response.data);

  //updating location name
  let location = document.querySelector(".location");
  location.innerHTML = response.data.name;

  //updating weather icon
  let currentIcon = document.querySelector("#current-icon");
  currentIcon.setAttribute(
    "src",
    `src/icons/${response.data.weather[0].icon}.png`
  );
  currentIcon.setAttribute("alt", response.data.weather[0].description);

  //updating temperature value
  celsiusTemperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temp-value");
  currentTemp.innerHTML = celsiusTemperature;

  //updating weather type
  let weatherType = document.querySelector("#current-weather-type");
  weatherType.innerHTML = response.data.weather[0].main;

  //updating feels like
  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = Math.round(response.data.main.feels_like);

  //updating humidity
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;

  //updating wind, converting from meters/second to km/hr
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed * 3.6);

  //resetting the radio button selection to C
  clickFahrenheit.classList.remove("btn-secondary");
  clickFahrenheit.classList.add("btn-outline-secondary");
  clickCelsius.classList.remove("btn-outline-secondary");
  clickCelsius.classList.add("btn-secondary");

  //calling function to update time and date
  updateTimeDate(response.data.dt * 1000);

  //calling function to fetch forecast data
  getForecast(response.data.coord);
}

//function to update forecast section
function updateForecast(response) {
  let forecast = response.data.daily;

  let forecastHTML = `<!--opening forecast row--><div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 8 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<!--opening forecast column for one day-->
              <div class="col forecast-column-day">
                <div class="forecast-day">${getShortDay(forecastDay.dt)}</div>
                <div>
                  <img class="forecast-icon" src="src/icons/${
                    forecastDay.weather[0].icon
                  }.png" alt="${
          forecastDay.weather[0].description
        }" id="forecast-icon"/>
                </div>
                <div>
                  <span class="forecast-min">${Math.round(
                    forecastDay.temp.min
                  )}??C</span>
                  <span class="forecast-max">${Math.round(
                    forecastDay.temp.max
                  )}??C</span>
                </div>
                <!--closing day column-->
              </div>`;
    }
  });

  forecastHTML =
    forecastHTML +
    ` <!--closing forecast row-->
            </div>`;

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHTML;
}

//function to obtain the forecast from an API call
function getForecast(coordinates) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall?";
  let apiKey = "a825d12564855984e0e5673562cb2c52";
  let units = "metric";
  let apiUrl = `${apiEndpoint}appid=${apiKey}&units=${units}&lat=${coordinates.lat}&lon=${coordinates.lon}`;
  axios.get(apiUrl).then(updateForecast);
}

//function to return short weekday
function getShortDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];
  return day;
}

//function to find the weather of a given location
function search(newlocation) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "a825d12564855984e0e5673562cb2c52";
  let units = "metric";
  let apiUrl = `${apiEndpoint}appid=${apiKey}&units=${units}&q=${newlocation}`;
  axios.get(apiUrl).then(updateCurrentWeather);
}

//function to handle a submitted location on the form
function handleInput(event) {
  event.preventDefault();
  let newLocation = document.querySelector("#location-input");
  search(newLocation.value);
}

//function find the weather of a given lat and lon
function searchCurrent(lat, lon) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiKey = "a825d12564855984e0e5673562cb2c52";
  let units = "metric";
  let apiUrl = `${apiEndpoint}appid=${apiKey}&units=${units}&lat=${lat}&lon=${lon}`;
  axios.get(apiUrl).then(updateCurrentWeather);
}

//getting the lat and lon of current location
function handleCurrentLocation(location) {
  let lat = location.coords.latitude;
  let lon = location.coords.longitude;
  searchCurrent(lat, lon);
}

//getting the current location of the user
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handleCurrentLocation);
}

//converting temperature to Fahrenheit
function showFahrenheit(event) {
  let fahrenheitTemperature = Math.round(celsiusTemperature * (9 / 5) + 32);
  let tempElement = document.querySelector("#current-temp-value");
  tempElement.innerHTML = fahrenheitTemperature;

  let unitDisplay = document.querySelector("#current-unit");
  unitDisplay.innerHTML = "??F";

  clickFahrenheit.classList.remove("btn-outline-secondary");
  clickFahrenheit.classList.add("btn-secondary");
  clickCelsius.classList.remove("btn-secondary");
  clickCelsius.classList.add("btn-outline-secondary");
}

//converting temperature to Celsius
function showCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp-value");
  tempElement.innerHTML = celsiusTemperature;

  let unitDisplay = document.querySelector("#current-unit");
  unitDisplay.innerHTML = "??C";

  clickFahrenheit.classList.remove("btn-secondary");
  clickFahrenheit.classList.add("btn-outline-secondary");
  clickCelsius.classList.remove("btn-outline-secondary");
  clickCelsius.classList.add("btn-secondary");
}

//non-functions-------------------------------------------
let locationForm = document.querySelector("#input-form");
locationForm.addEventListener("submit", handleInput);

let currentButton = document.querySelector("#current-location");
currentButton.addEventListener("submit", getCurrentLocation);

let celsiusTemperature = null;

let clickFahrenheit = document.querySelector("#toFahrenheit");
clickFahrenheit.addEventListener("click", showFahrenheit);

let clickCelsius = document.querySelector("#toCelsius");
clickCelsius.addEventListener("click", showCelsius);

search("Ottawa");
