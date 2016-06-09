'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, DataService, OICService) {
    $scope.appData = {
        doneExploringSensors: false
    };

    $scope.$watch(function() { return OICService.sensors(); },
        function() {
            if (OICService.sensorsNumber() === DataService.knownSensorsNumber()) {
                $scope.appData.doneExploringSensors = true;
            } else {
                $scope.appData.doneExploringSensors = false;
            }
        }, true);
})

.controller('SensorsCtrl', function($scope, DataService, OICService) {
    $scope.sensors = [];

    $scope.$watch(function() { return OICService.sensors(); },
        function(newValue) {
            $scope.sensors = [];
            angular.forEach(newValue, function(data, path) {
                $scope.sensors.push({
                    path: path,
                    info: DataService.getSensorInfo(path),
                    data: data
                });
            });
        }, true);
})

.controller('UpdateSensorCtrl', function($scope, OICService) {
    $scope.onChange = function() {
        OICService.updateSensor($scope.sensor.data);
    };
});
