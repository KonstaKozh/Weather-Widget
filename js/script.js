"use strict"

//Блок с погодой
const weatherBlock = document.querySelector('#weather');

async function loadWeather(e) {
    weatherBlock.innerHTML = `
        <div class="weather__loading">
            <img src="/img/loading.gif" alt="Loading...">
        </div>`;
    const [lat, lon] = e.coord;
    const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=3271c2ed7c22a57273a4549fd585d36f`;
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();
    if (e.myCityGeolocation) {
        responseResult.name = e.myCityGeolocation;
    }
    if (response.ok) {
        getWeather(responseResult);
    } else {
        weatherBlock.innerHTML = responseResult.message;
    }
}

function getWeather(data) {
    // Обработка выводимых данных
    const location = data.name;
    const temp= Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const weatherStatus = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;
    
    // HTML шаблон
    weatherBlock.innerHTML = `
        <div class="weather__header">
            <div class="weather__main">
                <div class="weather__city">${location}</div>
                <div class="weather__status">${weatherStatus}</div>
            </div>
            <div class="weather__icon">
                <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherStatus}">
            </div>
        </div>
        <div class="weather__temp">${temp}</div>
        <div class="weather__feels-like">Feels-like: ${feelsLike}</div>`;
}

function init() {
    let geolocation = ymaps.geolocation;
    geolocation.get({
        provider: 'auto',
        mapStateAutoApply: true
    }).then(function (result) {
        const myGeolocation = {
            myCityGeolocation: result.geoObjects.get(0).properties.get(
                'metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName'
                ),
            coord: result.geoObjects.position
        };
        return (myGeolocation)
    }).then(myGeolocation => {
        if (weatherBlock) {
            loadWeather(myGeolocation);
        }
    }).catch(error => console.log(error.message))
}

function error() {
    weatherBlock.innerHTML = `
        <div class="weather__error">
            <span>Невозможно получить ваше местоположение, необходим доступ к геоданным</span>
        </div>`;
}

if (!navigator.geolocation) {
    alert('Geolocation не поддерживается вашим браузером');
} else {
    const success = () => ymaps.ready(init);
    navigator.geolocation.getCurrentPosition(success, error);
}


