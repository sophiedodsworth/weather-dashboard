// declaring global variables

var APIkey = "8f2d65f42c8a54965d177a0074d59cb7"
var openWeatherURL = 'https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}'

// Creating an AJAX call for the search button being clicked
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(queryURL)
    console.log(response)
});