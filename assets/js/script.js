// declaring variables

var currentDate = moment().format("DD/MM/YY");
var APIKey = "d608178db60a39a8bbf9085b8ec701e5";


$("#clear-button").on("click", function (event) {
    event.preventDefault();
    localStorage.clear()
    $("#today").html("")
    $("#forecast").html("")
    $(".input-group-append").html("")
})

// declaring search function for when a user enters a city in the location search

function searchFunction(locationSearch) {

    var city = locationSearch || $('#search-input').val();

    var geoQuery = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;

    // clearing before the new results are printed

    $("#today").html("")
    $("#forecast").html("")
 

    $.ajax({
        url: geoQuery,
        method: "GET"
    }).then(function (geoCall) {

        var latitude = (geoCall[0].lat).toFixed(2)
        var longitude = (geoCall[0].lon).toFixed(2)


        var forecastQuery = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey


        $.ajax({
            url: forecastQuery,
            method: "GET",
        }).then(function (forecastCall) {


            var temp = ((forecastCall.list[0].main.temp) - 273.15).toFixed(2)
            var wind = (forecastCall.list[0].wind.speed).toFixed(1)
            var humidity = (forecastCall.list[0].main.humidity)


            var iconCode = forecastCall.list[0].weather[0].icon;
            var icon = $('<img>');
            icon.attr({
                'id': 'icon',
                'src': "https://openweathermap.org/img/wn/" + iconCode + ".png"
            });


            var todayCard = $("<div>");
            todayCard.addClass("today-card-body");
            var todayHeaderDiv = $("<div>");
            todayHeaderDiv.css("display", "flex")
            todayHeaderDiv.css("text-transform", "capitalize")
            todayHeaderDiv.append("<h2>" + city + " ( " + currentDate + ")" + " </h2>")
                .append(icon)

            todayCard.append("<p>Temp: " + temp + " &deg;C</p>" + "<p>Wind: " + wind + " KPH</p>" + "<p>Humidity: " + humidity + " %</p>");
            todayCard.prepend(todayHeaderDiv)
            $("#today").append(todayCard);

            var forecastHeader = $("<h3>")
            forecastHeader.attr("id" , "forecast-header")
            forecastHeader.text("5-Day Forecast")
            $("#today").append(forecastHeader);


            var icons = [], temperature = [], winds = [], humid = [];
            for (var j = 7; j < forecastCall.list.length; j += 8) {
                icons.push(forecastCall.list[j].weather[0].icon);
                temperature.push(((forecastCall.list[j].main.temp) - 273.15).toFixed(2));
                winds.push(forecastCall.list[0].wind.speed).toFixed(1)
                humid.push(forecastCall.list[0].main.humidity)
            }

            for (var i = 0; i < 5; i++) {
                var futureDate = moment().add(i + 1, 'days').format("DD/MM/YY");
                var forecastCard = $("<div>");
                forecastCard.addClass("forecast-card-body");
                forecastCard.append("<h4>" + futureDate + " </h4>");

                var futureIconCode = icons[i];
                var forecastIcon = $("<img>");
                forecastIcon.attr({
                    'id': 'icon',
                    'src': "https://openweathermap.org/img/wn/" + futureIconCode + ".png"
                });

                forecastCard.append(forecastIcon)
                forecastCard.append("<p>Temp: " + temperature[i] + " °C</p>" + "<p>Wind: " + winds[i] + " KPH</p>" + "<p>Humidity: " + humid[i] + " %</p>");
                $("#forecast").append(forecastCard);
            }
        })
    })
}


$("#search-button").on("click", function (event) {
    event.preventDefault()

    locationArray = JSON.parse(localStorage.getItem("locationArray")) || [];

    if (locationArray.includes($('#search-input').val())) {
        return;
    }

    if (!$('#search-input').val()) {
        alert("Please enter the name of a city to continue.");
        return;
    }
    else {
        locationArray.push($('#search-input').val());
        localStorage.setItem("locationArray", JSON.stringify(locationArray));
    }
    searchFunction()
    previouslySearched()
    $(".form-input ").val("");
    
})


    function previouslySearched() {

            var city = $('#search-input').val();
   
            var geoQuery = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;
    
            $.ajax({
                url: geoQuery,
                method: "GET"
            }).then(function (geoCall) {

            if (geoCall.length == 0) {
                alert("Please enter a valid location name")}
            
else {
                var previousEntry = $("<button>");
                previousEntry.text(city);
                previousEntry.attr({
                    "id": "city-button",
                    "type": "button"
                });

                previousEntry.addClass("btn btn-info btn-block city-button");
                $(".input-group-append").prepend(previousEntry);

                previousEntry.on("click", function (event) {
                    event.preventDefault()
                    var locationSearch = ($(this).text());
                    searchFunction(locationSearch)
                })
            }}
    
        )}


$(document).ready(function () {

    locationArray = JSON.parse(localStorage.getItem("locationArray")) || []
    if (locationArray.length == 0) {
        return;
    }

    for (i = 0; i < locationArray.length; i++) {
        var previousEntry = $("<button>")
        // added bootstrap to the class for styling the buttons 
        previousEntry.addClass("btn btn-sm btn-light btn-outline-info")
        previousEntry.attr({
            "type": "button",
            "id": "perm-city-button"
        })

        city = previousEntry.text(locationArray[i])
        clickedButtonText = $(this).text();
        $(".input-group-append").prepend(previousEntry)
        var previousEntry = $("#perm-city-button")

        previousEntry.on("click", function (event) {
            event.preventDefault()
            var locationSearch = ($(this).text());
            searchFunction(locationSearch)
        })
    }

    $(".form-input").val("");
})