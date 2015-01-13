var request = require('request');
var moment = require('moment')

module.exports = function Server(hackerDS) {
  var mySelf = this;
  
  mySelf.init = function(){
    console.log('init NVVDepartures module');
  };
  
  var trips = {
    "Linie 4 Richtung Heli": [
      ["Kassel Königsplatz", "Niederkaufungen Bahnhof"],
    ],
    "Linie 7 Richtung Bahnhof Wilhelmshöhe": [
      ["Kassel Lutherplatz", "Bahnhof Wilhelmshöhe"]
    ],
    "Linie 3 Richtung Druseltal": [
      ["Kassel Am Stern", "Kassel Druseltal"]
    ],
    "Linie 1 Richtung Wilhelmshöhe": [
      ["Kassel Königsplatz", "Kassel Wilhelmshöhe (Park)"]
    ],
    "Linie 1 Richtung Vellmar": [
      ["Kassel Am Stern", "Kassel Wiener Straße"]
    ],
    "Linie 18 19 Richtung Harleshausen Rasenallee Holländische Straße": [
      ["Kassel Erzbergerstraße", "Kassel Engelhardstraße"]
    ],
    "Andere": [
      ["Kassel Königsplatz", "Kassel Am Weinberg"]
    ]
  }
  
  hackerDS.on('nvvTrips', function (data) {

    for(var direction in trips){
      trips[direction].forEach(function (trip) {
        var from = encodeURIComponent(trip[0]);
        var to = encodeURIComponent(trip[1]);
        var nvvApiUrl = "http://localhost:3001/Trips?from="+from+"&to="+to;
        request(nvvApiUrl, function (err, res, body) {
          if(err) throw new Error(err);

          var now = new Date();
          var apiTrips = JSON.parse(body);
          apiTrips.times.forEach(function(t){
            var departure = new Date();
            departure.setHours(
              t.departure.hour,   // hours
              t.departure.minute, // minutes
              0,                  // seconds
              0);                 // milliseconds

            debugger;

            if(departure < now) return;
            if(t.lines.length > 1)return; // we only want direct connections

            var lineString = t.lines[0];
            var lineRegex = /(Tram|Bus|RT) (\d+)/
            var lineMatch = lineString.match(lineRegex);
            if(!lineMatch) return;
            var transportationType = lineMatch[1].toLowerCase();
            var line = lineMatch[2];

            var arrival = moment(departure)
              .add('h', t.duration.hours)
              .add('m', t.duration.minutes)
            
            var newTrip = {
              type: transportationType,
              from: apiTrips.from,
              to: apiTrips.to,
              line: line,
              departure: departure,
              arrival: arrival,
              direction: direction
            };

            hackerDS.display.send("newTrip", JSON.stringify(newTrip));
          });
        });
      });
    }
  });
};
