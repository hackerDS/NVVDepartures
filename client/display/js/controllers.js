function getMinutesBetween(date1, date2){
    var diffMs = date1 - date2;
    return Math.floor(diffMs/1000/60);
}

function createTrip(type, line, from, to, departure){
  return {
      type: type,
      line: line,
      from: from,
      to: to,
      departure: departure,
    };
}

function DepatureController($scope){

    $scope.trips = [];

    nvvTrips.registerNewTripHandler(function (trip) {
      $scope.$apply(function () {
        $scope.trips.push(
          createTrip(
            "tram",
            trip.line,
            trip.from,
            trip.to,
            new Date(trip.departure)));
      });

      updateTrips($scope.trips);
    });

    function updateTrips(trips){
        var now = new Date();
        
        var toBeRemoved = [];
        trips.map(function (trip) {
            var minutesUntilDeparture = trip.minutesUntilDeparture = getMinutesBetween(trip.departure, now);
            
            if(minutesUntilDeparture <= 0){
                toBeRemoved.push(trip);
                return;
            }
            
            var onTimeCssClass = "progress-bar-success";
            var soonCssClass = "progress-bar-warning";
            var lateCssClass = "progress-bar-danger";
            
            var progressCssClass;
            if(minutesUntilDeparture >= 20){
                progressCssClass = onTimeCssClass;
            } else if(minutesUntilDeparture >= 10){
                progressCssClass = soonCssClass;
            } else {
                progressCssClass = lateCssClass;
            }
            trip.progressCssClass = progressCssClass;

          trip.percentage = (1 - minutesUntilDeparture / 40) * 100;
        });

        /*
        toBeRemoved.map(function (trip) {
            $scope.trips.splice($scope.trips.indexOf(trip), 1);
        });
        */
    }
    
    setInterval(function() {
        $scope.$apply(function () {
            updateTrips($scope.trips);
        });
    }, 1000 * 30);
    
    updateTrips($scope.trips);
    nvvTrips.requestTrips();
}

DepatureController.$inject = ["$scope"];