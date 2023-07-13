const BODY = document.querySelector('body');
const searchBtn = document.querySelector('#submit');
const searchField = document.querySelector('#search');
const FORM = document.querySelector('form');
const OUTPUT = document.querySelector('.output');
const CURRENT_CITY = document.querySelector('.current-city');
const newLine = document.createElement('br');
const CURRENT_WEATHER_TITLE = document.querySelector('.current-weather-title');
const WEATHER_ICON = document.querySelector('.weather-icon');

const LOCAL_TIME = document.querySelector('.local-time');
const UV = document.querySelector('.uv-index > .metric-data');
const CURRENT_TEMP = document.querySelector('.current-temp > .metric-data');
const FEELS_LIKE = document.querySelector('.feels-like > .metric-data');
const WIND_SPEED = document.querySelector('.wind-speed > .metric-data');
const HUMIDITY = document.querySelector('.humidity > .metric-data');


const h2 = document.createElement('h2');
const div = document.createElement('div');
const p = document.createElement('p');
const span = document.createElement('span');
const ul = document.createElement('ul');
const li = document.createElement('li');

let lastCity;

async function checkCity () {
  try { 
    let ipResponse = await fetch("https://geo.ipify.org/api/v2/country,city?apiKey=at_DYz26g8fZ1f0JCkR3fPch5oYXO730")
    let ipData = await ipResponse.json();
    let cityToQuery = ipData.location.city.normalize()
    let guessLocalWeather = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${cityToQuery}`, {mode: 'cors'});
    let response = await guessLocalWeather.json()

    renderWeather(response);
    
    
  } catch (err) {
    console.log(err);
  }
}
checkCity(); // Disable this while building - 836 requests left


searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let search = searchField.value;
  lastCity = search;
  if (FORM.checkValidity()){   
    fetchWeather(search);
    FORM.reset(); 
  } else {
    FORM.reportValidity();
  }
})

////////////

async function fetchWeather (search) {
  try {
    
    const WEATHER_DATA = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${search}`, {mode: 'cors'})
    let response = await WEATHER_DATA.json()
    console.log(response);
    lastCity = response.location.name;
    CURRENT_CITY.textContent = `${lastCity}`;

    renderWeather(response);

    
    } catch (err) {
      handleError(err);
  }   
}

 /* ====================  \
|   HOISTED DECLARATIONS   |
 \  ==================== */

function renderWeather (response) {
  // Filter the response for items I want
  let dkWeatherObj = takeSubset(response);

  // Render as needed
  CURRENT_CITY.textContent = `${dkWeatherObj.myFormat.city}`
  WEATHER_ICON.innerHTML = `
  <img src="https:${dkWeatherObj.myFormat.conditionIcon}">
  `
  WEATHER_ICON.setAttribute('alt', `${dkWeatherObj.myFormat.conditionText}`);
  WEATHER_ICON.setAttribute('title', `${dkWeatherObj.myFormat.conditionText}`);
  setBackgroundImage(dkWeatherObj);

  LOCAL_TIME.textContent = `${dkWeatherObj.myFormat.localTime}`;
  UV.textContent = `${dkWeatherObj.myFormat.uv} / 13`;
  CURRENT_TEMP.textContent = `${dkWeatherObj.myFormat.currentTemp} °C`;
  FEELS_LIKE.textContent = `${dkWeatherObj.myFormat.feelsLike} °C`;
  WIND_SPEED.textContent = `${dkWeatherObj.myFormat.windKph} kph`;
  HUMIDITY.textContent = `${dkWeatherObj.myFormat.humidity} %`;
  
  // Object.entries(dkWeatherObj.myFormat).forEach((entry) => {
  //   if (entry[1] != ''){ // If it has a value
      
  //     console.log(`${entry[0]}: ${entry[1]}`)
  //   }
  // })
}

function setBackgroundImage (dkWeatherObj) {
  outer:
  if (dkWeatherObj.myFormat.isDay == 0){
    BODY.style.backgroundImage = 'var(--background-night';
  } else if (dkWeatherObj.myFormat.conditionText.toLowerCase().includes('snow')){
    BODY.style.backgroundImage = 'var(--background-snow)';
  } else if (dkWeatherObj.myFormat.conditionText.toLowerCase().includes('clear')){
    BODY.style.backgroundImage = 'var(--background-sunny)';
  } else if (dkWeatherObj.myFormat.conditionText.toLowerCase().includes('sunny')){
    BODY.style.backgroundImage = 'var(--background-sunny)';
  } else if (dkWeatherObj.myFormat.conditionText.toLowerCase().includes('cloud') ||
  dkWeatherObj.myFormat.conditionText.toLowerCase() == 'overcast') {
    BODY.style.backgroundImage = 'var(--background-cloudy)';
  } else if (dkWeatherObj.myFormat.conditionText.toLowerCase().includes('rain')) {
    BODY.style.backgroundImage = 'var(--background-rain)';
  } else {

  };
};


class subSet {
  constructor (city, region, country, localTime, currentTemp, feelsLike, isDay, conditionText, conditionIconPath, cloudCoverage, windKph, precipMm, humidity, uv){
    // location info
    this.city = city;
    this.region = region;
    this.country = country;
    this.localTime = localTime.slice(-5);
    // current weather
    this.currentTemp = currentTemp;
    this.feelsLike = feelsLike;
    this.isDay = isDay;
    this.conditionText = conditionText;
    this.conditionIcon = conditionIconPath;
    this.cloudCoverage = cloudCoverage
    this.windKph = windKph;
    this.precipMm = precipMm;
    this.humidity = humidity;
    this.uv = uv;
  }
}

// Process data
function takeSubset (response) {

  let myFormat = new subSet(
    // location.
    response.location.name,
    response.location.region,
    response.location.country, 
    response.location.localtime,
    // current
    response.current.temp_c,
    response.current.feelslike_c,
    response.current.is_day,
    response.current.condition.text,
    response.current.condition.icon,
    response.current.cloud,
    response.current.wind_kph,
    response.current.precip_mm,
    response.current.humidity,
    response.current.uv
    );

    return { myFormat };
}


// make a safe function with a HOF
function makeSafe(fn, errorHandler) {
  return function() {
    fn().catch(errorHandler);
  }
}

// Credit Wes Bos
function handleError(err) {
  console.log('Ohhhh nooo');
  console.log(err);
  // end of credit :')
  if (response.error.message){
    console.log(response.error.message);
  }
}

 /* ===================== \
| END HOISTED DECLARATIONS |
 \  ==================== */