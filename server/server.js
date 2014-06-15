var request = require('request');
var moment = require('moment')

module.exports = function Server(hackerDS) {
  var mySelf = this;
  
  mySelf.init = function(){
    console.log('init NVVDepartures module');
  };
  
  var trips = {
    "Linie 4 Richtung Heli": [
      ["Am Stern", "Kaufungen-Papierfabrik"],
      ["Am Stern", "Oberkaufungen Bahnhof"],
      ["Am Stern", "Helsa"],
      ["Am Stern", "Hessisch Lichtenau Bürgerhaus"],
    ],
    "Linie 4 Richtung Mattenberg": [
      ["Am Stern", "Mattenberg"],
    ],
    "Linie 1 Richtung Wilhelmshöhe":[
      ["Am Stern", "Kassel Wilhelmshöhe (Park)"]
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
            var lineRegex = /Tram ([1|3|4|5|6|7|8])/
            var lineMatch = lineString.match(lineRegex);
            if(!lineMatch) return;
            var line = lineMatch[1];

            var arrival = moment(departure)
              .add('h', t.duration.hours)
              .add('m', t.duration.minutes)
            
            var newTrip = {
              type: "tram",
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
