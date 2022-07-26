"use strict"

//Блок с погодой
const weatherBlock = document.querySelector('#weather');

async function loadWeather(e) {
    weatherBlock.innerHTML = `
        <div class="weather__loading">
            <img src="/img/loading.gif" alt="Loading...">
        </div>`;
    
    const server = 'https://api.openweathermap.org/data/2.5/weather?units=metric&id=499099&appid=3271c2ed7c22a57273a4549fd585d36f';
    const response = await fetch(server, {
        method: 'GET',
    });
    const responseResult = await response.json();
    
    if (response.ok) {
        getWeather(responseResult);
    } else {
        weatherBlock.innerHTML = responseResult.message;
    }
}

function getWeather(data) {
    // Обработка выводимых данных
    // const location = data.name;
    // console.log('mySityGeolocation', mySityGeolocation);
    // const location = mySityGeolocation;
    const temp= Math.round(data.main.temp);
    const fealsLike = Math.round(data.main.feels_like);
    const weatherStatus = data.weather[0].main;
    const weatherIcon = data.weather[0].icon;
    
    // HTML шаблон
    const template = `
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
        <div class="weather__feels-like">Feels-like: ${fealsLike}</div>`; 

    weatherBlock.innerHTML = template;
}

if (weatherBlock) {
    loadWeather();
}

// navigator.geolocation.getCurrentPosition(
//     function(position) {
// 	    console.log('Последний раз вас засекали здесь: ' +
// 		    position.coords.latitude + ", " + position.coords.longitude);
//         console.log(position)    
// 	}
// );

ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation;
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
            const mySityGeolocation = result.geoObjects.get(0).properties.get(
                'metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName'
                )
            console.log(mySityGeolocation);
            return mySityGeolocation;
    }).then(function() {
        console.log(mySityGeolocation)
    })
}
