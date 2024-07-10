const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(weatherData => {
      const { coord } = weatherData;
      const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;
      const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

      return Promise.all([
        fetch(uvUrl).then(response => response.json()),
        fetch(airQualityUrl).then(response => response.json())
      ]).then(([uvData, airQualityData]) => {
        return { weatherData, uvData, airQualityData };
      });
    });
}

// Function to update UI with fetched weather data
function updateUI({ weatherData, uvData, airQualityData }) {
  console.log(weatherData, uvData, airQualityData);

  // Selecting elements correctly
  const tempElements = document.querySelectorAll('.temp');
  const visibilityElement = document.querySelector('.visibility');
  const weatherIconElement = document.querySelector('.weather-icon img');
  const cardIconElement = document.querySelector('.card-icon img');
  const dayNameElement = document.querySelector('.day-name');
  const locationElement = document.querySelector('.location');
  const conditionElement = document.getElementById('condition');
  const rainElement = document.getElementById('rain');
  const uvIndexElement = document.querySelector('.uv-index');
  const airQualityElement = document.querySelector('.air-quality');
  const windSpeedElement = document.querySelector('.wind-speed');
  const humidityElement = document.querySelector('.humidity');

  // Setting text content for multiple elements (assuming you want to update all)
  tempElements.forEach(element => {
    element.textContent = `${Math.round(weatherData.main.temp)}°C`;
  });

  visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
  weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  conditionElement.textContent = weatherData.weather[0].description;
  rainElement.textContent = `${weatherData.clouds.all}%`;

  uvIndexElement.textContent = uvData.value;
  airQualityElement.textContent = airQualityData.list[0].main.aqi;
  windSpeedElement.textContent = `${weatherData.wind.speed} m/s`;
  humidityElement.textContent = `${weatherData.main.humidity}%`;

  // Get the current day of the week
  const today = new Date();
  const options = { weekday: 'long' };
  const day = today.toLocaleDateString('en-US', options);
  dayNameElement.textContent = day;

  // Update card icon based on the day of the week
  updateCardIcon(day);

  // Update background image based on weather condition
  updateBackgroundAndIcon(weatherData.weather[0].description);

  const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.querySelector('.sunrise').textContent = sunriseTime;
  document.querySelector('.sunset').textContent = sunsetTime;
}

function updateCardIcon(day) {
  const cardIconElement = document.querySelector('.card-icon img');
  switch (day) {
    case 'Monday':
      cardIconElement.src = "monday.png";
      break;
    case 'Tuesday':
      cardIconElement.src = "tuesday.png";
      break;
    case 'Wednesday':
      cardIconElement.src = "wednesday.png";
      break;
    case 'Thursday':
      cardIconElement.src = "thursday.png";
      break;
    case 'Friday':
      cardIconElement.src = "friday.png";
      break;
    case 'Saturday':
      cardIconElement.src = "saturday.png";
      break;
    case 'Sunday':
      cardIconElement.src = "sunday.png";
      break;
    default:
      cardIconElement.src = "default.png";
      break;
  }
}

function updateBackgroundAndIcon(description) {
  const body = document.body;
  switch (description) {
    case 'clear sky':
      body.style.backgroundImage = "url('clearsky.jpg')";
      break;
    case 'few clouds':
      body.style.backgroundImage = "url('fewclouds.jpg')";
      break;
    case 'scattered clouds':
      body.style.backgroundImage = "url('scattered-clouds.jpg')";
      break;
    case 'broken clouds':
      body.style.backgroundImage = "url('broken.jpg')";
      break;
    case 'shower rain':
      body.style.backgroundImage = "url('showerrain.jpg')";
      break;
    case 'rain':
      body.style.backgroundImage = "url('rain.jpg')";
      break;
    case 'thunderstorm':
      body.style.backgroundImage = "url('thunderstorm.jpg')";
      break;
    case 'snow':
      body.style.backgroundImage = "url('snow.jpg')";
      break;
    case 'mist':
      body.style.backgroundImage = "url('mist.jpg')";
      break;
    default:
      body.style.backgroundImage = "url('default.jpg')";
      break;
  }
}

