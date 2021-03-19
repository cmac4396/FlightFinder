QUnit.module('formatDate', function () {
    QUnit.test('test formatDate', function (assert) {
        assert.equal(formatDate(new Date('December 17, 1995')), '1995-12-17');
        assert.equal(formatDate(new Date(null)), "1970-01-01");
    });
});

QUnit.module('getSearchURL', function () {
    QUnit.test('test getSearchURL', function (assert) {
        assert.equal(getSearchURL({ locale: "en-US", country: "US", currency: "USD", currencySymbol: "$" },
            "BOS-sky", "LAX-sky", "2021-05-02", "2021-05-09"),
            "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/"
            + "US/USD/en-US/BOS-sky/LAX-sky/2021-05-02?inboundpartialdate=2021-05-09");
        assert.equal(getSearchURL({ locale: "en-US", country: "US", currency: "USD", currencySymbol: "$" },
            null, "LAX-sky", "2021-05-02", "2021-05-09"),
            "");
    });
});

QUnit.module('priceSort', function () {
    QUnit.test('test priceSort', function (assert) {
        quotes = [{ MinPrice: 1 }, { MinPrice: 10 }, { MinPrice: 5 }, { MinPrice: 6 }, { MinPrice: 1 },
        { MinPrice: 2 }, { MinPrice: 1 }, { MinPrice: 6 }, { MinPrice: 7 }, { MinPrice: 6 }];
        sortedQuotesAscending = [{ MinPrice: 1 }, { MinPrice: 1 }, { MinPrice: 1 }, { MinPrice: 2 }, { MinPrice: 5 },
        { MinPrice: 6 }, { MinPrice: 6 }, { MinPrice: 6 }, { MinPrice: 7 }, { MinPrice: 10 }];
        sortedQuotesDescending = [{ MinPrice: 10 }, { MinPrice: 7 }, { MinPrice: 6 }, { MinPrice: 6 }, { MinPrice: 6 },
        { MinPrice: 5 }, { MinPrice: 2 }, { MinPrice: 1 }, { MinPrice: 1 }, { MinPrice: 1 }];
        assert.propEqual(priceSort(quotes, "true"), sortedQuotesAscending);
        assert.propEqual(priceSort(quotes, "false"), sortedQuotesDescending);
        assert.propEqual(priceSort([]), [])
    });
});

QUnit.module('displayPreferredDeal', function () {
    QUnit.test('test displayPreferredDeal', function (assert) {
        flightData = {
            Carriers: [{ CarrierId: 0, Name: "Carrier0" }, { CarrierId: 1, Name: "Carrier1" }, { CarrierId: 2, Name: "Carrier2" },
            { CarrierId: 3, Name: "Carrier3" }, { CarrierId: 4, Name: "Carrier4" }],
            Quotes: [{ Direct: "true", MinPrice: 624, OutboundLeg: { CarrierIds: [3] } },
            { Direct: "false", MinPrice: 752, OutboundLeg: { CarrierIds: [2] } },
            { Direct: "false", MinPrice: 573, OutboundLeg: { CarrierIds: [0] } }
            ]
        };
        var deal0 = '<div class="card center">'
            + '<div class="card-body row">'
            + '<div class="col">'
            + '<p class="results">Carrier3</p>'
            + '<p class="results">Non-stop</p>'
            + '<p class="results">$ 624</p>'
            + '</div>'
            + '<div class="col">'
            + '<img class="float-right" src="images/star3.gif" width="50" height="50">'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<br>';
        var deal2 = '<div class="card center">'
            + '<div class="card-body row">'
            + '<div class="col">'
            + '<p class="results">Carrier0</p>'
            + '<p class="results">1+ stops</p>'
            + '<p class="results">$ 573</p>'
            + '</div>'
            + '<div class="col">'
            + '<img class="float-right" src="images/star3.gif" width="50" height="50">'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<br>';
        assert.equal(displayPreferredDeal("$", flightData, 0), deal0);
        assert.equal(displayPreferredDeal("$", flightData, 2), deal2);
    });
});

QUnit.module('displayDeal', function () {
    QUnit.test('test displayDeal', function (assert) {
        flightData = {
            Carriers: [{ CarrierId: 0, Name: "Carrier0" }, { CarrierId: 1, Name: "Carrier1" }, { CarrierId: 2, Name: "Carrier2" },
            { CarrierId: 3, Name: "Carrier3" }, { CarrierId: 4, Name: "Carrier4" }],
            Quotes: [{ Direct: "true", MinPrice: 624, OutboundLeg: { CarrierIds: [3] } },
            { Direct: "false", MinPrice: 752, OutboundLeg: { CarrierIds: [2] } },
            { Direct: "false", MinPrice: 573, OutboundLeg: { CarrierIds: [0] } }
            ]
        };
        var deal0 = '<div class="card center">'
            + '<div class="card-body">'
            + '<p class="results">Carrier3</p>'
            + '<p class="results">Non-stop</p>'
            + '<p class="results">$ 624</p>'
            + '</div>'
            + '</div>'
            + '<br>';
        var deal2 = '<div class="card center">'
            + '<div class="card-body">'
            + '<p class="results">Carrier0</p>'
            + '<p class="results">1+ stops</p>'
            + '<p class="results">$ 573</p>'
            + '</div>'
            + '</div>'
            + '<br>';
        assert.equal(displayDeal("$", flightData, 0), deal0);
        assert.equal(displayDeal("$", flightData, 2), deal2);
    });
});

QUnit.module('getCarrierName', function () {
    QUnit.test('test getCarrierName', function (assert) {
        carriers = [{ CarrierId: 0, Name: "Carrier0" }, { CarrierId: 1, Name: "Carrier1" }, { CarrierId: 2, Name: "Carrier2" },
        { CarrierId: 3, Name: "Carrier3" }, { CarrierId: 4, Name: "Carrier4" }];
        assert.equal(getCarrierName(carriers, 0), "Carrier0");
        assert.equal(getCarrierName(carriers, 4), "Carrier4");
        assert.equal(getCarrierName(carriers, 5), "Carrier Not Found");
    });
});

QUnit.module('getFlightStatus', function () {
    QUnit.test('test getFlightStatus', function (assert) {
        assert.equal(getFlightStatus("true"), "Non-stop");
        assert.equal(getFlightStatus("false"), "1+ stops")
    });
});