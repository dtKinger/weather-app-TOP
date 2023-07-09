console.log("Loading, please wait...")

const searchBtn = document.querySelector('#submit');
const searchField = document.querySelector('#search');
let search = '';

searchBtn.addEventListener('click', (e) => {
e.preventDefault();
let search = searchField.value;
fetchWeather(search);
})

////////////

async function fetchWeather (search) {
  if (!search){
    let search = 'Ho Chi Minh';
  } else {
      try {
      const WEATHER_DATA = await fetch(`http://api.weatherapi.com/v1/current.json?key=2218275108374adfbec63623230807&q=${search}`, {
        mode: 'cors'
      })
      let response = await WEATHER_DATA.json()
      console.log(response)
      if (error){
        handleError();  
      }

      } catch (error) {

      }   
    }
  }
  fetchWeather();

  
  // function handleError(error){
  //   let tryAgain = prompt(`Oops, we got an error from the server. It said: "${response.error.message}" Want to try again?`)
  //   if (tryAgain === null){
  //     // do nothing
  //   } else {
  //     city = tryAgain;
  //     fetchWeather(city);
  //   }
  // }
  // handleError(error)