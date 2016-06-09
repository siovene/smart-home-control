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
})

.controller('RGBLedCtrl', function($scope, OICService) {
    $scope.rgbModel = {
        r: $scope.sensor.data.properties.rgbValue.split(',')[0],
        g: $scope.sensor.data.properties.rgbValue.split(',')[1],
        b: $scope.sensor.data.properties.rgbValue.split(',')[2]
    };
    $scope.$watch('rgbModel', function(newValue) {
        $scope.sensor.data.properties.rgbValue =
            newValue.r + ',' + newValue.g + ',' + newValue.b;
        OICService.updateSensor($scope.sensor.data);
    });
});
