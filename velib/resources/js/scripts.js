// Velib controller
function VelibCtrl($scope, $http) {

    // List of the available stations
    // Full list available here : http://www.velib.paris.fr/service/carto
    $scope.groups = [
        {
            name: "Data Publica",
            stations: [
                { id: 10042, address: "52 rue d'Enghien" },
                { id: 9012, address: "3 rue rougemont" }
            ]
        },
        {
            name: "Auber",
            stations: [
                { id: 9106, address: "3 rue boudreau" },
                { id: 9032, address: "12 rue des mathurins" },
                { id: 9033, address: "45 rue caumartin" }
            ]
        }
    ];

    // Init struct with default data
    for(var i=0 ; i<$scope.groups.length ; i++) {
        // Add a group id
        var group = $scope.groups[i];
        group.id = i + 1;
        // For each station, add default station data
        for(var j=0 ; j<group.stations.length ; j++) {
            var station = group.stations[j];
            station.available = "X";
            station.free = "X";
            station.date = "";
            station.class = "";
        }
    }

    // Force data refresh
    $scope.refresh = function(group_id, force_refresh) {
        // Hide dates and show wait imgs
        $("#group_" + group_id + " .date").hide();
        $("#group_" + group_id + " .wait").show();
        // For each group
        for(var i=0 ; i<$scope.groups.length ; i++) {
            // If this is the reached group
            if($scope.groups[i].id == group_id) {
                // For each station
                for(var j=0 ; j<$scope.groups[i].stations.length ; j++) {
                    // Get the current station
                    var station = $scope.groups[i].stations[j];
                    // Build URL, adding a timestamp to avoid cache from jsonproxy if refresh id needed
                    var url = "http://jsonproxy.appspot.com/proxy?url=http://www.velib.paris.fr/service/stationdetails/paris/" + station.id;
                    if(force_refresh) {
                        url += "?timestamp=" + new Date().getTime();
                    }
                    // Call JSON data
                    $http.jsonp(url, {
                        cache: !force_refresh,
                        station: station,
                        params: {
                            "callback": "JSON_CALLBACK"
                        }
                    }).success(function(data, status, headers, config) {
                        // Update data
                        config.station.available = data.station.available["$"];
                        config.station.free = data.station.free["$"];
                        config.station.date = data.station.updated["$"] * 1000;
                        // Show new date
                        config.station.class = "";
                        $("#wait_" + config.station.id).hide();
                        $("#date_" + config.station.id).show();
                    }).error(function(data, status, headers, config) {
                        // Show old date with an error flag
                        config.station.class = "error";
                        $("#wait_" + config.station.id).hide();
                        $("#date_" + config.station.id).show();
                    });
                }
            }
        }
    }

    // Load data at startup
    for(var i=0 ; i<$scope.groups.length ; i++) {
        $scope.refresh($scope.groups[i].id, false);
    }
}