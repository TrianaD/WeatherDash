
$(document).ready(function () {



    // when submit run function to obtain data and apply 
    $("#searchbtn").on("click", (event) => {
        event.preventDefault();
        obtainCity();
        search();
        $("#input-city").val("");
        listCities();
    });

    // variables for city

    var city = document.querySelector('#input-city').value;
    var cities;


    // recent search loaded from local storage

    function recentSearch() {
        var lastSearch = localStorage.getItem("recent");
        if (lastSearch) {
            city = lastSearch;
            search();

        } else {
            // placeholder if nothing is searched
            city = "Phoenix";
            search();
        }
    }

    recentSearch(city)


    // data in local storage loaded
    function recentCities() {
        var recentCities = JSON.parse(localStorage.getItem("cities"));

        if (recentCities) {
            cities = recentCities;

        } else {
            cities = [];
        }
    }

    recentCities()

    function saveLocally() {
        localStorage.setItem("recent", city);
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }

    function obtainCity() {
        city = $("#input-city").val();
        if (city && cities.includes(city) === false) {
            saveLocally();
            console.log(city);
            return city;


        } else if (!city) {
            alert("Please try again, city not recognized")
        }
    }

    // get date

    var now = moment().format("l");

    // place dates in forecast

    var day1 = moment().add(1, "days").format("l");
    var day2 = moment().add(2, "days").format("l");
    var day3 = moment().add(3, "days").format("l");
    var day4 = moment().add(4, "days").format("l");
    var day5 = moment().add(5, "days").format("l");




    function search() {
        // https://api.openweathermap.org/data/2.5/weather?    lat={lat}&lon={lon}   &appid={API key}
        // city= "SanDiego";

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=51ec19643a468852940c0536a555de35";
        var coords = [];

        $.ajax({
            url: queryURL,
            method: "GET",


        }).then(function (response) {

            coords.push(response.coord.lat);
            coords.push(response.coord.lon);
            var cityName = response.name;
            var cityTemp = response.main.temp;
            var cityHumidity = response.main.humidity;
            var cityWind = response.wind.speed;

            var icon = response.weather[0].icon;
            // console.log(icon);
            var iconurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            $("#weathericon").attr('src', iconurl);
            $("#city-name").html(cityName + "" + "(" + now + ")");
            $("#temp").text("Current Temp (F): " + cityTemp.toFixed(1));
            $("#humidity").text("Humidity: " + cityHumidity + "%");
            $("#wind-speed").text("Wind Speed: " + cityWind + "mph");
            $("#date1").text(day1);
            $("#date2").text(day2);
            $("#date3").text(day3);
            $("#date4").text(day4);
            $("#date5").text(day5);
    

          getCoord(response.coord.lat, response.coord.lon);
        });

        //5-day forecast data in content containers
        function getCoord(lat, lon) {
            var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430";

            $.ajax({
                url: queryURL2,
                method: "GET",
            }).then(function (response) {



                //Temp
                var day1temp = response.daily[1].temp.max;
                var day2temp = response.daily[2].temp.max;
                var day3temp = response.daily[3].temp.max;
                var day4temp = response.daily[4].temp.max;
                var day5temp = response.daily[5].temp.max;
                $("#day1-temp").text("Temp(F):" + " " + day1temp.toFixed(1));
                $("#day2-temp").text("Temp(F):" + " " + day2temp.toFixed(1));
                $("#day3-temp").text("Temp(F):" + " " + day3temp.toFixed(1));
                $("#day4-temp").text("Temp(F):" + " " + day4temp.toFixed(1));
                $("#day5-temp").text("Temp(F):" + " " + day5temp.toFixed(1));


                //Humidity 
                var day1hum = response.daily[1].humidity;
                var day2hum = response.daily[2].humidity;
                var day3hum = response.daily[3].humidity;
                var day4hum = response.daily[4].humidity;
                var day5hum = response.daily[5].humidity;
                $("#day1-humidity").text("Humidity:" + " " + day1hum + "%");
                $("#day2-humidity").text("Humidity:" + " " + day2hum + "%");
                $("#day3-humidity").text("Humidity:" + " " + day3hum + "%");
                $("#day4-humidity").text("Humidity:" + " " + day4hum + "%");
                $("#day5-humidity").text("Humidity:" + " " + day5hum + "%");


                //Icon
                var icon1 = response.daily[1].weather[0].icon;
                var icon2 = response.daily[2].weather[0].icon;
                var icon3 = response.daily[3].weather[0].icon;
                var icon4 = response.daily[4].weather[0].icon;
                var icon5 = response.daily[5].weather[0].icon;
                $("#day1-icon").html(`<img src="http://openweathermap.org/img/wn/${icon1}@2x.png">`);
                $("#day2-icon").html(`<img src="http://openweathermap.org/img/wn/${icon2}@2x.png">`);
                $("#day3-icon").html(`<img src="http://openweathermap.org/img/wn/${icon3}@2x.png">`);
                $("#day4-icon").html(`<img src="http://openweathermap.org/img/wn/${icon4}@2x.png">`);
                $("#day5-icon").html(`<img src="http://openweathermap.org/img/wn/${icon5}@2x.png">`);


            });
        }
    }


    //function for recently searched cities 
    function listCities() {
        $("#cityList").text("");
        cities.forEach((city) => {
            $("#cityList").prepend("<tr><td>" + city + "</td></tr>");
        });
    }

    listCities();

    //table cities
    $(document).on("click", "td", (event) => {
        event.preventDefault();
        var listedCity = $(event.target).text();
        city = listedCity;
        search();
    });

});


