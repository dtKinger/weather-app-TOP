const searchBtn = document.querySelector('#submit');
const searchField = document.querySelector('#search');
const FORM = document.querySelector('form');
const OUTPUT = document.querySelector('.output');
const CURRENT_CITY = document.querySelector('.current-city');
const newLine = document.createElement('br');
let lastCity;

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  let search = searchField.value;
  lastCity = search;
  fetchWeather(search);
  FORM.reset(); 
})

////////////

// Get user's current city

// Load data based on that.

async function fetchWeather (search) {
  try {
    const WEATHER_DATA = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${search}`, {mode: 'cors'})
    let response = await WEATHER_DATA.json()
    lastCity = response.location.name;
    CURRENT_CITY.textContent = `${lastCity}`;


    // OUTPUT.innerHTML = `
    // <h3>Location information:</h3>
    // <br><br>
    // ${response.location.name}
    // <br><br>
    // <h3>Current Weather:</h3>
    // ${response.current}`;
    
    OUTPUT.innerHTML = ''; // Dump it before refilling.
    let breakdown = Object.entries(response)
    breakdown.forEach((prop) => {
      let node = document.createElement('p');
      node.textContent = prop[0];
      OUTPUT.appendChild(node);
        let section = document.createElement('ul')
        node.appendChild(section);
        let nestedItems = Object.entries(prop[1])
        nestedItems.forEach((prop, index) => {
          console.log(prop.hasChildren);
          let subNode = document.createElement('li')
          subNode.classList = 'current-weather-item'

          let dataDesc = document.createElement('span')
          dataDesc.classList = 'data-desc'
          dataDesc.textContent = prop[0];
          console.log(dataDesc)

          let value = document.createElement('span')
          value.classList = 'value'
          value.textContent = prop[1];
          console.log(prop[1])

          if (typeof prop[1] === 'object') {
            
            let nestedNest = Object.entries(prop[1])
            let iconPath = nestedNest[1][1]; 
            let weatherIcon = document.createElement('img')
            weatherIcon.src = `https:${iconPath}`;
              console.log(`We found an object at ${prop[1]}`)
              subNode.textContent = `${dataDesc.textContent}:`  
              subNode.appendChild(weatherIcon);
            } else {
              subNode.textContent = `${dataDesc.textContent}: ${value.textContent}`    
            }
          

          section.append(subNode);
        })

    })
    


    } catch (err) {
      handleError(err);
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

// make a safe function with a HOF
function makeSafe(fn, errorHandler) {
  return function() {
    fn().catch(errorHandler);
  }
}