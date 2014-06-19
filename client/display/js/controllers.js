function getMinutesBetween(date1, date2){
    var diffMs = date1 - date2;
    return Math.floor(diffMs/1000/60);
}

function compareProperties(obj1, obj2, props){
  for(var i in props){
    var prop = props[i];

    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if(JSON.stringify(val1) !== JSON.stringify(val2)) {
      return false;
    }
  }

  return true;
}

function DepatureController($scope){

    $scope.trips = [];

    nvvTrips.registerNewTripHandler(function (trip) {
      $scope.$apply(function () {

        trip.departure = new Date(trip.departure);
        trip.arrival = new Date(trip.arrival);

        var doesContain = function(longer, shorter){
          return shorter.line === longer.line &&
                 shorter.from === longer.from &&
                 shorter.direction === longer.direction &&
                 shorter.departure.valueOf() === longer.departure.valueOf() &&
                 shorter.arrival.valueOf() < longer.arrival.valueOf();
        };

        // remove already contained
        var toBeRemoved = $scope.trips.filter(function(t){
          return doesContain(trip, t);
        });

        toBeRemoved.forEach(function(t){
          var index = $scope.trips.indexOf(t);
          $scope.trips.splice(index,1);
        });

        var anyContainsCurrent = $scope.trips.some(function(t){
          return doesContain(t, trip);
        });

        var containsTrip = $scope.trips.some(function(t){
          return compareProperties(trip, t,
            ['line', 'from', 'direction', 'departure', 'arrival']);
        });

        if(!anyContainsCurrent && !containsTrip){
          $scope.trips.push(trip);
        }
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

        toBeRemoved.map(function (trip) {
            $scope.trips.splice($scope.trips.indexOf(trip), 1);
        });
    }
    
    setInterval(function() {
        $scope.$apply(function () {
            updateTrips($scope.trips);
        });
    }, 1000 * 30);
    
    updateTrips($scope.trips);
    nvvTrips.requestTrips();

    // query the server for new trips
    // every minute
    setInterval(function(){
      nvvTrips.requestTrips();
    }, 1000 * 60);
}

DepatureController.$inject = ["$scope"];