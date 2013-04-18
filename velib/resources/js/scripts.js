// Station ids
var station_ids = [ 10042 ];

// Velib controller
function VelibCtrl($scope, $http) {

    // List of the available stations
    $scope.stations = [
        { id: 10042, address: "52 rue d'Enghien", available: "X", free: "X", class: "" },
        { id: 9012, address: "3 rue rougemont", available: "X", free: "X", class: "" },
        { id: 9106, address: "3 rue boudreau", available: "X", free: "X", class: "" },
        { id: 9032, address: "12 rue des mathurins", available: "X", free: "X", class: "" },
        { id: 9033, address: "45 rue caumartin", available: "X", free: "X", class: "" }
    ]

    // Force data refresh
    $scope.refresh = function(force_refresh) {
        // Hide dates and show wait imgs
        $(".date").hide();
        $(".wait").show();
        // For each station
        for(var i=0 ; i<$scope.stations.length ; i++) {
            // Get the current station
            var station = $scope.stations[i];
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

    // Load data at startup
    $scope.refresh(false);
}