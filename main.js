import API_KEY from "./apikey.js";

const submit = document.querySelector('[data-submit]');
const fieldData = document.querySelector('[data-field]');

submit.addEventListener('click', () => {
    const city = fieldData.value;
    connect(city);
})

const connect = async city => {
    try {
        //const apiKey = '8237ad9005288901b410f59e0b6aa774';
        const apiURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.cod == "404") {
            throw new Error("Unknown city name");
        }
        //console.log(response);
        console.log(data);
         document.querySelector('.text-area').classList.remove('beginning');
        document.querySelector('.container').classList.remove('hide');
        document.querySelector('.localTime').classList.remove('hide');
       

        document.getElementById('country').innerHTML = `${data.name}, ${data.sys.country}`;
        document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}&#8451;`;
       document.getElementById('humidity').innerHTML = `${data.main.humidity} %`;
        document.getElementById('wind-speed').innerHTML = `${data.wind.speed} m/s`;

        const getHumid = document.getElementById('humidity');
        const myImage = document.createElement('img');
        myImage.src = 'images/03d@2x.png';
        myImage.classList.add('humid-image');
        getHumid.appendChild(myImage);
        getHumid.insertAdjacentElement("afterbegin", myImage);

        const getWindSpeed = document.getElementById('wind-speed');
        const myImage2 = document.createElement('img');
        myImage2.src = 'images/03d@2x.png';
        myImage2.classList.add('windspeed-image');
        getWindSpeed.appendChild(myImage2);
        getWindSpeed.insertAdjacentElement("afterbegin", myImage2);

        //document.getElementById('my-image').src = 'images/03d@2x.png';
        //document.getElementById('wind-speed-image').src = 'images/03d@2x.png';
        //document.getElementById('description').innerHTML = data.weather[0].description;
        // weatherImage.src = `http://openweathermap.org/img/wn/${loc}@2x.png`
        //const sunrise = new Date((data.sys.sunrise + data.timezone) * 1000);
        //const sunset = new Date((data.sys.sunset + data.timezone) * 1000);
        let loc = data.weather[0].icon;
        document.getElementById('icon').src = `http://openweathermap.org/img/wn/${loc}@2x.png`;
        let timestr = new Date(data.dt * 1000 + (data.timezone * 1000));
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        getForecast(lat, lon, timestr);
    } catch (error) {
        console.log(error);
    }
}

const getForecast = async (lat, lon, timestr) => {
    //const apiKey = '8237ad9005288901b410f59e0b6aa774';
    const apiURL = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(apiURL);
    const data = await response.json();


    document.querySelectorAll('.hourlyContainer').forEach(e => e.remove());


    document.querySelector('.localTime').innerHTML = timestr;
    console.log(data);
    let hours = timestr.getHours();
    console.log(hours + " current hours");
    //         i = 13,     13 <= 37, once we reach 24 set to 00:00, 
    for (let i = hours; i <= hours + 24; i += 3) {
        const forecast = document.querySelector('.forecast'); //main

        const hourlyContainer = document.createElement('div'); //seperate
        hourlyContainer.classList.add("hourlyContainer");
        forecast.appendChild(hourlyContainer);

        const timeIncrement = document.createElement('div');
        timeIncrement.classList.add("timeIncrement");
        timeIncrement.innerHTML = `${i}:00`;
        if (i < 10) {
            timeIncrement.innerHTML = `0${i}:00`;
        }
        console.log(i + " is");
        if (i >= 24) {
            //i = 0; 27-24 =3, 30-24, 6
            let resetHour = i - 24;
            console.log(resetHour + " reset");
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
        windSpeed.innerHTML = `${data.hourly[i].wind_speed}`;
        temperature.appendChild(windSpeed);


    }
}