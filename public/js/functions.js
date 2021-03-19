// formats date into yyyy-mm-dd
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

// returns string that represents URL for searching for quotes 
function getSearchURL(searchParam, origin, destination, outbound, inbound) {
    if (origin == null || destination == null || outbound == null || inbound == null)
        return "";
    else
        return "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/"
            + searchParam.country + "/" + searchParam.currency + "/" + searchParam.locale + "/" + origin
            + "/" + destination + "/" + outbound + "?inboundpartialdate=" + inbound;
}

// displays results
function displayResults(results, flightData, currencySymbol, isAscending) {
    results.empty();
    if (flightData.Quotes.length > 0) {
        priceSort(flightData.Quotes, isAscending);

        for (index = 0; index < flightData.Quotes.length; ++index) {
            var flightCard;
            if (index < 3) {
                flightCard = displayPreferredDeal(currencySymbol, flightData, index);
            }
            else {
                flightCard = displayDeal(currencySymbol, flightData, index);
            }
            results.append(flightCard);
        }
    }
}

// sort list of places by price 
function priceSort(quotes, isAscending) {
    if (isAscending == "true")
        isAscending = true;
    else
        isAscending = false;
    console.log(quotes);
    console.log(isAscending);

    quotes.sort(function (a, b) {
        var result = 0;
        if (a.MinPrice > b.MinPrice)
            result = 1;
        if (b.MinPrice > a.MinPrice)
            result = -1;

        if (!isAscending)
            result = result * -1;

        return result;
    })

    console.log(quotes);
    return quotes;
}

// creates an HTML element for a top deal 
function displayPreferredDeal(currencySymbol, flightData, index) {
    var flightCard = '<div class="card center">'
        + '<div class="card-body row">'
        + '<div class="col">'
        + '<p class="results">' + getCarrierName(flightData.Carriers, flightData.Quotes[index].OutboundLeg.CarrierIds[0]) + '</p>'
        + '<p class="results">' + getFlightStatus(flightData.Quotes[index].Direct) + '</p>'
        + '<p class="results">' + currencySymbol + " " + flightData.Quotes[index].MinPrice + '</p>'
        + '</div>'
        + '<div class="col">'
        + '<img class="float-right" src="images/star3.gif" width="50" height="50">'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<br>';
    return flightCard;
}

// creates an HTML element for a regular deal 
function displayDeal(currencySymbol, flightData, index) {
    var flightCard = '<div class="card center">'
        + '<div class="card-body">'
        + '<p class="results">' + getCarrierName(flightData.Carriers, flightData.Quotes[index].OutboundLeg.CarrierIds[0]) + '</p>'
        + '<p class="results">' + getFlightStatus(flightData.Quotes[index].Direct) + '</p>'
        + '<p class="results">' + currencySymbol + " " + flightData.Quotes[index].MinPrice + '</p>'
        + '</div>'
        + '</div>'
        + '<br>';
    return flightCard;
}

// gets name of carrier given its ID and the list of Carriers 
function getCarrierName(carriers, carrierID) {
    for (var i = 0; i < carriers.length; ++i) {
        if (carrierID == carriers[i].CarrierId)
            return carriers[i].Name;
    }

    return "Carrier Not Found";
}

// returns string that represents flight status given Direct from list of Quotes
function getFlightStatus(isDirect) {
    if (isDirect == "true")
        return "Non-stop";
    else
        return "1+ stops";
}

// loads currency options into currencySelect dropdown 
function loadRestCurrencies(settings, currencySelect) {
    settings.url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies";

    if (currencySelect.find("option").length == 1) {  //Check condition here
        $.ajax(settings).done(function (response) {
            console.log(response);
            var currencies = response.Currencies;

            for (index = 0; index < currencies.length; ++index) {
                if (currencies[index].Code != "USD")
                    var currencyOption = '<option id="' + currencies[index].Symbol + '" value="' + currencies[index].Code + '">' + currencies[index].Code + " - " + currencies[index].Symbol + '</option>';

                currencySelect.append(currencyOption);
            }

        });
    }
}

// adds recommended locations using input from inputField into corresponding list of places
function addRecommendedPlaces(inputField, listPlaces, settings, classItem) {
    var inputValue = inputField.val();

    settings.url = "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" + inputValue;

    if (inputValue.length > 1) {
        $.ajax(settings).done(function (response) {
            var recommendedPlaces = response.Places;
            listPlaces.empty();

            for (index = 0; index < recommendedPlaces.length; ++index) {
                var recommendedPlace = '<li class="' + classItem + ' list-group-item list-group-item-action" id="' + recommendedPlaces[index].PlaceId + '">' + recommendedPlaces[index].PlaceName + '</li>';
                listPlaces.append(recommendedPlace);
            }
        });
    }

    listPlaces.show();
}
