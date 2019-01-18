const WEATHERID = '883c60199f4ab1918c8824abd1c33701';
const FORECASTID = 'e2d18e7db542e4d72b29b0c7a61f25bc';

const city = document.querySelector('#city');
const country = document.querySelector('#country');
const degree = document.querySelector('#degree');
const dateCity = document.querySelector('#dateCity');
const windspeed = document.querySelector('#windspeed');
const note = document.querySelector('#note');
const sunrise = document.querySelector('#sunrise');
const sunset = document.querySelector('#sunset');
const searchField = document.querySelector('#cityField');

var sCity = "Abbott";
var sCityID = "";

/* ==============================  Search field ============================== */
searchField.addEventListener('keyup', function(){
    var qSearch = searchField.value;

    if (qSearch.length >= 2){
        var sURL = `http://gd.geobytes.com/AutoCompleteCity?callback=?&q=`+qSearch;
        console.log(sURL);
    }
});

/* ============================== Weather 1 day ============================== */
var url = `https://api.openweathermap.org/data/2.5/weather?q=${sCity}&appid=${WEATHERID}`;

async function fetchAsync(x){
    let response = await fetch(x);
    let data = await response.json();
    return data;
}

function unix_timestamp(t){
    var dt = new Date(t*1000);
    var hr = dt.getHours();
    var m = "0" + dt.getMinutes();
    var s = "0" + dt.getSeconds();

    return hr+':'+m.substr(-2);
}

fetchAsync(url)
.then(function(data){

    // City date
    const dt = new Date(data.dt*1000);
    const day = dt.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const m = monthNames[dt.getMonth()];

    const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const weekday = weekNames[dt.getUTCDay()];

    // Print out each data in Frontend
    dateCity.innerHTML = `${weekday} - ${m} ${day}`;
    city.innerHTML = data.name;
    country.innerHTML = data.sys.country;
    windspeed.innerHTML = data.wind.speed + ' m/s';
    note.innerHTML = data.weather[0].main;
    sunrise.innerHTML = unix_timestamp(data.sys.sunrise);
    sunset.innerHTML = unix_timestamp(data.sys.sunset);

    // Kelvin formula C = K - 273.15
    let celsius = Math.ceil(data.main.temp - 273.15);
    degree.innerHTML = celsius + '&deg;';

    // Set city ID for Forecast
    sCityID = data.id;
})
.catch(reason => console.error(reason.message));


// var cityList = `http://192.168.64.2/app/weather/src/city-list.json`;
// fetchAsync(cityList)
//     .then(function(data){
//         // console.log(data[0].name);

//         for (let i = 0; i < data.length; i++) {
//             const elm = data[i].name;
//             console.log(elm);
//         }
//     })
//     .catch(reason => console.error(reason.message));



/* ============================== Forecast 5 days ============================== */
var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${sCity}&appid=${FORECASTID}`;
var forecastHTML = document.querySelector('#forecast');

// Forecast 5 days
fetchAsync(forecastURL)
.then(function(foredata){
    var forecastList = foredata.list.slice(8,88);

    var newArr = [];
    var newArr = forecastList.filter(function(value, index, Arr) {
        return index % 8 == 0;
    });

    newArr.forEach(elm => {
        let newdt = new Date(elm.dt*1000);
        let hr = newdt.getHours();
        let m = "0" + newdt.getMinutes();
        let weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let weekday = weekNames[newdt.getUTCDay()];
        let time = hr+':'+m.substr(-2);

        forecastHTML.innerHTML += 
        `<div class="item">
            <div class='i-title'>${weekday} - <span>${time}</span></div>
            <div class='i-details'>
                <span class='i-data deg'>
                    ${Math.ceil(elm.main.temp_min - 273.15)}&deg;
                </span>
                <span class='i-data'>${elm.weather[0].main}</span>
            </div>
        </div>`;
    });
})
.catch(reason => console.error(reason.message));



/* ----- Settings ----- */
function newTime(){
    let time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    console.log(`${h} : ${m} : ${s}`);
}


/* ============================== Theme settings ============================== */
$(document).ready(function() {
    const displayWrap = $('#display');
    const settingBtn = $('#setting');
    const themeCont = $('#themeSetting');
    const mainBody = $('#app');


    settingBtn.on('click', function(){
        themeCont.toggleClass('show');
    });

    var themeBtn = $('.theme-btn');
    themeBtn.on('click', function(){
        themeID = $(this).attr('theme-id');

        // Close Theme menu
        themeCont.toggleClass('show');

        displayWrap.removeClass();
        displayWrap.addClass(themeID);

        mainBody.removeClass();
        mainBody.addClass(themeID);

        if(themeID == 'default') {
            displayWrap.removeClass();
            mainBody.removeClass();
        }
    });
});
