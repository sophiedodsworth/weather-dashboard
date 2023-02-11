// declaring variables

var currentDate = moment().format("DD/MM/YYYY");
var APIKey = "d608178db60a39a8bbf9085b8ec701e5";

// declaring search function for when a user enters a city

function searchFunction(cityButtonText)
    
    var city = searchedCity || $('#search-input').val();
    
    var firstUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIKey;

// clearing before the new results are printed

$("#today").html("")
$("#forecast").html("")