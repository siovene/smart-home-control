'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $interval, DataService, OCFService, SettingsService) {
    var discoveryInterval = null;

    function beginContinuousDiscovery() {
        discoveryInterval = $interval(function() {
            OCFService.discover();
            $scope.appData.discovery.done = false;
            $scope.appData.discovery.continuous = true;
        }, 1000);
    }

    function suspendContinuousDiscovery() {
        if (discoveryInterval !== null) {
            $interval.cancel(discoveryInterval);
            $scope.appData.discovery.done = true;
            $scope.appData.discovery.continuous = false;
        }
    }

    function inDiscoveryLoop() {
        return discoveryInterval !== null;
    }

    SettingsService.init();

    $scope.appData = {
        discovery: {
            done: true,
            continuous: SettingsService.get('continuous-discovery')
        }
    };

    $scope.discover = function() {
        OCFService.discover();
    };

    $scope.$watch(function() { return OCFService.sensors; }, function() {
        if (OCFService.sensorsNumber() === DataService.knownSensorsNumber()) {
            suspendContinuousDiscovery();
            $scope.appData.discovery.done = true;
        } else {
            if ($scope.appData.discovery.continuous) {
                $scope.appData.discovery.done = false;
            }
        }
    }, true);

    $scope.$watch(function() { return SettingsService.settings; }, function() {
        $scope.appData.discovery.continuous = SettingsService.get('continuous-discovery');
        if ($scope.appData.discovery.continuous && !inDiscoveryLoop()) {
            beginContinuousDiscovery();
        } else if (!$scope.appData.discovery.continuous && inDiscoveryLoop()) {
            suspendContinuousDiscovery();
        }
    }, true);
})

.controller('SettingsCtrl', function($scope, SettingsService) {
    $scope.settings = SettingsService.settings;
    $scope.save = function() {
        SettingsService.save();
    };
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
