var request = require('request');

module.exports = function Server(hackerDS) {
  var mySelf = this;
  
  mySelf.init = function(){
    console.log('init hello world module');
  };
  
  var trips = [
      ["Am Stern", "Kassel Wilhelmshöhe (Park)"],
      
      ["Am Stern", "Kaufungen-Papierfabrik Industriestraße"],
      ["Am Stern", "Helsa Bf"],
      ["Am Stern", "Hessisch Lichtenau Bürgerhaus"],
      
      ["Am Stern", "Kaufungen-Papierfabrik Industriestraße"],
    ];
  
  hackerDS.on('nvvTrips', function (data) {
    trips.forEach(function (trip) {
      var from = encodeURIComponent(trip[0]);
      var to =encodeURIComponent(trip[1]);
      var nvvApiUrl = "http://localhost:3001/Trips?from="+from+"&to="+to;
      request(nvvApiUrl, function (err, res, body) {
        if(err) throw new Error(err);

        var now = new Date();
        var apiTrips = JSON.parse(body);
        apiTrips.times.forEach(function(t){
          var departure = new Date();
          departure.setHours(t.departure.hour, t.departure.minute);

          if(departure < now) return;

          var lineString = t.lines[0];
          var lineRegex = /Tram ([1|3|4|5|6|7|8])/
          var lineMatch = lineString.match(lineRegex);
          if(!lineMatch) return;
          var line = lineMatch[1];

          var newTrip = {
            from: apiTrips.from,
            to: apiTrips.to,
            line: line,
            departure: departure
          };

          hackerDS.display.send("newTrip", JSON.stringify(newTrip));
        });
      });
    });
  });
};