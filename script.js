const API_KEY = "d4d701d679442575a1b6020f362a0a8a";
const geoLocation_API_URL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
const weather_API_URL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly,alerts&appid={API key}";
const searchByPIN = "http://api.openweathermap.org/geo/1.0/zip?zip=E14,GB&appid={API key}";
const place = document.getElementById("location");
const currentTemp = document.getElementById("currentTemp");
const currentWeather = document.getElementById("currentWeather");
const weatherImg = document.getElementById("weather-img");
const form = document.getElementById("form");
const search = document.getElementById("search");
const contents = document.querySelector(".contents");
const addtoFav = document.querySelector(".favorites");

const arrow = document.getElementById("arrow");
const favoriteContainer = document.querySelector(".favorite-container");
const closeBtn = document.getElementById("closeBtn");
const favList = document.querySelector(".fav-list");

let currentLocation = "";
let favArrayList = [];
function getFromLS() {
    const resp = localStorage.getItem("weatherApp");
    const cities = JSON.parse(resp);
    favArrayList = [];
    if (cities) {
        cities.forEach((city) => {
            addFavCity(city);
            favArrayList.push(city.toUpperCase());
        })
    }
}
getFromLS();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    // console.log(search.value);
    showWeather(search.value);
    search.value = "";
})


arrow.addEventListener("click", () => {
    favoriteContainer.classList.add("active");
})
closeBtn.addEventListener("click", () => {
    favoriteContainer.classList.remove("active");
})


async function getCoordinates(city) {
    try {
        const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
        const resp = await fetch(URL);
        const respData = await resp.json();
        // console.log(respData);
        if (!respData.length) {
            alert("Please enter valid name");
            return;
        }
        place.innerHTML = `${respData[0].name}, ${respData[0].state}`;
        return respData[0];
    } catch (error) {
        console.log(error);
    }
}

async function getWeatherByCity(city) {
    try {
        const geoLocation = await getCoordinates(city);
        if (!geoLocation) {
            return;
        }
        const latitude = geoLocation.lat;
        const longitude = geoLocation.lon;

        const weather_API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`;
        const resp = await fetch(weather_API_URL);
        const respData = await resp.json();
        // console.log(respData);
        return respData;
    } catch (error) {
        console.log(error);
    }
}

async function showWeather(search) {
    const data = await getWeatherByCity(search);
    // console.log(data);
    if (data == undefined) {
        return;
    }
    currentTemp.innerHTML = `${Math.floor(data.current.temp)}&#xb0`;
    currentWeather.innerHTML = data.current.weather[0].main;
    setWeatherImg(data.current.weather[0].main);
    contents.innerHTML = "";
    const ul = document.createElement("ul");
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let todayDate = new Date(data.current.dt * 1000);
    // console.log(todayDate);
    let today = todayDate.getDay();

    data.daily.slice(1, 6).forEach((day) => {
        // console.log(day);
        today++;
        today = today % 7;

        const liData = `
        <li class="days"><span class="leftPart">
            <span class="dayName">${days[today]}</span><span class="temp">${day.temp.day}&#xb0; </span></span>
        <small>${day.weather[0].main}</small></li>
        `;
        ul.insertAdjacentHTML("beforeend", liData);
    })
    contents.appendChild(ul);
    currentLocation = search;
    addtoFav.innerHTML = "+ Add Location to favourites";
    addtoFav.style.pointerEvents = 'auto';
    addtoFav.style.backgroundColor = "#6f7173";

    if (favArrayList.includes(search.toUpperCase())) {
        addtoFav.innerHTML = "Added to favourites";
        addtoFav.style.pointerEvents = 'none';
        addtoFav.style.backgroundColor = "#363636";
    }
}
if (favArrayList.length) {
    console.log(favArrayList);
    showWeather(favArrayList[0]);
}
else {
    showWeather("Kolkata");
}

addtoFav.addEventListener("click", () => {
    addFavCity();
});

function addFavCity(city = "") {
    const liTag = document.createElement("li");
    liTag.classList.add("fav-item");
    liTag.innerHTML = `
        <span class="fav-name">${(city) ? city : currentLocation.toUpperCase()}</span>
        <span class="delete">
            <button class="delete-fav-item"><i class="fa-solid fa-circle-minus"></i></button>
        </span>
        `;

    const favName = liTag.querySelector(".fav-name");
    favName.addEventListener("click", () => {
        const city = favName.innerHTML;
        favoriteContainer.classList.remove("active");
        showWeather(city);
    })

    const deleteFav = liTag.querySelector(".delete-fav-item");
    deleteFav.addEventListener("click", () => {
        liTag.remove();
        updateLS();
        addtoFav.innerHTML = "+ Add Location to favourites";
        addtoFav.style.pointerEvents = 'auto';
        addtoFav.style.backgroundColor = "#6f7173";

    })
    favList.appendChild(liTag);
    updateLS();
    favArrayList.push(currentLocation.toUpperCase());
    addtoFav.innerHTML = "Added to favourites";
    addtoFav.style.pointerEvents = 'none';
    addtoFav.style.backgroundColor = "#363636";
}


function updateLS() {
    const favNames = document.querySelectorAll(".fav-name");
    favArrayList = [];
    favNames.forEach((favName) => {
        favArrayList.push(favName.innerText.toUpperCase());
    })
    localStorage.setItem("weatherApp", JSON.stringify(favArrayList));
}

function setWeatherImg(weather) {

    switch (weather) {
        case 'Clear':
            weatherImg.src = "img/weather/sunny.jpg";
            break;
        case 'Clouds':
            weatherImg.src = "img/weather/clouds_dark.png";
            break;
        case 'Ash':
            weatherImg.src = "img/weather/dust_dark.png";
            break;
        case 'Dust':
            weatherImg.src = "img/weather/dust_dark.png";
            break;
        case 'Sand':
            weatherImg.src = "img/weather/dust_dark.png";
            break;
        case 'Fog':
            weatherImg.src = "img/weather/mist.jpg";
            break;
        case 'Haze':
            weatherImg.src = "img/weather/mist.jpg";
            break;
        case 'Mist':
            weatherImg.src = "img/weather/mist.jpg";
            break;
        case 'Smoke':
            weatherImg.src = "img/weather/mist.jpg";
            break;
        case 'Drizzle':
            weatherImg.src = "img/weather/rain.jpg";
            break;
        case 'Rain':
            weatherImg.src = "img/weather/rain.jpg";
            break;
        case 'Snow':
            weatherImg.src = "img/weather/snow.jpg";
            break;
        case 'Thunderstorm':
            weatherImg.src = "img/weather/thunderstorm.jpg";
            break;
        case 'Squall':
            weatherImg.src = "img/weather/tornado.jpg";
            break;
        case 'Tornado':
            weatherImg.src = "img/weather/tornado.jpg";
            break;
        default:
            weatherImg.src = "img/background5.jpg";
            break;

    }
}