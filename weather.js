document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '79547320160cce3a656e250f9e396443'; 
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';

    const tempElements = document.querySelectorAll('.temp');
    const tempUnitElements = document.querySelectorAll('.temp-unit');
    const visibilityElement = document.querySelector('.visibility');
    const weatherIconElement = document.querySelector('.weather-icon img');
    const dayNameElement = document.querySelector('.day-name');

    document.getElementById('search').addEventListener('submit', function (event) {
        event.preventDefault();
        const query = document.getElementById('query').value;
        if (query.trim().length === 0) {
            alert('Please enter a city name');
            return;
        }

        fetchWeatherData(query)
            .then(({ weatherData, uvData, airQualityData }) => {
                updateWeatherData(weatherData, uvData, airQualityData);
            })
            .catch(error => {
                if (error.message === 'City not found') {
                    alert('City not found. Please enter a valid city name.');
                } else {
                    console.error('Error fetching weather data:', error);
                    alert('Failed to fetch weather data. Please try again later.');
                }
            });
    });

    function fetchWeatherData(location) {
        const weatherUrl = `${BASE_URL}/weather?q=${location}&appid=${apiKey}&units=metric`;

        return fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(weatherData => {
                const { coord } = weatherData;
                const uvUrl = `${BASE_URL}/uvi?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
                const airQualityUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

                return Promise.all([
                    fetch(uvUrl),
                    fetch(airQualityUrl)
                ])
                .then(responses => {
                    return Promise.all(responses.map(response => response.json()));
                })
                .then(([uvData, airQualityData]) => {
                    return { weatherData, uvData, airQualityData };
                });
            });
    }

    function updateWeatherData(weatherData, uvData, airQualityData) {
        const { main, weather, wind, clouds, sys } = weatherData;
        const { value: uvIndex } = uvData;
        const airQuality = airQualityData.list[0].main.aqi;

        let temperature = main.temp;
        let visibilityInKm = weatherData.visibility / 1000;

        tempElements.forEach(tempElement => {
            tempElement.textContent = `${Math.round(temperature)}°`;
        });

        visibilityElement.textContent = `${visibilityInKm.toFixed(1)} km`;

        const iconCode = weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        weatherIconElement.src = iconUrl;

        const today = new Date();
        const options = { weekday: 'long' };
        const day = today.toLocaleDateString('en-US', options);
        dayNameElement.textContent = day;

        document.getElementById('condition').textContent = weather[0].description;
        document.getElementById('rain').textContent = `${clouds.all}%`;
        document.querySelector('.location .location').textContent = `${weatherData.name}, ${sys.country}`;
        document.querySelector('.wind-speed').textContent = `${wind.speed} m/s`;
        document.querySelector('.humidity').textContent = `${main.humidity}%`;
        document.querySelector('.uv-index').textContent = uvIndex;
        document.querySelector('.air-quality').textContent = airQuality;

        const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.querySelector('.sunrise').textContent = sunriseTime;
        document.querySelector('.sunset').textContent = sunsetTime;

        updateBackgroundAndIcon(weather[0].description);
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

    fetchWeatherData('New York')
        .then(({ weatherData, uvData, airQualityData }) => {
            updateWeatherData(weatherData, uvData, airQualityData);
        })
        .catch(error => {
            if (error.message === 'City not found') {
                alert('City not found. Please enter a valid city name.');
            } else {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data. Please try again later.');
            }
        });
});




// document.addEventListener('DOMContentLoaded', function () {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrlBase = 'https://api.openweathermap.org/data/2.5/weather';
//     const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
//     const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

//     const tempElements = document.querySelectorAll('.temp');
//     const tempUnitElements = document.querySelectorAll('.temp-unit');
//     const visibilityElement = document.querySelector('.visibility');
//     const weatherIconElement = document.querySelector('.weather-icon img');
//     const dayNameElement = document.querySelector('.day-name');

//     document.getElementById('search').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const query = document.getElementById('query').value;
//         if (query.trim().length === 0) {
//             alert('Please enter a city name');
//             return;
//         }

//         fetchWeatherData(query)
//             .then(({ weatherData, uvData, airQualityData }) => {
//                 updateWeatherData(weatherData, uvData, airQualityData);
//             })
//             .catch(error => {
//                 if (error === 'City not found') {
//                     alert('City not found. Please enter a valid city name.');
//                 } else {
//                     console.error('Error fetching weather data:', error);
//                     alert('Failed to fetch weather data. Please try again later.');
//                 }
//             });
//     });

//     function fetchWeatherData(location) {
//         const weatherUrl = `${weatherUrlBase}?q=${location}&appid=${apiKey}&units=metric`;

//         return fetch(weatherUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 return response.json();
//             })
//             .then(weatherData => {
//                 const { coord } = weatherData;
//                 const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
//                 const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

//                 return Promise.all([
//                     fetch(uvUrl),
//                     fetch(airQualityUrl)
//                 ])
//                 .then(responses => {
//                     return Promise.all(responses.map(response => response.json()));
//                 })
//                 .then(([uvData, airQualityData]) => {
//                     return { weatherData, uvData, airQualityData };
//                 });
//             });
//     }

//     function updateWeatherData(weatherData, uvData, airQualityData) {
//         const { main, weather, wind, clouds, sys } = weatherData;
//         const { value: uvIndex } = uvData;
//         const airQuality = airQualityData.list[0].main.aqi;

//         let temperature = main.temp;
//         let visibilityInKm = weatherData.visibility / 1000;

//         // Update all temperature elements based on current unit (only Celsius in this case)
//         tempElements.forEach(tempElement => {
//             tempElement.textContent = `${Math.round(temperature)}°`;
//         });

//         visibilityElement.textContent = `${visibilityInKm.toFixed(1)} km`;

//         // Update weather icon
//         const iconCode = weather[0].icon;
//         const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
//         weatherIconElement.src = iconUrl;

//         // Update day of the week
//         const today = new Date();
//         const options = { weekday: 'long' };
//         const day = today.toLocaleDateString('en-US', options);
//         dayNameElement.textContent = day;

//         // Update other elements as needed
//         document.getElementById('condition').textContent = weather[0].description;
//         document.getElementById('rain').textContent = `${clouds.all}%`;
//         document.querySelector('.location .location').textContent = `${weatherData.name}, ${sys.country}`;
//         document.querySelector('.wind-speed').textContent = `${wind.speed} m/s`;
//         document.querySelector('.humidity').textContent = `${main.humidity}%`;
//         document.querySelector('.uv-index').textContent = uvIndex;
//         document.querySelector('.air-quality').textContent = airQuality;

//         const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         document.querySelector('.sunrise').textContent = sunriseTime;
//         document.querySelector('.sunset').textContent = sunsetTime;

//         updateBackgroundAndIcon(weather[0].description);
//     }

//     function updateBackgroundAndIcon(description) {
//         const body = document.body;
//         switch (description) {
//             case 'clear sky':
//                 body.style.backgroundImage = "url('clearsky.jpg')";
//                 break;
//             case 'few clouds':
//                 body.style.backgroundImage = "url('fewclouds.jpg')";
//                 break;
//             case 'scattered clouds':
//                 body.style.backgroundImage = "url('scattered-clouds.jpg')";
//                 break;
//             case 'broken clouds':
//                 body.style.backgroundImage = "url('broken.jpg')";
//                 break;
//             case 'shower rain':
//                 body.style.backgroundImage = "url('showerrain.jpg')";
//                 break;
//             case 'rain':
//                 body.style.backgroundImage = "url('rain.jpg')";
//                 break;
//             case 'thunderstorm':
//                 body.style.backgroundImage = "url('thunderstorm.jpg')";
//                 break;
//             case 'snow':
//                 body.style.backgroundImage = "url('snow.jpg')";
//                 break;
//             case 'mist':
//                 body.style.backgroundImage = "url('mist.jpg')";
//                 break;
//             case 'haze':
//                 body.style.backgroundImage = "url('haze.jpg')";
//                 break;
//             case 'fog':
//                 body.style.backgroundImage = "url('fog.jpg')";
//                 break;
//             case 'smoke':
//                 body.style.backgroundImage = "url('smoke.jpg')";
//                 break;
//             case 'dust':
//                 body.style.backgroundImage = "url('dust.jpg')";
//                 break;
//             case 'sand':
//                 body.style.backgroundImage = "url('sand.jpg')";
//                 break;
//             case 'ash':
//                 body.style.backgroundImage = "url('ash.jpg')";
//                 break;
//             case 'squall':
//                 body.style.backgroundImage = "url('squall.jpg')";
//                 break;
//             case 'tornado':
//                 body.style.backgroundImage = "url('tornado.jpg')";
//                 break;
//             case 'hot':
//                 body.style.backgroundImage = "url('hot.jpg')";
//                 break;
//             case 'cold':
//                 body.style.backgroundImage = "url('cold.jpg')";
//                 break;
//             case 'windy':
//                 body.style.backgroundImage = "url('windy.jpg')";
//                 break;
//             case 'blizzard':
//                 body.style.backgroundImage = "url('blizzard.jpg')";
//                 break;
//             default:
//                 body.style.backgroundImage = "url('default.jpg')";
//                 break;
//         }
//     }
    
//     // Initial fetch for New York on page load
//     fetchWeatherData('New York')
//         .then(({ weatherData, uvData, airQualityData }) => {
//             updateWeatherData(weatherData, uvData, airQualityData);
//         })
//         .catch(error => {
//             if (error === 'City not found') {
//                 alert('City not found. Please enter a valid city name.');
//             } else {
//                 console.error('Error fetching weather data:', error);
//                 alert('Failed to fetch weather data. Please try again later.');
//             }
//         });
// });








// document.addEventListener('DOMContentLoaded', function () {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrlBase = 'https://api.openweathermap.org/data/2.5/weather';
//     const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
//     const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

//     const tempElements = document.querySelectorAll('.temp');
//     const tempUnitElements = document.querySelectorAll('.temp-unit');
//     const visibilityElement = document.querySelector('.visibility');
//     const weatherIconElement = document.querySelector('.weather-icon img');
//     const dayNameElement = document.querySelector('.day-name');

//     const celsiusButton = document.querySelector('.celcius');
//     const fahrenheitButton = document.querySelector('.fahrenheit');
//     let isCelsius = true; // Default unit is Celsius

//     document.getElementById('search').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const query = document.getElementById('query').value;
//         if (query.trim().length === 0) {
//             alert('Please enter a city name');
//             return;
//         }

//         fetchWeatherData(query)
//             .then(({ weatherData, uvData, airQualityData }) => {
//                 updateWeatherData(weatherData, uvData, airQualityData);
//             })
//             .catch(error => {
//                 if (error === 'City not found') {
//                     alert('City not found. Please enter a valid city name.');
//                 } else {
//                     console.error('Error fetching weather data:', error);
//                     alert('Failed to fetch weather data. Please try again later.');
//                 }
//             });
//     });

//     celsiusButton.addEventListener('click', function () {
//         if (!isCelsius) {
//             isCelsius = true;
//             convertTemperature('C');
//         }
//     });

//     fahrenheitButton.addEventListener('click', function () {
//         if (isCelsius) {
//             isCelsius = false;
//             convertTemperature('F');
//         }
//     });

//     function fetchWeatherData(location) {
//         const weatherUrl = `${weatherUrlBase}?q=${location}&appid=${apiKey}&units=metric`;

//         return fetch(weatherUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 return response.json();
//             })
//             .then(weatherData => {
//                 const { coord } = weatherData;
//                 const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
//                 const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

//                 return Promise.all([
//                     fetch(uvUrl),
//                     fetch(airQualityUrl)
//                 ])
//                 .then(responses => {
//                     return Promise.all(responses.map(response => response.json()));
//                 })
//                 .then(([uvData, airQualityData]) => {
//                     return { weatherData, uvData, airQualityData };
//                 });
//             });
//     }

//     function updateWeatherData(weatherData, uvData, airQualityData) {
//         const { main, weather, wind, clouds, sys } = weatherData;
//         const { value: uvIndex } = uvData;
//         const airQuality = airQualityData.list[0].main.aqi;

//         let temperature = main.temp;
//         let visibilityInKm = weatherData.visibility / 1000;

//         if (!isCelsius) {
//             temperature = (temperature * 9 / 5) + 32; // Convert to Fahrenheit
//         }

//         // Update all temperature elements
//         tempElements.forEach(tempElement => {
//             tempElement.textContent = `${Math.round(temperature)}°`;
//         });

//         visibilityElement.textContent = `${visibilityInKm.toFixed(1)} km`;

//         // Update weather icon
//         const iconCode = weather[0].icon;
//         const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
//         weatherIconElement.src = iconUrl;

//         // Update day of the week
//         const today = new Date();
//         const options = { weekday: 'long' };
//         const day = today.toLocaleDateString('en-US', options);
//         dayNameElement.textContent = day;

//         // Update temperature unit
//         updateTemperatureUnit();

//         // Update other elements as needed
//         document.getElementById('condition').textContent = weather[0].description;
//         document.getElementById('rain').textContent = `${clouds.all}%`;
//         document.querySelector('.location .location').textContent = `${weatherData.name}, ${sys.country}`;
//         document.querySelector('.wind-speed').textContent = `${wind.speed} m/s`;
//         document.querySelector('.humidity').textContent = `${main.humidity}%`;
//         document.querySelector('.uv-index').textContent = uvIndex;
//         document.querySelector('.air-quality').textContent = airQuality;

//         const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         document.querySelector('.sunrise').textContent = sunriseTime;
//         document.querySelector('.sunset').textContent = sunsetTime;

//         updateBackgroundAndIcon(weather[0].description);
//     }

//     function convertTemperature(unit) {
//         if (unit === 'C') {
//             isCelsius = true;
//         } else if (unit === 'F') {
//             isCelsius = false;
//         }
//         updateTemperature();
//     }

//     function updateTemperature() {
//         const currentTempText = tempElements[0].textContent;
//         const currentTemp = parseFloat(currentTempText);
        
//         if (!isCelsius) {
//             // Convert Fahrenheit to Celsius
//             const celsiusTemp = (currentTemp - 32) * (5 / 9);
//             tempElements.forEach(tempElement => {
//                 tempElement.textContent = `${Math.round(celsiusTemp)}°`;
//             });
//         } else {
//             // Temperature is already in Celsius, no conversion needed
//             tempElements.forEach(tempElement => {
//                 tempElement.textContent = `${Math.round(currentTemp)}°`;
//             });
//         }
//         updateTemperatureUnit();
//     }

//     function updateTemperatureUnit() {
//         tempUnitElements.forEach(tempUnitElement => {
//             if (isCelsius) {
//                 tempUnitElement.textContent = '°C';
//             } else {
//                 tempUnitElement.textContent = '°F';
//             }
//         });
//     }

//     function updateBackgroundAndIcon(description) {
//         const body = document.body;
//         switch (description) {
//             case 'clear sky':
//                 body.style.backgroundImage = "url('clearsky.jpg')";
//                 break;
//             case 'few clouds':
//                 body.style.backgroundImage = "url('fewclouds.jpg')";
//                 break;
//             case 'scattered clouds':
//                 body.style.backgroundImage = "url('scattered-clouds.jpg')";
//                 break;
//             case 'broken clouds':
//                 body.style.backgroundImage = "url('broken.jpg')";
//                 break;
//             case 'shower rain':
//                 body.style.backgroundImage = "url('showerrain.jpg')";
//                 break;
//             case 'rain':
//                 body.style.backgroundImage = "url('rain.jpg')";
//                 break;
//             case 'thunderstorm':
//                 body.style.backgroundImage = "url('thunderstorm.jpg')";
//                 break;
//             case 'snow':
//                 body.style.backgroundImage = "url('snow.jpg')";
//                 break;
//             case 'mist':
//                 body.style.backgroundImage = "url('mist.jpg')";
//                 break;
//             default:
//                 body.style.backgroundImage = "url('default.jpg')";
//                 break;
//         }
//     }

//     // Initial fetch for New York on page load
//     fetchWeatherData('New York')
//         .then(({ weatherData, uvData, airQualityData }) => {
//             updateWeatherData(weatherData, uvData, airQualityData);
//         })
//         .catch(error => {
//             if (error === 'City not found') {
//                 alert('City not found. Please enter a valid city name.');
//             } else {
//                 console.error('Error fetching weather data:', error);
//                 alert('Failed to fetch weather data. Please try again later.');
//             }
//         });
// });





// document.addEventListener('DOMContentLoaded', function () {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrlBase = 'https://api.openweathermap.org/data/2.5/weather';
//     const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
//     const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

//     const tempElement = document.querySelector('.temp');
//     const visibilityElement = document.querySelector('.visibility');
//     const celsiusButton = document.getElementById('celsius-btn');
//     const fahrenheitButton = document.getElementById('fahrenheit-btn');
//     let isCelsius = true; // Default unit is Celsius

//     document.getElementById('search').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const query = document.getElementById('query').value;
//         if (query.trim().length === 0) {
//             alert('Please enter a city name');
//             return;
//         }

//         fetchWeatherData(query)
//             .then(({ weatherData, uvData, airQualityData }) => {
//                 updateWeatherData(weatherData, uvData, airQualityData);
//             })
//             .catch(error => {
//                 if (error === 'City not found') {
//                     alert('City not found. Please enter a valid city name.');
//                 } else {
//                     console.error('Error fetching weather data:', error);
//                     alert('Failed to fetch weather data. Please try again later.');
//                 }
//             });
//     });

//     celsiusButton.addEventListener('click', function () {
//         if (!isCelsius) {
//             isCelsius = true;
//             convertTemperature('C');
//             updateTemperature();
//         }
//     });

//     fahrenheitButton.addEventListener('click', function () {
//         if (isCelsius) {
//             isCelsius = false;
//             convertTemperature('F');
//             updateTemperature();
//         }
//     });

//     function fetchWeatherData(location) {
//         const weatherUrl = `${weatherUrlBase}?q=${location}&appid=${apiKey}&units=metric`;

//         return fetch(weatherUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 return response.json();
//             })
//             .then(weatherData => {
//                 const { coord } = weatherData;
//                 const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
//                 const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

//                 return Promise.all([
//                     fetch(uvUrl),
//                     fetch(airQualityUrl)
//                 ])
//                 .then(responses => {
//                     return Promise.all(responses.map(response => response.json()));
//                 })
//                 .then(([uvData, airQualityData]) => {
//                     return { weatherData, uvData, airQualityData };
//                 });
//             });
//     }

//     function updateWeatherData(weatherData, uvData, airQualityData) {
//         const { main, weather, wind, clouds, sys } = weatherData;
//         const { value: uvIndex } = uvData;
//         const airQuality = airQualityData.list[0].main.aqi;

//         let temperature = main.temp;
//         let visibilityInKm = weatherData.visibility / 1000;

//         if (!isCelsius) {
//             temperature = (temperature * 9 / 5) + 32; // Convert to Fahrenheit
//         }

//         tempElement.textContent = `${Math.round(temperature)}°`;
//         visibilityElement.textContent = `${visibilityInKm.toFixed(1)} km`;

//         // Update other elements as needed
//         document.getElementById('condition').textContent = weather[0].description;
//         document.getElementById('rain').textContent = `${clouds.all}%`;
//         document.querySelector('.location .location').textContent = `${weatherData.name}, ${sys.country}`;
//         document.querySelector('.wind-speed').textContent = `${wind.speed} m/s`;
//         document.querySelector('.humidity').textContent = `${main.humidity}%`;
//         document.querySelector('.uv-index').textContent = uvIndex;
//         document.querySelector('.air-quality').textContent = airQuality;

//         const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         document.querySelector('.sunrise').textContent = sunriseTime;
//         document.querySelector('.sunset').textContent = sunsetTime;

//         updateBackgroundAndIcon(weather[0].description);
//     }

//     function updateTemperature() {
//         const currentTempText = tempElement.textContent;
//         const currentTemp = parseFloat(currentTempText);
        
//         if (!isCelsius) {
//             // Convert Fahrenheit to Celsius
//             const celsiusTemp = (currentTemp - 32) * (5 / 9);
//             tempElement.textContent = `${Math.round(celsiusTemp)}°`;
//         } else {
//             // Temperature is already in Celsius, no conversion needed
//             tempElement.textContent = `${Math.round(currentTemp)}°`;
//         }
//     }

//     function convertTemperature(unit) {
//         const tempUnitElement = document.querySelector('.temp-unit');
        
//         if (unit === 'C') {
//             tempUnitElement.textContent = '°C';
//         } else if (unit === 'F') {
//             tempUnitElement.textContent = '°F';
//         }
//     }

//     function updateBackgroundAndIcon(description) {
//         const body = document.body;
//         switch (description) {
//             case 'clear sky':
//                 body.style.backgroundImage = "url('clearsky.jpg')";
//                 break;
//             case 'few clouds':
//                 body.style.backgroundImage = "url('fewclouds.jpg')";
//                 break;
//             case 'scattered clouds':
//                 body.style.backgroundImage = "url('scattered-clouds.jpg')";
//                 break;
//             case 'broken clouds':
//                 body.style.backgroundImage = "url('broken.jpg')";
//                 break;
//             case 'shower rain':
//                 body.style.backgroundImage = "url('showerrain.jpg')";
//                 break;
//             case 'rain':
//                 body.style.backgroundImage = "url('rain.jpg')";
//                 break;
//             case 'thunderstorm':
//                 body.style.backgroundImage = "url('thunderstorm.jpg')";
//                 break;
//             case 'snow':
//                 body.style.backgroundImage = "url('snow.jpg')";
//                 break;
//             case 'mist':
//                 body.style.backgroundImage = "url('mist.jpg')";
//                 break;
//             default:
//                 body.style.backgroundImage = "url('default.jpg')";
//                 break;
//         }
//     }

//     // Initial fetch for New York on page load
//     fetchWeatherData('New York')
//         .then(({ weatherData, uvData, airQualityData }) => {
//             updateWeatherData(weatherData, uvData, airQualityData);
//         })
//         .catch(error => {
//             if (error === 'City not found') {
//                 alert('City not found. Please enter a valid city name.');
//             } else {
//                 console.error('Error fetching weather data:', error);
//                 alert('Failed to fetch weather data. Please try again later.');
//             }
//         });
// });



// document.addEventListener('DOMContentLoaded', function () {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrlBase = 'https://api.openweathermap.org/data/2.5/weather';
//     const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
//     const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

//     const tempElement = document.querySelector('.temp');
//     const visibilityElement = document.querySelector('.visibility');
//     let isCelsius = true; // Default unit is Celsius

//     document.getElementById('search').addEventListener('submit', function (event) {
//         event.preventDefault();
//         const query = document.getElementById('query').value;
//         if (query.trim().length === 0) {
//             alert('Please enter a city name');
//             return;
//         }

//         fetchWeatherData(query)
//             .then(({ weatherData, uvData, airQualityData }) => {
//                 updateWeatherData(weatherData, uvData, airQualityData);
//             })
//             .catch(error => {
//                 if (error === 'City not found') {
//                     alert('City not found. Please enter a valid city name.');
//                 } else {
//                     console.error('Error fetching weather data:', error);
//                     alert('Failed to fetch weather data. Please try again later.');
//                 }
//             });
//     });

//     document.getElementById('celsius-btn').addEventListener('click', function () {
//         if (!isCelsius) {
//             isCelsius = true;
//             updateTemperature();
//         }
//     });

//     document.getElementById('fahrenheit-btn').addEventListener('click', function () {
//         if (isCelsius) {
//             isCelsius = false;
//             updateTemperature();
//         }
//     });

//     function fetchWeatherData(location) {
//         const weatherUrl = `${weatherUrlBase}?q=${location}&appid=${apiKey}&units=metric`;

//         return fetch(weatherUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 return response.json();
//             })
//             .then(weatherData => {
//                 const { coord } = weatherData;
//                 const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
//                 const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

//                 return Promise.all([
//                     fetch(uvUrl),
//                     fetch(airQualityUrl)
//                 ])
//                 .then(responses => {
//                     return Promise.all(responses.map(response => response.json()));
//                 })
//                 .then(([uvData, airQualityData]) => {
//                     return { weatherData, uvData, airQualityData };
//                 });
//             });
//     }

//     function updateWeatherData(weatherData, uvData, airQualityData) {
//         const { main, weather, wind, clouds, sys } = weatherData;
//         const { value: uvIndex } = uvData;
//         const airQuality = airQualityData.list[0].main.aqi;

//         let temperature = main.temp;
//         let visibilityInKm = weatherData.visibility / 1000;

//         if (!isCelsius) {
//             temperature = (temperature * 9 / 5) + 32; // Convert to Fahrenheit
//         }

//         tempElement.textContent = `${Math.round(temperature)}°`;
//         visibilityElement.textContent = `${visibilityInKm.toFixed(1)} km`;

//         // Update other elements as needed
//         document.getElementById('condition').textContent = weather[0].description;
//         document.getElementById('rain').textContent = `${clouds.all}%`;
//         document.querySelector('.location .location').textContent = `${weatherData.name}, ${sys.country}`;
//         document.querySelector('.wind-speed').textContent = `${wind.speed} m/s`;
//         document.querySelector('.humidity').textContent = `${main.humidity}%`;
//         document.querySelector('.uv-index').textContent = uvIndex;
//         document.querySelector('.air-quality').textContent = airQuality;

//         const sunriseTime = new Date(sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         const sunsetTime = new Date(sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         document.querySelector('.sunrise').textContent = sunriseTime;
//         document.querySelector('.sunset').textContent = sunsetTime;

//         updateBackgroundAndIcon(weather[0].description);
//     }

//     function updateTemperature() {
//         const query = document.getElementById('query').value;
//         fetchWeatherData(query)
//             .then(({ weatherData, uvData, airQualityData }) => {
//                 updateWeatherData(weatherData, uvData, airQualityData);
//             })
//             .catch(error => {
//                 if (error === 'City not found') {
//                     alert('City not found. Please enter a valid city name.');
//                 } else {
//                     console.error('Error fetching weather data:', error);
//                     alert('Failed to fetch weather data. Please try again later.');
//                 }
//             });
//     }

//     function updateBackgroundAndIcon(description) {
//         const body = document.body;
//         switch (description) {
//             case 'clear sky':
//                 body.style.backgroundImage = "url('clearsky.jpg')";
//                 break;
//             case 'few clouds':
//                 body.style.backgroundImage = "url('fewclouds.jpg')";
//                 break;
//             case 'scattered clouds':
//                 body.style.backgroundImage = "url('scattered-clouds.jpg')";
//                 break;
//             case 'broken clouds':
//                 body.style.backgroundImage = "url('broken.jpg')";
//                 break;
//             case 'shower rain':
//                 body.style.backgroundImage = "url('showerrain.jpg')";
//                 break;
//             case 'rain':
//                 body.style.backgroundImage = "url('rain.jpg')";
//                 break;
//             case 'thunderstorm':
//                 body.style.backgroundImage = "url('thunderstorm.jpg')";
//                 break;
//             case 'snow':
//                 body.style.backgroundImage = "url('snow.jpg')";
//                 break;
//             case 'mist':
//                 body.style.backgroundImage = "url('mist.jpg')";
//                 break;
//             default:
//                 body.style.backgroundImage = "url('default.jpg')";
//                 break;
//         }
//     }
// });

// celsiusButton.addEventListener('click', () => {
//     if (!celsiusButton.classList.contains('active')) {
//       celsiusButton.classList.add('active');
//       fahrenheitButton.classList.remove('active');
//       convertTemperature('C');
//     }
//   });
  
//   fahrenheitButton.addEventListener('click', () => {
//     if (!fahrenheitButton.classList.contains('active')) {
//       fahrenheitButton.classList.add('active');
//       celsiusButton.classList.remove('active');
//       convertTemperature('F');
//     }
//   });
  
//   function convertTemperature(unit) {
//     const currentTemp = parseFloat(tempElement.textContent);
//     if (unit === 'C') {
//       tempElement.textContent = Math.round((currentTemp - 32) * (5 / 9));
//       tempUnitElement.textContent = '°C';
//     } else if (unit === 'F') {
//       tempElement.textContent = Math.round((currentTemp * (9 / 5)) + 32);
//       tempUnitElement.textContent = '°F';
//     }
//   }
  
//   document.addEventListener('DOMContentLoaded', () => {
//     fetchWeatherData('New York');
//   });


// function fetchWeatherData(location) {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
//     const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
//     const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

//     return new Promise((resolve, reject) => {
//         fetch(weatherUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('City not found');
//                 }
//                 return response.json();
//             })
//             .then(weatherData => {
//                 const { coord } = weatherData;
//                 const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
//                 const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

//                 Promise.all([
//                     fetch(uvUrl),
//                     fetch(airQualityUrl)
//                 ])
//                 .then(responses => {
//                     return Promise.all(responses.map(response => response.json()));
//                 })
//                 .then(([uvData, airQualityData]) => {
//                     resolve({ weatherData, uvData, airQualityData });
//                 })
//                 .catch(error => {
//                     reject(error);
//                 });
//             })
//             .catch(error => {
//                 reject(error.message);
//             });
//     });
// }

// function updateWeatherData(weatherData, uvData, airQualityData) {
//     const { temp } = weatherData.main;
//     const { icon, description } = weatherData.weather[0];
//     const { speed } = weatherData.wind;
//     const { humidity, visibility } = weatherData.main;
//     const { sunrise, sunset } = weatherData.sys;
//     const { value: uvIndex } = uvData;
//     const airQuality = airQualityData.list[0].main.aqi;

//     const visibilityInKm = parseInt(visibility / 1000);

//     document.querySelector('.temp').textContent = Math.round(temp);
//     document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
//     document.getElementById('condition').textContent = description;
//     document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
//     document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//     document.querySelector('.wind-speed').textContent = `${speed} m/s`;
//     document.querySelector('.humidity').textContent = `${humidity}%`;
//     document.querySelector('.visibility').textContent = `${visibilityInKm.toFixed(1)} km`;
//     document.querySelector('.uv-index').textContent = uvIndex;
//     document.querySelector('.air-quality').textContent = airQuality;

//     const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     document.querySelector('.sunrise').textContent = sunriseTime;
//     document.querySelector('.sunset').textContent = sunsetTime;

//     updateBackgroundAndIcon(description);
// }

// function updateBackgroundAndIcon(description) {
//     const body = document.body;
//     switch (description) {
//         case 'clear sky':
//             body.style.backgroundImage = "url('clearsky.jpg')";
//             break;
//         case 'few clouds':
//             body.style.backgroundImage = "url('fewclouds.jpg')";
//             break;
//         case 'scattered clouds':
//             body.style.backgroundImage = "url('scattered-clouds.jpg')";
//             break;
//         case 'broken clouds':
//             body.style.backgroundImage = "url('broken.jpg')";
//             break;
//         case 'shower rain':
//             body.style.backgroundImage = "url('showerrain.jpg')";
//             break;
//         case 'rain':
//             body.style.backgroundImage = "url('rain.jpg')";
//             break;
//         case 'thunderstorm':
//             body.style.backgroundImage = "url('thunderstorm.jpg')";
//             break;
//         case 'snow':
//             body.style.backgroundImage = "url('snow.jpg')";
//             break;
//         case 'mist':
//             body.style.backgroundImage = "url('mist.jpg')";
//             break;
//         default:
//             body.style.backgroundImage = "url('default.jpg')";
//             break;
//     }
// }

// // Event listener for search form submission
// document.getElementById('search').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const query = document.getElementById('query').value;
//     if (query.trim().length === 0) {
//         alert('Please enter a city name');
//         return;
//     }

//     fetchWeatherData(query)
//         .then(({ weatherData, uvData, airQualityData }) => {
//             updateWeatherData(weatherData, uvData, airQualityData);
//         })
//         .catch(error => {
//             if (error === 'City not found') {
//                 alert('City not found. Please enter a valid city name.');
//             } else {
//                 console.error('Error fetching weather data:', error);
//                 alert('Failed to fetch weather data. Please try again later.');
//             }
//         });
// });








// async function fetchWeatherData(location) {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
//     const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat={LAT}&lon={LON}&appid=${apiKey}`;
//     const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid=${apiKey}`;

//     try {
//         const weatherResponse = await fetch(weatherUrl);
//         const weatherData = await weatherResponse.json();

//         // Extract coordinates for UV and air quality data
//         const { coord } = weatherData;
//         const uvResponse = await fetch(uvUrl.replace('{LAT}', coord.lat).replace('{LON}', coord.lon));
//         const uvData = await uvResponse.json();

//         const airQualityResponse = await fetch(airQualityUrl.replace('{LAT}', coord.lat).replace('{LON}', coord.lon));
//         const airQualityData = await airQualityResponse.json();

//         updateWeatherData(weatherData, uvData, airQualityData);
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//         alert('Failed to fetch weather data. Please try again later.');
//     }
// }

// function updateWeatherData(weatherData, uvData, airQualityData) {
//     const { temp } = weatherData.main;
//     const { icon, description } = weatherData.weather[0];
//     const { speed } = weatherData.wind;
//     const { humidity, visibility } = weatherData.main;
//     const { sunrise, sunset } = weatherData.sys;
//     const { value: uvIndex } = uvData;
//     const airQuality = airQualityData.list[0].main.aqi;

//     const visibilityInKm = visibility / 1000;

//     document.querySelector('.temp').textContent = Math.round(temp);
//     document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
//     document.getElementById('condition').textContent = description;
//     document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
//     document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//     document.querySelector('.wind-speed').textContent = `${speed} m/s`;
//     document.querySelector('.humidity').textContent = `${humidity}%`;
//     document.querySelector('.visibility').textContent = `${visibility / 1000} km`;
//     document.querySelector('.uv-index').textContent = uvIndex;
//     document.querySelector('.air-quality').textContent = airQuality;

//     const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     document.querySelector('.sunrise').textContent = sunriseTime;
//     document.querySelector('.sunset').textContent = sunsetTime;

//     // Call the updateBackgroundAndIcon function here
//     updateBackgroundAndIcon(description);
// }

// function updateBackgroundAndIcon(description) {
//     const body = document.body;
//     switch (description) {
//         case 'clear sky':
//             body.style.backgroundImage = "url('clearsky.jpg')";
//             break;
//         case 'few clouds':
//             body.style.backgroundImage = "url('fewclouds.jpg')";
//             break;
//         case 'scattered clouds':
//             body.style.backgroundImage = "url('scattered-clouds.jpg')";
//             break;
//         case 'broken clouds':
//             body.style.backgroundImage = "url('broken.jpg')";
//             break;
//         case 'shower rain':
//             body.style.backgroundImage = "url('showerrain.jpg')";
//             break;
//         case 'rain':
//             body.style.backgroundImage = "url('rain.jpg')";
//             break;
//         case 'thunderstorm':
//             body.style.backgroundImage = "url('thunderstorm.jpg')";
//             break;
//         case 'snow':
//             body.style.backgroundImage = "url('snow.jpg')";
//             break;
//         case 'mist':
//             body.style.backgroundImage = "url('mist.jpg')";
//             break;
//         default:
//             body.style.backgroundImage = "url('default.jpg')";
//             break;
//     }
// }

// // Event listener for search form submission
// document.getElementById('search').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const query = document.getElementById('query').value;
//     if (query) {
//         fetchWeatherData(query);
//     }
// });














// async function fetchWeatherData(location) {
//     const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
//     const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
//     const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat={LAT}&lon={LON}&appid=${apiKey}`;
//     const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid=${apiKey}`;

//     try {
//         const weatherResponse = await fetch(weatherUrl);
//         const weatherData = await weatherResponse.json();

//         // Extract coordinates for UV and air quality data
//         const { coord } = weatherData;
//         const uvResponse = await fetch(uvUrl.replace('{LAT}', coord.lat).replace('{LON}', coord.lon));
//         const uvData = await uvResponse.json();

//         const airQualityResponse = await fetch(airQualityUrl.replace('{LAT}', coord.lat).replace('{LON}', coord.lon));
//         const airQualityData = await airQualityResponse.json();

//         updateWeatherData(weatherData, uvData, airQualityData);
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//         alert('Failed to fetch weather data. Please try again later.');
//     }
// }

// function updateWeatherData(weatherData, uvData, airQualityData) {
//     const { temp } = weatherData.main;
//     const { icon, description } = weatherData.weather[0];
//     const { speed } = weatherData.wind;
//     const { humidity, visibility } = weatherData.main;
//     const { sunrise, sunset } = weatherData.sys;
//     const { value: uvIndex } = uvData;
//     const airQuality = airQualityData.list[0].main.aqi;

//     document.querySelector('.temp').textContent = Math.round(temp);
//     document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
//     document.getElementById('condition').textContent = description;
//     document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
//     document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//     document.querySelector('.wind-speed').textContent = `${speed} m/s`;
//     document.querySelector('.humidity').textContent = `${humidity}%`;
//     document.querySelector('.visibility').textContent = `${visibility / 1000} km`;
//     document.querySelector('.uv-index').textContent = uvIndex;
//     document.querySelector('.air-quality').textContent = airQuality;

//     const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     document.querySelector('.sunrise').textContent = sunriseTime;
//     document.querySelector('.sunset').textContent = sunsetTime;

//     // Call the updateBackgroundAndIcon function here
//     updateBackgroundAndIcon(description);
// }

// function updateBackgroundAndIcon(description) {
//     const body = document.body;
//     switch (description) {
//         case 'clear sky':
//             body.style.backgroundImage = "url('clearsky.jpg')";
//             break;
//         case 'few clouds':
//             body.style.backgroundImage = "url('fewclouds.jpg')";
//             break;
//         case 'scattered clouds':
//             body.style.backgroundImage = "url('scattered-clouds.jpg')";
//             break;
//         case 'broken clouds':
//             body.style.backgroundImage = "url('broken.jpg')";
//             break;
//         case 'shower rain':
//             body.style.backgroundImage = "url('showerrain.jpg')";
//             break;
//         case 'rain':
//             body.style.backgroundImage = "url('rain.jpg')";
//             break;
//         case 'thunderstorm':
//             body.style.backgroundImage = "url('thunderstorm.jpg')";
//             break;
//         case 'snow':
//             body.style.backgroundImage = "url('snow.jpg')";
//             break;
//         case 'mist':
//             body.style.backgroundImage = "url('mist.jpg')";
//             break;
//         default:
//             body.style.backgroundImage = "url('default.jpg')";
//             break;
//     }
// }

// // Event listener for search form submission
// document.getElementById('search').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const query = document.getElementById('query').value;
//     if (query) {
//         fetchWeatherData(query);
//     }
// });











// function updateWeatherData(weatherData, uvData, airQualityData) {
//     const { temp } = weatherData.main;
//     const { icon, description } = weatherData.weather[0];
//     const { speed } = weatherData.wind;
//     const { humidity, visibility } = weatherData.main;
//     const { sunrise, sunset } = weatherData.sys;
//     const { value: uvIndex } = uvData;
//     const airQuality = airQualityData.list[0].main.aqi;

//     document.querySelector('.temp').textContent = Math.round(temp);
//     document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
//     document.getElementById('condition').textContent = description;
//     document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
//     document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
//     document.querySelector('.wind-speed').textContent = `${speed} m/s`;
//     document.querySelector('.humidity').textContent = `${humidity}%`;
//     document.querySelector('.visibility').textContent = `${visibility / 1000} km`;
//     document.querySelector('.uv-index').textContent = uvIndex;
//     document.querySelector('.air-quality').textContent = airQuality;

//     const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     document.querySelector('.sunrise').textContent = sunriseTime;
//     document.querySelector('.sunset').textContent = sunsetTime;
    
//     // Call the updateBackgroundAndIcon function here
//     updateBackgroundAndIcon(description);
// }

// function updateBackgroundAndIcon(description) {
//     const body = document.body;
//     switch(description) {
//         case 'clear sky':
//             body.style.backgroundImage = "url('clearsky.jpg')";
//             break;
//         case 'few clouds':
//             body.style.backgroundImage = "url('fewclouds.jpg')";
//             break;
//         case 'scattered clouds':
//             body.style.backgroundImage = "url('scattered-clouds.jpg')";
//             break;
//         case 'broken clouds':
//             body.style.backgroundImage = "url('broken.jpg')";
//             break;
//         case 'shower rain':
//             body.style.backgroundImage = "url('showerrain.jpg')";
//             break;
//         case 'rain':
//             body.style.backgroundImage = "url('rain.jpg')";
//             break;
//         case 'thunderstorm':
//             body.style.backgroundImage = "url('thunderstorm.jpg')";
//             break;
//         case 'snow':
//             body.style.backgroundImage = "url('snow.jpg')";
//             break;
//         case 'mist':
//             body.style.backgroundImage = "url('mist.jpg')";
//             break;
//         default:
//             body.style.backgroundImage = "url('default.jpg')";
//             break;
//     }
// }


// const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key

// document.getElementById('search').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const query = document.getElementById('query').value;
//     getWeatherData(query);
// });

// async function getWeatherData(location) {
//     try {
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
//         const data = await response.json();
//         if (response.ok) {
//             updateWeatherData(data);
//         } else {
//             console.error('Error fetching weather data:', data.message);
//         }
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//     }
// }

// function updateWeatherData(data) {
//     const { temp } = data.main;
//     const { icon, description } = data.weather[0];
//     const { speed } = data.wind;
//     const { humidity, visibility } = data.main;
//     const { sunrise, sunset } = data.sys;

//     document.querySelector('.temp').textContent = Math.round(temp);
//     document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
//     document.getElementById('condition').textContent = description;
//     document.getElementById('rain').textContent = `${data.clouds.all}%`;
//     document.querySelector('.location .location').textContent = `${data.name}, ${data.sys.country}`;
//     document.querySelector('.wind-speed').textContent = `${speed} m/s`;
//     document.querySelector('.humidity').textContent = `${humidity}%`;
//     document.querySelector('.visibility').textContent = `${visibility / 1000} km`;

//     const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     document.querySelector('.sunrise').textContent = sunriseTime;
//     document.querySelector('.sunset').textContent = sunsetTime;
// }
