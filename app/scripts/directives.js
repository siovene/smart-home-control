'use strict';

angular.module('starter.directives', [])

.directive('sensorItem', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: 'templates/sensor-item.html'
    };
})

.directive('sensorUi', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-ui.html',
        link: function(scope, element, attributes) {
            element.addClass('sensor-ui');
        }
    };
})


// ============================
// Individual sensor directives
// ============================

.directive('sensorFan', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-fan.html'
    };
})

.directive('sensorGas', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-gas.html'
    };
})

.directive('sensorLed', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-led.html'
    };
})

.directive('sensorTemperature', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-temperature.html'
    };
})

.directive('sensorSolar', function() {
    return {
        restrict: 'AE',
        templateUrl: 'templates/sensor-solar.html'
    };
});
