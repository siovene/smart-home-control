'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function() {
})

.controller('SensorsCtrl', function($scope, DataService, OICService) {
    $scope.sensors = OICService.sensors();
    $scope.$watch(function() { return OICService.sensors(); },
        function(newValue) {
            $scope.sensors = [];
            angular.forEach(newValue, function(data, path) {
                $scope.sensors.push({
                    path: path,
                    name: DataService.getSensorName(path),
                    slug: DataService.getSensorSlug(path),
                    icon: DataService.getSensorIcon(path),
                    data: data
                });
            });
        }, true);
})

.controller('SensorCtrl', function($scope, $stateParams, DataService, OICService) {
    var sensor = OICService.getSensorBySlug($stateParams.sensorSlug);

    if (sensor) {
        var path = sensor.id.resourcePath;

        $scope.title = DataService.getSensorName(path);
        $scope.sensor = {
            path: path,
            name: DataService.getSensorName(path),
            slug: DataService.getSensorSlug(path),
            icon: DataService.getSensorIcon(path),
            data: sensor
        };

        $scope.updateSensor = function() {
            OICService.updateSensor($scope.sensor.data);
        };
    }
});
