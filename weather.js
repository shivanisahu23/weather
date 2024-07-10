function updateWeatherData(weatherData, uvData, airQualityData) {
    const { temp } = weatherData.main;
    const { icon, description } = weatherData.weather[0];
    const { speed } = weatherData.wind;
    const { humidity, visibility } = weatherData.main;
    const { sunrise, sunset } = weatherData.sys;
    const { value: uvIndex } = uvData;
    const airQuality = airQualityData.list[0].main.aqi;

    document.querySelector('.temp').textContent = Math.round(temp);
    document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}.png`;
    document.getElementById('condition').textContent = description;
    document.getElementById('rain').textContent = `${weatherData.clouds.all}%`;
    document.querySelector('.location .location').textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    document.querySelector('.wind-speed').textContent = `${speed} m/s`;
    document.querySelector('.humidity').textContent = `${humidity}%`;
    document.querySelector('.visibility').textContent = `${visibility / 1000} km`;
    document.querySelector('.uv-index').textContent = uvIndex;
    document.querySelector('.air-quality').textContent = airQuality;

    const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.querySelector('.sunrise').textContent = sunriseTime;
    document.querySelector('.sunset').textContent = sunsetTime;
    
    // Call the updateBackgroundAndIcon function here
    updateBackgroundAndIcon(description);
}

function updateBackgroundAndIcon(description) {
    const body = document.body;
    switch(description) {
        case 'clear sky':
            body.style.backgroundImage = "url('path/to/clear-sky.jpg')";
            break;
        case 'few clouds':
            body.style.backgroundImage = "url('path/to/few-clouds.jpg')";
            break;
        case 'scattered clouds':
            body.style.backgroundImage = "url('path/to/scattered-clouds.jpg')";
            break;
        case 'broken clouds':
            body.style.backgroundImage = "url('path/to/broken-clouds.jpg')";
            break;
        case 'shower rain':
            body.style.backgroundImage = "url('path/to/shower-rain.jpg')";
            break;
        case 'rain':
            body.style.backgroundImage = "url('path/to/rain.jpg')";
            break;
        case 'thunderstorm':
            body.style.backgroundImage = "url('path/to/thunderstorm.jpg')";
            break;
        case 'snow':
            body.style.backgroundImage = "url('path/to/snow.jpg')";
            break;
        case 'mist':
            body.style.backgroundImage = "url('path/to/mist.jpg')";
            break;
        default:
            body.style.backgroundImage = "url('path/to/default.jpg')";
            break;
    }
}


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
