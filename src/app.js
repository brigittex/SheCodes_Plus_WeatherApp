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

//function to match weather icon with emoji
function updateEmoji(icon) {
  let emoji = "🌞";
  if (icon === "01d") {
    emoji = "☀";
  } else if (icon === "01n") {
    emoji = "🌑";
  } else if (icon === "02d") {
    emoji = "🌤";
  } else if (
    (icon === "02n") |
    (icon === "03d") |
    (icon === "03n") |
    (icon === "04d") |
    (icon === "04n")
  ) {
    emoji = "☁";
  } else if ((icon === "09d") | (icon === "09n") | (icon === "10n")) {
    emoji = "🌧";
  } else if (icon === "10d") {
    emoji = "🌦";
  } else if ((icon === "11d") | (icon === "11n")) {
    emoji = "🌩";
  } else if ((icon === "13d") | (icon === "13n")) {
    emoji = "❄";
  } else if ((icon === "50d") | (icon === "50n")) {
    emoji = "🌫";
  }
  return emoji;
}

//function to update the current weather section based on the location's weather
function updateCurrentWeather(response) {
  //console.log(response.data);

  //updating location name
  let location = document.querySelector(".location");
  location.innerHTML = response.data.name;

  //updating weather emoji
  let emoji = updateEmoji(response.data.weather[0].icon);
  let currentEmoji = document.querySelector("#current-emoji");
  currentEmoji.innerHTML = emoji;

  //updating weather icon
  //let currentIcon = document.querySelector("#current-icon");
  //currentIcon.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  //currentIcon.setAttribute("alt", response.data.weather[0].description);

  //updating temperature value
  celsiusTemperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temp-value");
  currentTemp.innerHTML = celsiusTemperature;

  //updating weather type
  let weatherType = document.querySelector("#current-weather-type");
  weatherType.innerHTML = response.data.weather[0].main;

  //updating humidity
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;

  //updating wind
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);

  //calling function to update time and date
  updateTimeDate(response.data.dt * 1000);
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

  clickFahrenheit.classList.remove("btn-outline-primary");
  clickFahrenheit.classList.add("btn-primary");
  clickCelsius.classList.remove("btn-primary");
  clickCelsius.classList.add("btn-outline-primary");
}

//converting temperature to Celsius
function showCelsius(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp-value");
  tempElement.innerHTML = celsiusTemperature;

  clickFahrenheit.classList.remove("btn-primary");
  clickFahrenheit.classList.add("btn-outline-primary");
  clickCelsius.classList.remove("btn-outline-primary");
  clickCelsius.classList.add("btn-primary");
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
