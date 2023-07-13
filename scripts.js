const searchBtn = document.querySelector('#submit');
const searchField = document.querySelector('#search');
const FORM = document.querySelector('form');
const OUTPUT = document.querySelector('.output');
const CURRENT_CITY = document.querySelector('.current-city');
const newLine = document.createElement('br');

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
    console.log(ipData.location.city)
    console.log(ipData.ip);
    let guessLocalWeather = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${ipData.location.city}`, {mode: 'cors'});
    let response = await guessLocalWeather.json()

    renderWeather(response);
    
    
  } catch (err) {
    console.log(err);
  }
}
// checkCity(); Disable this while building - 836 requests left


searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let search = searchField.value;
  lastCity = search;
  fetchWeather(search);
  FORM.reset(); 
})

////////////

async function fetchWeather (search) {
  try {
    console.log(`${checkCity.guessData}`);
    
    const WEATHER_DATA = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${search}`, {mode: 'cors'})
    let response = await WEATHER_DATA.json()
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

function renderWeather (response) {
  // Filter the response for items I want
  let dkWeatherObj = takeSubset(response);

  // Render as needed
  CURRENT_CITY.textContent = `${dkWeatherObj.myFormat.city}`
  
  Object.entries(dkWeatherObj.myFormat).forEach((entry) => {
    if (entry[1] != ''){ // If it has a value
      
      console.log(`${entry[0]}: ${entry[1]}`)
    }
  })
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

 // OLD WAY
//  function renderWeather (response) {
//   // Filter the response for items I want
//   let dkWeatherObj = takeSubset(response);

//   // Render as needed
//   CURRENT_CITY.textContent = `${dkWeatherObj.myFormat.city}`
  
//   // let weatherReport = ul;
//   // weatherReport.innerHTML = ''; // Dump before generating
//   // let weatherData;
//   Object.entries(dkWeatherObj.myFormat).forEach((entry) => {
//     if (entry[1] != ''){ // If it has a value
      
//       console.log(`${entry[0]}: ${entry[1]}`)
      
//       // if (entry[0] == 'conditionIcon'){
//       //   let item = document.createElement('li');
//       //   item.classList = 'weather-item';
//       //   item.innerHTML = `${entry[0]}: <span><img src="https:${entry[1]}"></span>`;
//       //   console.log(item)
//       //   weatherReport.appendChild(item);
//       // } else {
//       // let item = document.createElement('li');
//       // item.classList = 'weather-item';
//       // item.textContent = `${entry[0]}: ${entry[1]}`;
//       // console.log(item)
//       // weatherReport.appendChild(item);
//       // }
//     }
//   })
//   OUTPUT.append(weatherReport);
// }