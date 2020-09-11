import { isOffline } from './main.js'

let weatherData;
let temperature = document.getElementById('temp');
let weatherDesc = document.getElementById('weather-condition');
let locationName = document.getElementById('location');
let currentDate = document.getElementById('current-date');

let visibility = document.getElementById('visibility');
let pressure = document.getElementById('pressure');
let windSpeed = document.getElementById('wind-speed');
let humidity = document.getElementById('humidity');
const loaderModal = document.getElementById('loader-modal');

let currentIconID = localStorage.getItem('currentIconID') || '';

async function fetchWeatherData(loc) {
  if (navigator.onLine) {
    try {
      let location = loc || 'new york';
      weatherData = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=1500cd5e25510340226c26e15c6f062c`)).json();

      weatherData.cod === 200 ? localStorage.setItem("weatherData", JSON.stringify(weatherData)) : '';
      return weatherData;
    } catch (error) {
      //show data not found due to netwrk error or network timeout            
      return console.log(error)
    }
  }
  return isOffline();
}

//populate UI
function populateDataOnUI(data) {
  let previousWeatherID = currentIconID;
  //hide old weather icon
  if (previousWeatherID) document.getElementById(previousWeatherID).style.display = "none";
  //new current weather icon 
  currentIconID = data.cod === 200 ? getWeatherIcon(data.weather[0].id, data.weather[0].icon, weatherTime) : 'no-icon';
  // show new icon on the UI
  document.getElementById(currentIconID).style.display = "block";

  localStorage.setItem("currentIconID", currentIconID);


  temperature.innerHTML = data.cod === 200 ? Math.round(data.main.temp - 273.15) : '0';
  weatherDesc.innerHTML = data.cod === 200 ? (data.weather[0].description).toUpperCase() : 'NO DATA';
  locationName.innerHTML = data.cod === 200 ? (data.name + ', ' + data.sys.country).toUpperCase() : 'NOT FOUND';
  currentDate.innerHTML = data.cod === 200 ? new Date(data.dt * 1000).toDateString() : new Date().toDateString();
  visibility.innerHTML = data.cod === 200 ? (data.visibility / 1000) + 'km' : '-';
  pressure.innerHTML = data.cod === 200 ? data.main.pressure + 'hPa' : '-';
  windSpeed.innerHTML = data.cod === 200 ? data.wind.speed + 'm/s' : '-';
  humidity.innerHTML = data.cod === 200 ? data.main.humidity + '%' : '-';

  hideLoader();
  function weatherTime(iconId) {
    return iconId.endsWith('d') ? '' : '-night';
  }
}

function getWeatherIcon(weatherId, iconId, dayOrNight) {
  if (weatherId >= 200 && weatherId <= 202) {
    return 'mix-rainfall' + dayOrNight(iconId);
  } else if (weatherId >= 210 && weatherId <= 211) {
    return 'scattered-thunderstorm' + dayOrNight(iconId);
  } else if (weatherId >= 212 && weatherId <= 221) {
    return 'heavy-thunderstorm' + dayOrNight(iconId);
  } else if (weatherId >= 230 && weatherId <= 232) {
    return 'mix-rainfall' + dayOrNight(iconId);
  } else if (weatherId >= 300 && weatherId <= 321) {
    return 'drizzle' + dayOrNight(iconId);
  } else if (weatherId >= 500 && weatherId <= 501) {
    return 'scattered-showers' + dayOrNight(iconId);
  } else if (weatherId >= 502 && weatherId <= 504) {
    return 'heavy-rainfall' + dayOrNight(iconId);
  } else if (weatherId >= 511 && weatherId <= 521) {
    return 'rain' + dayOrNight(iconId);
  } else if (weatherId >= 522 && weatherId <= 531) {
    return 'heavy-rainfall' + dayOrNight(iconId);
  } else if (weatherId === 600) {
    return 'breezy-snow';
  } else if (weatherId === 601) {
    return 'snow' + dayOrNight(iconId);
  } else if (weatherId === 602) {
    return 'hail' + dayOrNight(iconId);
  } else if (weatherId >= 611 && weatherId <= 616) {
    return 'sleet' + dayOrNight(iconId);
  } else if (weatherId >= 621 && weatherId <= 622) {
    return 'blizzard' + dayOrNight(iconId);
  } else if (weatherId === 701 || weatherId === 741) {
    return 'fog';
  } else if (weatherId === 711) {
    return 'smoke';
  } else if (weatherId === 721) {
    return 'haze';
  } else if (weatherId === 731 || weatherId === 751 || weatherId === 771) {
    return 'dust';
  } else if (weatherId === 762 || weatherId === 781) {
    return 'tornado';
  } else if (weatherId === 800) {
    if (iconId.endsWith('d')) {
      return 'mostly-sunny';
    }
    return 'clear-night';
  } else if (weatherId >= 801 && weatherId <= 802) {
    return 'partly-cloudy' + dayOrNight(iconId);
  } else if (weatherId >= 803 && weatherId <= 804) {
    return 'mostly-cloudy' + dayOrNight(iconId);
  } else {
    //return missing icon image ( could be a cloud with x)
  }
}

window.onload = async function () {
  if (localStorage.getItem('weatherData')) {
    return await fetchDataFromLocalStorage()
  } else {
    if (navigator.onLine) {
      showLoader();
      await fetchWeatherData();
      return populateDataOnUI(weatherData);
    }
  }
}

async function fetchDataFromLocalStorage() {
  showLoader();
  let retrievedData = JSON.parse(localStorage.getItem('weatherData'));
  if (navigator.onLine) {
    await fetchWeatherData(`${retrievedData.name},${retrievedData.sys.country}`);
    return populateDataOnUI(weatherData);
  }
  return populateDataOnUI(retrievedData);
}

function showLoader() {
  loaderModal.style.display = 'flex';
}
function hideLoader() {
  setTimeout(() => { loaderModal.style.display = 'none' }, 1000);
}
export { fetchWeatherData, populateDataOnUI, getWeatherIcon, fetchDataFromLocalStorage, showLoader, hideLoader, weatherData, currentIconID, temperature, weatherDesc, locationName, currentDate, visibility, pressure, windSpeed, humidity }