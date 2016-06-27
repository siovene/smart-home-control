'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, DataService, OICService) {
    $scope.appData = {
        doneExploringSensors: false
    };

    $scope.$watch(function() { return OICService.sensors; }, function() {
        if (OICService.sensorsNumber() === DataService.knownSensorsNumber()) {
            $scope.appData.doneExploringSensors = true;
        } else {
            $scope.appData.doneExploringSensors = false;
        }
    }, true);
})

.controller('SensorsCtrl', function($scope, DataService, OICService) {
    $scope.sensors = OICService.sensors;
})

.controller('UpdateSensorCtrl', function($scope, OICService) {
    $scope.onChange = function() {
        OICService.updateSensor($scope.sensor.data);
    };
})

.controller('RGBLedCtrl', function($scope, OICService) {
    // TODO: embed this in the directive

    var rgb = $scope.sensor.data.properties.rgbValue;

    $scope.color = { r: 0, g: 0, b: 0 };
    if (rgb !== undefined) {
        $scope.color = {
            r: rgb.split(',')[0],
            g: rgb.split(',')[1],
            b: rgb.split(',')[2]
        };
    }

    $scope.$watch('color', function() {
        $scope.sensor.data.properties.rgbValue = [
            $scope.color.r,
            $scope.color.g,
            $scope.color.b].join(',');
        OICService.updateSensor($scope.sensor.data);
    }, true);
});