// Event listener for form submission
document.getElementById('search').addEventListener('submit', function(event) {
  event.preventDefault();
  const city = document.getElementById('query').value;
  getCurrentWeather(city)
    .then(data => {
      updateUI(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});

// Initial fetch for default city
getCurrentWeather('London')
  .then(data => {
    updateUI(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });











// const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function getCurrentWeather(city) {
//   const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(weatherData => {
//       const { coord } = weatherData;
//       const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;
//       const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

//       return Promise.all([
//         fetch(uvUrl).then(response => response.json()),
//         fetch(airQualityUrl).then(response => response.json())
//       ]).then(([uvData, airQualityData]) => {
//         return { weatherData, uvData, airQualityData };
//       });
//     });
// }

// // Function to update UI with fetched weather data
// function updateUI({ weatherData, uvData, airQualityData }) {
//   console.log(weatherData, uvData, airQualityData);

//   // Selecting elements correctly
//   const tempElements = document.querySelectorAll('.temp');
//   const visibilityElement = document.querySelector('.visibility');
//   const weatherIconElement = document.querySelector('.weather-icon img');
//   const cardIconElement = document.querySelector('.card-icon img');
//   const dayNameElement = document.querySelector('.day-name');
//   const locationElement = document.querySelector('.location');
//   const conditionElement = document.getElementById('condition');
//   const rainElement = document.getElementById('rain');
//   const uvIndexElement = document.querySelector('.uv-index');
//   const airQualityElement = document.querySelector('.air-quality');
//   const windSpeedElement = document.querySelector('.wind-speed');
//   const humidityElement = document.querySelector('.humidity');

//   // Setting text content for multiple elements (assuming you want to update all)
//   tempElements.forEach(element => {
//     element.textContent = `${Math.round(weatherData.main.temp)}°C`;
//   });

//   visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
//   weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
//   locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//   conditionElement.textContent = weatherData.weather[0].description;
//   rainElement.textContent = `${weatherData.clouds.all}%`;

//   uvIndexElement.textContent = uvData.value;
//   airQualityElement.textContent = airQualityData.list[0].main.aqi;
//   windSpeedElement.textContent = `${weatherData.wind.speed} m/s`;
//   humidityElement.textContent = `${weatherData.main.humidity}%`;

//   // Get the current day of the week
//   const today = new Date();
//   const options = { weekday: 'long' };
//   const day = today.toLocaleDateString('en-US', options);
//   dayNameElement.textContent = day;

//   // Update card icon based on the day of the week
//   updateCardIcon(day);

//   // Update background image based on weather condition
//   updateBackgroundAndIcon(weatherData.weather[0].description);

//   const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   document.querySelector('.sunrise').textContent = sunriseTime;
//   document.querySelector('.sunset').textContent = sunsetTime;
// }

// function updateCardIcon(day) {
//   const cardIconElement = document.querySelector('.card-icon img');
//   switch (day) {
//     case 'Monday':
//       cardIconElement.src = "url('monday.png')";
//       break;
//     case 'Tuesday':
//       cardIconElement.src = "url('tuesday.png')";
//       break;
//     case 'Wednesday':
//       cardIconElement.src = "url('wednesday.png')";
//       break;
//     case 'Thursday':
//       cardIconElement.src = "url('thursday.png')";
//       break;
//     case 'Friday':
//       cardIconElement.src = "url('friday.png')";
//       break;
//     case 'Saturday':
//       cardIconElement.src = "url('saturday.png')";
//       break;
//     case 'Sunday':
//       cardIconElement.src = "url('sunday.png')";
//       break;
//     default:
//       cardIconElement.src = "url('default.png')";
//       break;
//   }
// }

// function updateBackgroundAndIcon(description) {
//   const body = document.body;
//   switch (description) {
//     case 'clear sky':
//       body.style.backgroundImage = "url('clearsky.jpg')";
//       break;
//     case 'few clouds':
//       body.style.backgroundImage = "url('fewclouds.jpg')";
//       break;
//     case 'scattered clouds':
//       body.style.backgroundImage = "url('scattered-clouds.jpg')";
//       break;
//     case 'broken clouds':
//       body.style.backgroundImage = "url('broken.jpg')";
//       break;
//     case 'shower rain':
//       body.style.backgroundImage = "url('showerrain.jpg')";
//       break;
//     case 'rain':
//       body.style.backgroundImage = "url('rain.jpg')";
//       break;
//     case 'thunderstorm':
//       body.style.backgroundImage = "url('thunderstorm.jpg')";
//       break;
//     case 'snow':
//       body.style.backgroundImage = "url('snow.jpg')";
//       break;
//     case 'mist':
//       body.style.backgroundImage = "url('mist.jpg')";
//       break;
//     default:
//       body.style.backgroundImage = "url('default.jpg')";
//       break;
//   }
// }

// // Event listener for form submission
// document.getElementById('search').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const city = document.getElementById('query').value;
//   getCurrentWeather(city)
//     .then(data => {
//       updateUI(data);
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// });

// // Initial fetch for default city
// getCurrentWeather('New york')
//   .then(data => {
//     updateUI(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });







// const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function getCurrentWeather(city) {
//   const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(weatherData => {
//       const { coord } = weatherData;
//       const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;
//       const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

//       return Promise.all([
//         fetch(uvUrl).then(response => response.json()),
//         fetch(airQualityUrl).then(response => response.json())
//       ]).then(([uvData, airQualityData]) => {
//         return { weatherData, uvData, airQualityData };
//       });
//     });
// }

// // Function to update UI with fetched weather data
// function updateUI({ weatherData, uvData, airQualityData }) {
//   console.log(weatherData, uvData, airQualityData);

//   // Selecting elements correctly
//   const tempElements = document.querySelectorAll('.temp');
//   const tempUnitElements = document.querySelectorAll('.temp-unit');
//   const visibilityElement = document.querySelector('.visibility');
//   const weatherIconElement = document.querySelector('.weather-icon img');
//   const dayNameElement = document.querySelector('.day-name');
//   const locationElement = document.querySelector('.location');
//   const conditionElement = document.getElementById('condition');
//   const rainElement = document.getElementById('rain');
//   const uvIndexElement = document.querySelector('.uv-index');
//   const airQualityElement = document.querySelector('.air-quality');
//   const windSpeedElement = document.querySelector('.wind-speed');
//   const humidityElement = document.querySelector('.humidity');

//   // Setting text content for multiple elements (assuming you want to update all)
//   tempElements.forEach(element => {
//     element.textContent = `${Math.round(weatherData.main.temp)}°C`;
//   });

//   visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
//   weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
//   locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//   conditionElement.textContent = weatherData.weather[0].description;
//   rainElement.textContent = `${weatherData.clouds.all}%`;

//   uvIndexElement.textContent = uvData.value;
//   airQualityElement.textContent = airQualityData.list[0].main.aqi;
//   windSpeedElement.textContent = `${weatherData.wind.speed} m/s`;
//   humidityElement.textContent = `${weatherData.main.humidity}%`;

//   // Update background image based on weather condition
//   updateBackgroundAndIcon(weatherData.weather[0].description);

//   const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   document.querySelector('.sunrise').textContent = sunriseTime;
//   document.querySelector('.sunset').textContent = sunsetTime;
// }

// function updateBackgroundAndIcon(description) {
//   const body = document.body;
//   switch (description) {
//     case 'clear sky':
//       body.style.backgroundImage = "url('clearsky.jpg')";
//       break;
//     case 'few clouds':
//       body.style.backgroundImage = "url('fewclouds.jpg')";
//       break;
//     case 'scattered clouds':
//       body.style.backgroundImage = "url('scattered-clouds.jpg')";
//       break;
//     case 'broken clouds':
//       body.style.backgroundImage = "url('broken.jpg')";
//       break;
//     case 'shower rain':
//       body.style.backgroundImage = "url('showerrain.jpg')";
//       break;
//     case 'rain':
//       body.style.backgroundImage = "url('rain.jpg')";
//       break;
//     case 'thunderstorm':
//       body.style.backgroundImage = "url('thunderstorm.jpg')";
//       break;
//     case 'snow':
//       body.style.backgroundImage = "url('snow.jpg')";
//       break;
//     case 'mist':
//       body.style.backgroundImage = "url('mist.jpg')";
//       break;
//     default:
//       body.style.backgroundImage = "url('default.jpg')";
//       break;
//   }
// }

// // Event listener for form submission
// document.getElementById('search').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const city = document.getElementById('query').value;
//   getCurrentWeather(city)
//     .then(data => {
//       updateUI(data);
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// });

// // Initial fetch for default city
// getCurrentWeather('London')
//   .then(data => {
//     updateUI(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });








// const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function getCurrentWeather(city) {
//   const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .then(weatherData => {
//       const { coord } = weatherData;
//       const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;
//       const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

//       return Promise.all([
//         fetch(uvUrl).then(response => response.json()),
//         fetch(airQualityUrl).then(response => response.json())
//       ]).then(([uvData, airQualityData]) => {
//         return { weatherData, uvData, airQualityData };
//       });
//     });
// }

// // Function to update UI with fetched weather data
// function updateUI({ weatherData, uvData, airQualityData }) {
//   console.log(weatherData, uvData, airQualityData);

//   // Selecting elements correctly
//   const tempElements = document.querySelectorAll('.temp');
//   const tempUnitElements = document.querySelectorAll('.temp-unit');
//   const visibilityElement = document.querySelector('.visibility');
//   const weatherIconElement = document.querySelector('.weather-icon img');
//   const dayNameElement = document.querySelector('.day-name');
//   const locationElement = document.querySelector('.location');
//   const conditionElement = document.getElementById('condition');
//   const rainElement = document.getElementById('rain');
//   const uvIndexElement = document.querySelector('.uv-index');
//   const airQualityElement = document.querySelector('.air-quality');

//   // Setting text content for multiple elements (assuming you want to update all)
//   tempElements.forEach(element => {
//     element.textContent = `${Math.round(weatherData.main.temp)}°C`;
//   });

//   visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
//   weatherIconElement.src = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
//   locationElement.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//   conditionElement.textContent = weatherData.weather[0].description;
//   rainElement.textContent = `${weatherData.clouds.all}%`;

//   uvIndexElement.textContent = uvData.value;
//   airQualityElement.textContent = airQualityData.list[0].main.aqi;

//   // Update background image based on weather condition
//   updateBackgroundAndIcon(weatherData.weather[0].description);

//   const sunriseTime = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   const sunsetTime = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   document.querySelector('.sunrise').textContent = sunriseTime;
//   document.querySelector('.sunset').textContent = sunsetTime;
// }

// function updateBackgroundAndIcon(description) {
//   const body = document.body;
//   switch (description) {
//     case 'clear sky':
//       body.style.backgroundImage = "url('clearsky.jpg')";
//       break;
//     case 'few clouds':
//       body.style.backgroundImage = "url('fewclouds.jpg')";
//       break;
//     case 'scattered clouds':
//       body.style.backgroundImage = "url('scattered-clouds.jpg')";
//       break;
//     case 'broken clouds':
//       body.style.backgroundImage = "url('broken.jpg')";
//       break;
//     case 'shower rain':
//       body.style.backgroundImage = "url('showerrain.jpg')";
//       break;
//     case 'rain':
//       body.style.backgroundImage = "url('rain.jpg')";
//       break;
//     case 'thunderstorm':
//       body.style.backgroundImage = "url('thunderstorm.jpg')";
//       break;
//     case 'snow':
//       body.style.backgroundImage = "url('snow.jpg')";
//       break;
//     case 'mist':
//       body.style.backgroundImage = "url('mist.jpg')";
//       break;
//     default:
//       body.style.backgroundImage = "url('default.jpg')";
//       break;
//   }
// }

// // Event listener for form submission
// document.getElementById('search').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const city = document.getElementById('query').value;
//   getCurrentWeather(city)
//     .then(data => {
//       updateUI(data);
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// });

// // Initial fetch for default city
// getCurrentWeather('London')
//   .then(data => {
//     updateUI(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });















// const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function getCurrentWeather(city) {
//   const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     });
// }

// // Function to update UI with fetched weather data
// function updateUI(data) {
//   console.log(data);

//   // Selecting elements correctly
//   const tempElements = document.querySelectorAll('.temp');
//   const tempUnitElements = document.querySelectorAll('.temp-unit');
//   const visibilityElement = document.querySelector('.visibility');
//   const weatherIconElement = document.querySelector('.weather-icon img');
//   const dayNameElement = document.querySelector('.day-name');
//   const locationElement = document.querySelector('.location');
//   const conditionElement = document.getElementById('condition');
//   const rainElement = document.getElementById('rain');

//   // Setting text content for multiple elements (assuming you want to update all)
//   tempElements.forEach(element => {
//     element.textContent = data.main.temp;
//   });

//   // Example: updating visibility
//   visibilityElement.textContent = data.visibility;

//   // Example: updating weather icon source
//   weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

//   // Example: updating location
//   locationElement.textContent = data.name;

//   // Example: updating weather condition
//   conditionElement.textContent = data.weather[0].description;

//   // Example: updating rain percentage (assuming it's part of the data)
//   rainElement.textContent = `Perc - ${data.rain ? data.rain['1h'] : 0}%`;
// }

// // Event listener for form submission
// document.getElementById('search').addEventListener('submit', function(event) {
//   event.preventDefault();
//   const city = document.getElementById('query').value;
//   getCurrentWeather(city)
//     .then(data => {
//       updateUI(data);
//     })
//     .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//     });
// });

// // Initial fetch for default city
// getCurrentWeather('London')
//   .then(data => {
//     updateUI(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });




// const API_KEY = '365284ecbddcc7ff27859fb27c0b9cd9';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// function getCurrentWeather(city) {
//   const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     });
// }

// // function getWeeklyWeather(city) {
// //   const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
// //   return fetch(url)
// //     .then(response => {
// //       if (!response.ok) {
// //         throw new Error('Network response was not ok');
// //       }
// //       return response.json();
// //     });
// // }

// // Usage examples:
// getCurrentWeather('London')
//   .then(data => {
//     console.log(data);

//     // Selecting elements correctly
//     const tempElements = document.querySelectorAll('.temp');
//     const tempUnitElements = document.querySelectorAll('.temp-unit');
//     const visibilityElement = document.querySelector('.visibility');
//     const weatherIconElement = document.querySelector('.weather-icon img');
//     const dayNameElement = document.querySelector('.day-name');

//     // Setting text content for multiple elements (assuming you want to update all)
//     tempElements.forEach(element => {
//       element.textContent = data.main.temp;
//     });

//     // Example: updating visibility
//     visibilityElement.textContent = data.visibility;

//     // Example: updating weather icon source
//     weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

//     // Example: updating day name
//     dayNameElement.textContent = getDayName(); // Assuming you have a function to get the day name


//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });


// // getWeeklyWeather('London')
// //   .then(data => {
// //     console.log(data);
// //   })
// //   .catch(error => {
// //     console.error('There was a problem with the fetch operation:', error);
// //   });


