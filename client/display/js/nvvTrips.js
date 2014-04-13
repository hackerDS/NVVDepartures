window.nvvTrips = new (function(){
  var self = this;
  
  self.requestTrips = function () {
    hackerDS.server.send('nvvTrips');
  };
  
  var newTripHandler = [];
  self.registerNewTripHandler = function(handler){
    newTripHandler.push(handler);
  };
  
  hackerDS.on('newTrip', function (data) {
    var trip = JSON.parse(data);
    newTripHandler.forEach(function (handler) {
      handler(trip);
    });
  });
})();