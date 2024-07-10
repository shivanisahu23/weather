function fetchWeatherData(location) {
    const apiKey = '79547320160cce3a656e250f9e396443'; // Replace with your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const uvUrlBase = 'https://api.openweathermap.org/data/2.5/uvi';
    const airQualityUrlBase = 'https://api.openweathermap.org/data/2.5/air_pollution';

    return new Promise((resolve, reject) => {
        fetch(weatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('City not found');
                }
                return response.json();
            })
            .then(weatherData => {
                const { coord } = weatherData;
                const uvUrl = `${uvUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
                const airQualityUrl = `${airQualityUrlBase}?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;

                Promise.all([
                    fetch(uvUrl),
                    fetch(airQualityUrl)
                ])
                .then(responses => {
                    return Promise.all(responses.map(response => response.json()));
                })
                .then(([uvData, airQualityData]) => {
                    resolve({ weatherData, uvData, airQualityData });
                })
                .catch(error => {
                    reject(error);
                });
            })
            .catch(error => {
                reject(error.message);
            });
    });
}

function updateWeatherData(weatherData, uvData, airQualityData) {
    const { temp } = weatherData.main;
    const { icon, description } = weatherData.weather[0];
    const { speed } = weatherData.wind;
    const { humidity, visibility } = weatherData.main;
    const { sunrise, sunset } = weatherData.sys;
    const { value: uvIndex } = uvData;
    const airQuality = airQualityData.list[0].main.aqi;

    const visibilityInKm = parseInt(visibility / 1000);

    document.querySelector('.temp').textContent = Math.round(temp);
    document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
    document.getElementById('condition').textContent = description;
    document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
    document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    document.querySelector('.wind-speed').textContent = `${speed} m/s`;
    document.querySelector('.humidity').textContent = `${humidity}%`;
    document.querySelector('.visibility').textContent = `${visibilityInKm.toFixed(1)} km`;
    document.querySelector('.uv-index').textContent = uvIndex;
    document.querySelector('.air-quality').textContent = airQuality;

    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.sunrise').textContent = sunriseTime;
    document.querySelector('.sunset').textContent = sunsetTime;

    updateBackgroundAndIcon(description);
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

// Event listener for search form submission
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
            if (error === 'City not found') {
                alert('City not found. Please enter a valid city name.');
            } else {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data. Please try again later.');
            }
        });
});








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
