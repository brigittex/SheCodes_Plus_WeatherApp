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

function showCurrentWeather(response) {
  console.log(response.data);

  //updating location name
  let location = document.querySelector(".location");
  location.innerHTML = response.data.name;

  //matching weather icon with emoji
  let icon = response.data.weather[0].icon;
  let emoji = "🌞;";
  if (icon === "01d") {
    emoji = "☀";
  } else if (icon === "02d") {
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

  //updating weather emoji
  let currentEmoji = document.querySelector("#current-emoji");
  currentEmoji.innerHTML = emoji;

  //updating weather icon

  //let currentIcon = document.querySelector("#current-icon");
  //currentIcon.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  //currentIcon.setAttribute("alt", response.data.weather[0].description);

  //updating temperature value
  let currentTemp = document.querySelector("#current-temp-value");
  currentTemp.innerHTML = Math.round(response.data.main.temp);

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

let city = "Ottawa";

let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
let apiKey = "a825d12564855984e0e5673562cb2c52";
let units = "metric";

let apiUrl = `${apiEndpoint}appid=${apiKey}&units=${units}&q=${city}`;
axios.get(apiUrl).then(showCurrentWeather);
