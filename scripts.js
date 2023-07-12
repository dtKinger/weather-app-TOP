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
    const WEATHER_DATA = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${search}`, {mode: 'cors'})
    let response = await WEATHER_DATA.json()
    lastCity = response.location.name;
    CURRENT_CITY.textContent = `${lastCity}`;

    // Filter the response for items I want
    let dkWeatherObj = takeSubset(response);
    // Render as needed
    CURRENT_CITY.textContent = `${dkWeatherObj.myFormat.city}`
    OUTPUT.innerHTML = ''; // Dump before generating
    
    // for (const key in dkWeatherObj.myFormat) {
    //   if (dkWeatherObj.myFormat.hasOwnProperty(key)){
    //     console.log(`${key}: ${dkWeatherObj.myFormat[key]}`)
    //   }
    // }
    
    let weatherReport = ul;
    let weatherData;
    Object.entries(dkWeatherObj.myFormat).forEach((entry) => {
      let item = document.createElement('li');
      item.classList = 'weather-item';
      item.textContent = `${entry[0]}: ${entry[1]}`;
      console.log(item)
      weatherReport.appendChild(item);
    })
    OUTPUT.append(weatherReport);
    
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