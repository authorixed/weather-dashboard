const apiKey = '0f837cd0113fbb4d15021006c10435a2';
const searchBtn = document.getElementById('search-btn');
const backBtn = document.getElementById('back-btn');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');
const searchSection = document.getElementById('search-section');
const weatherSection = document.getElementById('weather-section');


searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
        addToSearchHistory(city);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        displayCurrentWeather(data);
        displayForecast(data);
        searchSection.classList.add('hidden');
        weatherSection.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayCurrentWeather(data) {
    const city = data.city.name;
    const current = data.list[0];
    const weatherHTML = `
        <h2>Current Weather in ${city}</h2>
        <p>Date: ${new Date(current.dt * 1000).toLocaleDateString()}</p>
        <p>Temperature: ${current.main.temp} °C</p>
        <p>Humidity: ${current.main.humidity} %</p>
        <p>Wind Speed: ${current.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
    `;
    currentWeather.innerHTML = weatherHTML;
}

function displayForecast(data) {
    let forecastHTML = '<h2>5-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        forecastHTML += `
            <div>
                <p>Date: ${new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${day.main.temp} °C</p>
                <p>Humidity: ${day.main.humidity} %</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            </div>
        `;
    }
    forecast.innerHTML = forecastHTML;
}

function addToSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        displaySearchHistory();
    }
}

function displaySearchHistory() {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.innerHTML = history.map(city => `<button onclick="getWeather('${city}')">${city}</button>`).join('');
}

window.onload = displaySearchHistory;
