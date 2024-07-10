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



