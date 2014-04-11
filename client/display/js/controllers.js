function todayAt(hour, minute){
    var today = new Date();
    today.setHours(hour, minute);
    return today;
}

function getMinutesBetween(date1, date2){
    var diffMs = date1 - date2;
    return Math.floor(diffMs/1000/60);
}

function createTrip(type, line, from, to, departure){
    var res = {
        type: type,
        line: line,
        from: from,
        to: to,
        departure: departure,
    };
    
    return res;
}

function DepatureController($scope){
    $scope.trips = [
        createTrip("tram", 3, "Königsplatz", "Oberkaufungen", todayAt(23,30)),
        createTrip("tram", 7, "Königsplatz", "Oberkaufungen", todayAt(23,45)),
        createTrip("bus", 2, "Königsplatz", "Oberkaufungen", todayAt(23,59)),
    ];
    
    function updateTrips(trips){
        var now = new Date();
        
        var toBeRemoved = [];
        trips.map(function (trip) {
            var minutesUntilDeparture = trip.minutesUntilDeparture = getMinutesBetween(trip.departure, now);
            
            if(minutesUntilDeparture <= 0){
                toBeRemoved.push(trip);
                return;
            }
            
            var green = "progress-bar-success";
            var yellow = "progress-bar-warning";
            var red = "progress-bar-danger";
            
            var progressCssClass;
            if(minutesUntilDeparture >= 30){
                progressCssClass = green;
            } else if(minutesUntilDeparture >= 10){
                progressCssClass = yellow;
            } else {
                progressCssClass = red;
            }
            trip.progressCssClass = progressCssClass;
            
            var percentage = (1 - minutesUntilDeparture / 60) * 100;
            trip.percentage = percentage;
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
}

DepatureController.$inject = ["$scope"];