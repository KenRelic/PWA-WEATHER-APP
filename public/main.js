import { fetchWeatherData, populateDataOnUI, getWeatherIcon, weatherData, currentIconID, temperature, weatherDesc, locationName, currentDate, visibility, pressure, windSpeed, humidity } from './requestAPI.js' ;
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-icon');


searchBtn.addEventListener('click', showSearchBar);
searchBar.addEventListener('blur', hideSearchBar);

function showSearchBar() {
  if (searchBar.style.width === "" || searchBar.style.width === "0px") {
    searchBar.style = `padding: 0.5em 0.5em 0.5em 1em; 
    border: 1px solid #727272b3; 
    width: 220px;`;
    searchBar.focus();
    searchBtn.removeEventListener('click', showSearchBar);
    return searchBtn.addEventListener('click', searchLocation);
  }
}

function hideSearchBar() {
  if (searchBar.style.width !== "" || searchBar.style.width !== "0px") {
    if (searchBar.value == "") {
      searchBar.style = `padding: 0; 
                        border: none; 
                        width: 0px;`;
      searchBtn.removeEventListener('click', searchLocation);
      return searchBtn.addEventListener('click', showSearchBar);
    }
  }
}

function locationToSearch() {
  const searchBar = document.getElementById('search-bar');
  if (searchBar.style.width !== "" && searchBar.style.width !== "0px") {
    if (searchBar.value !== "") {
      return searchBar.value;
    }
  }
}

async function searchLocation() {
  if (searchBar.style.width !== "" && searchBar.style.width !== "0px") {
    if (searchBar.value !== "") {
      await fetchWeatherData(locationToSearch());
      return populateDataOnUI(weatherData);
    }
  }
}