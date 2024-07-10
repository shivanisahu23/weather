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
    });
}

// function getWeeklyWeather(city) {
//   const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     });
// }

// Usage examples:
getCurrentWeather('London')
  .then(data => {
    console.log(data.main.temp);

    // Selecting elements correctly
    const tempElements = document.querySelectorAll('.temp');
    const tempUnitElements = document.querySelectorAll('.temp-unit');
    const visibilityElement = document.querySelector('.visibility');
    const weatherIconElement = document.querySelector('.weather-icon img');
    const dayNameElement = document.querySelector('.day-name');

    // Setting text content for multiple elements (assuming you want to update all)
    tempElements.forEach(element => {
      element.textContent = data.main.temp;
    });

    // Example: updating visibility
    visibilityElement.textContent = data.visibility;

    // Example: updating weather icon source
    weatherIconElement.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

    // Example: updating day name
    dayNameElement.textContent = getDayName(); // Assuming you have a function to get the day name

    // You can update other elements similarly

  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });


// getWeeklyWeather('London')
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('There was a problem with the fetch operation:', error);
//   });
