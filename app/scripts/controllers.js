'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, DataService, OCFService) {
    $scope.appData = {
        doneExploringSensors: false
    };

    $scope.$watch(function() { return OCFService.sensors; }, function() {
        if (OCFService.sensorsNumber() === DataService.knownSensorsNumber()) {
            $scope.appData.doneExploringSensors = true;
        } else {
            $scope.appData.doneExploringSensors = false;
        }
    }, true);
})

.controller('SensorsCtrl', function($scope, DataService, OCFService) {
    $scope.sensors = OCFService.sensors;
})

.controller('UpdateSensorCtrl', function($scope, OCFService) {
    $scope.onChange = function() {
        OCFService.updateSensor($scope.sensor.data);
    };
})

.controller('RGBLedCtrl', function($scope, OCFService) {
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
        OCFService.updateSensor($scope.sensor.data);
    }, true);
});
