import { fetchWeatherData, populateDataOnUI, getWeatherIcon, weatherData,showLoader, hideLoader, currentIconID, temperature, weatherDesc, locationName, currentDate, visibility, pressure, windSpeed, humidity } from './requestAPI.js';
const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-icon');
const noNetworkModal = document.getElementById('no-network-modal');
const closeModal = document.getElementById('close-modal-btn');


searchBtn.addEventListener('click', showSearchBar);
searchBar.addEventListener('blur', hideSearchBar);
closeModal.addEventListener('click',closeNetworkErrorModal);

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
  let widthInNumber =  Number((searchBar.style.width).replace('px',''));
  if (searchBar.style.width !== "" && searchBar.style.width !== "0px" && widthInNumber < 300) {
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
      showLoader();
      if (navigator.onLine) {
        await fetchWeatherData(locationToSearch());
        hideLoader();
        return populateDataOnUI(weatherData);
      }
      return setTimeout(isOffline,3000)
       
    }
  }
}
searchBar.addEventListener("keypress", submitSearchOnEnterKeypress)
function submitSearchOnEnterKeypress(event) {
  var x = event.which || event.keyCode;
  console.log(x)
  if (x === 13) searchLocation();
}


//show NO-NEWTORK MESSAGE
function isOffline(){ 
  searchBar.value = "";
  hideSearchBar();
  hideLoader();
   //show NO NETWORK MODAL
   noNetworkModal.style.left = '0';
  }

  function closeNetworkErrorModal(){
    noNetworkModal.style.left = '101vw';
  }

  export {isOffline}

