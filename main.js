import API_KEY from "./apikey.js";

const submit = document.querySelector('[data-submit]');
const fieldData = document.querySelector('[data-field]');
const getHumid = document.getElementById('humidity');
const getCountry = document.getElementById('country');
const getTemperature = document.getElementById('temperature');
const getWindSpeed = document.getElementById('wind-speed');


submit.addEventListener('click', () => {
    const city = fieldData.value;
    connect(city);
})

const connect = async city => {
    try {
        const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        const { name, coord: { lon, lat }, weather: [{ icon }], main: { temp, humidity }, wind: { speed }, sys: { country } } = data;

        document.querySelector('.text-area').classList.remove('beginning');
        document.querySelector('.container').classList.remove('hide');
        document.querySelector('.localTime').classList.remove('hide');

        //const getHumid = document.getElementById('humidity');
        //const getCountry = document.getElementById('country');
       // const getTemperature = document.getElementById('temperature');
        //const getWindSpeed = document.getElementById('wind-speed');

        getCountry.innerHTML = `${name}, ${country}`;
        getTemperature.innerHTML = `${Math.round(temp)}&#8451;`;
        getHumid.innerHTML = `${humidity} %`;
        getWindSpeed.innerHTML = `${speed} m/s`;

        //const getHumid = document.getElementById('humidity');
        const myImage = document.createElement('img');
        myImage.src = 'images/03d@2x.png';
        myImage.classList.add('humid-image');
        getHumid.appendChild(myImage);
        getHumid.insertAdjacentElement("afterbegin", myImage);

        //const getWindSpeed = document.getElementById('wind-speed');
        const myImage2 = document.createElement('img');
        myImage2.src = 'images/03d@2x.png';
        myImage2.classList.add('windspeed-image');
        getWindSpeed.appendChild(myImage2);
        getWindSpeed.insertAdjacentElement("afterbegin", myImage2);

        const myIcon = document.getElementById('icon');
        myIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        let timestr = new Date(data.dt * 1000 + (data.timezone * 1000));
        getForecast(lat, lon, timestr);
    } catch (error) {
        console.log(error);
    }
}

const getForecast = async (lat, lon, timestr) => {
    try {
        const apiURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        document.querySelectorAll('.hourlyContainer').forEach(e => e.remove());

        document.querySelector('.localTime').innerHTML = timestr;
        let hours = timestr.getHours();

        for (let i = hours; i <= hours + 24; i += 3) {
            const forecast = document.querySelector('.forecast');

            const hourlyContainer = document.createElement('div');
            hourlyContainer.classList.add("hourlyContainer");
            forecast.appendChild(hourlyContainer);

            const timeIncrement = document.createElement('div');
            timeIncrement.classList.add("timeIncrement");
            timeIncrement.innerHTML = `${i}:00`;
            if (i < 10) {
                timeIncrement.innerHTML = `0${i}:00`;
            }

            if (i >= 24) {
                let resetHour = i - 24;
                timeIncrement.innerHTML = `${resetHour}:00`;
            }
            hourlyContainer.appendChild(timeIncrement);

            const weatherImage = document.createElement('IMG');
            weatherImage.classList.add("weatherImage");
            let loc = data.hourly[i].weather[0].icon;
            weatherImage.src = `http://openweathermap.org/img/wn/${loc}@2x.png`
            hourlyContainer.appendChild(weatherImage)

            const temperature = document.createElement('div');
            temperature.classList.add("temperature");
            temperature.innerHTML = `${Math.round(data.hourly[i].temp)}&#8451;`;
            hourlyContainer.appendChild(temperature);

            const windSpeed = document.createElement('div');
            windSpeed.classList.add("windSpeed");
            windSpeed.innerHTML = `${data.hourly[i].wind_speed} m/s`;
            hourlyContainer.appendChild(windSpeed);
        }
    } catch (error) {
        console.log(error);
    }
}